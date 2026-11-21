// Handlers of the practice workstream: quiz, qbank, pqb, testquiz, engine, tests, history, mains, mainsResult, answerbank, answer, pastevals.
// OWNED BY THE PRACTICE WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "practice", named exactly like the verb and ported from the handler source the map points to.
// `refreshTop()` / `pqRedraw()` / `renderQuiz()` of the HTML rebuild the page from S; here the screens
// read the store, so a state write is the redraw. Where the HTML rebuilds the element (and so resets its
// scroll and replays its entry animation) the handler bumps a render counter the screen keys on.
import { ANSWERBANK, MAINSQ, PQB, QUIZ } from '../data';
import { nowMs, today } from '../env/clock';
import { back, closeSheet, openSheet, push, toast } from '../navigation/nav';
import { getS, setS } from '../store';
import { fmtShort, mainsWithFor, mvAddPages, mvRunBlock } from '../screens/practice/logic/mains';
import { pqbNav, pqbPick } from '../screens/practice/logic/pqb';
import { newQuiz } from '../screens/practice/logic/quiz';
import type { QuizState } from '../screens/practice/logic/quiz';
import type { CrossFns, HandlerMap, ShellHooks } from './types';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms)); // L5115

// ---------------- quiz (L6703-L6709, L6996-L7003) ----------------

/** S.quiz.timer */
let quizTimer: ReturnType<typeof setInterval> | undefined;
const stopQuizTimer = (): void => {
  if (quizTimer !== undefined) clearInterval(quizTimer);
  quizTimer = undefined;
};

const setQuiz = (f: (q: QuizState) => Partial<QuizState>): void =>
  setS(s => (s.quiz ? { quiz: { ...s.quiz, ...f(s.quiz) } } : {}));

/** renderQuiz() (L6711): the page is rebuilt from S.quiz. */
const renderQuiz = (): void => setS(s => ({ quizRender: s.quizRender + 1 }));

/** startQuiz(fresh) L6703-L6709 */
function startQuiz(fresh: boolean): void {
  const Q = getS().quiz;
  if (fresh || !Q || Q.done) setS({ quiz: newQuiz(nowMs()) });
  else setQuiz(() => ({ showRes: false }));
  push('quiz');
  renderQuiz(); // the view's mount (L6656)
  stopQuizTimer();
  quizTimer = setInterval(() => setS(s => ({ quizTick: s.quizTick + 1 })), 1000);
}

/** qSubmit's `$('.fb').scrollIntoView(...)` 80 ms later (L6999): the quiz screen subscribes. */
type Listener = () => void;
const fbListeners = new Set<Listener>();
export function onQuizFeedback(l: Listener): () => void {
  fbListeners.add(l);
  return () => fbListeners.delete(l);
}
/** pqPick's `$('.pq-ex').scrollIntoView(...)` 60 ms later (L8136). */
const pqExListeners = new Set<Listener>();
export function onPqExplanation(l: Listener): () => void {
  pqExListeners.add(l);
  return () => pqExListeners.delete(l);
}

// ---------------- pqb ----------------

/** pqRedraw (L8094): only when the top page is the pqb page. */
const pqRedraw = (): void => {
  const st = getS().stack;
  const p = st[st.length - 1];
  if (p && p.id === 'pqb') setS(s => ({ pqRender: s.pqRender + 1 }));
};

// ---------------- mains evaluation ----------------

/**
 * VIEWS.mains runs `if (!V.q) V.q = ANSWERBANK[0].t` every time the panel is built (push and every
 * refreshTop, L7865). The screen calls this when it mounts; the handlers that refresh it call it too.
 */
export function mainsRender(): void {
  const st = getS().stack;
  const t = st[st.length - 1];
  if (t && t.id === 'mains' && getS().mvDone !== t.key && !getS().mv.q) setS(x => ({ mv: { ...x.mv, q: ANSWERBANK[0].t } }));
}

/** mvCount (L8106), the oninput of #mvT. */
export function mvCount(v: string): void {
  setS(s => ({ mv: { ...s.mv, typed: v } }));
}
/** `oninput="S.mv.q=this.value"` of #mvQ (L7869). */
export function mvSetQ(v: string): void {
  setS(s => ({ mv: { ...s.mv, q: v } }));
}

const MV_STEP = 560;
/** mvProcess (L8217-L8225) */
async function mvProcess(): Promise<void> {
  const st0 = getS().stack;
  const t0 = st0[st0.length - 1];
  // `const box = $('#mvRun'); if (!box) return;`: #mvRun exists only on the evaluation panel
  if (!t0 || t0.id !== 'mains' || getS().mvDone === t0.key) return;
  const steps = [
    'Reading your handwriting',
    'Mapping content to the syllabus',
    'Checking structure & word count',
    getS().mv.notes ? 'Comparing with your notes' : 'Comparing with model answers',
    'Writing examiner feedback',
  ];
  setS({ mvProcSteps: steps, mvProcRows: 0 });
  for (let i = 0; i < steps.length; i++) {
    await wait(MV_STEP);
    setS({ mvProcRows: i + 1 });
  }
  await wait(350);
  const st = getS().stack;
  const top = st[st.length - 1];
  if (!top || top.id !== 'mains') return;
  // top.id = 'mainsResult'; top.el.innerHTML = pageShell(VIEWS.mainsResult()); animateRubric(top.el)
  setS(s => ({ mvDone: top.key, mvProcRows: -1, mv: { ...s.mv, pages: 0 } }));
  toast('Evaluation ready · 20 credits used', 'check');
}

// ---------------- test series ----------------

const TQ_STEP = 650;

export const handlers: HandlerMap = {
  // quiz
  quiz: () => {
    closeSheet();
    startQuiz(false);
  },
  quizClose: () => {
    const Q = getS().quiz;
    if (Q && Object.keys(Q.sub).length && !Q.done) toast('Progress saved — resume anytime', 'check');
    back();
  },
  opt: k => {
    const Q = getS().quiz;
    if (!Q || Q.sub[Q.i]) return;
    setQuiz(q => ({ sel: { ...q.sel, [q.i]: Number(k) } }));
    renderQuiz();
  },
  qSubmit: () => {
    setQuiz(q => ({ sub: { ...q.sub, [q.i]: true } }));
    renderQuiz();
    setTimeout(() => fbListeners.forEach(l => l()), 80);
  },
  qNext: () => {
    const Q = getS().quiz;
    if (Q && Q.i < QUIZ.length - 1) {
      setQuiz(q => ({ i: q.i + 1 }));
      renderQuiz();
    }
  },
  qPrev: () => {
    const Q = getS().quiz;
    if (Q && Q.i > 0) {
      setQuiz(q => ({ i: q.i - 1 }));
      renderQuiz();
    }
  },
  qResults: () => {
    // renderResults() sets Q.done (L6746)
    setQuiz(() => ({ showRes: true, done: true }));
    renderQuiz();
  },
  qGo: k => {
    setQuiz(() => ({ showRes: false, i: Number(k) }));
    renderQuiz();
  },
  engineGo: async () => {
    const st = getS().stack;
    const t = st[st.length - 1];
    setS({ engBusy: t ? t.key : 0 });
    await wait(1300);
    back();
    startQuiz(true);
    toast('10 questions generated around your weak areas', 'bolt');
  },
  testStart: () => {
    startQuiz(true);
    toast('Test started — timer is running', 'clock');
  },
  qbank: s => {
    closeSheet();
    push('qbank', s ?? '');
  },

  // the older Mains flow (renderMains, L6786-L6802). Its view was replaced at L7865, so no screen shows
  // S.mains any more: renderMains() finds no #mainsBody and returns. The state writes are kept.
  mPick: id => {
    const M = getS().mains;
    if (!M || id === undefined) return; // S.mains.q on undefined throws in the HTML
    setS({ mains: { ...M, q: id }, mainsQ: id });
  },
  mStep: n => {
    const M = getS().mains;
    if (!M) return;
    setS({ mains: { ...M, step: Number(n) } });
  },
  mAdd: () => {
    const M = getS().mains;
    if (M && M.pages < 3) setS({ mains: { ...M, pages: M.pages + 1 } });
  },
  // the final A.mSubmit (L7629)
  mSubmit: () => {
    const s = getS();
    const M = s.mains;
    if (!M || !M.pages) return;
    if (s.me.credits < 20) return openSheet('lowCredits');
    setS({
      me: { ...s.me, credits: s.me.credits - 20, ledger: [{ t: 'AI Mains evaluation · GS II', d: fmtShort(today()), v: -20 }, ...s.me.ledger] },
      mains: { ...M, step: 3 },
    });
  },
  // the final A.mForce (L8165)
  mForce: () => {
    closeSheet();
    void mvProcess();
  },
  // the final A.mainsWith (L8156)
  mainsWith: id => {
    const w = mainsWithFor(id, ANSWERBANK, MAINSQ);
    closeSheet();
    setS(s => ({ mv: { ...s.mv, q: w.q, limit: w.limit } }));
    const st = getS().stack;
    const t = st[st.length - 1];
    if (!(t && t.id === 'mains' && getS().mvDone !== t.key)) push('mains');
    mainsRender();
  },
  modelOpen: id => {
    const st = getS().stack;
    const t = st[st.length - 1];
    if (!t || !id) return;
    const k = `${t.key}:${id}`;
    setS(s => ({ modelOpen: { ...s.modelOpen, [k]: !s.modelOpen[k] } }));
  },

  // mains evaluation panel (L8158-L8165)
  mvMode: m => {
    setS(s => ({ mv: { ...s.mv, mode: m ?? '' } }));
    mainsRender();
  },
  mvLim: n => {
    setS(s => ({ mv: { ...s.mv, limit: Number(n) } }));
    mainsRender();
  },
  mvCtx: k => {
    if (k !== 'notes' && k !== 'ca') return;
    setS(s => ({ mv: { ...s.mv, [k]: !s.mv[k] } }));
    mainsRender();
  },
  mvAdd: () => {
    const n = mvAddPages(getS().mv.pages);
    if (n === null) toast('Up to 4 pages per answer', 'x');
    else {
      setS(s => ({ mv: { ...s.mv, pages: n } }));
      mainsRender();
    }
  },
  mvDel: () => {
    setS(s => ({ mv: { ...s.mv, pages: Math.max(0, s.mv.pages - 1) } }));
    mainsRender();
  },
  mvRun: () => {
    mainsRender(); // the panel was built (with its default question) before anything on it can be pressed
    const s = getS();
    const b = mvRunBlock(s.mv);
    if (b) return toast(b.msg, b.icon);
    if (s.me.credits < 20) return openSheet('lowCredits');
    setS({ me: { ...s.me, credits: s.me.credits - 20, ledger: [{ t: 'AI Mains evaluation', d: fmtShort(today()), v: -20 }, ...s.me.ledger] } });
    void mvProcess();
  },

  // pqb (L8136-L8141)
  pqPick: k => {
    const P = getS().pqb;
    setS({ pqb: { ...P, ...pqbPick(P, Number(k)) } });
    pqRedraw();
    setTimeout(() => pqExListeners.forEach(l => l()), 60);
  },
  pqNav: d => {
    setS(s => ({ pqb: { ...s.pqb, i: pqbNav(s.pqb.i, Number(d)) } }));
    pqRedraw();
  },
  pqLang: l => {
    setS(s => ({ pqb: { ...s.pqb, lang: l ?? '' } }));
    pqRedraw();
  },
  pqReset: () => {
    setS(s => ({ pqb: { ...s.pqb, sel: {}, i: 0, done: 0 } }));
    pqRedraw();
    toast('Progress reset · starting from question 1', 'refresh');
  },
  pqHist: () => openSheet('pqbAttempts'),
  pqGo: i => {
    closeSheet();
    setS(s => ({ pqb: { ...s.pqb, i: Number(i) } }));
    pqRedraw();
  },

  // test series (L8143-L8151)
  tqTab: t => setS(s => ({ tq: { ...s.tq, tab: t ?? '' } })),
  tqLang: l => setS(s => ({ tq: { ...s.tq, lang: l ?? '' } })),
  tqPick: () => {
    setS(s => ({ tq: { ...s.tq, file: { n: 'Mock_Test_13_GS1_' + (s.tq.lang === 'hi' ? 'Hindi' : 'English') + '.pdf', pg: 48, sz: '6.2 MB' } } }));
    toast('PDF selected', 'file');
  },
  tqClear: () => setS(s => ({ tq: { ...s.tq, file: null } })),
  tqGo: async () => {
    const T = getS().tq;
    if (!T.file || T.busy) return;
    setS({ tq: { ...T, busy: true }, tqBusyRows: 0 });
    for (let i = 0; i < 4; i++) {
      await wait(TQ_STEP);
      setS({ tqBusyRows: i + 1 });
    }
    await wait(400);
    setS(s => ({
      tq: {
        ...s.tq,
        lib: [{ t: 'Mock Test 13 · GS Paper I', q: 100, best: 0, att: 0, d: fmtShort(today()), lang: s.tq.lang === 'hi' ? 'Hindi' : 'English' }, ...s.tq.lib],
        file: null,
        busy: false,
        tab: 'lib',
      },
      tqBusyRows: -1,
    }));
    toast('100 questions ready · saved to your library', 'check');
  },
  tqStart: i => {
    const k = Number(i);
    const x = getS().tq.lib[k];
    if (!x) return;
    setS(s => ({ tq: { ...s.tq, lib: s.tq.lib.map((y, j) => (j === k ? { ...y, att: y.att + 1 } : y)) } }));
    startQuiz(true);
    toast(`${x.t} · timer started`, 'clock');
  },

  // answer bank (L8153-L8155)
  abLang: l => setS(s => ({ ab: { ...s.ab, lang: l ?? '' } })),
  abP: p => setS(s => ({ ab: { ...s.ab, p: p ?? '' } })),
  abOpen: id => {
    if (id === undefined) return;
    setS(s => ({ ab: { ...s.ab, open: { ...s.ab.open, [id]: !s.ab.open[id] } } }));
  },
};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {
  // back(): `if (top.id === 'quiz') clearInterval(S.quiz && S.quiz.timer)` (L6493)
  afterBack: top => {
    if (top.id === 'quiz') stopQuizTimer();
  },
  // closeAllPages(): `if (S.quiz) clearInterval(S.quiz.timer)` (L6498)
  onCloseAllPages: () => {
    if (getS().quiz) stopQuizTimer();
  },
};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = { startQuiz };

/** Tests only. */
export const __practiceForTest = { quizTimerRunning: () => quizTimer !== undefined, PQB };
