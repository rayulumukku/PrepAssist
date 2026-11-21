// Source: PrepAssist.html L5105-L5105 (<symbol id="logo">)
// `<svg viewBox="0 0 24 24"><use href="#logo"/></svg>`: the three-path mark. Its size comes from the
// rule of the element it sits in (.wordmark svg, .pl-logo svg, .me-flogo svg …), passed as `size`.
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ICONS } from '../icons/iconPaths.generated';

export interface LogoProps {
  size: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Logo({ size, style, testID }: LogoProps): React.JSX.Element {
  const def = ICONS.logo;
  return (
    <Svg width={size} height={size} viewBox={def.viewBox ?? '0 0 24 24'} style={style} testID={testID}>
      {def.shapes.map((s, i) => (
        <Path
          key={i}
          d={s.attrs.d}
          fill={s.attrs.fill ?? '#000'}
          stroke={s.attrs.stroke ?? 'none'}
          strokeWidth={s.attrs.strokeWidth === undefined ? undefined : Number(s.attrs.strokeWidth)}
          strokeLinejoin={s.attrs.strokeLinejoin as 'round' | undefined}
        />
      ))}
    </Svg>
  );
}
