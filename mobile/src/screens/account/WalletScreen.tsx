// Source: PrepAssist.html L7489-L7499 (VIEWS.wallet), L7322 (ring)
// Source: PrepAssist.html L3402-L3432 (.wl-*), L3289-L3295 (.me-tier, .lt, .t-pro, .t-ultimate)
// Computed from reference/android/view-wallet, view-wallet-pro, view-wallet-ultimate.
// `.me-tier.lt` renders as display:grid in every capture (computed style; the CSS says inline-flex):
// the icon sits in the first row and the label in a second row 10 px below, spilling out of the 24 px
// pill over the line under it. Ported as rendered (column, gap 10, fixed height, overflow visible).
// The ring arc is rotated -90deg; the browser resolves its objectBoundingBox gradient before that
// transform, react-native-svg after it, so the gradient carries the same rotation (gradientTransform).
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import { PLAN_CAP, PLAN_N } from '../../data/plans';
import { today } from '../../env/clock';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, fontPx, Txt, useTheme } from '../../theme';
import { addD, fmtShort, ME, mixWhite } from './mePage';
import { RingArcs } from './Ring';

const COSTS: [IconName, string, number, string][] = [
  ['scale', 'Mains evaluation', 20, '#E8890C'],
  ['bolt', 'Prelims test', 5, '#1B8AD3'],
  ['mindmap', 'AI mindmap', 3, '#0E9A8A'],
  ['spark', 'Mentor answer', 2, '#6C5DD3'],
];

/** .me-tier.lt per plan (L3293-L3295) */
export const TIER_LT = {
  free: { bg: '#F1F5FA', bd: '#E1E8F0', fg: '#5B6472', ic: 'shield' },
  pro: { bg: '#EAF4FC', bd: '#CFE5F7', fg: '#1B6FB3', ic: 'spark' },
  ultimate: { bg: '#FFF4E2', bd: '#F6E2C2', fg: '#B86E00', ic: 'crown' },
} as const;

function WalletScreen(): React.JSX.Element {
  const t = useTheme();
  const M = useStore(st => st.me);
  const first = useStore(st => st.user.first);
  const [name, setName] = useState(first);
  const [focus, setFocus] = useState(false);
  const cap = PLAN_CAP[M.plan];
  const tier = TIER_LT[M.plan];
  return (
    <View style={ME.page}>
      <View style={s.name}>
        <Txt style={[ME.h6, s.label]}>Display name</Txt>
        <View style={s.in}>
          <View style={s.inBox}>
            {focus ? (
              <View style={[s.ring, { backgroundColor: t.brandTint }]} />
            ) : null}
            <TextInput
              value={name}
              onChangeText={setName}
              maxLength={24}
              allowFontScaling={false}
              underlineColorAndroid="transparent"
              cursorColor="#14161C"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              style={[s.input, focus && s.inputFocus]}
              testID="wallet.name"
            />
          </View>
          <Pressable
            style={s.save}
            onPress={() => act('wlSave', undefined, { value: name })}
            testID="wallet.save"
          >
            <Txt style={s.saveT}>Save</Txt>
          </Pressable>
        </View>
        <Txt style={s.nameS}>
          Shown in your desk greeting and on the weekly leaderboard.
        </Txt>
      </View>
      <View style={s.meter}>
        <View style={s.ringBox}>
          <Svg width={196} height={196} viewBox="0 0 196 196">
            <RingArcs
              r={86}
              frac={M.credits / cap}
              stroke={12}
              color="url(#wlG)"
              track="#EEF2F7"
            />
            <Defs>
              <LinearGradient
                id="wlG"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
                gradientTransform="rotate(-90 0.5 0.5)"
              >
                <Stop offset="0" stopColor="#7CC4F0" />
                <Stop offset="0.6" stopColor="#1B8AD3" />
                <Stop offset="1" stopColor="#6C5DD3" />
              </LinearGradient>
            </Defs>
          </Svg>
          <View style={s.ringIn}>
            <View style={s.ringIc}>
              <Icon name="spark" size={34} color="#6C5DD3" />
            </View>
            <Txt style={s.ringB}>{String(M.credits)}</Txt>
            <Txt style={s.ringS}>credits available</Txt>
          </View>
        </View>
        <View style={s.plan}>
          <View
            style={[s.tier, { backgroundColor: tier.bg, borderColor: tier.bd }]}
          >
            <Icon name={tier.ic} size={12} color={tier.fg} />
            <Txt style={[s.tierT, { color: tier.fg }]}>{PLAN_N[M.plan]}</Txt>
          </View>
          <Txt style={s.planS}>
            {M.plan === 'free'
              ? 'No monthly refill · top up any time'
              : 'Refills to ' + cap + ' on ' + fmtShort(addD(today(), 30))}
          </Txt>
        </View>
      </View>
      <View style={s.costs}>
        <Txt style={ME.h6}>What your credits buy</Txt>
        <View style={s.grid}>
          {[COSTS.slice(0, 2), COSTS.slice(2)].map((rowItems, r) => (
            <View key={r} style={s.gridRow}>
              {rowItems.map(([i, n, c, col]) => {
                const left = Math.floor(M.credits / c);
                return (
                  <View key={n} style={s.cost}>
                    <View
                      style={[
                        s.costIc,
                        { backgroundColor: mixWhite(col, 0.11) },
                      ]}
                    >
                      <Icon name={i} size={16} color={col} />
                    </View>
                    <Txt style={s.costB}>{n}</Txt>
                    <Txt style={s.costS}>{`${c} credits · ${
                      left ? '≈ ' + left + ' left' : 'top up needed'
                    }`}</Txt>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <View style={s.acts}>
        <Pressable
          style={[s.act, s.actP]}
          onPress={() => act('topup')}
          testID="wallet.topup"
        >
          <Icon name="plus" size={17} color="#fff" />
          <Txt style={[s.actT, s.white]}>Top up credits</Txt>
        </Pressable>
        <Pressable
          style={s.act}
          onPress={() => act('ledger')}
          testID="wallet.ledger"
        >
          <Icon name="list" size={17} color="#14161C" />
          <Txt style={s.actT}>View credit ledger</Txt>
        </Pressable>
      </View>
      <View style={s.two}>
        <Pressable
          style={s.twoB}
          onPress={() => act('push:account')}
          testID="wallet.account"
        >
          <Icon name="shield" size={16} color="#3A404B" />
          <Txt style={s.twoT}>Account details</Txt>
        </Pressable>
        <Pressable
          style={[s.twoB, s.red]}
          onPress={() => act('logout')}
          testID="wallet.logout"
        >
          <Icon name="logout" size={16} color="#C0392B" />
          <Txt style={[s.twoT, s.redT]}>Log out</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  name: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  // <label> is inline: its line box is the section's 22.475 px line
  label: { lineHeight: 22.475 },
  in: { flexDirection: 'row', gap: 8, marginTop: 8 },
  inBox: { flex: 1, minWidth: 0 },
  ring: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 15,
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E3E7ED',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 0,
    ...font('book', 400),
    fontSize: fontPx(20),
    color: '#14161C',
    includeFontPadding: false,
  },
  inputFocus: { borderColor: '#1B8AD3' },
  save: {
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#14161C',
    justifyContent: 'center',
  },
  saveT: {
    ...font('sans', 700),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#fff',
    textAlign: 'center',
  },
  nameS: { fontSize: 11.5, lineHeight: 16.675, color: '#9AA3AF', marginTop: 7 },
  meter: {
    marginTop: 14,
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderRadius: 22,
    backgroundImage: 'radial-gradient(80% 60% at 50% 0%, #EAF4FC, #FFFFFF 70%)',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
    alignItems: 'center',
  },
  ringBox: { width: 196, height: 196 },
  ringIn: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringIc: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#EEEBFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringB: {
    ...font('serif', 800),
    fontSize: 52,
    lineHeight: 52,
    letterSpacing: -2.08,
    color: '#14161C',
    marginTop: 6,
    textAlign: 'center',
  },
  ringS: {
    fontSize: 11.5,
    lineHeight: 16.675,
    color: '#7A8494',
    marginTop: 3,
    textAlign: 'center',
  },
  plan: { alignItems: 'center', gap: 6, marginTop: 14, alignSelf: 'stretch' },
  tier: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    alignItems: 'flex-start',
    overflow: 'visible',
  },
  tierT: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 0.84,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  planS: {
    fontSize: 12.5,
    lineHeight: 18.125,
    color: '#7A8494',
    textAlign: 'center',
  },
  costs: { marginTop: 18 },
  grid: { gap: 10, marginTop: 10 },
  gridRow: { flexDirection: 'row', gap: 10 },
  cost: {
    flex: 1,
    minWidth: 0,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  costIc: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  costB: {
    ...font('sans', 700),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
    marginTop: 10,
  },
  costS: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 2 },
  acts: { gap: 8, marginTop: 18 },
  act: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
  },
  actP: {
    backgroundColor: undefined,
    backgroundImage: 'linear-gradient(90deg, #1B8AD3, #3B5BCC)',
    boxShadow: '0px 14px 24px -14px rgba(27, 138, 211, 0.9)',
  },
  actT: {
    ...font('sans', 700),
    fontSize: 14.5,
    lineHeight: 21.025,
    color: '#14161C',
  },
  white: { color: '#fff' },
  two: { flexDirection: 'row', gap: 10, marginTop: 10 },
  twoB: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 46,
    borderRadius: 14,
    boxShadow: '0px 0px 0px 1px #E1E8F0',
  },
  red: { boxShadow: '0px 0px 0px 1px #F3D1CE' },
  twoT: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#3A404B',
  },
  redT: { color: '#C0392B' },
});

const view: ViewDef = {
  useTitle: () => 'Credits & plan',
  Screen: WalletScreen,
};

export default view;
