// Source: PrepAssist.html L7743-L7744 (tHero, tStat), L4037-L4051 (.tl-hero, .tl-ic, .tl-eb, .tl-stats), L9306-L9309, L9333 (ds overrides), L10652 (ultimate em)
// PRIVATE COPY of the shared-in-HTML `.tl-*` tool hero (not in src/components; see CONTRACT.md section 4).
// Computed (reference/android view-mains, view-answerbank, view-testquiz .tl-hero):
//   .tl-hero  margin 2 0 16; padding 20 18 18; radius 24; overflow hidden; colour #fff
//             background: radial-gradient(80% 70% at 100% 0%, rgba(255,255,255,.22), transparent 60%),
//                         linear-gradient(150deg, mix(--tc 72%, #0B1630), --tc 70%, mix(--tc 70%, #fff))
//             box-shadow 0 20px 30px -22px mix(--tc 85%, #000)
//   ::after   1px rgba(255,255,255,.05) vertical lines every 48px (repeating-linear-gradient)
//   .tl-ic    absolute right 16 top 16, 44 x 44, radius 14, rgba(255,255,255,.16), 1px rgba(255,255,255,.24); icon 22
//   .tl-eb    inline (line box 22.475) Inter 700 10.5px, letter-spacing 1.575px, uppercase, rgba(255,255,255,.78)
//   h1        EB Garamond 500 26px / 29.12px, margin-top 8, padding-right 50; em italic #FFE2A8
//   p         Inter 400 13.5px / 19.575px, rgba(255,255,255,.82), margin-top 8, max-width 300
//   .tl-stats row gap 8, margin-top 16; cell flex 1, padding 9 10, radius 12, rgba(255,255,255,.13),
//             1px rgba(255,255,255,.16); b Inter Tight 800 18/18; span 10.5 / 15.225 rgba(255,255,255,.75) mt 4
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../../components';
import { MT } from '../../../data';
import type { IconName } from '../../../icons/iconPaths.generated';
import { font, Txt, usePlan } from '../../../theme';
import { hasDevanagari, splitScriptRuns } from '../../../theme/fonts';

const hex = (c: string): [number, number, number] => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
/** color-mix(in srgb, a p, b) */
export function mix(a: string, p: number, b: string): string {
  const x = hex(a);
  const y = hex(b);
  const ch = (i: number): number => Math.round(x[i] * p + y[i] * (1 - p));
  return `rgb(${ch(0)}, ${ch(1)}, ${ch(2)})`;
}

const s = StyleSheet.create({
  hero: { marginTop: 2, marginBottom: 16, paddingTop: 20, paddingHorizontal: 18, paddingBottom: 18, borderRadius: 24, overflow: 'hidden' },
  line: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  ic: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  eb: { ...font('sans', 700), fontSize: 10.5, lineHeight: 22.475, letterSpacing: 1.575, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.78)' },
  h1: { ...font('book', 500), fontSize: 26, lineHeight: 29.12, marginTop: 8, paddingRight: 50, color: '#FFFFFF' },
  em: { ...font('book', 500, true) },
  p: { fontSize: 13.5, lineHeight: 19.575, color: 'rgba(255, 255, 255, 0.82)', marginTop: 8, maxWidth: 300 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 16 },
  stat: { flex: 1, paddingVertical: 9, paddingHorizontal: 10, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.13)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.16)' },
  statB: { ...font('serif', 800), fontSize: 18, ...Platform.select({ ios: { lineHeight: 22 }, default: { lineHeight: 18 } }), color: '#FFFFFF' },
  statS: { fontSize: 10.5, lineHeight: 15.225, color: 'rgba(255, 255, 255, 0.75)', marginTop: 4 },
});

function StatVal({ value }: { value: string }): React.JSX.Element {
  if (Platform.OS === 'ios' && hasDevanagari(value)) {
    return (
      <Txt style={s.statB}>
        {splitScriptRuns(value).map((r, i) =>
          r.devanagari ? (
            <Text key={i} allowFontScaling={false} style={{ fontFamily: 'NotoSansDevanagari-SemiBold' }}>
              {r.text}
            </Text>
          ) : (
            r.text
          ),
        )}
      </Txt>
    );
  }
  return <Txt style={s.statB}>{value}</Txt>;
}

export interface TlHeroProps {
  /** MT key (the tool) */
  id: string;
  /** h1 text before the <em>, the <em> text, and text after it */
  title: [string, string?, string?];
  sub: string;
  stats?: [string, string][];
}

export function TlHero({ id, title, sub, stats }: TlHeroProps): React.JSX.Element {
  const plan = usePlan();
  const m = MT[id];
  const tc = m.c;
  const [w, setW] = useState(0);
  const lines = [];
  for (let x = 47; x < w; x += 48) lines.push(<View key={x} style={[s.line, { left: x }]} pointerEvents="none" />);
  return (
    <View
      style={[
        s.hero,
        {
          backgroundImage: `radial-gradient(80% 70% at 100% 0%, rgba(255, 255, 255, 0.22), rgba(0, 0, 0, 0) 60%), linear-gradient(150deg, ${mix(tc, 0.72, '#0B1630')}, ${tc} 70%, ${mix(tc, 0.7, '#FFFFFF')})`,
          boxShadow: `0px 20px 30px -22px ${mix(tc, 0.85, '#000000')}`,
        },
      ]}
      onLayout={e => setW(e.nativeEvent.layout.width)}>
      {lines}
      <View style={s.ic}>
        <Icon name={m.ic as IconName} size={22} color="#FFFFFF" />
      </View>
      <Txt style={s.eb}>{m.n}</Txt>
      <Txt style={s.h1}>
        {title[0]}
        {title[1] ? <Txt style={[s.em, { color: plan === 'ultimate' ? '#F7D774' : '#FFE2A8' }]}>{title[1]}</Txt> : null}
        {title[2] ?? ''}
      </Txt>
      <Txt style={s.p}>{sub}</Txt>
      {stats ? (
        <View style={s.stats}>
          {stats.map(([v, l], k) => (
            <View key={k} style={s.stat}>
              <StatVal value={v} />
              <Txt style={s.statS}>{l}</Txt>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
