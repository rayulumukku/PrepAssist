// Source: PrepAssist.html L8006, L8045-L8065 (A.nrJump, A.nrSave, A.nrDl, A.nrTest, A.nrNext)
// Source: PrepAssist.html L7997 (A.nsSubj), L8192 (A.nsSplit), L8330 (A.nhTab, A.nhS), L8270 (A.lxScanNote)
import type { HandlerMap } from '../../../actions/types';
import { NOTESYS } from '../../../data';
import { back, openSheet, push, toast } from '../../../navigation/nav';
import { getS, setS } from '../../../store';

export const nsHandlers: HandlerMap = {
  nsSubj: s => {
    if (s !== undefined) setS(st => ({ nsys: { ...st.nsys, subj: s } }));
  },
  nsSplit: () => {
    openSheet('trackerSplitPdf');
  },
  nrJump: () => {
    // Handled by reader scroller
  },
  nrSave: id => {
    if (!id) return;
    const has = getS().nsSaved.has(id);
    setS(s => {
      const nsSaved = new Set(s.nsSaved);
      if (has) nsSaved.delete(id);
      else nsSaved.add(id);
      return { nsSaved };
    });
    toast(has ? 'Removed from saved' : 'Saved to your library', 'bookmark');
  },
  nrDl: id => {
    const item = NOTESYS.find(x => x.id === id);
    toast((item ? item.t : 'Note') + '.pdf saved to Downloads', 'download');
  },
  nrTest: () => {
    push('quiz');
    toast('5 MCQs from this compendium', 'test');
  },
  nrNext: id => {
    back();
    if (id) setTimeout(() => push('note2', id), 260);
  },
  nhTab: t => {
    if (t) setS(st => ({ nh: { ...st.nh, tab: t as 'mine' | 'fac' } }));
  },
  nhS: s => {
    if (s) setS(st => ({ nh: { ...st.nh, s } }));
  },
};
