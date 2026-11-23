// Source: PrepAssist.html L6521-L6526 (VIEWS.course), L2338-L2341 (.nu-prog, .track, i, span)
// One course: hero with progress and Resume, then its 8 lectures. Computed (reference/android/view-course, arg c2):
//   .nu-prog   row, centred, gap 10px, margin-top 14px (inline)
//     .track   flex 1, 4px, radius 2, --paper-3, overflow hidden; i = c.p %, radius 2, --brand (final colour rule)
//     span     Inter 600 12.5px / 18.125px, tabular numbers
//   .btn-ink.btn-sm margin-top 16px (inline). The rest: pages/PageParts.tsx.
// The fill has `transition: width 1.2s .3s` but its width is in the markup from the start: nothing moves.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn, Tag } from '../../components';
import { COURSES, SUBJ } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { cssColor, font, palettes, Txt, useTheme } from '../../theme';
import { HeroTitle, Lec, pageStyles, swatchFix } from './pages/PageParts';

const C = palettes.free;

const styles = StyleSheet.create({
  btn: { marginTop: 16 },
  prog: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.paper3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  span: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, fontVariant: ['tabular-nums'] },
});

const course = (id: string | undefined) => COURSES.find(x => x.id === id);

function CourseScreen({ arg }: ViewProps): React.JSX.Element | null {
  const t = useTheme();
  const c = course(arg);
  if (!c) return null; // VIEWS.course(id) throws for an unknown id in the HTML: nothing is rendered
  const sj = SUBJ[c.s];
  const col = cssColor(sj.c, t);
  return (
    <View>
      <View style={pageStyles.hero}>
        <Tag color={col} swatch swatchStyle={swatchFix}>
          {sj.n}
        </Tag>
        <HeroTitle title={c.t} style={pageStyles.mt8} />
        <Txt style={pageStyles.p}>{`${c.l} lectures · ${c.p}% complete · Last: ${c.last}`}</Txt>
        <View style={styles.prog}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${c.p}%`, backgroundColor: t.brand }]} />
          </View>
          <Txt style={styles.span}>{`${c.p}%`}</Txt>
        </View>
        <Btn variant="ink" small icon="play" label="Resume" style={styles.btn} onPress={() => act(`toast:Resuming ${c.last}`)} testID="course.resume" />
      </View>
      <View style={pageStyles.sec}>
        {Array.from({ length: 8 }, (_, i) => {
          const n = i + 1;
          const d = (n / 8) * 100 <= c.p;
          return (
            <Lec
              key={i}
              n={n}
              state={d ? 'dn' : ''}
              title={`Lecture ${n}`}
              sub={`${40 + ((i * 7) % 25)} min`}
              onPress={() => act(`toast:Lecture ${n} would open here`)}
              testID={`course.lec.${i}`}
            />
          );
        })}
      </View>
    </View>
  );
}

const view: ViewDef = {
  useTitle: arg => course(arg)?.t ?? '',
  Screen: CourseScreen,
};

export default view;
