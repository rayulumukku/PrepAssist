// Source: PrepAssist.html L7441-L7459 (buyHTML)
// Source: PrepAssist.html L7437-L7440 (buyItem), L7611 (A.byPay rewrites #sheet in place)
// Source: PrepAssist.html L3534-L3561 (.by-*), L9337 (ds-handoff .by-pay), L10691-L10693 (plan colours of .by-ic / .by-pay)
// The purchase sheet, opened by A.buy with arg "<kind>:<id>". Its step (confirm / wait / done) is
// S.buyStep; byPay swaps the content without closing the sheet, as `$('#sheet').innerHTML = …` does.
// Computed from reference/android/sheet-purchase-confirm-{pro,ultimate,vault,pack},
// sheet-purchase-processing, sheet-purchase-done-{pro,ultimate,vault,pack}.
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { act } from '../../actions';
import { Icon, SheetFrame, SheetGrab } from '../../components';
import { today } from '../../env/clock';
import type { IconName } from '../../icons/iconPaths.generated';
import type { SheetProps } from '../../navigation/routes';
import { buyItem } from '../../screens/account/buy';
import { addD, fmtShort } from '../../screens/account/mePage';
import { useStore } from '../../store';
import { font, Txt, useInsets } from '../../theme';

const IC_BG: Record<string, object> = {
  pro: { backgroundImage: 'linear-gradient(145deg, #8B69FF, #5631D1)' },
  ultimate: { backgroundImage: 'linear-gradient(145deg, #FFE7A8, #C99634)' },
  vault: { backgroundColor: '#0E9A8A' },
  pack: { backgroundColor: '#F5A01F' },
};
const PAY_BG: Record<string, object> = {
  pro: {
    backgroundImage: 'linear-gradient(90deg, #6A45E8, #B05BE0)',
    boxShadow: '0px 14px 24px -14px rgba(106, 69, 232, 0.8)',
  },
  ultimate: {
    backgroundImage: 'linear-gradient(90deg, #1B150A, #3D2C0E)',
    boxShadow:
      '0px 0px 0px 1px rgba(247, 215, 116, 0.4), 0px 14px 24px -14px rgba(0, 0, 0, 0.8)',
  },
};
const PAY_BASE = {
  backgroundImage: 'linear-gradient(90deg, #1B8AD3, #3B5BCC)',
  boxShadow: '0px 14px 24px -14px rgba(27, 138, 211, 0.9)',
};

/** .by-spin: 54 px ring, 4 px #EAF4FC with a #1B8AD3 top, animation sp .8s linear infinite */
function Spin(): React.JSX.Element {
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
  return <Animated.View style={[s.spin, st]} />;
}

/** .by-burst i: rotate(a) translateY(-30 -> -70), opacity 1 -> 0, .9s .15s ease-out forwards (invisible before) */
function Shard({ i }: { i: number }): React.JSX.Element {
  const p = useSharedValue(-1);
  useEffect(() => {
    p.value = withDelay(
      150,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) }),
    );
  }, [p]);
  const st = useAnimatedStyle(() => {
    const k = Math.max(0, p.value);
    return {
      opacity: p.value < 0 ? 0 : 1 - k,
      transform: [
        { rotate: `${i * 30}deg` },
        { translateY: p.value < 0 ? -56 : -30 - 40 * k },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        s.shard,
        { backgroundColor: ['#F5A01F', '#1B8AD3', '#2F9E62'][i % 3] },
        st,
      ]}
    />
  );
}

/** .by-burst span: animation pop .5s cubic-bezier(.3,1.6,.5,1) (from scale .7) */
function Pop(): React.JSX.Element {
  const v = useSharedValue(0.7);
  useEffect(() => {
    v.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.3, 1.6, 0.5, 1),
    });
  }, [v]);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: v.value }] }));
  return (
    <Animated.View style={[s.pop, st]}>
      <Icon name="check" size={34} strokeWidth={2.6} color="#fff" />
    </Animated.View>
  );
}

function PurchaseSheet({ arg }: SheetProps): React.JSX.Element | null {
  const step = useStore(st => st.buyStep);
  const credits = useStore(st => st.me.credits);
  const { sab } = useInsets();
  const [kind, id] = (arg ?? '').split(':');
  const it = buyItem(kind, id);
  if (!it) return null;
  if (step === 'wait') {
    return (
      <>
        <SheetGrab />
        <View style={[s.wait, { paddingBottom: sab + 26 }]}>
          <Spin />
          <Txt style={s.waitB}>Processing payment…</Txt>
          <Txt style={s.waitS}>Confirming with your UPI app</Txt>
        </View>
      </>
    );
  }
  if (step === 'done') {
    return (
      <>
        <SheetGrab />
        <View style={[s.wait, { paddingBottom: sab + 26 }]}>
          <View style={s.burst}>
            {Array.from({ length: 12 }, (_, i) => (
              <Shard key={i} i={i} />
            ))}
            <Pop />
          </View>
          <Txt style={s.doneH}>You’re all set!</Txt>
          <Txt style={s.doneP}>
            {it.id === 'vault' ? (
              'Cloud Vault is unlocked — 1 GB more space for your PDFs and scans.'
            ) : it.id === 'pack' ? (
              <>
                <Txt style={s.doneB}>{`${it.credits} credits`}</Txt>
                {' added. Your balance is now '}
                <Txt style={s.doneB}>{String(credits)}</Txt>.
              </>
            ) : (
              <>
                {'Welcome to '}
                <Txt style={s.doneB}>{it.n}</Txt>
                {'. '}
                <Txt style={s.doneB}>{`${it.credits} credits`}</Txt>
                {' are in your wallet.'}
              </>
            )}
          </Txt>
          <Pressable
            style={[s.pay, s.payDone, PAY_BASE]}
            onPress={() => act('closeSheet')}
            testID="sheet.purchase.desk"
          >
            <Txt style={s.payT}>Back to my desk</Txt>
          </Pressable>
          <Pressable
            style={s.lnk}
            onPress={() => act('byReceipt')}
            testID="sheet.purchase.receipt"
          >
            <Txt style={s.lnkT}>View receipt</Txt>
          </Pressable>
        </View>
      </>
    );
  }
  const ult = it.id === 'ultimate';
  const rows: [string, React.ReactNode][] = [
    [
      'You get',
      it.id === 'vault'
        ? '+1 GB encrypted storage'
        : '+' + it.credits + ' AI credits',
    ],
    [
      'Billing',
      kind === 'plan'
        ? 'Monthly · renews ' + fmtShort(addD(today(), 30))
        : 'One time · never expires',
    ],
    ['Pay with', null],
  ];
  return (
    <SheetFrame title="Confirm purchase" testID="sheet.purchase">
      <View style={s.item}>
        <View style={[s.ic, IC_BG[it.id] ?? { backgroundColor: '#1B8AD3' }]}>
          <Icon name={it.ic as IconName} color={ult ? '#2A1D05' : '#fff'} />
        </View>
        <View style={s.itemBody}>
          <Txt style={s.itemB}>{it.n}</Txt>
          <Txt style={s.itemS}>{it.kind}</Txt>
        </View>
        <Txt style={s.itemP}>{'₹' + it.p}</Txt>
      </View>
      <View style={s.rows}>
        {rows.map(([k, v]) => (
          <View key={k} style={s.row}>
            <Txt style={s.rowK}>{k}</Txt>
            {v !== null ? (
              <Txt style={s.rowV}>{v}</Txt>
            ) : (
              <View style={s.upi}>
                <View style={s.upiI}>
                  <Txt style={s.upiIT}>UPI</Txt>
                </View>
                <Txt style={s.rowV}>Google Pay · divya@okaxis</Txt>
              </View>
            )}
          </View>
        ))}
        <View style={[s.row, s.tot]}>
          <Txt style={s.totK}>Total today</Txt>
          <Txt style={s.totV}>{'₹' + it.p}</Txt>
        </View>
      </View>
      <Pressable
        style={[s.pay, PAY_BG[it.id] ?? PAY_BASE]}
        onPress={() => act(`byPay:${kind}:${id}`)}
        testID="sheet.purchase.pay"
      >
        <Icon name="lock" size={16} color={ult ? '#F7DE8E' : '#fff'} />
        <Txt style={[s.payT, ult && s.payTU]}>{'Pay ₹' + it.p}</Txt>
      </Pressable>
      <Txt style={s.note}>
        {(kind === 'plan'
          ? 'Cancel anytime, at least 24 hours before renewal. '
          : '') + 'Prototype checkout — no real payment is made.'}
      </Txt>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F5F7FA',
  },
  ic: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: { flex: 1 },
  itemB: {
    ...font('sans', 700),
    fontSize: 15.5,
    lineHeight: 22.475,
    color: '#14161C',
  },
  // inline <small> in a 22.475 line box
  itemS: { fontSize: 12.5, lineHeight: 22.475, color: '#7A8494' },
  itemP: {
    ...font('serif', 800),
    fontSize: 20,
    lineHeight: 29,
    color: '#25272D',
  },
  rows: { marginTop: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 11,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F8',
  },
  rowK: { fontSize: 13.5, lineHeight: 19.575, color: '#7A8494' },
  rowV: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
    textAlign: 'right',
  },
  upi: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  upiI: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    backgroundColor: '#14161C',
  },
  upiIT: {
    ...font('sans', 800),
    fontSize: 9.5,
    lineHeight: 13.775,
    letterSpacing: 0.38,
    color: '#fff',
  },
  tot: { borderBottomWidth: 0 },
  totK: { fontSize: 15.5, lineHeight: 29, color: '#7A8494' },
  totV: {
    ...font('serif', 800),
    fontSize: 20,
    lineHeight: 29,
    color: '#14161C',
    textAlign: 'right',
  },
  pay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    height: 52,
    marginTop: 14,
    borderRadius: 16,
  },
  payDone: { marginTop: 22 },
  payT: {
    ...font('sans', 700),
    fontSize: 15.5,
    lineHeight: 22.475,
    color: '#fff',
  },
  payTU: { color: '#F7DE8E' },
  note: {
    fontSize: 11.5,
    lineHeight: 16.675,
    color: '#9AA3AF',
    textAlign: 'center',
    marginTop: 10,
  },
  wait: { alignItems: 'center', paddingTop: 36, paddingHorizontal: 24 },
  spin: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 4,
    borderColor: '#EAF4FC',
    borderTopColor: '#1B8AD3',
  },
  waitB: {
    ...font('book', 500),
    fontSize: 20,
    lineHeight: 29,
    marginTop: 18,
    textAlign: 'center',
  },
  waitS: {
    fontSize: 12.5,
    lineHeight: 18.125,
    color: '#7A8494',
    marginTop: 4,
    textAlign: 'center',
  },
  burst: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shard: {
    position: 'absolute',
    left: 45,
    top: 42,
    width: 6,
    height: 12,
    borderRadius: 3,
  },
  pop: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2F9E62',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 0px 8px #E6F4EA',
  },
  doneH: {
    ...font('book', 500),
    fontSize: 28,
    lineHeight: 40.6,
    marginTop: 18,
    textAlign: 'center',
  },
  doneP: {
    fontSize: 14.5,
    lineHeight: 22.475,
    color: '#4A505B',
    marginTop: 6,
    maxWidth: 290,
    textAlign: 'center',
  },
  doneB: { ...font('sans', 700) },
  lnk: { alignSelf: 'stretch', marginTop: 10, padding: 8 },
  lnkT: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#7A8494',
    textAlign: 'center',
  },
});

export default PurchaseSheet;
