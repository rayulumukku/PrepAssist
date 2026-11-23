# PrepAssist reference pack

Rendered ground truth of `PrepAssist.html`, captured from headless Chromium with Playwright.
Port from these files, and compare against them. The HTML file itself is never modified.

`index.json` is the definitive list of screens and states. Start there.

## Re-run

```
cd tools/reference
node capture/capture.mjs                      # everything, both viewports (about 290 states each)
node capture/capture.mjs --viewport android   # one viewport
node capture/capture.mjs --only view-quiz     # one state; comma list, scenario ids and a trailing * also work
node capture/capture.mjs --list               # print every id
node capture/capture.mjs --missing            # resume: only states with no meta.json yet
node capture/capture.mjs --runtime-only       # rebuild index.json and runtime.json only
node capture/verify.mjs                       # checks the pack, writes verify-report.json
node capture/contact.mjs ../../reference/android /tmp/sheets   # contact sheets for eyeballing
```

The run needs the network: fonts come from Google Fonts. A preflight loads all five families
(EB Garamond, Inter Tight, Inter, Noto Sans Devanagari, Caveat) and aborts if any is missing, and
every single capture re-checks with `document.fonts.check` that each glyph on screen has its web
font loaded. Nothing is written with fallback fonts.

`index.json` is rebuilt from the `meta.json` files after every run, so partial runs stay consistent.

## Folders

```
reference/
  index.json            one entry per screen/state (see below)
  runtime.json          VIEWS / SHEETS / A keys, :root custom properties per plan theme, all @keyframes
  verify-report.json    result of the last verify run
  android/<id>/         412 x 915 CSS px at deviceScaleFactor 2.625  (PNG 1082 x 2402)
  ios/<id>/             402 x 874 CSS px at deviceScaleFactor 3      (PNG 1206 x 2622, iPhone 17)
```

Each `<id>/` folder holds:

| File | What it is |
|---|---|
| `shot.png` | The viewport at rest. |
| `scroll-01.png` … | The main scroll container stepped by 80% of its height down to the bottom. `scroll-00.png` exists only when the state rests scrolled (the page scrolled itself, for example to quiz feedback): it is the top of the content. |
| `dom.json` | Tree of every rendered element of the screen with rect and computed styles (legend below). |
| `html.txt` | `outerHTML` of the screen root, for exact copy and markup. |
| `meta.json` | How it was reached, state of `S`, scroll metrics, fonts loaded, animation state. |

Ids: `stage-*` (book, intro, auth, verify), `tab-*`, `view-*` (pushed pages, `VIEWS`), `sheet-*`
(bottom sheets), `overlay-*` (Ask button, toast, reels viewer, plan-change overlay). A suffix is a
state of that screen (`view-quiz-results`, `tab-home-hi`, `tab-home-pro`).

## index.json entry

- `id`, `kind` (`stage` / `tab` / `view` / `sheet` / `overlay` / `state`), `title`
- `reach`: the exact steps used, from page load. `reachLegend` at the top of the file explains
  each step type. Hash jumps are `goto`; everything else is the prototype's own function or a
  click on one of its `data-act` elements.
- `source`: line ranges in `PrepAssist.html`. `VIEWS.x` / `SHEETS.x` ranges are found by matching
  the live function's source text, so they point at the **final** definition when a key is
  redefined. Named functions list every top-level definition in order; the last is effective.
  `renderedBy` lists helpers the view function calls.
- `focus`: for pushed pages, whether the page has class `focus` (it draws its own header).
- `timeDependent`, `notes`: read these before trusting pixels.
- `viewports.<name>`: files, `scrollLength` (scrollHeight of the main scroll container),
  `scrollViewport`, `scrollShots`, `ask` (full / mini / hidden), `toast`, `planTheme`, `atRest`,
  `systemFontGlyphs`, `shellScroll`, `clippedOverflow`.
- `registryCoverage` (top level): for every `VIEWS` and `SHEETS` key, which captures cover it and
  which captured screens contain a `data-act` that opens it.

## dom.json legend

```
{ meta, defaults, root: Node, chrome: Node[] }
Node = { tag, id?, cls?, text?, content?, attrs?, rect, style, before?, after?, placeholder?, svg?, scroll?, pruned?, children? }
```

- `root` is the screen itself: the stage, the tab pane, the pushed page, or `#sheet`.
  `chrome` holds whatever else is visible and not covered: `#nav`, `#ask`, `#scrim`, `#toast`,
  the sheet, the reel viewer, the page under a sheet. The tab or page lying under a pushed page
  or sheet is not repeated; `meta.json` names it (`state.tab`, `state.stack`).
- `rect` is `[x, y, width, height]` in CSS px, as in `shot.png` (after transforms).
- `text` is the element's own text; `content` gives the order of text and child elements when mixed.
- `style` holds `getComputedStyle` values. To keep files small:
  - a property equal to its value in `defaults` is left out;
  - text properties (`color`, `font-*`, `line-height`, `letter-spacing`, `text-align`,
    `text-transform`, `white-space`, …) are written in full on the root and on every element that
    has its own text, and elsewhere only where they differ from the parent. Missing means
    "same as the nearest ancestor that has it";
  - `padding`, `margin`, `inset` are `top right bottom left`; `border-radius` is `tl tr br bl`;
  - `border-<side>` appears only for sides that are drawn (`width style color`);
  - flex and grid properties appear only on flex and grid containers; `gap` is `row column`;
  - `transition` appears only when a duration is non-zero; `animation` only when one is set
    (name, duration, delay, timing-function, iteration-count, direction, fill-mode, play-state).
- `before` / `after` are the computed styles of `::before` / `::after` when they have content.
  Many decorations in the prototype are pseudo-elements, so check these.
- `svg` is the `outerHTML` of an inline `<svg>`, recorded once; SVG children are not walked.
  Colours set on SVG internals from CSS (for example the pen CTA's gradient stops per plan theme
  in `<style id="planthemes">`) are therefore not in `svg`; read them from the CSS.
- `scroll` is on scroll containers: scroll and client sizes and the scroll position at capture.
- `data:` URLs longer than 200 characters are shortened.
- Book stage only: the 26 strips of each leaf repeat the same page content; strips after the
  first are marked `pruned` and their children omitted. `html.txt` still has everything.

## How "at rest" is decided

The page clock is frozen (Playwright clock, paused before navigation) at
**Saturday 24 October 2026, 09:41 IST** and only advances through the `run` steps listed in
`reach`. The prototype's own data is written for that day (`calDays()` hard-codes "today = 24",
ledger rows end on 24 Oct). Four Home captures use other hours and say so (`fixedTime`).

After each step the tool waits in real time until no finite CSS animation or transition is
running, no element is still scrolling and fonts are idle, then takes two frames 180 ms apart.
Identical frames = `stableFrames: true`. When infinite (ambient) animations are on screen the
frames differ by design: the capture waits a further 400 ms, and `atRest.ambientAnimations` lists
them (`ambientElsewhere` lists loops running in layers under the captured one, which can still
show around a sheet). No animation, font or style is disabled or altered and no CSS is injected. The only
exception is Playwright's default screenshot behaviour of hiding the blinking text caret.

Reproducibility, measured by running the same states twice: `dom.json` and `html.txt` come out
byte-identical. PNGs are identical for most states; where they differ it is a few dozen pixels by
at most 9/255 (icon antialiasing, and on android the right-most pixel column, which is half a CSS
pixel because 412 x 2.625 = 1081.5). Compare screenshots with a small tolerance, not by hash.

`view-onestep-t1500`, `-t3000`, `-t4600`, `-t6500` are timeline frames taken that many ms (real
time, within 150 ms) into the One more step sequence; they are marked `timeline` and are not rest
frames. `view-onestep` is the rest frame after the 11 s sequence.

## Emulation, and one thing to know about the device frame

Viewports are in `index.json`. Touch is on (`hover: none`, `pointer: coarse`), safe-area insets
are 0, reduced motion is off, locale `en-IN`, timezone `Asia/Kolkata`.

`isMobile` is deliberately **off**. Line 4 of the HTML decides whether to draw the desktop device
frame (`html.framed`) with `matchMedia('(min-width:640px)')` in a `<head>` script that runs
before the `<meta name="viewport">` tag is parsed. Under Chromium's mobile emulation the layout
viewport is still the 980 px fallback at that moment (measured `innerWidth` 981), so the page
frames itself and renders the app at 390 x 844 inside a phone bezel. With `isMobile` off the
viewport is the real CSS width from the start and the page takes its full-bleed phone layout.
Every capture asserts that `html.framed` is absent.

## Known gaps

- **X-Ray reader does not scroll in the prototype.** `x4Reader()` renders
  `.page > .x4r > .scroll.x4-scroll`, but the rule that sizes the scroller is
  `.page > .x4-scroll{position:absolute;inset:0}` (L9483) and no longer matches. The scroll box
  grows to its content, nothing is scrollable, and the article below the first viewport is
  clipped by `#app` (about 780 px on android at standard text size; `clippedOverflow` in the
  entry gives the number). The `view-xray*` captures therefore have one screenshot each and no
  scroll steps. `dom.json` (rects run past the viewport) and `html.txt` hold the whole article.
  Whether to port this as rendered or to make the article scroll is a design question for the
  owner; it was not worked around here.
- Horizontal carousels (announcements, reels row, filter chips) are in `dom.json` and `html.txt`
  in full, but screenshots show only what is on screen. The four announcement cards have their
  own captures (`tab-home-hero-1..4`).
- Transitions themselves (page slide 420 ms, sheet 420 ms, book leaf turn, purchase burst) are
  not filmed; only rest frames, plus the One more step timeline frames. Timings are in
  `dom.json` (`transition`, `animation`) and in `runtime.json` (`keyframes`).
- Password strength: `pwStrength()` runs, but `#s-auth #pwS{display:none!important}` (L1146)
  hides the meter, so no strength state is ever visible. `stage-auth-signup-password-typed`
  records this.
- Learn has no filter chips in the final UI (`A.learnF` and `.l-chips` are dead code).
- Not captured: the "signing" pen animation on auth submit (1300 ms), `html.calm`
  (Settings > Reduce motion), drag gestures (book page drag, flashcard swipe, intro swipe,
  insight-sheet tab swipe), hover and `:active` styles, sound.
- Random or time-driven pixels: dust motes on the book canvas, System status latency numbers,
  sparkles on the plan-change overlay, the quiz timer. Each affected entry has `timeDependent`.
- `systemFontGlyphs` in an entry lists characters that no loaded web font covers, so a macOS
  system font drew them here and a device will draw them differently: `→` `≈` `✓` (not in the
  Inter / Caveat subsets Google serves), Devanagari inside `--serif` text such as the `हिं`
  language toggle (that stack has no Devanagari font), and everything set in
  `ui-monospace, Menlo` (ID-card number, invoice ids, keyboard hint). The list covers all of
  `#app`, including layers lying under the captured one.
- The book stage is laid out with absolute pixel camera constants tuned for the 390 x 844
  framed device (`CAM_FINAL`, L5759). Unframed at 412 x 915 or 402 x 874 the open page does not
  fill the screen: a strip of desk shows at the right and bottom. That is how the HTML renders.
  Text on the closed cover looks soft because Chromium rasterises it inside a scaled 3D layer.
- `shellScroll` in an entry means the prototype's own `scrollIntoView()` also scrolled `#app`
  (which is `overflow:hidden`) by 2 px, so the whole screen sits 2 px high in that capture
  (quiz after Submit, Prelims Question Bank after answering). It is a browser side effect, not
  design.
