// Source: PrepAssist.html L4038-L4051 (.tl-hero, .tl-ic, .tl-eb, .tl-stats), L9306-L9309 (hero overrides), L7743-L7744 (tHero, tStat)
// Source: PrepAssist.html L3998-L4000 + L9292-L9300 (.mu-h, .mu-h.mu-h2), L4075-L4077 + L9358-L9359 (.sy-search), L10652 (ultimate .tl-hero h1 em)
// Private copies of classes the HTML shares between tool pages (CONTRACT.md section 4: `.tl-*`, `.mu-h`).
// Computed (reference/android/view-tracker, view-folder):
//   .tl-hero   margin 2 0 16, padding 20 18 18, radius 24; radial(80% 70% at 100% 0%, rgba(255,255,255,.22), transparent 60%)
//              over linear(150deg, mix(tc 72%, #0B1630), tc 70%, mix(tc 70%, #fff)); shadow 0 20 30 -22 mix(tc 85%, #000);
//              ::after a 1px rgba(255,255,255,.05) line every 48px (repeating-linear-gradient 90deg)
//   .tl-ic     44 box at right 16 / top 16, radius 14, rgba(255,255,255,.16) + 1px rgba(255,255,255,.24), icon 22
//   .tl-eb     10.5px 700 ls 1.575 uppercase rgba(255,255,255,.78) (an inline span: 13 px box in a 22.475 line)
//   h1         EB Garamond 500 26 / 29.12, padding-right 50, margin-top 8; em italic #FFE2A8 (#F7D774 on Ultimate)
//   p          13.5 / 19.575 rgba(255,255,255,.82), max-width 300, margin-top 8
//   .tl-stats  margin-top 16, gap 8; div padding 9 10, radius 12, rgba(255,255,255,.13) + 1px .16; b Inter Tight 800 18/18; span 10.5 .75
//   .sy-search 46 high, padding 0 13, radius 14, white, ring 1px #E1E8F0, margin-top 4, gap 9; icon 17 #8A93A0; input 14.5
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Icon } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import { font, fontPx, usePlan, Txt } from '../../theme';
import { mix } from './mix';

export interface TlHeroProps {
  tc: string;
  icon: IconName;
  eb: string;
  /** h1 text before the em, the em, and text after it */
  title: string;
  em?: string;
  after?: string;
  sub: string;
  stats?: readonly (readonly [string | number, string])[];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TlHero({ tc, icon, eb, title, em, after, sub, stats, children, style }: TlHeroProps): React.JSX.Element {
  const plan = usePlan();
  return (
    <View
      style={[
        h.hero,
        {
          backgroundImage: `radial-gradient(80% 70% at 100% 0%, rgba(255, 255, 255, 0.22), transparent 60%), linear-gradient(150deg, ${mix(tc, 72, '#0B1630')}, ${tc} 70%, ${mix(tc, 70, '#FFFFFF')})`,
          boxShadow: `0px 20px 30px -22px ${mix(tc, 85, '#000000')}`,
        },
        style,
      ]}>
      <View style={h.lines} pointerEvents="none" />
      <View style={h.ic}>
        <Icon name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={h.ebLine}>
        <Txt style={h.eb}>{eb}</Txt>
      </View>
      <Txt style={h.h1}>
        {title}
        {em ? <Txt style={[h.em, plan === 'ultimate' && h.emU]}>{em}</Txt> : null}
        {after ?? ''}
      </Txt>
      <Txt style={h.p}>{sub}</Txt>
      {stats && stats.length ? (
        <View style={h.stats}>
          {stats.map(([v, l], k) => (
            <View key={k} style={h.stat}>
              <Txt style={h.statB}>{String(v)}</Txt>
              <Txt style={h.statS}>{l}</Txt>
            </View>
          ))}
        </View>
      ) : null}
      {children}
    </View>
  );
}

/** `.mu-h.mu-h2`: h2 + span */
export function MuH({ title, right, style }: { title: string; right?: string; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return (
    <View style={[h.muH, style]}>
      <Txt style={h.muH2}>{title}</Txt>
      {right !== undefined ? <Txt style={h.muSpan}>{right}</Txt> : null}
    </View>
  );
}

/** `label.sy-search` with its input */
export function SySearch({
  placeholder,
  value,
  onChangeText,
  testID,
  style,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return (
    <View style={[h.search, style]}>
      <Icon name="search" size={17} color="#8A93A0" />
      <TextInput
        style={h.input}
        allowFontScaling={false}
        placeholder={placeholder}
        placeholderTextColor="#757575"
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        testID={testID}
      />
    </View>
  );
}

const h = StyleSheet.create({
  hero: { marginTop: 2, marginBottom: 16, paddingTop: 20, paddingHorizontal: 18, paddingBottom: 18, borderRadius: 24, overflow: 'hidden' },
  lines: {
    ...StyleSheet.absoluteFill,
    backgroundImage: 'linear-gradient(90deg, transparent 47px, rgba(255, 255, 255, 0.05) 47px)',
    backgroundSize: '48px 100%',
    backgroundRepeat: 'repeat',
  },
  ic: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  // the inline span sits in a 22.475 px line box; its 13 px glyph box starts 6 px from the top (rect y 92 vs hero content 86)
  ebLine: { height: 22.475, paddingTop: 4.89 },
  eb: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.575, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.78)' },
  h1: { ...font('book', 500), fontSize: 26, lineHeight: 29.12, color: '#FFFFFF', marginTop: 8, paddingRight: 50 },
  em: { ...font('book', 400, true), color: '#FFE2A8' },
  emU: { color: '#F7D774' },
  p: { fontSize: 13.5, lineHeight: 19.575, color: 'rgba(255, 255, 255, 0.82)', marginTop: 8, maxWidth: 300 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 16 },
  stat: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
  },
  statB: { ...font('serif', 800), fontSize: 18, lineHeight: 18, color: '#FFFFFF' },
  statS: { fontSize: 10.5, lineHeight: 15.225, color: 'rgba(255, 255, 255, 0.75)', marginTop: 4 },
  muH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginTop: 28, marginBottom: 12 },
  muH2: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: '#14161C' },
  muSpan: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 46,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
    marginTop: 4,
  },
  input: { flex: 1, minWidth: 0, padding: 0, fontSize: fontPx(14.5), color: '#25272D', ...font('sans', 400) },
});
