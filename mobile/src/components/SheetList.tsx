// Source: PrepAssist.html L2826-L2830 (.sh-list .it, .ti, div, b, small)
// The list of rows used inside sheets (language, all tools, payments, revisions, search results).
// Computed (reference/android/sheet-language, sheet-allTools, sheet-payments):
//   .it     row, centred, gap 12px; padding 13px 0; border-bottom 1px solid --rule; full width
//   .ti     38 x 38 tile, radius 10px, 1px solid --rule on --sheet, content centred (icon 20px, stroke = the
//           tile's text colour: --ink unless the markup sets an inline colour)
//   div     flex 1: `b` title Inter 600 14.5px / 21.025px as a block; `small` subtitle 12.5px --muted, an inline
//           box in a 22.475px line (the div is 43.48px high = 21.02 + 22.475)
//   after   whatever the markup puts last: ic('chev'), or a `<b style="flex:none;font-size:14.5px">` amount
// A Hindi title carries class `hi` (Noto Sans Devanagari 600 14.5px / 23.2px): pass it as titleStyle.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { IconName } from '../icons/iconPaths.generated';
import { font } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { Icon } from './Icon';

const C = palettes.free;
const styles = StyleSheet.create({
  it: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.rule },
  ti: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: C.rule, backgroundColor: C.sheet, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, minWidth: 0 },
  b: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025 },
  // `small` is inline: its line box takes the parent's line-height (22.475px), not its own 18.125px
  small: { fontSize: 12.5, lineHeight: 22.475, color: C.muted },
});

/** `.sh-list`: a plain block; the rows carry all the styling. */
export function SheetList({ children, style }: { children?: React.ReactNode; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return <View style={style}>{children}</View>;
}

export interface SheetListItemProps {
  /** `<b>` */
  title: string;
  /** `<small>` */
  subtitle?: string;
  /**
   * The `.ti` tile: an icon name, `null` for an EMPTY tile (the unselected language row), or
   * undefined for no tile at all.
   */
  icon?: IconName | null;
  /** Inline colour of the tile (`style="color:…"`): the icon's stroke. Default --ink. */
  iconColor?: string;
  /** Last child of the row: `<Icon name="chev" />`, an amount, … */
  after?: React.ReactNode;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** `.sh-list .it` */
export function SheetListItem({ title, subtitle, icon, iconColor = C.ink, after, onPress, titleStyle, style, testID }: SheetListItemProps): React.JSX.Element {
  return (
    <Pressable style={[styles.it, style]} onPress={onPress} accessibilityRole="button" testID={testID}>
      {icon !== undefined ? <View style={styles.ti}>{icon ? <Icon name={icon} color={iconColor} /> : null}</View> : null}
      <View style={styles.body}>
        <Txt style={[styles.b, titleStyle]}>{title}</Txt>
        {subtitle !== undefined ? <Txt style={styles.small}>{subtitle}</Txt> : null}
      </View>
      {after}
    </Pressable>
  );
}
