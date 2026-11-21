// Source: PrepAssist.html L7743-L7744 (tHero, tStat), L4037-L4051 (.me-page.tlp, .tl-hero, ::after, .tl-ic, .tl-eb, h1, em, p, .tl-stats), L9306-L9309, L9333 (ds overrides), L10652 (ultimate em colour)
// PRIVATE copy (study area) of the tools hero shared by the Menu tool pages. Computed (reference/android/view-mindmaps,
// view-saved):
//   section  margin 2px 0 16px; padding 20px 18px 18px; radius 24; overflow hidden; #fff;
//            background radial-gradient(80% 70% at 100% 0%, rgba(255,255,255,.22), transparent 60%),
//            linear-gradient(150deg, mix(--tc 72%, #0B1630), --tc 70%, mix(--tc 70%, #fff));
//            box-shadow 0 20px 30px -22px mix(--tc 85%, #000)
//   ::after  repeating 1px rgba(255,255,255,.05) lines every 48px (at 47px): drawn as 1px Views, under the content
//   .tl-ic   absolute right 16 top 16, 44 x 44, radius 14, rgba(255,255,255,.16), 1px rgba(255,255,255,.24); icon 22 #fff
//   .tl-eb   Inter 700 10.5px, letter-spacing 1.575px, uppercase, rgba(255,255,255,.78); inline in a 22.475px line
//   h1       EB Garamond 500 26px / 29.12px, padding-right 50, margin-top 8; em italic #FFE2A8 (ultimate #F7D774)
//   p        13.5px / 19.575px, rgba(255,255,255,.82), max-width 300, margin-top 8
//   .tl-stats row gap 8, margin-top 16; div flex 1, padding 9 10, radius 12, rgba(255,255,255,.13), 1px rgba(255,255,255,.16)
//            b Inter Tight 800 18px / 18px; span 10.5px / 15.225px rgba(255,255,255,.75), margin-top 4
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from '../../../components';
import { MT } from '../../../data';
import type { IconName } from '../../../icons/iconPaths.generated';
import { font, Txt, usePlan } from '../../../theme';
import { colorMix } from './mapsLogic';

const styles = StyleSheet.create({
  hero: { marginTop: 2, marginBottom: 16, paddingTop: 20, paddingHorizontal: 18, paddingBottom: 18, borderRadius: 24, overflow: 'hidden' },
  stripe: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
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
  },
  // inline span in the section's 22.475px line box: the glyph box (13px) sits 6px below the line top
  ebLine: { height: 22.475 },
  eb: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, marginTop: 4.9, letterSpacing: 1.575, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.78)' },
  h1: { ...font('book', 500), fontSize: 26, lineHeight: 29.12, color: '#FFFFFF', marginTop: 8, paddingRight: 50 },
  em: { ...font('book', 500, true) },
  emC: { color: '#FFE2A8' },
  emU: { color: '#F7D774' },
  p: { fontSize: 13.5, lineHeight: 19.575, color: 'rgba(255, 255, 255, 0.82)', marginTop: 8, maxWidth: 300 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 16 },
  stat: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  statB: { ...font('serif', 800), fontSize: 18, lineHeight: 18, color: '#FFFFFF' },
  statS: { fontSize: 10.5, lineHeight: 15.225, color: 'rgba(255, 255, 255, 0.75)', marginTop: 4 },
});

export interface TlStat {
  v: string | number;
  l: string;
}

export interface TlHeroProps {
  /** MT key (--tc, icon and eyebrow come from MT[id]) */
  id: string;
  /** title before the <em>, the <em> text, and the text after it (tHero's title is HTML with one optional em) */
  title: string;
  em?: string;
  titleAfter?: string;
  sub: string;
  stats?: TlStat[];
}

/** `tHero(id, title, sub, stats)` with `tStat(v, l)` items. */
export function TlHero({ id, title, em, titleAfter, sub, stats }: TlHeroProps): React.JSX.Element {
  const t = MT[id];
  const plan = usePlan();
  const [w, setW] = useState(0);
  const tc = t.c;
  const bg = {
    backgroundImage:
      'radial-gradient(80% 70% at 100% 0%, rgba(255, 255, 255, 0.22), rgba(0, 0, 0, 0) 60%), ' +
      `linear-gradient(150deg, ${colorMix(tc, 0.72, '#0B1630')}, ${tc} 70%, ${colorMix(tc, 0.7, '#FFFFFF')})`,
    boxShadow: `0px 20px 30px -22px ${colorMix(tc, 0.85, '#000000')}`,
  };
  const stripes: number[] = [];
  for (let x = 47; x < w; x += 48) stripes.push(x);
  return (
    <View style={[styles.hero, bg]} onLayout={e => setW(e.nativeEvent.layout.width)}>
      {stripes.map(x => (
        <View key={x} style={[styles.stripe, { left: x }]} pointerEvents="none" />
      ))}
      <View style={styles.ic}>
        <Icon name={t.ic as IconName} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.ebLine}>
        <Txt style={styles.eb}>{t.n}</Txt>
      </View>
      <Txt style={styles.h1}>
        {title}
        {em ? <Txt style={[styles.em, plan === 'ultimate' ? styles.emU : styles.emC]}>{em}</Txt> : null}
        {titleAfter ?? ''}
      </Txt>
      <Txt style={styles.p}>{sub}</Txt>
      {stats && stats.length ? (
        <View style={styles.stats}>
          {stats.map(s => (
            <View key={s.l} style={styles.stat}>
              <Txt style={styles.statB}>{String(s.v)}</Txt>
              <Txt style={styles.statS}>{s.l}</Txt>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
