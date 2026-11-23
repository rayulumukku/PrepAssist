// Query your Database handlers: A.qdSubj … A.qdGo (PrepAssist.html L8200-L8206).
// `qdb` / `qdbAsk` (L7029) belong to the first querydb view (L6563-L6564), which VIEWS.querydb (L7974) replaces: dead, not ported.
// The HTML reads #qdKb / #qdIn from the DOM; here the screen hands the value over as `el` ({ value }), and
// A.qdAsk writes the dock input through the registered input (the HTML sets `$('#qdIn').value`).
import type { HandlerMap } from '../../../actions/types';
import { MONS } from '../../../data';
import { today } from '../../../env/clock';
import { openSheet, toast } from '../../../navigation/nav';
import { getS, setS } from '../../../store';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));
const fmtShort = (d: Date): string => d.getDate() + ' ' + MONS[d.getMonth()];

interface QdInput {
  get(): string;
  set(v: string): void;
}
let input: QdInput | null = null;
/** The dock's input (#qdIn) registers itself while mounted. */
export function registerQdInput(i: QdInput | null): void {
  input = i;
}

const setQ = (p: Partial<ReturnType<typeof getS>['qdb2']>): void => setS(s => ({ qdb2: { ...s.qdb2, ...p } }));

export const qdHandlers: HandlerMap = {
  qdSubj: s => setQ({ subj: s ?? '' }),
  qdAdd: (_a, el) => {
    const v = (((el as { value?: string } | undefined)?.value) ?? '').trim();
    if (v.length < 12) {
      toast('Paste a little more text first', 'x');
      return;
    }
    setQ({ items: [...getS().qdb2.items, v.length > 120 ? v.slice(0, 118) + '…' : v] });
    toast('Added to your knowledge base', 'check');
  },
  qdRm: i => setQ({ items: getS().qdb2.items.filter((_, k) => k !== Number(i)) }),
  qdAsk: q => {
    input?.set(q ?? '');
    qdHandlers.qdGo(undefined, { value: q ?? '' });
  },
  qdGo: async (_a, el) => {
    const q = ((el as { value?: string } | undefined)?.value ?? input?.get() ?? '').trim();
    if (!q) {
      toast('Type a topic to generate notes on', 'x');
      return;
    }
    const me = getS().me;
    if (me.credits < 4) {
      openSheet('lowCredits');
      return;
    }
    setS(s => ({ me: { ...s.me, credits: s.me.credits - 4, ledger: [{ t: 'Query your Database · ' + q.slice(0, 24), d: fmtShort(today()), v: -4 }, ...s.me.ledger] } }));
    // `$('#qdOut').innerHTML = <div class="qd-wait">…`: kept in S.qdb2.busy (seeded, unused by the HTML) until refreshTop
    setQ({ busy: true });
    await wait(1300);
    setQ({ out: { q, subj: getS().qdb2.subj }, busy: false });
  },
};
