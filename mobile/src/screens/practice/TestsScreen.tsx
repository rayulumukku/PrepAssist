// Source: PrepAssist.html L6601-L6606 (VIEWS.tests)
// Source: PrepAssist.html L2589-L2595 (.tsi), L3074 (.tsi .st colour)
// Computed (reference/android view-tests):
//   .tsi      three columns 52 / 1fr / auto, gap 12, centred; padding 12 0; border-bottom --rule
//   .dt       centred, padding 5 0, radius 8, 1px --rule-2, #fff; b Inter Tight 700 20/20 (-0.6px);
//             span inline (line box 22.475... its own 13.775) Inter 700 9.5px, letter-spacing .95px, uppercase, --muted
//   h5        Inter 600 14.5px / 21.025px; p 12.5px / 18.125px --muted
//   .st       Inter 700 11.5px / 16.675px, letter-spacing .69px, uppercase, --brand
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Eyebrow, Icon } from '../../components';
import { TESTS } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { font, palettes, Txt, useTheme } from '../../theme';
import { PgHero, Sec } from './parts/PgHero';

const C = palettes.free;
const s = StyleSheet.create({
  tsi: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.rule },
  dt: { width: 52, alignItems: 'center', paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: C.rule2, backgroundColor: C.sheet },
  dtB: { ...font('serif', 700), fontSize: 20, lineHeight: 20, letterSpacing: -0.6, textAlign: 'center', alignSelf: 'stretch' },
  dtS: { ...font('sans', 700), fontSize: 9.5, lineHeight: 22.475, letterSpacing: 0.95, textTransform: 'uppercase', color: C.muted },
  mid: { flex: 1 },
  h5: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025 },
  p: { fontSize: 12.5, lineHeight: 18.125, color: C.muted },
  st: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, letterSpacing: 0.69, textTransform: 'uppercase' },
});

function Tsi({ d, m, t, p, right, act: a }: { d: string; m: string; t: string; p: string; right: React.ReactNode; act: string }): React.JSX.Element {
  return (
    <Pressable style={s.tsi} onPress={() => act(a)}>
      <View style={s.dt}>
        <Txt style={s.dtB}>{d}</Txt>
        <Txt style={s.dtS}>{m}</Txt>
      </View>
      <View style={s.mid}>
        <Txt style={s.h5}>{t}</Txt>
        <Txt style={s.p}>{p}</Txt>
      </View>
      {right}
    </Pressable>
  );
}

function TestsScreen(): React.JSX.Element {
  const t = useTheme();
  return (
    <>
      <PgHero title="Test Series" sub="Scheduled sectional and full-length tests. Each opens as a timed quiz." />
      <Sec>
        <Eyebrow style={{ marginBottom: 4 }}>Upcoming</Eyebrow>
        {TESTS.map(x => (
          <Tsi key={x.t} d={x.d} m={x.m} t={x.t} p={x.s} act="testStart" right={<Txt style={[s.st, { color: t.brand }]}>{x.st}</Txt>} />
        ))}
        <Eyebrow style={{ marginTop: 22, marginBottom: 4 }}>Completed</Eyebrow>
        {[
          ['18', 'Oct', 'Prelims Test 11 · Modern History', '68 / 100'],
          ['11', 'Oct', 'Full-Length Mock 3', '94 / 200'],
          ['4', 'Oct', 'Prelims Test 10 · Economy', '58 / 100'],
        ].map(x => (
          <Tsi key={x[2]} d={x[0]} m={x[1]} t={x[2]} p={`Score ${x[3]}`} act="push:history" right={<Icon name="chev" color={C.ink} />} />
        ))}
      </Sec>
    </>
  );
}

const view: ViewDef = {
  useTitle: () => 'Test Series',
  Screen: TestsScreen,
};

export default view;
