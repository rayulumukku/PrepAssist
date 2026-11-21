// Source: PrepAssist.html L37-L37 (svg.ic), L4658-L4724 (icon sprite), L5114-L5114 (ic())
// `<svg class="ic"><use href="#i-NAME"/></svg>` — drawn from the generated icon data.
// Base rule: svg.ic{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.6;
// stroke-linecap:round;stroke-linejoin:round;flex:none}. Rules that restyle an icon in place
// (`.nav button svg.ic{width:21px;height:21px;stroke-width:1.5}`) are passed as props.
// `color` is CSS currentColor: React Native has no inherited colour, so the caller passes the text
// colour of the element the icon sits in.
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { ICONS } from '../icons/iconPaths.generated';
import type { IconName, IconShape } from '../icons/iconPaths.generated';
import { palettes } from '../theme/tokens';

export interface IconProps {
  name: IconName;
  /** width = height, px. Default 20. */
  size?: number;
  /** currentColor. Default --ink. */
  color?: string;
  /** stroke-width in the icon's 24-unit box. Default 1.6. */
  strokeWidth?: number;
  /** fill of shapes that carry no fill of their own. Default 'none'. */
  fill?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const num = (v: string | undefined): number | undefined => (v === undefined ? undefined : Number(v));

function Shape({ shape }: { shape: IconShape }): React.JSX.Element | null {
  const a = shape.attrs;
  // Per-shape presentation attributes override the inherited ones (the `logo` symbol uses them).
  const paint = {
    ...(a.fill !== undefined ? { fill: a.fill } : null),
    ...(a.stroke !== undefined ? { stroke: a.stroke } : null),
    ...(a.strokeWidth !== undefined ? { strokeWidth: Number(a.strokeWidth) } : null),
    ...(a.strokeLinejoin !== undefined ? { strokeLinejoin: a.strokeLinejoin as 'round' | 'miter' | 'bevel' } : null),
  };
  switch (shape.type) {
    case 'path':
      return <Path d={a.d} {...paint} />;
    case 'rect':
      return <Rect x={num(a.x)} y={num(a.y)} width={num(a.width)} height={num(a.height)} rx={num(a.rx)} ry={num(a.ry)} {...paint} />;
    case 'circle':
      return <Circle cx={num(a.cx)} cy={num(a.cy)} r={num(a.r)} {...paint} />;
    case 'ellipse':
      return <Ellipse cx={num(a.cx)} cy={num(a.cy)} rx={num(a.rx)} ry={num(a.ry)} {...paint} />;
    default:
      return null;
  }
}

export function Icon({
  name,
  size = 20,
  color = palettes.free.ink,
  strokeWidth = 1.6,
  fill = 'none',
  style,
  testID,
}: IconProps): React.JSX.Element {
  const def = ICONS[name];
  return (
    <Svg
      width={size}
      height={size}
      viewBox={def.viewBox ?? '0 0 24 24'}
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      testID={testID}>
      {def.shapes.map((s, i) => (
        <Shape key={i} shape={s} />
      ))}
    </Svg>
  );
}
