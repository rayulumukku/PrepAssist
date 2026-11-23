// Source: PrepAssist.html L10479-L10487 (nCard)
// Source: PrepAssist.html L10286-L10299 (.n2-n, .n2-tp, .n2-nt, .n2-ups, .n2-ud, .n2-ul, .n2-ug, .n2-ok), L10110-L10112 (.n2-star), L10311-L10314
// Computed (reference/android/view-folder):
//   article.n2-n  padding 15 15 13, radius 20, white, ring 1px #E6EBF1, clips; ::after a 96 circle mix(fc 8%, transparent) at right -34 / top -34
//   .n2-tp        row, centred, gap 8: span 11.5px 700 fc with icon 13; small 11.5 #9AA3AF pushed right; star 30 circle, margin -6 -6 -6 0
//   .n2-nt        EB Garamond 500 19.5 / 23.79 #14161C, margin-top 8;  p 13 / 19.5 #6B7380, 2 lines, margin-top 5
//   .n2-ups       margin-top 12, padding 8, radius 14, #F0F9F3 + inset 1px #D4EEDD, gap 10: .n2-ud 32 box radius 10 #2FA562 13.5px 800;
//                 .n2-ul b 13 / 18.85 700 #1F6B3A, small 11 / 15.95 700 #5E8A6F nowrap ellipsis; .n2-ug 30 high, padding 0 11, radius 9
//   .n2-ok        margin-top 12, padding-top 11, border-top 1px #F0F2F6, 12px 600 #8A93A0, icon 14 #2FA562
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../../actions';
import { Icon } from '../../../components';
import { useStore } from '../../../store';
import { font, Txt } from '../../../theme';
import { alpha } from '../mix';
import { foldKey, srcNames } from './nt';
import type { NtNote } from './nt';

export function NoteCard({ n }: { n: NtNote }): React.JSX.Element {
  const FOLDERS = useStore(s => s.FOLDERS);
  const F = foldKey(n.s, { FOLDERS });
  const fc = F[1];
  const u = n.ups.length;
  return (
    <Pressable style={c.card} onPress={() => act('push:ntNote:' + n.id)} testID={`note.card.${n.id}`}>
      <View style={[c.glow, { backgroundColor: alpha(fc, 0.08) }]} pointerEvents="none" />
      <View style={c.tp}>
        <View style={c.tpS}>
          <Icon name="learn" size={13} color={fc} />
          <Txt style={[c.tpTx, { color: fc }]}>{F[0]}</Txt>
        </View>
        <Txt style={c.tpSmall}>{n.d}</Txt>
        <Pressable style={c.star} onPress={() => act('ntStar', n.id)} accessibilityLabel="Star" testID={`note.star.${n.id}`}>
          <Icon name="star" size={18} color={n.star ? '#F5A01F' : '#A4ACB8'} fill={n.star ? '#F5A01F' : 'none'} />
        </Pressable>
      </View>
      <Txt style={c.nt}>{n.t}</Txt>
      <Txt style={c.p} numberOfLines={2}>
        {n.p}
      </Txt>
      {u ? (
        <Pressable style={c.ups} onPress={() => act('ntUps', n.id)} testID={`note.ups.${n.id}`}>
          <View style={c.ud}>
            <Txt style={c.udTx}>{u}</Txt>
          </View>
          <View style={c.ul}>
            <Txt style={c.ulB}>{`new update${u === 1 ? '' : 's'}`}</Txt>
            <Txt style={c.ulSmall} numberOfLines={1}>
              {srcNames(n).slice(0, 2).join(' · ')}
            </Txt>
          </View>
          <View style={c.ug}>
            <Txt style={c.ugTx}>Review</Txt>
            <Icon name="arrow" size={12} color="#1F6B3A" />
          </View>
        </Pressable>
      ) : (
        <View style={c.ok}>
          <Icon name="check" size={14} color="#2FA562" />
          <Txt style={c.okTx}>{n.merged ? 'Merged · up to date' : 'Up to date'}</Txt>
        </View>
      )}
    </Pressable>
  );
}

const c = StyleSheet.create({
  card: { paddingTop: 15, paddingHorizontal: 15, paddingBottom: 13, borderRadius: 20, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  glow: { position: 'absolute', right: -34, top: -34, width: 96, height: 96, borderRadius: 48 },
  tp: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tpS: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tpTx: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675 },
  tpSmall: { marginLeft: 'auto', fontSize: 11.5, lineHeight: 16.675, color: '#9AA3AF' },
  star: { width: 30, height: 30, borderRadius: 15, marginVertical: -6, marginRight: -6, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nt: { ...font('book', 500), fontSize: 19.5, lineHeight: 23.79, color: '#14161C', marginTop: 8 },
  p: { fontSize: 13, lineHeight: 19.5, color: '#6B7380', marginTop: 5 },
  ups: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8, marginTop: 12, borderRadius: 14, backgroundColor: '#F0F9F3', boxShadow: 'inset 0px 0px 0px 1px #D4EEDD' },
  ud: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#2FA562', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  udTx: { ...font('sans', 800), fontSize: 13.5, lineHeight: 19.575, color: '#FFFFFF' },
  ul: { flex: 1, minWidth: 0 },
  ulB: { ...font('sans', 700), fontSize: 13, lineHeight: 18.85, color: '#1F6B3A' },
  ulSmall: { ...font('sans', 700), fontSize: 11, lineHeight: 15.95, color: '#5E8A6F' },
  ug: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 30, paddingHorizontal: 11, borderRadius: 9, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #D4EEDD' },
  ugTx: { ...font('sans', 800), fontSize: 12, lineHeight: 17.4, color: '#1F6B3A' },
  ok: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 11, borderTopWidth: 1, borderTopColor: '#F0F2F6' },
  okTx: { ...font('sans', 600), fontSize: 12, lineHeight: 17.4, color: '#8A93A0' },
});
