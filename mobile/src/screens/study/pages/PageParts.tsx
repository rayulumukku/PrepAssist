// Source: PrepAssist.html L2478-L2480 (.pg-hero, h1, p), L101 (.sec), L105-L106 (.sec-label, ::after), L2958-L2963 (.lec, .n, .dn, .cur, b, small)
// Private copies (study area, pages group) of classes several views share: .pg-hero, .sec, .sec-label, .lec.
// Computed (reference/android/view-lesson, view-course, view-courses):
//   .pg-hero     padding 8px 20px 18px (lesson: inline padding-top 18px)
//     h1         EB Garamond 500 28px / 30.8px, letter-spacing -0.28px, --ds-ink (#14161C)
//     p          Inter 400 13.5px / 20.25px, --ds-muted (#7A8494), margin-top 8px
//   .sec         padding 0 20px
//   .sec-label   row, centred, gap 10px; margin 0 20px 12px; Inter 600 10.5px / 15.225px, ls 1.68px, uppercase,
//                --muted; ::after flex 1, 1px, --rule
//   .lec         grid 28px 1fr auto, gap 10px, centred; padding 12px 0; border-bottom 1px --rule
//     .n         26 x 26 round, 1px --rule-2, Inter 700 11.5px / 16.675px, --muted
//     .dn .n     background and border --brand, ic('check') #fff  ·  .cur .n  background and border --accent, #fff
//     b          Inter (--read) 600 14.5px / 21.025px, block  ·  small 12.5px --muted, inline in a 22.475px line
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Icon } from '../../../components';
import { font, palettes, Txt, useTheme } from '../../../theme';

const C = palettes.free;

export const pageStyles = StyleSheet.create({
  hero: { paddingTop: 8, paddingHorizontal: 20, paddingBottom: 18 },
  h1: { ...font('book', 500), fontSize: 28, lineHeight: 30.8, letterSpacing: -0.28, color: C.dsInk },
  p: { fontSize: 13.5, lineHeight: 20.25, color: C.dsMuted, marginTop: 8 },
  sec: { paddingHorizontal: 20 },
  secLabel: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 12 },
  secLabelT: { ...font('sans', 600), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', color: C.muted },
  secLabelAfter: { flex: 1, height: 1, backgroundColor: C.rule },
  lec: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.rule },
  nCol: { width: 28 },
  n: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: C.rule2, alignItems: 'center', justifyContent: 'center' },
  nT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: C.muted },
  body: { flex: 1, minWidth: 0 },
  b: { ...font('read', 600), fontSize: 14.5, lineHeight: 21.025 },
  small: { fontSize: 12.5, lineHeight: 22.475, color: C.muted },
  white: { color: '#FFFFFF' },
  mt8: { marginTop: 8 },
});

/** `.tag .sw` as computed: the unrelated auth rule `.sw` (L924) adds margin-top 12px and colour #7A7262. */
export const swatchFix = { marginTop: 12, backgroundColor: '#7A7262' };

/** `<div class="sec-label">` */
export function SecLabel({ children, style }: { children: string; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return (
    <View style={[pageStyles.secLabel, style]}>
      <Txt style={pageStyles.secLabelT}>{children}</Txt>
      <View style={pageStyles.secLabelAfter} />
    </View>
  );
}

/** `<h1>` + `<p>` of `.pg-hero` (the hero box itself is a View with pageStyles.hero). */
export function HeroTitle({ title, style }: { title: string; style?: StyleProp<TextStyle> }): React.JSX.Element {
  return <Txt style={[pageStyles.h1, style]}>{title}</Txt>;
}

export interface LecProps {
  /** the number shown in `.n` when not done */
  n: number;
  /** '' | 'dn' | 'cur' */
  state: '' | 'dn' | 'cur';
  title: string;
  sub: string;
  onPress: () => void;
  testID?: string;
}

/** `<div class="lec …"><span class="n">…</span><div><b/><small/></div>${ic('chev')}</div>` */
export function Lec({ n, state, title, sub, onPress, testID }: LecProps): React.JSX.Element {
  const t = useTheme();
  const fill = state === 'dn' ? t.brand : state === 'cur' ? t.accent : null;
  return (
    <Pressable style={pageStyles.lec} onPress={onPress} accessibilityRole="button" testID={testID}>
      <View style={pageStyles.nCol}>
        <View style={[pageStyles.n, fill ? { backgroundColor: fill, borderColor: fill } : null]}>
          {state === 'dn' ? <Icon name="check" color="#FFFFFF" /> : <Txt style={[pageStyles.nT, fill ? pageStyles.white : null]}>{String(n)}</Txt>}
        </View>
      </View>
      <View style={pageStyles.body}>
        <Txt style={pageStyles.b}>{title}</Txt>
        <Txt style={pageStyles.small}>{sub}</Txt>
      </View>
      <Icon name="chev" />
    </Pressable>
  );
}
