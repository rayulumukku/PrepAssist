// Source: PrepAssist.html L7028 (A.mm), L8208-L8213 (A.mmTry, A.mmGo, A.mmOpen), L8175-L8178 (A.svAdd, A.svSave, A.svRm, A.svRmL), L7599-L7603 (A.caCal, A.caPick, A.caMon, A.caRecent, A.caDone)
// Handlers of the study area's maps group. Merged into src/actions/study.ts. Must not import src/actions at load.
// refreshTop() / refreshAll() / renderLearn() / renderCurrent() of the HTML are store-driven re-renders here.
import type { HandlerMap } from '../../../actions/types';
import { isoD, parseD, today } from '../../../env/clock';
import { closeSheet, openSheet, push, toast } from '../../../navigation/nav';
import { scrollTab } from '../../../shell/tabScroll';
import { getS, setS } from '../../../store';
import { fmtShort } from '../common/current';
import { makeSavedLink } from './mapsLogic';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

/** A.mmGo (L8209) */
async function mmGo(): Promise<void> {
  const t = getS().mmIn.trim();
  if (!t) {
    toast('Enter a topic to map', 'x');
    return;
  }
  const me = getS().me;
  if (me.credits < 3) {
    openSheet('lowCredits');
    return;
  }
  setS(s => ({
    me: { ...s.me, credits: s.me.credits - 3, ledger: [{ t: 'AI Mindmap · ' + t, d: fmtShort(today()), v: -3 }, ...s.me.ledger] },
    mmBusy: t,
  }));
  await wait(1600);
  // S.maps.unshift(…); refreshTop() redraws the mindmaps page (empty input, empty #mmBusy); then push
  setS(s => ({ maps: [{ t, d: fmtShort(today()), n: 6, id: t }, ...s.maps], mmBusy: null, mmIn: '' }));
  push('mindmap', t);
}

export const handlers: HandlerMap = {
  mm: i => setS(s => ({ mmPick: { i: Number(i), n: s.mmPick.n + 1 } })),
  mmTry: t => {
    setS({ mmIn: t ?? '' });
    mmGo().catch(() => undefined);
  },
  mmGo: () => {
    mmGo().catch(() => undefined);
  },
  mmOpen: i => {
    const m = getS().maps[Number(i)];
    push('mindmap', m.id);
  },

  svAdd: () => {
    setS({ svUrl: '', svT: '' });
    openSheet('savedAddLink');
  },
  svSave: () => {
    const s = getS();
    const link = makeSavedLink(s.svUrl, s.svT, today());
    if (!link) {
      toast('Paste a full link starting with https://', 'x');
      return;
    }
    setS(x => ({ savedLinks: [link, ...x.savedLinks] }));
    closeSheet();
    toast('Link saved', 'bookmark');
  },
  svRm: id => {
    setS(s => {
      const saved = new Set(s.saved);
      saved.delete(id ?? '');
      return { saved };
    });
    toast('Removed from saved', 'bookmark');
  },
  svRmL: i => setS(s => ({ savedLinks: s.savedLinks.filter((_, k) => k !== Number(i)) })),

  caCal: () => {
    const tmp = parseD(getS().ca.date);
    setS({ caTmp: tmp, caView: new Date(tmp.getFullYear(), tmp.getMonth(), 1) });
    openSheet('editionCalendar');
  },
  caPick: d => {
    const tmp = parseD(d ?? '');
    setS({ caTmp: tmp, caView: new Date(tmp.getFullYear(), tmp.getMonth(), 1) });
  },
  caMon: n => {
    const v = getS().caView;
    const nv = new Date(v.getFullYear(), v.getMonth() + Number(n), 1);
    if (nv > today()) return;
    setS({ caView: nv });
  },
  caRecent: () => {
    setS(s => ({ ca: { ...s.ca, date: isoD(today()) } }));
    closeSheet();
    toast('Showing today’s edition', 'current');
  },
  caDone: () => {
    setS(s => ({ ca: { ...s.ca, date: isoD(s.caTmp) } }));
    closeSheet();
    scrollTab('current', 0);
  },
};
