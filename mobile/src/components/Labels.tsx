// Source: PrepAssist.html L80-L80 (.eyebrow), L3071-L3071 (.eyebrow colour), L98-L99 (.tag, .tag .sw), L2974-L2974 (.fldlab), L2833-L2833 (.cmd-grp)
// Four small text labels the HTML shares across areas. Computed values (reference/android):
//   .eyebrow  (view-note)      Inter 600 10.5px / 15.225px, letter-spacing 1.68px (.16em), uppercase, --muted
//   .tag      (view-lesson)    row, centred, gap 5px; Inter 600 10.5px / 15.225px, letter-spacing .84px (.08em),
//                              uppercase, --muted unless an inline colour is set; optional `.sw` square
//                              7 x 7, radius 2, filled with the tag's colour
//   .fldlab   (sheet-prefs)    Inter 600 12.5px / 18.125px, --ink-2
//   .cmd-grp  (sheet-allTools) Inter 700 10.5px / 15.225px, letter-spacing 1.68px, uppercase, --muted, margin-top 16px
// Margins the HTML sets inline per use (`style="margin:18px 0 8px"`) go in `style`.
// Contextual rules not ported: .tp-head .eyebrow (L2484), .ca-mast .eyebrow (L2689), .ins.x .eyebrow (L3031),
// .hx-b .tag (L1334), and the unrelated auth rule `.sw` (L924) that also matches a .sw inside a tag.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { font } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';

const C = palettes.free;
const styles = StyleSheet.create({
  eyebrow: { ...font('sans', 600), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', color: C.muted },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  tagText: { ...font('sans', 600), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.84, textTransform: 'uppercase', color: C.muted },
  sw: { width: 7, height: 7, borderRadius: 2 },
  fldlab: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: C.ink2 },
  cmdGrp: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', color: C.muted, marginTop: 16 },
});

interface LabelProps {
  children: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/** `.eyebrow` */
export function Eyebrow({ children, style, testID }: LabelProps): React.JSX.Element {
  return (
    <Txt style={[styles.eyebrow, style]} testID={testID}>
      {children}
    </Txt>
  );
}

/** `.fldlab` */
export function FldLab({ children, style, testID }: LabelProps): React.JSX.Element {
  return (
    <Txt style={[styles.fldlab, style]} testID={testID}>
      {children}
    </Txt>
  );
}

/** `.cmd-grp` */
export function CmdGrp({ children, style, testID }: LabelProps): React.JSX.Element {
  return (
    <Txt style={[styles.cmdGrp, style]} testID={testID}>
      {children}
    </Txt>
  );
}

export interface TagProps {
  children: string;
  /** The inline `style="color:…"` of the tag; also fills the square. Default --muted. */
  color?: string;
  /** Draw the `<span class="sw">` square before the text. */
  swatch?: boolean;
  /** Extra style of the square (the HTML's unrelated `.sw` rule gives it margin-top 12px in view-lesson). */
  swatchStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/** `.tag` */
export function Tag({ children, color = C.muted, swatch, swatchStyle, style, textStyle, testID }: TagProps): React.JSX.Element {
  return (
    <View style={[styles.tag, style]} testID={testID}>
      {swatch ? <View style={[styles.sw, { backgroundColor: color }, swatchStyle]} /> : null}
      <Txt style={[styles.tagText, { color }, textStyle]}>{children}</Txt>
    </View>
  );
}
