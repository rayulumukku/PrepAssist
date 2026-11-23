// Source: PrepAssist.html L6656-L6656 (VIEWS.quiz)
// Source: PrepAssist.html L6703-L6709 (startQuiz)
// Source: PrepAssist.html L6711-L6744 (renderQuiz)
// Source: PrepAssist.html L6745-L6762 (renderResults)
// Source: PrepAssist.html L2626-L2685 (.qz-*, .opt, .fb, .res*), L3005-L3006, L3011, L3036 (brand overrides), L1054 (.sq)
// Focus view: the whole page. Computed values from reference/android view-quiz, view-quiz-selected,
// view-quiz-answered-correct / -wrong, view-quiz-last-answered, view-quiz-results:
//   .qz-top   sticky, rgba(255,255,255,.95) + blur(10px), padding max(12px,--sat) 18px 10px; 73 high
//             with the bar, 58 on the results page (drawn above the scroller, content padded)
//   .qz-body  padding 16 20 150; .qz-foot absolute at the bottom, gradient to #fff at 30 %
// renderQuiz() rebuilds the whole page (el.innerHTML), so the scroller starts at 0 and `.fb` replays
// its tabIn animation on every render: the page is keyed on S.quizRender.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, ScrollViewInstance } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { act } from '../../actions';
import { onQuizFeedback } from '../../actions/practice';
import { Backdrop, Btn, Eyebrow, Icon } from '../../components';
import { QUIZ } from '../../data';
import { nowMs } from '../../env/clock';
import type { ViewDef } from '../../navigation/routes';
import { useStore } from '../../store';
import { EASE, font, palettes, Txt, useInsets, useTheme } from '../../theme';
import { barClass, dotClass, fmtT, optState, quizResults } from './logic/quiz';
import type { QuizState } from './logic/quiz';
import { Why } from './parts/Why';

const C = palettes.free;
const L = 'ABCD';
const easeVar = Easing.bezier(EASE[0], EASE[1], EASE[2], EASE[3]);

const s = StyleSheet.create({
  page: { flex: 1 },
  top: { position: 'absolute', left: 0, right: 0, top: 0, zIndex: 5, paddingHorizontal: 18, paddingBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 36 },
  x: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  n: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, fontVariant: ['tabular-nums'] },
  nSpan: { ...font('sans', 500), color: C.muted },
  time: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeTxt: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: C.ink2, fontVariant: ['tabular-nums'] },
  bar: { flexDirection: 'row', gap: 3, marginTop: 12, height: 3 },
  barI: { flex: 1, height: 3, borderRadius: 2 },
  body: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 150 },
  meta: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, letterSpacing: 1.38, textTransform: 'uppercase', color: C.polity },
  metaSpan: { ...font('sans', 600), color: C.muted },
  q: { ...font('read', 500), fontSize: 18, lineHeight: 26.1, letterSpacing: -0.054, marginTop: 10 },
  st: { marginTop: 16, borderLeftWidth: 2, borderLeftColor: C.rule2, paddingLeft: 14 },
  li: { flexDirection: 'row' },
  liB: { ...font('sans', 600), width: 20, fontSize: 13.5, lineHeight: 20.25, color: C.muted, paddingTop: 2 },
  liS: { ...font('read', 400), flex: 1, fontSize: 15.5, lineHeight: 23.25, color: C.ink2 },
  ask: { ...font('sans', 500), fontSize: 15.5, lineHeight: 22.475, marginVertical: 14 },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    minHeight: 52,
    borderWidth: 1,
    borderColor: C.rule2,
    borderRadius: 14,
    backgroundColor: C.sheet,
  },
  l: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.rule2, alignItems: 'center', justifyContent: 'center' },
  lTxt: { ...font('sans', 700), fontSize: 13.5, lineHeight: 18.225, color: C.muted },
  oTxt: { flexShrink: 1, fontSize: 15.5, lineHeight: 20.925 },
  mk: { marginLeft: 'auto' },
  fb: { marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: C.rule },
  verdict: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 34 },
  verdictTxt: { ...font('serif', 700), fontSize: 22, lineHeight: 31.9, letterSpacing: -0.55 },
  vi: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  ans: { fontSize: 14.5, lineHeight: 21.025, marginTop: 8, color: C.ink2 },
  ansB: { ...font('sans', 700), color: C.ink },
  h6: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', color: C.muted, marginTop: 18, marginBottom: 6 },
  ex: { ...font('read', 400), fontSize: 15.5, lineHeight: 24.8, color: C.ink2 },
  topic: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  topicS: { paddingVertical: 4, paddingHorizontal: 9, borderRadius: 6, backgroundColor: C.paper2 },
  topicT: { ...font('sans', 500), fontSize: 13.5, lineHeight: 19.575 },
  askm: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, padding: 14, borderRadius: 12 },
  askmB: { ...font('sans', 600), fontSize: 14.5, lineHeight: 22.475, color: '#FFFFFF' },
  askmS: { fontSize: 12.5, lineHeight: 18.125, color: '#FFFFFF', opacity: 0.65 },
  foot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 6,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 18,
    backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0), #FFFFFF 30%)',
  },
  grow: { flex: 1 },
  sq: { width: 46, paddingHorizontal: 0, marginTop: 5 },
  off: { opacity: 0.35 },
  // results
  res: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 120 },
  resEb: { lineHeight: 22.475 },
  score: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 14, marginBottom: 4 },
  scoreB: { ...font('serif', 700), fontSize: 84, lineHeight: 71.4, letterSpacing: -2.52 },
  scoreS: { ...font('serif', 400), fontSize: 20, lineHeight: 29, color: C.muted, paddingBottom: 8 },
  verdictP: { ...font('serif', 400), fontSize: 18, lineHeight: 26.1, color: C.ink2 },
  grid: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.rule, marginVertical: 20 },
  cell: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  cellL: { borderLeftWidth: 1, borderLeftColor: C.rule },
  cellB: { ...font('serif', 500), fontSize: 22, lineHeight: 31.9, textAlign: 'center', alignSelf: 'stretch' },
  cellS: { fontSize: 11.5, lineHeight: 22.475, color: C.muted, textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 6, marginVertical: 14 },
  dot: { flex: 1, aspectRatio: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  dotT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#FFFFFF' },
  btns: { gap: 10 },
});

/** #qzTime: fmtT(Date.now() - Q.t0), rewritten once a second by S.quiz.timer. */
function QzTime({ t0 }: { t0: number }): React.JSX.Element {
  useStore(st => st.quizTick);
  return <Txt style={s.timeTxt}>{fmtT(nowMs() - t0)}</Txt>;
}

/** .fb: `animation: tabIn .45s var(--ease)` (opacity 0 -> 1, translateY 6px -> none). */
function Feedback({ children, onLayout }: { children: React.ReactNode; onLayout: (e: LayoutChangeEvent) => void }): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 450, easing: easeVar });
  }, [p]);
  const a = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 6 * (1 - p.value) }] }));
  return (
    <Animated.View style={[s.fb, a]} onLayout={onLayout}>
      {children}
    </Animated.View>
  );
}

function Top({ Q, results }: { Q: QuizState; results?: string }): React.JSX.Element {
  const { sat } = useInsets();
  return (
    <View style={[s.top, { paddingTop: Math.max(12, sat) }]}>
      <Backdrop px={10} tint="rgba(255, 255, 255, 0.95)" />
      <View style={s.row}>
        <Pressable style={s.x} onPress={() => act('quizClose')} accessibilityLabel={results !== undefined ? 'Close' : 'Close quiz'} testID="quiz.close">
          <Icon name="close" color={C.ink2} />
        </Pressable>
        {results !== undefined ? (
          <Txt style={s.n}>Results</Txt>
        ) : (
          <Txt style={s.n}>
            Question {Q.i + 1} <Txt style={s.nSpan}>of {QUIZ.length}</Txt>
          </Txt>
        )}
        <View style={s.time}>
          <Icon name="clock" size={16} color={C.ink2} />
          {results !== undefined ? <Txt style={s.timeTxt}>{results}</Txt> : <QzTime t0={Q.t0} />}
        </View>
      </View>
      {results === undefined ? <Bar Q={Q} /> : null}
    </View>
  );
}

function Bar({ Q }: { Q: QuizState }): React.JSX.Element {
  const t = useTheme();
  const bg = { '': C.rule, cur: t.brand, ok: C.ok, bad: C.bad, ans: '#8CC6EE' } as const;
  return (
    <View style={s.bar}>
      {QUIZ.map((_, k) => (
        <View key={k} style={[s.barI, { backgroundColor: bg[barClass(Q, QUIZ, k)] }]} />
      ))}
    </View>
  );
}

function Question({ Q, topH }: { Q: QuizState; topH: number }): React.JSX.Element {
  const t = useTheme();
  const { sab } = useInsets();
  const scroll = useRef<ScrollViewInstance>(null);
  const fbY = useRef(0);
  const i = Q.i;
  const q = QUIZ[i];
  const sel = Q.sel[i];
  const sub = !!Q.sub[i];
  const ok = sub && sel === q.a;
  // `$('.fb').scrollIntoView({behavior:'smooth', block:'start'})` 80 ms after Submit. The page has just been
  // rebuilt, so the scroll waits until the feedback block and the content size are laid out.
  const pending = useRef(0);
  const tryScroll = (): void => {
    if (pending.current > Date.now() && fbY.current > 0) scroll.current?.scrollTo({ y: fbY.current, animated: true });
  };
  useEffect(
    () =>
      onQuizFeedback(() => {
        pending.current = Date.now() + 600;
        tryScroll();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tryScroll reads refs only
    [],
  );
  const tone = {
    '': null,
    sel: { box: { borderColor: t.brand, backgroundColor: t.brandTint, boxShadow: `0px 0px 0px 1px ${t.brand}` }, l: t.brand },
    ok: { box: { borderColor: C.ok, backgroundColor: C.okTint, boxShadow: `0px 0px 0px 1px ${C.ok}` }, l: C.ok },
    bad: { box: { borderColor: C.bad, backgroundColor: C.badTint, boxShadow: `0px 0px 0px 1px ${C.bad}` }, l: C.bad },
  } as const;
  const last = i === QUIZ.length - 1;
  return (
    <>
      <ScrollView
        ref={scroll}
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{ paddingTop: topH, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={tryScroll}
        testID="quiz.scroll">
        <View style={s.body}>
          <Txt style={s.meta}>
            Polity · {q.topic} <Txt style={s.metaSpan}>· {q.pyq}</Txt>
          </Txt>
          <Txt style={s.q}>{q.q}</Txt>
          {q.st.length ? (
            <View style={[s.st, { marginBottom: q.ask ? 0 : 10 }]}>
              {q.st.map((x, k) => (
                <View key={k} style={[s.li, k < q.st.length - 1 && { marginBottom: 10 }]}>
                  <Txt style={s.liB}>{k + 1}.</Txt>
                  <Txt style={s.liS}>{x}</Txt>
                </View>
              ))}
            </View>
          ) : null}
          {q.ask ? <Txt style={s.ask}>{q.ask}</Txt> : <View style={{ height: 14 }} />}
          <View accessibilityRole="radiogroup">
            {q.o.map((o, k) => {
              const st = optState(Q, q, k);
              const tn = tone[st.c];
              return (
                <Pressable
                  key={k}
                  style={[s.opt, tn && tn.box, { marginBottom: k < q.o.length - 1 ? 10 : 0 }]}
                  onPress={() => act('opt', String(k))}
                  disabled={sub}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: sel === k }}
                  testID={`quiz.opt.${k}`}>
                  <View style={[s.l, tn && { backgroundColor: tn.l, borderColor: tn.l }]}>
                    <Txt style={[s.lTxt, tn && { color: '#FFFFFF' }]}>{L[k]}</Txt>
                  </View>
                  <Txt style={s.oTxt}>{o}</Txt>
                  <View style={s.mk}>{st.mk ? <Icon name={st.mk} color={C.ink} /> : null}</View>
                </Pressable>
              );
            })}
          </View>
          {sub ? (
            <Feedback
              onLayout={e => {
                fbY.current = topH + e.nativeEvent.layout.y;
                tryScroll();
              }}>
              <View style={s.verdict}>
                <View style={[s.vi, { backgroundColor: ok ? C.ok : C.bad }]}>
                  <Icon name={ok ? 'check' : 'x'} color="#FFFFFF" />
                </View>
                <Txt style={[s.verdictTxt, { color: ok ? C.ok : C.bad }]}>{ok ? 'Correct' : 'Incorrect'}</Txt>
              </View>
              <Txt style={s.ans}>
                Correct answer:{' '}
                <Txt style={s.ansB}>
                  ({L[q.a]}) {q.o[q.a]}
                </Txt>
                {ok ? '' : ` · You chose (${L[sel]})`}
              </Txt>
              <Txt style={s.h6}>Explanation</Txt>
              <Txt style={s.ex}>{q.ex}</Txt>
              <Txt style={s.h6}>Syllabus topic</Txt>
              <View style={s.topic}>
                {q.path.map((p, k) => (
                  <React.Fragment key={k}>
                    {k ? <Icon name="chev" size={14} color={C.faint} /> : null}
                    <View style={s.topicS}>
                      <Txt style={s.topicT}>{p}</Txt>
                    </View>
                  </React.Fragment>
                ))}
              </View>
              <Pressable style={[s.askm, { backgroundColor: t.brand }]} onPress={() => act('mentor')} testID="quiz.askm">
                <Icon name="spark" color="#FFFFFF" />
                <View style={{ flexShrink: 1 }}>
                  <Txt style={s.askmB}>Ask AI Mentor about this question</Txt>
                  <Txt style={s.askmS}>{ok ? 'Go deeper, or get 3 similar questions' : 'Understand exactly where the trap was'}</Txt>
                </View>
                <Icon name="arrow" color="#FFFFFF" />
              </Pressable>
            </Feedback>
          ) : null}
        </View>
      </ScrollView>
      <View style={[s.foot, { paddingBottom: Math.max(16, sab) }]}>
        <Btn variant="line" icon="chevl" onPress={() => act('qPrev')} disabled={i === 0} style={[s.sq, i === 0 && s.off]} testID="quiz.prev" />
        <View style={s.grow}>
          {!sub ? (
            <Btn variant="ink" wide label="Submit" onPress={() => act('qSubmit')} disabled={sel == null} style={sel == null && s.off} testID="quiz.submit" />
          ) : !last ? (
            <Btn variant="ink" wide label="Next question" onPress={() => act('qNext')} testID="quiz.next">
              <Icon name="arrow" color="#FFFFFF" />
            </Btn>
          ) : (
            <Btn variant="brand" wide label="See results" onPress={() => act('qResults')} testID="quiz.results">
              <Icon name="arrow" color="#FFFFFF" />
            </Btn>
          )}
        </View>
        <Btn variant="line" icon="chev" onPress={() => act('qNext')} disabled={last} style={[s.sq, last && s.off]} testID="quiz.nextSq" />
      </View>
    </>
  );
}

function Results({ Q, topH }: { Q: QuizState; topH: number }): React.JSX.Element {
  const r = useMemo(() => quizResults(Q, QUIZ), [Q]);
  const dotBg = { ok: C.ok, bad: C.bad, sk: C.paper3 } as const;
  return (
    <ScrollView style={StyleSheet.absoluteFill} contentContainerStyle={{ paddingTop: topH, paddingBottom: 100 }} showsVerticalScrollIndicator={false} testID="quiz.scroll">
      <View style={s.res}>
        <Eyebrow style={s.resEb}>Polity · Writs & Art. 32</Eyebrow>
        <View style={s.score}>
          <Txt style={s.scoreB}>{r.correct}</Txt>
          <Txt style={s.scoreS}>/ {QUIZ.length}</Txt>
        </View>
        <Txt style={s.verdictP}>{r.verdict}</Txt>
        <View style={s.grid}>
          {[
            [r.accuracy + '%', 'Accuracy'],
            [String(r.attempted), 'Attempted'],
            [r.marks, 'UPSC marks'],
          ].map(([b, sp], k) => (
            <View key={k} style={[s.cell, k > 0 && s.cellL]}>
              <Txt style={s.cellB}>{b}</Txt>
              <Txt style={s.cellS}>{sp}</Txt>
            </View>
          ))}
        </View>
        <Eyebrow>Question map</Eyebrow>
        <View style={s.dots}>
          {QUIZ.map((_, k) => {
            const c = dotClass(Q, QUIZ, k);
            return (
              <Pressable key={k} style={[s.dot, { backgroundColor: dotBg[c] }]} onPress={() => act('qGo', String(k))} testID={`quiz.dot.${k}`}>
                <Txt style={[s.dotT, c === 'sk' && { color: C.muted }]}>{k + 1}</Txt>
              </Pressable>
            );
          })}
        </View>
        <Why title="What PrepAssist will do next" style={{ marginTop: 22 }}>
          Missed questions are added to tomorrow’s revision set. Your Polity coverage is updated and today’s plan moves on to <Txt style={{ ...font('sans', 700) }}>3 revisions</Txt>.
        </Why>
        <View style={s.btns}>
          <Btn variant="ink" wide label="Review answers" onPress={() => act('qGo', '0')} testID="quiz.review" />
          <Btn variant="line" wide icon="spark" label="Ask AI Mentor about my mistakes" onPress={() => act('mentor')} />
          <Btn variant="ghost" wide label="Back to today" onPress={() => act('quizClose')} />
        </View>
      </View>
    </ScrollView>
  );
}

/** One renderQuiz(): the page content, rebuilt (remounted) on every render. */
function Page({ Q }: { Q: QuizState }): React.JSX.Element {
  const { sat } = useInsets();
  // renderResults() writes fmtT(Date.now() - Q.t0) once; the interval only updates #qzTime
  const [resT] = useState(() => fmtT(nowMs() - Q.t0));
  const pt = Math.max(12, sat);
  // .qz-top: padding-top + 36 row (+ 12 margin + 3 bar) + 10
  const topH = Q.showRes ? pt + 36 + 10 : pt + 36 + 15 + 10;
  return (
    <View style={s.page}>
      {Q.showRes ? <Results Q={Q} topH={topH} /> : <Question Q={Q} topH={topH} />}
      <Top Q={Q} results={Q.showRes ? resT : undefined} />
    </View>
  );
}

function QuizScreen(): React.JSX.Element | null {
  const Q = useStore(st => st.quiz);
  const n = useStore(st => st.quizRender);
  if (!Q) return null;
  return <Page key={n} Q={Q} />;
}

const view: ViewDef = {
  Screen: QuizScreen,
};

export default view;
