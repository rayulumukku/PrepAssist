// Study slice: OWNED BY THE STUDY WORKSTREAM (lesson, courses, course, note, mindmap, mindmaps,
// calendar, plan, article, saved; mentor sheet, search sheet, edition calendar sheet).
// Seeded with the fields of the prototype's `S` that those views and handlers use. Add fields here
// (and to createStudySlice) as you port; keep the prototype's names. Retype the seeded fields when the
// generated type is too narrow (the generator only saw the initial values).
import type { InitialState, StateMapsItem } from '../../data/initialState';

export interface StudySlice {
  /** S.saved (L5130): saved ARTICLES ids. Also read by the Current tab. */
  saved: Set<string>;
  /** S.savedLinks (L7649 block). Retype the item when porting A.svSave (L8176). */
  savedLinks: unknown[];
  /** S.mlog (L5131): mentor conversation. Retype when porting mentorAsk (L6868). */
  mlog: unknown[];
  /** S.ctxOn (L5131) */
  ctxOn: boolean;
  /** S.mctx (created L6847): the context openMentor computed. Retype when porting. */
  mctx: unknown;
  /** S.arSize (L7105): article text size 1-3. */
  arSize: number;
  /** S.maps (L7663 block): generated mindmaps. */
  maps: StateMapsItem[];
}

export function createStudySlice(seed: InitialState): StudySlice {
  return {
    saved: new Set<string>(seed.saved),
    savedLinks: seed.savedLinks,
    mlog: seed.mlog,
    ctxOn: seed.ctxOn,
    mctx: undefined,
    arSize: seed.arSize,
    maps: seed.maps,
  };
}
