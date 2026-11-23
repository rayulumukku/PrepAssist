// Source: PrepAssist.html L6510-L6520 (VIEWS.lesson)
// Lecture page: player, hero with actions, chapter lectures, the note taken in this lecture.
// Computed (reference/android/view-lesson): see pages/PageParts.tsx (.pg-hero, .sec-label, .lec),
// pages/LessonVideo.tsx (.video) and the `.nt` card below:
//   .nt   (inline width 100%, height auto, no transform) padding 12px 12px 10px, 1px --rule-2, radius 3, #fff,
//         box-shadow 0 10px 20px -16px rgba(0,0,0,.4), ruled background (pages/RuledLines.tsx)
//     .k  Inter 700 10.5px / 15.225px, ls 1.26px, uppercase, --c (--polity)
//     h5  Inter (--read) 500 15.5px / 18.6px, margin-top 6px
//     p   Caveat 400 (-> 500 face) 18px / 22px, #0F5E99, margin-top 2px
// The `.tag .sw` square is restyled by the unrelated auth rule `.sw` (L924): margin-top 12px and colour #7A7262.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn, Tag } from '../../components';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { cssColor, font, palettes, Txt, useTheme } from '../../theme';
import { LessonVideo } from './pages/LessonVideo';
import { HeroTitle, Lec, pageStyles, SecLabel, swatchFix } from './pages/PageParts';
import { RuledLines } from './pages/RuledLines';

const C = palettes.free;

/** L6516: [title, length, state] */
const LECS: readonly (readonly [string, string, '' | 'dn' | 'cur'])[] = [
  ['Articles 12–13 · State & laws', '42 min', 'dn'],
  ['Right to Equality · Art. 14–18', '55 min', 'dn'],
  ['Right to Freedom · Art. 19–22', '61 min', 'dn'],
  ['Constitutional Remedies · Art. 32', '49 min · 65%', 'cur'],
  ['Saving of certain laws · Art. 31A–C', '38 min', ''],
  ['PYQ discussion · 2013–2025', '44 min', ''],
];

const styles = StyleSheet.create({
  hero: { paddingTop: 18 },
  mt26: { marginTop: 26 },
  btns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  nt: {
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: C.rule2,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 20px -16px rgba(0, 0, 0, 0.4)',
  },
  k: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase' },
  h5: { ...font('read', 500), fontSize: 15.5, lineHeight: 18.6, marginTop: 6 },
  p: { ...font('hand', 400), fontSize: 18, lineHeight: 22, color: '#0F5E99', marginTop: 2 },
});

function LessonScreen(_: ViewProps): React.JSX.Element {
  const t = useTheme();
  const polity = cssColor('var(--polity)', t);
  return (
    <View>
      <LessonVideo />
      <View style={[pageStyles.hero, styles.hero]}>
        <Tag color={polity} swatch swatchStyle={swatchFix}>
          Fundamental Rights · Lecture 4 of 6
        </Tag>
        <HeroTitle title="Right to Constitutional Remedies" style={pageStyles.mt8} />
        <Txt style={pageStyles.p}>Article 32, the five writs, and how the Supreme Court expanded access through PIL. With Prof. Meera Iyer.</Txt>
        <View style={styles.btns}>
          <Btn variant="ink" small icon="play" label="Resume" onPress={() => act('toast:Resuming at 31:42')} testID="lesson.resume" />
          <Btn variant="line" small icon="mindmap" label="Mindmap" onPress={() => act('push:mindmap')} testID="lesson.mindmap" />
          <Btn variant="line" small icon="test" label="5-question check" onPress={() => act('quiz')} testID="lesson.quiz" />
        </View>
      </View>
      <SecLabel>In this chapter</SecLabel>
      <View style={pageStyles.sec}>
        {LECS.map((l, i) => (
          <Lec
            key={i}
            n={i + 1}
            state={l[2]}
            title={l[0]}
            sub={l[1]}
            onPress={() => act('toast:' + (l[2] === 'cur' ? 'You’re on this lecture' : 'Lecture would open here'))}
            testID={`lesson.lec.${i}`}
          />
        ))}
      </View>
      <SecLabel style={styles.mt26}>Your notes from this lecture</SecLabel>
      <View style={pageStyles.sec}>
        <Pressable style={styles.nt} onPress={() => act('push:note:n1')} accessibilityRole="button" testID="lesson.note">
          <RuledLines period={22} pos={34} height={600} radius={2} />
          <Txt style={[styles.k, { color: polity }]}>Polity · 2 h ago</Txt>
          <Txt style={styles.h5}>Fundamental Rights — Art. 12–35</Txt>
          <Txt style={styles.p}>Art 32 → SC only for FRs. Art 226 → HC, FRs + “any other purpose” (wider!). Ambedkar: heart & soul. Suspended under Art 359 except 20, 21.</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const view: ViewDef = {
  useTitle: () => 'Indian Polity · Lecture 4',
  Screen: LessonScreen,
};

export default view;
