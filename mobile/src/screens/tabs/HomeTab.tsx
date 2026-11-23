// Source: PrepAssist.html L6043-L6142 (renderHome), L1456-L1456 (#homeScroll padding 0 20 120), L2253-L2256 (.tabp)
// The Home tab pane: #t-home > #homeScroll. Background --paper-2 #F5F7FA (computed on #t-home), padding
// 0 20 120. Sections in the order of renderHome; the private parts live in ./home.
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { now as clockNow } from '../../env/clock';
import { scrollTab, useTabScroll } from '../../shell/tabScroll';
import { useStore } from '../../store';
import { tr } from './homeLogic';
import { animateHome } from './home/homeAnim';
import { deckCtl } from './home/heroCtl';
import { HomeDeck } from './home/HomeDeck';
import { HomeHero } from './home/HomeHero';
import { Brief, DH, DHSpan, Foot, NowCard, Progress, Reels, Today, Tools } from './home/HomeParts';
import { HomeSky } from './home/HomeSky';
import { BANNERS } from '../../data';

function HomeTab(): React.JSX.Element {
  const scroll = useTabScroll('home');
  const lang = useStore(s => s.lang);
  // renderHome() reruns rebuild the pane (bars restart from 0); a re-render also re-reads the clock
  const gen = useStore(s => s.homeGen);
  const [now, setNow] = useState(clockNow);
  useEffect(() => setNow(clockNow()), [gen, lang]);
  // relabel() (L6016-L6020, run by setLang): renderHome(); initHero(); animateHome()
  const firstLang = useRef(lang);
  useEffect(() => {
    if (lang !== firstLang.current) animateHome();
  }, [lang]);
  const [fcsY, setFcsY] = useState(0);
  useEffect(() => {
    deckCtl.scrollToFcs = () => scrollTab('home', fcsY, true);
  }, [fcsY]);
  return (
    <ScrollView {...scroll} style={styles.pane} contentContainerStyle={styles.content} testID="home.scroll">
      <React.Fragment key={`${gen}.${lang}`}>
        <HomeSky now={now} />
        <NowCard />
        <Today title={tr(lang, 'today')} />
        <DH title="Announcements" hc="c-o" icon="mega" style={styles.annh} right={<DHSpan>{`${BANNERS.length} new`}</DHSpan>} />
        <HomeHero />
        <Brief now={now} />
        <Reels />
        <HomeDeck title={tr(lang, 'flash')} onLayoutY={setFcsY} />
        <Progress title={tr(lang, 'progress')} />
        <Tools title={tr(lang, 'tools')} />
        <Foot />
      </React.Fragment>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pane: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  annh: { marginTop: 34, marginBottom: 0 },
});

export default HomeTab;
