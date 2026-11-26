// Source: PrepAssist.html L6916-L6916 (sheetFrame), L2821-L2825 (.sh-grab, .sh-head, .sh-body), L2979-L2979 (.sh-head h3 weight and tracking)
// The standard sheet content: grab handle, head with title and close button, scrolling body.
// Computed (reference/android/sheet-language):
//   .sh-grab  38 x 4, radius 2, --rule-2, margin 10px auto 2px. Decorative: it does nothing in the HTML.
//   .sh-head  padding 8px 20px 10px, row, space-between, centred -> 56 px tall
//   h3        Inter Tight 700 22px / 31.9px, letter-spacing -0.55px (-.025em)
//   .circ     close button, data-act="closeSheet"
//   .sh-body  padding 0 20px max(24px, --sab), scrolls when the sheet reaches its max height
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { closeSheet } from '../navigation/nav';
import { font } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { useInsets } from '../theme/useTheme';
import { Circ } from './Circ';

export interface SheetFrameProps {
  title: string;
  children?: React.ReactNode;
  /** data-act="closeSheet" on the close button. Default closeSheet(). */
  onClose?: () => void;
  /** .sh-grab colour when a rule overrides it (#sheet:has(.x4s) .sh-grab, L9683). Default --rule-2. */
  grabColor?: string;
  /** Extra style for the .sh-body content (inline `style=""` overrides in the HTML). */
  bodyStyle?: StyleProp<ViewStyle>;
  /** Extra props for the body scroller (keyboardShouldPersistTaps, ref …). */
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle' | 'style'>;
  /** testID prefix: `<sheet>.close`, `<sheet>.title`, `<sheet>.body`. */
  testID?: string;
}

const styles = StyleSheet.create({
  grab: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: palettes.free.rule2,
    marginTop: 10,
    marginBottom: 2,
    alignSelf: 'center',
    flexShrink: 0,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexShrink: 0,
  },
  h3: {
    ...font('serif', 700),
    fontSize: 22,
    lineHeight: 31.9,
    letterSpacing: -0.55,
  },
  body: {
    flexGrow: 0,
    flexShrink: 1,
  },
  bodyContent: {
    paddingHorizontal: 20,
  },
});

/** `<div class="sh-grab"></div>` on its own, for sheets that build their own head (mentor, purchase …). */
export function SheetGrab({ color }: { color?: string }): React.JSX.Element {
  return <View style={[styles.grab, color ? { backgroundColor: color } : null]} />;
}

export function SheetFrame({
  title,
  children,
  onClose = closeSheet,
  grabColor,
  bodyStyle,
  scrollProps,
  testID,
}: SheetFrameProps): React.JSX.Element {
  const { sab } = useInsets();
  return (
    <>
      <SheetGrab color={grabColor} />
      <View style={styles.head}>
        <Txt style={styles.h3} testID={testID ? `${testID}.title` : undefined}>
          {title}
        </Txt>
        <Circ icon="close" label="Close" onPress={onClose} testID={testID ? `${testID}.close` : undefined} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...scrollProps}
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, { paddingBottom: sab ? sab + 14 : 24 }, bodyStyle]}
        testID={testID ? `${testID}.body` : undefined}>
        {children}
      </ScrollView>
    </>
  );
}
