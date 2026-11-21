// Source: PrepAssist.html L5083-L5090 (#nav markup), L2257-L2262 (.nav), L3007-L3007 (.nav button.on), L3979-L3981 (six columns, 9.5px, 21px icon), L10671-L10675 (planthemes)
// The tab bar. Computed (reference/android/tab-home, tab-home-pro, tab-home-ultimate):
//   nav      412 x 64 at the bottom (height = --nav-h + --sab, padding-bottom --sab); border-top 1px
//            --rule; background rgba(255,255,255,.94) over backdrop blur 12px; six equal columns
//   button   column, centred, gap 3px; Inter 600 9.5px / 13.775px, letter-spacing .285px, uppercase;
//            colour --faint, `.on` --brand; `transition: color .2s`
//   svg.ic   21 x 21, stroke-width 1.5
//   ::before the active marker: top -1px, centred, 2px high, --brand, width 0 -> 28px over .3s var(--ease)
//   pro / ultimate: .nav::after, a 2px line at top -1px with a moving gradient
//            (transparent, --pl-a, --pl-b, --pl-a, transparent; background-size 200%; plLine 4s linear infinite)
//   ultimate: background rgba(13,11,7,.96), border-top #2A2215, buttons #8C8270, `.on` #F2C94C
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { act } from '../actions';
import { Backdrop } from '../components/Backdrop';
import { Icon } from '../components/Icon';
import { I18N } from '../i18n/strings';
import type { I18nKey } from '../i18n/strings';
import type { IconName } from '../icons/iconPaths.generated';
import { TABS } from '../navigation/routes';
import type { TabId } from '../navigation/routes';
import { useStore } from '../store';
import { font } from '../theme/fonts';
import { durations, metrics } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useInsets, usePlan, useTheme } from '../theme/useTheme';
import { easeCss, useTransition } from './anim';
import { useAppSize } from './AppSize';

/** `<use href="#i-…">` of each button (L5084-L5089). The label key equals the tab id (data-i18n). */
const TAB_ICON: Readonly<Record<TabId, IconName>> = {
  home: 'home',
  learn: 'learn',
  practice: 'practice',
  current: 'current',
  menu: 'grid',
  profile: 'profile',
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  faceOn: {
    ...StyleSheet.absoluteFill,
  },
  label: {
    ...font('sans', 600),
    fontSize: 9.5,
    lineHeight: 13.775,
    letterSpacing: 0.285,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  marker: {
    position: 'absolute',
    top: -1,
    height: 2,
    alignSelf: 'center',
  },
  // top:-1px from the nav's padding box = on its 1px top border
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 2,
    overflow: 'hidden',
  },
  lineTile: { height: 2 },
  lineStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    flexDirection: 'row',
  },
});

/** t(k) (L5140) */
const t = (lang: 'en' | 'hi', k: I18nKey): string => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;

function Face({ tab, color, label }: { tab: TabId; color: string; label: string }): React.JSX.Element {
  return (
    <>
      <Icon name={TAB_ICON[tab]} size={21} strokeWidth={1.5} color={color} />
      <Txt style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Txt>
    </>
  );
}

function NavButton({ tab, colorOff, colorOn, marker }: { tab: TabId; colorOff: string; colorOn: string; marker: string }): React.JSX.Element {
  const on = useStore(s => s.tab === tab);
  const lang = useStore(s => s.lang);
  const label = t(lang, tab);
  // `transition: color .2s` (ease): the `.on` colour fades in over the base colour
  const mix = useTransition(on ? 1 : 0, durations.navColor, easeCss);
  // ::before width 0 -> 28px, .3s var(--ease)
  const w = useTransition(on ? 28 : 0, durations.navBar);
  const onStyle = useAnimatedStyle(() => ({ opacity: mix.value }));
  const offStyle = useAnimatedStyle(() => ({ opacity: 1 - mix.value }));
  const markerStyle = useAnimatedStyle(() => ({ width: w.value }));
  return (
    <Pressable
      style={styles.button}
      onPress={() => act('tab', tab)}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: on }}
      testID={`nav.${tab}`}>
      <Animated.View style={[styles.marker, { backgroundColor: marker }, markerStyle]} />
      <View>
        <Animated.View style={[styles.face, offStyle]}>
          <Face tab={tab} color={colorOff} label={label} />
        </Animated.View>
        <Animated.View style={[styles.face, styles.faceOn, onStyle]}>
          <Face tab={tab} color={colorOn} label={label} />
        </Animated.View>
      </View>
    </Pressable>
  );
}

/** .nav::after on the pro and ultimate themes (L10671-L10672). */
function PlanLine({ a, b }: { a: string; b: string }): React.JSX.Element {
  const { w } = useAppSize();
  const x = useSharedValue(0);
  // background-size 200% -> one tile is 2w wide and repeats; plLine moves background-position from
  // 0 to -200%, which shifts the image by +2w (one full tile) every 4 s, linearly, forever.
  useEffect(() => {
    x.value = 0;
    x.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(x);
  }, [x, w]);
  const tile = 2 * w;
  const move = useAnimatedStyle(() => ({ transform: [{ translateX: -tile + x.value * tile }] }));
  const gradient = `linear-gradient(90deg, transparent, ${a}, ${b}, ${a}, transparent)`;
  return (
    <View style={styles.line} pointerEvents="none">
      <Animated.View style={[styles.lineStrip, { width: 2 * tile }, move]}>
        <View style={[styles.lineTile, { width: tile, backgroundImage: gradient }]} />
        <View style={[styles.lineTile, { width: tile, backgroundImage: gradient }]} />
      </Animated.View>
    </View>
  );
}

export function NavBar(): React.JSX.Element {
  const theme = useTheme();
  const plan = usePlan();
  const { sab } = useInsets();
  const ultimate = plan === 'ultimate';
  const bg = ultimate ? 'rgba(13,11,7,0.96)' : 'rgba(255,255,255,0.94)';
  const border = ultimate ? '#2A2215' : theme.rule;
  const colorOff = ultimate ? '#8C8270' : theme.faint;
  const colorOn = ultimate ? '#F2C94C' : theme.brand;
  return (
    <View style={[styles.nav, { height: metrics.navH + sab }]} testID="nav">
      <Backdrop px={12} tint={bg} tone={ultimate ? 'dark' : 'light'} />
      <View style={[styles.inner, { borderTopColor: border, paddingBottom: sab }]}>
        {TABS.map(tab => (
          <NavButton key={tab} tab={tab} colorOff={colorOff} colorOn={colorOn} marker={theme.brand} />
        ))}
      </View>
      {theme.plA && theme.plB ? <PlanLine a={theme.plA} b={theme.plB} /> : null}
    </View>
  );
}
