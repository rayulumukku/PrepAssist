// Source: PrepAssist.html L7322 (ring(r, frac, stroke, color, track))
// Two circles: the track, and the arc from 12 o'clock with a round cap and
// stroke-dasharray "C·clamp(frac, .02, 1) C". `children` go inside the <svg> (the <defs> of a
// gradient stroke); `color` may be "url(#id)".
import React from 'react';
import { Circle, G } from 'react-native-svg';

export function ringDash(r: number, frac: number): string {
  const C = 2 * Math.PI * r;
  return `${(C * Math.max(0.02, Math.min(1, frac))).toFixed(1)} ${C.toFixed(
    1,
  )}`;
}

export function RingArcs({
  r,
  frac,
  stroke,
  color,
  track,
}: {
  r: number;
  frac: number;
  stroke: number;
  color: string;
  track: string;
}): React.JSX.Element {
  const c = r + stroke;
  return (
    <G>
      <Circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={track}
        strokeWidth={stroke}
      />
      <Circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={ringDash(r, frac)}
        transform={`rotate(-90 ${c} ${c})`}
      />
    </G>
  );
}
