// Source: PrepAssist.html L7548-L7563 (VIEWS.status and its mount), L7626 (A.ssRerun -> refreshTop)
// Source: PrepAssist.html L3596-L3631 (.ss-*), L1183 area keyframes sp / pop (runtime.json)
// Computed from reference/android/view-status. The mount logic is kept as written: each handshake
// row gets .ok at 500 + i·420 ms; the latency history is 16 values 34 + random·18; every 1100 ms a new
// value 36 + random·14 is pushed, the number updates, the bars get height (h - 20)·2.2 % (transition
// .5s var(--ease)) and "checked" reads "just now" for the first tick, then "<n>s ago".
// A.ssRerun re-renders the page (refreshTop): S.ssRun is the key that remounts it.
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef } from '../../navigation/routes';
import { easeVar, useTransition } from '../../shell/anim';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { ME } from './mePage';

const HS: [IconName, string, string, string][] = [
  ['lock', 'Authentication', 'Firebase Auth handshake', 'Verified'],
  ['refresh', 'Realtime sync', 'Firestore connection', 'Connected'],
  ['spark', 'Generative engine', 'AI evaluation core', 'Standby'],
  ['cloud', 'Cloud Vault', 'Encrypted file storage', 'Reachable'],
  ['phone', 'Native bridge', 'App runtime', 'Initialised'],
];

const APath = Animated.createAnimatedComponent(Path);
const OUT = Easing.out(Easing.ease);

/** .ss-w: scale .55 -> 1.15, opacity 1 -> 0, 2.6 s ease-out, forever (.d2 1.3 s later) */
function Wave({ delay }: { delay: number }): React.JSX.Element {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 2600, easing: OUT }), -1, false),
    );
  }, [v, delay]);
  const st = useAnimatedStyle(() => ({
    opacity: 1 - v.value,
    transform: [{ scale: 0.55 + 0.6 * v.value }],
  }));
  return <Animated.View style={[s.w, st]} />;
}

/** .ss-core path: dasharray 110, dashoffset 110 -> 0 -> -110, 2.4 s ease-in-out, forever */
function Pulse(): React.JSX.Element {
  const v = useSharedValue(110);
  useEffect(() => {
    const e = Easing.inOut(Easing.ease);
    // one keyframe animation with stops 0 / 50 / 100 %: the timing function applies per half
    v.value = withRepeat(
      withSequence(
        withTiming(110, { duration: 0 }),
        withTiming(0, { duration: 1200, easing: e }),
        withTiming(-110, { duration: 1200, easing: e }),
      ),
      -1,
      false,
    );
  }, [v]);
  const ap = useAnimatedProps(() => ({ strokeDashoffset: v.value }));
  return (
    <Svg width={58} height={29} viewBox="0 0 64 32">
      <APath
        d="M2 16h14l5-11 9 22 6-14 4 3h22"
        fill="none"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="110"
        animatedProps={ap}
      />
    </Svg>
  );
}

function Bar({ h, last }: { h: number; last: boolean }): React.JSX.Element {
  const v = useTransition(h, 500, easeVar);
  const st = useAnimatedStyle(() => ({ height: (30 * v.value) / 100 }));
  return <Animated.View style={[s.bar, last && s.barLast, st]} />;
}

/** .ss-sp: 16 px ring, 2 px #DCE4EE with a #1B8AD3 top, rotating .8 s linear */
function Sp(): React.JSX.Element {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(
      withTiming(360, { duration: 800, easing: Easing.linear }),
      -1,
      false,
    );
  }, [r]);
  const st = useAnimatedStyle(() => ({
    transform: [{ rotate: `${r.value}deg` }],
  }));
  return <Animated.View style={[s.sp, st]} />;
}

/** .ss-h.ok em span: animation pop .35s cubic-bezier(.3,1.6,.5,1) (from scale .7) */
function OkPill({ label }: { label: string }): React.JSX.Element {
  const v = useSharedValue(0.7);
  useEffect(() => {
    v.value = withTiming(1, {
      duration: 350,
      easing: Easing.bezier(0.3, 1.6, 0.5, 1),
    });
  }, [v]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: v.value }] }));
  return (
    <Animated.View style={[s.pill, st]}>
      <Icon name="check" size={12} strokeWidth={2.6} color="#2F8A4A" />
      <Txt style={s.pillT}>{label}</Txt>
    </Animated.View>
  );
}

function Handshake({
  h,
  i,
}: {
  h: (typeof HS)[number];
  i: number;
}): React.JSX.Element {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOk(true), 500 + i * 420);
    return () => clearTimeout(t);
  }, [i]);
  // .ss-hi{transition:all .3s} (ease): background and colour move to the .ok values
  const v = useTransition(ok ? 1 : 0, 300);
  const bgOk = useAnimatedStyle(() => ({ opacity: v.value }));
  return (
    <View style={[s.h, i === 0 ? s.hFirst : s.hNext]}>
      <View style={s.hi}>
        <Icon name={h[0]} size={16} color="#5B6472" />
        <Animated.View style={[s.hiOk, bgOk]}>
          <Icon name={h[0]} size={16} color="#2F8A4A" />
        </Animated.View>
      </View>
      <View style={s.hBody}>
        <Txt style={s.hB}>{h[1]}</Txt>
        <Txt style={s.hS}>{h[2]}</Txt>
      </View>
      <View style={s.em}>{ok ? <OkPill label={h[3]} /> : <Sp />}</View>
    </View>
  );
}

function Status(): React.JSX.Element {
  const [hist, setHist] = useState(() =>
    Array.from({ length: 16 }, () => 34 + Math.random() * 18),
  );
  const [lat, setLat] = useState(42);
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      const v = Math.round(36 + Math.random() * 14);
      setHist(h => [...h.slice(1), v]);
      setLat(v);
      setN(x => x + 1);
    }, 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <View style={[ME.page, s.ss]}>
      <View style={s.orb}>
        <Wave delay={0} />
        <Wave delay={1300} />
        <View style={s.core}>
          <Pulse />
        </View>
      </View>
      <Txt style={s.t}>All systems operational</Txt>
      <Txt style={s.s}>
        {'Every PrepAssist service is responding · checked '}
        <Txt style={s.ago}>{n < 2 ? 'just now' : n + 's ago'}</Txt>
      </Txt>
      <View style={s.tiles}>
        <View style={s.tile}>
          <View style={s.tileH}>
            <Icon name="bolt" size={13} color="#8A93A0" />
            <Txt style={s.tileHT}>Latency</Txt>
          </View>
          <Txt style={s.tileB}>
            {String(lat)}
            <Txt style={s.tileEm}>{' ms'}</Txt>
          </Txt>
          <View style={s.spark}>
            {hist.map((h, i) => (
              <Bar key={i} h={(h - 20) * 2.2} last={i === 15} />
            ))}
          </View>
        </View>
        <View style={s.tile}>
          <View style={s.tileH}>
            <Icon name="chart" size={13} color="#8A93A0" />
            <Txt style={s.tileHT}>Uptime · 90 days</Txt>
          </View>
          <Txt style={s.tileB}>
            {'99.99'}
            <Txt style={s.tileEm}>{' %'}</Txt>
          </Txt>
          <View style={s.days}>
            {[0, 1, 2].map(r => (
              <View key={r} style={s.daysRow}>
                {Array.from({ length: 15 }, (_, c) => (
                  <View key={c} style={[s.day, r * 15 + c === 31 && s.dayA]} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={s.list}>
        <Txt style={ME.h6}>Live handshakes</Txt>
        {HS.map((h, i) => (
          <Handshake key={h[1]} h={h} i={i} />
        ))}
      </View>
      <Pressable
        style={s.re}
        onPress={() => act('ssRerun')}
        testID="status.rerun"
      >
        <Icon name="refresh" size={16} color="#14161C" />
        <Txt style={s.reT}>Run diagnostics again</Txt>
      </Pressable>
    </View>
  );
}

function StatusScreen(): React.JSX.Element {
  const run = useStore(st => st.ssRun);
  return <Status key={run} />;
}

const s = StyleSheet.create({
  ss: { alignItems: 'stretch' },
  orb: {
    width: 150,
    height: 150,
    marginTop: 14,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  w: {
    ...StyleSheet.absoluteFill,
    borderRadius: 75,
    backgroundColor: 'rgba(47, 158, 98, 0.14)',
  },
  core: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage:
      'radial-gradient(circle at 35% 30%, #4FD39A, #2F9E62 60%, #1F7A4A)',
    boxShadow:
      '0px 18px 30px -12px rgba(47, 158, 98, 0.8), inset 0px 2px 0px 0px rgba(255, 255, 255, 0.35)',
  },
  t: {
    ...font('book', 500),
    fontSize: 28,
    lineHeight: 40.6,
    color: '#14161C',
    marginTop: 14,
    textAlign: 'center',
  },
  s: {
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#7A8494',
    marginTop: 4,
    textAlign: 'center',
  },
  ago: { ...font('sans', 600), color: '#2F8A4A' },
  tiles: { flexDirection: 'row', gap: 10, marginTop: 20 },
  tile: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  tileH: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tileHT: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.05,
    textTransform: 'uppercase',
    color: '#8A93A0',
  },
  tileB: {
    ...font('serif', 800),
    fontSize: 28,
    lineHeight: 40.6,
    letterSpacing: -0.56,
    color: '#14161C',
    marginTop: 6,
  },
  // .ss-tile b em: margin-left 2px (drawn as a thin space), 14.5px #9AA3AF
  tileEm: { fontSize: 14.5, color: '#9AA3AF', letterSpacing: -0.56 },
  spark: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 30,
    marginTop: 8,
  },
  bar: { flex: 1, borderRadius: 2, backgroundColor: '#9FD0F2' },
  barLast: { backgroundColor: '#1B8AD3' },
  days: { gap: 2, marginTop: 10 },
  daysRow: { flexDirection: 'row', gap: 2 },
  day: { flex: 1, height: 8, borderRadius: 2, backgroundColor: '#5BC48A' },
  dayA: { backgroundColor: '#F5A01F' },
  list: {
    marginTop: 16,
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 6,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  h: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  hFirst: { marginTop: 4 },
  hNext: { borderTopWidth: 1, borderTopColor: '#F1F4F8' },
  hi: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiOk: {
    ...StyleSheet.absoluteFill,
    borderRadius: 10,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hBody: { flex: 1, minWidth: 0 },
  hB: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
  },
  // inline <small> in the 22.475 px line of its block
  hS: { fontSize: 11.5, lineHeight: 22.475, color: '#9AA3AF' },
  em: { flexDirection: 'row', alignItems: 'center' },
  sp: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DCE4EE',
    borderTopColor: '#1B8AD3',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F4EA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  pillT: {
    ...font('sans', 800),
    fontSize: 11.5,
    lineHeight: 16.675,
    color: '#2F8A4A',
  },
  re: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 44,
    paddingHorizontal: 18,
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
  },
  reT: {
    ...font('sans', 700),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
  },
});

const view: ViewDef = {
  useTitle: () => 'System status',
  Screen: StatusScreen,
};

export default view;
