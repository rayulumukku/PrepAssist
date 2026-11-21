// Handlers of the study workstream: lesson, courses, course, note, mindmap, mindmaps, calendar, plan, article, saved and the mentor, search and edition-calendar sheets.
// OWNED BY THE STUDY WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "study", named exactly like the verb and ported from the handler source the map points to.
// The handler bodies of the page groups live next to their screens (pure modules, no import of
// src/actions at load); this file merges them.
import { closeSheet, openSheet, push, setTopArg, toast } from '../navigation/nav';
import { handlers as mapsHandlers } from '../screens/study/maps/handlers';
import { handlers as pagesHandlers } from '../screens/study/pages/handlers';
import { ctxToggle, mentorAskAct, mentorSend, openMentor } from '../sheets/study/mentor/mentorFlow';
import { getS, setS } from '../store';
import type { CrossFns, HandlerMap, ShellHooks } from './types';

/** toggleSave(id) L6357-L6361. The save buttons and the Learn tab re-render from S.saved. */
export function toggleSave(id: string): void {
  if (getS().saved.has(id)) {
    setS(s => {
      const saved = new Set(s.saved);
      saved.delete(id);
      return { saved };
    });
    toast('Removed from saved', 'bookmark');
  } else {
    setS(s => ({ saved: new Set(s.saved).add(id) }));
    toast('Saved to your library', 'bookmark');
  }
}

export const handlers: HandlerMap = {
  ...pagesHandlers,
  ...mapsHandlers,
  /** A.mentor L7015 */
  mentor: () => openMentor(),
  /** A.mentorAsk L7015 */
  mentorAsk: q => mentorAskAct(q ?? ''),
  /** mentorSend L6867 (A.mentorSend L7015) */
  mentorSend: () => mentorSend(),
  /** A.ctxToggle L7016 */
  ctxToggle: () => ctxToggle(),
  /** cmdk L6937-L6938 (A.cmdk L7010) */
  cmdk: () => openSheet('search', { tall: true }),
  /** A.save = toggleSave L7017 */
  save: id => {
    if (id !== undefined) toggleSave(id);
  },
  /** A.article L6995 */
  article: id => {
    closeSheet();
    if (id !== undefined) push('article', id);
  },
  /** A.arSize L7604. The open reader's .ar-body follows S.arSize. */
  arSize: () => {
    const n = (getS().arSize % 3) + 1;
    setS(s => ({ arSize: n, me: { ...s.me, bigText: n > 1 } }));
    toast(['Standard text', 'Larger text', 'Largest text'][n - 1], 'type');
  },
  /** A.arNext L7605: the reader swaps its article in place (p.arg = id; innerHTML; articleMount). */
  arNext: id => {
    if (id === undefined) return;
    if (!getS().stack.length) return push('article', id);
    setTopArg(id);
  },
};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {
  openMentor: (prefill?: string) => openMentor(prefill),
};
