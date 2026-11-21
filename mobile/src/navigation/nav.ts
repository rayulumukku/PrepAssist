// The prototype's shell functions, working on the store instead of the DOM:
//   go L5616-L5627 · renderAll L5988-L6001 · setTab L6002-L6009 · push/back/closeAllPages/syncChrome
//   L6474-L6506 · openSheet/closeSheet L6909-L6915 · toast L5117-L5123 · setPlanTheme L10751
// FROZEN. Screens call these (or act()); they never write stage/tab/stack/sheet/toast themselves.
import type { ShellHooks } from '../actions/types';
import type { IconName } from '../icons/iconPaths.generated';
import { getS, setS } from '../store';
import type { LayerPage, StackEntry } from '../store/slices/base';
import { durations } from '../theme/tokens';
import type { Plan } from '../theme/tokens';
import { VIEW_META, isViewId } from './routes';
import type { PushArgs, SheetKey, Stage, TabId, ViewId } from './routes';

let hooks: readonly ShellHooks[] = [];
/** Called once by actions/index.ts with the hooks of every area. */
export function installShellHooks(list: readonly ShellHooks[]): void {
  hooks = list;
}

let nextPageKey = 0;
let toastT: ReturnType<typeof setTimeout> | undefined;
let askT: ReturnType<typeof setTimeout> | undefined;
let sheetRaf: ReturnType<typeof requestAnimationFrame> | undefined;

const top = (): StackEntry | undefined => {
  const st = getS().stack;
  return st[st.length - 1];
};

const toEntry = (p: LayerPage): StackEntry => ({ key: p.key, id: p.id, arg: p.arg, focus: p.focus });

/** el.remove() after the slide-out (L6491, L6497). */
function removeLater(key: number): void {
  setTimeout(() => {
    setS(s => ({ layer: s.layer.filter(p => p.key !== key) }));
  }, durations.page);
}

/** syncChrome (L6501-L6506). `.paged` and `.hide` are derived (see useChrome); only `.mini` is sticky. */
function syncChrome(): void {
  if (top()) setS({ askMini: true });
}

// ---------------- stages ----------------

/** go(name) */
export function go(name: Stage): void {
  const s = getS();
  setS({
    stage: name,
    stagesSeen: s.stagesSeen[name] ? s.stagesSeen : { ...s.stagesSeen, [name]: true },
    // .stage.on is toggled; the stageIn animation starts only when the class is newly added
    stageShown: s.stage === name ? s.stageShown : s.stageShown + 1,
  });
  for (const h of hooks) h.onStage?.(name);
  if (name === 'app') {
    if (!getS().rendered) renderAll();
    setTab(getS().tab || 'home', true);
  }
  if (name !== 'app') closeAllPages(true);
}

/** renderAll(): the tab panes render themselves; what is left is the flag, the hooks and the Ask timer. */
function renderAll(): void {
  setS({ rendered: true });
  for (const h of hooks) h.onRenderAll?.();
  if (askT) clearTimeout(askT);
  askT = setTimeout(() => setS({ askMini: true }), durations.askAutoMini);
}

// ---------------- tabs ----------------

/** setTab(tab, silent). `silent` is accepted and unused, as in the HTML. */
export function setTab(tab: TabId, _silent?: boolean): void {
  const s = getS();
  setS({
    tab,
    tabsSeen: s.tabsSeen[tab] ? s.tabsSeen : { ...s.tabsSeen, [tab]: true },
    // .tabp.on is toggled; tabIn restarts only on the pane that newly gets the class
    tabShown: s.tab === tab && s.tabsSeen[tab] ? s.tabShown : { ...s.tabShown, [tab]: s.tabShown[tab] + 1 },
  });
  closeAllPages();
  for (const h of hooks) h.onTab?.(tab);
}

// ---------------- page stack ----------------

/** push(id, arg), typed. */
export function push<K extends ViewId>(id: K, ...args: PushArgs<K>): void {
  pushRaw(id, args[0]);
}

/**
 * push(id, arg) for ids that arrive as text (the `push` verb, deep links). An id that is not a VIEWS
 * key does nothing (in the HTML `VIEWS[id]` is undefined and the click dies with a TypeError).
 */
export function pushRaw(id: string, arg?: string): void {
  if (!isViewId(id)) return;
  const meta = VIEW_META[id];
  const prev = top();
  const page: LayerPage = {
    key: ++nextPageKey,
    id,
    arg,
    focus: meta.focus || meta.noAsk,
    live: true,
    under: false,
  };
  setS(s => ({
    layer: [...s.layer.map(p => (prev && p.key === prev.key ? { ...p, under: true } : p)), page],
    stack: [...s.stack, toEntry(page)],
  }));
  syncChrome();
}

/** back(), with every wrapper the later scripts put around it (L8373, L8549, L10059) expressed as hooks. */
export function back(): void {
  const t = top();
  if (!t) return;
  for (const h of hooks) h.beforeBack?.(t);
  setS(s => {
    const stack = s.stack.slice(0, -1);
    const prev = stack[stack.length - 1];
    return {
      stack,
      layer: s.layer.map(p =>
        p.key === t.key ? { ...p, live: false } : prev && p.key === prev.key ? { ...p, under: false } : p,
      ),
    };
  });
  removeLater(t.key);
  const prev = top();
  for (const h of hooks) h.afterBack?.(t, prev);
  syncChrome();
}

/**
 * closeAllPages(instant). Not instant: every page loses `.in` at once and is removed after 420 ms. A
 * page that was `under` keeps that class (.page.under wins over the base transform, L2472), so it does
 * not slide: it stays shifted and dimmed until it is removed. That is how the HTML behaves.
 */
export function closeAllPages(instant?: boolean): void {
  const live = getS().layer.filter(p => p.live);
  if (live.length) {
    if (instant) {
      setS(s => ({ stack: [], layer: s.layer.filter(p => !p.live) }));
    } else {
      setS(s => ({ stack: [], layer: s.layer.map(p => (p.live ? { ...p, live: false } : p)) }));
      for (const p of live) removeLater(p.key);
    }
  }
  for (const h of hooks) h.onCloseAllPages?.();
  syncChrome();
}

/** `p.arg = x` on the top entry (A.arNext L7605, A.legalSwap L7628). */
export function setTopArg(arg: string | undefined): void {
  const t = top();
  if (!t) return;
  setS(s => ({
    stack: s.stack.map(e => (e.key === t.key ? { ...e, arg } : e)),
    layer: s.layer.map(p => (p.key === t.key ? { ...p, arg } : p)),
  }));
}

// ---------------- sheet ----------------

/**
 * openSheet(html, tall). The content is named by a registry key (navigation/sheets.ts) plus an
 * optional string argument. As in the HTML the sheet first loses `.on` (className is reset, L6911),
 * gets its new content, and gets `.on` back on the next animation frame.
 */
export function openSheet(key: SheetKey, opts?: { arg?: string; tall?: boolean }): void {
  setS(s => ({
    sheet: { n: s.sheet.n + 1, key, arg: opts?.arg, tall: !!opts?.tall, on: false },
  }));
  const n = getS().sheet.n;
  if (sheetRaf !== undefined) cancelAnimationFrame(sheetRaf);
  sheetRaf = requestAnimationFrame(() => {
    sheetRaf = undefined;
    setS(s => (s.sheet.n === n ? { sheet: { ...s.sheet, on: true } } : {}));
  });
}

/** closeSheet(). The content stays (it slides out with the sheet), as in the HTML. */
export function closeSheet(): void {
  if (sheetRaf !== undefined) {
    cancelAnimationFrame(sheetRaf);
    sheetRaf = undefined;
  }
  setS(s => (s.sheet.on ? { sheet: { ...s.sheet, on: false } } : {}));
}

/** `$('#sheet').classList.contains('on')` */
export const sheetIsOpen = (): boolean => getS().sheet.on;

// ---------------- toast ----------------

/** toast(msg, icon = 'check'). Pass null for no icon. */
export function toast(msg: string, icon: IconName | null = 'check'): void {
  setS(s => ({ toast: { n: s.toast.n + 1, msg, icon, on: true } }));
  if (toastT) clearTimeout(toastT);
  toastT = setTimeout(() => {
    setS(s => ({ toast: { ...s.toast, on: false } }));
  }, durations.toastHold);
}

// ---------------- plan theme ----------------

/** setPlanTheme(p): html[data-plan] = p. The theme changes; S.me.plan is the account slice's business. */
export function setPlanTheme(p: Plan): void {
  setS({ planTheme: p });
}

// ---------------- Ask button ----------------

/** The tab scroll listener (L5992-L5997). `state` keeps `last` per scroll pane. */
export function askOnScroll(y: number, state: { last: number }): void {
  if (y > state.last + 6 && y > 120) {
    if (!getS().askMini) setS({ askMini: true });
  } else if (y < state.last - 6) {
    if (getS().askMini) setS({ askMini: false });
  }
  state.last = y;
}

/** Tests only: stop the renderAll() timer that minimises the Ask button after 3500 ms. */
export function __cancelAskTimer(): void {
  if (askT) clearTimeout(askT);
  askT = undefined;
}

/** Tests only: stop the timers this module started. */
export function __resetNavTimers(): void {
  if (toastT) clearTimeout(toastT);
  if (askT) clearTimeout(askT);
  if (sheetRaf !== undefined) cancelAnimationFrame(sheetRaf);
  toastT = askT = undefined;
  sheetRaf = undefined;
}
