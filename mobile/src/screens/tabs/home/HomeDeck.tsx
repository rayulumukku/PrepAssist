// Source: PrepAssist.html L6108-L6121 (renderHome: section.d-sec.fcs), L6147-L6164 (fcFaces, setFc), L6444-L6456 (initDeck)
// Source: PrepAssist.html L1689-L1716 (deck, .d-fan, .d-swipe, .d-stamp, .d-fcc, .d-rb, .d-fcm), L1761-L1793 (HOME v9 .fx-*), L2394-L2396 + L1394 + L3003 (.lang)
// The daily flashcard deck. Computed: reference/android/tab-home-flashcard-front, -flipped, -hindi, -rated.
//   .lang        padding 2, radius 999, border 1 #D7DCE4; buttons 26 high, padding 0 10, Inter 600 12.5;
//                .on #1B8AD3 / rgba(255,255,255,.75), off --muted; `transition: all .2s` (ease); हिं is .hi (Noto 600, line-height 20)
//   .d-deck      margin-top 4; .d-fan inset 8 8 -6, radius 18; f2 rotate(4deg) translateY(10) #EFECFD/#DCD6F8,
//                f1 rotate(-3.5deg) translateY(6) #EAF7F1/#CDEBDD
//   .d-swipe     z 2; transition transform .35s cubic-bezier(.3,1.3,.5,1), opacity .3s (ease)
//   .d-stamp     top 56, padding 4 10, border 2, radius 8, Inter Tight 800 15.5 ls 1.24 uppercase;
//                .yes left 18 rotate(-12deg) #1F8A5B, .no right 18 rotate(12deg) #D9534F, opacity 0
//   .fx          #fff radius 20 padding 18 18 16 22, min-height 292, shadow 0 0 0 1px #E1E8F0, 0 20px 34px -24px rgba(20,50,90,.55);
//                ::before 5 px bar var(--sc); .flip: ring 1.5px color-mix(var(--sc) 40%, #fff)
//   .fx-sub      24 high, padding 0 10, radius 12, Inter 700 11.5, var(--sc) on color-mix(var(--sc) 10%, #fff)
//   .fx-n        Inter Tight 800 18/26.1 #14161C; small 12.5 700 #AEB7C3
//   .fx-qk/.fx-ak Inter 800 10.5/15.225 ls 1.47 uppercase, #9AA3AF margin-top 16 / #1F8A5B margin-top 12
//   .fx-q        EB Garamond 20/27 #14161C margin 6 0 16; .hi Noto Sans Devanagari 18/27.9
//   .fx-ans      margin-top auto, padding-top 2, border-top 1 dashed #E1E8F0
//   .fx-a        Inter 14.5/22.475 #3A404B, margin-top 6, min-height 66; blur(6px) opacity .5 until .flip
//                (transition filter .45s ease, opacity .45s ease); b #14161C 700
//   .fx-cover    inset 8 0 0, centred pill: #fff padding 9 14 radius 20, Inter 700 13.5 #1B8AD3,
//                shadow 0 0 0 1px #D6E8F7, 0 8px 16px -10px rgba(27,138,211,.5); .flip: opacity 0, translateY(8) (.3s ease)
//   .d-fcc       flex space-between centred, padding 12 0 0, margin-top 20 (with the empty #fcRate as a 4th item)
//   .d-rb        52 circle, #fff, border 1 #E1E8F0, shadow 0 8px 16px -10px rgba(20,50,90,.35); .no #D9534F, .yes #1F8A5B / #fff
//   .d-fcm small Inter 600 12.5/18.125 #5B6472, margin-top 3, centred
// filter: blur() on .fx-a: Android draws it with the `filter` style; iOS has no blur filter in this React
// Native build, so a Backdrop (system blur) is laid over the answer there (see the report).
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { act } from '../../../actions';
import { Backdrop, Icon, RichText } from '../../../components';
import { FLASH, SUBJ } from '../../../data';
import { useStore } from '../../../store';
import { easeCss, useTransition } from '../../../shell/anim';
import { font, palettes, Txt } from '../../../theme';
import { mix } from '../homeLogic';
import { DH } from './HomeParts';

const swipeEase = Easing.bezier(0.3, 1.3, 0.5, 1);
const INK = '#14161C';

function LangBtn({ on, label, hi, onPress }: { on: boolean; label: string; hi?: boolean; onPress: () => void }): React.JSX.Element {
  const v = useTransition(on ? 1 : 0, 200, easeCss);
  const anim = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(v.value, [0, 1], ['rgba(27,138,211,0)', '#1B8AD3']) }));
  const txt = useAnimatedStyle(() => ({ color: interpolateColor(v.value, [0, 1], [palettes.free.muted, 'rgba(255,255,255,0.75)']) }));
  return (
    <Pressable onPress={onPress} testID={`home.fcLang.${hi ? 'hi' : 'en'}`}>
      <Animated.View style={[styles.langBtn, anim]}>
        <Animated.Text allowFontScaling={false} style={[hi ? styles.langHi : styles.langT, txt]}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

/** fcFaces(fc) L6147-L6157 */
function Faces({ idx, flip }: { idx: number; flip: boolean }): React.JSX.Element {
  const L = useStore(s => s.fcLang);
  const fc = FLASH[idx];
  const [q, a] = L === 'hi' ? fc.hi : fc.en;
  const sc = SUBJ[fc.s].hex;
  const hi = L === 'hi';
  const reveal = useTransition(flip ? 1 : 0, 450, easeCss);
  const cover = useTransition(flip ? 1 : 0, 300, easeCss);
  const aStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + 0.5 * reveal.value,
    ...(Platform.OS === 'android' && reveal.value < 1 ? { filter: [{ blur: 6 * (1 - reveal.value) }] } : {}),
  }));
  const blurOver = useAnimatedStyle(() => ({ opacity: 1 - reveal.value }));
  const coverStyle = useAnimatedStyle(() => ({ opacity: 1 - cover.value, transform: [{ translateY: 8 * cover.value }] }));
  return (
    <View
      style={[
        styles.fx,
        flip && { boxShadow: `0px 0px 0px 1.5px ${mix(sc, 0.4, '#FFFFFF')}, 0px 20px 34px -24px rgba(20, 50, 90, 0.55)` },
      ]}
    >
      <View style={[styles.fxBar, { backgroundColor: sc }]} />
      <View style={styles.fxTop}>
        <View style={[styles.fxSub, { backgroundColor: mix(sc, 0.1, '#FFFFFF') }]}>
          <View style={[styles.fxSubI, { backgroundColor: sc }]} />
          <Txt style={[styles.fxSubT, { color: sc }]}>{SUBJ[fc.s].n}</Txt>
        </View>
        <Txt style={styles.fxN}>
          {String(idx + 1).padStart(2, '0')}
          <Txt style={styles.fxNSmall}> / {String(FLASH.length).padStart(2, '0')}</Txt>
        </Txt>
      </View>
      <Txt style={styles.fxQk}>Question</Txt>
      <Txt style={[styles.fxQ, hi && styles.fxQHi]}>{q}</Txt>
      <View style={styles.fxAns}>
        <Txt style={styles.fxAk}>Answer</Txt>
        <View>
          <Animated.View style={aStyle}>
            <RichText
              html={a}
              styles={{
                base: hi ? { ...styles.fxA, ...font('deva', 400) } : styles.fxA,
                b: hi ? { ...font('deva', 700), color: INK } : { ...font('sans', 700), color: INK },
              }}
            />
          </Animated.View>
          {Platform.OS === 'ios' ? (
            <Animated.View style={[StyleSheet.absoluteFill, blurOver]} pointerEvents="none">
              <Backdrop px={6} tint="rgba(255,255,255,0)" />
            </Animated.View>
          ) : null}
        </View>
        <Animated.View style={[styles.cover, coverStyle]} pointerEvents={flip ? 'none' : 'auto'}>
          <View style={styles.coverPill}>
            <Txt style={styles.coverT}>Tap to reveal answer</Txt>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

export function HomeDeck({ title, onLayoutY }: { title: string; onLayoutY: (y: number) => void }): React.JSX.Element {
  const fcLang = useStore(s => s.fcLang);
  const fc = useStore(s => s.fc);
  const flip = useStore(s => s.fcFlip);
  // setFc: the faces are rebuilt 150 ms after S.fc changes (L6161)
  const [shown, setShown] = useState(fc);
  useEffect(() => {
    if (fc === shown) return;
    const id = setTimeout(() => setShown(fc), 150);
    return () => clearTimeout(id);
  }, [fc, shown]);

  // initDeck: transform/opacity of #fcSwipe and the two stamps
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);
  const sc = useSharedValue(1);
  const op = useSharedValue(1);
  const yes = useSharedValue(0);
  const no = useSharedValue(0);
  const dxRef = useRef(0);

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dxRef.current = 0;
      },
      onPanResponderMove: (_e, g) => {
        const dx = g.dx;
        dxRef.current = dx;
        // w.style.transition = 'none'; translateX(dx) rotate(dx/18 deg)
        tx.value = dx;
        rot.value = dx / 18;
        yes.value = Math.max(0, Math.min(1, dx / 80));
        no.value = Math.max(0, Math.min(1, -dx / 80));
      },
      onPanResponderRelease: () => end(),
      // pointercancel runs the same end() in the HTML
      onPanResponderTerminate: () => end(),
    }),
  ).current;

  const T = (v: number, ms = 350, easing = swipeEase): number => withTiming(v, { duration: ms, easing });
  function rate(got: boolean): void {
    act('fcRate', got ? 'got' : 'again');
    // transition none; translateY(14px) scale(.96); opacity 0; stamps 0; next frame: back with the transition
    tx.value = 0;
    rot.value = 0;
    ty.value = 14;
    sc.value = 0.96;
    op.value = 0;
    yes.value = 0;
    no.value = 0;
    requestAnimationFrame(() => {
      ty.value = T(0);
      sc.value = T(1);
      op.value = withTiming(1, { duration: 300, easing: easeCss });
    });
  }
  function end(): void {
    const dx = dxRef.current;
    if (Math.abs(dx) > 90) {
      const got = dx > 0;
      tx.value = T(got ? 420 : -420);
      rot.value = T(got ? 24 : -24);
      op.value = withTiming(0, { duration: 300, easing: easeCss });
      setTimeout(() => rate(got), 260);
    } else {
      tx.value = T(0);
      rot.value = T(0);
      // stamps: style.opacity = 0 (they have no transition)
      yes.value = 0;
      no.value = 0;
      if (Math.abs(dx) < 6) act('flip');
    }
  }

  const swipe = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { rotate: `${rot.value}deg` }, { scale: sc.value }],
  }));
  const yesS = useAnimatedStyle(() => ({ opacity: yes.value }));
  const noS = useAnimatedStyle(() => ({ opacity: no.value }));

  return (
    <View style={styles.sec} onLayout={e => onLayoutY(e.nativeEvent.layout.y)}>
      <DH
        title={title}
        hc="c-t"
        icon="layers"
        style={styles.dhLang}
        right={
          <View style={styles.lang} accessibilityLabel="Card language">
            <LangBtn on={fcLang === 'en'} label="EN" onPress={() => act('fcLang:en')} />
            <LangBtn on={fcLang !== 'en'} label="हिं" hi onPress={() => act('fcLang:hi')} />
          </View>
        }
      />
      <View style={styles.deck}>
        <View style={[styles.fan, styles.f2]} />
        <View style={[styles.fan, styles.f1]} />
        <Animated.View style={[styles.swipe, swipe]} {...pan.panHandlers} testID="home.flashcard" accessibilityLabel="Flashcard, tap to reveal">
          <Animated.View style={[styles.stamp, styles.stampNo, noS]} pointerEvents="none">
            <Txt style={[styles.stampT, { color: '#D9534F' }]}>Again</Txt>
          </Animated.View>
          <Animated.View style={[styles.stamp, styles.stampYes, yesS]} pointerEvents="none">
            <Txt style={[styles.stampT, { color: '#1F8A5B' }]}>Got it</Txt>
          </Animated.View>
          <Faces idx={shown} flip={flip} />
        </Animated.View>
      </View>
      <View style={styles.fcc}>
        <Pressable style={styles.rb} onPress={() => act('fcRate:again')} accessibilityLabel="Review again" testID="home.fcRate.again">
          <Icon name="refresh" size={20} color="#D9534F" />
        </Pressable>
        <View style={styles.fcm}>
          <Txt style={styles.fcmT}>{'Swipe right if you knew it,\nleft to see it again'}</Txt>
        </View>
        <Pressable style={[styles.rb, styles.rbYes]} onPress={() => act('fcRate:got')} accessibilityLabel="Got it" testID="home.fcRate.got">
          <Icon name="check" size={20} color="#fff" />
        </Pressable>
        <View style={styles.fcRate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sec: { marginTop: 28 },
  dhLang: { marginBottom: 12 },
  lang: { flexDirection: 'row', padding: 2, borderRadius: 999, borderWidth: 1, borderColor: palettes.free.rule2, marginTop: 1.57 },
  langBtn: { height: 26, paddingHorizontal: 10, borderRadius: 999, justifyContent: 'center' },
  langT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, textAlign: 'center' },
  langHi: { ...font('deva', 600), fontSize: 12.5, lineHeight: 20, textAlign: 'center' },
  deck: { marginTop: 4 },
  fan: { position: 'absolute', top: 8, left: 8, right: 8, bottom: -6, borderRadius: 18, borderWidth: 1 },
  f2: { backgroundColor: '#EFECFD', borderColor: '#DCD6F8', transform: [{ rotate: '4deg' }, { translateY: 10 }] },
  f1: { backgroundColor: '#EAF7F1', borderColor: '#CDEBDD', transform: [{ rotate: '-3.5deg' }, { translateY: 6 }] },
  swipe: { zIndex: 2 },
  stamp: { position: 'absolute', top: 56, zIndex: 5, paddingVertical: 4, paddingHorizontal: 10, borderWidth: 2, borderRadius: 8 },
  stampYes: { left: 18, borderColor: '#1F8A5B', transform: [{ rotate: '-12deg' }] },
  stampNo: { right: 18, borderColor: '#D9534F', transform: [{ rotate: '12deg' }] },
  stampT: { ...font('serif', 800), fontSize: 15.5, lineHeight: 22.475, letterSpacing: 1.24, textTransform: 'uppercase' },
  fx: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 16,
    paddingLeft: 22,
    minHeight: 292,
    overflow: 'hidden',
    boxShadow: '0px 0px 0px 1px #E1E8F0, 0px 20px 34px -24px rgba(20, 50, 90, 0.55)',
  },
  fxBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  fxTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fxSub: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 24, paddingHorizontal: 10, borderRadius: 12 },
  fxSubI: { width: 6, height: 6, borderRadius: 3 },
  fxSubT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675 },
  fxN: { ...font('serif', 800), fontSize: 18, lineHeight: 26.1, color: INK },
  fxNSmall: { ...font('serif', 700), fontSize: 12.5, color: '#AEB7C3' },
  fxQk: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase', color: '#9AA3AF', marginTop: 16 },
  fxQ: { ...font('book', 400), fontSize: 20, lineHeight: 27, color: INK, marginTop: 6, marginBottom: 16 },
  fxQHi: { ...font('deva', 400), fontSize: 18, lineHeight: 27.9 },
  fxAns: { marginTop: 'auto', paddingTop: 2, borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#E1E8F0' },
  fxAk: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase', color: '#1F8A5B', marginTop: 12 },
  fxA: { fontSize: 14.5, lineHeight: 22.475, color: '#3A404B', marginTop: 6, minHeight: 66 },
  cover: { position: 'absolute', top: 8, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  coverPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#fff',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    boxShadow: '0px 0px 0px 1px #D6E8F7, 0px 8px 16px -10px rgba(27, 138, 211, 0.5)',
  },
  coverT: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#1B8AD3' },
  fcc: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 20 },
  rb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E1E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 16px -10px rgba(20, 50, 90, 0.35)',
  },
  rbYes: { backgroundColor: '#1F8A5B', borderColor: '#1F8A5B' },
  fcm: { alignItems: 'center' },
  fcmT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#5B6472', marginTop: 3, textAlign: 'center' },
  fcRate: { width: 0, height: 0 },
});
