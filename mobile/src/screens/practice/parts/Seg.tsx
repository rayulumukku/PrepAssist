// Source: PrepAssist.html L4054-L4058 (.sg2), L3673-L3676 (.cx-seg), L9354-L9355 (ds overrides)
// PRIVATE COPY of the shared-in-HTML segmented controls `.sg2` and `.cx-seg` (see CONTRACT.md section 4).
// Computed (reference/android view-mains .sg2 / .mv-lim, view-testquiz .sg2.sm, view-answerbank .cx-seg):
//   box      padding 4, radius 14, #E9EEF4; equal columns
//   button   height 36, radius 10, row centred; gap 7 (.sg2) / 3 (.cx-seg); Inter 600 13.5px / 19.575px #5B6472
//   .on      #fff, text #14161C, box-shadow 0 2px 8px -3px rgba(20,30,50,.25); `transition: all .2s`
//   .sg2 svg.ic 17 x 17
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { act } from '../../../actions';
import { Icon } from '../../../components';
import type { IconName } from '../../../icons/iconPaths.generated';
import { font, Txt } from '../../../theme';

const s = StyleSheet.create({
  box: { flexDirection: 'row', padding: 4, borderRadius: 14, backgroundColor: '#E9EEF4' },
  btn: { flex: 1, height: 36, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: '#FFFFFF', boxShadow: '0px 2px 8px -3px rgba(20, 30, 50, 0.25)' },
  t: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#5B6472', textAlign: 'center' },
});

export interface SegItem {
  label: string;
  act: string;
  on: boolean;
  icon?: IconName;
  /** systemDevanagari etc. are not needed: labels are Inter (--sans) */
  testID?: string;
}

export function Seg({ items, kind, style }: { items: SegItem[]; kind: 'sg2' | 'cx'; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return (
    <View style={[s.box, style]} accessibilityRole="tablist">
      {items.map(it => {
        const c = it.on ? '#14161C' : '#5B6472';
        return (
          <Pressable key={it.act} style={[s.btn, { gap: kind === 'sg2' ? 7 : 3 }, it.on && s.on]} onPress={() => act(it.act)} testID={it.testID}>
            {it.icon ? <Icon name={it.icon} size={17} color={c} /> : null}
            <Txt style={[s.t, { color: c }]}>{it.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
