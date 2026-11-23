// Source: PrepAssist.html L8115-L8131 (syTopicHTML)
// Source: PrepAssist.html L4191-L4240 (.yt2, .yt-ready, .yt-dist, .yt-bars, .yt-cta, .yt-speed, .yt-q)
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import { PQB, QUIZ, SUBJ, SYL } from '../../data';
import type { SheetProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';

const GSC: Record<string, string> = { gs1: '#E8890C', gs2: '#1B8AD3', gs3: '#2F8A4A', gs4: '#6C5DD3' };

function SyllabusTopicSheet({ arg }: SheetProps): React.JSX.Element {
  const name = arg || '';
  const sylDone = useStore(s => s.sylDone);
  const g = SYL.find(x => x.t.some(t => t[0] === name)) || SYL[0];
  const tEntry = g.t.find(t => t[0] === name);
  const c = tEntry ? tEntry[1] : 50;
  const a = sylDone[name] || 0;
  const pct = Math.round((a / c) * 100);

  const st = !a ? ['Not started', '#7A8494'] : pct >= 60 ? ['Covered', '#2F8A4A'] : ['In progress', '#E8890C'];
  const dist = [
    ['Bank', Math.round(a * 0.5), '#6C5DD3'],
    ['AI drill', Math.round(a * 0.3), '#E8890C'],
    ['Quiz', Math.round(a * 0.2), '#2F8A4A'],
    ['Mains', 0, '#0A97B8'],
  ] as const;
  const mx = Math.max(1, ...dist.map(d => d[1]));
  const qs = [
    ['Prelims bank', PQB[0]?.q || ''],
    ['Quiz series', QUIZ[1]?.q || ''],
    ['Prelims bank', QUIZ[5]?.q || ''],
    ['Quiz series', QUIZ[3]?.q || ''],
  ] as const;

  const R = 36;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ * (1 - Math.max(0.02, Math.min(1, a / c)));

  return (
    <View style={s.wrap} testID="sheet.syllabusTopic">
      <View style={s.grab} />
      <View style={s.head}>
        <View style={s.headL}>
          <View style={s.tags}>
            <View style={[s.tag, { backgroundColor: '#F0F4FA' }]}>
              <Txt style={[s.tagTx, { color: GSC[g.p] || '#1B8AD3' }]}>
                {`${g.p.toUpperCase().replace('GS', 'GS ')} · ${SUBJ[g.s as keyof typeof SUBJ] ? SUBJ[g.s as keyof typeof SUBJ].n : 'Ethics'}`}
              </Txt>
            </View>
            <View style={[s.tag, { backgroundColor: '#F8F9FA' }]}>
              <View style={[s.stDot, { backgroundColor: st[1] }]} />
              <Txt style={[s.tagTx, { color: st[1] }]}>{st[0]}</Txt>
            </View>
          </View>
          <Txt style={s.h3}>{name}</Txt>
        </View>
        <Pressable style={s.circClose} onPress={() => act('closeSheet')} testID="syllabusTopic.close">
          <Icon name="close" size={16} color="#7A8494" />
        </Pressable>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={s.ready}>
          <View style={s.ringBox}>
            <Svg width={84} height={84} viewBox="0 0 84 84" style={s.svgRotate}>
              <Circle cx={42} cy={42} r={R} stroke="#EEF2F7" strokeWidth={6} fill="none" />
              <Circle
                cx={42}
                cy={42}
                r={R}
                stroke="#3B5BCC"
                strokeWidth={6}
                strokeDasharray={`${circ} ${circ}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
            <View style={s.ringCenter}>
              <Txt style={s.ringPct}>{`${pct}%`}</Txt>
              <Txt style={s.ringSub}>ready</Txt>
            </View>
          </View>
          <View style={s.readyL}>
            <Txt style={s.ytN}>
              {a}
              <Txt style={s.ytNSmall}>{` / ${c.toLocaleString('en-IN')}`}</Txt>
            </Txt>
            <Txt style={s.ytL}>questions attempted</Txt>
            <View style={s.chips}>
              <View style={s.chipPend}>
                <Txt style={s.chipPendTx}>{`${(c - a).toLocaleString('en-IN')} pending`}</Txt>
              </View>
              <View style={s.chipPyq}>
                <Txt style={s.chipPyqTx}>{`${Math.round(c * 0.02) || 1} PYQs`}</Txt>
              </View>
            </View>
          </View>
        </View>

        <View style={s.dist}>
          <View style={s.dh}>
            <Txt style={s.dhH6}>PRACTICE DISTRIBUTION</Txt>
            <Txt style={s.dhSpan}>{`${a} solved`}</Txt>
          </View>
          <View style={s.bars}>
            {dist.map(d => (
              <View key={d[0]} style={s.barItem}>
                <Txt style={s.barVal}>{d[1]}</Txt>
                <View style={s.col}>
                  <View style={[s.colFill, { height: `${Math.max(6, (d[1] / mx) * 100)}%`, backgroundColor: d[2] }]} />
                </View>
                <Txt style={s.barLbl}>{d[0]}</Txt>
              </View>
            ))}
          </View>
        </View>

        <View style={s.ctaRow}>
          <Pressable style={[s.ctaBtn, s.ctaO]} onPress={() => act('syDrill')} testID="syllabusTopic.drill">
            <Icon name="play" size={16} color="#FFFFFF" />
            <Txt style={s.ctaTx}>AI Prelims drill</Txt>
          </Pressable>
          <Pressable style={[s.ctaBtn, s.ctaB]} onPress={() => act('syMains')} testID="syllabusTopic.mains">
            <Icon name="pen" size={16} color="#FFFFFF" />
            <Txt style={s.ctaTx}>Mains practice</Txt>
          </Pressable>
        </View>

        <View style={s.speedRow}>
          <Pressable style={s.speedBtn} onPress={() => act('syDrill')} testID="syllabusTopic.sprint">
            <Icon name="bolt" size={19} color="#3B5BCC" />
            <View style={s.speedTxt}>
              <Txt style={s.speedB}>5-MCQ sprint</Txt>
              <Txt style={s.speedSm}>7-min check</Txt>
            </View>
          </Pressable>
          <Pressable style={s.speedBtn} onPress={() => act('syDrill')} testID="syllabusTopic.exam">
            <Icon name="target" size={19} color="#3B5BCC" />
            <View style={s.speedTxt}>
              <Txt style={s.speedB}>10-MCQ exam</Txt>
              <Txt style={s.speedSm}>Full drill</Txt>
            </View>
          </Pressable>
        </View>

        <Txt style={s.tlK}>{`LINKED QUESTIONS  (${qs.length + 16} available)`}</Txt>
        {qs.map(([k2, qText], idx) => (
          <Pressable key={idx} style={s.qRow} onPress={() => act('syDrill')} testID={`syllabusTopic.q.${idx}`}>
            <Txt style={[s.qTag, k2 === 'Quiz series' && s.qTagG]}>{k2}</Txt>
            <Txt style={s.qBody} numberOfLines={2}>{qText}</Txt>
            <View style={s.solveRow}>
              <Txt style={s.solveTx}>Solve</Txt>
              <Icon name="arrow" size={13} color="#1B8AD3" />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  grab: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D7DCE4', alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  head: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 14 },
  headL: { flex: 1, paddingRight: 10 },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 7 },
  tagTx: { ...font('sans', 700), fontSize: 10.5 },
  stDot: { width: 6, height: 6, borderRadius: 3 },
  h3: { ...font('book', 500), fontSize: 22, lineHeight: 26.4, color: '#14161C', marginTop: 8 },
  circClose: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F6F9', alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: 20, paddingBottom: 36 },
  ready: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 14, borderRadius: 18, backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: '#E3E9F7' },
  ringBox: { position: 'relative', width: 84, height: 84 },
  svgRotate: { transform: [{ rotate: '-90deg' }] },
  ringCenter: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  ringPct: { ...font('serif', 800), fontSize: 20, lineHeight: 22, color: '#14161C' },
  ringSub: { fontSize: 10.5, color: '#7A8494', textTransform: 'uppercase', letterSpacing: 1 },
  readyL: { flex: 1 },
  ytN: { ...font('serif', 800), fontSize: 28, lineHeight: 30, color: '#14161C' },
  ytNSmall: { fontSize: 14.5, color: '#98A1AD' },
  ytL: { fontSize: 12.5, color: '#7A8494', marginTop: 3 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 9 },
  chipPend: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 7, backgroundColor: '#FFF3DF' },
  chipPendTx: { ...font('sans', 700), fontSize: 11.5, color: '#B86E00' },
  chipPyq: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 7, backgroundColor: '#EEEAFF' },
  chipPyqTx: { ...font('sans', 700), fontSize: 11.5, color: '#6C5DD3' },
  dist: { marginTop: 12, padding: 14, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  dh: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dhH6: { ...font('sans', 800), fontSize: 10.5, letterSpacing: 1.4, color: '#8A93A0' },
  dhSpan: { ...font('sans', 700), fontSize: 12.5, color: '#3B5BCC' },
  bars: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  barItem: { flex: 1, alignItems: 'center', gap: 5 },
  barVal: { ...font('serif', 800), fontSize: 13.5, color: '#14161C' },
  col: { width: 28, height: 64, borderRadius: 8, backgroundColor: '#F1F4F8', justifyContent: 'flex-end', overflow: 'hidden' },
  colFill: { width: '100%', borderRadius: 8 },
  barLbl: { fontSize: 11.5, color: '#7A8494' },
  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  ctaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 46, borderRadius: 14 },
  ctaO: { backgroundColor: '#F5A01F' },
  ctaB: { backgroundColor: '#1B8AD3' },
  ctaTx: { ...font('sans', 700), fontSize: 13.5, color: '#FFFFFF' },
  speedRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  speedBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: '#E1E8F0' },
  speedTxt: { flex: 1 },
  speedB: { ...font('sans', 700), fontSize: 13.5, color: '#14161C' },
  speedSm: { fontSize: 11.5, color: '#7A8494' },
  tlK: { ...font('sans', 800), fontSize: 10.5, letterSpacing: 1.4, color: '#8A93A0', marginTop: 20, marginBottom: 6 },
  qRow: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F4F8' },
  qTag: { ...font('sans', 800), fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase', color: '#6C5DD3' },
  qTagG: { color: '#2F8A4A' },
  qBody: { fontSize: 13.5, lineHeight: 19.5, color: '#25272D', marginTop: 4 },
  solveRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  solveTx: { ...font('sans', 700), fontSize: 12.5, color: '#1B8AD3' },
});

export default SyllabusTopicSheet;
