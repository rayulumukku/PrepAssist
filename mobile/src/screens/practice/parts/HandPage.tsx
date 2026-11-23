// Source: PrepAssist.html L5589-L5608 (handPage)
// The scanned answer page: white sheet, ruled lines, margin line, 15 handwriting strokes and, when
// annotated, the examiner's red / green marks in Caveat. preserveAspectRatio="xMidYMin slice".
import React from 'react';
import Svg, { Ellipse, Path, Rect, Text as SvgText } from 'react-native-svg';
import { font } from '../../../theme';
import { handPage } from '../logic/handPage';

const hand = font('hand', 500).fontFamily;

export function HandPage({ seed = 1, annotated = false, width, height }: { seed?: number; annotated?: boolean; width: number | string; height: number | string }): React.JSX.Element {
  const g = handPage(seed, annotated);
  const red = '#B23B2E';
  const note = (x: number, y: number, t: string, c = red): React.JSX.Element => (
    <SvgText x={x} y={y} fontFamily={hand} fontSize={15} fill={c}>
      {t}
    </SvgText>
  );
  return (
    <Svg width={width} height={height} viewBox={g.viewBox} preserveAspectRatio="xMidYMin slice">
      <Rect width="100%" height="100%" fill="#FFFFFF" />
      {g.rules.map(r => (
        <Path key={r.y} d={`M0 ${r.y}H${r.x2}`} stroke="#E2E6F0" strokeWidth={0.8} />
      ))}
      <Path d="M18 0V300" stroke="#BFDDF3" strokeWidth={1} />
      {annotated ? <Path d="M188 0V300" stroke="#E3EAF2" /> : null}
      {g.strokes.map((d, k) => (
        <Path key={k} d={d} stroke="#23338A" strokeWidth={1.1} fill="none" opacity={0.85} />
      ))}
      {annotated ? (
        <>
          <Path d="M22 22 h170" stroke={red} strokeWidth={1} opacity={0} />
          <Ellipse cx={96} cy={47} rx={40} ry={9} fill="none" stroke={red} strokeWidth={1.4} />
          {note(196, 40, 'Define first')}
          <Path d="M196 44 C186 48 150 48 138 47" stroke={red} strokeWidth={1} fill="none" />
          <Path d="M200 110 l6 6 10 -14" stroke="#2F7A4F" strokeWidth={2} fill="none" />
          {note(220, 114, 'good', '#2F7A4F')}
          <Path d="M24 166 H180" stroke={red} strokeWidth={1.2} strokeDasharray="3 3" />
          {note(196, 170, 'cite Maneka')}
          {note(196, 184, 'Gandhi (1978)')}
          <Path d="M14 222 v40" stroke={red} strokeWidth={2} />
          {note(196, 246, 'conclusion too')}
          {note(196, 260, 'generic')}
        </>
      ) : null}
    </Svg>
  );
}
