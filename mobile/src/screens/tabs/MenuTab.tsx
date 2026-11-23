// Source: PrepAssist.html L7699-L7712 (renderMenu), L7713-L7713 (window.menuFilter), L7715-L7740 (menuBody), L3977-L4034 (.mu-*, #menuScroll)
// The Menu tab pane: #t-menu > #menuScroll (padding 0 20 120; the pane has no background of its own, the
// #app background shows). Computed: reference/android/tab-menu, tab-menu-search, tab-menu-search-empty.
//   .mu-hero    padding calc(var(--sat)+14) 20 20, margin 0 -20, radius 0 0 28 28, overflow hidden,
//               radial(80% 60% at 100% 0%, rgba(108,93,211,.55), transparent 62%) + radial(60% 60% at 0% 100%,
//               rgba(14,154,138,.35), transparent 70%) + linear(160deg, #101E3C 0%, #1A2F5E 55%, #25418A 100%)
//   .mu-deco    absolute right -30 top -18, width 210, opacity .12, rotate(-8deg)
//   .mu-eb      Inter 700 10.5 ls 1.68 uppercase #C9C1FF, inline in a 22.475 line; h1 EB Garamond 500 34/34 margin-top 6
//   .mu-search  46 high, margin-top 16, padding 0 14, radius 14, rgba(255,255,255,.12) + blur(8), border 1 rgba(255,255,255,.2),
//               gap 10; icon 18 #C9C1FF; input Inter 14.5/21.025 #fff, placeholder rgba(255,255,255,.55)
//   .mu-jump    margin 14 -20 0 0, padding-right 20, gap 7, scrolls sideways; span 11.5 600 rgba(255,255,255,.6);
//               buttons 34 high, padding 0 12 0 10, pill, rgba(255,255,255,.1), border 1 rgba(255,255,255,.16), 12.5 600 #fff, icon 15 #FFD27A
//   .mu-sec     margin-top 28; .mu-h space-between, gap 10, margin-bottom 12; h2 Inter 700 18/21.6 ls -.18; span 12.5 #7A8494 (4 below)
//   .mu-up      padding 14, radius 18, margin-bottom 10, #fff + repeating-linear-gradient(135deg, transparent 0 10px,
//               rgba(245,160,31,.05) 10px 20px), shadow 0 0 0 1.5px #F5D59A
//   .mu-res / .mu-none margin-top 18, #fff, radius 18, shadow 0 0 0 1px #E6EBF1; .mu-none padding 28 20,
//               b EB Garamond 500 20/29 --ink, small 13.5/19.575 #7A8494 margin-top 4
//   .mu-foot    margin-top 26, EB Garamond italic 15.5/22.475 #98A1AD, centred
import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Defs, G, Pattern, Rect } from 'react-native-svg';
import { act } from '../../actions';
import { Backdrop, Icon } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import { MT } from '../../data';
import { useTabScroll } from '../../shell/tabScroll';
import { setS, useStore } from '../../store';
import { font, fontPx, Txt, useInsets } from '../../theme';
import { MenuTile } from './menu/MenuTile';
import type { TileKind } from './menu/MenuTile';
import { mAct, menuHits, mStat } from './menu/menuLogic';
import type { MStatInput } from './menu/menuLogic';
import { MeRow } from './profile/MeRow';

const INK = '#14161C';

function Deco(): React.JSX.Element {
  return (
    <View style={styles.deco} pointerEvents="none">
      <Svg width={210} height={168} viewBox="0 0 200 160">
        <G fill="none" stroke="#fff" strokeWidth={1.4}>
          {Array.from({ length: 12 }, (_, i) => (
            <Rect key={i} x={(i % 4) * 48 + 6} y={Math.floor(i / 4) * 48 + 6} width={38} height={38} rx={i % 3 ? 10 : 19} />
          ))}
        </G>
      </Svg>
    </View>
  );
}

function Hero(): React.JSX.Element {
  const q = useStore(s => s.menuQ);
  const pqbI = useStore(s => s.pqb.i);
  const { sat } = useInsets();
  const jump: readonly (readonly [string, IconName, string])[] = [
    ['push:pqb', 'list', `Question ${pqbI + 1}`],
    ['push:syllabus', 'hash', 'Syllabus'],
    ['push:mains', 'pen', 'Evaluate'],
  ];
  return (
    <View style={[styles.hero, { paddingTop: sat + 14 }]}>
      <Deco />
      <View>
        <Txt style={styles.eb}>Your toolkit · {Object.keys(MT).length} tools</Txt>
        <Txt style={styles.h1}>Menu</Txt>
      </View>
      <View style={styles.search}>
        <Backdrop px={8} tint="rgba(255,255,255,0.12)" />
        <Icon name="search" size={18} color="#C9C1FF" />
        <TextInput
          allowFontScaling={false}
          style={styles.input}
          value={q}
          // window.menuFilter (L7713): S.menuQ = v; #menuBody is rebuilt
          onChangeText={v => setS({ menuQ: v })}
          placeholder="Find a tool — mindmap, mains, vault…"
          placeholderTextColor="rgba(255,255,255,0.55)"
          autoComplete="off"
          autoCorrect={false}
          testID="menu.search"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jumpScroll} contentContainerStyle={styles.jump}>
        <Txt style={styles.jumpLab}>Jump back in</Txt>
        {jump.map(([a, ic, l]) => (
          <Pressable key={a} style={styles.jumpBtn} onPress={() => act(a)} testID={`menu.jump.${a.slice(5)}`}>
            <Icon name={ic} size={15} color="#FFD27A" />
            <Txt style={styles.jumpT}>{l}</Txt>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function MuH({ title, sub }: { title: string; sub: string }): React.JSX.Element {
  return (
    <View style={styles.muH}>
      <Txt style={styles.h2}>{title}</Txt>
      <Txt style={styles.muHSpan}>{sub}</Txt>
    </View>
  );
}

/** .mu-up background: repeating-linear-gradient(135deg, transparent 0 10px, rgba(245,160,31,.05) 10px 20px) */
function UpStripes(): React.JSX.Element {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id="muUp" patternUnits="userSpaceOnUse" width={20} height={20} patternTransform="rotate(45)">
          <Rect x={10} y={0} width={10} height={20} fill="rgba(245,160,31,0.05)" />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#muUp)" />
    </Svg>
  );
}

function Body(): React.JSX.Element {
  const menuQ = useStore(s => s.menuQ);
  const x: MStatInput = {
    pqbDone: useStore(s => s.pqb.done),
    tqLib: useStore(s => s.tq.lib.length),
    sylDone: useStore(s => s.sylDone),
    saved: useStore(s => s.saved.size),
    savedLinks: useStore(s => s.savedLinks.length),
    docs: useStore(s => s.DOCS),
    maps: useStore(s => s.maps.length),
  };
  const q = menuQ.trim().toLowerCase();
  if (q) {
    const hits = menuHits(q);
    return hits.length ? (
      <View style={styles.res}>
        {hits.map((id, i) => (
          <MeRow
            key={id}
            first={i === 0}
            icon={MT[id].ic as IconName}
            c={MT[id].c}
            title={MT[id].n}
            sub={MT[id].d}
            onPress={() => act(mAct(id))}
            testID={`menu.hit.${id}`}
          />
        ))}
      </View>
    ) : (
      <View style={styles.none}>
        <Txt style={styles.noneB}>No tool called “{menuQ.replace(/</g, '')}”</Txt>
        <Txt style={styles.noneS}>Try “notes”, “quiz” or “upload”.</Txt>
      </View>
    );
  }
  const tile = (id: string, kind?: TileKind, art?: 'omr' | 'hand'): React.JSX.Element => (
    <MenuTile key={id} id={id} kind={kind} art={art} stat={mStat(id, x)} style={styles.cell} />
  );
  return (
    <>
      <View style={styles.sec}>
        <MuH title="Practice" sub="MCQs, mocks & Mains" />
        <View style={styles.row}>
          {tile('pqb', 'big', 'omr')}
          <View style={styles.col}>
            {tile('mains', 'tint', 'hand')}
            {tile('testquiz', 'tint')}
          </View>
        </View>
        <View style={styles.wideRow}>{tile('answerbank', 'wide')}</View>
      </View>
      <View style={styles.sec}>
        <MuH title="Read & revise" sub="News, notes and the syllabus" />
        <View style={styles.row}>
          {tile('current')}
          {tile('notesys')}
        </View>
        <View style={[styles.row, styles.rowGap]}>
          {tile('syllabus')}
          {tile('saved')}
        </View>
      </View>
      <View style={styles.sec}>
        <MuH title="Your library" sub="Everything you’ve stored" />
        <Pressable style={styles.up} onPress={() => act('push:upload')} testID="menu.upload">
          <UpStripes />
          <View style={styles.upi}>
            <Icon name="upload" size={20} color="#fff" />
          </View>
          <View style={styles.flex1}>
            <Txt style={styles.upB}>Upload to Cloud</Txt>
            <Txt style={styles.upS}>Drop a PDF, a scan, or write a quick note</Txt>
          </View>
          <View style={styles.upEm}>
            <Icon name="plus" size={20} color="#B86E00" />
          </View>
        </Pressable>
        <View style={styles.row}>
          {tile('cloud')}
          {tile('tracker')}
        </View>
      </View>
      <View style={styles.sec}>
        <MuH title="AI tools" sub="Powered by your credits" />
        <View style={styles.row}>
          {tile('querydb', 'ai')}
          {tile('mindmaps', 'ai')}
        </View>
      </View>
      <Txt style={styles.foot}>Every tool, one tap away.</Txt>
    </>
  );
}

function MenuTab(): React.JSX.Element {
  const scroll = useTabScroll('menu');
  return (
    <ScrollView {...scroll} style={styles.pane} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" testID="menu.scroll">
      <Hero />
      <Body />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pane: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  flex1: { flex: 1, minWidth: 0 },
  hero: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    backgroundImage:
      'radial-gradient(80% 60% at 100% 0%, rgba(108,93,211,0.55), transparent 62%), radial-gradient(60% 60% at 0% 100%, rgba(14,154,138,0.35), transparent 70%), linear-gradient(160deg, #101E3C 0%, #1A2F5E 55%, #25418A 100%)',
  },
  deco: { position: 'absolute', right: -30, top: -18, opacity: 0.12, transform: [{ rotate: '-8deg' }] },
  // inline span: its line box takes the div's 22.475
  eb: { ...font('sans', 700), fontSize: 10.5, lineHeight: 22.475, letterSpacing: 1.68, textTransform: 'uppercase', color: '#C9C1FF' },
  h1: { ...font('book', 500), fontSize: 34, lineHeight: 34, color: '#fff', marginTop: 6 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 46,
    marginTop: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  input: { flex: 1, minWidth: 0, padding: 0, margin: 0, height: 21.025, ...font('sans', 400), fontSize: fontPx(14.5), color: '#fff' },
  jumpScroll: { marginTop: 14, marginRight: -20 },
  jump: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingRight: 20 },
  jumpLab: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: 'rgba(255,255,255,0.6)' },
  jumpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  jumpT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#fff' },
  sec: { marginTop: 28 },
  muH: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  h2: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: INK },
  muHSpan: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 4 },
  row: { flexDirection: 'row', gap: 10 },
  rowGap: { marginTop: 10 },
  col: { flex: 1, gap: 10 },
  wideRow: { marginTop: 10, flexDirection: 'row' },
  cell: { flex: 1 },
  up: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1.5px #F5D59A',
  },
  upi: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(140deg, #F5A01F, #E8890C)',
    boxShadow: '0px 10px 18px -10px rgba(232, 137, 12, 0.9)',
  },
  upB: { ...font('sans', 700), fontSize: 15.5, lineHeight: 22.475, color: INK },
  upS: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
  upEm: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF3DF', alignItems: 'center', justifyContent: 'center' },
  res: { marginTop: 18, backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  none: { marginTop: 18, paddingVertical: 28, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E6EBF1' },
  noneB: { ...font('book', 500), fontSize: 20, lineHeight: 29, textAlign: 'center' },
  noneS: { fontSize: 13.5, lineHeight: 19.575, color: '#7A8494', marginTop: 4, textAlign: 'center' },
  foot: { ...font('book', 400, true), fontSize: 15.5, lineHeight: 22.475, color: '#98A1AD', textAlign: 'center', marginTop: 26 },
});

export default MenuTab;
