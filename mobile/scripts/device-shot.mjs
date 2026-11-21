#!/usr/bin/env node
// Bring the app on a running emulator/simulator to a reference state and screenshot it.
//
//   node scripts/device-shot.mjs android tab-home overlay-toast
//   node scripts/device-shot.mjs --platform android --ids tab-home,overlay-toast
//   node scripts/device-shot.mjs --platform android --area shell
// In a worktree run it through the shared-emulator lock: scripts/with-device.sh <port> node scripts/device-shot.mjs android <id>
// (this script never starts Metro and never touches host ports: it only talks to the device through adb).
//   node scripts/device-shot.mjs --platform android --all [--diff]
//   node scripts/device-shot.mjs --list
//
// A state is reached with deep links only (src/shell/deeplinks.ts). The links of each reference id
// are in scripts/shots/*.json (shell) and in `shots` folders under src/ (one map per area, owned by
// its workstream, e.g. src/screens/practice/shots/practice.json). Format:
//   { "area": "shell",
//     "shots": { "<reference id>": { "links": ["tab/home", { "link": "toast/Saved", "wait": 400 }],
//                                    "wait": 800, "regions": ["nav"], "note": "…" } } }
// `links` are written without the scheme. Every shot starts from the same prelude
// (reset; insets/zero; clock/<the reference pack's fixed time>), so shots do not depend on each other:
//   - insets/zero makes --sat/--sab 0, as in the reference capture. The app is laid out exactly like the
//     browser viewport and the OS bars are simply drawn over it (parity-diff masks those rows).
//   - the clock is pinned to 2026-10-24T09:41:00+05:30, the time the reference pack was captured at.
// After the last link the tool waits `wait` ms (default 900) and then until two consecutive
// screenshots are identical ("at rest"), up to 8 tries.
// Output: <repo>/parity/<platform>/<id>/shot.png and meta.json (git-ignored).
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PARITY, loadShotMaps, parseArgs } from './lib-parity.mjs';

const args = parseArgs(process.argv.slice(2));
const shots = loadShotMaps();
if (args.list) {
  for (const [id, s] of Object.entries(shots)) console.log(`${id}\t${s.area ?? ''}\t${s.file}`);
  process.exit(0);
}
// `device-shot.mjs android view-quiz view-lesson` is the same as `--platform android --ids view-quiz,view-lesson`
if (!args.platform && (args._[0] === 'android' || args._[0] === 'ios')) {
  args.platform = args._.shift();
  if (args._.length && !args.ids) args.ids = args._.join(',');
}
const platform = args.platform;
if (platform === 'ios' && process.env.PREPASSIST_ALLOW_IOS !== '1') {
  console.error('device-shot: iOS device runs are switched off (owner decision: iOS is verified by code only, no simulator commands). The iOS path is kept in this script; set PREPASSIST_ALLOW_IOS=1 to use it once that changes.');
  process.exit(2);
}
if (platform !== 'android' && platform !== 'ios') {
  console.error('usage: device-shot.mjs --platform android|ios (--ids a,b | --area <name> | --all) [--diff] [--no-prelude]');
  process.exit(2);
}
const APP_ID = 'com.prepassist.app';
const SCHEME = 'prepassist://';
const FIXED_CLOCK = '2026-10-24T09:41:00+05:30';
const PRELUDE = `reset;insets/zero;clock/${encodeURIComponent(FIXED_CLOCK)}`;
const ADB = process.env.ADB || path.join(process.env.ANDROID_HOME || '/opt/homebrew/share/android-commandlinetools', 'platform-tools', 'adb');
const sleep = ms => new Promise(r => setTimeout(r, ms));

function openLink(link) {
  const url = SCHEME + link;
  if (platform === 'android') {
    // the device shell needs the URL quoted: it contains ; & and ?
    const r = spawnSync(ADB, ['shell', `am start -W -a android.intent.action.VIEW -d '${url.replace(/'/g, "'\\''")}' ${APP_ID}`], { encoding: 'utf8' });
    if (r.status !== 0 || /Error/.test(r.stdout + r.stderr)) throw new Error(`adb am start failed for ${url}\n${r.stdout}${r.stderr}`);
  } else {
    // `xcrun simctl openurl` raises the system dialog "Open in PrepAssist?" and waits for a tap, so on
    // iOS the app is relaunched with the link as a launch argument instead (see src/shell/deeplinks.ts).
    spawnSync('xcrun', ['simctl', 'terminate', 'booted', APP_ID], { stdio: 'pipe' });
    execFileSync('xcrun', ['simctl', 'launch', 'booted', APP_ID, '-prepassistLink', link], { stdio: 'pipe' });
  }
}

function screenshot(file) {
  if (platform === 'android') {
    const png = execFileSync(ADB, ['exec-out', 'screencap', '-p'], { maxBuffer: 64 * 1024 * 1024 });
    fs.writeFileSync(file, png);
  } else {
    execFileSync('xcrun', ['simctl', 'io', 'booted', 'screenshot', '--type=png', file], { stdio: 'pipe' });
  }
}

async function atRest(file) {
  let prev = null;
  for (let i = 0; i < 8; i++) {
    screenshot(file);
    const cur = fs.readFileSync(file);
    if (prev && Buffer.compare(prev, cur) === 0) return { stable: true, tries: i + 1 };
    prev = cur;
    await sleep(250);
  }
  return { stable: false, tries: 8 };
}

let ids;
if (args.all) ids = Object.keys(shots);
else if (args.area) ids = Object.keys(shots).filter(id => shots[id].area === args.area);
else if (args.ids) ids = String(args.ids).split(',').map(s => s.trim()).filter(Boolean);
else {
  console.error('give --ids, --area or --all');
  process.exit(2);
}

let failed = 0;
for (const id of ids) {
  const def = shots[id];
  if (!def) {
    console.error(`  SKIP ${id}: no entry in any shots/*.json map`);
    failed++;
    continue;
  }
  const dir = path.join(PARITY, platform, id);
  fs.mkdirSync(dir, { recursive: true });
  let steps = [...(args['no-prelude'] ? [] : [{ link: PRELUDE, wait: 500 }]), ...def.links.map(l => (typeof l === 'string' ? { link: l } : l))];
  // iOS: one relaunch with the whole chain (links run in order in the same tick). `wait` between
  // links cannot be honoured there; a state that needs time between two links is not reachable on iOS
  // with this tool and must be reported as such.
  if (platform === 'ios') steps = [{ link: steps.map(s => s.link).join(';'), wait: def.iosLaunchWait ?? 3500 }];
  try {
    for (const s of steps) {
      openLink(s.link);
      await sleep(s.wait ?? 350);
    }
    await sleep(def.wait ?? 900);
    const file = path.join(dir, 'shot.png');
    const rest = await atRest(file);
    fs.writeFileSync(
      path.join(dir, 'meta.json'),
      JSON.stringify({ id, platform, takenAt: new Date().toISOString(), links: steps.map(s => SCHEME + s.link), atRest: rest, map: def.file, note: def.note ?? null }, null, 1),
    );
    console.log(`  shot ${platform}/${id}${rest.stable ? '' : '  (not at rest after 8 frames: ambient animation or still moving)'}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL ${id}: ${e.message}`);
  }
}
if (args.diff) {
  const r = spawnSync(process.execPath, [new URL('./parity-diff.mjs', import.meta.url).pathname, '--platform', platform, '--ids', ids.join(',')], { stdio: 'inherit' });
  process.exit(r.status || (failed ? 1 : 0));
}
process.exit(failed ? 1 : 0);
