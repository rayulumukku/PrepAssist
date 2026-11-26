// Source: PrepAssist.html L8173-L8173 (A.syFilter)
// Source: PrepAssist.html L3685-L3692 (.cx-fl)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import { SYL } from '../../data';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';

const GSC: Record<string, string> = { gs1: '#E8890C', gs2: '#1B8AD3', gs3: '#2F8A4A', gs4: '#6C5DD3' };

function SyllabusFilterSheet(): React.JSX.Element {
  const currentP = useStore(s => s.syl.p);
  const options = ['All', 'gs1', 'gs2', 'gs3', 'gs4'];

  return (
    <SheetFrame title="Filter by paper" testID="sheet.syllabusFilter">
      <View style={s.fl}>
        {options.map(g => {
          const isOn = currentP === g;
          const bgDot = g === 'All' ? '#14161C' : GSC[g];
          const name = g === 'All' ? 'All papers' : `GS Paper ${['I', 'II', 'III', 'IV'][Number(g[2]) - 1]}`;
          const countGroups = `${SYL.filter(x => g === 'All' || x.p === g).length} concept groups`;
          const totalConcepts = SYL.filter(x => g === 'All' || x.p === g).reduce((sum, x) => sum + x.t.length, 0);

          return (
            <Pressable
              key={g}
              style={[s.row, isOn && s.rowOn]}
              onPress={() => act('syP', g)}
              testID={`syllabusFilter.${g}`}
            >
              <View style={[s.dot, { backgroundColor: bgDot }]} />
              <View style={s.info}>
                <Txt style={[s.title, isOn && s.titleOn]}>{name}</Txt>
                <Txt style={s.sub}>{countGroups}</Txt>
              </View>
              <View style={s.badge}>
                <Txt style={s.badgeTx}>{totalConcepts}</Txt>
              </View>
              <View style={s.chevBox}>
                {isOn ? <Icon name="check" size={18} color="#1B8AD3" /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  fl: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#F1F4F8' },
  rowOn: {},
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  info: { flex: 1 },
  title: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21, color: '#14161C' },
  titleOn: { color: '#1B8AD3' },
  sub: { fontSize: 12.5, lineHeight: 18, color: '#7A8494' },
  badge: { minWidth: 24, height: 22, borderRadius: 7, backgroundColor: '#F1F5FA', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginHorizontal: 8 },
  badgeTx: { ...font('sans', 700), fontSize: 12.5, color: '#5B6472' },
  chevBox: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
});

export default SyllabusFilterSheet;
