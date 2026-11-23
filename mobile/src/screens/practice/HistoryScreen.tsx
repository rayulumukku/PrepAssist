// Source: PrepAssist.html L6607-L6612 (VIEWS.history)
// Source: PrepAssist.html L2931-L2935 (.slot, .tm, .bx), L3067
// Computed (reference/android view-history): the chart is the inline SVG (viewBox 0 0 340 170, width 100 %:
// 372 x 186); .slot two columns 52 / 1fr gap 12, padding 10 0, border-bottom --rule; .tm 12.5px / 18.125px
// --muted, padding-top 3; .bx 3px left border (--brand inline), padding 2 0 2 12, row space-between;
// b Inter 600 14.5px / 21.025px; small Inter 600 12.5px --ink (inline style), line box 21.025.
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Polyline, Text as SvgText } from 'react-native-svg';
import type { ViewDef } from '../../navigation/routes';
import { font, palettes, Txt, useTheme } from '../../theme';
import { PgHero, Sec } from './parts/PgHero';

const C = palettes.free;
const H = [52, 58, 62, 60, 67, 71, 74];
const inter = font('sans', 400).fontFamily;

const s = StyleSheet.create({
  slot: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.rule },
  tm: { width: 52, fontSize: 12.5, lineHeight: 18.125, color: C.muted, paddingTop: 3, fontVariant: ['tabular-nums'] },
  bx: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', borderLeftWidth: 3, paddingVertical: 2, paddingLeft: 12 },
  b: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, flexShrink: 1 },
  sm: { ...font('sans', 600), fontSize: 12.5, lineHeight: 21.025, color: C.ink },
  h1S: { fontSize: 18, color: C.muted },
});

function Chart(): React.JSX.Element {
  const t = useTheme();
  const [w, setW] = useState(0);
  const pts = H.map((v, i) => `${20 + i * 48},${150 - (v - 40) * 3.2}`).join(' ');
  return (
    <View onLayout={e => setW(e.nativeEvent.layout.width)}>
      {w ? (
        <Svg width={w} height={(w * 170) / 340} viewBox="0 0 340 170">
          <G stroke={C.rule}>
            {[50, 90, 130].map(y => (
              <Path key={y} d={`M10 ${y}H330`} />
            ))}
          </G>
          <Polyline points={pts} fill="none" stroke={t.brand} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {H.map((v, i) => (
            <G key={i}>
              <Circle cx={20 + i * 48} cy={150 - (v - 40) * 3.2} r={4} fill={C.paper} stroke={t.brand} strokeWidth={2} />
              <SvgText x={20 + i * 48} y={140 - (v - 40) * 3.2} textAnchor="middle" fontSize={10} fill={C.ink2} fontFamily={inter}>
                {String(v)}
              </SvgText>
            </G>
          ))}
          <SvgText x={10} y={166} fontSize={10} fill={C.muted} fontFamily={inter}>
            Sep
          </SvgText>
          <SvgText x={330} y={166} textAnchor="end" fontSize={10} fill={C.muted} fontFamily={inter}>
            Today
          </SvgText>
        </Svg>
      ) : null}
    </View>
  );
}

function HistoryScreen(): React.JSX.Element {
  const t = useTheme();
  return (
    <>
      <PgHero
        title={
          <>
            71% <Txt style={s.h1S}>avg. accuracy</Txt>
          </>
        }
        sub="Up 9 points in 30 days. Writs and Economy still pull the average down."
      />
      <Sec>
        <Chart />
        {[
          ['Polity · Writs', '8/10', '20 Oct'],
          ['Prelims Test 11 · Modern History', '68/100', '18 Oct'],
          ['Economy · Inflation', '6/10', '16 Oct'],
          ['Environment · Wetlands', '7/10', '14 Oct'],
          ['Full-Length Mock 3', '94/200', '11 Oct'],
        ].map(x => (
          <View key={x[0]} style={s.slot}>
            <Txt style={s.tm}>{x[2]}</Txt>
            <View style={[s.bx, { borderLeftColor: t.brand }]}>
              <Txt style={s.b}>{x[0]}</Txt>
              <Txt style={s.sm}>{x[1]}</Txt>
            </View>
          </View>
        ))}
      </Sec>
    </>
  );
}

const view: ViewDef = {
  useTitle: () => 'Quiz history',
  Screen: HistoryScreen,
};

export default view;
