// Source: PrepAssist.html L8140-L8140 (A.pqHist)
// Source: PrepAssist.html L3568-L3572 (.ld-r, .ld-i, .ld-r b / small / em), L4411 (.ld-list), L2724 (.empty)
// "Your attempts": one row per answered question (sheetFrame), or "No questions attempted yet.".
// Computed (reference/android sheet-pqb-attempts, sheet-pqb-attempts-empty):
//   .ld-r   row gap 12, padding 12 0, border-bottom #F1F4F8 (a full-width button)
//   .ld-i   34 x 34 radius 10, #E6F4EA / #2F8A4A (.p) or the inline #FDECEC / #C0392B; icon 16
//   b       Inter 600 13.5px / 19.575px #14161C (block); small inline 11.5px (line box 22.475) #9AA3AF
//   em      Inter Tight 800 16.5px / 23.925px #C0392B (.p #2F8A4A)
//   .empty  padding 40 20, centred, Inter Tight italic (synthesised) 400 15.5px / 22.475px --muted
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import { PQB } from '../../data';
import { pqbAttempts } from '../../screens/practice/logic/pqb';
import { getS } from '../../store';
import { font, palettes, Txt } from '../../theme';

const s = StyleSheet.create({
  r: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F4F8' },
  i: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  mid: { flex: 1, minWidth: 0 },
  b: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#14161C' },
  sm: { fontSize: 11.5, lineHeight: 22.475, color: '#9AA3AF' },
  em: { ...font('serif', 800), fontSize: 16.5, lineHeight: 23.925 },
  empty: { ...font('serif', 400, true), paddingVertical: 40, paddingHorizontal: 20, textAlign: 'center', fontSize: 15.5, lineHeight: 22.475, color: palettes.free.muted },
});

function PqbAttemptsSheet(): React.JSX.Element {
  // the sheet's markup is built when it opens (A.pqHist); later answers do not change it
  const [rows] = React.useState(() => pqbAttempts(getS().pqb.sel, PQB));
  return (
    <SheetFrame title="Your attempts" testID="sheet.pqbAttempts">
      {rows.length ? (
        <View>
          {rows.map(a => (
            <Pressable key={a.i} style={s.r} onPress={() => act(`pqGo:${a.i}`)} testID={`sheet.pqbAttempts.${a.i}`}>
              <View style={[s.i, { backgroundColor: a.ok ? '#E6F4EA' : '#FDECEC' }]}>
                <Icon name={a.ok ? 'check' : 'x'} size={16} color={a.ok ? '#2F8A4A' : '#C0392B'} />
              </View>
              <View style={s.mid}>
                <Txt style={s.b}>{a.title}</Txt>
                <Txt style={s.sm}>{a.sub}</Txt>
              </View>
              <Txt style={[s.em, { color: a.ok ? '#2F8A4A' : '#C0392B' }]}>{a.pts}</Txt>
            </Pressable>
          ))}
        </View>
      ) : (
        <Txt style={s.empty}>No questions attempted yet.</Txt>
      )}
    </SheetFrame>
  );
}

export default PqbAttemptsSheet;
