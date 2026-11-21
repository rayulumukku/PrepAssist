#!/bin/zsh
# Runs a command with exclusive use of the Android emulator, serving THIS checkout's JavaScript.
#
# Several agents work in separate git worktrees but share one emulator. This script:
#   1. waits for a machine-wide lock (one device session at a time),
#   2. starts Metro from the current checkout on a private port,
#   3. points the installed app at that Metro (adb reverse device:8081 -> host:<port>) and restarts it,
#   4. runs the given command (for example the device screenshot script),
#   5. always stops Metro, restores the default port mapping and releases the lock.
#
# Usage (from mobile/):   scripts/with-device.sh <port> <command> [args...]
#   e.g.                  scripts/with-device.sh 8091 node scripts/device-shot.mjs android view-quiz
# Keep sessions short: other agents are waiting on the same lock.

set -u
PORT="${1:?usage: with-device.sh <port> <command...>}"; shift
[ "$#" -gt 0 ] || { echo "with-device: no command given" >&2; exit 2; }

# Agent shells may start with a bare PATH, so put Node (nvm, v22) and Homebrew on it explicitly.
export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:/opt/homebrew/bin:$PATH"
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
ADB="$ANDROID_HOME/platform-tools/adb"
APP_ID=com.prepassist.app
LOCK=/tmp/prepassist-device.lock
MOBILE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$(mktemp -t prepassist-metro)"
METRO_PID=""

cleanup() {
  [ -n "$METRO_PID" ] && kill "$METRO_PID" 2>/dev/null
  "$ADB" reverse tcp:8081 tcp:8081 >/dev/null 2>&1
  if [ -d "$LOCK" ] && [ "$(cat "$LOCK/owner" 2>/dev/null)" = "$$" ]; then rm -rf "$LOCK"; fi
}
trap cleanup EXIT INT TERM

# 1. lock (wait up to 30 minutes; a lock whose owner process is gone is stale and is taken over)
waited=0
until mkdir "$LOCK" 2>/dev/null; do
  owner="$(cat "$LOCK/owner" 2>/dev/null)"
  if [ -n "$owner" ] && ! kill -0 "$owner" 2>/dev/null; then rm -rf "$LOCK"; continue; fi
  sleep 5; waited=$((waited + 5))
  if [ "$waited" -ge 1800 ]; then echo "with-device: gave up waiting for the device lock (held by pid $owner)" >&2; exit 3; fi
done
echo "$$" > "$LOCK/owner"; echo "$MOBILE_DIR" > "$LOCK/checkout"

"$ADB" get-state >/dev/null 2>&1 || { echo "with-device: no Android emulator is running" >&2; exit 4; }

# 2. Metro for this checkout
( cd "$MOBILE_DIR" && exec npx react-native start --port "$PORT" ) >"$LOG" 2>&1 &
METRO_PID=$!
tries=0
until curl -s --max-time 2 "http://localhost:$PORT/status" | grep -q running; do
  sleep 2; tries=$((tries + 1))
  if ! kill -0 "$METRO_PID" 2>/dev/null || [ "$tries" -ge 60 ]; then
    echo "with-device: Metro did not start on port $PORT. Log tail:" >&2; tail -20 "$LOG" >&2; exit 5
  fi
done

# 3. point the app at it and restart; then make sure the bundle actually builds
"$ADB" reverse tcp:8081 "tcp:$PORT" >/dev/null
"$ADB" shell am force-stop "$APP_ID"
code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 300 "http://localhost:$PORT/index.bundle?platform=android&dev=true&minify=false")"
if [ "$code" != "200" ]; then
  echo "with-device: the JavaScript bundle failed to build (HTTP $code). Metro log tail:" >&2; tail -40 "$LOG" >&2; exit 6
fi
"$ADB" shell am start -n "$APP_ID/.MainActivity" >/dev/null
sleep 4

# 4. the command
"$@"
rc=$?

# surface JavaScript errors from this session, if any
"$ADB" logcat -d -t 300 2>/dev/null | grep -E 'ReactNativeJS: .*(Error|error:)|FATAL EXCEPTION' | tail -8
exit $rc
