// Handlers of the arrival workstream: book, intro, auth, verify and the forgot / changeEmail sheets.
// OWNED BY THE ARRIVAL WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "arrival", named exactly like the verb and ported from the handler source the map points to
// (PrepAssist.html L6984-L6992). The logic lives in screens/arrival (flow.ts, book/engine.ts, sfx.ts).
//
// Not here, on purpose:
//   eye     A.eye (L6986) flips one input's type and rewrites its label; that element-local state is
//           kept by the shared Field component (src/components/Field.tsx), which handles the tap itself.
//   target  A.target (L7042) is unreachable from any UI (owner decision: dead code, not ported).
import { go, openSheet } from '../navigation/nav';
import {
  authTab,
  changeEmail,
  emailSave,
  forgotSend,
  introNext,
  onStageArrival,
  resend,
  setIntro,
  social,
  submitAuth,
  verified,
} from '../screens/arrival/flow';
import { sfx } from '../screens/arrival/sfx';
import { getS } from '../store';
import type { CrossFns, HandlerMap, ShellHooks } from './types';

export const handlers: HandlerMap = {
  // L6984
  introNext: () => introNext(),
  introPrev: () => setIntro(getS().intro - 1),
  introGo: i => setIntro(Number(i)),
  introSkip: () => go('auth'),
  // L6985
  authTab: m => authTab(m),
  signin: () => submitAuth('in'),
  signup: () => submitAuth('up'),
  // L6987-L6992
  forgot: () => openSheet('forgot'),
  forgotSend: () => forgotSend(),
  social: p => social(p),
  verified: () => verified(),
  resend: () => resend(),
  changeEmail: () => changeEmail(),
  emailSave: () => emailSave(),
};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {
  // go(name) L5620-L5623
  onStage: stage => {
    onStageArrival(stage);
  },
};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {
  sfx,
};
