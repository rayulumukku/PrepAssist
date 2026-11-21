// Source: PrepAssist.html L7501-L7508 (VIEWS.payments)
// Source: PrepAssist.html L3434-L3460 (.py-*), L2255 (@keyframes tabIn), L9312-L9313 and L9340 (ds-handoff radius/button sizes)
// Computed from reference/android/view-payments (empty) and view-payments-with-receipt.
// sum.toLocaleString('en-IN') is written out by hand (Hermes' Intl grouping is not relied upon).
import React, { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import { PLAN_N } from '../../data/plans';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef } from '../../navigation/routes';
import { easeVar } from '../../shell/anim';
import { useStore } from '../../store';
import type { Payment } from '../../store/slices/account';
import { font, Txt } from '../../theme';
import { ME } from './mePage';

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** Number#toLocaleString('en-IN'): 1,23,456 grouping */
export function inr(n: number): string {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  const last = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return rest + ',' + last;
}

const RI: Record<string, { bg: string; fg: string; ic: IconName }> = {
  pack: { bg: '#FFF1DC', fg: '#D97F06', ic: 'bolt' },
  vault: { bg: '#E2F5F1', fg: '#0E9A8A', ic: 'cloud' },
  ultimate: { bg: '#2B2440', fg: '#FFD27A', ic: 'crown' },
  pro: { bg: '#EAF4FC', fg: '#1B8AD3', ic: 'spark' },
};

/** .py-rc: animation tabIn .35s var(--ease) backwards (opacity 0, translateY 6 -> none) */
function Receipt({ p }: { p: Payment }): React.JSX.Element {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withTiming(1, { duration: 350, easing: easeVar });
  }, [v]);
  const st = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ translateY: 6 * (1 - v.value) }],
  }));
  const r = RI[p.k] ?? RI.pro;
  return (
    <Animated.View style={[s.rc, st]}>
      <View style={s.rt}>
        <View style={[s.ri, { backgroundColor: r.bg }]}>
          <Icon name={r.ic} color={r.fg} />
        </View>
        <View style={s.rtBody}>
          <Txt style={s.rtB}>{p.t}</Txt>
          <Txt style={s.rtS}>{`${p.d} · ${p.m}`}</Txt>
        </View>
        <Txt style={s.amt}>{'₹' + p.amt}</Txt>
      </View>
      <View style={s.rb}>
        <View style={[s.notch, s.notchL]} />
        <View style={[s.notch, s.notchR]} />
        <Txt style={s.id}>{p.id}</Txt>
        <View style={s.paid}>
          <Icon name="check" size={13} strokeWidth={2.4} color="#2F8A4A" />
          <Txt style={s.paidT}>Paid</Txt>
        </View>
        <Pressable
          style={s.inv}
          onPress={() => act(`toast:Invoice ${p.id} saved to Downloads`)}
          testID={`payments.invoice.${p.id}`}
        >
          <Icon name="download" size={13} color="#14161C" />
          <Txt style={s.invT}>Invoice</Txt>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function PaymentsScreen(): React.JSX.Element {
  const P = useStore(st => st.me.payments);
  const plan = useStore(st => st.me.plan);
  const sum = P.reduce((x, p) => x + p.amt, 0);
  const cells: [string, string][] = [
    ['Total spent', '₹' + inr(sum)],
    ['Receipts', String(P.length)],
    ['Plan', PLAN_N[plan]],
  ];
  return (
    <View style={ME.page}>
      <View style={s.sum}>
        {cells.map(([k, v], i) => (
          <View
            key={k}
            style={[{ flex: [1.2, 0.8, 1][i] }, i > 0 && s.sumNext]}
          >
            <Txt style={s.sumS}>{k}</Txt>
            <Txt style={s.sumB} numberOfLines={1}>
              {v}
            </Txt>
          </View>
        ))}
      </View>
      {P.length ? (
        <>
          <Txt style={[ME.h6, s.h]}>Purchase history</Txt>
          {P.map(p => (
            <Receipt key={p.id} p={p} />
          ))}
        </>
      ) : (
        <View style={s.empty}>
          <Svg width={160} height={130} viewBox="0 0 160 130">
            <Ellipse cx="80" cy="120" rx="52" ry="6" fill="#E6EEF7" />
            <Path
              d="M48 18h56v92l-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5Z"
              fill="#fff"
              stroke="#D6E0EB"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <Path
              d="M58 34h36M58 44h28M58 54h32M58 72h36"
              stroke="#E3EAF2"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d="M58 84h18"
              stroke="#1B8AD3"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Circle
              cx="110"
              cy="40"
              r="17"
              fill="#FFF4E2"
              stroke="#F5A01F"
              strokeWidth={2.5}
            />
            <Path
              d="M110 31v9l6 4"
              stroke="#E8890C"
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M34 46v8M30 50h8M126 86v6M123 89h6"
              stroke="#9FD0F2"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
          <Txt style={s.emptyB}>No payments yet</Txt>
          <Txt style={s.emptyP}>
            Every plan and credit pack you buy shows up here as a receipt you
            can download.
          </Txt>
          <Pressable
            style={s.cta}
            onPress={() => act('push:upgrade')}
            testID="payments.plans"
          >
            <Icon name="spark" size={16} color="#FFD27A" />
            <Txt style={s.ctaT}>Explore plans</Txt>
          </Pressable>
          <Pressable
            style={s.lnk}
            onPress={() => act('restore')}
            testID="payments.restore"
          >
            <Icon name="refresh" size={14} color="#7A8494" />
            <Txt style={s.lnkT}>Restore purchases</Txt>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  sum: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    backgroundImage:
      'radial-gradient(80% 100% at 100% 0%, rgba(63, 208, 138, 0.35), transparent 60%), linear-gradient(135deg, #0B5B52, #0E9A8A)',
  },
  sumNext: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    paddingLeft: 12,
  },
  sumS: {
    ...font('sans', 700),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.26,
    textTransform: 'uppercase',
    color: '#fff',
    opacity: 0.75,
  },
  sumB: {
    ...font('serif', 800),
    fontSize: 20,
    lineHeight: 29,
    color: '#fff',
    marginTop: 4,
  },
  h: { marginTop: 22, marginHorizontal: 4, marginBottom: 10 },
  rc: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  rt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  ri: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rtBody: { flex: 1, minWidth: 0 },
  rtB: {
    ...font('sans', 600),
    fontSize: 14.5,
    lineHeight: 21.025,
    color: '#14161C',
  },
  rtS: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 2 },
  amt: {
    ...font('serif', 800),
    fontSize: 18,
    lineHeight: 26.1,
    color: '#14161C',
  },
  rb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderTopColor: '#EEF2F6',
  },
  notch: {
    position: 'absolute',
    top: -8,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F5F7FA',
    boxShadow: 'inset 0px 0px 0px 1px #E6EBF1',
  },
  notchL: { left: -7 },
  notchR: { right: -7 },
  id: {
    flex: 1,
    fontFamily: MONO,
    fontSize: 11.5,
    lineHeight: 16.675,
    color: '#9AA3AF',
  },
  paid: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  paidT: {
    ...font('sans', 800),
    fontSize: 11.5,
    lineHeight: 16.675,
    color: '#2F8A4A',
  },
  inv: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: '#F1F5FA',
  },
  invT: {
    ...font('sans', 700),
    fontSize: 11.5,
    lineHeight: 16.675,
    color: '#14161C',
  },
  empty: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 26,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  emptyB: {
    ...font('book', 500),
    fontSize: 22,
    lineHeight: 31.9,
    color: '#14161C',
    marginTop: 6,
    textAlign: 'center',
  },
  emptyP: {
    fontSize: 13.5,
    lineHeight: 20.25,
    color: '#7A8494',
    marginTop: 6,
    maxWidth: 260,
    textAlign: 'center',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 46,
    paddingHorizontal: 20,
    marginTop: 18,
    borderRadius: 14,
    backgroundColor: '#14161C',
  },
  ctaT: {
    ...font('sans', 600),
    fontSize: 14.5,
    lineHeight: 21.025,
    color: '#fff',
  },
  lnk: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  lnkT: {
    ...font('sans', 600),
    fontSize: 12.5,
    lineHeight: 18.125,
    color: '#7A8494',
  },
});

const view: ViewDef = {
  useTitle: () => 'Payments',
  Screen: PaymentsScreen,
};

export default view;
