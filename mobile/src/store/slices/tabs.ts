// Tabs slice: OWNED BY THE TABS WORKSTREAM (home, learn, practice, current, menu, profile, reels viewer).
// Seeded with the fields of the prototype's `S` that the tab renderers and their handlers use. Add
// fields here (and to createTabsSlice) as you port; keep the prototype's names. Retype the seeded
// fields when the generated type is too narrow (the generator only saw the initial values).
import type { InitialState, StateCa } from '../../data/initialState';

export interface TabsSlice {
  /** S.fcLang (L5127): flashcard language. */
  fcLang: string;
  /** S.fc (L5127): flashcard index. */
  fc: number;
  /** S.hero (L5128): announcement carousel index. S.heroTimer is an interval id and is not state. */
  hero: number;
  /** S.toolGroup (L5131) */
  toolGroup: string;
  /** S.revDone (L5132): REVISIONS ids marked done. */
  revDone: Set<string>;
  /** S.ca (L5130, extended L7104): Current tab filters, edition date and read set (retyped: read holds ids; tmp and view are set by caCal L7599, study area). */
  ca: TabsCa;
  /** S.menuQ (L7649): Menu search text. */
  menuQ: string;
  /** S.reelSeen (created L6369): REELS ids that were opened. */
  reelSeen: Set<string>;
  /** S.learnF (created L6964; dead code in the final UI, see reference/README.md). */
  learnF: string | undefined;
  /** S.px (created L7019): 'pre' | 'mains' on the Practice tab. */
  px: string | undefined;
  // ---- DOM state of the tab panes (not fields of S) ----
  /** animateHome() L6010 runs: bumped 60 ms after each setTab('home'); the Home bars grow to data-w / data-h on it. */
  homeAnim: number;
  /** renderHome() reruns (L7012, L7013): the Home content is rebuilt, so the bars start again from 0. */
  homeGen: number;
  /** #fc.flip (A.flip L7005, cleared by setFc L6160). */
  fcFlip: boolean;
  /** #reelV.on and RV (L6367): open, reel index i, slide index j. */
  reel: { on: boolean; i: number; j: number };
}

export type TabsCa = Omit<StateCa, 'read'> & { read: Set<string>; tmp?: Date; view?: Date };

export function createTabsSlice(seed: InitialState): TabsSlice {
  return {
    fcLang: seed.fcLang,
    fc: seed.fc,
    hero: seed.hero,
    toolGroup: seed.toolGroup,
    revDone: new Set<string>(seed.revDone),
    ca: { ...seed.ca, read: new Set<string>() },
    menuQ: seed.menuQ,
    reelSeen: new Set<string>(),
    learnF: undefined,
    px: undefined,
    homeAnim: 0,
    homeGen: 0,
    fcFlip: false,
    reel: { on: false, i: 0, j: 0 },
  };
}
