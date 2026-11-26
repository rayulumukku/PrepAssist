// Source: PrepAssist.html L4867-L4937 (#s-intro static markup)
// Source: PrepAssist.html L5896-L5907 (setIntro)
// Source: PrepAssist.html L5908-L5908 (introNext)
// Source: PrepAssist.html L5909-L5916 (swipeIntro: a horizontal swipe over #inVisual of more than 50 px)
// Source: PrepAssist.html L2103-L2129, L3062, L3882-L3885 (#s-intro, .in-top, .wordmark, .in-skip, .in-visual, .in-toc, .in-foot, .in-back)
// Values from reference/android stage-intro-1 … stage-intro-4.
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';
import { act } from '../../actions';
import { Btn, Icon, Logo } from '../../components';
import { easeCss, easeVar } from '../../shell/anim';
import { useStore } from '../../store';
import { font, palettes, useInsets } from '../../theme';
import { Txt } from '../../theme/Txt';
import { introNext, setIntro } from './flow';
import { useClassTransition } from './introAnim';
import { IntroVignettes } from './IntroVignettes';

const C = palettes.free;
const AnimatedTxt = Animated.createAnimatedComponent(Txt);

const TOC = [
  { n: '01', t: 'Notes', h: 'Faculty notes, verified.', p: 'Crisp compendiums for every subject — key points at a glance, exam traps flagged.' },
  {
    n: '02',
    t: 'Notes Tracker',
    h: 'Notes that keep themselves current.',
    p: 'Subject folders that pull in updates from your uploads and the news — review them and merge with AI.',
  },
  { n: '03', t: 'X-Ray Reading', h: 'Read what the examiner reads.', p: 'Every line UPSC has asked about, highlighted inside your books and PDFs.' },
  { n: '04', t: 'Cloud Upload', h: 'Your library, everywhere.', p: 'Upload PDFs and scans once — searchable by AI on web and app.' },
] as const;

// .n colour: --faint, .done --ink-2, .on --brand (L2115, L2121, L2124)
const N_COLORS = [C.faint, C.ink2, '#1B8AD3'];

/** One `li` of #inToc (L2114-L2125). */
function TocItem({ k, intro, fresh }: { k: number; intro: number; fresh: number }): React.JSX.Element {
  const on = k === intro;
  const done = k < intro;
  const item = TOC[k];
  // li: transition padding .4s var(--ease); padding 10 0 10 44, .on bottom 16
  const pad = useClassTransition(on ? 1 : 0, 400, easeVar, 0, 0, fresh);
  // .n: transition all .4s (ease): font-size 15.5 -> 28, top 11 -> 8, colour
  const nOn = useClassTransition(on ? 1 : 0, 400, easeCss, 0, 0, fresh);
  const nDone = useClassTransition(done ? 1 : 0, 400, easeCss, 0, 0, fresh);
  // .t: transition color .3s
  const tOn = useClassTransition(on ? 1 : 0, 300, easeCss, 0, 0, fresh);
  const tDone = useClassTransition(done ? 1 : 0, 300, easeCss, 0, 0, fresh);
  // .d: max-height 0 -> 160 (.5s var(--ease)), opacity (.4s), margin-top 0 -> 8 (.4s)
  const dMax = useClassTransition(on ? 1 : 0, 500, easeVar, 0, 0, fresh);
  const dOp = useClassTransition(on ? 1 : 0, 400, easeCss, 0, 0, fresh);
  const [dH, setDH] = useState(0);

  const liStyle = useAnimatedStyle(() => ({ paddingBottom: 10 + 6 * pad.value }));
  const nStyle = useAnimatedStyle(() => {
    const fs = 15.5 + 12.5 * nOn.value;
    const base = interpolateColor(nDone.value, [0, 1], [N_COLORS[0], N_COLORS[1]], 'RGB', { gamma: 1 }) as string;
    return {
      top: 11 - 3 * nOn.value,
      fontSize: fs,
      lineHeight: fs * 1.45,
      letterSpacing: -0.03 * fs,
      color: interpolateColor(nOn.value, [0, 1], [base, N_COLORS[2]], 'RGB', { gamma: 1 }),
    };
  });
  const tStyle = useAnimatedStyle(() => {
    const base = interpolateColor(tDone.value, [0, 1], [N_COLORS[0], N_COLORS[1]], 'RGB', { gamma: 1 }) as string;
    return { color: interpolateColor(tOn.value, [0, 1], [base, N_COLORS[2]], 'RGB', { gamma: 1 }) };
  });
  const dStyle = useAnimatedStyle(() => ({
    height: Math.min(dH, 160 * dMax.value),
    marginTop: 8 * dOp.value,
    opacity: dOp.value,
  }));

  return (
    <Pressable onPress={() => act('introGo:' + k)} testID={`intro.toc.${k}`}>
      <Animated.View style={[styles.li, liStyle]}>
        <AnimatedTxt style={[styles.n, nStyle]}>{item.n}</AnimatedTxt>
        <AnimatedTxt style={[styles.t, tStyle]}>{item.t}</AnimatedTxt>
        <Animated.View style={[styles.d, dStyle]}>
          <View style={styles.dIn} onLayout={e => setDH(e.nativeEvent.layout.height)}>
            <Txt style={styles.h3}>{item.h}</Txt>
            <Txt style={styles.p}>{item.p}</Txt>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

function IntroStage(): React.JSX.Element {
  const { sat, sab } = useInsets();
  const intro = useStore(s => s.intro);
  const fresh = useStore(s => s.introFresh);
  // the CSS animations of the vignettes (fxb, fcu) restart when the stage is shown again
  const run = useStore(s => (s.stage === 'intro' ? s.stageShown : -1));
  const x0 = useRef<number | null>(null);
  const backOff = useClassTransition(intro === 0 ? 1 : 0, 300, easeCss, 0, 0, fresh);
  const backStyle = useAnimatedStyle(() => ({ opacity: 1 - 0.7 * backOff.value }));
  const last = intro === 3;

  return (
    <View style={styles.stage} testID="intro">
      <View style={[styles.top, { paddingTop: Math.max(18, sat) }]}>
        <View style={styles.wordmark}>
          <Logo size={24} />
          <Txt style={styles.wordmarkT}>PrepAssist</Txt>
        </View>
        <Pressable onPress={() => act('introSkip')} style={styles.skip} testID="intro.skip">
          <Txt style={styles.skipT}>Skip</Txt>
        </Pressable>
      </View>
      <View
        style={styles.visual}
        onTouchStart={e => {
          x0.current = e.nativeEvent.pageX;
        }}
        onTouchEnd={e => {
          if (x0.current == null) return;
          const dx = e.nativeEvent.pageX - x0.current;
          x0.current = null;
          if (Math.abs(dx) > 50) {
            if (dx < 0) introNext();
            else setIntro(intro - 1);
          }
        }}>
        <IntroVignettes intro={intro} fresh={fresh} run={run} />
      </View>
      <View style={styles.copy}>
        <View style={styles.toc}>
          {TOC.map((_, k) => (
            <TocItem key={k} k={k} intro={intro} fresh={fresh} />
          ))}
        </View>
      </View>
      <View style={[styles.foot, { paddingBottom: Math.max(20, sab) }]}>
        <Animated.View style={backStyle}>
          <Pressable
            onPress={() => act('introPrev')}
            disabled={intro === 0}
            style={styles.back}
            accessibilityLabel="Previous"
            testID="intro.back">
            <Icon name="back" color={C.ink} />
          </Pressable>
        </Animated.View>
        <View style={styles.next}>
          <Btn variant={last ? 'brand' : 'ink'} wide label={last ? 'Get Started' : 'Next'} onPress={() => act('introNext')} testID="intro.next">
            <Icon name="arrow" color="#fff" />
          </Btn>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // #s-intro: --paper, column
  stage: { flex: 1, backgroundColor: C.paper },
  // .in-top: row, space-between, padding max(18px, --sat) 20 6
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, paddingHorizontal: 20, paddingBottom: 6 },
  // .wordmark: row, gap 8, Inter 700 18px / 26.1px, -0.36px
  wordmark: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordmarkT: { ...font('sans', 700), fontSize: 18, lineHeight: 26.1, letterSpacing: -0.36, color: C.ink },
  // .in-skip: padding 8 4, Inter 500 14.5px / 21.025px, --muted
  skip: { paddingVertical: 8, paddingHorizontal: 4 },
  skipT: { ...font('sans', 500), fontSize: 14.5, lineHeight: 21.025, color: C.muted, textAlign: 'center' },
  // .in-visual: flex 1, min-height 270, margin 6 20 0
  visual: { flex: 1, minHeight: 270, marginTop: 6, marginHorizontal: 20 },
  // .in-copy: padding 8 20 0; .in-toc: border-top 1px --rule
  copy: { paddingTop: 8, paddingHorizontal: 20 },
  toc: { borderTopWidth: 1, borderTopColor: C.rule },
  li: { borderBottomWidth: 1, borderBottomColor: C.rule, paddingTop: 10, paddingLeft: 44 },
  // .in-toc .n: absolute, left 0, Inter Tight 700, -.03em
  n: { position: 'absolute', left: 0, ...font('serif', 700) },
  // .in-toc .t: Inter 600 12.5px, .16em, uppercase; an inline span: its line box is the li's 22.475px
  t: { ...font('sans', 600), fontSize: 12.5, lineHeight: 22.475, letterSpacing: 2, textTransform: 'uppercase' },
  d: { overflow: 'hidden' },
  dIn: { position: 'absolute', left: 0, right: 0, top: 0 },
  // .in-toc .d h3: Inter Tight 700 22px / 25.3px, -0.55px, margin-bottom 6
  h3: { ...font('serif', 700), fontSize: 22, lineHeight: 25.3, letterSpacing: -0.55, color: C.ink, marginBottom: 6 },
  // .in-toc .d p: 14.5px / 21.025px, --ink-2
  p: { fontSize: 14.5, lineHeight: 21.025, color: C.ink2 },
  // .in-foot: row, gap 10, padding 16 20 max(20px, --sab)
  foot: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16, paddingHorizontal: 20, paddingBottom: 20 },
  // .in-back: 46, radius 12, 1px --rule-2
  back: { width: 46, height: 46, borderRadius: 12, borderWidth: 1, borderColor: C.rule2, alignItems: 'center', justifyContent: 'center' },
  next: { flex: 1 },
});

export default IntroStage;
