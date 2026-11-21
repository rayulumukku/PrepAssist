// Source: PrepAssist.html L6551-L6560 (VIEWS.mindmap, kept as _mmView L8010), L6666-L6677 (mindmapSVG), L6678-L6685 (MM_NOTES), L7028 (A.mm), L8011-L8022 (VIEWS.mindmap(t)), L2923-L2924 (.mm), L2944-L2946 (.xr-pop), L2255 (@keyframes tabIn), L80 (.eyebrow)
// Computed (reference/android/view-mindmap, -topic, -branch, -generated):
//   .sec        padding 0 20
//   .eyebrow    inline in a 22.475px line (glyph box 6px below the line top)
//   h1.display  EB Garamond 500 28px / 30.8px, -0.28px, #14161C, margin 6 0 14
//   .mm         #fff, 1px --rule, radius 14, overflow hidden; svg 100 % wide, viewBox 360 x 400 (370 x 411.11)
//   p           12.5px / 18.125px --muted, margin-top 10
//   #mmNote     .xr-pop.on with inline overrides: #fff, --ink, 1px --rule-2; margin-top 12, padding 14, radius 12,
//               13.5px / 20.25px; b block Inter 700 10.5px / 15.75px, 1.47px, uppercase, --polity (inline), margin-bottom 4;
//               animation tabIn .3s ease (opacity 0 -> 1, translateY 6 -> 0), restarted by A.mm
//   buttons     row, gap 8, margin-top 14 (the topic map's row wraps)
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { act } from '../../actions';
import { Btn, Eyebrow, Icon, pageHeaderActStyle } from '../../components';
import { INLINE_mindmapSVG_L6667, MM_NOTES } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { easeCss } from '../../shell/anim';
import { useStore } from '../../store';
import { font, palettes, Txt } from '../../theme';
import { isFrMap, mmCentre, MM_TOPIC_BRANCHES, MM_TOPIC_COLOURS, MM_TOPIC_POS } from './maps/mapsLogic';

const C = palettes.free;
const INTER = font('sans', 400).fontFamily;
const INTER_600 = font('sans', 600).fontFamily;
const INTER_700 = font('sans', 700).fontFamily;

const styles = StyleSheet.create({
  sec: { paddingHorizontal: 20 },
  ebLine: { height: 22.475 },
  eb: { marginTop: 4.9 },
  h1: { ...font('book', 500), fontSize: 28, lineHeight: 30.8, letterSpacing: -0.28, color: '#14161C', marginTop: 6, marginBottom: 14 },
  mm: { backgroundColor: C.sheet, borderWidth: 1, borderColor: C.rule, borderRadius: 14, overflow: 'hidden' },
  p: { fontSize: 12.5, lineHeight: 18.125, color: C.muted, marginTop: 10 },
  note: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: C.sheet,
    borderWidth: 1,
    borderColor: C.rule2,
  },
  noteT: { fontSize: 13.5, lineHeight: 20.25, color: C.ink },
  noteB: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.75, letterSpacing: 1.47, textTransform: 'uppercase', color: C.polity, marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8, marginTop: 14 },
  wrap: { flexWrap: 'wrap' },
});

/** The 360 x 400 map scaled to the box width (`.mm svg{width:100%}`). */
function MapSvg({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [w, setW] = useState(0);
  return (
    <View style={styles.mm} onLayout={e => setW(e.nativeEvent.layout.width - 2)}>
      {w > 0 ? (
        <Svg width={w} height={(w * 400) / 360} viewBox="0 0 360 400">
          {children}
        </Svg>
      ) : null}
    </View>
  );
}

/** mindmapSVG() (L6666-L6677) */
function FrMap(): React.JSX.Element {
  const br = INLINE_mindmapSVG_L6667;
  return (
    <MapSvg>
      {br.map(b => (
        <Path key={`p${b[0]}`} d={`M180 200 C${(180 + b[2]) / 2} 200 ${(180 + b[2]) / 2} ${b[3]} ${b[2]} ${b[3]}`} fill="none" stroke={b[4]} strokeWidth={2} opacity={0.55} />
      ))}
      <Rect x={120} y={182} width={120} height={36} rx={8} fill="#1B8AD3" />
      <SvgText x={180} y={205} textAnchor="middle" fontSize={12} fontFamily={INTER_600} fill="#FFFFFF">
        Fundamental Rights
      </SvgText>
      {br.map((b, i) => (
        <G key={`g${b[0]}`} onPress={() => act('mm', String(i))}>
          <Rect x={b[2] - 58} y={b[3] - 20} width={116} height={40} rx={8} fill="#FFFFFF" stroke={b[4]} strokeWidth={1.4} />
          <SvgText x={b[2]} y={b[3] - 3} textAnchor="middle" fontSize={10.5} fontFamily={INTER_600} fill="#25272D">
            {b[0]}
          </SvgText>
          <SvgText x={b[2]} y={b[3] + 11} textAnchor="middle" fontSize={9.5} fontFamily={INTER} fill={b[4]}>
            {b[1]}
          </SvgText>
          {[0, 1, 5].includes(i) ? <Circle cx={b[2] + 52} cy={b[3] - 14} r={3.5} fill="#1B8AD3" /> : null}
        </G>
      ))}
      {['Habeas corpus', 'Mandamus', 'Prohibition', 'Certiorari', 'Quo warranto'].map((w, i) => (
        <SvgText key={w} x={210 + (i % 2) * 74} y={368 + Math.floor(i / 2) * 13} fontSize={9} fontFamily={INTER} fill="#1667B0">
          {`· ${w}`}
        </SvgText>
      ))}
    </MapSvg>
  );
}

/** The generated map of VIEWS.mindmap(t) (L8016-L8018) */
function TopicMap({ t }: { t: string }): React.JSX.Element {
  return (
    <MapSvg>
      {MM_TOPIC_POS.map((p, i) => (
        <Path key={`p${i}`} d={`M180 200 C${(180 + p[0]) / 2} 200 ${(180 + p[0]) / 2} ${p[1]} ${p[0]} ${p[1]}`} fill="none" stroke={MM_TOPIC_COLOURS[i]} strokeWidth={2} opacity={0.55} />
      ))}
      <Rect x={122} y={180} width={116} height={40} rx={10} fill="#0A97B8" />
      <SvgText x={180} y={205} textAnchor="middle" fontSize={11.5} fontFamily={INTER_700} fill="#fff">
        {mmCentre(t)}
      </SvgText>
      {MM_TOPIC_POS.map((p, i) => (
        <G key={`g${i}`}>
          <Rect x={p[0] - 56} y={p[1] - 20} width={112} height={40} rx={8} fill="#fff" stroke={MM_TOPIC_COLOURS[i]} strokeWidth={1.4} />
          <SvgText x={p[0]} y={p[1] - 3} textAnchor="middle" fontSize={11} fontFamily={INTER_700} fill="#25272D">
            {MM_TOPIC_BRANCHES[i][0]}
          </SvgText>
          <SvgText x={p[0]} y={p[1] + 11} textAnchor="middle" fontSize={9} fontFamily={INTER} fill={MM_TOPIC_COLOURS[i]}>
            {MM_TOPIC_BRANCHES[i][1]}
          </SvgText>
        </G>
      ))}
    </MapSvg>
  );
}

/** #mmNote: `.xr-pop.on` plays tabIn .3s each time it is (re)shown. */
function NotePop({ i }: { i: number }): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 300, easing: easeCss });
  }, [p]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: 6 * (1 - p.value) }] }));
  return (
    <Animated.View style={[styles.note, anim]} testID="mindmap.note">
      <Txt style={styles.noteB}>{MM_NOTES[i][0]}</Txt>
      <Txt style={styles.noteT}>{MM_NOTES[i][1]}</Txt>
    </Animated.View>
  );
}

function Head({ eyebrow, title }: { eyebrow: string; title: string }): React.JSX.Element {
  return (
    <>
      <View style={styles.ebLine}>
        <Eyebrow style={styles.eb}>{eyebrow}</Eyebrow>
      </View>
      <Txt style={styles.h1}>{title}</Txt>
    </>
  );
}

/** _mmView() (L6551-L6560) */
function FrMindmap(): React.JSX.Element {
  const pick = useStore(s => s.mmPick);
  // #mmNote starts with the Constitutional Remedies note; A.mm (store counter) replaces it and replays the animation
  const [base] = useState(pick.n);
  const picked = pick.n > base;
  return (
    <View style={styles.sec}>
      <Head eyebrow="Generated from Lecture 4 + your notes" title="Fundamental Rights" />
      <FrMap />
      <Txt style={styles.p}>Tap a branch to focus it. Nodes with a dot have PYQs.</Txt>
      <NotePop key={picked ? pick.n : 'init'} i={picked ? pick.i : 5} />
      <View style={styles.row}>
        <Btn variant="ink" small icon="test" label="Quiz me on this" onPress={() => act('quiz')} />
        <Btn variant="line" small icon="refresh" label="More detail" onPress={() => act('toast', 'Regenerating with more detail…')} />
      </View>
    </View>
  );
}

function TopicMindmap({ t }: { t: string }): React.JSX.Element {
  return (
    <View style={styles.sec}>
      <Head eyebrow="Generated just now · 6 branches" title={t} />
      <TopicMap t={t} />
      <Txt style={styles.p}>Each branch follows the UPSC answer frame. Ask the Mentor to expand any branch.</Txt>
      <View style={[styles.row, styles.wrap]}>
        <Btn variant="ink" small icon="test" label="Quiz me on this" onPress={() => act('quiz')} />
        <Btn variant="line" small icon="spark" label="Expand with Mentor" onPress={() => act('mentor')} />
      </View>
    </View>
  );
}

function MindmapScreen({ arg }: ViewProps): React.JSX.Element {
  return isFrMap(arg) ? <FrMindmap /> : <TopicMindmap t={arg as string} />;
}

/** v.action: `<button class="act" data-act="toast:…">${ic('bookmark')}</button>` */
function MindmapAction({ arg }: ViewProps): React.JSX.Element {
  const msg = isFrMap(arg) ? 'Mindmap saved to Notes' : 'Mindmap saved';
  return (
    <Pressable style={pageHeaderActStyle} onPress={() => act('toast', msg)} accessibilityRole="button" testID="mindmap.save">
      <Icon name="bookmark" />
    </Pressable>
  );
}

const view: ViewDef = {
  useTitle: () => 'AI Mindmap',
  Action: MindmapAction,
  Screen: MindmapScreen,
};

export default view;
