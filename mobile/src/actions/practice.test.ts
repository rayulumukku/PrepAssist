// Behaviour of the practice handlers (PrepAssist.html L6703-L6709, L6996-L7003, L7030-L7033, L7629,
// L8136-L8165, L8217-L8225).
import { QUIZ } from '../data';
import { setClockOverride } from '../env/clock';
import { __resetNavTimers, back, closeAllPages, go } from '../navigation/nav';
import { getS, resetStore, setS } from '../store';
import { act, fns } from './index';
import { __practiceForTest, mainsRender } from './practice';

jest.useFakeTimers();

beforeEach(() => {
  __resetNavTimers();
  closeAllPages(true);
  resetStore();
  setClockOverride('2026-10-24T09:41:00+05:30');
  go('app');
});

const top = () => getS().stack[getS().stack.length - 1];

describe('quiz', () => {
  it('jump/quiz starts a fresh quiz with a running timer that back() stops (L6493)', () => {
    act('jump', 'quiz');
    expect(top().id).toBe('quiz');
    expect(getS().quiz).toMatchObject({ i: 0, sel: {}, sub: {}, done: false, showRes: false });
    const t = getS().quizTick;
    jest.advanceTimersByTime(3000);
    expect(getS().quizTick).toBe(t + 3);
    back();
    expect(__practiceForTest.quizTimerRunning()).toBe(false);
  });

  it('closeAllPages stops the timer (L6498)', () => {
    fns.startQuiz?.(true);
    expect(__practiceForTest.quizTimerRunning()).toBe(true);
    closeAllPages();
    expect(__practiceForTest.quizTimerRunning()).toBe(false);
  });

  it('opt, submit, next, results, review', () => {
    fns.startQuiz?.(true);
    const r0 = getS().quizRender;
    act('qSubmit'); // submitting with nothing selected is what the disabled button prevents; the handler itself does not check
    setS({ quiz: { ...getS().quiz!, sub: {} } });
    act('opt:2');
    expect(getS().quiz!.sel[0]).toBe(2);
    expect(getS().quizRender).toBeGreaterThan(r0);
    act('qSubmit');
    act('opt:1'); // locked after submit
    expect(getS().quiz!.sel[0]).toBe(2);
    act('qPrev'); // at 0: nothing
    expect(getS().quiz!.i).toBe(0);
    for (let k = 0; k < 20; k++) act('qNext');
    expect(getS().quiz!.i).toBe(QUIZ.length - 1);
    act('qResults');
    expect(getS().quiz).toMatchObject({ showRes: true, done: true });
    act('qGo:3');
    expect(getS().quiz).toMatchObject({ showRes: false, i: 3 });
  });

  it('quizClose toasts only with progress and not after results (L6997)', () => {
    fns.startQuiz?.(true);
    act('quizClose');
    expect(getS().toast.on).toBe(false);
    fns.startQuiz?.(true);
    act('opt:1');
    act('qSubmit');
    act('quizClose');
    expect(getS().toast).toMatchObject({ on: true, msg: 'Progress saved — resume anytime' });
  });

  it('A.quiz resumes an unfinished quiz (startQuiz(false))', () => {
    fns.startQuiz?.(true);
    act('opt:1');
    act('qNext');
    back();
    act('quiz');
    expect(getS().quiz).toMatchObject({ i: 1, sel: { 0: 1 } });
  });

  it('engineGo pops the engine page after 1300 ms and starts a quiz', () => {
    act('push:engine');
    act('engineGo');
    expect(getS().engBusy).toBe(top().key);
    jest.advanceTimersByTime(1300);
    return Promise.resolve().then(() => {
      expect(top().id).toBe('quiz');
      expect(getS().toast.msg).toBe('10 questions generated around your weak areas');
    });
  });
});

describe('mains evaluation', () => {
  it('needs a page, then opens lowCredits on the free 10 credits; mForce runs the demo evaluation', async () => {
    act('jump', 'mains');
    mainsRender(); // the panel's mount
    expect(top().id).toBe('mains');
    act('mvRun');
    expect(getS().toast.msg).toBe('Add at least one page of your answer');
    act('mvAdd');
    act('mvAdd');
    expect(getS().mv.pages).toBe(2);
    act('mvRun');
    expect(getS().sheet).toMatchObject({ key: 'lowCredits' });
    expect(getS().me.credits).toBe(10);
    act('mForce');
    expect(getS().mvProcRows).toBe(0);
    expect(getS().mvProcSteps[3]).toBe('Comparing with your notes');
    for (let i = 0; i < 5; i++) {
      await jest.advanceTimersByTimeAsync(560);
      expect(getS().mvProcRows).toBe(i + 1);
    }
    await jest.advanceTimersByTimeAsync(350);
    expect(getS().mvDone).toBe(top().key);
    expect(getS().mv.pages).toBe(0);
    expect(getS().toast.msg).toBe('Evaluation ready · 20 credits used');
  });

  it('mvRun with enough credits charges 20 and writes the ledger', () => {
    act('jump', 'mains');
    mainsRender(); // the panel's mount
    setS(s => ({ me: { ...s.me, credits: 50 } }));
    act('mvAdd');
    act('mvRun');
    expect(getS().me.credits).toBe(30);
    expect(getS().me.ledger[0]).toEqual({ t: 'AI Mains evaluation', d: '24 Oct', v: -20 });
  });

  it('mvAdd stops at 4 pages with a toast, mvDel, mvMode, mvLim, mvCtx', () => {
    act('jump', 'mains');
    mainsRender(); // the panel's mount
    for (let i = 0; i < 5; i++) act('mvAdd');
    expect(getS().mv.pages).toBe(4);
    expect(getS().toast.msg).toBe('Up to 4 pages per answer');
    act('mvDel');
    expect(getS().mv.pages).toBe(3);
    act('mvMode:type');
    act('mvLim:300');
    act('mvCtx:notes');
    expect(getS().mv).toMatchObject({ mode: 'type', limit: 300, notes: false });
  });

  it('mainsWith pushes mains with the question, or refreshes it when mains is on top', () => {
    act('push:answerbank');
    act('mainsWith:mq2');
    expect(top().id).toBe('mains');
    expect(getS().mv.limit).toBe(150);
    const n = getS().stack.length;
    act('mainsWith:mq1');
    expect(getS().stack.length).toBe(n);
    expect(getS().mv.limit).toBe(250);
  });

  it('modelOpen toggles per page', () => {
    act('push:answer:mq1');
    act('modelOpen:abModel');
    expect(getS().modelOpen[`${top().key}:abModel`]).toBe(true);
    act('modelOpen:abModel');
    expect(getS().modelOpen[`${top().key}:abModel`]).toBe(false);
  });
});

describe('pqb and test series', () => {
  it('pick, nav, lang, reset, history sheet and pqGo', () => {
    act('push:pqb');
    act('pqPick:2');
    expect(getS().pqb).toMatchObject({ sel: { 0: 2 }, done: 1 });
    act('pqNav:1');
    act('pqNav:-1');
    act('pqNav:-1');
    expect(getS().pqb.i).toBe(0);
    act('pqLang:hi');
    expect(getS().pqb.lang).toBe('hi');
    act('pqHist');
    expect(getS().sheet.key).toBe('pqbAttempts');
    act('pqGo:5');
    expect(getS().pqb.i).toBe(5);
    act('pqReset');
    expect(getS().pqb).toMatchObject({ sel: {}, i: 0, done: 0 });
    expect(getS().toast.msg).toBe('Progress reset · starting from question 1');
  });

  it('tqPick, tqGo builds a mock into the library', async () => {
    act('push:testquiz');
    act('tqGo'); // no file: nothing
    expect(getS().tq.busy).toBe(false);
    act('tqPick');
    expect(getS().tq.file).toEqual({ n: 'Mock_Test_13_GS1_English.pdf', pg: 48, sz: '6.2 MB' });
    act('tqGo');
    expect(getS().tqBusyRows).toBe(0);
    await jest.advanceTimersByTimeAsync(650 * 4 + 400);
    expect(getS().tq).toMatchObject({ tab: 'lib', file: null, busy: false });
    expect(getS().tq.lib[0]).toEqual({ t: 'Mock Test 13 · GS Paper I', q: 100, best: 0, att: 0, d: '24 Oct', lang: 'English' });
    act('tqStart:1');
    expect(getS().tq.lib[1].att).toBe(3);
    expect(top().id).toBe('quiz');
  });

  it('answer bank filters', () => {
    act('abP:GS II');
    act('abLang:hi');
    act('abOpen:mq1');
    expect(getS().ab).toEqual({ lang: 'hi', p: 'GS II', open: { mq1: true } });
  });
});
