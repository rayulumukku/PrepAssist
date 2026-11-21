// Handlers of the tabs workstream: the six tab panes, the reels viewer and the revisions / coverage / allTools / current-filter sheets.
// OWNED BY THE TABS WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "tabs", named exactly like the verb and ported from the handler source the map points to.
//
// Not ported (owner decision 2026-11-21: unreferenced, unreachable from any UI, counted as dead code):
// caDate (L7597), caDay (L7018), caTopic (L7018), fcNav (L7006), toolGroup (L7009). `flip` is in that
// list but initDeck calls A.flip() on a tap (L6454), so it is ported for the deck.
// learnF (L6964) only re-styles `.l-chips`, which the final Learn tab does not render (dead code): it
// keeps S.learnF and nothing else.
import { REELS, REVISIONS } from '../data';
import { FLASH } from '../data';
import { closeSheet, openSheet, push, toast } from '../navigation/nav';
import { deckCtl, heroCtl } from '../screens/tabs/home/heroCtl';
import { animateHome } from '../screens/tabs/home/homeAnim';
import { scrollTab } from '../shell/tabScroll';
import { getS, setS } from '../store';
import type { CrossFns, HandlerMap, ShellHooks } from './types';
// Used at call time only (never while this module loads): the registry imports this file.
import { act, fns as crossFns } from './index';

// ---------------------------------------------------------------- Home


/** renderHome(); initHero(); animateHome() — the Home pane is rebuilt (L7012, L7013). */
function rerenderHome(): void {
  setS(s => ({ homeGen: s.homeGen + 1, fcFlip: false }));
  animateHome();
}

/** setFc(i) L6158-L6164 */
function setFc(i: number): void {
  setS({ fc: (i + FLASH.length) % FLASH.length, fcFlip: false });
}

// ---------------------------------------------------------------- Reels viewer (L6367-L6396)

let reelTm: ReturnType<typeof setTimeout> | undefined;

/** reelPaint() L6374-L6386: marks the reel seen and arms the 4.5 s auto-advance. */
function reelPaint(i: number, j: number): void {
  const r = REELS[i];
  setS(s => ({ reel: { on: s.reel.on, i, j }, reelSeen: new Set(s.reelSeen).add(r.id) }));
  clearTimeout(reelTm);
  reelTm = setTimeout(() => reelStep(1), 4500);
}

/** reelOpen(i) L6368-L6373 */
function reelOpen(i: number): void {
  reelPaint(i, 0);
  requestAnimationFrame(() => setS(s => ({ reel: { ...s.reel, on: true } })));
}

/** reelStep(d) L6387-L6392 */
function reelStep(d: number): void {
  let { i, j } = getS().reel;
  const r = REELS[i];
  j += d;
  if (j < 0) {
    if (i > 0) {
      i--;
      j = REELS[i].slides.length - 1;
    } else j = 0;
  } else if (j >= r.slides.length) {
    if (i < REELS.length - 1) {
      i++;
      j = 0;
    } else {
      reelClose();
      return;
    }
  }
  reelPaint(i, j);
}

/** reelClose() L6393-L6396. The viewer empties itself 300 ms later (ReelViewerOverlay). */
function reelClose(): void {
  clearTimeout(reelTm);
  setS(s => (s.reel.on ? { reel: { ...s.reel, on: false } } : {}));
}

// ---------------------------------------------------------------- handlers

export const handlers: HandlerMap = {
  // Home: flashcards (L7005-L7008)
  flip: () => setS(s => ({ fcFlip: !s.fcFlip })),
  fcLang: l => setS({ fcLang: l }),
  fcRate: r => {
    toast(r === 'got' ? 'Nice — next review in 6 days' : 'We’ll show this again tomorrow', r === 'got' ? 'check' : 'refresh');
    setFc(getS().fc + 1);
  },
  // Home: announcements (L7004)
  heroGo: i => heroCtl.go?.(Number(i)),
  // Home: revisions and tools (L7010-L7013)
  allTools: () => openSheet('allTools', { tall: true }),
  revisions: () => openSheet('revisions'),
  revDo: id => {
    if (id !== undefined) setS(s => ({ revDone: new Set(s.revDone).add(id) }));
    openSheet('revisions');
    toast('Revised · next review scheduled', 'check');
    rerenderHome();
  },
  revAll: () => {
    setS(s => {
      const d = new Set(s.revDone);
      REVISIONS.forEach(r => d.add(r.id));
      return { revDone: d };
    });
    closeSheet();
    rerenderHome();
    setTimeout(() => deckCtl.scrollToFcs?.(), 200);
    toast('3 revisions added to your flashcards', 'layers');
  },
  // Reels viewer (L6965-L6970)
  reel: i => reelOpen(Number(i)),
  reelStep: d => reelStep(Number(d)),
  reelJump: () => {
    const { i } = getS().reel;
    reelPaint(Math.min(i + 1, REELS.length - 1), 0);
  },
  reelClose: () => reelClose(),
  reelSave: () => toast('Saved to your flashcards'),
  reelAsk: () => {
    reelClose();
    // A.mentor exists (L7015, study area)
    setTimeout(() => act('mentor'), 320);
  },
  // Learn (L6964, L8363-L8365)
  learnF: k => setS({ learnF: k }),
  lxScanNote: () => {
    push('upload');
    act('upPick', 'img');
    toast('Page captured · it’ll be converted to text after upload', 'camera');
  },
  lxUp: k => {
    push('upload');
    act('upPick', k);
  },
  lxPyq: () => {
    crossFns.startQuiz?.(true);
    toast('5 PYQs from Laxmikanth Ch. 7', 'test');
  },
  // Practice (L7019-L7020)
  pxGo: w => {
    setS({ px: w === 'mains' ? 'mains' : 'pre' });
    scrollTab('practice', 0);
  },
  /** engN: (x, el) => the clicked chip becomes the only .on chip of its row. `el.select()` is given by the Practice tab. */
  engN: (_x, el) => {
    (el as { select?: () => void } | undefined)?.select?.();
  },
  // Current (L7593-L7598)
  caSrc: s => setS(st => ({ ca: { ...st.ca, src: s ?? '' } })),
  caGs: g => {
    setS(st => ({ ca: { ...st.ca, gs: g ?? '' } }));
    closeSheet();
  },
  caFilter: () => openSheet('currentFilter'),
  caReset: () => setS(st => ({ ca: { ...st.ca, src: 'All', gs: 'All' } })),
};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {
  // setTab L6007-L6008: animateHome(); pxSpy() is an empty function (L6353)
  onTab: tab => {
    if (tab === 'home') animateHome();
  },
};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {};
