// Source: PrepAssist.html L7595-L7596 (A.caFilter), L3685-L3692 (.cx-fl)
// "Filter by paper": one row per paper (All, GS I-IV) with its story count for the current source and
// edition; a paper with no story is disabled. Computed: reference/android/sheet-current-filter.
//   button     grid 12px 1fr auto 18px, column-gap 12, padding 12 4, border-bottom 1 #F1F4F8; [disabled] opacity .35
//   i          10 x 10 dot (All #14161C, else GSC[g]), spanning both rows
//   b          Inter 600 14.5/21.025 #14161C (.on #1B8AD3); small 12.5/18.125 #7A8494
//   em         24 min x 22, radius 7, #F1F5FA, Inter 700 12.5 #5B6472, centred
//   svg.ic     check 18 #1B8AD3 on the selected row (the 18 px column stays when there is none)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import { INLINE_caFilter_L7596 } from '../../data/inline';
import { today } from '../../env/clock';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { caPool, filterCounts, gsColor, gsRoman } from '../../screens/tabs/current/currentLogic';

const dotColor = (g: string): string => (g === 'All' ? '#14161C' : gsColor(g));
const decode = (s: string): string => s.replace(/&amp;/g, '&');

function CurrentFilterSheet(): React.JSX.Element {
  const ca = useStore(s => s.ca);
  const n = filterCounts(caPool(ca.date, today()), ca.src);
  return (
    <SheetFrame title="Filter by paper" testID="sheet.currentFilter">
      <View>
        {['All', 'gs1', 'gs2', 'gs3', 'gs4'].map(g => {
          const on = ca.gs === g;
          const k = Number(g[2]) - 1;
          return (
            <Pressable
              key={g}
              style={[styles.row, !n(g) && styles.disabled]}
              disabled={!n(g)}
              onPress={() => act('caGs', g)}
              testID={`sheet.currentFilter.${g}`}
            >
              <View style={[styles.dot, { backgroundColor: dotColor(g) }]} />
              <View style={styles.text}>
                <Txt style={[styles.b, on && styles.bOn]}>{g === 'All' ? 'All papers' : 'GS Paper ' + gsRoman(g)}</Txt>
                <Txt style={styles.small}>{g === 'All' ? 'Every story in this edition' : decode(INLINE_caFilter_L7596[k])}</Txt>
              </View>
              <View style={styles.em}>
                <Txt style={styles.emT}>{n(g)}</Txt>
              </View>
              <View style={styles.ck}>{on ? <Icon name="check" size={18} color="#1B8AD3" /> : null}</View>
            </Pressable>
          );
        })}
      </View>
    </SheetFrame>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#F1F4F8' },
  disabled: { opacity: 0.35 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 2 },
  text: { flex: 1, minWidth: 0 },
  b: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: '#14161C' },
  bOn: { color: '#1B8AD3' },
  small: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  em: { minWidth: 24, height: 22, borderRadius: 7, backgroundColor: '#F1F5FA', alignItems: 'center', justifyContent: 'center' },
  emT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#5B6472' },
  ck: { width: 18, height: 18 },
});

export default CurrentFilterSheet;
