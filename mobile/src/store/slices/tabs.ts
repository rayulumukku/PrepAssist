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
  /** S.ca (L5130, extended L7104): Current tab filters, edition date and read set. */
  ca: StateCa;
  /** S.menuQ (L7649): Menu search text. */
  menuQ: string;
  /** S.reelSeen (created L6369): REELS ids that were opened. */
  reelSeen: Set<string>;
  /** S.learnF (created L6964; dead code in the final UI, see reference/README.md). */
  learnF: string | undefined;
  /** S.px (created L7019): 'pre' | 'mains' on the Practice tab. */
  px: string | undefined;
}

export function createTabsSlice(seed: InitialState): TabsSlice {
  return {
    fcLang: seed.fcLang,
    fc: seed.fc,
    hero: seed.hero,
    toolGroup: seed.toolGroup,
    revDone: new Set<string>(seed.revDone),
    ca: seed.ca,
    menuQ: seed.menuQ,
    reelSeen: new Set<string>(),
    learnF: undefined,
    px: undefined,
  };
}
