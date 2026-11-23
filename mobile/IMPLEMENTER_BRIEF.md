# Brief for screen implementers (Phase 2)

You are one of six agents porting the screens of `PrepAssist.html` to plain React Native (Android and iOS from one codebase). Each agent owns one **area**. You work in your own git worktree; the shared shell is frozen.

## Read first (in this order)
1. `mobile/CONTRACT.md` — everything you may rely on and everything you must not touch. It is binding.
2. `IMPLEMENTATION_PLAN.md` sections 2, 2a, 2b and the "Owner decisions" table at the end.
3. `mobile/OWNERSHIP.json` — your routes, sheets, reference ids and verbs (filter by your area).
4. `reference/README.md` — how to read `reference/android/<id>/dom.json`, `html.txt`, `shot.png`.

## Binding rules (product owner)
1. **No UI/UX change.** Same layout, colours, type, spacing, copy, order, animation timing and easing as the HTML renders. Port from the computed styles in `reference/android/<id>/dom.json`; copy text from `html.txt` / the cited HTML lines. Never invent copy.
2. **No new components.** Every UI file starts with `// Source: PrepAssist.html L<from>-L<to> (...)`. Private sub-components live in your own folder and port an HTML element. No UI kits, no platform default UI, no states or gestures the HTML lacks.
3. **No guessing.** If something is missing (a shared component prop, a shell hook, a library feature, a design detail the reference does not show), stop that item and report exactly what is needed. Never stub something and call it done. Confirm library APIs against the installed type definitions.
4. **iOS is verified by code only** (owner has no keychain access): never run `run-ios`, `xcodebuild`, `pod install` or `xcrun simctl`. Write platform-neutral code; where iOS needs different values, read them from `reference/ios/<id>/dom.json`.
5. **Unsolved is reported as unsolved**, with what you tried and real error output.

## Environment
- Start every shell command with:
  `export PATH=$HOME/.nvm/versions/node/v22.16.0/bin:/opt/homebrew/bin:$PATH JAVA_HOME=/opt/homebrew/opt/openjdk@17 ANDROID_HOME=/opt/homebrew/share/android-commandlinetools`
- Your worktree needs dependencies: `cd mobile && ln -s <main checkout>/mobile/node_modules node_modules` (do NOT run `npm install`). The main checkout is `/Users/srinivasulu/Desktop/reactnative/PrepAssist`.
- Device checks (Android emulator, shared): only through `scripts/with-device.sh <your port> node scripts/device-shot.mjs android <id> [...] --diff`. Your port is given below. Keep each session short (others wait on the lock), batch several ids per session. Look at the `sbs` images yourself.
- Do not commit to other branches, do not merge, do not push. Commit your work on your own worktree branch as you go (small commits), message ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Priority (the owner wants it fast)
Work in this order and commit after each step so partial progress is usable:
1. The main-path screens of your area (listed in your assignment as "first").
2. All remaining routes and sheets of your area, so that `npm run audit:final` shows no placeholder in your folders.
3. All your verbs in `src/actions/<area>.ts` with their behaviour.
4. Device comparison of your main states on Android, fixing visible differences.

## Gate before you report
- `cd mobile && npm run check` passes (paste the tail).
- No `@placeholder` left in your area's files (paste `npm run audit` output).
- Every verb you own is handled (`actions.map.json` `native` field set to the handler file).
- Device: the states listed as "first" captured on Android with `--diff`; you looked at each `sbs` image.

## Final report (your last message is all the lead sees)
- Files ported, verbs implemented, reference ids checked on the device with scores and what you saw.
- Private copies of shared-in-HTML classes you made (so the lead can merge them later).
- Anything you needed from shared code (exact need).
- A required **blocked or unsolved** list (state explicitly if empty).
