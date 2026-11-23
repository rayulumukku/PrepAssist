// Arrival slice: OWNED BY THE ARRIVAL WORKSTREAM (book, intro, auth, verify).
// Seeded with the fields of the prototype's `S` that the arrival handlers use, plus SFX. Add fields
// here (and to createArrivalSlice) as you port; keep the prototype's names. Retype the seeded fields
// when the generated type is too narrow (the generator only saw the initial values).
import { SFX } from '../../data/book';
import type { Sfx } from '../../data/book';
import type { InitialState } from '../../data/initialState';

export interface ArrivalSlice {
  /** S.intro (L5128): current intro slide. */
  intro: number;
  /** S.authMode (L5128): 'in' | 'up'. */
  authMode: string;
  /** S.authTries (L5128) */
  authTries: number;
  /** SFX (L5688): `on` is toggled by A.sound (L6984) and A.meTog (L7622). ctx/buf are runtime audio objects, not state. */
  SFX: Sfx;
}

export function createArrivalSlice(seed: InitialState): ArrivalSlice {
  return {
    intro: seed.intro,
    authMode: seed.authMode,
    authTries: seed.authTries,
    SFX: { ...SFX },
  };
}
