# PrepAssist: HTML prototype to React Native — implementation plan

## 1. Context

`https://github.com/rayulumukku/PrepAssist` contains one file, `PrepAssist.html`: a high-fidelity phone prototype of a UPSC preparation app (10,791 lines, 1.2 MB, no backend, all data mocked in the file). The goal is to rebuild it as a real React Native app, with **no WebView**, and prove it on an emulator.

Two rules from the product owner govern everything below:

1. **Do not change any UI or UX.** The native app must look and behave like the HTML.
2. **Do not create any component that is not in the design.** Nothing gets invented.

The work is large (about 48 screens, 17 bottom sheets, 225 distinct actions), so it is executed by multiple agents working in parallel under one lead, with testing built into every phase.

The repo is already cloned at `/Users/srinivasulu/Desktop/reactnative/PrepAssist` (branch `main`, clean).

## 2. Ground rules and how they are enforced

| Rule | What it means in practice | How it is checked |
|---|---|---|
| No UI/UX change | Same layout, colours, type, spacing, copy, order, animation timing and easing as the HTML renders at phone width | Side-by-side screenshot diff of every screen against a browser capture of the HTML (section 8.6) |
| Styles come from the rendered result, not from reading CSS | The CSS is layered (AUTH v4 to v18, HOME v2 to v10, X-Ray v1 to v4). Later rules override earlier ones, so agents port the **computed** style captured from a real browser | Reference pack (Phase 1B) is the source of truth; reviewers compare against it |
| No new components | Every component file carries a `// Source: PrepAssist.html L<from>-L<to> (.css-class)` header naming the HTML element it ports | Audit script fails the build if a component has no Source header; a reviewer agent spot-checks that each header is real |
| Shared components only where the HTML shares a class | `.btn`, `.chip`, `.seg`, `.pcta` (pen CTA), `.fl` (field), `.circ`, `.ph` (page header), `.sheet`, `.scrim`, `.toast`, `.nav`, `.ask`, `svg.ic` | Same audit |
| No UI kits or platform default UI | No React Native Paper or similar. No default navigator header or tab bar. No native `Alert`, `ActivityIndicator`, pull-to-refresh, ripple, or haptics | ESLint `no-restricted-imports` list + review |
| No new states | No loading, error or empty states beyond those in the HTML (for example the search sheet's "Nothing found") | Review against reference pack |
| Gestures only where the HTML has them | Book page swipe, intro, Home hero, flashcard deck, article reader, compendium reader, X-Ray reader. Sheets close by scrim tap or close button only: the grab handle is decorative in the HTML, so there is no drag-to-dismiss. No swipe-back | Review |
| Copy and data are identical | All strings and mock data are extracted from the HTML by script, not retyped | Automated deep-equal test against the original JavaScript (section 8.2) |
| Icons are identical | The 100+ `<symbol>` icons are converted by script into the icon map | Generated file, never hand-edited |
| Simulated stays simulated | AI replies, uploads, payments, social sign-in and email verification keep the same canned behaviour. No backend is added | Review |

**Platform necessities.** These are not design changes, but they are listed so nothing is a surprise:

- The Android system back button does what the on-screen back button does (close sheet, else pop page), mirroring `back()` and `closeSheet()`. iOS has no system back button, and the iOS swipe-back gesture is turned off because the HTML has none.
- On both platforms the notch, status bar and home indicator areas are respected the way the HTML does with `env(safe-area-inset-*)`.
- Shadows and blur are drawn by each platform's own renderer, so they are tuned per platform to match the reference.
- The real OS status bar replaces the fake "9:41" bar. The HTML already hides that bar and the device frame on a real phone.
- The desktop-only jump panel (`#proto-panel`) is not shown, as on a real phone. Its jump targets become invisible deep links (`prepassist://jump/quiz`), mirroring the HTML's `location.hash` start, and are used only by tests.
- Hover styles (28 rules) have no equivalent on touch and are dropped. `:active` styles (15 rules) become pressed states.
- Text is locked to design sizes (`allowFontScaling={false}`) so layout matches the prototype exactly.
- `prefers-reduced-motion` is honoured, as the HTML does.

## 2a. Working agreement: no guessing, no silent workarounds

These apply to the lead and are copied verbatim into every sub-agent brief.

1. **Follow the plan.** Any deviation (different library, dropped screen, changed approach) is proposed to the owner first and done only after a yes. The fallbacks named in section 10 are proposals, not automatic.
2. **If something is needed at runtime, stop and ask.** When a step needs something that is missing (an App Store sign-in, an admin password, an approval prompt, a file or asset, a design detail the HTML does not define, a library feature that does not exist), work on that item stops and the owner is told exactly what is needed and why. No stub, fake data, placeholder UI or invented substitute is put in its place.
3. **No invented APIs.** A library call is used only after it is confirmed in that library's docs or its installed type definitions for the pinned version. If the docs and the installed version disagree, the installed version wins and the difference is reported.
4. **No invented design.** If the reference pack does not show how something looks or behaves, the owner is asked. Nothing is filled in from "what apps usually do".
5. **Unsolved is reported as unsolved.** If something cannot be made to work, the report says so plainly: what was tried, the actual error output, and what would unblock it. Nothing is marked done unless its checks actually ran and passed. A failing or skipped test is reported as failing or skipped.
6. **Other work continues.** A blocked item does not stop unrelated items; it is listed as open at the next gate.

Already known to need the owner: App Store sign-in for the Xcode download, the admin-password commands in Phase 0 step 7, and approval of the two `~/.zshrc` lines.

## 2b. Code patterns

The repo has no existing code or conventions (it holds one HTML file), so these are the standards, starting from the React Native Community CLI template defaults.

| Area | Pattern |
|---|---|
| Language and style | TypeScript strict, function components and hooks only, ESLint with `@react-native/eslint-config`, Prettier, no `any` without a comment explaining why |
| Structure | Feature folders under `screens/<area>/`. One screen per file, named after the HTML view it ports (`VIEWS.quiz` becomes `QuizScreen.tsx`) |
| Separation | Screens compose components and read state. Pure logic ported from the HTML's functions lives in plain `.ts` modules with unit tests. No business logic inside JSX |
| Styling | `StyleSheet.create` per component, values only from theme tokens that mirror the HTML's CSS variables (`--brand`, `--ink`, `--rule` and so on). No inline magic numbers for colours or fonts |
| State | Zustand store split into slices, one per workstream; components subscribe through selectors. State names mirror the prototype's `S` fields so the mapping stays traceable |
| Actions | One typed action per `data-act` verb, named the same as the verb, recorded in `actions.map.json` |
| Navigation | Typed route params; screens navigate through typed helpers, never by string literals scattered in components |
| Data | Read-only typed modules generated from the HTML; never edited by hand |
| Tests | Test files next to the code they cover; `testID` named `<screen>.<element>` |
| Traceability | Every component starts with a `// Source: PrepAssist.html L…` header |

## 3. Decisions assumed (change any before approving)

| Decision | Assumed |
|---|---|
| Platforms | **Android and iOS**, from one React Native codebase. Every screen is written once and runs on both |
| Android testing | Android emulator. This Mac has no Android SDK and no Java yet. The lead installs the Android toolchain with Homebrew (about 10 GB) |
| iOS testing | iOS Simulator, **in scope from the start** (owner's decision: download Xcode and do both platforms). Xcode is not installed today (only the command-line tools are). The lead downloads it in Phase 0 with the App Store command-line tool `mas`, which uses this Mac's existing App Store sign-in, so no Apple ID or password is ever given to the lead. The download (about 15 GB plus an iOS simulator runtime) runs in the background while Android work proceeds |
| What the owner must do for iOS | Three things the lead cannot do: be signed in to the App Store on this Mac; approve the download if macOS asks; and run the admin-password commands in Phase 0 step 7 (`sudo xcode-select`, `sudo xcodebuild -license accept`). The lead pauses and shows the exact commands when it reaches them |
| Framework | Plain React Native with TypeScript, created with the React Native Community CLI and built with `npx react-native run-android`, producing a real APK. **No Expo**: no Expo SDK, no `expo-*` packages, no Expo Go |
| Scope | Every screen, including the animated book opening and "One more step" |
| Location | `PrepAssist/mobile/` on a local branch `react-native`. `PrepAssist.html` is never modified. Nothing is pushed unless asked |
| Shell profile | Two lines (`ANDROID_HOME`, `JAVA_HOME`) added to `~/.zshrc`, shown to the owner first |

## 4. Source inventory (`PrepAssist.html`)

| Part | Lines | Notes |
|---|---|---|
| Main CSS | 12–4655 | Sections marked by comments; many superseded versions |
| Static markup | 4657–5108 | Icon sprite 4658–4724, book 4757–4864, intro 4867–4937, auth 4940–5015, verify 5018–5073, app shell 5076–5102 |
| Main script | 5110–8693 | Helpers 5111, state `S` 5126, i18n 5136, data 5142–5421, illustrations 5422–5613, book 5629–5894, intro 5895, auth 5918, verify 5970, app shell 5987, tabs 6022–6365, reels 6366, page stack 6469, `VIEWS` 6509–6660, quiz 6702, mains 6764, mentor 6833, sheets 6908, dispatcher `A` 6962 |
| Current + Profile v2 | 7075–7632 | Views 7468–7575, purchase sheet 7436, legal 7403 |
| Menu + toolkit | 7633–8229 | Registry `MT` 7669, views 7824–8025, compendium reader 8027 |
| Learn spotlight | 8230–8374 | `noteshub`, `xrayhome` |
| X-Ray v2 | 8375–8492 | Superseded by v4 |
| One more step | 8493–8680 | v4 is final; sound design 8509–8551 |
| Later style blocks | 8694–9718, 10075–10326, 10636–10743, 10779–10790 | `xray2`, `xray3`, `onestep`, `onestep4`, `ds-handoff`, `xray4`, `xray4-tidy`, `notes2`, `notes3`, `planthemes`, `cxcompact` |
| Later scripts | 9719–10073, 10327–10635, 10744–10778 | X-Ray v4, Notes Tracker v2, plan themes |

Totals: 5 stages, 6 tabs, about 42 pushed views, 17 sheets, 225 distinct `data-act` verbs, 144 keyframes, English and Hindi chrome strings, synthesised Web Audio, one canvas, one embedded JPEG, one remote image with a fallback.

Line ranges come from the survey. Each agent confirms the final effective definition against the reference pack before porting, because later blocks reassign `VIEWS.xray`, `VIEWS.tracker`, `VIEWS.upgrade` and others.

## 5. Target architecture

**Stack**

| Concern | Choice | Why |
|---|---|---|
| Runtime | React Native (current stable release, New Architecture), TypeScript strict, React Native Community CLI. No Expo | Real APK with its own `android/` and `ios/` projects |
| Stages and pages | React Navigation JS stack (`@react-navigation/stack`) with a custom card interpolator | Reproduces `.page` exactly: 420 ms slide, previous page shifted −18% and dimmed to 0.96, no native default transition |
| Tabs | Custom tab bar ported from `.nav`, six tabs | Default tab bar would be a design change |
| Animation, gestures | Reanimated, Gesture Handler | Keyframes, page turns, swipes |
| Vector | react-native-svg | Icons and inline illustrations |
| Canvas | React Native Skia | Dust motes, X-Ray lens |
| Gradient, blur | react-native-linear-gradient, @react-native-community/blur | CSS gradients, `backdrop-filter` |
| Fonts | Inter, Inter Tight, EB Garamond, Caveat, Noto Sans Devanagari as `.ttf` files in `mobile/assets/fonts`, linked into the native projects with `react-native.config.js` and `npx react-native-asset` | Same faces as the HTML |
| Deep links | React Navigation `linking` plus an intent filter in `AndroidManifest.xml` | Test-only jump targets |
| State | Zustand, one slice per workstream | Replaces global `S` |
| Sound | react-native-audio-api | Web Audio API on native, so the synthesis graph ports directly |
| Tests | tsc, ESLint, Jest, React Native Testing Library, Maestro, Playwright (reference capture only) | Section 8 |

Every library above is a plain React Native library with no Expo dependency. Versions are pinned to what the installed React Native release supports on the day of scaffolding, checked against each library's docs at that time.

**Packages**

| Shipped in the app | Used for |
|---|---|
| `react`, `react-native` | The app |
| `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs` | Navigation; stack transition and tab bar drawn from the design |
| `react-native-screens`, `react-native-safe-area-context` | Required by navigation; safe areas |
| `react-native-gesture-handler` | Swipes that exist in the design |
| `react-native-reanimated`, `react-native-worklets` | Animations |
| `react-native-svg` | Icons, illustrations |
| `@shopify/react-native-skia` | Dust particles, X-Ray lens |
| `react-native-linear-gradient`, `@react-native-community/blur` | Gradients, blur |
| `react-native-audio-api` | Synthesised sounds |
| `zustand` | State |

| Development and testing only | Used for |
|---|---|
| `typescript`, `@react-native/typescript-config`, `eslint`, `@react-native/eslint-config`, `prettier` | Code standards |
| `jest`, `@testing-library/react-native` | Unit and component tests |
| `react-native-asset` | Linking font files into the native projects |
| `playwright`, `pixelmatch`, `pngjs` (in `tools/reference/`) | Reference capture and screenshot comparison |
| Maestro, CocoaPods, `mas` (command-line tools) | Device flows, iOS dependencies, Xcode download |

Not used: Expo, WebView, UI kits, storage or networking libraries. Adding any package outside this list needs the owner's yes first (section 2a).

**Web to native mapping**

| HTML | React Native |
|---|---|
| Template strings into `innerHTML` | Typed function components |
| `data-act="verb:arg"` + one click listener | `onPress` calling typed store actions and navigation; every verb tracked in `actions.map.json` |
| `go(stage)` | Root stack: `Book`, `Intro`, `Auth`, `Verify`, `App` |
| `push()` / `back()` / `closeAllPages()` | Stack navigator; `focus` views hide the Ask button, as now |
| `openSheet()` / `closeSheet()` + `.scrim` | One `Sheet` host ported from `.sheet` (normal 88% max, tall 92%), 420 ms, scrim 300 ms |
| `toast()` | `Toast` host, 2,400 ms, same position above the nav |
| CSS variables, `data-plan` themes | Theme tokens in context: Classic Blue, Indigo Aurora, Midnight Gold |
| Keyframes, transitions | Reanimated with the same durations and the same `cubic-bezier(.2,.8,.2,1)` easing |
| 3D book (`preserve-3d`, camera loop) | Each leaf is its own view rotating about the spine; the camera is a transform on the parent |
| HTML inside content (articles, mentor replies, X-Ray `[[n|sentence]]` and `{{term}}`) | Converted to structured nodes, drawn by a `RichText` renderer that only emits elements the HTML uses |
| `env(safe-area-inset-*)` | react-native-safe-area-context |

**Project layout**

```
PrepAssist/
  PrepAssist.html              reference, never modified
  IMPLEMENTATION_PLAN.md       this plan
  tools/reference/             Playwright capture + data and icon extraction scripts
  reference/                   captured screenshots and computed styles (source of truth)
  mobile/
    src/
      theme/  data/  i18n/  store/slices/  navigation/
      components/              only ports of shared HTML classes
      illustrations/  audio/
      screens/{arrival,tabs,practice,study,library,account}/
      sheets/
    .maestro/                  emulator flows
    __tests__/
    actions.map.json           all 225 verbs: handler, owner, test
```

## 6. Multi-agent execution model

**Roles**

| Role | Count | Does |
|---|---|---|
| Lead (main session) | 1 | Phases 0 and 1A, owns all shared code, the emulator, merges and gates |
| Reference agent | 1 | Phase 1B: captures the HTML ground truth |
| Data agent | 1 | Phase 1C: extracts data, strings and icons by script |
| Workstream implementers | 6, in parallel | Phase 2: one area each (table below) |
| Parity reviewers | 6, one per workstream | Phase 3: fresh context, given the reference pack and emulator screenshots, never the implementer's notes |
| Test agent | 1 | Phases 2 to 4: Maestro flows and action coverage |
| Audit agent | 1 | Phase 4: "no new components" and "no UI change" audit |

About 17 agent runs, at most 6 at once. This is token-heavy by design; the alternative is the same phases run serially by the lead.

**Isolation and ownership**

- Each implementer works in its own git worktree on branch `ws/<name>`, cut from `react-native` after the Phase 1 gate.
- File ownership is disjoint: an implementer edits only `screens/<area>/`, `sheets/<area>/`, `store/slices/<area>.ts`, its Jest tests and its Maestro flows.
- Shared code (`theme`, `components`, `navigation`, `data`, `i18n`, `illustrations` shared items) is frozen after Phase 1. An implementer that needs a shared change reports it to the lead, who makes it once for everyone.
- Phase 1A registers every route with its param types and an empty placeholder (renders nothing), so implementers replace files and never touch the navigator. The final audit fails if any placeholder remains.
- The lead merges workstream branches into `react-native` in a fixed order at each gate.

**The emulator is a single shared resource.** With 16 GB of RAM, one virtual device runs. Implementers verify with `tsc`, ESLint and Jest in their worktree. Emulator builds, Maestro runs and screenshot capture happen on the merged branch, serialised by the lead.

**Brief given to each implementer**

1. The ground rules in section 2, the working agreement in section 2a and the code patterns in section 2b, verbatim.
2. Its screens, source line ranges and reference pack folder.
3. Its owned paths, and the frozen shared API (component props, theme tokens, store actions, route names).
4. Its rows of `actions.map.json` to complete.
5. Exit checklist: types clean, lint clean, Jest green, every screen has a Source header, no placeholder left.
6. A required "blocked or unsolved" list in its final report: anything it needed and did not have, anything it could not make work (with the real error output), and any difference from the reference it could not resolve. An empty list must be stated as empty. The lead relays every entry to the owner.

**Workstreams**

| ID | Area | Screens | Main sources |
|---|---|---|---|
| A | Arrival | Book opening, intro, sign in, create account, verify, paper sounds | HTML 4757–5073; JS 5629–5986, 5687–5734; CSS 111–1256, 2102–2250, 3702–3975 |
| B | Tabs | Home, Learn, Practice, Current, Menu, Profile, reels viewer | JS 6022–6468, 7186–7255, 7321–7374, 7698–7741, 8230–8374; CSS 1257–2101, 2272–2467, 2488–2623, 2687–2741, 2877–2976, 3976–4035, 4413–4594, `cxcompact` |
| C | Practice | Quiz, results, question bank, Prelims Question Bank, Test Series to Quiz, AI Prelims Engine, tests, history, Mains evaluation, Mains result, Answer Bank, answer, past evaluations | JS 6702–6832, 7827–7888, 8068–8095; CSS 2624–2686, 2742–2814, 4080–4162, 4369–4412 |
| D | Study, current, mentor | Lesson, courses, course, note, mindmap, AI Mindmaps, calendar, plan, article reader, edition calendar, saved articles, Ask PrepAssist chat, search sheet, base sheets | JS 6509–6701, 6833–6952, 7256–7320, 7907–7916, 7986–8024 |
| E | Notes and library | Notes hub, Notes System, compendium reader, Notes Tracker v2, folder, tracker note, X-Ray library and reader v4, Syllabus Matrix, upload, vault, Query your Database | JS 7889–8132, 9719–10073, 10327–10635; CSS 4163–4368, 4569–4655, `xray4`, `xray4-tidy`, `notes2`, `notes3` |
| F | Account and moments | Account, wallet, payments, plans and upgrade, plan themes, settings, system status, legal, purchase sheet, remaining sheets, One more step v4 with sound | JS 7389–7632, 8493–8680, 10744–10778; CSS `onestep4`, `planthemes` |

Lead-owned shell: root stack, tab bar `.nav`, page header `.ph`, Ask button `.ask`, `Toast`, `Sheet` and scrim, common type and buttons (CSS 79–110), the unified system (CSS 2977–3701, `ds-handoff`), i18n, base store.

## 7. Phases

Every phase ends with a gate. Work does not move on until the gate passes.

### Phase 0 — Toolchain and emulator (lead)

1. `brew install openjdk@17` and `brew install --cask android-commandlinetools`.
2. `sdkmanager`: platform-tools, emulator, the platform and build-tools the React Native release targets, an arm64 Google APIs system image, and the NDK version the build asks for.
3. Add `ANDROID_HOME` and `JAVA_HOME` to `~/.zshrc` after showing the two lines.
4. Create a Pixel 7 virtual device (412 dp wide, matching the reference viewport) and boot it with a visible window.
5. Create branch `react-native`, scaffold `mobile/` with `npx @react-native-community/cli init` (TypeScript template), run `npx react-native run-android`.
6. Copy this plan to `PrepAssist/IMPLEMENTATION_PLAN.md` and update the published plan page to match.
7. iOS toolchain, started at the same time as step 1 so the download overlaps the Android setup:
   1. `brew install mas`, then install Xcode from the App Store with `mas` (background download). If the App Store is not signed in or macOS asks for approval, the lead stops and tells the owner exactly what to click.
   2. Owner runs, with the admin password: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` and `sudo xcodebuild -license accept`.
   3. Lead runs `xcodebuild -runFirstLaunch`, downloads the iOS simulator runtime (`xcodebuild -downloadPlatform iOS`), installs CocoaPods (`brew install cocoapods`), runs `pod install` in `mobile/ios`, boots an iPhone simulator and runs `npx react-native run-ios`.

**Gate:** a blank app builds, installs and launches on **both** the Android emulator and the iOS Simulator. If the Xcode download is still running, Phase 1 starts on Android and the iOS half of this gate is closed as soon as Xcode is ready, before any Phase 2 workstream is merged.

### Phase 1 — Foundation (lead + 2 agents in parallel)

- **1A, lead: shell and contract.** Theme tokens and the three plan themes; fonts; shared components for the classes listed in section 2; root stack, custom tab bar, stack interpolator, `Sheet`, `Toast`, Ask button; store skeleton with one slice per workstream; all routes registered with placeholders; `RichText`; deep links; ESLint restrictions; the Source-header audit script.
- **1B, reference agent: ground truth.** A Playwright script opens `PrepAssist.html` at 412 × 915 (Pixel 7) and again at 393 × 852 (iPhone 15/16) and, for every stage, tab, view, sheet and notable state, saves a screenshot and a JSON dump of computed styles and box positions. It drives the page through the HTML's own hash jumps and `data-act` buttons. Output goes to `reference/<screen>/`. It also writes `reference/index.json`, the definitive screen list.
- **1C, data agent: content.** Scripts in `tools/reference/` extract every data constant (`SUBJ`, `ARTICLES`, `QUIZ`, `TOOLS`, `MT`, `PLANS`, `LEGAL`, `XR`, X-Ray v4 and Notes Tracker data, and the rest), the i18n table and all icon symbols into typed modules. A test evaluates the original script in a Node sandbox and deep-compares it with the modules. It also generates `actions.map.json` with all 225 verbs.

**Gate:** types and lint clean; data-equality test green; the shell on the emulator matches the reference for the tab bar, page header, sheet, toast and Ask button; reference pack complete; contract frozen.

### Phase 2 — Screens (6 implementers in parallel, test agent alongside)

Workstreams A to F as in section 6. The test agent writes Maestro flows per workstream as screens land.

**Gate per workstream:** exit checklist in section 6 complete; lead merges; app builds and launches; the workstream's Maestro flows pass on the emulator.

### Phase 3 — Parity review and fix (6 reviewers, then implementers)

1. The lead captures emulator screenshots of every screen on the merged build, using the same names as the reference pack.
2. A pixel-diff script produces a diff image and score per screen.
3. Each reviewer compares reference and native for its workstream and files defects: layout, colour, type, copy, order, missing or extra element, wrong transition, wrong action result.
4. Implementers fix; the lead re-captures; the reviewer re-checks only the fixed screens.

**Gate:** zero open defects, or each remaining difference written down with its cause for the owner to accept.

### Phase 4 — Integration, full test run and audit (lead, test agent, audit agent)

1. Full-journey Maestro suite on a clean install.
2. Action coverage: every verb in `actions.map.json` has a handler and a passing test.
3. Audit agent runs the two-rule audit: Source headers valid, no placeholder, no restricted import, no element absent from the reference.
4. Release-mode build to confirm it runs without the dev server.
5. Final report: screenshots, test results, accepted differences.

**Gate:** definition of done (section 9).

## 8. Testing

| # | Layer | Tool | Covers | Runs |
|---|---|---|---|---|
| 1 | Static | `tsc --noEmit` strict, ESLint | Types, restricted imports, unused code | Every agent, every gate |
| 2 | Data fidelity | Jest + Node sandbox | Extracted data, strings and icons equal the HTML's | Phase 1 onward |
| 3 | Logic | Jest | Ported pure functions: `pwStrength`, date helpers (L7091–7101), quiz timing and scoring, mentor `reply()` routing, search filter, current-affairs filters, syllabus status, purchase and credit maths | Each workstream |
| 4 | Component | React Native Testing Library | Auth validation, quiz answer flow, sheet open and close, language switch, save toggles | Each workstream |
| 5 | End to end | Maestro on the emulator | Arrival to Home; every tab; every Menu tool and back; quiz to results; Mains submit to result; mentor question; search; article save; purchase sheet; plan theme switch; Hindi switch; logout; Android back button | Phase 2 gates, Phase 4 |
| 6 | Visual parity | Playwright reference, `adb` screenshots, pixel diff, reviewer agent | Every screen and sheet at rest; key rest frames of the book opening and One more step | Phase 3, Phase 4 |
| 7 | Action coverage | Script over `actions.map.json` | All 225 verbs implemented and tested | Phase 4 |
| 8 | Two-rule audit | Audit script + audit agent | No invented component, no UI change | Phase 4 |

**Both platforms.** Layers 1 to 4 are platform-independent and run once. Layers 5 and 6 run on the Android emulator **and** the iOS Simulator at every Phase 2, 3 and 4 gate: the same Maestro flows on each, with Android screenshots compared against the 412 × 915 reference set and iOS screenshots against the 393 × 852 set. The Android back-button flow is replaced on iOS by a check that swipe-back does nothing. Running one Android emulator and one iOS simulator together fits in this Mac's 16 GB; if memory gets tight they are run one after the other.

Tests use `testID` only, which is invisible, so tests add nothing to the UI.

A pixel diff will never be zero because Android and Chrome rasterise fonts differently. Antialiasing-only differences are accepted. Any difference in layout, colour, copy or order is a defect.

## 9. Definition of done

- `npx react-native run-android` builds and launches on the emulator from a clean checkout.
- `npx react-native run-ios` builds and launches on the iOS Simulator, with the same end-to-end and parity results. If the Xcode install is blocked on an owner step, this item is reported as open, never as done.
- Every screen in `reference/index.json` exists natively and passes parity review.
- All 225 actions are implemented and covered.
- Layers 1 to 8 are green.
- No WebView and no Expo dependency in `package.json`; no placeholder; every component has a valid Source header.
- `PrepAssist.html` is unchanged.
- A final report lists screenshots, results and any accepted difference.

## 10. Risks

| Risk | Handling |
|---|---|
| Book opening: React Native has no `preserve-3d` | Rebuild with independent leaves; compare rest frames; any visible difference is reported, not hidden |
| Sound library trouble on the emulator or simulator | Stop and report to the owner with the error. Proposed fallback, only with the owner's yes: pre-rendered files of the same synthesised effects |
| Layered CSS makes the "real" style hard to read from source | Reference pack of computed styles is the source of truth |
| Font metrics differ between Chrome and Android | Bundled identical fonts; explicit line heights; remaining one-word wrap differences listed |
| Parallel agents collide | Disjoint file ownership, frozen shared contract, worktrees, fixed merge order |
| One emulator for many agents | Emulator work serialised through the lead |
| Library versions newer than assumed | Pin each library to the version that supports the installed React Native release at scaffold time; check docs then |
| Bare React Native means native setup is manual (fonts, gradient, blur, deep links, audio) | Done once by the lead in Phase 1A and verified on the emulator before any screen work starts |
| Scale | Phased gates; each merged workstream leaves a runnable app |
| Xcode install needs the owner (App Store sign-in, admin password) | Lead starts the download in Phase 0 and pauses with exact commands at each owner step; Android work continues meanwhile. No Android-only APIs are used without an iOS counterpart, so iOS never needs a rewrite |
| Xcode version too new or too old for the React Native release | Check the React Native docs for the supported Xcode version before installing; pin the React Native release to match |
| Platform rendering differences (shadows, blur, font rasterising) | Tuned per platform against the matching reference set |

## 11. First steps after approval

1. Phase 0: start the Xcode download (step 7.1) and the Android toolchain (steps 1 to 5) together; blank app on the Android emulator, then on the iOS Simulator.
2. Write `PrepAssist/IMPLEMENTATION_PLAN.md` from this plan and update the plan page at https://claude.ai/artifact/PfPT3s2FKeheG5o4G6Nviv.
3. Start Phase 1A, and launch the reference and data agents in parallel.
