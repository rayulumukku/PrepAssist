// Source: PrepAssist.html L7322-L7373 (ring, meRow, renderProfile), L3270-L3348 (.me-hero … .me-flogo), L10644-L10651 (planthemes .me-hero)
// The Profile tab pane: #t-profile > #profileScroll (background #F5F7FA, padding 0 20 120).
// Computed: reference/android/tab-profile, tab-profile-pro, tab-profile-ultimate, tab-profile-hi.
//   .me-hero    padding calc(var(--sat)+12) 20 70, margin 0 -20, radius 0 0 30 30, overflow hidden
//   .me-guil    absolute right -110 top -80, 330 x 330, opacity .12, `spin 120s linear infinite`
//   .me-top     38 high; .me-eb Inter 700 10.5/15.225 ls 1.89 uppercase #FFD08A; .me-ib 38 circle,
//               rgba(255,255,255,.14), border 1 rgba(255,255,255,.22), blur(6), icon 18; status dot 7 #3FD08A ring 2 #173E6B
//   .me-id      margin-top 20, gap 16; .me-av 92 (ring r 42 stroke 4, 43 %), initials disc inset 11
//               (linear-gradient(145deg,#fff,#E3EEF9), Inter Tight 800 28/40.6 ls -.56 #1B6FB3, shadow 0 10 20 -10 rgba(0,0,0,.5)),
//               pen badge 28 #F5A01F border 2 #1A4B7F; .me-nm h1 EB Garamond 500 28/29.4 ls -.28, p 12.5 opacity .78
//   .me-tier    24 high, padding 0 10, radius 12, margin-top 9, Inter 800 10.5 ls .84 uppercase; t-pro / t-ultimate gradients
//   .me-stats   margin-top 20, padding 12 4, radius 16, rgba(255,255,255,.08), border 1 rgba(255,255,255,.14);
//               b Inter Tight 800 18/18, span 10.5/15.225 opacity .75 margin-top 4
//   .me-wallet  margin-top -50, z 2, padding 16 16 14, radius 22, shadow 0 22 40 -22 rgba(15,60,110,.55);
//               grid 1fr 76px, gap 4 12; .me-wk Inter 800 10.5 ls 1.26 uppercase #6C5DD3 (inline-flex in a 22.475 line);
//               b Inter Tight 800 42/42 ls -1.26; ring r 32 stroke 6 #EEF2F7 + gradient #5DB4EC→#1B6FB3; .me-wb two 40 high buttons
//   .me-promo   margin-top 14, padding 16 16 16 18, radius 20, overflow hidden; .me-pmed 118 circle at right/bottom -16
//   .me-out     46 high, radius 14, shadow 0 0 0 1px #F3D1CE, Inter 600 14.5 #C0392B
//   .me-foot    margin-top 26, gap 4; .me-flogo 38 radius 12 (logo 24); b 13.5 700; small 11.5 #9AA3AF
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { act } from '../../actions';
import { Backdrop, Icon, Logo } from '../../components';
import { PLAN_CAP, PLAN_N } from '../../data';
import { useAppSize } from '../../shell/AppSize';
import { useTabScroll } from '../../shell/tabScroll';
import { useStore } from '../../store';
import { font, Txt, useInsets, usePlan } from '../../theme';
import { initials } from './homeLogic';
import { PLAN_HERO_BG, PlanSheen } from './home/HomeSky';
import { MeGrp, MeOk, MePill, MeRow, MeVal } from './profile/MeRow';

const INK = '#14161C';
const FREE_HERO_BG =
  'radial-gradient(70% 60% at 90% 0%, rgba(245,160,31,0.32), transparent 65%), radial-gradient(80% 70% at 0% 100%, rgba(108,93,211,0.35), transparent 60%), linear-gradient(160deg, #0F2747 0%, #173E6B 55%, #1B6FB3 100%)';

/** ring(r, frac, stroke, color, track) L7322: the value arc starts at 12 o'clock. */
function Ring({ r, frac, stroke, color, track }: { r: number; frac: number; stroke: number; color: string; track: string }): React.JSX.Element {
  const C = 2 * Math.PI * r;
  const c = r + stroke;
  return (
    <>
      <Circle cx={c} cy={c} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <Circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={[Number((C * Math.max(0.02, Math.min(1, frac))).toFixed(1)), Number(C.toFixed(1))]}
        transform={`rotate(-90 ${c} ${c})`}
      />
    </>
  );
}

/** .me-guil: nine concentric circles (alternately dashed), turning once every 120 s. */
function Guilloche(): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withTiming(1, { duration: 120000, easing: Easing.linear }), -1);
  }, [p]);
  const anim = useAnimatedStyle(() => ({ transform: [{ rotate: `${p.value * 360}deg` }] }));
  return (
    <Animated.View style={[styles.guil, anim]} pointerEvents="none">
      <Svg width={330} height={330} viewBox="0 0 300 300">
        {Array.from({ length: 9 }, (_, i) => (
          <Circle key={i} cx={150} cy={150} r={40 + i * 14} fill="none" stroke="#fff" strokeWidth={0.8} strokeDasharray={i % 2 ? [2, 5] : [1, 0]} />
        ))}
      </Svg>
    </Animated.View>
  );
}

function Ib({ icon, label, act: a, dot, testID }: { icon: 'pulse' | 'settings'; label: string; act: string; dot?: boolean; testID: string }): React.JSX.Element {
  return (
    <Pressable style={styles.ib} onPress={() => act(a)} accessibilityLabel={label} testID={testID}>
      <Backdrop px={6} tint="rgba(255,255,255,0.14)" />
      <Icon name={icon} size={18} color="#fff" />
      {dot ? <View style={styles.ibDot} /> : null}
    </Pressable>
  );
}

function Hero(): React.JSX.Element {
  const plan = usePlan();
  const mePlan = useStore(s => s.me.plan);
  const vault = useStore(s => s.me.vault);
  const user = useStore(s => s.user);
  const { sat } = useInsets();
  const { w } = useAppSize();
  const tierIcon = mePlan === 'free' ? 'shield' : mePlan === 'pro' ? 'spark' : 'crown';
  return (
    <View style={[styles.hero, { paddingTop: sat + 12, backgroundImage: plan === 'free' ? FREE_HERO_BG : PLAN_HERO_BG[plan] }]}>
      <Guilloche />
      <View style={styles.top}>
        <Txt style={styles.eb}>Aspirant · CSE 2027</Txt>
        <View style={styles.acts}>
          <Ib icon="pulse" label="System status" act="push:status" dot testID="profile.status" />
          <Ib icon="settings" label="App settings" act="push:settings" testID="profile.settings" />
        </View>
      </View>
      <View style={styles.id}>
        <Pressable style={styles.av} onPress={() => act('push:account')} accessibilityLabel="Account details" testID="profile.avatar">
          <Svg width={92} height={92} viewBox="0 0 92 92" style={StyleSheet.absoluteFill}>
            <Ring r={42} frac={0.43} stroke={4} color="#FFD27A" track="rgba(255,255,255,.18)" />
          </Svg>
          <View style={styles.avDisc}>
            <Txt style={styles.avT}>{initials(user.name)}</Txt>
          </View>
          <View style={styles.avPen}>
            <Icon name="pen" size={13} color="#fff" strokeWidth={2} />
          </View>
        </Pressable>
        <View style={styles.nm}>
          <Txt style={styles.h1}>{user.name}</Txt>
          <Txt style={styles.mail} numberOfLines={1}>
            {user.email}
          </Txt>
          <View style={[styles.tier, mePlan === 'pro' && styles.tierPro, mePlan === 'ultimate' && styles.tierUlt]}>
            <Icon name={tierIcon} size={12} color={mePlan === 'ultimate' ? '#3A2606' : '#fff'} />
            <Txt style={[styles.tierT, mePlan === 'ultimate' && styles.tierUltT]}>
              {(PLAN_N as unknown as Record<string, string>)[mePlan]}
              {vault ? ' · Vault' : ''}
            </Txt>
          </View>
        </View>
      </View>
      <View style={styles.stats}>
        {(
          [
            ['23', 'day streak'],
            ['43%', 'syllabus'],
            ['71%', 'accuracy'],
            ['128h', 'studied'],
          ] as const
        ).map(([b, s], i) => (
          <View key={s} style={[styles.stat, i > 0 && styles.statLine]}>
            <Txt style={styles.statB}>{b}</Txt>
            <Txt style={styles.statS}>{s}</Txt>
          </View>
        ))}
      </View>
      <PlanSheen plan={plan} width={w} />
    </View>
  );
}

function Wallet(): React.JSX.Element {
  const M = useStore(s => s.me);
  const cap = (PLAN_CAP as unknown as Record<string, number>)[M.plan];
  const planN = (PLAN_N as unknown as Record<string, string>)[M.plan];
  return (
    <Pressable style={styles.wallet} onPress={() => act('push:wallet')} testID="profile.wallet">
      <View style={styles.wTop}>
        <View style={styles.wl}>
          <View style={styles.wkLine}>
            <View style={styles.wk}>
              <Icon name="spark" size={14} color="#6C5DD3" />
              <Txt style={styles.wkT}>AI credits</Txt>
            </View>
          </View>
          <Txt style={styles.wB}>{M.credits}</Txt>
          <Txt style={styles.wSmall}>{M.plan === 'free' ? 'Free tier · no monthly refill' : planN + ' · ' + cap + ' a month'}</Txt>
        </View>
        <View style={styles.wr}>
          <Svg width={76} height={76} viewBox="0 0 76 76">
            <Defs>
              <LinearGradient id="meWg" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#5DB4EC" />
                <Stop offset="1" stopColor="#1B6FB3" />
              </LinearGradient>
            </Defs>
            <Ring r={32} frac={M.credits / cap} stroke={6} color="url(#meWg)" track="#EEF2F7" />
          </Svg>
          <View style={styles.wrC}>
            <Txt style={styles.wrT}>{Math.min(100, Math.round((M.credits / cap) * 100))}%</Txt>
          </View>
        </View>
      </View>
      <View style={styles.wb}>
        <Pressable style={[styles.wbBtn, styles.wbInk]} onPress={() => act('topup')} testID="profile.topup">
          <Icon name="plus" size={16} color="#fff" />
          <Txt style={[styles.wbT, styles.wbInkT]}>Top up</Txt>
        </Pressable>
        <Pressable style={styles.wbBtn} onPress={() => act('ledger')} testID="profile.ledger">
          <Icon name="list" size={16} color={INK} />
          <Txt style={styles.wbT}>Ledger</Txt>
        </Pressable>
      </View>
    </Pressable>
  );
}

function Promo(): React.JSX.Element | null {
  const plan = useStore(s => s.me.plan);
  if (plan === 'ultimate') return null;
  const ult = plan === 'pro';
  return (
    <Pressable style={[styles.promo, ult && styles.promoUlt]} onPress={() => act('push:upgrade')} testID="profile.promo">
      <View style={styles.pmed}>{ult ? <Icon name="crown" size={54} color="#FFD27A" /> : <Logo size={54} style={styles.pmedLogo} />}</View>
      <View style={styles.pBody}>
        <View style={styles.pkLine}>
          <View style={styles.pk}>
            <Icon name={ult ? 'crown' : 'spark'} size={13} color="#FFE2A3" />
            <Txt style={styles.pkT}>{ult ? 'Ultimate' : 'UPSC Pro'}</Txt>
          </View>
        </View>
        <Txt style={styles.pB}>{ult ? 'Double your AI credits' : 'Get examiner-grade feedback'}</Txt>
        <Txt style={styles.pSmall}>{ult ? '200 credits a month · unlimited courses' : '100 AI credits a month · Vision Mains evaluator'}</Txt>
        <View style={[styles.pEm, ult && styles.pEmUlt]}>
          <Txt style={[styles.pEmT, ult && styles.pEmUltT]}>{ult ? '₹699 / month' : '₹399 / month'}</Txt>
          <Icon name="arrow" size={14} color={ult ? '#3A2606' : '#1F2D6B'} />
        </View>
      </View>
    </Pressable>
  );
}

function ProfileTab(): React.JSX.Element {
  const scroll = useTabScroll('profile');
  const M = useStore(s => s.me);
  const lang = useStore(s => s.lang);
  return (
    <ScrollView {...scroll} style={styles.pane} contentContainerStyle={styles.content} testID="profile.scroll">
      <Hero />
      <Wallet />
      <Promo />
      <MeGrp title="Account & identity">
        <MeRow first icon="user" c="#1B8AD3" title="Account details" sub="Name, phone, email and security" onPress={() => act('push:account')} testID="profile.account" />
        <MeRow
          icon="spark"
          c="#6C5DD3"
          title="Credits & plan"
          sub="Display name, balance and credit ledger"
          onPress={() => act('push:wallet')}
          right={<MePill>{M.credits}</MePill>}
          testID="profile.credits"
        />
      </MeGrp>
      <MeGrp title="Billing & upgrades">
        <MeRow
          first
          icon="receipt"
          c="#0E9A8A"
          title="Payments"
          sub="Receipts and invoices"
          onPress={() => act('push:payments')}
          right={<MePill g>{M.payments.length}</MePill>}
          testID="profile.payments"
        />
        <MeRow
          hl
          icon="bolt"
          c="#E8890C"
          title={M.plan === 'ultimate' ? 'Manage plan' : 'Upgrade plan'}
          sub="UPSC Pro, Ultimate and Cloud Vault"
          onPress={() => act('push:upgrade')}
          testID="profile.upgrade"
        />
      </MeGrp>
      <MeGrp title="Preferences">
        <MeRow first icon="settings" c="#475467" title="App settings" sub="Haptics, notifications, data saver" onPress={() => act('push:settings')} testID="profile.appSettings" />
        <MeRow icon="sliders" c="#1B8AD3" title="Study preferences" sub="6 h a day · The Hindu" onPress={() => act('sheet:prefs')} testID="profile.prefs" />
        <MeRow
          icon="language"
          c="#C8622B"
          title="Language"
          sub="App labels and greetings"
          onPress={() => act('sheet:language')}
          right={<MeVal>{lang === 'hi' ? 'हिन्दी' : 'English'}</MeVal>}
          testID="profile.language"
        />
      </MeGrp>
      <MeGrp title="Diagnostics">
        <MeRow first icon="pulse" c="#2F8A4A" title="System status" sub="Live health of PrepAssist services" onPress={() => act('push:status')} right={<MeOk />} testID="profile.statusRow" />
      </MeGrp>
      <MeGrp title="Legal & help">
        <MeRow first icon="shield" c="#3B5BCC" title="Privacy Policy" sub="How your data is collected and used" onPress={() => act('push:legal:privacy')} testID="profile.privacy" />
        <MeRow icon="doc" c="#3B5BCC" title="Terms & Conditions" sub="The rules for using PrepAssist" onPress={() => act('push:legal:terms')} testID="profile.terms" />
        <MeRow icon="help" c="#0A97B8" title="Help & support" sub="Chat with our team" onPress={() => act('toast:Support chat would open here')} testID="profile.help" />
        <MeRow icon="refresh" c="#E8890C" title="Replay intro" sub="Watch the book open again" onPress={() => act('jump:book')} testID="profile.replay" />
        <MeRow icon="flag" c="#1B8AD3" title="One more step" sub="A reminder of why you started" onPress={() => act('push:onestep')} testID="profile.onestep" />
      </MeGrp>
      <Pressable style={styles.out} onPress={() => act('logout')} testID="profile.logout">
        <Icon name="logout" size={20} color="#C0392B" />
        <Txt style={styles.outT}>Log out</Txt>
      </Pressable>
      <View style={styles.foot}>
        <View style={styles.flogo}>
          <Logo size={24} />
        </View>
        <Txt style={styles.footB}>PrepAssist</Txt>
        <Txt style={styles.footS}>Version 1.0.9 · Built for aspirants across India</Txt>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pane: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  hero: { marginHorizontal: -20, paddingHorizontal: 20, paddingBottom: 70, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, overflow: 'hidden' },
  guil: { position: 'absolute', right: -110, top: -80, width: 330, height: 330, opacity: 0.12 },
  top: { height: 38, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eb: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.89, textTransform: 'uppercase', color: '#FFD08A' },
  acts: { flexDirection: 'row', gap: 8 },
  ib: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ibDot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#3FD08A', boxShadow: '0px 0px 0px 2px #173E6B' },
  id: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 20 },
  av: { width: 92, height: 92 },
  avDisc: {
    position: 'absolute',
    top: 11,
    left: 11,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(145deg, #FFFFFF, #E3EEF9)',
    boxShadow: '0px 10px 20px -10px rgba(0, 0, 0, 0.5)',
  },
  avT: { ...font('serif', 800), fontSize: 28, lineHeight: 40.6, letterSpacing: -0.56, color: '#1B6FB3', textAlign: 'center' },
  avPen: {
    position: 'absolute',
    right: 2,
    bottom: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5A01F',
    borderWidth: 2,
    borderColor: '#1A4B7F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nm: { flex: 1, minWidth: 0 },
  h1: { ...font('book', 500), fontSize: 28, lineHeight: 29.4, letterSpacing: -0.28, color: '#fff' },
  mail: { fontSize: 12.5, lineHeight: 18.125, color: '#fff', opacity: 0.78, marginTop: 4 },
  tier: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 9,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  tierPro: { backgroundColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #5DB4EC, #1B8AD3)', borderColor: 'transparent' },
  tierUlt: { backgroundColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #FFD27A, #E8890C)', borderColor: 'transparent' },
  tierT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.84, textTransform: 'uppercase', color: '#fff' },
  tierUltT: { color: '#3A2606' },
  stats: {
    flexDirection: 'row',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  stat: { flex: 1 },
  statLine: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.16)' },
  statB: { ...font('serif', 800), fontSize: 18, lineHeight: 18, color: '#fff', textAlign: 'center' },
  statS: { fontSize: 10.5, lineHeight: 15.225, color: '#fff', opacity: 0.75, marginTop: 4, textAlign: 'center' },
  wallet: {
    zIndex: 2,
    marginTop: -50,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderRadius: 22,
    backgroundColor: '#fff',
    boxShadow: '0px 22px 40px -22px rgba(15, 60, 110, 0.55)',
  },
  wTop: { flexDirection: 'row', gap: 12 },
  wl: { flex: 1, minWidth: 0 },
  wkLine: { height: 22.475, paddingTop: 1.39 },
  wk: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wkT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#6C5DD3' },
  wB: { ...font('serif', 800), fontSize: 42, lineHeight: 42, letterSpacing: -1.26, color: INK, marginTop: 6 },
  wSmall: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 4 },
  wr: { width: 76, height: 76, alignSelf: 'center' },
  wrC: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  wrT: { ...font('sans', 800), fontSize: 13.5, lineHeight: 19.575, color: INK },
  wb: { flexDirection: 'row', gap: 8, marginTop: 14 },
  wbBtn: { flex: 1, height: 40, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F1F5FA' },
  wbInk: { backgroundColor: INK },
  wbT: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: INK },
  wbInkT: { color: '#fff' },
  promo: {
    marginTop: 14,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 18,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundImage: 'radial-gradient(80% 120% at 100% 0%, rgba(255,210,122,0.45), transparent 55%), linear-gradient(130deg, #1B8AD3 0%, #3B5BCC 55%, #6C5DD3 100%)',
    boxShadow: '0px 18px 30px -18px rgba(59, 91, 204, 0.9)',
  },
  promoUlt: { backgroundImage: 'radial-gradient(80% 120% at 100% 0%, rgba(255,210,122,0.4), transparent 55%), linear-gradient(130deg, #14161C, #2B2440 60%, #3A2E14)' },
  pmed: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    width: 118,
    height: 118,
    borderRadius: 59,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    boxShadow: 'inset 0px 0px 0px 10px rgba(255, 255, 255, 0.06)',
  },
  pmedLogo: { opacity: 0.9 },
  pBody: { flex: 1, zIndex: 1, paddingRight: 70 },
  pkLine: { height: 22.475, paddingTop: 1.89 },
  pk: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pkT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#FFE2A3' },
  pB: { ...font('book', 500), fontSize: 20, lineHeight: 23, color: '#fff', marginTop: 6 },
  pSmall: { fontSize: 12.5, lineHeight: 18.125, color: '#fff', opacity: 0.85, marginTop: 4 },
  pEm: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, height: 32, paddingHorizontal: 13, borderRadius: 16, backgroundColor: '#fff' },
  pEmUlt: { backgroundColor: 'transparent', backgroundImage: 'linear-gradient(90deg, #FFE7A8, #E0B252)' },
  pEmT: { ...font('sans', 800), fontSize: 12.5, lineHeight: 18.125, color: '#1F2D6B' },
  pEmUltT: { color: '#3A2606' },
  out: {
    marginTop: 24,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #F3D1CE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outT: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: '#C0392B' },
  foot: { marginTop: 26, alignItems: 'center', gap: 4 },
  flogo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    boxShadow: '0px 0px 0px 1px #E6EBF1, 0px 10px 18px -12px rgba(27, 138, 211, 0.6)',
  },
  footB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: INK, textAlign: 'center' },
  footS: { fontSize: 11.5, lineHeight: 16.675, color: '#9AA3AF', textAlign: 'center' },
});

export default ProfileTab;
