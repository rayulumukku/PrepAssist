// Practice slice: OWNED BY THE PRACTICE WORKSTREAM (quiz, qbank, pqb, testquiz, engine, tests, history,
// mains, mainsResult, answerbank, answer, pastevals).
// The fields of the prototype's `S` that those views and handlers use, with the prototype's names, plus
// the DOM state the HTML keeps in elements (named with a trailing comment saying which element).
import type { InitialState, StateMv, StateTqLibItem } from '../../data/initialState';
import type { QuizState } from '../../screens/practice/logic/quiz';

/** S.pqb (L7650). `sel` maps a question index to the picked option. */
export interface PqbState {
  i: number;
  sel: Record<number, number>;
  lang: string;
  done: number;
}

/** S.tq (L7651) */
export interface TqState {
  tab: string;
  file: { n: string; pg: number; sz: string } | null;
  lang: string;
  busy: boolean;
  lib: StateTqLibItem[];
}

/** S.ab (L7656) */
export interface AbState {
  lang: string;
  p: string;
  open: Record<string, boolean>;
}

export interface PracticeSlice {
  /** S.quiz (L5131): null until startQuiz (L6703). */
  quiz: QuizState | null;
  /** Increments on every renderQuiz() (L6711): the HTML rebuilds the quiz page (el.innerHTML), so the screen remounts. */
  quizRender: number;
  /** Increments once a second while S.quiz.timer runs (L6708): the #qzTime text. */
  quizTick: number;
  /** S.mainsQ (L5132) */
  mainsQ: string;
  /** S.pages (L5132) */
  pages: number;
  /** S.pqb (L7650) */
  pqb: PqbState;
  /** Increments on every pqRedraw() (L8094): the pqb page is rebuilt (p.el.innerHTML). */
  pqRender: number;
  /** S.tq (L7651) */
  tq: TqState;
  /** #tqBusy (L8148): -1 = empty; otherwise how many of the four `.tq-s` rows have `.ok`. */
  tqBusyRows: number;
  /** S.mv (L7652-L7655) */
  mv: StateMv;
  /** #mvRun (L8219): -1 = the pen CTA; otherwise how many of the five `.tq-s` rows have `.ok`. */
  mvProcRows: number;
  /** Rows of the mv-proc box, fixed when mvProcess() starts (the fourth depends on S.mv.notes then). */
  mvProcSteps: string[];
  /** entryKey of the mains page that mvProcess() swapped in place to the evaluation report (L8223); 0 = none. */
  mvDone: number;
  /** S.ab (L7656) */
  ab: AbState;
  /** S.mains (created L6657 by the older VIEWS.mains mount; read by A.mPick / mStep / mAdd / mSubmit). */
  mains: { step: number; q: string; pages: number } | undefined;
  /** entryKey of the engine page whose #engGo shows the spinner (A.engineGo L7030); 0 = none. */
  engBusy: number;
  /** `.model.open` of #abModel / #evModel (A.modelOpen L7026). */
  modelOpen: Record<string, boolean>;
}

export function createPracticeSlice(seed: InitialState): PracticeSlice {
  return {
    quiz: seed.quiz,
    quizRender: 0,
    quizTick: 0,
    mainsQ: seed.mainsQ,
    pages: seed.pages,
    pqb: { ...seed.pqb, sel: {} },
    pqRender: 0,
    tq: { ...seed.tq, file: null, lib: seed.tq.lib.map(x => ({ ...x })) },
    tqBusyRows: -1,
    mv: { ...seed.mv },
    mvProcRows: -1,
    mvProcSteps: [],
    mvDone: 0,
    ab: { ...seed.ab, open: {} },
    mains: undefined,
    engBusy: 0,
    modelOpen: {},
  };
}
