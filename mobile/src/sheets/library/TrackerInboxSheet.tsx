// Source: PrepAssist.html L10611-L10612 (A.ntInbox)
// Source: PrepAssist.html L10183-L10189 (.n2-inl, .n2-pk), L10150 (.n2-shp)
// Computed (reference/android/sheet-tracker-inbox):
//   p.n2-shp   13 / 19.5 #6B7380, margin 0 0 12 (inline margin-top:0)
//   .n2-inl    one column, gap 8
//   .n2-pk     padding 12, radius 14, white, ring #E8ECF2, gap 10; i 4 wide bar fc radius 2 (stretches);
//              b 14 / 20.3 600 #14161C nowrap ellipsis; small 11.5 fc (inline in a 22.475 line); em 11.5px 700 padding 4 9 pill #ECF8F1 #1F8A55
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { SheetFrame } from '../../components';
import type { SheetProps } from '../../navigation/routes';
import { allNotes, foldKey } from '../../screens/library/tracker/nt';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';

function TrackerInboxSheet(_: SheetProps): React.JSX.Element {
  const NT = useStore(s => s.NT);
  const FOLDERS = useStore(s => s.FOLDERS);
  const l = allNotes({ NT })
    .filter(n => n.ups.length)
    .sort((a, b) => b.ups.length - a.ups.length);
  return (
    <SheetFrame title="Updates waiting" testID="trackerInbox">
      <Txt style={s.shp}>{`New material matched to ${l.length} of your notes. Open one to review it.`}</Txt>
      <View style={s.inl}>
        {l.map(n => {
          const F = foldKey(n.s, { FOLDERS });
          return (
            <Pressable key={n.id} style={s.pk} onPress={() => act('ntUps', n.id)} testID={`trackerInbox.${n.id}`}>
              <View style={[s.bar, { backgroundColor: F[1] }]} />
              <View style={s.d}>
                <Txt style={s.b} numberOfLines={1}>
                  {n.t}
                </Txt>
                <Txt style={[s.small, { color: F[1] }]}>{F[0]}</Txt>
              </View>
              <View style={s.em}>
                <Txt style={s.emTx}>{`${n.ups.length} new`}</Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  shp: { fontSize: 13, lineHeight: 19.5, color: '#6B7380', marginBottom: 12 },
  inl: { gap: 8 },
  pk: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E8ECF2' },
  bar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
  d: { flex: 1, minWidth: 0 },
  b: { ...font('sans', 600), fontSize: 14, lineHeight: 20.3, color: '#14161C' },
  small: { fontSize: 11.5, lineHeight: 22.475 },
  em: { flexShrink: 0, paddingVertical: 4, paddingHorizontal: 9, borderRadius: 999, backgroundColor: '#ECF8F1' },
  emTx: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#1F8A55' },
});

export default TrackerInboxSheet;
