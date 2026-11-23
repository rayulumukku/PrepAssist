// Source: PrepAssist.html L6918-L6920 (SHEETS.credits)
// Source: PrepAssist.html L2893-L2901 and L2986 (.pf-stats: private copy), the shared .eyebrow, .rb, .btn
// Computed from reference/android/sheet-credits. No element of the final UI opens this sheet (A.credits
// now pushes the wallet); it stays reachable through A.sheet('credits'), as in the HTML.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn, Eyebrow, RatioBar, SheetFrame } from '../../components';
import { cssColor, font, palettes, Txt, useTheme } from '../../theme';

const C = palettes.free;
const ROWS: [string, number, string][] = [
  ['AI Mains Evaluation', 120, 'var(--ink)'],
  ['AI Mentor', 80, 'var(--brand)'],
  ['AI Prelims Engine', 40, 'var(--sky)'],
  ['Mindmaps & X-Ray', 20, 'var(--history)'],
];

function CreditsSheet(): React.JSX.Element {
  const t = useTheme();
  return (
    <SheetFrame title="AI credits" testID="sheet.credits">
      <View style={s.stats}>
        <View style={[s.cell, s.odd]}>
          <Txt style={s.k}>Left this month</Txt>
          <Txt style={s.v}>
            {'240'}
            <Txt style={s.vSmall}> / 500</Txt>
          </Txt>
          <Txt style={s.s}>Resets 1 Nov</Txt>
        </View>
        <View style={[s.cell, s.even]}>
          <Txt style={s.k}>Used</Txt>
          <Txt style={s.v}>260</Txt>
          <Txt style={s.s}>Since 1 Oct</Txt>
        </View>
      </View>
      <Eyebrow style={s.eb}>Where they went</Eyebrow>
      {ROWS.map(([n, v, c]) => (
        <RatioBar
          key={n}
          label={n}
          percent={v / 1.2}
          value={String(v)}
          color={cssColor(c, t)}
          labelWidth={130}
          valueWidth={36}
        />
      ))}
      <Btn
        variant="ink"
        wide
        label="Get more credits"
        style={s.btn}
        onPress={() => act('toast:Top-up options would open here')}
        testID="sheet.credits.more"
      />
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  stats: { flexDirection: 'row' },
  cell: {
    flex: 1,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.rule,
  },
  odd: { borderRightWidth: 1, borderRightColor: C.rule, paddingRight: 14 },
  even: { paddingLeft: 16 },
  k: {
    ...font('sans', 500),
    fontSize: 11.5,
    lineHeight: 16.675,
    color: C.muted,
  },
  v: {
    ...font('serif', 700),
    fontSize: 28,
    lineHeight: 30.8,
    letterSpacing: -0.84,
    marginTop: 4,
    color: C.ink,
  },
  vSmall: { fontSize: 15.5, color: C.muted },
  s: {
    ...font('sans', 500),
    fontSize: 11.5,
    lineHeight: 16.675,
    marginTop: 2,
    color: C.muted,
  },
  eb: { marginTop: 18, marginBottom: 6 },
  btn: { marginTop: 18 },
});

export default CreditsSheet;
