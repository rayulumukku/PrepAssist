// Source: PrepAssist.html L7187-L7219 (renderCurrent), L7242-L7254 (renderCaList), L2253-L2256 (.tabp)
// The Current tab pane: #t-current > #currentScroll (background --paper-2 #F5F7FA, padding 0 20 120).
// Children in the order of renderCurrent: .cx-hero, the sticky .cx-fbar (stickyHeaderIndices: CSS
// position:sticky; top:0 inside the scroller), .cx-active when a paper filter is on, and #caList
// (margin-top 12, column, gap 12): lead story, cards, the MCQ card after the second card, the end line;
// or the empty state. The list is rebuilt on every renderCurrent(), so its cards replay `tabIn` (key).
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { isoD, parseD, today } from '../../env/clock';
import { useTabScroll } from '../../shell/tabScroll';
import { useStore } from '../../store';
import { caFiltered, caPool } from './current/currentLogic';
import { CurrentHero } from './current/CurrentHero';
import { ActiveFilter, Card, Empty, End, FilterBar, Lead, QuizCta } from './current/CurrentList';

function CurrentTab(): React.JSX.Element {
  const scroll = useTabScroll('current');
  const ca = useStore(s => s.ca);
  const TODAY = today();
  const sel = parseD(ca.date);
  const all = caPool(ca.date, TODAY);
  const isToday = ca.date === isoD(TODAY);
  const readN = all.filter(a => ca.read.has(a.id)).length;
  const list = caFiltered(all, ca.src, ca.gs);
  const [lead, ...rest] = list;
  const gen = `${ca.date}|${ca.src}|${ca.gs}|${ca.read.size}`;
  return (
    <ScrollView {...scroll} style={styles.pane} contentContainerStyle={styles.content} stickyHeaderIndices={[1]} testID="current.scroll">
      <CurrentHero sel={sel} isToday={isToday} list={all} readN={readN} />
      <FilterBar all={all} />
      {ca.gs !== 'All' ? <ActiveFilter gs={ca.gs} /> : null}
      <View style={styles.list} key={gen}>
        {!list.length ? (
          <Empty src={ca.src} gs={ca.gs} sel={sel} />
        ) : (
          <>
            <Lead a={lead} />
            {rest.map((a, i) => (
              <React.Fragment key={a.id}>
                <Card a={a} />
                {i === 1 ? <QuizCta n={all.length} /> : null}
              </React.Fragment>
            ))}
            <End sel={sel} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pane: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  list: { marginTop: 12, gap: 12 },
});

export default CurrentTab;
