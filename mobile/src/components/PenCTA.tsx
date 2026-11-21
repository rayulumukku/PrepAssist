// Source: PrepAssist.html L1023-L1029 (.pcta, .pcta-svg, .pcta-lab, .pcta-lab svg.ic, .pcta:active)
// Source: PrepAssist.html L1195-L1197 (the final !important geometry), L1091-L1091 (the final drop-shadow)
// Source: PrepAssist.html L6429-L6442 (penCTA()), L4988-L5008 (the same markup written out for #btnIn)
// Source: PrepAssist.html L10653-L10666 (planthemes: gradient stops and label colour per plan)
// Source: PrepAssist.html L10682-L10687 (.ug-card.u-pro > .pcta is always purple)
// The pen-shaped button: a fountain pen drawn in SVG, stretched to the button box, with a label and an
// arrow on its barrel.
// Computed (reference/android: stage-auth-signin, stage-auth-signup, stage-verify, tab-home,
// tab-practice, tab-practice-mains, view-upgrade, view-mains; pro and ultimate captures of the same):
//   .pcta      always the full width of its parent x 62 (368, 366, 340, 372 px in the eight uses; no use
//              is intrinsic width), margin 0, filter drop-shadow(0 12px 14px rgba(27,138,211,.35)) in
//              every plan theme, transition transform .25s var(--ease)
//   .pcta-svg  absolute, inset 0, viewBox 0 0 360 60, preserveAspectRatio none (identical markup in all uses)
//   .pcta-lab  absolute, left 21 % right 17 % top 0 bottom 0, row, centred, gap 8;
//              Inter 700 16.5px / 23.925px, letter-spacing 0.165px, #fff; arrow icon 18 px, stroke 1.6
// Plan themes recolour the six stops of the FIRST gradient (the barrel) and, under ultimate, the label
// (#F7DE8E). The `svg` field of dom.json does not carry those colours; they are read from the CSS.
// States: :active -> translateX(6px) scale(.99), eased over 250 ms both ways. :hover is not ported.
//
// Contextual rules that are NOT part of this component (the owning screen applies them through `style`
// or its own animation):
//   #s-auth.up .pcta            margin-top:auto (computed 159.438px on stage-auth-signup), margin-bottom
//                               (L1115, L1137, L1144, L1163)
//   #s-auth .au-form.signing .pcta, #s-auth .pen-row.signing .pcta, #fIn.signing ~ * #btnIn
//                               animation penW2 .9s ease-in-out on submit (L1030-L1031, L1205-L1206)
//   .vf2-foot .pcta, .ug-card .pcta   margin-top:0 (L1188, L3532): already 0 here
//   .rpen, .rpen-svg, #s-auth .rpen …  (L917-L922, L944, L969, L1007-L1016): a different, older pen
//                               button of the arrival stage; not this class
//
// The drop shadow follows the pen's outline (CSS filter). Android draws it with the `filter` style
// (RenderEffect: Android 12+; older versions draw no shadow). iOS has no `filter` drop-shadow in this
// React Native build (enableSwiftUIBasedFilters is off), so it uses the layer shadow, which follows the
// content's alpha when the view has no background colour. 14px is a standard deviation in both
// (measured on tab-practice/shot.png: the tint above the pen fits sigma 14, not 7).
// The view that carries the shadow is larger than the button by the reach of the shadow (3 sigma, plus
// the 12 px offset; the same above and below so that the scale of :active keeps its centre), because
// an Android RenderEffect may be confined to the bounds of its view. It takes no touches.
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useTransition } from '../shell/anim';
import { font } from '../theme/fonts';
import { Txt } from '../theme/Txt';
import { usePlan } from '../theme/useTheme';
import { Icon } from './Icon';

/**
 * Which barrel colours to draw.
 *   'plan'  follows the plan theme: html[data-plan] .pcta:not(.ug-card > .pcta) (L10654-L10666)
 *   'free'  never recoloured: `.ug-card > .pcta` (the :not() above). No such button is rendered by the
 *           HTML today (only the Pro card uses penCTA, L7525); the value exists for that selector.
 *   'pro'   always purple: `.ug-card.u-pro > .pcta` (L10682-L10687)
 */
export type PenCTATone = 'plan' | 'free' | 'pro';

export interface PenCTAProps {
  /** Text of .pcta-lab. */
  label: string;
  /** data-act of the button. */
  onPress?: () => void;
  tone?: PenCTATone;
  /** aria-label. penCTA() uses the label; #btnVerified has its own ("I’ve verified my email"). */
  accessibilityLabel?: string;
  /** Margins and the like from the owning screen (see the contextual rules above). */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

type Barrel = 'free' | 'pro' | 'ultimate';

/** Stops of the first gradient (id L…, the barrel), at offsets 0, .12, .24, .55, .82, 1. */
const BARREL: Readonly<Record<Barrel, readonly string[]>> = {
  free: ['#0B4F82', '#7CC4F0', '#2398E0', '#1680C6', '#0D5C96', '#3EA6E6'], // L6432
  pro: ['#2A1478', '#CDBFFF', '#7C5CF0', '#6440DC', '#3C1FA6', '#A08AFF'], // L10654-L10659, L10682-L10687
  ultimate: ['#000', '#6B5A36', '#2B2316', '#17120A', '#050403', '#7A6338'], // L10660-L10665
};
const BARREL_OFFSETS = [0, 0.12, 0.24, 0.55, 0.82, 1] as const;

const LABEL_WHITE = '#fff';
/** html[data-plan="ultimate"] .pcta:not(.ug-card > .pcta) .pcta-lab (L10666) */
const LABEL_ULTIMATE = '#F7DE8E';

/** transition:transform .25s var(--ease) */
const PRESS_MS = 250;
/** Reach of drop-shadow(0 12px 14px): 3 x 14 sideways, 12 + 3 x 14 downwards. */
const SHADOW_X = 42;
const SHADOW_Y = 54;

const styles = StyleSheet.create({
  pcta: {
    width: '100%',
    height: 62,
  },
  body: {
    position: 'absolute',
    top: -SHADOW_Y,
    bottom: -SHADOW_Y,
    left: -SHADOW_X,
    right: -SHADOW_X,
    pointerEvents: 'none',
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(27, 138, 211)',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 14,
      },
      default: {
        filter: [
          { dropShadow: { offsetX: 0, offsetY: 12, standardDeviation: 14, color: 'rgba(27, 138, 211, 0.35)' } },
        ],
      },
    }),
  },
  pen: {
    position: 'absolute',
    top: SHADOW_Y,
    bottom: SHADOW_Y,
    left: SHADOW_X,
    right: SHADOW_X,
  },
  lab: {
    position: 'absolute',
    left: '21%',
    right: '17%',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  labText: {
    ...font('sans', 700),
    fontSize: 16.5,
    lineHeight: 23.925,
    letterSpacing: 0.165,
    textAlign: 'center',
    flexShrink: 1,
  },
  white: { color: LABEL_WHITE },
  gold: { color: LABEL_ULTIMATE },
});

function Pen({ barrel }: { barrel: Barrel }): React.JSX.Element {
  const stops = BARREL[barrel];
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 360 60" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="L" x1="0" y1="0" x2="0" y2="1">
          {stops.map((c, i) => (
            <Stop key={i} offset={BARREL_OFFSETS[i]} stopColor={c} />
          ))}
        </LinearGradient>
        <LinearGradient id="A" x1="0" y1="0" x2="0" y2="1">
          <Stop offset={0} stopColor="#7A5512" />
          <Stop offset={0.22} stopColor="#FFF1BF" />
          <Stop offset={0.42} stopColor="#E0B252" />
          <Stop offset={0.72} stopColor="#9C6E1B" />
          <Stop offset={1} stopColor="#5A3C08" />
        </LinearGradient>
        <LinearGradient id="N" x1="0" y1="0" x2="1" y2="1">
          <Stop offset={0} stopColor="#FFF4C9" />
          <Stop offset={0.4} stopColor="#E7BC5C" />
          <Stop offset={0.75} stopColor="#B0801F" />
          <Stop offset={1} stopColor="#6B4A0C" />
        </LinearGradient>
      </Defs>
      <Path d="M22 6 Q2 6 2 30 Q2 54 22 54 H64 V6 Z" fill="url(#L)" />
      <Circle cx={8} cy={30} r={3.5} fill="url(#A)" />
      <Path d="M14 3 H58 Q63 3 63 7 V9 H18 Q14 9 14 6 Z" fill="url(#A)" />
      <Rect x={60} y={6} width={3} height={48} fill="url(#A)" />
      <Rect x={66} y={6} width={8} height={48} fill="url(#A)" />
      <Path d="M74 7 H280 Q290 9 294 13 V47 Q290 51 280 53 H74 Z" fill="url(#L)" />
      <Rect x={294} y={13} width={5} height={34} fill="url(#A)" />
      <Path d="M299 15 L318 18 Q321 19 321 21 V39 Q321 41 318 42 L299 45 Z" fill="url(#L)" />
      <Path d="M319 19 Q336 20 358 30 Q336 40 319 41 Z" fill="url(#N)" />
      <Path d="M330 30 H356" stroke="#5A3C08" strokeWidth={0.8} />
      <Circle cx={330} cy={30} r={1.8} fill="#3A2606" />
      <Path d="M322 22.5 Q334 22 346 25" stroke="rgba(255,255,255,.75)" strokeWidth={0.9} fill="none" />
      <Rect x={20} y={12} width={40} height={2} rx={1} fill="rgba(255,255,255,.35)" />
      <Rect x={80} y={12} width={200} height={2} rx={1} fill="rgba(255,255,255,.35)" />
    </Svg>
  );
}

export function PenCTA({
  label,
  onPress,
  tone = 'plan',
  accessibilityLabel,
  style,
  testID,
}: PenCTAProps): React.JSX.Element {
  const plan = usePlan();
  const barrel: Barrel = tone === 'plan' ? plan : tone;
  const gold = tone === 'plan' && plan === 'ultimate';

  const [pressed, setPressed] = useState(false);
  const p = useTransition(pressed ? 1 : 0, PRESS_MS);
  const press = useAnimatedStyle(() => ({
    transform: [{ translateX: 6 * p.value }, { scale: 1 - 0.01 * p.value }],
  }));

  return (
    <Pressable
      style={[styles.pcta, style]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}>
      <Animated.View style={[styles.body, press]}>
        <View style={styles.pen}>
          <Pen barrel={barrel} />
          <View style={styles.lab}>
            <Txt style={[styles.labText, gold ? styles.gold : styles.white]}>{label}</Txt>
            <Icon name="arrow" size={18} color={gold ? LABEL_ULTIMATE : LABEL_WHITE} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
