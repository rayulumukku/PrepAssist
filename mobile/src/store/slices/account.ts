// Account slice: OWNED BY THE ACCOUNT WORKSTREAM (account, wallet, payments, upgrade, settings, status,
// legal, onestep, the profile-related sheets, purchase sheet, plan-change overlay).
// Seeded with the fields of the prototype's `S` that those views and handlers use, plus STS. Add
// fields here (and to createAccountSlice) as you port; keep the prototype's names. Retype the seeded
// fields when the generated type is too narrow (the generator only saw the initial values:
// `me.payments` is empty at start).
import type { InitialState, StateMe } from '../../data/initialState';
import { STS } from '../../data/onestep';
import type { Sts } from '../../data/onestep';

export interface AccountSlice {
  /**
   * S.me (L7106-L7117): plan, credits, vault, settings toggles, payments, ledger.
   * S.me.plan is the plan; the THEME follows it through the base field `planTheme` (see setPlanTheme).
   */
  me: StateMe;
  /** STS (L8510): One more step sound state. `on` is toggled by A.stepSnd (L8546); nodes/timers are runtime audio objects, not state. */
  STS: Sts;
}

export function createAccountSlice(seed: InitialState): AccountSlice {
  return {
    me: seed.me,
    STS: { ...STS },
  };
}
