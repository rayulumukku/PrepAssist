// Source: PrepAssist.html L6283-L6352 (renderPractice), L2011-L2013 (#t-practice background #F5F7FA, #practiceScroll padding 0 20 120)
// The Practice tab pane: #t-practice > #practiceScroll. S.px chooses the Prelims ('pre', the default) or Mains
// layout; pxGo (actions/tabs.ts) sets it and scrolls the pane to the top. The private parts live in ./practice.
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTabScroll } from '../../shell/tabScroll';
import { useStore } from '../../store';
import { PracticeHero } from './practice/PracticeHero';
import { AnswerBank, Engine, History, PastEvals, QuestionBank, TestSeries, TodayMains, TodayPre } from './practice/PracticeParts';

function PracticeTab(): React.JSX.Element {
  const scroll = useTabScroll('practice');
  const mains = useStore(s => s.px) === 'mains';
  return (
    <ScrollView {...scroll} style={styles.pane} contentContainerStyle={styles.content} testID="practice.scroll">
      <PracticeHero mains={mains} />
      {mains ? (
        <>
          <TodayMains />
          <AnswerBank />
          <PastEvals />
        </>
      ) : (
        <>
          <TodayPre />
          <QuestionBank />
          <Engine />
          <TestSeries />
          <History />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pane: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
});

export default PracticeTab;
