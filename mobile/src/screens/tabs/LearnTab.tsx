// Source: PrepAssist.html L8250-L8322 (renderLearn, definition 2 of 3, rendered by the effective wrapper L10064-L10071), L1857-L1857 (#learnScroll), L2253-L2256 (.tabp)
// The Learn tab pane: #t-learn > #learnScroll. Background --paper-2 #F5F7FA (computed on #t-learn), padding 0 20 120.
// The Learn filter chips (.l-chips, A.learnF) of the first definition are dead code in the final UI and are not ported.
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTabScroll } from '../../shell/tabScroll';
import { CloudSection, MoreSection, NotesSection, ShelfSection, TrackerSection, XraySection } from './learn/LearnSections';
import { LearnEssentials, LearnHero, LearnResume } from './learn/LearnTop';

function LearnTab(): React.JSX.Element {
  const scroll = useTabScroll('learn');
  return (
    <ScrollView {...scroll} style={styles.pane} contentContainerStyle={styles.content} testID="learn.scroll">
      <LearnHero />
      <LearnResume />
      <LearnEssentials />
      <NotesSection />
      <XraySection />
      <TrackerSection />
      <CloudSection />
      <ShelfSection />
      <MoreSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pane: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
});

export default LearnTab;
