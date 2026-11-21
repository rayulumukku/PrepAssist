// Source: PrepAssist.html L4059-L4064 (.ch2), L9350-L9351 (ds overrides)
// PRIVATE COPY of the shared-in-HTML `.ch2` pill row (see CONTRACT.md section 4). Computed
// (reference/android view-answerbank .ch2): horizontal scroller, margin 12 -20 0, padding 0 20 2, gap 8;
// button height 34, padding 0 14, pill, #fff with 0 0 0 1px #E1E8F0, Inter 600 12.5px / 18.125px #3A404B,
// one line; .on #14161C, text #fff, no shadow; `transition: all .2s`.
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { act } from '../../../actions';
import { font, Txt } from '../../../theme';

const s = StyleSheet.create({
  row: { marginTop: 12, marginHorizontal: -20, flexGrow: 0 },
  content: { gap: 8, paddingHorizontal: 20, paddingBottom: 2 },
  b: { height: 34, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E1E8F0', justifyContent: 'center' },
  on: { backgroundColor: '#14161C', boxShadow: 'none' },
  t: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B', textAlign: 'center' },
});

export function Ch2({ items }: { items: { label: string; act: string; on: boolean }[] }): React.JSX.Element {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.row} contentContainerStyle={s.content}>
      {items.map(it => (
        <Pressable key={it.act} style={[s.b, it.on && s.on]} onPress={() => act(it.act)} testID={`ch2.${it.act}`}>
          <Txt style={[s.t, it.on && { color: '#FFFFFF' }]} numberOfLines={1}>
            {it.label}
          </Txt>
        </Pressable>
      ))}
    </ScrollView>
  );
}
