import { ANSWERBANK, MAINSQ, PQB, QUIZ } from '../../../data';
import { fmtShort, mainsWithFor, mvAddPages, mvRunBlock, resultQuestion, wcPct, wordCount } from './mains';
import { enIN, pqbAttempts, pqbNav, pqbOptClass, pqbPick, pqbProgress, pqbQuestion, pqbSubtitle } from './pqb';
import { barClass, dotClass, fmtT, newQuiz, optState, quizResults } from './quiz';

describe('fmtT (L6710)', () => {
  it('formats elapsed ms as mm:ss, flooring seconds', () => {
    expect(fmtT(0)).toBe('00:00');
    expect(fmtT(999)).toBe('00:00');
    expect(fmtT(9_400)).toBe('00:09');
    expect(fmtT(61_000)).toBe('01:01');
    expect(fmtT(3_600_000)).toBe('60:00');
  });
});

describe('quiz state classes (L6719, L6726-L6728)', () => {
  it('marks the current, answered, correct and wrong bars', () => {
    const Q = { ...newQuiz(0), i: 2, sel: { 0: QUIZ[0].a, 1: (QUIZ[1].a + 1) % 4, 3: 0 }, sub: { 0: true, 1: true } as Record<number, true> };
    expect([0, 1, 2, 3, 4].map(k => barClass(Q, QUIZ, k))).toEqual(['ok', 'bad', 'cur', 'ans', '']);
  });
  it('shows sel before submit, ok/bad marks after', () => {
    const q = QUIZ[0];
    const before = { ...newQuiz(0), sel: { 0: 3 } };
    expect(optState(before, q, 3)).toEqual({ c: 'sel', mk: '' });
    expect(optState(before, q, q.a)).toEqual({ c: '', mk: '' });
    const after = { ...before, sub: { 0: true } as Record<number, true> };
    expect(optState(after, q, q.a)).toEqual({ c: 'ok', mk: 'check' });
    expect(optState(after, q, 3)).toEqual({ c: 'bad', mk: 'x' });
    expect(optState(after, q, 0)).toEqual({ c: '', mk: '' });
  });
});

describe('quizResults (L6747-L6753)', () => {
  // the reference capture view-quiz-results: picks a, a+1, a+2, a, a, a+2, a, a, a+2, a
  const picks = [0, 1, 2, 0, 0, 2, 0, 0, 2, 0].map((d, k) => (QUIZ[k].a + d) % 4);
  const Q = { ...newQuiz(0), sel: { ...picks }, sub: Object.fromEntries(picks.map((_, k) => [k, true])) as Record<number, true> };
  it('scores 6 / 10 with +9.4 UPSC marks', () => {
    expect(quizResults(Q, QUIZ)).toEqual({
      correct: 6,
      attempted: 10,
      accuracy: 60,
      marks: '+9.4',
      verdict: 'Solid. The traps were mostly in statement-type questions.',
    });
    expect(QUIZ.map((_, k) => dotClass(Q, QUIZ, k))).toEqual(['ok', 'bad', 'bad', 'ok', 'ok', 'bad', 'ok', 'ok', 'bad', 'ok']);
  });
  it('uses a minus sign and 0% when nothing is right', () => {
    const W = { ...newQuiz(0), sel: { 0: (QUIZ[0].a + 1) % 4 }, sub: { 0: true } as Record<number, true> };
    expect(quizResults(W, QUIZ)).toMatchObject({ correct: 0, accuracy: 0, marks: '−0.7', verdict: 'A useful baseline. Revise writs and try again tomorrow.' });
    expect(quizResults(newQuiz(0), QUIZ)).toMatchObject({ attempted: 0, accuracy: 0, marks: '+0.0' });
    expect(dotClass(newQuiz(0), QUIZ, 0)).toBe('sk');
  });
});

describe('pqb (L8069-L8094, L8136-L8141)', () => {
  it('cycles questions and reports accuracy', () => {
    const P = { i: PQB.length + 1, sel: {}, lang: 'en' };
    expect(pqbQuestion(P, PQB)).toBe(PQB[1]);
    expect(pqbSubtitle(P, PQB)).toBe('Adaptive · start anywhere');
    const p1 = pqbPick({ i: 0, sel: {}, lang: 'en' }, PQB[0].a);
    expect(p1.done).toBe(1);
    const p2 = pqbPick({ i: 1, sel: p1.sel, lang: 'en' }, (PQB[1].a + 1) % 4);
    expect(pqbSubtitle({ i: 1, sel: p2.sel, lang: 'en' }, PQB)).toBe('Adaptive · 50% accuracy');
    expect(pqbAttempts(p2.sel, PQB).map(a => [a.i, a.ok, a.pts])).toEqual([
      [0, true, '+2'],
      [1, false, '−0.66'],
    ]);
    expect(pqbAttempts(p2.sel, PQB)[0].title).toBe(`Q1 · ${PQB[0].topic}`);
    expect(pqbAttempts(p2.sel, PQB)[0].sub).toBe(PQB[0].q.slice(0, 64) + '…');
  });
  it('option classes after a pick', () => {
    const P = { i: 0, sel: { 0: (PQB[0].a + 1) % 4 }, lang: 'en' };
    expect(pqbOptClass(P, PQB[0], PQB[0].a)).toBe('ok');
    expect(pqbOptClass(P, PQB[0], (PQB[0].a + 1) % 4)).toBe('bad');
    expect(pqbOptClass(P, PQB[0], (PQB[0].a + 2) % 4)).toBe('dim');
    expect(pqbOptClass({ ...P, sel: {} }, PQB[0], 0)).toBe('');
  });
  it('navigates, never below 0, and formats en-IN numbers', () => {
    expect(pqbNav(0, -1)).toBe(0);
    expect(pqbNav(3, 1)).toBe(4);
    expect(pqbProgress(0)).toBeCloseTo(Math.max(1.2, (1 / 8790) * 4000));
    expect(enIN(8790)).toBe('8,790');
    expect(enIN(123456789)).toBe('12,34,56,789');
    expect(enIN(12)).toBe('12');
  });
});

describe('mains (L7865-L7887, L8106, L8156, L8163, L6804-L6807)', () => {
  it('counts words and caps the meter', () => {
    expect(wordCount('')).toBe(0);
    expect(wordCount('  a  b\nc ')).toBe(3);
    expect(wcPct(40, 300)).toBeCloseTo(13.333, 2);
    expect(wcPct(400, 300)).toBe(100);
  });
  it('blocks mvRun in the HTML order', () => {
    expect(mvRunBlock({ q: ' ', mode: 'hand', pages: 0, typed: '' })).toEqual({ msg: 'Add the question first', icon: 'x' });
    expect(mvRunBlock({ q: 'q', mode: 'hand', pages: 0, typed: '' })).toEqual({ msg: 'Add at least one page of your answer', icon: 'camera' });
    expect(mvRunBlock({ q: 'q', mode: 'type', pages: 0, typed: 'one two' })).toEqual({ msg: 'Type at least 20 words to evaluate', icon: 'x' });
    expect(mvRunBlock({ q: 'q', mode: 'hand', pages: 2, typed: '' })).toBeNull();
  });
  it('mainsWith sets the question and a word limit of at least 150', () => {
    expect(mainsWithFor('mq2', ANSWERBANK, MAINSQ)).toEqual({ q: MAINSQ[1].t, limit: 150 });
    expect(mainsWithFor('mq1', ANSWERBANK, MAINSQ)).toEqual({ q: MAINSQ[0].t, limit: 250 });
    expect(mainsWithFor('nope', ANSWERBANK, MAINSQ)).toEqual({ q: '', limit: 250 });
  });
  it('mainsResultHTML question: default MAINSQ[0] with 310 words, else 96 % of the limit', () => {
    expect(resultQuestion({ q: MAINSQ[0].t, limit: 250 }, ANSWERBANK, MAINSQ)).toMatchObject({ p: 'GS II', m: 15, words: 310, custom: false });
    expect(resultQuestion({ q: '', limit: 250 }, ANSWERBANK, MAINSQ)).toMatchObject({ words: 310, custom: false });
    expect(resultQuestion({ q: ` ${ANSWERBANK[0].t} `, limit: 250 }, ANSWERBANK, MAINSQ)).toMatchObject({ p: ANSWERBANK[0].p, m: ANSWERBANK[0].m, words: 240, custom: true });
    expect(resultQuestion({ q: 'My own question', limit: 300 }, ANSWERBANK, MAINSQ)).toEqual({ p: 'GS II', m: 15, t: 'My own question', words: 288, custom: true });
  });
  it('mvAdd stops at 4 pages; fmtShort', () => {
    expect(mvAddPages(3)).toBe(4);
    expect(mvAddPages(4)).toBeNull();
    expect(fmtShort(new Date(2026, 9, 24))).toBe('24 Oct');
  });
});
