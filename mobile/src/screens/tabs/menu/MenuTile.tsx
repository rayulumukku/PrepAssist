// Source: PrepAssist.html L7714-L7714 (mTile), L7721-L7723 (omr and hand art), L4003-L4027 (.mt, .mt-ic, .mt-st, .mt-big, .mt-dark, .mt-art, .mt-tint, .mt-wide, .mt-ai)
// One Menu tool tile. Computed (reference/android/tab-menu):
//   .mt        #fff, radius 18, padding 14, min-height 150, column, align start, overflow hidden,
//              shadow 0 0 0 1px #E6EBF1, 0 10px 22px -20px rgba(20,30,50,.5); :active scale(.97) over .2s var(--ease)
//   .mt-ic     38 x 38 radius 12, var(--tc) on color-mix(var(--tc) 12 %, #fff), icon 18
//   b          Inter 700 14.5/17.4 #14161C margin-top 12; small 11.5/15.525 #7A8494 margin-top 4
//   .mt-st     margin-top auto, padding-top 10, gap 5, Inter 700 11.5/16.675 var(--tc); ::before 6 px dot
//   .mt-dark   radial(90% 60% at 100% 0%, rgba(255,255,255,.18), transparent 60%) + linear(165deg,#4A3DB0,#6C5DD3 60%,#8A7BEA),
//              shadow 0 18px 30px -18px rgba(108,93,211,.9); ic rgba(255,255,255,.16) #fff; b EB Garamond 500 20/24 #fff;
//              small rgba(255,255,255,.75); st #FFD27A; omr art left 16 bottom 46 width 132, circles stroke 1.4
//   .mt-tint   linear(180deg, color-mix(var(--tc) 8 %, #fff), #fff 70 %); art right -6 top 10 width 80, opacity .3, stroke var(--tc) 1.6
//   .mt-wide   grid 40px 1fr, column-gap 12, centred; b margin 0; .mt-st padding-top 6
//   .mt-ai     linear(160deg, #fff 40 %, color-mix(var(--tc) 10 %, #fff)); ::after "AI" top 14 right 14, padding 3 7,
//              radius 6, linear(90deg,#6C5DD3,#1B8AD3), Inter 800 9.5 ls .95 #fff
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { act } from '../../../actions';
import { Icon } from '../../../components';
import type { IconName } from '../../../icons/iconPaths.generated';
import { MT } from '../../../data';
import { easeVar, useTransition } from '../../../shell/anim';
import { font, Txt } from '../../../theme';
import { mix } from '../homeLogic';
import { mAct } from './menuLogic';

export type TileKind = 'plain' | 'big' | 'tint' | 'wide' | 'ai';

const OMR_FONT = font('sans', 700).fontFamily;

/** omr (L7721): a 5 x 4 answer sheet, five bubbles filled. */
function Omr(): React.JSX.Element {
  return (
    <Svg width={132} height={(132 * 92) / 120} viewBox="0 0 120 92" style={styles.omr} pointerEvents="none">
      {Array.from({ length: 20 }, (_, i) => {
        const r = Math.floor(i / 4);
        const c = i % 4;
        const on = [1, 6, 8, 15, 18].includes(i);
        return (
          <React.Fragment key={i}>
            {c === 0 ? (
              <SvgText x={0} y={12 + r * 18} fontSize={9} fontFamily={OMR_FONT} fill="rgba(255,255,255,.7)">
                {String(r + 1)}
              </SvgText>
            ) : null}
            <Circle cx={22 + c * 24} cy={9 + r * 18} r={7} fill={on ? '#FFD27A' : 'none'} stroke={on ? '#FFD27A' : 'rgba(255,255,255,.55)'} strokeWidth={1.4} />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

/** hand (L7722): three handwritten lines. */
function Hand({ color }: { color: string }): React.JSX.Element {
  return (
    <Svg width={80} height={(80 * 60) / 90} viewBox="0 0 90 60" style={styles.hand} pointerEvents="none">
      <Path
        d="M8 14c8-4 14 4 22 0s14-4 22 0 12 2 18 0M8 28c8-4 14 4 22 0s14-4 22 0M8 42c8-4 14 4 22 0s14-4 22 0 12 2 18 0"
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MenuTile({ id, kind = 'plain', art, stat, style }: { id: string; kind?: TileKind; art?: 'omr' | 'hand'; stat: string; style?: object }): React.JSX.Element {
  const t = MT[id];
  const [pressed, setPressed] = React.useState(false);
  const s = useTransition(pressed ? 0.97 : 1, 200, easeVar);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const dark = kind === 'big';
  const bg =
    kind === 'big'
      ? styles.dark
      : kind === 'tint'
        ? { backgroundImage: `linear-gradient(180deg, ${mix(t.c, 0.08, '#FFFFFF')}, #FFFFFF 70%)` }
        : kind === 'ai'
          ? { backgroundImage: `linear-gradient(160deg, #FFFFFF 40%, ${mix(t.c, 0.1, '#FFFFFF')})` }
          : styles.white;
  const ic = (
    <View style={[styles.ic, { backgroundColor: dark ? 'rgba(255,255,255,0.16)' : mix(t.c, 0.12, '#FFFFFF') }]}>
      <Icon name={t.ic as IconName} size={18} color={dark ? '#fff' : t.c} />
    </View>
  );
  const stColor = dark ? '#FFD27A' : t.c;
  const st = (
    <View style={[styles.st, kind === 'wide' && styles.stWide]}>
      <View style={[styles.stDot, { backgroundColor: stColor }]} />
      <Txt style={[styles.stT, { color: stColor }]}>{stat}</Txt>
    </View>
  );
  return (
    <Animated.View style={[styles.wrap, style, anim]}>
      <Pressable
        onPress={() => act(mAct(id))}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={[styles.mt, kind === 'big' && styles.big, kind === 'wide' && styles.wide, bg]}
        testID={`menu.tile.${id}`}
      >
        {art === 'omr' ? <Omr /> : art === 'hand' ? <Hand color={t.c} /> : null}
        {kind === 'wide' ? (
          <>
            <View style={styles.wideIc}>{ic}</View>
            <View style={styles.flex1}>
              <Txt style={[styles.b, styles.bWide]}>{t.n}</Txt>
              <Txt style={styles.small}>{t.d}</Txt>
              {st}
            </View>
          </>
        ) : (
          <>
            {ic}
            <Txt style={[styles.b, dark && styles.bDark]}>{t.n}</Txt>
            <Txt style={[styles.small, dark && styles.smallDark]}>{t.d}</Txt>
            {st}
          </>
        )}
        {kind === 'ai' ? (
          <View style={styles.ai}>
            <Txt style={styles.aiT}>AI</Txt>
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, minWidth: 0 },
  wrap: { borderRadius: 18 },
  mt: {
    flexGrow: 1,
    minHeight: 150,
    padding: 14,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'flex-start',
    boxShadow: '0px 0px 0px 1px #E6EBF1, 0px 10px 22px -20px rgba(20, 30, 50, 0.5)',
  },
  white: { backgroundColor: '#fff' },
  big: { minHeight: 310, boxShadow: '0px 18px 30px -18px rgba(108, 93, 211, 0.9)' },
  dark: {
    backgroundImage: 'radial-gradient(90% 60% at 100% 0%, rgba(255,255,255,0.18), transparent 60%), linear-gradient(165deg, #4A3DB0, #6C5DD3 60%, #8A7BEA)',
  },
  wide: { minHeight: 0, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff' },
  wideIc: { width: 40 },
  ic: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  b: { ...font('sans', 700), fontSize: 14.5, lineHeight: 17.4, color: '#14161C', marginTop: 12 },
  bWide: { marginTop: 0 },
  bDark: { ...font('book', 500), fontSize: 20, lineHeight: 24, color: '#fff' },
  small: { fontSize: 11.5, lineHeight: 15.525, color: '#7A8494', marginTop: 4 },
  smallDark: { color: 'rgba(255,255,255,0.75)' },
  st: { marginTop: 'auto', paddingTop: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  stWide: { marginTop: 0, paddingTop: 6 },
  stDot: { width: 6, height: 6, borderRadius: 3 },
  stT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675 },
  omr: { position: 'absolute', left: 16, bottom: 46 },
  hand: { position: 'absolute', right: -6, top: 10, opacity: 0.3 },
  ai: { position: 'absolute', top: 14, right: 14, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 6, backgroundImage: 'linear-gradient(90deg, #6C5DD3, #1B8AD3)' },
  aiT: { ...font('sans', 800), fontSize: 9.5, lineHeight: 13.775, letterSpacing: 0.95, color: '#fff' },
});
