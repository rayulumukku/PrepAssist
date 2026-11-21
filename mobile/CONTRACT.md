# PrepAssist mobile: the frozen contract for screen implementers

You port screens of `PrepAssist.html` into `mobile/`. The shell (stages, tabs, tab bar, page stack, sheet, toast, Ask button), the theme, the store skeleton, the action dispatcher and the shared components exist and are frozen. This file is everything you may rely on. Paths are relative to `mobile/`.

Line numbers such as `L6474` always mean `PrepAssist.html`.

## 1. What you may touch

| You own | Path |
|---|---|
| Your screens, tab panes, stages, overlays and private sub-components | `src/screens/<area>/**` |
| Your sheets | `src/sheets/<area>/**` |
| Your slice of the store | `src/store/slices/<area>.ts` |
| Your action handlers, shell hooks and cross-area functions | `src/actions/<area>.ts` |
| Your tests | next to the code, `*.test.ts(x)` |
| Your device-shot map | `src/screens/<area>/shots/<area>.json` |

`OWNERSHIP.json` lists every route key, its file and owner, the owner of each of the 286 reference ids, and the owner of each of the 236 verbs.

**Do not edit anything else**: `src/theme`, `src/components`, `src/shell`, `src/navigation`, `src/store/index.ts`, `src/store/slices/base.ts`, `src/actions/index.ts | base.ts | types.ts`, `src/data`, `src/i18n`, `src/icons`, `src/env`, `scripts`, `App.tsx`, `actions.map.json` (except the `native` and `test` fields of your own verbs), configs, native projects, `package.json`. If you need a change there, stop and report it to the lead with the exact need. Do not add packages. Do not add files to `src/components`.

A route is yours by replacing its placeholder file. Keep the file name and the default export shape; delete the `// @placeholder` line when the port is complete. `npm run audit:final` fails while any placeholder remains.

## 2. Theme (`src/theme`)

```ts
import { useTheme, usePlan, useInsets, palettes, metrics, durations, EASE, EASE_CSS, font, fontPx, em, cssColor, Txt } from '../../theme';
```

- **Tokens** mirror the CSS custom properties with their computed values: `var(--paper-2)` is `t.paper2`, `var(--brand-tint-2)` is `t.brandTint2`, `var(--ds-ink)` is `t.dsInk`. `const t = useTheme()` gives the palette of the current plan theme. Only `brand`, `brandDeep`, `brandTint`, `brandTint2`, `dsBrand`, `plA`, `plB`, `appBg` change with the plan; everything else is identical in all three, so static styles may use `palettes.free.ink` and the like.
- `usePlan()` returns `'free' | 'pro' | 'ultimate'` for rules written as `html[data-plan="…"] …` (`<style id="planthemes">`, L10636-L10743). The theme follows the base store field `planTheme` (the HTML's `html[data-plan]`), not `S.me.plan` directly: `planMagic` switches it 800 ms late (L10761). Call `setPlanTheme(p)` from `navigation/nav` where the HTML calls `setPlanTheme`.
- `metrics`: `navH` 64, the `--ds-*` sizes and radii, `bodySize` 15.5, `bodyLine` 22.475. `durations`: shell timings. `EASE` = `cubic-bezier(.2,.8,.2,1)` (`var(--ease)`), `EASE_CSS` = the keyword `ease`.
- `cssColor('var(--polity)', t)`: data such as `SUBJ[k].c` stores CSS variable references; this resolves them.
- `useInsets()` gives `{ sat, sab }` = `--sat` / `--sab`. The app draws edge to edge like the HTML (`viewport-fit=cover`); **add the inset exactly where the CSS does** (`padding: max(12px, var(--sat)) …`, `bottom: calc(var(--sab) + 12px)`), nowhere else. Do not use `SafeAreaView`.

### Fonts

`font(role, weight, italic?)` returns `{ fontFamily }` for one of the 18 bundled faces. Role = the FIRST family of the computed `font-family`:

| Computed first family | role | CSS variable |
|---|---|---|
| Inter (stack continues with "Noto Sans Devanagari") | `'sans'` | `--sans`, the body default |
| Inter (stack has no Noto) | `'read'` | `--read` |
| "Inter Tight" | `'serif'` | `--serif` |
| "EB Garamond" | `'book'` | `--book` |
| Caveat | `'hand'` | `--hand` |
| "Noto Sans Devanagari" | `'deva'` | class `.hi` |

Weights that are not loaded map the way the browser matched them:

| Family | Loaded | Asked for → face used |
|---|---|---|
| Inter | 400, 400 italic, 500, 600, 700 | 800, 900 → Bold (700) |
| Inter Tight | 500, 600, 700, 800 | 400 → Medium (500); 900 → ExtraBold |
| EB Garamond | 400, 400 italic, 500, 600 | 700 → SemiBold (600) |
| Caveat | 500, 600 | 400 → Medium (500) |
| Noto Sans Devanagari | 400, 500, 600 | 700 → SemiBold (600) |

Italic exists only for Inter 400 and EB Garamond 400. `font('book', 600, true)` returns the italic 400 face plus `fontWeight: '700'` (the browser synthesised bold; Android does too, iOS does not). Italic in any other family returns the upright face with `fontStyle: 'italic'` (a synthesised slant in the browser).

### `<Txt>`: all text goes through it

Never use React Native `Text` directly. `Txt` (a wrapper, not a visual component):

1. sets `allowFontScaling={false}`;
2. gives top-level text the body defaults (`body{font-size:15.5px;line-height:1.45}`, L33): Inter 400, 15.5 / 22.475, `--ink`. Nested `<Txt>` inherits from its parent `<Txt>` like an inline element;
3. draws Devanagari inside an Inter face with the matching Noto Sans Devanagari face (what the `--sans` stack does per glyph). Pass `systemDevanagari` when the CSS stack has no Noto (`--read`); non-Inter families are left alone automatically;
4. on Android snaps `fontSize` and `lineHeight` to the nearest whole device pixel (React Native rounds both UP otherwise: 14.5 dp became 39 px instead of 38.06 px and text ran up to 4 % wide);
5. on Android breaks lines greedily (`textBreakStrategy="simple"`) like a browser.

For `TextInput` set `allowFontScaling={false}` and `fontSize: fontPx(size)` yourself.

## 3. Translating the reference (`reference/android/<id>/dom.json`)

Port from computed styles, not from the CSS. Read CSS only for what a rest frame cannot show: `.on` / `:active` / `[disabled]` states, transitions, keyframes (`reference/runtime.json` has all 144).

| CSS (computed) | React Native |
|---|---|
| any `px` | the same number in dp, fractions kept (`14.5`, `21.025`) |
| `font-family`, `font-weight`, `font-style` | `...font(role, weight, italic)` |
| `font-size` + `line-height` | ALWAYS both: `fontSize`, `lineHeight` (the computed px) |
| `letter-spacing` | `letterSpacing`: the computed px (`em(size, .03)` if you start from em) |
| `text-transform`, `text-align` | the same |
| inline element (`span`, `small`, `b`, `i` without `display:block`) inside a block | its line box takes the **block's** line-height. `.sh-list .it small` is 12.5 px text in a 22.475 px line, not 18.125 |
| `display:flex` | `flexDirection: 'row'` must be written (RN defaults to column). `gap` works |
| `display:grid` | a row/column of fixed and `flex: 1` children; `place-items:center` → `alignItems` + `justifyContent: 'center'` |
| `border-*` | `borderWidth` / `borderColor` per side; `border-radius: 50%` → half the size |
| `box-shadow` | `boxShadow: '0px 12px 28px -10px rgba(27, 138, 211, 0.6)'` (several, comma separated, are fine) |
| `background-image: linear-gradient(...)` | `backgroundImage: 'linear-gradient(135deg, #5631D1, #B05BE0)'` |
| `filter: brightness(.96)` | a black layer at 4 % opacity over the element (identical arithmetic) |
| `backdrop-filter: blur(Npx)` + rgba background | `<Backdrop px={N} tint="rgba(...)" />` as the first child, content after it |
| `position:sticky; top:0` first child of a scroller | draw it above the ScrollView and pad the content (what the shell does for `.ph`) |
| `currentColor` on `svg.ic` | pass the element's text colour as `color` to `<Icon>` |
| `transition: <prop> <ms> <easing>` | `useTransition(target, ms, easeVar | easeCss)` from `src/shell/anim` + `useAnimatedStyle` |
| `@keyframes` | Reanimated (`withTiming` / `withRepeat` / `withSequence`) with the same durations and easing |
| `:hover` | nothing (no hover on touch) |
| `:active` | pressed state, with the rule's transition time |
| `%` of `#app` | `useAppSize()` from `src/shell/AppSize` gives `{ w, h }` |

`StyleSheet.absoluteFill` is an object in React Native 0.88 (`absoluteFillObject` no longer exists). `StatusBar` has no `translucent` prop any more.

### Worked example: `.sh-list .it` (the row in the Language sheet)

In `reference/android/sheet-language/dom.json`, the node with `cls: ["it"]` and its children say:

```
.it     display flex · align-items center · gap 12px · padding 13px 0 · border-bottom 1px solid rgb(232,235,240) · 372 x 70.48
  .ti   display grid (centred) · 38 x 38 · border-radius 10px · border 1px solid rgb(232,235,240) · background rgb(255,255,255)
    svg.ic 20 x 20, stroke rgb(37,39,45), stroke-width 1.6
  div   flex 1 · 322 x 43.48
    b     Inter 600 14.5px / 21.025px rgb(37,39,45) · block, 21.02 high
    small Inter 400 12.5px rgb(122,127,138) · inline → line box 22.475 (43.48 - 21.02)
```

becomes (`src/components/SheetList.tsx`):

```ts
it:    { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.rule },
ti:    { width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: C.rule, backgroundColor: C.sheet, alignItems: 'center', justifyContent: 'center' },
body:  { flex: 1, minWidth: 0 },
b:     { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025 },
small: { fontSize: 12.5, lineHeight: 22.475, color: C.muted },
```

rgb(232,235,240) is `--rule`, so the token is used. On the Android emulator this sheet matches the reference to about a pixel (`parity-diff` 1.3 %, all of it glyph edges).

## 4. Shared components (`src/components`, import from `'../../components'`)

Use them wherever the HTML uses the class. Do not restyle them from outside except through the listed props.

| Component | HTML class | Props |
|---|---|---|
| `Icon` | `svg.ic` / `ic('name')` | `name` (IconName), `size`=20, `color`=`--ink`, `strokeWidth`=1.6, `fill`='none', `style` |
| `Logo` | `<use href="#logo">` | `size` |
| `Btn` | `.btn` | `variant: 'brand'｜'ink'｜'line'｜'ghost'`, `small`, `wide`, `label`, `icon`, `children`, `onPress`, `disabled`, `style`, `textStyle`. Pressed: scale .98 over 150 ms |
| `Chip` | `.chip`, `.on` | `label`, `on`, `icon`, `onPress`, `style`, `onStyle`, `textStyle`, `onTextStyle` |
| `ChipGroup` | chips with `data-act="chipOne"` / `"chipToggle"` | `items`, `mode: 'one'｜'toggle'`, `initial`, `onChange`, chip style props. Keeps the element-local on-state the HTML keeps |
| `OptRow` | `.opt-row` | `children`, `style` |
| `Tag` | `.tag` (+ `.sw`) | `children` (text), `color`, `swatch`, `swatchStyle`, `style`, `textStyle` |
| `Eyebrow`, `FldLab`, `CmdGrp` | `.eyebrow`, `.fldlab`, `.cmd-grp` | `children` (text), `style` |
| `Circ` | `.circ` | `icon`, `label` (aria-label), `onPress`, `color`, `style` |
| `SheetFrame` | `sheetFrame(title, body)`: `.sh-grab`, `.sh-head`, `.sh-body` | `title`, `children`, `onClose`=closeSheet, `grabColor`, `bodyStyle`, `scrollProps`. `SheetGrab` is the handle alone |
| `SheetList`, `SheetListItem` | `.sh-list`, `.it`, `.ti` | item: `title`, `subtitle`, `icon` (name, `null` = empty tile, undefined = no tile), `iconColor`, `after`, `onPress`, `titleStyle` |
| `RatioBar` | `.rb`, `.tr` | `label`, `percent`, `value`, `color`, `labelWidth`=96, `valueWidth`=40 |
| `PageHeader` | `.ph` | drawn by the shell for non-focus views; you only supply `useTitle` / `Action` (section 6). `pageHeaderActStyle` is the 38 px `.act` box for your Action button |
| `Backdrop` | `backdrop-filter: blur()` | `px`, `tint`, `tone` |
| `PenCTA` | `.pcta` | `label`, `onPress`, `tone: 'plan'｜'free'｜'pro'`, `accessibilityLabel`, `style`. Always the parent's width x 62 |
| `Field` | `.fl` (floating label, `.eye`, +91 prefix) | TextInput props + `label`, `value`, `onChangeText`, `error`, `secureTextEntry`, `prefix`, `radius`, `focusColor`, `focusRingWidth`, `errorBorder`, `focusOverError`, `style`, `inputStyle`. The file header lists what arrival and account pass |
| `Fld` | `.fld` + `.inp` | TextInput props + `label`, `value`, `onChangeText`, `error`, `secureTextEntry`, `prefix`, `style`, `inputStyle` |
| `RichText` | HTML inside data strings; X-Ray `[[n|text]]`, `{{term}}` | `html` or `xray`, `styles` (map: `base b i p h4 h5 ul ol li marker insight term first olLi olMarker`), `onInsight`, `onTerm`, `activeInsight`, `insightActiveStyle`, `insightStyle`, `renderPin`, `renderBlock`, `renderSvg`, `bullet`. Margins come only from `styles`; they collapse the CSS way. Logic is in `richTextCore.ts` |

Every header comment names the HTML lines, the reference nodes the values came from, and the contextual CSS rules that are NOT in the shared component (you apply those through the style props).

**Shared in the HTML but not ported by the foundation** (see the foundation report): `.me-*` (me-page, me-card, me-grp, me-row, me-ri, me-chev, me-val, me-tier), `.tl-*` / `.tlp` / `.tq-*` / `.mu-h` / `.ch2` / `.sg2`, `.ar-*` reader chrome, `.cx-*`, `.pq-*`, `.by-*`, `.dl-*`, `.ld-*`, `.py-*`, `.sv-*`, `.mv-lab`, `.spin`, `.typing`, `.empty`, `.slot`/`.bx`/`.tm`, `.pg-hero`, `.sec`, `.why`, `.ptr`. Until the lead decides otherwise, port the ones you need privately inside your own folder with a Source header, and name them in your report so they can be merged into one shared copy.

## 5. Store (`src/store`)

One flat state like the prototype's `S`, with the same field names.

```ts
import { useStore, getS, setS } from '../../store';
const tab = useStore(s => s.tab);                    // components: always through a selector
const s = getS();                                    // handlers: read like `S`
setS({ fc: 2 });                                     // write
setS(s => ({ saved: new Set(s.saved).add(id) }));    // S.saved.add(id): pass NEW objects / arrays / Sets, never mutate
```

To add a field: declare it in the interface of `src/store/slices/<area>.ts` and seed it in `create<Area>Slice`. Retype seeded fields whose generated type is too narrow (`quiz: unknown`, `savedLinks: unknown[]`). Any area may read and write any field at run time; the slice file only says who declares it.

| `S` field | Slice |
|---|---|
| stage, tab, stack, lang, user, rendered | **base** (written only through `navigation/nav`; `lang` and `user` through your handlers) |
| intro, authMode, authTries · `SFX` | arrival |
| fcLang, fc, hero, toolGroup, revDone, ca, menuQ, reelSeen, learnF, px | tabs |
| quiz, mainsQ, pages, pqb, tq, mv, ab, mains | practice |
| saved, savedLinks, mlog, ctxOn, mctx, arSize, maps | study |
| syl, sylDone, up, vlt, qdb2, nsys, optional, folders, nsRead, nsSaved, nh, xr, xr2, x4, ntSort, _ntc, nn · `DOCS`, `FOLDERS`, `XSC`, `OPTIONALS`, `NT` | library |
| me · `STS` | account |

`S.heroTimer` is an interval id and is not state. The seven upper-case entries are data constants that handlers change; they are seeded as copies and must be replaced, never mutated in the generated modules. Base also holds the shell's DOM state: `planTheme`, `layer`, `toast`, `sheet`, `askMini`.

Clock: use `now()`, `nowMs()`, `today()`, `isoD()`, `parseD()` from `src/env/clock` instead of `new Date()` / `Date.now()` for anything shown, so tests can pin the reference time.

## 6. Navigation (`src/navigation/nav`)

```ts
import { go, setTab, push, back, closeAllPages, setTopArg, openSheet, closeSheet, sheetIsOpen, toast, setPlanTheme } from '../../navigation/nav';
```

| Helper | HTML | Notes |
|---|---|---|
| `go(stage)` | `go` L5616 | `'book'｜'intro'｜'auth'｜'verify'｜'app'`. Non-app stages remove all pages at once |
| `setTab(tab)` | `setTab` L6002 | closes all pages (animated) |
| `push('legal', 'terms')` | `push` L6474 | typed: `ViewArgs` in `navigation/routes.ts` says which views take an argument |
| `back()` | `back` L6488 + wrappers | runs the `beforeBack` / `afterBack` hooks |
| `closeAllPages(instant?)` | L6496 | |
| `setTopArg(arg)` | `p.arg = x` (L7605, L7628) | |
| `openSheet(key, { arg, tall })` | `openSheet(html, tall)` L6909 | `key` is a `SheetKey`; `arg` is one string handed to the sheet component; pass `tall` where the HTML passes `true` (`SHEET_TALL` lists them). Opening again replaces the content |
| `closeSheet()` | L6915 | |
| `toast(msg, icon = 'check')` | L5117 | `null` = no icon. Plain text only |

The page stack is a hand-built layer mirroring `#layer`, not `@react-navigation/stack` (the foundation report says why). Pages cover the tab bar and can be pushed over any stage.

### Registering a screen (replace the placeholder file, nothing else)

- **View** (`src/screens/<area>/<Name>Screen.tsx`): default-export a `ViewDef`:
  ```ts
  const view: ViewDef = { useTitle: arg => …, Action: MyActionButton, Screen: MyScreen };
  ```
  `Screen` gets `{ arg, entryKey }`. `focus`, `noAsk` and the page background are fixed per view in `VIEW_META` (`navigation/routes.ts`).
  - Non-focus view: the shell draws the `.ph` header and wraps `Screen` in the page scroller (`.page > .scroll`, padding-bottom 100). Render only `v.html`. `useTitle` is `v.title` (a hook: it may read the store); `Action` is `v.action`.
  - Focus view (article, upgrade, pqb, note2, quiz, xray, onestep): `Screen` is the whole page, including its own scroller and header.
- **Sheet** (`src/sheets/<area>/<Name>Sheet.tsx`): default-export a component taking `{ arg }`. Use `<SheetFrame title>` when the HTML uses `sheetFrame()`; otherwise start with `<SheetGrab />` and build the head yourself. The shell provides the sheet box (radius, shadow, 88 % / 92 % height, slide, scrim). A full-sheet background (`#sheet:has(.x4s)`) is an absolutely positioned first child.
- **Tab pane** (`src/screens/tabs/<Name>Tab.tsx`): default-export a component. Its root ScrollView is `.tabp > .scroll`:
  ```tsx
  const scroll = useTabScroll('home');           // from src/shell/tabScroll
  <ScrollView {...scroll} contentContainerStyle={{ paddingBottom: 96 }}>…</ScrollView>
  ```
  That hook is what drives the Ask button (mini after scrolling down past 120, full again on scrolling up) and lets `A.tab` reset the pane to the top. `scrollTab(tab, y, animated)` scrolls it from a handler. The pane's own background is yours.
- **Stage** (`src/screens/arrival/<Name>Stage.tsx`): default-export a component filling the stage. The shell does the `stageIn` fade.
- **Overlay** (`ReelViewerOverlay`, `PlanMagicOverlay`): always mounted in its z-layer; return `null` while closed and read your own slice for the open state.

Layer order, bottom to top: stages · pages · Ask button · scrim · reels viewer · sheet · toast · plan-change overlay.

## 7. Actions (`src/actions`)

```ts
import { act } from '../../actions';
<Pressable onPress={() => act('push:legal:terms')} />     // a raw data-act value, split at the FIRST colon only
act('mentorAsk', question);                               // or verb + argument
```

`act()` mirrors the dispatcher (L7061-L7068): the argument is a string or undefined; an unknown verb does nothing; return values are ignored. Every `data-act` in the HTML becomes an `act()` call with the same value.

Add a handler in `src/actions/<area>.ts`, named exactly like the verb, ported from the `handlerSource` lines in `actions.map.json`:

```ts
export const handlers: HandlerMap = {
  fcRate: r => { toast(r === 'got' ? 'Nice — next review in 6 days' : 'We’ll show this again tomorrow', r === 'got' ? 'check' : 'refresh'); setFc(getS().fc + 1); },
};
```

Only define verbs whose `owner` is your area (a Jest test fails otherwise). Base owns `jump tab push back tool sheet closeSheet toast chipToggle chipOne`. Things to know:

- `push:note:new` never pushes: base calls the `ntNew` verb (L10630).
- `tool:<id>` is the ORIGINAL `openTool` (L6954-L6960). The later reassignments of `openTool` are dead code and are not ported.
- Handlers that used the clicked element (`(x, el) => …`): pass an object as the third argument of `act(verb, arg, el)` and read it in your handler. For `chipOne` / `chipToggle` use `ChipGroup`.
- **Shell hooks**: export `hooks: ShellHooks` for the places the shell functions call into your area: `onStage` (`go`: `runBook`, `setIntro(0,true)`, auth/verify resets), `onRenderAll` (`initHero`), `onTab` (`animateHome`, `pxSpy`), `beforeBack` (onestep `stStop`), `afterBack` (quiz timer L6493, xray L10059), `onCloseAllPages` (quiz timer L6498).
- **Cross-area functions**: export `fns` for functions other areas call directly: `startQuiz(timed)` (practice), `openMentor(prefill?)` (study), `sfx(name)` (arrival). Callers use `fns.startQuiz?.(true)` from `'../../actions'`. To add one, merge into `CrossFns` from your own file (`declare module './types' { interface CrossFns { … } }`).
- Do not import `src/actions` from an action file's dependencies in a way that runs at module load (the registry imports your file).

## 8. Tests and device checks

- `npm run check` = typecheck + lint + Source-header audit + Jest. It must pass before you report.
- Jest tests sit next to the code. Pure logic ported from the HTML's functions goes in plain `.ts` modules with tests. Reset state with `resetStore()`; use `jest.useFakeTimers()` for timers.
- `testID` is `<screen>.<element>` (`quiz.submit`, `sheet.language.close`). The shell's own ids: `nav.<tab>`, `ask`, `scrim`, `sheet`, `toast`, `page.<view>`, `tab.<tab>`, `stage.<stage>`.
- Every UI file starts with `// Source: PrepAssist.html L<from>-L<to> (.class or function)`.

**Deep links** (`src/shell/deeplinks.ts`, scheme `prepassist://`, test only, chain with `;`): `jump/<target>`, `stage/<s>`, `tab/<t>`, `push/<view>/<arg>`, `sheet/<key>/<arg>`, `act/<verb>/<url-encoded arg>`, `lang/<en|hi>`, `plan/<free|pro|ultimate>`, `back`, `closeSheet`, `toast/<msg>/<icon>`, `ask/<full|mini>`, `insets/<zero|device>`, `clock/<ISO|device>`, `reset`.

**Device screenshots.** One emulator is shared: always go through the lead's lock script, which serves your worktree's JavaScript:

```
scripts/with-device.sh <port> node scripts/device-shot.mjs android <reference-id> [<id> …] --diff
scripts/with-device.sh <port> node scripts/parity-diff.mjs android <id> --region header
```

`device-shot.mjs` reaches each state with deep links only, from a map you maintain at `src/screens/<area>/shots/<area>.json`:

```json
{ "area": "practice",
  "shots": { "view-quiz": { "links": ["jump/quiz"], "wait": 900, "regions": ["0,0,412,120"] } } }
```

Every shot starts from `reset;insets/zero;clock/2026-10-24T09:41:00+05:30`: zero insets and a hidden status bar (the reference was captured with `env(safe-area-inset-*)` = 0), and the reference clock. It writes `parity/android/<id>/shot.png`; `parity-diff.mjs` writes `diff*.png`, `sbs*.png` (reference | device | diff) and a score, with nothing resampled. Regions are CSS px: `x,y,w,h` from the top-left, `b:x,y,w,h` with `y` measured up from the bottom edge, and `…>b:y` when the region sits elsewhere on the device. Look at the `sbs` image; the score alone proves nothing.

iOS is verified by code only (owner decision): no simulator commands. `device-shot.mjs` refuses `ios`.

## 9. Known platform differences (do not try to hide them; list them in your report where they bite)

- **Android text is laid out in whole device pixels.** Font size and line height land on the nearest pixel (`Txt` does this): a size can be off by up to half a pixel (about 1 to 2 % of glyph width). A line that only just fits in the browser can wrap one word earlier on the device. Vertical text position can differ by 1 px per line.
- **The reference was drawn with macOS fallback fonts for glyphs the Google Fonts subsets lack**: `→ ≈ ✓`, Devanagari inside `--serif` / `--book` / `--read` text (for example the `हिं` language toggle), and all `ui-monospace` text. The bundled full Inter and Inter Tight files DO contain `→ ≈ ✓`, so the device draws those in Inter; Devanagari outside the `--sans` stack and monospace come from the device's system fonts. Expect small differences from the reference there (`systemFontGlyphs` in `reference/index.json` lists the affected states).
- The Android device is 411.43 x 914.29 dp against the 412 x 915 reference viewport: full-width elements are 0.57 dp narrower.
- Blur: Android blurs a downsampled copy of the window; iOS uses a system material that also tints. Under the 92 to 96 % opaque bars of the design neither is visible beyond a level or two.
- Sheets: on iOS the sheet is lifted by the keyboard height while a field in it has focus; Android resizes the window. The HTML has no equivalent (a browser pans the page).
- Android hardware back = close the sheet, else `back()`, else the system default. iOS has no swipe-back. The `Escape` and `/` keys of the HTML (L7070-L7073) are not ported.
- `:hover` rules are not ported. `#app{max-width:440px}` is not ported (phones only).

## 10. Rules that still apply to you

No UI/UX change; no new components; no UI kits; no native `Alert`, `ActivityIndicator`, `Switch`, `Modal`, `RefreshControl`, ripple or haptics; no loading, error or empty states the HTML lacks; no gestures the HTML lacks (sheets close by scrim tap or close button only, the grab handle is decorative). If something you need is missing or a library does not do what you need, stop that item and report exactly what is needed, with the real error output. Your final report must contain a "blocked or unsolved" list, stated as empty if it is.
