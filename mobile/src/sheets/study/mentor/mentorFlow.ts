// Source: PrepAssist.html L6846-L6861 (openMentor), L6867 (mentorSend), L6868-L6881 (mentorAsk), L7015-L7016 (A.mentor, A.mentorAsk, A.ctxToggle)
// The mentor's behaviour. The HTML builds #mnBody once per openMentor and then appends to it; here
// that body is S.mnView (one per opening, tagged with the sheet's open counter `n`), so the sheet
// component only draws it. The random reply delay (900-1400 ms) is kept.
import { openSheet, toast } from '../../../navigation/nav';
import { getS, setS } from '../../../store';
import { ctx, reply } from './mentorLogic';
import type { MentorCtx, MentorState } from './mentorLogic';

/** One entry of S.mlog: the HTML stores the u + a markup (L6877); this keeps the same parts. */
export interface MlogEntry {
  q: string;
  /** The `.who` text after "PrepAssist" (' · using …'), frozen at answer time like the HTML string. */
  using: string;
  /** reply(q) markup. */
  html: string;
}

export type MnItem =
  | { k: 'u'; q: string }
  | { k: 'typing'; id: number }
  | { k: 'a'; using: string; html: string; fresh: boolean };

/** The DOM of one opened mentor sheet. */
export interface MnView {
  /** S.sheet.n of the openSheet() that built it (a new opening is a new #mnBody). */
  n: number;
  /** .mn-intro shown (mlog was empty at open time and nothing was asked yet). */
  intro: boolean;
  /** .mn-chips row (rendered only when the sheet opened with a non-empty log, L6853). */
  chips: boolean;
  items: MnItem[];
  /** Scroll request: 'end' = scrollTop = scrollHeight; 'lastU' = smooth to the last .msg-u minus 12. */
  scroll: { kind: 'end' | 'lastU'; seq: number };
}

const state = (): MentorState => {
  const s = getS();
  return { stack: s.stack, tab: s.tab, quiz: s.quiz as MentorState['quiz'], mctx: s.mctx as MentorCtx | undefined };
};

let typingSeq = 0;

/** `$('#mnBody')`: the mentor body exists while the sheet's content is the mentor of this view. */
function liveView(): MnView | null {
  const s = getS();
  const v = s.mnView as MnView | null;
  return v && s.sheet.key === 'mentor' && s.sheet.n === v.n ? v : null;
}

/** openMentor(prefill) L6846-L6861 */
export function openMentor(prefill?: string): void {
  const c = ctx(state());
  setS({ mctx: c });
  openSheet('mentor', { tall: true });
  const s = getS();
  const log = s.mlog as MlogEntry[];
  const items: MnItem[] = log.flatMap(m => [
    { k: 'u' as const, q: m.q },
    { k: 'a' as const, using: m.using, html: m.html, fresh: false },
  ]);
  setS({ mnView: { n: s.sheet.n, intro: !log.length, chips: log.length > 0, items, scroll: { kind: 'end', seq: 1 } }, mnIn: '' });
  if (prefill) setTimeout(() => mentorAsk(prefill), 350);
}

const update = (n: number, f: (v: MnView) => MnView): void =>
  setS(s => {
    const v = s.mnView as MnView | null;
    return v && v.n === n ? { mnView: f(v) } : {};
  });

/** mentorAsk(q) L6868-L6881 */
export async function mentorAsk(q: string): Promise<void> {
  const v = liveView();
  if (!v) return openMentor(q);
  const n = v.n;
  const id = ++typingSeq;
  const empty = !(getS().mlog as MlogEntry[]).length;
  update(n, x => ({
    ...x,
    intro: empty ? false : x.intro,
    items: [...(empty ? [] : x.items), { k: 'u', q }, { k: 'typing', id }],
    scroll: { kind: 'end', seq: x.scroll.seq + 1 },
  }));
  await new Promise<void>(r => setTimeout(r, 900 + Math.random() * 500));
  const s = getS();
  const c = s.mctx as MentorCtx | undefined;
  const using = s.ctxOn && c ? ' · using ' + c.label.split(' · ')[0].toLowerCase() : '';
  const html = reply(q, state());
  update(n, x => {
    // `$('#typing').remove()`: the first typing indicator in the body
    const k = x.items.findIndex(it => it.k === 'typing');
    const items = k < 0 ? [...x.items] : [...x.items.slice(0, k), ...x.items.slice(k + 1)];
    items.push({ k: 'a', using, html, fresh: true });
    return { ...x, items, scroll: { kind: 'lastU', seq: x.scroll.seq + 1 } };
  });
  setS(st => ({ mlog: [...(st.mlog as MlogEntry[]), { q, using, html }] }));
}

/** A.mentorAsk (L7015): open the sheet first when the mentor body is not showing. */
export function mentorAskAct(q: string): void {
  if (!liveView() || !getS().sheet.on) openMentor(q);
  else mentorAsk(q).catch(() => undefined);
}

/** mentorSend() L6867 */
export function mentorSend(): void {
  const v = (getS().mnIn as string).trim();
  if (!v) return;
  setS({ mnIn: '' });
  mentorAsk(v).catch(() => undefined);
}

/** A.ctxToggle L7016 */
export function ctxToggle(): void {
  setS(s => ({ ctxOn: !s.ctxOn }));
  toast(getS().ctxOn ? 'Mentor will use what you’re looking at' : 'Context off — general answers', null);
}
