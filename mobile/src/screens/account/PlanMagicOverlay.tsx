// Source: PrepAssist.html L10753-L10764 (planMagic)
// Source: PrepAssist.html L10697-L10719 (.pm-ov, .pm-c, .pm-ic, .pm-sw, .pm-sp and their keyframes)
// The plan-change overlay. Each entry of S.planMagic is one `.pm-ov` appended to #app; it is removed
// 3250 ms after it was created (actions/account.ts planMagic). Computed from
// reference/android/overlay-plan-magic-{free,pro,ultimate}.
//   .pm-ov   inset 0, place-items centre, clip-path circle(0% at 50% 60%) -> circle(150% …) over .75 s
//            cubic-bezier(.7,0,.25,1) (pmIn); .out: opacity 1 -> 0 and scale 1 -> 1.06 over .7 s
//            cubic-bezier(.5,0,.3,1) (pmOut). The clip circle is drawn as a round, overflow-hidden
//            window centred on (50 %, 60 %) whose radius animates; circle(150%) = 1.5 x √((w²+h²)/2).
//   .pm-c    opacity 0, translateY(14px) scale(.96) -> none, .7 s, delay .45 s, var(--ease) (pmTx)
//   .pm-ic   92 x 92, radius 30; ::after inset -14, radius 40, 1.5 px border, scale .85 -> 1.5 and
//            opacity 1 -> 0 over 1.6 s ease-out, delay .5 s, forever (pmRing)
//   .pm-sw i 26 x 6, radius 3, opacity 0 scaleX 0 -> none, .4 s var(--ease), delays .9/1/1.1/1.2 s
//   .pm-sp   left 50 %, top 44 %, size --s, margin -4px; pmSp 1.6 s, delay --d, cubic-bezier(.15,.7,.3,1):
//            opacity 0 -> 1 (20 %) -> 0, translate 0 -> (tx, ty), scale .2 -> 1, rotate 0 -> 160deg
// The Ultimate title is gradient text (background-clip:text): drawn as SVG text with a gradient fill.
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { Icon } from '../../components';
import { TH } from '../../data/plans';
import type { IconName } from '../../icons/iconPaths.generated';
import { easeVar } from '../../shell/anim';
import { useAppSize } from '../../shell/AppSize';
import { useStore } from '../../store';
import type { PlanMagic } from '../../store/slices/account';
import { font, Txt } from '../../theme';

const BG = {
  pro: 'radial-gradient(90% 70% at 100% 0%, rgba(244, 114, 182, 0.55), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(96, 165, 250, 0.45), transparent 60%), linear-gradient(160deg, #1C0F57, #5631D1 55%, #8B69FF)',
  ultimate:
    'radial-gradient(70% 50% at 50% 40%, rgba(247, 215, 116, 0.35), transparent 65%), linear-gradient(160deg, #050403, #1B150A 55%, #3D2C0E)',
  free: 'radial-gradient(90% 70% at 100% 0%, #4FB0EC, transparent 60%), linear-gradient(160deg, #0F5E99, #1B8AD3 60%, #5DB6EE)',
} as const;

const IN_EASE = Easing.bezier(0.7, 0, 0.25, 1);
const OUT_EASE = Easing.bezier(0.5, 0, 0.3, 1);
const SP_EASE = Easing.bezier(0.15, 0.7, 0.3, 1);

function Spark({
  sp,
  color,
}: {
  sp: PlanMagic['sparks'][number];
  color: string;
}): React.JSX.Element {
  // keyframe timing functions apply per interval: transform runs 0 -> 100 %, opacity 0 -> 20 % -> 100 %
  const e = useSharedValue(0);
  const o = useSharedValue(0);
  useEffect(() => {
    const d = sp.d * 1000;
    e.value = withDelay(d, withTiming(1, { duration: 1600, easing: SP_EASE }));
    o.value = withDelay(
      d,
      withSequence(
        withTiming(1, { duration: 320, easing: SP_EASE }),
        withTiming(0, { duration: 1280, easing: SP_EASE }),
      ),
    );
  }, [e, o, sp.d]);
  const st = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [
      { translateX: sp.tx * e.value },
      { translateY: sp.ty * e.value },
      { scale: 0.2 + 0.8 * e.value },
      { rotate: `${160 * e.value}deg` },
    ],
  }));
  return (
    <Animated.View style={[s.sp, { width: sp.s, height: sp.s }, st]}>
      <Svg width={sp.s} height={sp.s} viewBox="0 0 10 10">
        <Path
          d="M5 0q.6 4.4 5 5q-4.4.6-5 5q-.6-4.4-5-5q4.4-.6 5-5Z"
          fill={color}
        />
      </Svg>
    </Animated.View>
  );
}

function Swatch({ c, i }: { c: string; i: number }): React.JSX.Element {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      900 + i * 100,
      withTiming(1, { duration: 400, easing: easeVar }),
    );
  }, [v, i]);
  const st = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ scaleX: v.value }],
  }));
  return <Animated.View style={[s.swI, { backgroundColor: c }, st]} />;
}

function Ring({ ult }: { ult: boolean }): React.JSX.Element {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      500,
      withRepeat(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      ),
    );
  }, [v]);
  const st = useAnimatedStyle(() => ({
    opacity: 1 - v.value,
    transform: [{ scale: 0.85 + 0.65 * v.value }],
  }));
  return (
    <Animated.View
      style={[
        s.ring,
        {
          borderColor: ult
            ? 'rgba(247, 215, 116, 0.6)'
            : 'rgba(255, 255, 255, 0.35)',
        },
        st,
      ]}
    />
  );
}

function Overlay({ o }: { o: PlanMagic }): React.JSX.Element {
  const { w, h } = useAppSize();
  const T = TH[o.p] ?? TH.free;
  const ult = o.p === 'ultimate';
  const full = 1.5 * Math.sqrt((w * w + h * h) / 2);
  const cx = w * 0.5;
  const cy = h * 0.6;
  const rin = useSharedValue(0);
  const out = useSharedValue(0);
  const tx = useSharedValue(0);
  useEffect(() => {
    rin.value = withTiming(1, { duration: 750, easing: IN_EASE });
    tx.value = withDelay(
      450,
      withTiming(1, { duration: 700, easing: easeVar }),
    );
  }, [rin, tx]);
  useEffect(() => {
    if (o.out) out.value = withTiming(1, { duration: 700, easing: OUT_EASE });
  }, [o.out, out]);
  // pmOut sets clip-path circle(150% at 50% 50%): the window is centred again and fully open
  const clip = useAnimatedStyle(() => {
    const r = out.value > 0 ? full : full * rin.value;
    const ccy = out.value > 0 ? h * 0.5 : cy;
    return {
      left: cx - r,
      top: ccy - r,
      width: 2 * r,
      height: 2 * r,
      borderRadius: r,
    };
  });
  const inner = useAnimatedStyle(() => {
    const r = out.value > 0 ? full : full * rin.value;
    const ccy = out.value > 0 ? h * 0.5 : cy;
    return { left: r - cx, top: r - ccy };
  });
  const fade = useAnimatedStyle(() => ({
    opacity: 1 - out.value,
    transform: [{ scale: 1 + 0.06 * out.value }],
  }));
  const content = useAnimatedStyle(() => ({
    opacity: tx.value,
    transform: [
      { translateY: 14 * (1 - tx.value) },
      { scale: 0.96 + 0.04 * tx.value },
    ],
  }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, fade]} pointerEvents="none">
      <Animated.View style={[s.clip, clip]}>
        <Animated.View
          style={[
            s.ov,
            { width: w, height: h, backgroundImage: BG[o.p] },
            inner,
          ]}
        >
          {o.sparks.map((sp, i) => (
            <Spark key={i} sp={sp} color={T.sw[2 + (i % 2)]} />
          ))}
          <Animated.View style={[s.c, content]}>
            <View style={[s.ic, ult && s.icU]}>
              <Ring ult={ult} />
              <Icon
                name={T.ic as IconName}
                size={42}
                strokeWidth={1.7}
                color={ult ? '#1B150A' : '#fff'}
              />
            </View>
            <Txt style={s.small}>
              {o.p === 'free' ? 'Back to' : 'Welcome to'}
            </Txt>
            {ult ? (
              <Svg width={280} height={46} style={s.h2Svg}>
                <Defs>
                  <LinearGradient id="pmH2" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#FFF3C4" />
                    <Stop offset="0.6" stopColor="#E5B84A" />
                    <Stop offset="1" stopColor="#B8861B" />
                  </LinearGradient>
                </Defs>
                <SvgText
                  x={140}
                  y={38}
                  textAnchor="middle"
                  fill="url(#pmH2)"
                  fontFamily={font('book', 500).fontFamily}
                  fontSize={46}
                  letterSpacing={-0.46}
                >
                  {T.n}
                </SvgText>
              </Svg>
            ) : (
              <Txt style={s.h2}>{T.n}</Txt>
            )}
            <Txt style={s.p}>
              {'Your app is now dressed in '}
              <Txt style={[s.pb, ult && s.pbU]}>{T.t}</Txt>
            </Txt>
            <View style={s.sw}>
              {T.sw.map((c, i) => (
                <Swatch key={c} c={c} i={i} />
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function PlanMagicOverlay(): React.JSX.Element | null {
  const list = useStore(st => st.planMagic);
  if (!list.length) return null;
  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      testID="overlay.planMagic"
    >
      {list.map(o => (
        <Overlay key={o.n} o={o} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  clip: { position: 'absolute', overflow: 'hidden' },
  ov: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  sp: { position: 'absolute', left: '50%', top: '44%', margin: -4 },
  c: { alignItems: 'center' },
  ic: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    boxShadow:
      'inset 0px 0px 0px 1px rgba(255, 255, 255, 0.28), 0px 20px 40px -16px rgba(0, 0, 0, 0.6)',
  },
  icU: {
    backgroundColor: undefined,
    backgroundImage: 'linear-gradient(150deg, #F7DE8E, #C8961E 55%, #7A560A)',
    boxShadow:
      '0px 0px 0px 1px rgba(255, 236, 170, 0.6), 0px 0px 60px -6px rgba(247, 215, 116, 0.7)',
  },
  ring: {
    position: 'absolute',
    left: -14,
    top: -14,
    right: -14,
    bottom: -14,
    borderRadius: 40,
    borderWidth: 1.5,
  },
  small: {
    ...font('sans', 800),
    fontSize: 11,
    lineHeight: 15.95,
    letterSpacing: 2.64,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 26,
    textAlign: 'center',
  },
  h2: {
    ...font('book', 500),
    fontSize: 46,
    lineHeight: 46,
    letterSpacing: -0.46,
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  h2Svg: { marginTop: 8 },
  p: {
    fontSize: 14,
    lineHeight: 20.3,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    textAlign: 'center',
  },
  pb: { ...font('sans', 700), color: '#fff' },
  pbU: { color: '#F7DE8E' },
  sw: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 18 },
  swI: { width: 26, height: 6, borderRadius: 3 },
});

export default PlanMagicOverlay;
