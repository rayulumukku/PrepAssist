// Source: PrepAssist.html L6567-L6575 (VIEWS.calendar), L6662-L6665 (calSlots), L2925-L2936 (.cal-strip, .slot, .tm, .bx)
// Study Calendar. Computed (reference/android/view-calendar, view-calendar-other-day):
//   .cal-strip      7 equal columns, gap 4px, margin-bottom 16px
//     button        padding 8px 0, radius 10, content centred; Inter 700 10.5px / 15.225px, ls .63px, --muted
//       b           Inter Tight 700 18px / 26.1px, ls -0.54px, --ink (block)
//       i           4 x 4 round --brand, margin 4px auto 0 (days with sessions)
//     button.on     background --brand, text rgba(255,255,255,.75), b #fff
//   .slot           grid 52px 1fr, gap 12px; padding 10px 0; border-bottom 1px --rule
//     .tm           Inter 12.5px / 18.125px --muted, tabular, padding-top 3px (key dates: ic('calendar') in --muted)
//     .bx           border-left 3px --c, padding 2px 0 2px 12px; b 600 14.5px / 21.025px block; small 12.5px --muted
//     .slot.dn b    line-through, --muted
//   .sec-label      inline margin 28px 0 8px
// A.calDay (pages/handlers.ts) moves .on to the pressed day and dims #calSlots to .3 for 180 ms (no transition).
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, pageHeaderActStyle } from '../../components';
import { INLINE_calSlots_L6663 } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { cssColor, font, palettes, Txt, useTheme } from '../../theme';
import { HeroTitle, pageStyles, SecLabel } from './pages/PageParts';

const C = palettes.free;

/** L6570: [day, date, has sessions] */
const DAYS: readonly (readonly [string, number, number?])[] = [
  ['MON', 19, 1],
  ['TUE', 20, 1],
  ['WED', 21, 1],
  ['THU', 22, 1],
  ['FRI', 23],
  ['SAT', 24, 1],
  ['SUN', 25, 1],
];
/** `d[1] === 22 ? 'on' : ''` */
const INITIAL_ON = 3;

/** L6573 */
const KEY_DATES: readonly (readonly [string, string])[] = [
  ['Notification & applications open', 'January 2027'],
  ['Preliminary Examination', 'In 126 days'],
  ['Mains (Written)', 'As per UPSC calendar'],
  ['Your Mock 4 · Full length', 'Sun, 25 Oct'],
];

const styles = StyleSheet.create({
  dim: { opacity: 0.3 },
  keyLabel: { marginTop: 28, marginBottom: 8, marginHorizontal: 0 },
  strip: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  day: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dayT: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.63, color: C.muted, textAlign: 'center' },
  dayB: { ...font('serif', 700), fontSize: 18, lineHeight: 26.1, letterSpacing: -0.54, color: C.ink, textAlign: 'center' },
  dayTOn: { color: 'rgba(255,255,255,0.75)' },
  dayBOn: { color: '#FFFFFF' },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
  slot: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.rule },
  tm: { width: 52, paddingTop: 3 },
  tmT: { fontSize: 12.5, lineHeight: 18.125, color: C.muted, fontVariant: ['tabular-nums'] },
  bx: { flex: 1, borderLeftWidth: 3, paddingTop: 2, paddingBottom: 2, paddingLeft: 12 },
  b: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025 },
  bDn: { textDecorationLine: 'line-through', color: C.muted },
  small: { fontSize: 12.5, lineHeight: 22.475, color: C.muted },
});

function Slot({ tm, title, sub, c, dn }: { tm: React.ReactNode; title: string; sub: string; c: string; dn?: boolean }): React.JSX.Element {
  return (
    <View style={styles.slot}>
      <View style={styles.tm}>{typeof tm === 'string' ? <Txt style={styles.tmT}>{tm}</Txt> : tm}</View>
      <View style={[styles.bx, { borderLeftColor: c }]}>
        <Txt style={[styles.b, dn ? styles.bDn : null]}>{title}</Txt>
        <Txt style={styles.small}>{sub}</Txt>
      </View>
    </View>
  );
}

function CalendarAction(): React.JSX.Element {
  return (
    <Pressable style={pageHeaderActStyle} onPress={() => act('toast:New study session added')} accessibilityRole="button" testID="calendar.add">
      <Icon name="plus" />
    </Pressable>
  );
}

function CalendarScreen({ entryKey }: ViewProps): React.JSX.Element {
  const t = useTheme();
  const page = useStore(s => (s.calPage && s.calPage.key === entryKey ? s.calPage : null));
  const on = page ? page.on : INITIAL_ON;
  return (
    <View>
      <View style={pageStyles.hero}>
        <HeroTitle title="October 2026" />
        <Txt style={pageStyles.p}>Week 43 · 4 sessions today · 126 days to Prelims</Txt>
      </View>
      <View style={pageStyles.sec}>
        <View style={styles.strip}>
          {DAYS.map((d, i) => (
            <Pressable
              key={d[0]}
              style={[styles.day, i === on ? { backgroundColor: t.brand } : null]}
              onPress={() => act('calDay', undefined, { index: i })}
              accessibilityRole="button"
              testID={`calendar.day.${i}`}>
              <Txt style={[styles.dayT, i === on ? styles.dayTOn : null]}>{d[0]}</Txt>
              <Txt style={[styles.dayB, i === on ? styles.dayBOn : null]}>{String(d[1])}</Txt>
              {d[2] ? <View style={[styles.dot, { backgroundColor: t.brand }]} /> : null}
            </Pressable>
          ))}
        </View>
        <View style={page?.dim ? styles.dim : null} testID="calendar.slots">
          {INLINE_calSlots_L6663.map(s => (
            <Slot key={s[0]} tm={s[0]} title={s[1]} sub={s[2]} c={cssColor(s[3], t)} dn={!!s[4]} />
          ))}
        </View>
        <SecLabel style={styles.keyLabel}>UPSC CSE 2027 · Key dates</SecLabel>
        {KEY_DATES.map(k => (
          <Slot key={k[0]} tm={<Icon name="calendar" color={C.muted} />} title={k[0]} sub={k[1]} c={cssColor('var(--polity)', t)} />
        ))}
      </View>
    </View>
  );
}

const view: ViewDef = {
  useTitle: () => 'Study Calendar',
  Action: CalendarAction,
  Screen: CalendarScreen,
};

export default view;
