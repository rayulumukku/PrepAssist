// Shell-level entries of the prototype's `A` (PrepAssist.html L6963-L7043). FROZEN.
//   jump L6971-L6983 · tab L6993 · push L6994 + the wrapper at L10630 · back L6995 (the newest wrapper,
//   L10060) · tool L7010 = the ORIGINAL openTool L6954-L6960 · sheet L7014 · closeSheet L7015 · toast L7041
import { INLINE_openTool_L6957 } from '../data/inline';
import {
  back,
  closeAllPages,
  closeSheet,
  go,
  openSheet,
  pushRaw,
  setTab,
  toast,
} from '../navigation/nav';
import { isSheetKey, isStage, isTab, REGISTRY_SHEET_KEYS } from '../navigation/routes';
import { getS } from '../store';
import { resetTabScroll } from '../shell/tabScroll';
import type { CrossFns, Handler, HandlerMap } from './types';

/** Filled by actions/index.ts (base cannot import the area files: they import base's helpers). */
let call: (verb: string, arg?: string) => void = () => {};
let fns: Partial<CrossFns> = {};
export function bindBase(act: (verb: string, arg?: string) => void, crossFns: Partial<CrossFns>): void {
  call = act;
  fns = crossFns;
}

/**
 * openTool(id) as A.tool holds it: the function at L6954-L6960. The two later reassignments of the
 * global openTool (L8228, L8369) never reach A.tool and nothing else calls openTool(), so they are
 * dead code and are not ported. An id that is not in the map does nothing (TypeError in the HTML).
 */
const openTool: Handler = id => {
  closeSheet();
  if (id === 'mentor') {
    setTimeout(() => fns.openMentor?.(), 250);
    return;
  }
  const map: Readonly<Record<string, string>> = INLINE_openTool_L6957;
  const target = id === undefined ? undefined : map[id];
  if (target === undefined) return;
  const [v, a] = target.split(':');
  pushRaw(v, a);
};

/** A.jump (L6971-L6983): the location.hash start and the desktop jump panel. Unknown targets end on the current tab. */
const jump: Handler = x => {
  closeSheet();
  if (x !== undefined && isStage(x) && x !== 'app') {
    go(x);
    return;
  }
  if (getS().stage !== 'app') go('app');
  closeAllPages(true);
  if (x !== undefined && isTab(x)) {
    setTab(x);
    return;
  }
  if (x === 'quiz') {
    setTab('practice');
    fns.startQuiz?.(true);
    return;
  }
  if (x === 'mains') {
    setTab('practice');
    pushRaw('mains');
    return;
  }
  if (x === 'mentor') {
    setTab('home');
    fns.openMentor?.();
    return;
  }
  if (x === 'article') {
    setTab('current');
    pushRaw('article', 'c4');
    return;
  }
  if (x === 'plans') {
    setTab('profile');
    pushRaw('upgrade');
    return;
  }
  if (x === 'status') {
    setTab('profile');
    pushRaw('status');
    return;
  }
};

export const handlers: HandlerMap = {
  jump,

  /** L6993: closeSheet(); setTab(x); scrollTop = 0. A value that is not a tab does nothing useful in the HTML either (it throws on the missing pane). */
  tab: x => {
    closeSheet();
    if (x === undefined || !isTab(x)) return;
    setTab(x);
    resetTabScroll(x);
  },

  /**
   * L10630 wraps L6994. 'note:new' opens the New Note sheet through A.ntNew() (library) and never
   * pushes. Everything else: closeSheet(), then the arg is split at ITS first colon when that colon is
   * not at index 0 (`i > 0`), so 'legal:terms' -> push('legal', 'terms') and ':x' -> push(':x').
   */
  push: x => {
    if (x === 'note:new') {
      call('ntNew');
      return;
    }
    closeSheet();
    if (x === undefined) return;
    const i = x.indexOf(':');
    if (i > 0) pushRaw(x.slice(0, i), x.slice(i + 1));
    else pushRaw(x);
  },

  back: () => back(),

  tool: openTool,

  /** L7014: openSheet(SHEETS[k](), ['allTools'].includes(k)). Only SHEETS keys; anything else does nothing. */
  sheet: k => {
    if (k === undefined || !isSheetKey(k) || !(REGISTRY_SHEET_KEYS as readonly string[]).includes(k)) return;
    openSheet(k, { tall: k === 'allTools' });
  },

  closeSheet: () => closeSheet(),

  /** L7041: toast(m, 'check') */
  toast: m => toast(m ?? ''),

  /**
   * L7035 chipToggle: (x, el) => el.classList.toggle('on') · L7036 chipOne: turns `on` only on the
   * clicked chip among its siblings. Both act on the clicked element alone, so the state lives in the
   * component (ChipGroup keeps it). The component passes itself as `el`: { toggle() } or { select() }.
   */
  chipToggle: (_x, el) => (el as ActEl | undefined)?.toggle?.(),
  chipOne: (_x, el) => (el as ActEl | undefined)?.select?.(),
};

/** What a component can pass as `el` to act() for the handlers that only touch the clicked element. */
export interface ActEl {
  toggle?: () => void;
  select?: () => void;
}
