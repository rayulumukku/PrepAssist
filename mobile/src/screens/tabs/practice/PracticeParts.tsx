// Source: PrepAssist.html L6299-L6350 (renderPractice: .p-today, question bank, AI Prelims Engine, test series, quiz history; mains: answer bank, past evaluations)
// Source: PrepAssist.html L2029-L2101 (PRACTICE v2 CSS), L5589-L5611 (handPage)
// Private sub-components of the Practice tab. Computed: reference/android/tab-practice, tab-practice-mains.
//   .p-today   #fff radius 22 padding 18 18 16, margin-top -38, z 2, overflow hidden, shadow 0 22 40 -22 rgba(40,40,120,.5)
//   .p-omr     10 columns gap 6, margin -2 0 14, padding-bottom 12, border-bottom 1 dashed #E1E8F0; small 8.5/12.325 700 #9AA3AF;
//              i 9 x 9 circle border 1 #C7BFF2 (1.3 px CSS, computed 1)
//   .p-tk      Inter 800 10.5 ls 1.05 uppercase #6C5DD3 (.m #D97F06, engine #B9B0FF, history #1F8A5B); inline, so its
//              line box is the body 22.475
//   h3         EB Garamond 500 22/26.4 margin-top 6; p 13.5/18.9 #6B7280 margin-top 5; .p-pen margin 16 -15 0
//   .p-hw      86 high, margin -18 -18 14, overflow hidden, #FFFBF3, opacity .9, border-bottom 1 dashed #F1DFC4;
//              handPage(3) svg at 100 % width, scale(.9) from the top centre
//   .p-h       flex space-between baseline, margin-bottom 12; h2 Inter 700 18/21.6 ls -.18; span 12.5 #7A8494 (4 below
//              the h2 top), button 13.5 600 #1B8AD3 (3 below)
//   .p-qb      grid 2 x 1fr gap 10; tile color-mix(--c 9%, #fff), inset ring color-mix(--c 18%, #fff), radius 16, padding 14 14 12;
//              .p-qi EB Garamond 600 italic 54/54 --c opacity .12 at right -6 top -10; b 14.5 700; small 12.5 600
//              color-mix(--c 70%, #333) margin-top 2; i 4 high color-mix(--c 15%, #fff) margin-top 12, em --c
//   .p-eng     #14183A + radial(100% 80% at 100% 0%, rgba(124,111,240,.55)) + radial(80% 60% at 0% 100%, rgba(27,138,211,.45)),
//              radius 22 padding 18; .p-engi 44 radius 14 linear(135deg,#7C6FF0,#1B8AD3) shadow 0 8 18 -8 #7C6FF0;
//              h3 EB Garamond 500 20/29; .p-engr margin-top 14, small 11.5 700 ls .92 uppercase rgba(255,255,255,.6) (inline);
//              .p-chips wrap gap 6 margin-top 8; .chip 32 high padding 0 12 radius 16 border rgba(255,255,255,.22)
//              background rgba(255,255,255,.08) #fff; .on #fff / #14183A; .p-gen 48 high radius 14 margin-top 18,
//              linear(90deg,#7C6FF0,#1B8AD3), shadow 0 12 22 -12 #7C6FF0, Inter 700 14.5, spark 16
//   .p-tests / .p-list  #fff border 1 #E6EBF1 radius 18; rows padding 13 14 gap 12, + border-top 1 #EEF2F6;
//              div b 14.5/18.85 600, small 12.5 #7A8494 margin-top 2
//   .p-td      46 x 50 radius 12 color-mix(--c 10%, #fff), --c, 10.5 700 uppercase, 5 px top bar; b Inter Tight 800 20/20 margin-top 3
//   .p-tests em 11.5 700 #5B6472 on #F1F5FA padding 5 8 radius 8; .live #FDECEC / #D93A3F with a 6 px dot (its dpu
//              animation starts from no box-shadow and ends transparent: nothing visible, not drawn)
//   .p-histc   padding 16 radius 18 linear(135deg,#E9FBF2,#F4FCF8) inset ring #CDEBDD; b 15.5/22.475 700 margin-top 4;
//              small 12.5 #5B6472; .p-bars 64 high gap 6, bars 14 wide radius 5 5 2 2 #9ED9BC (last #1F8A5B), em 9 700 #1F8A5B at top -14
//   .p-ab      horizontal row, margin 0 -20, padding 0 20 6, gap 12; card 240 wide min-height 176 padding 16 radius 18 #fff,
//              inset ring #E6EBF1, 4 px top bar --c; span 11.5 800 --c on color-mix(--c 10%) padding 3 8 radius 7;
//              em 11.5 #7A8494; b EB Garamond 500 16.5/22.275 margin-top 10, 3 lines; small margin-top auto padding-top 10
//              12.5 600 --c with doc 13
//   .p-rw      48 x 48 ring (r 19, stroke 5, #EEF2F6 track) with b 13.5 800 centred; chev 16 #AEB7C3
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { act } from '../../../actions';
import { ChipGroup, Chip, Icon, PenCTA } from '../../../components';
import { ANSWERBANK, PASTEVALS, QB, SUBJ, TESTS } from '../../../data';
import { useAppSize } from '../../../shell/AppSize';
import { font, Txt } from '../../../theme';
import { mix } from '../homeLogic';

const INK = '#14161C';
const HIST = [58, 62, 60, 67, 71, 74];

// ---------------------------------------------------------------- shared bits

function PH({ title, right }: { title: string; right: React.ReactNode }): React.JSX.Element {
  return (
    <View style={styles.ph}>
      <Txt style={styles.h2}>{title}</Txt>
      {right}
    </View>
  );
}
function PHLink({ label, act: a, testID }: { label: string; act: string; testID: string }): React.JSX.Element {
  return (
    <Pressable onPress={() => act(a)} style={styles.phBtn} testID={testID}>
      <Txt style={styles.phBtnT}>{label}</Txt>
    </Pressable>
  );
}

// ---------------------------------------------------------------- Prelims: today's set

export function TodayPre(): React.JSX.Element {
  return (
    <View style={styles.today}>
      <View style={styles.omr}>
        {Array.from({ length: 10 }, (_, i) => (
          <View key={i} style={styles.omrCol}>
            <Txt style={styles.omrN}>{i + 1}</Txt>
            <View style={styles.omrI} />
            <View style={styles.omrI} />
            <View style={styles.omrI} />
            <View style={styles.omrI} />
          </View>
        ))}
      </View>
      <Txt style={styles.tk}>Today’s set · picked for you</Txt>
      <Txt style={styles.todayH3}>10 questions on Writs &amp; Art. 32</Txt>
      <Txt style={styles.todayP}>From your weakest Polity topics and recent PYQ patterns · ~12 min</Txt>
      <View style={styles.pen}>
        <PenCTA label="Start practice" onPress={() => act('quiz')} testID="practice.start" />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Mains: evaluation card

/** handPage(seed) L5589-L5611 (annotated = false): a ruled page with 15 lines of handwriting. */
function handPaths(seed: number): string[] {
  const out: string[] = [];
  let y = 30;
  const rnd = (i: number): number => (Math.sin(seed * 99 + i * 12.9898) * 43758.5453) % 1;
  for (let i = 0; i < 15; i++) {
    const len = 150 + Math.abs(rnd(i)) * 80;
    let d = `M${i === 0 ? 50 : 24} ${y}`;
    for (let x = i === 0 ? 50 : 24; x < len; x += 9) d += ` q2.2 -${3 + Math.abs(rnd(i + x)) * 3} 4.5 0 t4.5 0`;
    out.push(d);
    y += 17;
  }
  return out;
}
const HAND3 = handPaths(3);

function HandPage({ width }: { width: number }): React.JSX.Element {
  const h = (width * 300) / 240;
  return (
    <View style={[styles.hand, { width, height: h }]}>
      <Svg width={width} height={h} viewBox="0 0 240 300" preserveAspectRatio="xMidYMin slice">
        <Rect width="100%" height="100%" fill="#FFFFFF" />
        {Array.from({ length: 17 }, (_, i) => (
          <Path key={i} d={`M0 ${36 + i * 17}H240`} stroke="#E2E6F0" strokeWidth={0.8} />
        ))}
        <Path d="M18 0V300" stroke="#BFDDF3" strokeWidth={1} />
        {HAND3.map((d, i) => (
          <Path key={`h${i}`} d={d} stroke="#23338A" strokeWidth={1.1} fill="none" opacity={0.85} />
        ))}
      </Svg>
    </View>
  );
}

export function TodayMains(): React.JSX.Element {
  const { w } = useAppSize();
  return (
    <View style={styles.today}>
      <View style={styles.hw}>
        <HandPage width={w - 40} />
      </View>
      <Txt style={[styles.tk, styles.tkM]}>AI Mains Evaluation</Txt>
      <Txt style={styles.todayH3}>Get examiner-style feedback on a handwritten answer</Txt>
      <Txt style={styles.todayP}>Scored on structure, content, relevance &amp; presentation — in about 2 minutes.</Txt>
      <View style={styles.pen}>
        <PenCTA label="Evaluate an answer" onPress={() => act('push:mains')} testID="practice.evaluate" />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Question bank

const QB_DONE = [42, 28, 35, 22, 18, 12, 30, 15];

export function QuestionBank(): React.JSX.Element {
  const { w } = useAppSize();
  const colW = (w - 40 - 10) / 2;
  return (
    <View style={styles.sec}>
      <PH title="Question bank" right={<Txt style={styles.phSpan}>21,550 questions</Txt>} />
      <View style={styles.qb}>
        {QB.map((q, i) => {
          const hx = SUBJ[q.s].hex;
          return (
            <Pressable
              key={q.s}
              onPress={() => act('qbank:' + q.s)}
              testID={`practice.qbank.${q.s}`}
              style={[styles.qbB, { width: colW, backgroundColor: mix(hx, 0.09, '#FFFFFF'), boxShadow: `inset 0px 0px 0px 1px ${mix(hx, 0.18, '#FFFFFF')}` }]}
            >
              <Txt style={[styles.qi, { color: hx }]}>{q.n.slice(0, 2)}</Txt>
              <Txt style={styles.qbT}>{q.n}</Txt>
              <Txt style={[styles.qbS, { color: mix(hx, 0.7, '#333333') }]}>{q.c} Qs</Txt>
              <View style={[styles.qbBar, { backgroundColor: mix(hx, 0.15, '#FFFFFF') }]}>
                <View style={[styles.qbFill, { width: `${QB_DONE[i]}%`, backgroundColor: hx }]} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- AI Prelims Engine

const ENG_N = ['10', '25', '50', '100'];

export function Engine(): React.JSX.Element {
  // engN: (x, el) => the clicked chip becomes the only .on chip of its row (element-local, initially "25")
  const [n, setN] = useState(1);
  return (
    <View style={styles.sec}>
      <View style={styles.eng}>
        <View style={styles.engh}>
          <View style={styles.engi}>
            <Icon name="bolt" size={20} color="#fff" />
          </View>
          <View style={styles.flex1}>
            <Txt style={[styles.tk, styles.tkEng]}>AI Prelims Engine</Txt>
            <Txt style={styles.engH3}>Build a test around your gaps</Txt>
          </View>
        </View>
        <View style={styles.engr}>
          <Txt style={styles.engSmall}>Subjects</Txt>
          <View style={styles.chips}>
            <ChipGroup
              items={['Polity', 'Economy', 'Environment', 'History', 'Geography']}
              mode="toggle"
              initial={[0, 1]}
              chipStyle={styles.chip}
              chipOnStyle={styles.chipOn}
              chipTextStyle={styles.chipT}
              chipOnTextStyle={styles.chipOnT}
              testID="practice.engSubject"
            />
          </View>
        </View>
        <View style={styles.engr}>
          <Txt style={styles.engSmall}>Questions</Txt>
          <View style={styles.chips}>
            {ENG_N.map((label, i) => (
              <Chip
                key={label}
                label={label}
                on={n === i}
                onPress={() => act('engN', undefined, { select: () => setN(i) })}
                style={styles.chip}
                onStyle={styles.chipOn}
                textStyle={styles.chipT}
                onTextStyle={styles.chipOnT}
                testID={`practice.engN.${i}`}
              />
            ))}
          </View>
        </View>
        <Pressable style={styles.gen} onPress={() => act('push:engine')} testID="practice.generate">
          <Icon name="spark" size={16} color="#fff" />
          <Txt style={styles.genT}>Generate my test</Txt>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Test series

const TEST_C = ['#E5484D', '#1B8AD3', '#6C5DD3'];

export function TestSeries(): React.JSX.Element {
  return (
    <View style={styles.sec}>
      <PH title="Test series" right={<PHLink label="All tests" act="push:tests" testID="practice.tests.all" />} />
      <View style={styles.list}>
        {TESTS.map((x, i) => {
          const c = TEST_C[i];
          return (
            <Pressable key={x.t} style={[styles.row, i > 0 && styles.rowLine]} onPress={() => act('testStart')} testID={`practice.test.${i}`}>
              <View style={[styles.td, { backgroundColor: mix(c, 0.1, '#FFFFFF') }]}>
                <View style={[styles.tdBar, { backgroundColor: c }]} />
                <Txt style={[styles.tdB, { color: c }]}>{x.d}</Txt>
                <Txt style={[styles.tdM, { color: c }]}>{x.m}</Txt>
              </View>
              <View style={styles.flex1}>
                <Txt style={styles.rowB}>{x.t}</Txt>
                <Txt style={styles.rowS}>{x.s}</Txt>
              </View>
              <View style={[styles.em, i === 0 && styles.emLive]}>
                {i === 0 ? <View style={styles.liveDot} /> : null}
                <Txt style={[styles.emT, i === 0 && styles.emTLive]}>{x.st}</Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- Quiz history

export function History(): React.JSX.Element {
  return (
    <View style={styles.sec}>
      <Pressable style={styles.histc} onPress={() => act('push:history')} testID="practice.history">
        <View>
          <Txt style={[styles.tk, styles.tkHist]}>Quiz history</Txt>
          <Txt style={styles.histB}>Trending up · 58 → 74%</Txt>
          <Txt style={styles.histS}>Last 6 tests</Txt>
        </View>
        <View style={styles.bars}>
          {HIST.map((v, i) => (
            <View key={i} style={[styles.bar, { height: `${(v - 40) * 2}%` }, i === HIST.length - 1 && styles.barLast]}>
              <View style={styles.barEmBox}>
                <Txt style={styles.barEm}>{v}</Txt>
              </View>
            </View>
          ))}
        </View>
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------- Mains: answer bank

const AB_C = ['#1B8AD3', '#E8890C', '#0E9A8A', '#6C5DD3'];

export function AnswerBank(): React.JSX.Element {
  return (
    <View style={styles.sec}>
      <PH title="Answer bank" right={<PHLink label="Open bank" act="push:answerbank" testID="practice.ab.open" />} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.abScroll} contentContainerStyle={styles.ab}>
        {ANSWERBANK.slice(0, 4).map((q, i) => {
          const c = AB_C[i % 4];
          return (
            <Pressable key={q.id} style={styles.abB} onPress={() => act('push:answer:' + q.id)} testID={`practice.ab.${q.id}`}>
              <View style={[styles.abBar, { backgroundColor: c }]} />
              <View style={styles.abt}>
                <View style={[styles.abP, { backgroundColor: mix(c, 0.1, '#FFFFFF') }]}>
                  <Txt style={[styles.abPT, { color: c }]}>{q.p}</Txt>
                </View>
                <Txt style={styles.abEm}>
                  {q.m} marks · {q.w} words
                </Txt>
              </View>
              <Txt style={styles.abT} numberOfLines={3}>
                {q.t}
              </Txt>
              <View style={styles.abSmall}>
                <Icon name="doc" size={13} color={c} />
                <Txt style={[styles.abSmallT, { color: c }]}>Model answer + rubric</Txt>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------- Mains: past evaluations

function Ring({ v, of, c }: { v: number; of: number; c: string }): React.JSX.Element {
  const r = 19;
  const C = 2 * Math.PI * r;
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48">
      <Circle cx={24} cy={24} r={r} fill="none" stroke="#EEF2F6" strokeWidth={5} />
      <Circle
        cx={24}
        cy={24}
        r={r}
        fill="none"
        stroke={c}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={[Number(((C * v) / of).toFixed(1)), 200]}
        transform="rotate(-90 24 24)"
      />
    </Svg>
  );
}

export function PastEvals(): React.JSX.Element {
  return (
    <View style={styles.sec}>
      <PH title="Past evaluations" right={<PHLink label="See all" act="push:pastevals" testID="practice.evals.all" />} />
      <View style={styles.list}>
        {PASTEVALS.slice(0, 4).map((e, i) => {
          const s = Number(e.s);
          const r = s / e.of;
          const c = r >= 0.6 ? '#1F8A5B' : r >= 0.5 ? '#E8890C' : '#D9534F';
          return (
            <Pressable
              key={e.t}
              style={[styles.row, i > 0 && styles.rowLine]}
              onPress={() => act(i === 0 ? 'push:mainsResult' : 'push:pastevals')}
              testID={`practice.eval.${i}`}
            >
              <View style={styles.rw}>
                <Ring v={s} of={e.of} c={c} />
                <View style={styles.rwB}>
                  <Txt style={styles.rwBT}>{e.s}</Txt>
                </View>
              </View>
              <View style={styles.flex1}>
                <Txt style={styles.rowB}>{e.t}</Txt>
                <Txt style={styles.rowS}>
                  {e.p} · out of {e.of} · {e.d}
                </Txt>
              </View>
              <Icon name="chev" size={16} color="#AEB7C3" />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, minWidth: 0 },
  sec: { marginTop: 28 },
  ph: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  h2: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: INK },
  phSpan: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 4 },
  phBtn: { marginTop: 3 },
  phBtnT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#1B8AD3', textAlign: 'center' },
  // today
  today: {
    zIndex: 2,
    marginTop: -38,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 22px 40px -22px rgba(40, 40, 120, 0.5)',
  },
  omr: {
    flexDirection: 'row',
    gap: 6,
    overflow: 'hidden',
    marginTop: -2,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E1E8F0',
  },
  omrCol: { alignItems: 'center', gap: 3 },
  omrN: { ...font('sans', 700), fontSize: 8.5, lineHeight: 12.325, color: '#9AA3AF' },
  omrI: { width: 9, height: 9, borderRadius: 4.5, borderWidth: 1, borderColor: '#C7BFF2' },
  tk: { ...font('sans', 800), fontSize: 10.5, lineHeight: 22.475, letterSpacing: 1.05, textTransform: 'uppercase', color: '#6C5DD3' },
  tkM: { color: '#D97F06' },
  tkEng: { color: '#B9B0FF' },
  tkHist: { color: '#1F8A5B' },
  todayH3: { ...font('book', 500), fontSize: 22, lineHeight: 26.4, color: INK, marginTop: 6 },
  todayP: { fontSize: 13.5, lineHeight: 18.9, color: '#6B7280', marginTop: 5 },
  pen: { marginTop: 16, marginHorizontal: -15 },
  hand: { transformOrigin: 'center top', transform: [{ scale: 0.9 }] },
  hw: {
    height: 86,
    marginTop: -18,
    marginHorizontal: -18,
    marginBottom: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFBF3',
    opacity: 0.9,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#F1DFC4',
  },
  // question bank
  qb: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  qbB: { borderRadius: 16, paddingTop: 14, paddingHorizontal: 14, paddingBottom: 12, overflow: 'hidden' },
  qi: { position: 'absolute', right: -6, top: -10, ...font('book', 600, true), fontSize: 54, lineHeight: 54, opacity: 0.12 },
  qbT: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: INK },
  qbS: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, marginTop: 2 },
  qbBar: { height: 4, borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  qbFill: { height: 4, borderRadius: 2 },
  // engine
  eng: {
    borderRadius: 22,
    padding: 18,
    overflow: 'hidden',
    backgroundColor: '#14183A',
    backgroundImage:
      'radial-gradient(100% 80% at 100% 0%, rgba(124,111,240,0.55), transparent 60%), radial-gradient(80% 60% at 0% 100%, rgba(27,138,211,0.45), transparent 60%)',
  },
  engh: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  engi: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(135deg, #7C6FF0, #1B8AD3)',
    boxShadow: '0px 8px 18px -8px #7C6FF0',
  },
  engH3: { ...font('book', 500), fontSize: 20, lineHeight: 29, color: '#fff', marginTop: 2 },
  engr: { marginTop: 14 },
  engSmall: { ...font('sans', 700), fontSize: 11.5, lineHeight: 22.475, letterSpacing: 0.92, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { height: 32, paddingHorizontal: 12, borderRadius: 16, borderColor: 'rgba(255,255,255,0.22)', backgroundColor: 'rgba(255,255,255,0.08)' },
  chipOn: { backgroundColor: '#fff', borderColor: '#fff' },
  chipT: { color: '#fff' },
  chipOnT: { color: '#14183A' },
  gen: {
    marginTop: 18,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundImage: 'linear-gradient(90deg, #7C6FF0, #1B8AD3)',
    boxShadow: '0px 12px 22px -12px #7C6FF0',
  },
  genT: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: '#fff' },
  // lists
  list: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E6EBF1', borderRadius: 18, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  rowB: { ...font('sans', 600), fontSize: 14.5, lineHeight: 18.85, color: INK },
  rowS: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
  td: { width: 46, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  tdBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 5 },
  tdB: { ...font('serif', 800), fontSize: 20, lineHeight: 20, marginTop: 3 },
  tdM: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, textTransform: 'uppercase' },
  em: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#F1F5FA', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 8 },
  emLive: { backgroundColor: '#FDECEC' },
  emT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#5B6472' },
  emTLive: { color: '#D93A3F' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D93A3F' },
  // history
  histc: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundImage: 'linear-gradient(135deg, #E9FBF2, #F4FCF8)',
    boxShadow: 'inset 0px 0px 0px 1px #CDEBDD',
  },
  histB: { ...font('sans', 700), fontSize: 15.5, lineHeight: 22.475, color: INK, marginTop: 4 },
  histS: { fontSize: 12.5, lineHeight: 18.125, color: '#5B6472', marginTop: 2 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 64 },
  bar: { width: 14, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, backgroundColor: '#9ED9BC' },
  barLast: { backgroundColor: '#1F8A5B' },
  barEmBox: { position: 'absolute', top: -14, left: -20, right: -20, alignItems: 'center' },
  barEm: { ...font('sans', 700), fontSize: 9, lineHeight: 13.05, color: '#1F8A5B' },
  // answer bank
  abScroll: { marginHorizontal: -20 },
  ab: { paddingHorizontal: 20, paddingBottom: 6, gap: 12 },
  abB: { width: 240, minHeight: 176, padding: 16, borderRadius: 18, backgroundColor: '#fff', boxShadow: 'inset 0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  abBar: { position: 'absolute', left: 0, right: 0, top: 0, height: 4 },
  abt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  abP: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 7 },
  abPT: { ...font('sans', 800), fontSize: 11.5, lineHeight: 16.675 },
  abEm: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494' },
  abT: { ...font('book', 500), fontSize: 16.5, lineHeight: 22.275, color: INK, marginTop: 10 },
  abSmall: { marginTop: 'auto', paddingTop: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  abSmallT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125 },
  // past evaluations
  rw: { width: 48, height: 48 },
  rwB: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  rwBT: { ...font('sans', 800), fontSize: 13.5, lineHeight: 19.575, color: INK },
});
