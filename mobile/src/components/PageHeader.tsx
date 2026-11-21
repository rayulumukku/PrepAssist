// Source: PrepAssist.html L2474-L2477 (.ph, .ph .bk, .ph .ttl, .ph .act), L6472-L6472 (pageShell), L9344-L9345 (ds-handoff sizes)
// The standard page header: back button, title, action slot.
// Computed (reference/android/view-lesson): 412 x 60; padding 12px 14px 10px (top is max(12px, --sat));
// gap 10px; background rgba(255,255,255,.92) + backdrop blur 10px (rgba(245,247,250,.92) on .me-page
// views, L3352). .bk 38 x 38, border 1px --rule-2, background --sheet, round, back icon 20 px in --ink.
// .ttl Inter 600 14.5px / 21.025px, one line with ellipsis. .act 38 x 38 slot.
// The header is `position:sticky;top:0` as the first child of the page scroller, so it is always
// pinned; the shell draws it above the scroll view and pads the content by `pageHeaderHeight(sat)`.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Backdrop } from './Backdrop';
import { font } from '../theme/fonts';
import { palettes } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { Icon } from './Icon';

export interface PageHeaderProps {
  /** v.title */
  title: string;
  /** data-act="back" */
  onBack: () => void;
  /** v.action: the element at the right. Default: the empty `<span class="act">` spacer. */
  action?: React.ReactNode;
  /** .ph background (VIEW_META[id].phBg). */
  bg: string;
  /** --sat */
  sat: number;
  /** testID prefix: `<screen>.back`, `<screen>.title`. */
  testID?: string;
}

/** padding-top max(12px, --sat) + 38 + padding-bottom 10. */
export const pageHeaderHeight = (sat: number): number => Math.max(12, sat) + 48;

const styles = StyleSheet.create({
  ph: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  bk: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: palettes.free.rule2,
    backgroundColor: palettes.free.sheet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ttl: {
    flex: 1,
    minWidth: 0,
    ...font('sans', 600),
    fontSize: 14.5,
    lineHeight: 21.025,
  },
  act: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function PageHeader({ title, onBack, action, bg, sat, testID }: PageHeaderProps): React.JSX.Element {
  return (
    <View style={styles.ph} testID={testID ? `${testID}.header` : undefined}>
      <Backdrop px={10} tint={bg} />
      <View style={[styles.row, { paddingTop: Math.max(12, sat) }]}>
        <Pressable
          style={styles.bk}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          testID={testID ? `${testID}.back` : undefined}>
          <Icon name="back" />
        </Pressable>
        <Txt style={styles.ttl} numberOfLines={1} ellipsizeMode="tail" testID={testID ? `${testID}.title` : undefined}>
          {title}
        </Txt>
        {action ?? <View style={styles.act} />}
      </View>
    </View>
  );
}

/** Style of the `.ph .act` slot (38 x 38, round, centred) for a view's own Action button. */
export const pageHeaderActStyle = styles.act;
