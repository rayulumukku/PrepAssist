// Types of the action registry. FROZEN.
import type { StackEntry } from '../store/slices/base';
import type { Stage, TabId } from '../navigation/routes';

/**
 * One entry of the prototype's `A` (PrepAssist.html L6963). It is called as fn(arg, el): `arg` is the
 * text after the FIRST colon of data-act, always a string or undefined. `el` is the clicked element in
 * the HTML; here it is whatever the calling component passes as the third argument of act() (see
 * CONTRACT.md "handlers that used el").
 */
export type Handler = (arg: string | undefined, el?: unknown) => unknown;

/** Verb -> handler. Each area file exports one; actions/index.ts merges them. */
export type HandlerMap = Record<string, Handler>;

/**
 * Places where the prototype's shell functions call into area code. Each area file exports a
 * (possibly empty) ShellHooks; every hook of every area runs, in area order.
 */
export interface ShellHooks {
  /** go(name), L5620-L5623: runBook() / setIntro(0,true) / the auth and verify resets. Runs after S.stage is set. */
  onStage?: (stage: Stage) => void;
  /** renderAll(), L5988-L6001: runs once, on the first go('app'), after S.rendered is set (initHero and the like). */
  onRenderAll?: () => void;
  /** setTab(tab), L6007-L6008: animateHome() / pxSpy(). Runs after the pages are closed. */
  onTab?: (tab: TabId) => void;
  /** back() wrappers that act BEFORE the pop (L8549: onestep stops its sound). `top` is the page about to close. */
  beforeBack?: (top: StackEntry) => void;
  /** back() L6493 and the wrappers that act AFTER the pop (L8373 note2, L10059 xray). `prev` is the new top, if any. */
  afterBack?: (top: StackEntry, prev: StackEntry | undefined) => void;
  /** closeAllPages(), L6498: `if (S.quiz) clearInterval(S.quiz.timer)`. */
  onCloseAllPages?: () => void;
}

/**
 * Functions of one area that base or another area calls directly in the HTML (not through data-act).
 * The providing area exports them in `fns`; callers use `fns.name?.(…)` from actions/index.ts.
 * To add one without editing this frozen file, merge into this interface from your own area file:
 *   declare module './types' { interface CrossFns { myFn(x: string): void } }
 */
export interface CrossFns {
  /** startQuiz(timed), L6703-L6709 (practice). Called by A.jump('quiz') (L6977). */
  startQuiz(timed: boolean): void;
  /** openMentor(prefill), L6846-L6861 (study). Called by A.jump('mentor') and openTool('mentor'). */
  openMentor(prefill?: string): void;
  /** sfx(name), L5700 (arrival). Called by A.meTog (L7622, account). */
  sfx(name: string): void;
}
