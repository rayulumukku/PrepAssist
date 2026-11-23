// Source: PrepAssist.html L8170-L8174 (A.syOpen, A.sySt, A.syP, A.syReset, A.syTopic, A.syDrill, A.syMains, A.syFilter)
import type { HandlerMap } from '../../../actions/types';
import { closeSheet, openSheet, push, toast } from '../../../navigation/nav';
import { setS } from '../../../store';

export const syHandlers: HandlerMap = {
  syOpen: i => {
    if (i === undefined) return;
    const idx = Number(i);
    setS(s => ({
      syl: {
        ...s.syl,
        open: { ...s.syl.open, [idx]: !s.syl.open[idx] },
      },
    }));
  },
  sySt: k => {
    if (!k) return;
    setS(s => ({
      syl: {
        ...s.syl,
        st: s.syl.st === k && k !== 'All' ? 'All' : k,
      },
    }));
  },
  syP: p => {
    closeSheet();
    if (!p) return;
    setS(s => ({
      syl: { ...s.syl, p },
    }));
  },
  syReset: () => {
    setS(s => ({
      syl: { ...s.syl, q: '', st: 'All', p: 'All' },
    }));
  },
  syTopic: n => {
    if (n) openSheet('syllabusTopic', { arg: n, tall: true });
  },
  syDrill: () => {
    closeSheet();
    push('quiz');
    toast('AI drill · 10 questions on this topic', 'bolt');
  },
  syMains: () => {
    closeSheet();
    push('answerbank');
  },
  syFilter: () => {
    openSheet('syllabusFilter');
  },
};
