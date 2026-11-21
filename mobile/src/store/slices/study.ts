// Study slice: OWNED BY THE STUDY WORKSTREAM (lesson, courses, course, note, mindmap, mindmaps,
// calendar, plan, article, saved; mentor sheet, search sheet, edition calendar sheet).
// Seeded with the fields of the prototype's `S` that those views and handlers use, plus the DOM state
// of those views that handlers change from outside the component (the HTML keeps it in the DOM).
import type { InitialState, StateMapsItem } from '../../data/initialState';
import type { SavedLink } from '../../screens/study/maps/mapsLogic';

export interface StudySlice {
  /** S.saved (L5130): saved ARTICLES ids. Also read by the Current tab. */
  saved: Set<string>;
  /** S.savedLinks (L7649 block): links added with A.svSave (L8176), newest first. */
  savedLinks: SavedLink[];
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
  // --- pages group fields (lesson, courses, course, note, calendar, plan) ---
  /**
   * DOM state of the Study Calendar page that A.calDay (L7034) changes: which `.cal-strip` button has
   * `.on`, and whether `#calSlots` is dimmed (opacity .3 for 180 ms). `key` = the page entry it belongs to.
   */
  calPage: { key: number; on: number; dim: boolean } | null;
  /**
   * DOM state of the plan page that A.planGo (L7031) changes: 'busy' = #planGo shows the spinner label,
   * 'done' = #planBody holds planResult(). `key` = the page entry it belongs to.
   */
  planPage: { key: number; step: 'busy' | 'done' } | null;
  // --- end pages group fields ---
  // --- maps group fields (mindmap, mindmaps, saved, saved add-link sheet, edition calendar) ---
  /** #mmNote after A.mm(i) (L7028): the branch picked and a counter that restarts the .xr-pop animation. */
  mmPick: { i: number; n: number };
  /** #mmIn value on the AI Mindmaps page (A.mmTry writes it, A.mmGo reads it). */
  mmIn: string;
  /** #mmBusy (L8210): the topic being mapped, or null when the box is empty. */
  mmBusy: string | null;
  /** #svUrl / #svT of the Save a link sheet (L8175), read by A.svSave. */
  svUrl: string;
  svT: string;
  /** S.ca.view (L7599): first day of the month the edition calendar shows. */
  caView: Date;
  /** S.ca.tmp (L7599): the day picked in the edition calendar, applied by A.caDone. */
  caTmp: Date;
  // --- end maps group fields ---
}

export function createStudySlice(seed: InitialState): StudySlice {
  return {
    saved: new Set<string>(seed.saved),
    savedLinks: seed.savedLinks as SavedLink[],
    mlog: seed.mlog,
    ctxOn: seed.ctxOn,
    mctx: undefined,
    arSize: seed.arSize,
    maps: seed.maps,
    // --- pages group seeds ---
    calPage: null,
    planPage: null,
    // --- end pages group seeds ---
    // --- maps group seeds ---
    mmPick: { i: 5, n: 0 },
    mmIn: '',
    mmBusy: null,
    svUrl: '',
    svT: '',
    caView: new Date(0),
    caTmp: new Date(0),
    // --- end maps group seeds ---
  };
}
