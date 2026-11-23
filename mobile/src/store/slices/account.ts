// Account slice: OWNED BY THE ACCOUNT WORKSTREAM (account, wallet, payments, upgrade, settings, status,
// legal, onestep, the profile-related sheets, purchase sheet, plan-change overlay).
// Seeded with the fields of the prototype's `S` that those views and handlers use, plus STS.
import type { InitialState, StateMe, StateMeLedgerItem } from '../../data/initialState';
import { STS } from '../../data/onestep';

/** One S.me.payments row, as applyBuy writes it (L7466). */
export interface Payment {
  t: string;
  amt: number;
  d: string;
  m: string;
  id: string;
  /** buyItem(...).id: 'pro' | 'ultimate' | 'vault' | 'pack' */
  k: string;
}

/** S.me (L7106-L7117) with the fields the generator could only see empty retyped. */
export interface Me extends Omit<StateMe, 'payments' | 'plan'> {
  plan: 'free' | 'pro' | 'ultimate';
  payments: Payment[];
  ledger: StateMeLedgerItem[];
}

/** STS (L8510): `on` is the state; nodes and timers are runtime audio objects kept in actions/account. */
export interface StepSound {
  on: boolean;
}

/** The purchase sheet's step: buyHTML(kind, id, step) with step undefined | 'wait' | 'done' (L7441-L7459). */
export type BuyStep = 'confirm' | 'wait' | 'done';

/** One plan-change overlay (.pm-ov) appended to #app by planMagic (L10753-L10764). */
export interface PlanMagic {
  /** increases per call, so a second overlay is a new element */
  n: number;
  p: 'free' | 'pro' | 'ultimate';
  /** the 22 sparks' random numbers, drawn once when the overlay is created */
  sparks: readonly { tx: number; ty: number; s: number; d: number }[];
  /** .out added at 2500 ms */
  out: boolean;
}

export interface AccountSlice {
  /**
   * S.me (L7106-L7117): plan, credits, vault, settings toggles, payments, ledger.
   * S.me.plan is the plan; the THEME follows it through the base field `planTheme` (see setPlanTheme).
   */
  me: Me;
  /** STS (L8510): One more step sound on/off (A.stepSnd L8546). */
  STS: StepSound;
  /** The purchase sheet: which step `#sheet` shows (byPay rewrites #sheet in place, L7611). */
  buyStep: BuyStep;
  /** The plan-change overlays currently in #app (normally zero or one). */
  planMagic: readonly PlanMagic[];
  /** VIEWS.status mount (L7551-L7556) restarts when the page is refreshed (A.ssRerun -> refreshTop). */
  ssRun: number;
  /** One more step: the `.go` class on .st-wrap is re-added by A.stepReplay (L8545). */
  stepRun: number;
}

export function createAccountSlice(seed: InitialState): AccountSlice {
  return {
    me: { ...seed.me, plan: seed.me.plan as Me['plan'], payments: [], ledger: seed.me.ledger.map(x => ({ ...x })) },
    STS: { on: STS.on },
    buyStep: 'confirm',
    planMagic: [],
    ssRun: 0,
    stepRun: 0,
  };
}
