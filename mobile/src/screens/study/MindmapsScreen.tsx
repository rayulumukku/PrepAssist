// Source: PrepAssist.html L7987-L7994 (VIEWS.mindmaps), L4330-L4340 (.mm-in, .mm-list, .mm-card), L4059-L4062 (.ch2), L3998-L4000, L4274-L4275, L9292-L9300 (.mu-h.mu-h2), L3337 (.me-chev), L9313-L9317, L9350-L9368 (ds overrides)
// Computed (reference/android/view-mindmaps, -generating, -two-maps):
//   .me-page.tlp  padding 4 20 40
//   .mm-in    row, gap 8, padding 6 6 6 14, radius 14, #fff, box-shadow 0 0 0 1.5px #BDE6F0
//             input flex 1, 42 high, Inter 14.5px, placeholder rgb(117,117,117); button 42 x 42 radius 12 #0A97B8, ic bolt #fff
//   .ch2      horizontal scroller, margin 12 -20 0, padding 0 20 2, gap 8; button 34 high, padding 0 14, pill, #fff,
//             box-shadow 0 0 0 1px #E1E8F0, Inter 600 12.5px / 18.125px #3A404B
//   .mu-h2    row, baseline, space-between, margin 28 0 12; h2 Inter 700 18px / 21.6px -0.18px #14161C; span 12.5px #7A8494
//   .mm-list  gap 10; .mm-card row centred, gap 12, padding 10 14 10 10, radius 18, #fff, box-shadow 0 0 0 1px #E6EBF1
//             svg 96 x 58 radius 12 #F0FAFC (viewBox 120 x 70, meet); b 14.5px 700 / 21.025; small 12.5px #7A8494 in a 22.475 line
//             .me-chev 16px #AEB7C3
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { ViewDef } from '../../navigation/routes';
import { setS, useStore } from '../../store';
import { font, fontPx, Txt } from '../../theme';
import { mmCardSpoke } from './maps/mapsLogic';
import { MmBusy } from './maps/MmBusy';
import { TlHero } from './maps/TlHero';

const styles = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  in: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 6,
    paddingRight: 6,
    paddingBottom: 6,
    paddingLeft: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1.5px #BDE6F0',
  },
  input: { flex: 1, minWidth: 0, height: 42, padding: 0, ...font('sans', 400), fontSize: fontPx(14.5), color: '#25272D' },
  go: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#0A97B8', alignItems: 'center', justifyContent: 'center' },
  ch2: { marginTop: 12, marginHorizontal: -20 },
  ch2c: { paddingHorizontal: 20, paddingBottom: 2, gap: 8 },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
    justifyContent: 'center',
  },
  chipT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B' },
  muH: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginTop: 28, marginBottom: 12 },
  h2: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: '#14161C' },
  muS: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    paddingRight: 14,
    paddingBottom: 10,
    paddingLeft: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  thumb: { width: 96, height: 58, borderRadius: 12, backgroundColor: '#F0FAFC', overflow: 'hidden' },
  body: { flex: 1 },
  b: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025 },
  small: { fontSize: 12.5, lineHeight: 22.475, color: '#7A8494' },
});

const TRY = ['Inflation impacts', 'Federalism', 'Climate finance', 'Judicial activism'];

function Thumb({ n }: { n: number }): React.JSX.Element {
  return (
    <View style={styles.thumb}>
      <Svg width={96} height={58} viewBox="0 0 120 70">
        {Array.from({ length: n }, (_, k) => {
          const { x, y } = mmCardSpoke(k, n);
          return (
            <React.Fragment key={k}>
              <Path d={`M60 35L${x} ${y}`} stroke="#9FD0F2" strokeWidth={1.4} />
              <Circle cx={x} cy={y} r={5} fill="#fff" stroke="#0A97B8" strokeWidth={1.5} />
            </React.Fragment>
          );
        })}
        <Rect x={44} y={28} width={32} height={14} rx={5} fill="#0A97B8" />
      </Svg>
    </View>
  );
}

function MindmapsScreen(): React.JSX.Element {
  const maps = useStore(s => s.maps);
  const mmIn = useStore(s => s.mmIn);
  const busy = useStore(s => s.mmBusy);
  // a freshly rendered page has an empty input and an empty #mmBusy
  useEffect(() => {
    setS({ mmIn: '', mmBusy: null });
  }, []);
  return (
    <View style={styles.page}>
      <TlHero
        id="mindmaps"
        title="Big topics, "
        em="one picture"
        sub="Type any concept and get a structured visual map you can study and quiz from."
        stats={[
          { v: maps.length, l: 'maps saved' },
          { v: '3', l: 'credits / map' },
        ]}
      />
      <View style={styles.in}>
        <TextInput
          style={styles.input}
          value={mmIn}
          onChangeText={v => setS({ mmIn: v })}
          onSubmitEditing={() => act('mmGo')}
          placeholder="Enter a topic, e.g. Inflation impacts"
          placeholderTextColor="rgb(117, 117, 117)"
          allowFontScaling={false}
          testID="mindmaps.input"
        />
        <Pressable style={styles.go} onPress={() => act('mmGo')} accessibilityLabel="Generate" testID="mindmaps.go">
          <Icon name="bolt" color="#FFFFFF" />
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ch2} contentContainerStyle={styles.ch2c}>
        {TRY.map(x => (
          <Pressable key={x} style={styles.chip} onPress={() => act('mmTry', x)}>
            <Txt style={styles.chipT}>{x}</Txt>
          </Pressable>
        ))}
      </ScrollView>
      {busy !== null ? <MmBusy topic={busy} /> : null}
      <View style={styles.muH}>
        <Txt style={styles.h2}>Your mindmaps</Txt>
        <Txt style={styles.muS}>Saved maps</Txt>
      </View>
      <View style={styles.list}>
        {maps.map((m, i) => (
          <Pressable key={`${m.id}.${i}`} style={styles.card} onPress={() => act('mmOpen', String(i))} testID={`mindmaps.card.${i}`}>
            <Thumb n={m.n} />
            <View style={styles.body}>
              <Txt style={styles.b}>{m.t}</Txt>
              <Txt style={styles.small}>{`${m.n} branches · ${m.d}`}</Txt>
            </View>
            <Icon name="chev" size={16} color="#AEB7C3" />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const view: ViewDef = {
  useTitle: () => 'AI Mindmaps',
  Screen: MindmapsScreen,
};

export default view;
