// Source: PrepAssist.html L6527-L6532 (VIEWS.courses), L96 (.chips), L2503-L2509 (.course-list, .crs, .sp, ::after, h4, p)
// Computed (reference/android/view-courses):
//   .chips        row, no wrap, horizontal scroll, gap 8px, padding 0 20px, margin-bottom 8px (inline)
//   .course-list  padding 0 20px
//   .crs          grid 44px 1fr auto, gap 14px, centred; padding 14px 0; border-bottom 1px --rule
//     .sp         44 x 58, radius 2 5 5 2, background --c, box-shadow 2px 2px 0 --rule-2;
//                 ::after 1px rgba(255,255,255,.3) at left 4px, full height
//     h4          Inter (--read) 600 15.5px / 18.6px, ls -0.155px  ·  p 12.5px / 18.125px --muted, margin-top 3px
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { ChipGroup, Icon } from '../../components';
import { COURSES, MORE_COURSES, SUBJ } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { cssColor, font, palettes, Txt, useTheme } from '../../theme';
import { HeroTitle, pageStyles } from './pages/PageParts';

const C = palettes.free;

const styles = StyleSheet.create({
  chips: { flexGrow: 0, marginBottom: 8 },
  chipsIn: { flexDirection: 'row', gap: 8, paddingHorizontal: 20 },
  list: { paddingHorizontal: 20 },
  crs: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.rule },
  sp: { width: 44, height: 58, borderTopLeftRadius: 2, borderTopRightRadius: 5, borderBottomRightRadius: 5, borderBottomLeftRadius: 2, boxShadow: `2px 2px 0px 0px ${C.rule2}` },
  spAfter: { position: 'absolute', left: 4, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  body: { flex: 1, minWidth: 0 },
  h4: { ...font('read', 600), fontSize: 15.5, lineHeight: 18.6, letterSpacing: -0.155 },
  p: { fontSize: 12.5, lineHeight: 18.125, color: C.muted, marginTop: 3 },
});

const CHIPS = ['All', 'GS I', 'GS II', 'GS III', 'GS IV', 'CSAT', 'Optional'];

/** L6530: COURSES as rows, then MORE_COURSES */
const ROWS = [...COURSES.map(c => ({ s: c.s, t: c.t, m: c.l + ' lectures · ' + c.p + '%', id: c.id as string | undefined })), ...MORE_COURSES.map(c => ({ s: c.s, t: c.t, m: c.m, id: undefined }))];

function CoursesScreen(_: ViewProps): React.JSX.Element {
  const t = useTheme();
  return (
    <View>
      <View style={pageStyles.hero}>
        <HeroTitle title="Courses & Lectures" />
        <Txt style={pageStyles.p}>Every GS subject, CSAT, optional and answer writing — organised by the syllabus.</Txt>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips} contentContainerStyle={styles.chipsIn}>
        <ChipGroup items={CHIPS} mode="one" initial={[0]} testID="courses.chip" />
      </ScrollView>
      <View style={styles.list}>
        {ROWS.map((c, i) => (
          <Pressable
            key={i}
            style={styles.crs}
            onPress={() => act(c.id ? (c.id === 'c1' ? 'push:lesson' : 'push:course:' + c.id) : 'toast:Course preview would open here')}
            accessibilityRole="button"
            testID={`courses.crs.${i}`}>
            <View style={[styles.sp, { backgroundColor: cssColor(SUBJ[c.s].c, t) }]}>
              <View style={styles.spAfter} />
            </View>
            <View style={styles.body}>
              <Txt style={styles.h4}>{c.t}</Txt>
              <Txt style={styles.p}>{c.m}</Txt>
            </View>
            <Icon name="chev" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const view: ViewDef = {
  useTitle: () => 'Courses & Lectures',
  Screen: CoursesScreen,
};

export default view;
