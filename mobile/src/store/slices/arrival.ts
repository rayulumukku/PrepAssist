// Arrival slice: OWNED BY THE ARRIVAL WORKSTREAM (book, intro, auth, verify).
// Seeded with the fields of the prototype's `S` that the arrival handlers use, plus SFX, plus the DOM
// state of the arrival stages that the handlers read or write (input values, .err, .done, the resend
// countdown, the book's classes). Keep the prototype's names where it has one.
import { SFX } from '../../data/book';
import type { Sfx } from '../../data/book';
import type { InitialState } from '../../data/initialState';

/** The ids of the auth inputs (L4953-L4962). */
export type AuthFieldId = 'inEmail' | 'inPw' | 'upName' | 'upPhone' | 'upEmail' | 'upPw' | 'upPw2';

/** The classes runBook / openBook / turnPage / bookExit put on #s-book and #bkCtl (L5783-L5840). */
export interface BookClasses {
  /** .ready (60 ms after runBook) */
  ready: boolean;
  /** .opened (openBook) */
  opened: boolean;
  /** .close (700 ms into openBook) */
  close: boolean;
  /** .ready-ctl (when the camera has arrived) */
  readyCtl: boolean;
  /** .on1 … .on4 (reveal(n)): the highest n revealed */
  revealed: number;
  /** .auto (the 3 s auto-advance bar); the number restarts its animation */
  auto: number;
  /** .exit (bookExit) */
  exit: boolean;
}

export interface ArrivalSlice {
  /** S.intro (L5128): current intro slide. */
  intro: number;
  /** Bumped by setIntro(i, true): the vignettes take their state without a transition (the stage was display:none). */
  introFresh: number;
  /** S.authMode (L5128): 'in' | 'up'. */
  authMode: string;
  /** S.authTries (L5128) */
  authTries: number;
  /** SFX (L5688): `on` is toggled by A.sound (L6984) and A.meTog (L7622) (replace the object). ctx / buf are
   *  runtime audio objects, kept in screens/arrival/sfx.ts. */
  SFX: Sfx;
  /** input.value of the auth inputs (L4953-L4962: #inEmail and #inPw come prefilled). */
  authF: Record<AuthFieldId, string>;
  /** input.err (submitAuth L5958, L5960) */
  authErr: AuthFieldId[];
  /** Bumped when submitAuth adds .signing (L5965): restarts the pen's penW2 animation. */
  authSigning: number;
  /** Bumped by authTab('up'): #upName.focus() 400 ms later (L5926). */
  authFocus: number;
  /** Bumped by authTab: the form that gets .on replays formIn (L439). */
  authFormIn: number;
  /** #vf.done (verified L5974, cleared by go('verify') L5623) */
  vfDone: boolean;
  /** #btnResend countdown (resend L5979-L5985): 0 = "Resend link", n > 0 = "Resend in ns" and aria-disabled. */
  resendN: number;
  /** #newEmail.value of the changeEmail sheet (L6923), read by A.emailSave (L6992). */
  newEmail: string;
  /** BK.step (L5736): 0 = closed, 1..4 = page shown. */
  bkStep: number;
  /** Bumped by runBook: the stage rebuilds its leaves (buildBook L5737). */
  bkRun: number;
  /** #s-book classes */
  bk: BookClasses;
}

export const BOOK_CLASSES_0: BookClasses = {
  ready: false,
  opened: false,
  close: false,
  readyCtl: false,
  revealed: 0,
  auto: 0,
  exit: false,
};

export const AUTH_FIELDS_0: Record<AuthFieldId, string> = {
  inEmail: 'divya.sharma@gmail.com',
  inPw: 'prelims2027',
  upName: '',
  upPhone: '',
  upEmail: '',
  upPw: '',
  upPw2: '',
};

export function createArrivalSlice(seed: InitialState): ArrivalSlice {
  return {
    intro: seed.intro,
    introFresh: 0,
    authMode: seed.authMode,
    authTries: seed.authTries,
    SFX: { ...SFX },
    authF: { ...AUTH_FIELDS_0 },
    authErr: [],
    authSigning: 0,
    authFocus: 0,
    authFormIn: 0,
    vfDone: false,
    resendN: 0,
    newEmail: seed.user.email,
    bkStep: 0,
    bkRun: 0,
    bk: { ...BOOK_CLASSES_0 },
  };
}
