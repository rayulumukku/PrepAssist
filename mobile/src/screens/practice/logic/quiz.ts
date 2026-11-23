// Pure logic of the quiz (PrepAssist.html L6703-L6778): the state shape of S.quiz, the timer text, the
// option / progress-bar classes and the results arithmetic of renderResults().
import type { QuizItem } from '../../../data/practice';

/** S.quiz (L6704). `timer` (the interval id) is not state: it lives in actions/practice.ts. */
export interface QuizState {
  i: number;
  sel: Record<number, number>;
  sub: Record<number, true>;
  t0: number;
  done: boolean;
  showRes: boolean;
}

export const newQuiz = (t0: number): QuizState => ({ i: 0, sel: {}, sub: {}, t0, done: false, showRes: false });

/** fmtT (L6710): mm:ss of an elapsed time in ms. */
export const fmtT = (ms: number): string => {
  const s = Math.floor(ms / 1000);
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
};

/** Class of one `.qz-bar i` (L6719). */
export function barClass(Q: QuizState, quiz: readonly QuizItem[], k: number): '' | 'cur' | 'ok' | 'bad' | 'ans' {
  if (k === Q.i) return 'cur';
  if (Q.sub[k]) return Q.sel[k] === quiz[k].a ? 'ok' : 'bad';
  return Q.sel[k] != null ? 'ans' : '';
}

/** Class and mark of one option (L6726-L6728). */
export function optState(Q: QuizState, q: QuizItem, k: number): { c: '' | 'sel' | 'ok' | 'bad'; mk: '' | 'check' | 'x' } {
  const sel = Q.sel[Q.i];
  if (Q.sub[Q.i]) {
    if (k === q.a) return { c: 'ok', mk: 'check' };
    if (k === sel) return { c: 'bad', mk: 'x' };
    return { c: '', mk: '' };
  }
  return { c: sel === k ? 'sel' : '', mk: '' };
}

export interface QuizResults {
  correct: number;
  attempted: number;
  /** `${…}%` of the Accuracy cell */
  accuracy: number;
  /** the UPSC marks cell, with U+2212 for a negative value */
  marks: string;
  verdict: string;
}

/** renderResults() arithmetic (L6747-L6753). */
export function quizResults(Q: QuizState, quiz: readonly QuizItem[]): QuizResults {
  const correct = quiz.filter((q, k) => Q.sub[k] && Q.sel[k] === q.a).length;
  const attempted = Object.keys(Q.sub).length;
  const m = correct * 2 - (attempted - correct) * 0.66;
  return {
    correct,
    attempted,
    accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
    marks: (m >= 0 ? '+' : '−') + Math.abs(m).toFixed(1),
    verdict:
      correct >= 8
        ? 'Excellent — Writs are no longer a weak area.'
        : correct >= 5
        ? 'Solid. The traps were mostly in statement-type questions.'
        : 'A useful baseline. Revise writs and try again tomorrow.',
  };
}

/** Class of one `.res-dots i` (L6755). */
export const dotClass = (Q: QuizState, quiz: readonly QuizItem[], k: number): 'sk' | 'ok' | 'bad' =>
  !Q.sub[k] ? 'sk' : Q.sel[k] === quiz[k].a ? 'ok' : 'bad';
