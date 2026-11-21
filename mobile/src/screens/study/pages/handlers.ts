// Source: PrepAssist.html L7031 (A.planGo), L7034 (A.calDay)
// Handlers of the study area's pages group (calendar, plan). Merged into src/actions/study.ts. Must not import src/actions at load.
// The HTML changes the DOM of the page on top (`$('#planGo')`, `$$('.cal-strip button')`); here the
// handler writes that DOM state into the store under the top page's entry key and the screen renders it.
import type { HandlerMap } from '../../../actions/types';
import { getS, setS } from '../../../store';

const topKey = (): number | undefined => {
  const st = getS().stack;
  return st.length ? st[st.length - 1].key : undefined;
};

/** `wait(ms)` of the HTML */
const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

/** The clicked `.cal-strip` button: the component passes `{ index }` as act()'s third argument. */
const indexOf = (el: unknown, arg: string | undefined): number | undefined => {
  if (el && typeof el === 'object' && typeof (el as { index?: unknown }).index === 'number') return (el as { index: number }).index;
  // test deep links (prepassist://act/calDay/<n>) cannot pass an element; they pass its index
  if (arg !== undefined && /^\d+$/.test(arg)) return Number(arg);
  return undefined;
};

export const handlers: HandlerMap = {
  /** calDay: (x, el) => { cal-strip buttons: .on only on el; #calSlots opacity .3, back to 1 after 180 ms } */
  calDay: (arg, el) => {
    const i = indexOf(el, arg);
    const key = topKey();
    if (i === undefined || key === undefined) return;
    setS({ calPage: { key, on: i, dim: true } });
    setTimeout(() => {
      setS(s => (s.calPage && s.calPage.key === key ? { calPage: { ...s.calPage, dim: false } } : {}));
    }, 180);
  },
  /** planGo: async () => { #planGo = spinner + 'Analysing your preparation…'; await wait(1400); #planBody = planResult() } */
  planGo: async () => {
    const key = topKey();
    if (key === undefined) return;
    setS({ planPage: { key, step: 'busy' } });
    await wait(1400);
    setS(s => (s.planPage && s.planPage.key === key ? { planPage: { key, step: 'done' } } : {}));
  },
};
