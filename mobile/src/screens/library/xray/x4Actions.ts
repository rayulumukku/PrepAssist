// The X-Ray v4 handlers: Object.assign(A, {...}) of <script id="xray4js"> (PrepAssist.html L10023-L10055),
// x4OpenSheet (L9998-L10004), x4ScrollTo (L9956-L9961) and the back() wrapper (L10058-L10060).
// DOM writes of the HTML (classes, innerHTML) are state changes here; the screens re-render from S.x4.
import { fns } from '../../../actions';
import type { HandlerMap, ShellHooks } from '../../../actions/types';
import { MONS } from '../../../data';
import { today } from '../../../env/clock';
import { closeSheet, openSheet, push, toast } from '../../../navigation/nav';
import { getS, setS } from '../../../store';
import type { X4State } from '../../../store/slices/library';
import { reader } from './readerBridge';
import { scanBy, subN } from './x4';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));
const fmtShort = (d: Date): string => d.getDate() + ' ' + MONS[d.getMonth()];

export function setX4(p: Partial<X4State> | ((x: X4State) => Partial<X4State>)): void {
  setS(s => ({ x4: { ...s.x4, ...(typeof p === 'function' ? p(s.x4) : p) } }));
}

let lockTimer: ReturnType<typeof setTimeout> | undefined;

/** x4ScrollTo (L9956-L9961) */
function x4ScrollTo(i: number): void {
  const r = reader();
  if (!r) return;
  setX4({ lock: true });
  clearTimeout(lockTimer);
  lockTimer = setTimeout(() => setX4({ lock: false }), 700);
  r.scrollToInsight(i);
  r.pulse(i);
}

/** x4OpenSheet (L9998-L10004) */
function x4OpenSheet(i: number): void {
  const sc = scanBy(getS().x4.scan);
  setX4(x => ({ cur: i, seen: { ...x.seen, [sc.id + ':' + i]: 1 } }));
  const sh = getS().sheet;
  // already open with the insight sheet: the content is replaced in place, no new slide
  if (!(sh.on && sh.key === 'xrayInsight')) openSheet('xrayInsight', { tall: true });
}

export const x4Handlers: HandlerMap = {
  x4Sub: k => setX4({ sub: k ?? '' }),
  x4Up: async kind => {
    if (getS().x4.busy) return;
    const k = getS().x4.sub;
    const top = getS().stack[getS().stack.length - 1];
    // `$('#x4Proc')` exists only while the library is the page on top
    if (!top || top.id !== 'xrayhome') return;
    const kd = kind ?? '';
    setX4({ busy: { kind: kd, run: -1, done: 0, pc: 0 } });
    const rows = 5;
    for (let i = 0; i < rows; i++) {
      setX4(x => (x.busy ? { busy: { ...x.busy, run: i } } : {}));
      await wait(650);
      const p = Math.round(((i + 1) / rows) * 100);
      setX4(x => (x.busy ? { busy: { ...x.busy, run: -1, done: i + 1, pc: p } } : {}));
    }
    await wait(300);
    const list = getS().XSC;
    const base = list.find(x => x.s === k);
    if (!base) {
      setX4({ busy: null });
      return;
    }
    const id = 'n' + Date.now();
    const d = today();
    const scan = { ...base, id, d: fmtShort(d) + ' ' + d.getFullYear(), isNew: true, src: (kd === 'pdf' ? 'Your PDF' : 'Your scan') + ' · ' + base.src };
    setS({ XSC: [scan, ...getS().XSC] });
    setX4({ busy: null });
    toast('Scan ready · ' + base.ins.length + ' insights found', 'xray');
    setX4({ cur: 0 });
    push('xray', id);
  },
  x4Lens: v => setX4({ lens: v ?? 'all' }),
  x4Ins: i => x4OpenSheet(Number(i)),
  x4Open: () => x4OpenSheet(getS().x4.cur),
  x4Nav: d => {
    const n = scanBy(getS().x4.scan).ins.length;
    setX4(x => ({ cur: Math.max(0, Math.min(n - 1, x.cur + Number(d))) }));
    x4ScrollTo(getS().x4.cur);
  },
  x4Step: d => {
    const n = scanBy(getS().x4.scan).ins.length;
    const i = Math.max(0, Math.min(n - 1, getS().x4.cur + Number(d)));
    setX4({ tab: 0 });
    x4OpenSheet(i);
    x4ScrollTo(i);
  },
  x4Tab: t => {
    const nt = Number(t);
    const old = getS().x4.tab;
    // `if (!b) return` happens after S.x4.tab is set (L10041)
    setX4({ tab: nt, dx: nt >= old ? 14 : -14 });
  },
  x4Mcq: k => {
    const sc = scanBy(getS().x4.scan);
    const key = sc.id + ':' + getS().x4.cur;
    // navigator.vibrate (L10045) is not ported: no haptics (CONTRACT.md section 10)
    setX4(x => ({ mcq: { ...x.mcq, [key]: k === 'r' ? 'r' : Number(k) } }));
  },
  x4McqReset: () => {
    const sc = scanBy(getS().x4.scan);
    const key = sc.id + ':' + getS().x4.cur;
    setX4(x => {
      const mcq = { ...x.mcq };
      delete mcq[key];
      return { mcq };
    });
  },
  x4Save: () => toast('Insight saved to Notes › ' + subN(scanBy(getS().x4.scan).s), 'bookmark'),
  x4Ask: () => {
    closeSheet();
    setTimeout(() => fns.openMentor?.(), 300);
  },
  x4Quiz: () => {
    setX4({ tab: 2 });
    x4OpenSheet(0);
  },
  x4Term: k => openSheet('xrayTerm', { arg: decodeURIComponent(k ?? '') }),
  x4Flash: k => {
    closeSheet();
    toast('“' + decodeURIComponent(k ?? '') + '” added to your flashcards', 'layers');
  },
  x4Coach: () => setX4({ coach: false }),
  x4Aa: () => {
    const fs = (getS().x4.fs + 1) % 3;
    setX4({ fs });
    toast(['Standard text', 'Larger text', 'Largest text'][fs], 'type');
  },
};

/** back() wrapper L10058-L10060: closing the reader closes its sheet. The library and the Learn card re-render from the store. */
export const x4Hooks: ShellHooks = {
  afterBack: t => {
    if (t.id === 'xray') closeSheet();
  },
};
