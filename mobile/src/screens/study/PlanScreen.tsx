// Source: PrepAssist.html L6637-L6644 (VIEWS.plan), L7051-L7059 (planResult), L7031 (A.planGo)
// The 90-day plan builder. Computed (reference/android/view-plan, view-plan-analysing, view-plan-result):
//   .pg-hero with .tag in --brand; .sec#planBody: .fldlab, .opt-row of chipOne chips ('6 h' on),
//   .fldlab, a box (margin 10px 0 18px) of three .rb rows (pages/PlanParts.tsx PlanRb), then
//   #planGo .btn-brand.btn-wide with ic('spark'). A.planGo puts `<span class="spin"></span> Analysing your
//   preparation…` in the button, then after 1400 ms replaces #planBody with planResult(): .why, .plan-ph and
//   two buttons (.btn-ink.btn-wide ic('calendar'), .btn-ghost.btn-wide margin-top 6px ic('spark')).
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn, ChipGroup, FldLab, OptRow, Tag } from '../../components';
import { SUBJ } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { cssColor, font, Txt, useTheme } from '../../theme';
import { HeroTitle, pageStyles, swatchFix } from './pages/PageParts';
import { PlanRb, PlanResult, Spin } from './pages/PlanParts';

/** L6641: [subject, coverage, note] */
const FOCUS: readonly (readonly [string, number, string])[] = [
  ['env', 29, 'Lowest coverage · high PYQ weight'],
  ['eco', 36, 'Accuracy 55% · current-affairs heavy'],
  ['polity', 58, 'Strong base · Writs & Emergency weak'],
];

const styles = StyleSheet.create({
  mt6: { marginTop: 6 },
  rbs: { marginTop: 10, marginBottom: 18 },
  // .btn text (shared Btn) for the spinner label, which the HTML puts after the spinner
  btnT: { ...font('sans', 600), fontSize: 15.5, lineHeight: 22.475, textAlign: 'center', color: '#FFFFFF' },
});

function PlanScreen({ entryKey }: ViewProps): React.JSX.Element {
  const t = useTheme();
  const step = useStore(s => (s.planPage && s.planPage.key === entryKey ? s.planPage.step : null));
  return (
    <View>
      <View style={pageStyles.hero}>
        <Tag color={t.brand} swatch swatchStyle={swatchFix}>
          PrepAssist AI
        </Tag>
        <HeroTitle title="Your 90-day revision strategy" style={pageStyles.mt8} />
        <Txt style={pageStyles.p}>Built from your coverage, quiz accuracy and the time you have each day.</Txt>
      </View>
      <View style={pageStyles.sec} testID="plan.body">
        {step === 'done' ? (
          <>
            <PlanResult />
            <Btn variant="ink" wide icon="calendar" label="Add to Study Calendar" onPress={() => act('toast:90-day plan added to your Study Calendar')} testID="plan.addCal" />
            <Btn variant="ghost" wide icon="spark" label="Ask Mentor to adjust it" style={styles.mt6} onPress={() => act('mentorAsk:How should I revise Polity in 15 days?')} testID="plan.mentor" />
          </>
        ) : (
          <>
            <FldLab>Hours you can study each day</FldLab>
            <OptRow>
              <ChipGroup items={['4 h', '6 h', '8 h', '10 h']} mode="one" initial={[1]} testID="plan.hours" />
            </OptRow>
            <FldLab>What deserves attention first</FldLab>
            <View style={styles.rbs}>
              {FOCUS.map(([k, v, d]) => (
                <PlanRb key={k} label={SUBJ[k].n} sub={d} percent={v} color={cssColor(SUBJ[k].c, t)} />
              ))}
            </View>
            {step === 'busy' ? (
              <Btn variant="brand" wide onPress={() => act('planGo')} testID="plan.go">
                <Spin />
                <Txt style={styles.btnT}>Analysing your preparation…</Txt>
              </Btn>
            ) : (
              <Btn variant="brand" wide icon="spark" label="Build My Plan" onPress={() => act('planGo')} testID="plan.go" />
            )}
          </>
        )}
      </View>
    </View>
  );
}

const view: ViewDef = {
  useTitle: () => 'Prelims 2027 · 90-day plan',
  Screen: PlanScreen,
};

export default view;
