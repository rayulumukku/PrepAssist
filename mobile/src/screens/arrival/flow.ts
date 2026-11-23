// Source: PrepAssist.html L5896-L5985 (setIntro, introNext, authTab, submitAuth, verified, resend)
// Source: PrepAssist.html L5783-L5794 (runBook)
// Source: PrepAssist.html L5806-L5819 (openBook)
// Source: PrepAssist.html L5820-L5831 (turnPage)
// Source: PrepAssist.html L5833-L5840 (bookExit)
// Source: PrepAssist.html L5616-L5627 (go: the intro / auth / verify resets), L6984-L6992 (the A entries)
// The logic of the arrival stage (book, intro, auth and verify), working on the store instead of the DOM.
import { closeSheet, go, openSheet, toast } from '../../navigation/nav';
import { getS, setS } from '../../store';
import type { AuthFieldId } from '../../store/slices/arrival';
import { sfx } from './sfx';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

// ---------------- book ----------------

let autoT: ReturnType<typeof setTimeout> | undefined;
let bookExitT: ReturnType<typeof setTimeout> | undefined;

/** runBook() L5783-L5794 */
export function runBook(): void {
  if (autoT) clearTimeout(autoT);
  if (bookExitT) clearTimeout(bookExitT);
  autoT = undefined;
  bookExitT = undefined;
  setS(s => ({
    bkStep: 0,
    bkRun: s.bkRun + 1,
    bk: {
      ready: true,
      opened: false,
      close: false,
      readyCtl: false,
      revealed: 0,
      auto: 0,
      exit: false,
    },
  }));
}

/** openBook() L5806-L5819 */
export function openBook(): void {
  const s = getS();
  if (s.bkStep !== 0) return;
  sfx('cover');
  setS(st => ({
    bkStep: 1,
    bk: {
      ...st.bk,
      opened: true,
      close: true,
      readyCtl: true,
      revealed: 1,
    },
  }));
  startAutoNext();
}

/** turnPage(fromP, dur) L5820-L5831 */
export function turnPage(): void {
  const s = getS();
  if (s.bkStep === 0) {
    openBook();
    return;
  }
  if (s.bkStep >= 4) {
    bookExit();
    return;
  }
  sfx('page');
  const next = s.bkStep + 1;
  setS(st => ({
    bkStep: next,
    bk: {
      ...st.bk,
      revealed: Math.max(st.bk.revealed, next),
      auto: st.bk.auto + 1,
    },
  }));
  startAutoNext();
}

/** bookNext() L6984: stopAuto(); turnPage(); */
export function bookNext(): void {
  stopAuto();
  turnPage();
}

/** bookPrev() */
export function bookPrev(): void {
  const s = getS();
  if (s.bkStep <= 1) return;
  stopAuto();
  sfx('page');
  const prev = s.bkStep - 1;
  setS(st => ({
    bkStep: prev,
    bk: {
      ...st.bk,
      auto: st.bk.auto + 1,
    },
  }));
  startAutoNext();
}

/** bookReplay() L6984: runBook() */
export function bookReplay(): void {
  stopAuto();
  runBook();
}

/** bookExit(arg) L5833-L5840 */
export function bookExit(): void {
  const s = getS();
  if (s.bk.exit) return;
  if (s.bkStep >= 1) sfx('page');
  stopAuto();
  setS(st => ({ bk: { ...st.bk, exit: true } }));
  if (bookExitT) clearTimeout(bookExitT);
  bookExitT = setTimeout(() => {
    setS(st => ({ bk: { ...st.bk, exit: false } }));
    go('auth');
  }, 520);
}

/** toggleSound() L6984 */
export function toggleSound(): void {
  const cur = getS().SFX.on;
  setS(s => ({ SFX: { ...s.SFX, on: !cur } }));
  if (!cur) sfx('page');
}

/** autoNext() L5798-L5805 */
export function startAutoNext(delay = 3500): void {
  stopAuto();
  const s = getS();
  if (s.stage !== 'book' || s.bkStep >= 4) return;
  autoT = setTimeout(() => {
    const cur = getS();
    if (cur.stage === 'book' && cur.bkStep < 4) {
      turnPage();
    }
  }, delay);
}

export function stopAuto(): void {
  if (autoT) {
    clearTimeout(autoT);
    autoT = undefined;
  }
}

// ---------------- intro ----------------

/** setIntro(i, fresh) L5896-L5907 */
export function setIntro(i: number, fresh?: boolean): void {
  const intro = Math.max(0, Math.min(3, i));
  setS(s => ({ intro, introFresh: fresh ? s.introFresh + 1 : s.introFresh }));
}

/** introNext() L5908 */
export function introNext(): void {
  if (getS().intro === 3) go('auth');
  else setIntro(getS().intro + 1);
}

// ---------------- auth ----------------

let focusT: ReturnType<typeof setTimeout> | undefined;

/** authTab(m) L5919-L5927. The focus of #upName 400 ms later is done by the stage (authFocus). */
export function authTab(m: string | undefined): void {
  const mode = m ?? '';
  setS(s => ({
    authMode: mode,
    authTries: 0,
    authFormIn: s.authFormIn + 1,
  }));
  if (focusT) clearTimeout(focusT);
  if (mode === 'up') {
    focusT = setTimeout(() => setS(s => ({ authFocus: s.authFocus + 1 })), 400);
  }
}

const IN_IDS: AuthFieldId[] = ['inEmail', 'inPw'];
const UP_IDS: AuthFieldId[] = ['upName', 'upPhone', 'upEmail', 'upPw', 'upPw2'];

/** submitAuth(kind) L5955-L5968 */
export async function submitAuth(kind: 'in' | 'up'): Promise<void> {
  const ids = kind === 'in' ? IN_IDS : UP_IDS;
  const f = getS().authF;
  const empty = ids.filter(id => !f[id].trim());
  const tries0 = getS().authTries === 0;
  // ids.forEach(id => el.classList.toggle('err', empty.includes(id) && S.authTries === 0))
  setS(s => ({
    authErr: [...s.authErr.filter(id => !ids.includes(id)), ...ids.filter(id => empty.includes(id) && tries0)],
  }));
  if (empty.length && tries0) {
    setS(s => ({ authTries: s.authTries + 1 }));
    toast('Fill in the highlighted fields — or tap again to use demo details', 'x');
    return;
  }
  if (kind === 'up' && f.upPw && f.upPw2 && f.upPw !== f.upPw2) {
    setS(s => ({ authErr: s.authErr.includes('upPw2') ? s.authErr : [...s.authErr, 'upPw2'] }));
    toast('Passwords don’t match', 'x');
    return;
  }
  setS(s => ({ authErr: s.authErr.filter(id => !ids.includes(id)) }));
  const email = f[kind === 'in' ? 'inEmail' : 'upEmail'].trim() || 'divya.sharma@gmail.com';
  setS(s => ({ user: { ...s.user, email } }));
  if (kind === 'up') {
    const n = f.upName.trim() || 'Divya Sharma';
    setS(s => ({ user: { ...s.user, name: n, first: n.split(' ')[0] } }));
  }
  // f.classList.add('signing') (+ .pen-row.signing): the pen's penW2 animation
  setS(s => ({ authSigning: s.authSigning + 1 }));
  await wait(1300);
  go('verify');
}

/** A.forgotSend L6988 */
export function forgotSend(): void {
  closeSheet();
  toast('Reset link sent — check your inbox', 'mail');
}

/** A.social L6989 */
export async function social(p: string | undefined): Promise<void> {
  toast('Continuing with ' + p + '…', null);
  await wait(1000);
  go('app');
}

// ---------------- verify ----------------

/** verified() L5972-L5978 */
export async function verified(): Promise<void> {
  setS({ vfDone: true });
  await wait(1100);
  go('app');
}

let resendT: ReturnType<typeof setInterval> | undefined;

/** resend() L5979-L5985 */
export function resend(): void {
  if (getS().resendN > 0) return;
  toast('A new link is on its way to ' + getS().user.email, 'mail');
  let n = 30;
  setS({ resendN: n });
  if (resendT) clearInterval(resendT);
  resendT = setInterval(() => {
    n--;
    setS({ resendN: Math.max(0, n) });
    if (n <= 0 && resendT) {
      clearInterval(resendT);
      resendT = undefined;
    }
  }, 1000);
}

/** A.changeEmail L6991 */
export function changeEmail(): void {
  setS({ newEmail: getS().user.email });
  openSheet('changeEmail');
}

/** A.emailSave L6992 */
export function emailSave(): void {
  const email = getS().newEmail || getS().user.email;
  setS(s => ({ user: { ...s.user, email } }));
  closeSheet();
  toast('Link sent to ' + email, 'mail');
}

/** go(name) L5620-L5623: the book / intro / verify resets. */
export function onStageArrival(stage: string): void {
  if (stage === 'book') runBook();
  if (stage === 'intro') setIntro(0, true);
  if (stage === 'verify') setS({ vfDone: false });
}

/** Tests: stop the timers of this module. */
export function __resetFlowTimers(): void {
  if (focusT) clearTimeout(focusT);
  if (resendT) clearInterval(resendT);
  if (autoT) clearTimeout(autoT);
  if (bookExitT) clearTimeout(bookExitT);
  focusT = undefined;
  resendT = undefined;
  autoT = undefined;
  bookExitT = undefined;
}
