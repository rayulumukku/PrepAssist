// Practice slice: OWNED BY THE PRACTICE WORKSTREAM (quiz, qbank, pqb, testquiz, engine, tests, history,
// mains, mainsResult, answerbank, answer, pastevals).
// Seeded with the fields of the prototype's `S` that those views and handlers use. Add fields here
// (and to createPracticeSlice) as you port; keep the prototype's names. Retype the seeded fields when
// the generated type is too narrow (the generator only saw the initial values: `quiz` and `mains`
// are objects once a quiz or an evaluation starts).
import type { InitialState, StateAb, StateMv, StatePqb, StateTq } from '../../data/initialState';

export interface PracticeSlice {
  /** S.quiz (L5131): null until startQuiz (L6703). Retype when porting. */
  quiz: unknown;
  /** S.mainsQ (L5132) */
  mainsQ: string;
  /** S.pages (L5132) */
  pages: number;
  /** S.pqb (L7650) */
  pqb: StatePqb;
  /** S.tq (L7651) */
  tq: StateTq;
  /** S.mv (L7652-L7655) */
  mv: StateMv;
  /** S.ab (L7656) */
  ab: StateAb;
  /** S.mains (created L6657). Retype when porting. */
  mains: unknown;
}

export function createPracticeSlice(seed: InitialState): PracticeSlice {
  return {
    quiz: seed.quiz,
    mainsQ: seed.mainsQ,
    pages: seed.pages,
    pqb: seed.pqb,
    tq: seed.tq,
    mv: seed.mv,
    ab: seed.ab,
    mains: undefined,
  };
}
