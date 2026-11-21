// Source: PrepAssist.html L7510-L7536 (VIEWS.upgrade), L10770-L10775 (the wrapper that adds .pl-th)
// Source: PrepAssist.html L3462-L3532 (.ug-*), L1183 (@keyframes tw2), L10644-L10652 (plan heroes), L10682-L10690 (.ug-card.u-pro), L10720-L10735 (.pl-th, .pl-sws, .pl-free)
// Computed from reference/android/view-upgrade, -topup, -pack-selected, -pro, -ultimate.
// Focus view: the page is `.scroll.ug-scroll` (padding-bottom 100) holding the hero and the body.
// Not ported: text-underline-offset (React Native draws the underline at the font's own offset).
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { act } from '../../actions';
import { Icon, PenCTA } from '../../components';
import { PACKS, PLANS, PLAN_N, TH } from '../../data/plans';
import type { PlansItem } from '../../data/plans';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { easeCss, useTransition } from '../../shell/anim';
import { useStore } from '../../store';
import { font, Txt, useInsets, usePlan, useTheme } from '../../theme';
import type { Scrollable } from '../../shell/tabScroll';
import { registerUpgrade, scrollUpgradeToPacks, setUpgradePacksY } from './upgradeScroll';

const SPK: [number, number, number][] = [
  [40, 40, 6],
  [330, 30, 8],
  [300, 150, 5],
  [70, 170, 4],
  [200, 18, 4],
  [360, 110, 3],
];
const spkPath = ([x, y, r]: [number, number, number]): string =>
  `M${x} ${y - r * 2}q${r * 0.3} ${r * 1.7} ${r * 2} ${r * 2}q-${r * 1.7} ${r * 0.3} -${r * 2} ${r * 2}q-${r * 0.3} -${r * 1.7} -${r * 2} -${r * 2}q${r * 1.7} -${r * 0.3} ${r * 2} -${r * 2}Z`;

/** .ug-spk path: opacity .8 (attribute) <-> .35 at 50 %, 3 s ease-in-out, even children 1.2 s later. */
function Sparkle({ i }: { i: number }): React.JSX.Element {
  const o = useSharedValue(0.8);
  useEffect(() => {
    const half = { duration: 1500, easing: Easing.inOut(Easing.ease) };
    const loop = withRepeat(withSequence(withTiming(0.35, half), withTiming(0.8, half)), -1, false);
    o.value = i % 2 ? withDelay(1200, loop) : loop;
  }, [i, o]);
  const st = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, st]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 390 220">
        <Path d={spkPath(SPK[i])} fill={i % 2 ? '#FFD27A' : '#9FD0F2'} />
      </Svg>
    </Animated.View>
  );
}

const HERO_BG = {
  free: 'radial-gradient(70% 60% at 85% 10%, rgba(124, 111, 240, 0.55), transparent 60%), radial-gradient(70% 70% at 0% 100%, rgba(27, 138, 211, 0.55), transparent 60%), linear-gradient(170deg, #0B1736, #14304F 60%, #1B3E73)',
  pro: 'radial-gradient(90% 70% at 100% 0%, rgba(244, 114, 182, 0.5), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(96, 165, 250, 0.4), transparent 60%), linear-gradient(160deg, #25146B 0%, #5631D1 55%, #8B69FF 100%)',
  ultimate:
    'radial-gradient(80% 60% at 100% 0%, rgba(247, 215, 116, 0.42), transparent 60%), radial-gradient(60% 50% at 0% 100%, rgba(201, 150, 30, 0.28), transparent 60%), linear-gradient(160deg, #0A0907 0%, #1B150A 55%, #3D2C0E 100%)',
} as const;

/** Per-card colours (.ug-card.u-*, .u-* .ug-ic, .u-* .ug-f li span, .u-ultimate text) */
const CARD = {
  pro: {
    box: { boxShadow: '0px 0px 0px 2px #6A45E8, 0px 24px 40px -24px rgba(106, 69, 232, 0.7)', backgroundImage: 'radial-gradient(80% 50% at 100% 0%, #F1ECFE, #FFFFFF 60%)' },
    ic: { backgroundColor: '#F1ECFE' },
    icC: '#6A45E8',
    chk: { bg: '#E6F4EA', fg: '#2F8A4A' },
    h3: '#25272D',
    sub: '#7A8494',
    desc: '#4A505B',
    li: '#25272D',
    price: '#25272D',
    fine: '#9AA3AF',
  },
  ultimate: {
    box: {
      boxShadow: '0px 24px 40px -24px rgba(20, 16, 30, 0.9)',
      backgroundImage: 'radial-gradient(70% 60% at 100% 0%, rgba(224, 178, 82, 0.35), transparent 60%), linear-gradient(160deg, #16131F, #252036 60%, #1E1A12)',
    },
    ic: { backgroundImage: 'linear-gradient(145deg, #FFE7A8, #C99634)' },
    icC: '#2A1D05',
    chk: { bg: 'rgba(255, 210, 122, 0.16)', fg: '#FFD27A' },
    h3: '#FFFFFF',
    sub: 'rgba(255, 255, 255, 0.65)',
    desc: 'rgba(255, 255, 255, 0.65)',
    li: '#FFFFFF',
    price: '#FFD27A',
    fine: 'rgba(255, 255, 255, 0.65)',
  },
  vault: {
    box: { boxShadow: '0px 0px 0px 1px #CDEBE4, 0px 20px 34px -26px rgba(14, 154, 138, 0.5)', backgroundImage: 'radial-gradient(80% 60% at 100% 0%, #DDF4F0, #FFFFFF 60%)' },
    ic: { backgroundColor: '#0E9A8A' },
    icC: '#FFFFFF',
    chk: { bg: '#D2F0EA', fg: '#0E9A8A' },
    h3: '#25272D',
    sub: '#7A8494',
    desc: '#4A505B',
    li: '#25272D',
    price: '#25272D',
    fine: '#9AA3AF',
  },
} as const;
type CardId = keyof typeof CARD;

function Links({ color, size, line, children }: { color: string; size: number; line: number; children?: React.ReactNode }): React.JSX.Element {
  const a = { color, fontSize: size, lineHeight: line, textDecorationLine: 'underline' as const, textDecorationColor: color };
  return (
    <>
      {children}
      <Txt style={a} onPress={() => act('push:legal:privacy')}>
        Privacy
      </Txt>
      {' · '}
      <Txt style={a} onPress={() => act('push:legal:terms')}>
        Terms
      </Txt>
    </>
  );
}

function Card({ p }: { p: PlansItem }): React.JSX.Element {
  const M = useStore(st => st.me);
  const id = p.id as CardId;
  const C = CARD[id];
  const cur = p.id === 'vault' ? M.vault : M.plan === p.id;
  const ult = id === 'ultimate';
  return (
    <View style={[s.card, C.box]}>
      {p.id === 'pro' ? (
        <View style={[s.rib, s.ribPro]}>
          <Txt style={s.ribT}>Most popular</Txt>
        </View>
      ) : p.id === 'vault' ? (
        <View style={[s.rib, s.ribV]}>
          <Txt style={s.ribT}>Storage add-on</Txt>
        </View>
      ) : null}
      <View style={s.ch}>
        <View style={[s.ic, C.ic]}>
          <Icon name={p.ic as IconName} color={C.icC} />
        </View>
        <View style={s.chBody}>
          <Txt style={[s.h3, { color: C.h3 }]}>{p.n}</Txt>
          <Txt style={[s.chS, { color: C.sub }]}>{p.kind}</Txt>
        </View>
        <View style={s.price}>
          <Txt style={[s.priceB, { color: C.price }]}>{'₹' + p.p}</Txt>
          <Txt style={[s.priceS, { color: C.sub }]}>/month</Txt>
        </View>
      </View>
      <Txt style={[s.desc, { color: C.desc }]}>{p.desc}</Txt>
      <View style={s.f}>
        {p.f.map(x => (
          <View key={x} style={s.li}>
            <View style={[s.chk, { backgroundColor: C.chk.bg }]}>
              <Icon name="check" size={12} strokeWidth={2.6} color={C.chk.fg} />
            </View>
            <Txt style={[s.liT, { color: C.li }]}>{x}</Txt>
          </View>
        ))}
      </View>
      {cur ? (
        <View style={[s.btn, ult ? s.nowU : s.now]}>
          <Icon name="check" size={18} color={ult ? '#B6F2D2' : '#2F8A4A'} />
          <Txt style={[s.btnT, { color: ult ? '#B6F2D2' : '#2F8A4A' }]}>Your current plan</Txt>
        </View>
      ) : p.id === 'pro' ? (
        <PenCTA
          tone="pro"
          label={M.plan === 'ultimate' ? 'Switch to Pro' : 'Upgrade to Pro'}
          onPress={() => act('buy:plan:pro')}
          testID="upgrade.buy.pro"
        />
      ) : (
        <Pressable style={[s.btn, ult ? s.btnU : s.btnV]} onPress={() => act('buy:plan:' + p.id)} testID={`upgrade.buy.${p.id}`}>
          <Icon name={ult ? 'crown' : 'cloud'} size={18} color={ult ? '#2A1D05' : '#fff'} />
          <Txt style={[s.btnT, { color: ult ? '#2A1D05' : '#fff' }]}>{ult ? 'Go Ultimate' : 'Unlock Cloud Vault'}</Txt>
        </Pressable>
      )}
      <Txt style={[s.fine, { color: C.fine }]}>
        <Links color={C.fine} size={10.5} line={15.75}>
          {'Renews automatically unless cancelled at least 24 hours before the end of the billing period. '}
        </Links>
      </Txt>
    </View>
  );
}

/** .pl-th, the strip the planthemesjs wrapper inserts before .ug-packs (L10771-L10774) */
function ThemeStrip(): React.JSX.Element {
  const t = useTheme();
  const cur = useStore(st => st.me.plan);
  const items: [CardKey, 'free' | 'pro' | 'ultimate'][] = [
    ['f', 'free'],
    ['p', 'pro'],
    ['u', 'ultimate'],
  ];
  return (
    <View style={s.th}>
      <View style={s.thH}>
        <Icon name="spark" size={16} color={t.brand} />
        <Txt style={s.thHT}>Every plan has its own look</Txt>
      </View>
      <Txt style={s.thP}>Upgrade and the whole app changes theme to match.</Txt>
      <View style={s.sws}>
        {items.map(([c, k]) => (
          <View key={k} style={[s.sw, cur === k && { boxShadow: `0px 0px 0px 2px ${t.brand}` }]}>
            <View style={[s.pv, { backgroundImage: PV[c].bg }]}>
              <View style={[s.pvBar2, { backgroundColor: PV[c].bar2 }]} />
              <View style={[s.pvBar, { backgroundColor: PV[c].bar }]} />
            </View>
            {cur === k ? (
              <View style={s.yours}>
                <Txt style={s.yoursT}>Yours</Txt>
              </View>
            ) : null}
            <Txt style={s.swB}>{TH[k].t}</Txt>
            <Txt style={s.swS}>{TH[k].n}</Txt>
          </View>
        ))}
      </View>
      {cur !== 'free' ? (
        <Pressable style={s.free} onPress={() => act('planFree')} testID="upgrade.planFree">
          <Txt style={s.freeT}>Switch back to Free tier (demo)</Txt>
        </Pressable>
      ) : null}
    </View>
  );
}
type CardKey = 'f' | 'p' | 'u';
const PV = {
  f: { bg: 'radial-gradient(90% 70% at 100% 0%, #4FB0EC, transparent 60%), linear-gradient(160deg, #0F5E99, #1B8AD3 60%, #5DB6EE)', bar: 'rgba(255, 255, 255, 0.55)', bar2: 'rgba(255, 255, 255, 0.3)' },
  p: {
    bg: 'radial-gradient(90% 70% at 100% 0%, rgba(244, 114, 182, 0.6), transparent 60%), linear-gradient(160deg, #25146B, #5631D1 55%, #8B69FF)',
    bar: 'rgba(255, 255, 255, 0.55)',
    bar2: 'rgba(255, 255, 255, 0.3)',
  },
  u: {
    bg: 'radial-gradient(80% 60% at 100% 0%, rgba(247, 215, 116, 0.5), transparent 60%), linear-gradient(160deg, #0A0907, #1B150A 55%, #3D2C0E)',
    bar: 'rgba(247, 215, 116, 0.7)',
    bar2: 'rgba(247, 215, 116, 0.35)',
  },
} as const;

const AnimatedTxt = Animated.createAnimatedComponent(Txt);

/** .ug-pk button (+ .on), transition all .2s (ease) */
function Pack({ i, on }: { i: number; on: boolean }): React.JSX.Element {
  const k = PACKS[i];
  const v = useTransition(on ? 1 : 0, 200, easeCss);
  const grad = useAnimatedStyle(() => ({ opacity: v.value }));
  const b = useAnimatedStyle(() => ({ color: interpolateColor(v.value, [0, 1], ['#14161C', '#FFFFFF']) }));
  const sp = useAnimatedStyle(() => ({ color: interpolateColor(v.value, [0, 1], ['#7A8494', '#FFFFFF']) }));
  const sm = useAnimatedStyle(() => ({ color: interpolateColor(v.value, [0, 1], ['#3A404B', '#FFFFFF']) }));
  return (
    <Pressable style={s.pk} onPress={() => act('pack:' + i)} testID={`upgrade.pack.${i}`}>
      <View style={s.pkBase} />
      <Animated.View style={[s.pkOn, grad]} />
      {i === 3 ? (
        <View style={s.best}>
          <Txt style={s.bestT}>Best value</Txt>
        </View>
      ) : null}
      <AnimatedTxt style={[s.pkB, b]}>{String(k.c)}</AnimatedTxt>
      <AnimatedTxt style={[s.pkS, sp]}>credits</AnimatedTxt>
      <AnimatedTxt style={[s.pkM, sm]}>{'₹' + k.p}</AnimatedTxt>
    </Pressable>
  );
}

function UpgradeScreen({ arg, entryKey }: ViewProps): React.JSX.Element {
  const { sat } = useInsets();
  const plan = usePlan();
  const M = useStore(st => st.me);
  const ref = useRef<Scrollable | null>(null);
  const packsY = useRef<number | null>(null);
  useEffect(() => {
    registerUpgrade(entryKey, { scrollTo: o => ref.current?.scrollTo(o), packsY: packsY.current });
    return () => registerUpgrade(entryKey, null);
  }, [entryKey]);
  useEffect(() => {
    // mount: if (a === 'topup') setTimeout(() => sc.scrollTo({ top: #upPacks.offsetTop - 20, behavior: 'smooth' }), 450)
    if (arg !== 'topup') return;
    const tm = setTimeout(() => scrollUpgradeToPacks(entryKey), 450);
    return () => clearTimeout(tm);
  }, [arg, entryKey]);
  const bodyY = useRef(0);
  const onBody = (e: LayoutChangeEvent): void => {
    bodyY.current = e.nativeEvent.layout.y;
  };
  const onPacks = (e: LayoutChangeEvent): void => {
    packsY.current = bodyY.current + e.nativeEvent.layout.y;
    setUpgradePacksY(entryKey, packsY.current);
  };
  const pk = PACKS[M.pack];
  return (
    <ScrollView ref={(n: Scrollable | null) => { ref.current = n; }} style={StyleSheet.absoluteFill} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} testID="upgrade.scroll">
      <View style={[s.hero, { paddingTop: sat + 8, backgroundImage: HERO_BG[plan] }]}>
        {SPK.map((_, i) => (
          <Sparkle key={i} i={i} />
        ))}
        <View style={s.tb}>
          <Pressable style={s.ib} onPress={() => act('back')} accessibilityLabel="Close" testID="upgrade.close">
            <Icon name="close" color="#fff" />
          </Pressable>
          <Txt style={s.tbT}>Plans</Txt>
          <Pressable onPress={() => act('restore')} testID="upgrade.restore.top">
            <Txt style={s.rs}>Restore</Txt>
          </Pressable>
        </View>
        <View style={s.cur}>
          <Icon name={M.plan === 'free' ? 'shield' : 'spark'} size={13} color="#FFD27A" />
          <Txt style={s.curT}>{`You’re on ${PLAN_N[M.plan]}${M.vault ? ' + Vault' : ''}`}</Txt>
        </View>
        <Txt style={s.h1}>
          {'Supercharge your '}
          <Txt style={[s.em, plan === 'ultimate' && s.emU]}>preparation.</Txt>
        </Txt>
        <Txt style={s.p}>Examiner-grade Mains feedback, deeper AI help, and room for every note you own.</Txt>
        <View style={s.pts}>
          {(
            [
              ['scale', 'Answers graded in ~2 min'],
              ['db', 'Ask your own notes'],
              ['refresh', 'Cancel anytime'],
            ] as [IconName, string][]
          ).map(([i, x]) => (
            <View key={x} style={s.pt}>
              <Icon name={i} size={13} color="#9FD0F2" />
              <Txt style={s.ptT}>{x}</Txt>
            </View>
          ))}
        </View>
      </View>
      <View style={s.body} onLayout={onBody}>
        {PLANS.map(p => (
          <Card key={p.id} p={p} />
        ))}
        <ThemeStrip />
        <View style={s.packs} onLayout={onPacks}>
          <View style={s.ch}>
            <View style={[s.ic, s.icPk]}>
              <Icon name="bolt" color="#D97F06" />
            </View>
            <View style={s.chBody}>
              <Txt style={s.h3}>Instant credit top-ups</Txt>
              <Txt style={s.chS}>One-time packs · never expire</Txt>
            </View>
          </View>
          <View style={s.pkRow}>
            {PACKS.map((_, i) => (
              <Pack key={i} i={i} on={M.pack === i} />
            ))}
          </View>
          <View style={s.tot}>
            <View>
              <Txt style={s.totS}>Total</Txt>
              <Txt style={s.totB}>{'₹' + pk.p}</Txt>
              <Txt style={s.totP}>{`₹${(pk.p / pk.c).toFixed(2)} per credit`}</Txt>
            </View>
            <Pressable style={s.totBtn} onPress={() => act('buy:pack:' + M.pack)} testID="upgrade.buyPack">
              <Txt style={s.totBtnT}>Buy pack</Txt>
              <Icon name="arrow" size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
        <Txt style={s.legal}>
          {'Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current billing period.\n'}
          <Txt style={s.legalA} onPress={() => act('push:legal:terms')}>
            Terms of Use
          </Txt>
          {' · '}
          <Txt style={s.legalA} onPress={() => act('push:legal:privacy')}>
            Privacy Policy
          </Txt>
        </Txt>
        <Pressable style={s.restore} onPress={() => act('restore')} testID="upgrade.restore">
          <Icon name="refresh" size={16} color="#5B6472" />
          <Txt style={s.restoreT}>Restore purchases</Txt>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 100 },
  hero: { paddingHorizontal: 22, paddingBottom: 64, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' },
  tb: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ib: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tbT: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: '#fff' },
  rs: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: 'rgba(255, 255, 255, 0.8)',
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(255, 255, 255, 0.4)',
  },
  cur: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 26,
    paddingHorizontal: 11,
    marginTop: 22,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  curT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#fff' },
  h1: { ...font('book', 500), fontSize: 34, lineHeight: 35.36, letterSpacing: -0.51, color: '#fff', marginTop: 14 },
  em: { ...font('book', 500, true), color: '#FFD27A' },
  emU: { color: '#F7D774' },
  p: { fontSize: 14.5, lineHeight: 21.75, color: '#fff', opacity: 0.82, marginTop: 10, maxWidth: 310 },
  pts: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 16 },
  pt: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 10, borderRadius: 9, backgroundColor: 'rgba(255, 255, 255, 0.08)' },
  ptT: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#fff' },
  body: { paddingHorizontal: 18, paddingBottom: 40, marginTop: -40 },
  card: { marginBottom: 16, paddingTop: 20, paddingHorizontal: 18, paddingBottom: 16, borderRadius: 24 },
  rib: {
    position: 'absolute',
    top: -11,
    left: 18,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  ribPro: { backgroundImage: 'linear-gradient(90deg, #6A45E8, #B05BE0)', boxShadow: '0px 6px 12px -6px rgba(27, 138, 211, 0.9)' },
  ribV: { backgroundColor: '#0E9A8A', boxShadow: '0px 6px 12px -6px rgba(14, 154, 138, 0.9)' },
  ribT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#fff' },
  ch: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ic: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  icPk: { backgroundColor: '#FFF1DC' },
  chBody: { flex: 1, minWidth: 0 },
  h3: { ...font('book', 500), fontSize: 22, lineHeight: 24.2, color: '#25272D' },
  chS: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 2 },
  price: { alignItems: 'flex-end' },
  priceB: { ...font('serif', 800), fontSize: 28, lineHeight: 28, letterSpacing: -0.84, textAlign: 'right' },
  // inline span in a 15.5 px / 22.475 line: 14 px box, the line box is the parent's
  priceS: { fontSize: 11.5, lineHeight: 22.475, textAlign: 'right' },
  desc: { fontSize: 13.5, lineHeight: 20.25, marginTop: 12 },
  f: { gap: 9, marginTop: 14, marginBottom: 16 },
  li: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chk: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  liT: { ...font('sans', 500), fontSize: 13.5, lineHeight: 19.575, flex: 1 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 52, borderRadius: 16 },
  btnT: { ...font('sans', 700), fontSize: 15.5, lineHeight: 22.475 },
  btnU: {
    backgroundImage: 'linear-gradient(180deg, #FFE7A8, #D9A44A 60%, #B0801F)',
    boxShadow: '0px 14px 24px -14px rgba(224, 178, 82, 0.8), inset 0px 1px 0px 0px rgba(255, 255, 255, 0.5)',
  },
  btnV: { backgroundColor: '#0E9A8A', boxShadow: '0px 14px 24px -14px rgba(14, 154, 138, 0.9)' },
  now: { backgroundColor: '#E6F4EA' },
  nowU: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
  fine: { fontSize: 10.5, lineHeight: 15.75, textAlign: 'center', marginTop: 12 },
  th: { marginVertical: 16, padding: 14, borderRadius: 20, backgroundColor: '#fff', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  thH: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  thHT: { ...font('sans', 700), fontSize: 14, lineHeight: 20.3, color: '#14161C' },
  thP: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 3 },
  sws: { flexDirection: 'row', gap: 8, marginTop: 12 },
  sw: { flex: 1, borderRadius: 14, overflow: 'hidden', backgroundColor: undefined, boxShadow: '0px 0px 0px 1px #E6EBF1' },
  pv: { height: 62 },
  // ::after: left 8 right 22 bottom 9, 5 high, radius 3; its box-shadow 0 -9px 0 -1px is a copy 9 px up, 1 px smaller each side
  pvBar: { position: 'absolute', left: 8, right: 22, bottom: 9, height: 5, borderRadius: 3 },
  pvBar2: { position: 'absolute', left: 9, right: 23, bottom: 19, height: 3, borderRadius: 2 },
  yours: { position: 'absolute', right: 6, top: 6, paddingVertical: 3, paddingHorizontal: 6, borderRadius: 6, backgroundColor: '#fff' },
  yoursT: { ...font('sans', 800), fontSize: 9, lineHeight: 13.05, letterSpacing: 0.54, textTransform: 'uppercase', color: '#14161C' },
  swB: { ...font('sans', 700), fontSize: 12, lineHeight: 17.4, color: '#14161C', paddingTop: 8, paddingHorizontal: 9 },
  swS: { fontSize: 10.5, lineHeight: 15.225, color: '#8A93A0', paddingTop: 1, paddingHorizontal: 9, paddingBottom: 9 },
  free: { alignSelf: 'center', marginTop: 14 },
  freeT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', textDecorationLine: 'underline', textAlign: 'center' },
  packs: { marginTop: 8, padding: 18, borderRadius: 24, backgroundColor: '#fff', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  pkRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  pk: { flex: 1, alignItems: 'center', paddingTop: 14, paddingBottom: 10, borderRadius: 16 },
  pkBase: { ...StyleSheet.absoluteFill, borderRadius: 16, backgroundColor: '#F7F9FC', boxShadow: 'inset 0px 0px 0px 1.5px #E6EBF1' },
  pkOn: {
    ...StyleSheet.absoluteFill,
    borderRadius: 16,
    backgroundImage: 'linear-gradient(160deg, #1B8AD3, #3B5BCC)',
    boxShadow: '0px 12px 20px -12px rgba(27, 138, 211, 0.9)',
  },
  best: { position: 'absolute', top: -9, alignSelf: 'center', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: '#F5A01F', zIndex: 1 },
  bestT: { ...font('sans', 800), fontSize: 8.5, lineHeight: 12.325, letterSpacing: 0.51, textTransform: 'uppercase', color: '#fff' },
  pkB: { ...font('serif', 800), fontSize: 22, lineHeight: 22, letterSpacing: -0.44, textAlign: 'center' },
  pkS: { fontSize: 10.5, lineHeight: 15.225, marginTop: 3, textAlign: 'center' },
  pkM: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, marginTop: 8, textAlign: 'center' },
  tot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: '#E6EBF1',
  },
  totS: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#9AA3AF' },
  totB: { ...font('serif', 800), fontSize: 28, lineHeight: 29.4, color: '#14161C' },
  totP: { fontSize: 11.5, lineHeight: 22.475, color: '#7A8494' },
  totBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, height: 48, paddingHorizontal: 18, borderRadius: 14, backgroundColor: '#14161C' },
  totBtnT: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: '#fff' },
  legal: { fontSize: 11.5, lineHeight: 18.4, color: '#9AA3AF', textAlign: 'center', marginTop: 20, marginHorizontal: 6 },
  legalA: { color: '#9AA3AF', textDecorationLine: 'underline' },
  restore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CDD6E1',
  },
  restoreT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#5B6472' },
});

const view: ViewDef = {
  Screen: UpgradeScreen,
};

export default view;
