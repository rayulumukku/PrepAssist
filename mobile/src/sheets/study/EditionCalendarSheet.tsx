// Source: PrepAssist.html L7257-L7277 (caCalHTML), L7278 (calRefresh), L3190-L3217 (.cc-*)
// The edition calendar builds its own head (no sheetFrame). Computed (reference/android/sheet-edition-calendar, -prev-month, -picked):
//   .cc-head   grid 1fr auto 1fr, centred; padding 8 18 12; border-bottom 1px #EEF2F6 (53 high)
//              left button Inter 600 13.5px / 19.575px #1B8AD3; h3 EB Garamond 500 20px / 29px;
//              .cc-done 32 high, padding 0 14, radius 10, #1B8AD3, #fff, at the right end
//   .sh-body   padding 0 20 max(24px, --sab), scrolls
//   .cc-month  row, space-between, centred, padding 16 0 10; buttons 36 round, 1px #E1E8F0, ic #14161C, [disabled] opacity .3;
//              b EB Garamond 500 22px / 31.9px, the year span #9AA3AF
//   .cc-dow / .cc-grid  7 equal columns, gap 4. dow: Inter 700 10.5px / 15.225px, .63px, #9AA3AF, centred, padding-bottom 4
//   cell       44 high, radius 12, column centred, gap 3; b Inter 600 14.5px / 21.025px #25272D; i row gap 2, 4 high,
//              em 4 x 4 round #9FD0F2. .td inset 0 0 0 1.5px #1B8AD3. .on #1B8AD3 + 0 8px 14px -8px rgba(27,138,211,.9),
//              b and em #fff. [disabled] b #D3DAE3 and no dots. (calRefresh rewrites the markup, so no transition plays.)
//   .cc-quick  row gap 6, margin-top 14; buttons flex 1, 34 high, radius 10, 1px #E1E8F0, Inter 600 12.5px #3A404B;
//              .on border/colour #1B8AD3 on #EAF4FC
//   .cc-sel    row centred, gap 12, margin-top 14, padding 12 14, radius 14, #F5F7FA; tile 36 radius 10 #14304F ic #FFD27A;
//              small Inter 700 10.5px / 15.225px .84px uppercase #9AA3AF; b Inter 700 13.5px / 19.575px #14161C margin-top 1;
//              em Inter 700 11.5px / 16.675px #1B8AD3
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetGrab } from '../../components';
import { MONL } from '../../data';
import { isoD, parseD, today } from '../../env/clock';
import type { SheetProps } from '../../navigation/routes';
import { addD, fmtLong } from '../../screens/study/common/current';
import { calModel, storyCount } from '../../screens/study/maps/mapsLogic';
import type { CalCell } from '../../screens/study/maps/mapsLogic';
import { useStore } from '../../store';
import { font, Txt, useInsets } from '../../theme';

const BLUE = '#1B8AD3';
const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  side: { flex: 1, flexDirection: 'row' },
  sideEnd: { justifyContent: 'flex-end' },
  recent: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: BLUE },
  h3: { ...font('book', 500), fontSize: 20, lineHeight: 29 },
  done: { height: 32, paddingHorizontal: 14, borderRadius: 10, backgroundColor: BLUE, justifyContent: 'center' },
  doneT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#FFFFFF' },
  body: { flexGrow: 0, flexShrink: 1 },
  bodyC: { paddingHorizontal: 20 },
  month: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, paddingBottom: 10 },
  mBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E1E8F0', alignItems: 'center', justifyContent: 'center' },
  mB: { ...font('book', 500), fontSize: 22, lineHeight: 31.9 },
  mY: { color: '#9AA3AF' },
  row: { flexDirection: 'row', gap: 4 },
  grid: { gap: 4 },
  dow: { flex: 1, ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.63, color: '#9AA3AF', textAlign: 'center', paddingBottom: 4 },
  cell: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 3 },
  td: { boxShadow: `inset 0px 0px 0px 1.5px ${BLUE}` },
  on: { backgroundColor: BLUE, boxShadow: '0px 8px 14px -8px rgba(27, 138, 211, 0.9)' },
  cb: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: '#25272D' },
  dots: { flexDirection: 'row', gap: 2, height: 4 },
  em: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#9FD0F2' },
  emOn: { backgroundColor: '#FFFFFF' },
  cbOn: { color: '#FFFFFF' },
  cbOff: { color: '#D3DAE3' },
  mOff: { opacity: 0.3 },
  quick: { flexDirection: 'row', gap: 6, marginTop: 14 },
  qBtn: { flex: 1, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#E1E8F0', alignItems: 'center', justifyContent: 'center' },
  qOn: { borderColor: BLUE, backgroundColor: '#EAF4FC' },
  qT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B' },
  sel: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#F5F7FA' },
  selIc: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#14304F', alignItems: 'center', justifyContent: 'center' },
  selD: { flex: 1, minWidth: 0 },
  selS: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.84, textTransform: 'uppercase', color: '#9AA3AF' },
  selB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#14161C', marginTop: 1 },
  selE: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: BLUE },
});

function Cell({ c }: { c: CalCell }): React.JSX.Element {
  return (
    <Pressable
      style={[styles.cell, c.td && styles.td, c.on && styles.on]}
      disabled={c.fut}
      onPress={() => act('caPick', c.k)}
      accessibilityLabel={fmtLong(parseD(c.k))}
      testID={`sheet.editionCalendar.day.${c.k}`}>
      <Txt style={[styles.cb, c.on && styles.cbOn, c.fut && styles.cbOff]}>{String(c.d)}</Txt>
      {c.fut ? null : (
        <View style={styles.dots}>
          {Array.from({ length: c.dots }, (_, i) => (
            <View key={i} style={[styles.em, c.on && styles.emOn]} />
          ))}
        </View>
      )}
    </Pressable>
  );
}

function EditionCalendarSheet(_props: SheetProps): React.JSX.Element {
  const view = useStore(s => s.caView);
  const sel = useStore(s => s.caTmp);
  const { sab } = useInsets();
  const TODAY = today();
  const cal = calModel(view, sel, TODAY);
  // leading blanks + days + trailing blanks, in rows of 7 (the grid's auto rows)
  const slots: (CalCell | null)[] = [...Array.from({ length: cal.lead }, () => null), ...cal.cells];
  while (slots.length % 7) slots.push(null);
  const rows: (CalCell | null)[][] = [];
  for (let i = 0; i < slots.length; i += 7) rows.push(slots.slice(i, i + 7));
  const quick: [number, string][] = [
    [0, 'Today'],
    [1, 'Yesterday'],
    [7, 'A week ago'],
  ];
  return (
    <>
      <SheetGrab />
      <View style={styles.head}>
        <View style={styles.side}>
          <Pressable onPress={() => act('caRecent')} testID="sheet.editionCalendar.recent">
            <Txt style={styles.recent}>View recent</Txt>
          </Pressable>
        </View>
        <Txt style={styles.h3}>Pick an edition</Txt>
        <View style={[styles.side, styles.sideEnd]}>
          <Pressable style={styles.done} onPress={() => act('caDone')} testID="sheet.editionCalendar.done">
            <Txt style={styles.doneT}>Done</Txt>
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={[styles.bodyC, { paddingBottom: Math.max(24, sab) }]} showsVerticalScrollIndicator={false}>
        <View style={styles.month}>
          <Pressable style={styles.mBtn} onPress={() => act('caMon', '-1')} accessibilityLabel="Previous month" testID="sheet.editionCalendar.prev">
            <Icon name="chevl" color="#14161C" />
          </Pressable>
          <Txt style={styles.mB}>
            {MONL[cal.m] + ' '}
            <Txt style={styles.mY}>{String(cal.y)}</Txt>
          </Txt>
          <Pressable
            style={[styles.mBtn, !cal.nextOk && styles.mOff]}
            disabled={!cal.nextOk}
            onPress={() => act('caMon', '1')}
            accessibilityLabel="Next month"
            testID="sheet.editionCalendar.next">
            <Icon name="chev" color="#14161C" />
          </Pressable>
        </View>
        <View style={styles.row}>
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
            <Txt key={d} style={styles.dow}>
              {d}
            </Txt>
          ))}
        </View>
        <View style={styles.grid}>
          {rows.map((r, ri) => (
            <View key={ri} style={styles.row}>
              {r.map((c, ci) => (c ? <Cell key={c.k} c={c} /> : <View key={`b${ci}`} style={styles.cell} />))}
            </View>
          ))}
        </View>
        <View style={styles.quick}>
          {quick.map(([n, l]) => {
            const k = isoD(addD(TODAY, -n));
            const on = k === isoD(sel);
            return (
              <Pressable key={l} style={[styles.qBtn, on && styles.qOn]} onPress={() => act('caPick', k)}>
                <Txt style={[styles.qT, on && { color: BLUE }]}>{l}</Txt>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.sel}>
          <View style={styles.selIc}>
            <Icon name="current" color="#FFD27A" />
          </View>
          <View style={styles.selD}>
            <Txt style={styles.selS}>Selected edition</Txt>
            <Txt style={styles.selB}>{fmtLong(sel)}</Txt>
          </View>
          <Txt style={styles.selE}>{`${storyCount(sel)} stories`}</Txt>
        </View>
      </ScrollView>
    </>
  );
}

export default EditionCalendarSheet;
