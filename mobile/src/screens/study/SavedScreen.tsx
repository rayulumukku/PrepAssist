// Source: PrepAssist.html L7908-L7915 (VIEWS.saved), L8025 (liftFloat), L4222-L4232 (.sv-tip, .sv-card, .sv-src, .sv-rm, .sv-fab), L3454-L3459 (.py-empty, .py-cta), L9312-L9347 (ds overrides)
// Computed (reference/android/view-saved, -empty, -with-link):
//   .me-page.tlp.sv  padding 4 20 40
//   .sv-tip   row, gap 10, padding 12 14, radius 18, #F0F6FD, box-shadow 0 0 0 1px #D6E6F7, margin-bottom 6
//             ic share 18px #1B8AD3, margin-top 1; p 12.5px / 18.125px #2B4A69 (b 700)
//   .sv-card  row centred, gap 12, margin-top 12, padding 13, radius 18, #fff, box-shadow 0 0 0 1px #E6EBF1
//             .sv-src 28 x 28 (.cx-mg); small Inter 600 11.5px / 16.675px #8A93A0; b EB Garamond 500 16.5px / 20.625px
//             #14161C, margin-top 3; .sv-rm 34 round #FDECEC, ic 16px #B42318 filled (L4229 `use{fill:currentColor}`)
//   .py-empty column centred, margin-top 16, padding 26 22 22, radius 18, #fff, box-shadow 0 0 0 1px #E6EBF1
//             svg 160 x 128; b EB Garamond 500 22px / 31.9px #14161C margin-top 6; p 13.5px / 20.25px #7A8494 max 260, margin-top 6
//             .py-cta row, gap 7, 46 high, padding 0 20, margin-top 18, radius 14, #14161C; Inter 600 14.5px / 21.025px #fff; ic 16 #FFD27A
//   .sv-fab   absolute right 20, bottom 28 + --sab, 56 x 56, radius 18, linear-gradient(140deg, #D63A2F, #B42318),
//             box-shadow 0 16px 26px -12px rgba(180,35,24,.8); ic plus 24px #fff.
// liftFloat moves the FAB from the scroller to the page. The shell gives a non-focus view no slot outside
// its scroller, so the FAB is placed at the page's bottom edge measured from the top of the content: it is
// exact while the list does not scroll (all captured states) and scrolls with the content otherwise
// (needs a shell slot for page-level floats to be exact: reported).
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { act } from '../../actions';
import { Icon, pageHeaderHeight } from '../../components';
import { ARTICLES } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { useAppSize } from '../../shell/AppSize';
import { useStore } from '../../store';
import { font, Txt, useInsets } from '../../theme';
import { SrcMg } from './common/SrcMg';
import { TlHero } from './maps/TlHero';

const styles = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  tip: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: '#F0F6FD',
    boxShadow: '0px 0px 0px 1px #D6E6F7',
    marginBottom: 6,
  },
  tipIc: { marginTop: 1 },
  tipP: { flex: 1, fontSize: 12.5, lineHeight: 18.125, color: '#2B4A69' },
  tipB: { ...font('sans', 700) },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 13,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  src: { width: 28, height: 28, flexShrink: 0 },
  body: { flex: 1, minWidth: 0 },
  small: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#8A93A0' },
  b: { ...font('book', 500), fontSize: 16.5, lineHeight: 20.625, color: '#14161C', marginTop: 3 },
  rm: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FDECEC', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  empty: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 26,
    paddingHorizontal: 22,
    paddingBottom: 22,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  emptyB: { ...font('book', 500), fontSize: 22, lineHeight: 31.9, color: '#14161C', marginTop: 6, textAlign: 'center' },
  emptyP: { fontSize: 13.5, lineHeight: 20.25, color: '#7A8494', marginTop: 6, maxWidth: 260, textAlign: 'center' },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 7, height: 46, paddingHorizontal: 20, marginTop: 18, borderRadius: 14, backgroundColor: '#14161C' },
  ctaT: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: '#FFFFFF' },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(140deg, #D63A2F, #B42318)',
    boxShadow: '0px 16px 26px -12px rgba(180, 35, 24, 0.8)',
    zIndex: 9,
  },
});

function SavedScreen(): React.JSX.Element {
  const saved = useStore(s => s.saved);
  const L = useStore(s => s.savedLinks);
  const { h } = useAppSize();
  const { sat, sab } = useInsets();
  const arts = ARTICLES.filter(a => saved.has(a.id));
  const n = arts.length + L.length;
  // The Screen sits in the shell's scroll content (paddingTop = .ph height, paddingBottom 100). The FAB is a
  // sibling of the page, positioned in that content box; the page is made at least as tall as the visible area so
  // the FAB stays inside the content box (Android only delivers touches inside a parent's bounds).
  const fabTop = h - sab - 28 - 56;
  return (
    <>
    <View style={[styles.page, { minHeight: h - pageHeaderHeight(sat) - 100 }]}>
      <TlHero
        id="saved"
        title="Your reading list"
        sub={`${n} saved · ${arts.reduce((x, a) => x + a.min, 0)} min of reading`}
        stats={[
          { v: arts.length, l: 'from Current' },
          { v: L.length, l: 'web links' },
        ]}
      />
      <View style={styles.tip}>
        <Icon name="share" size={18} color="#1B8AD3" style={styles.tipIc} />
        <Txt style={styles.tipP}>
          Tap <Txt style={styles.tipB}>+</Txt> to paste a link. On iPhone, use Share → Copy Link, then paste it here. A Share extension is coming soon.
        </Txt>
      </View>
      {n ? (
        <>
          {arts.map(a => (
            <Pressable key={a.id} style={styles.card} onPress={() => act('article', a.id)} testID={`saved.article.${a.id}`}>
              <View style={styles.src}>
                <SrcMg src={a.src} />
              </View>
              <View style={styles.body}>
                <Txt style={styles.small}>{`${a.src} · ${a.gs} · ${a.min} min`}</Txt>
                <Txt style={styles.b}>{a.t}</Txt>
              </View>
              <Pressable style={styles.rm} onPress={() => act('svRm', a.id)} accessibilityLabel="Remove" testID={`saved.rm.${a.id}`}>
                <Icon name="bookmark" size={16} color="#B42318" fill="#B42318" />
              </Pressable>
            </Pressable>
          ))}
          {L.map((l, i) => (
            <View key={`${l.u}.${i}`} style={styles.card} testID={`saved.link.${i}`}>
              <View style={styles.src}>
                <SrcMg color="#475467">
                  <Icon name="link" color="#FFFFFF" />
                </SrcMg>
              </View>
              <View style={styles.body}>
                <Txt style={styles.small}>{`${l.dom} · added ${l.d}`}</Txt>
                <Txt style={styles.b}>{l.t}</Txt>
              </View>
              <Pressable style={styles.rm} onPress={() => act('svRmL', String(i))} accessibilityLabel="Remove" testID={`saved.rmL.${i}`}>
                <Icon name="close" size={16} color="#B42318" fill="#B42318" />
              </Pressable>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.empty} testID="saved.empty">
          <Svg width={160} height={128} viewBox="0 0 120 96">
            <Circle cx={60} cy={48} r={40} fill="#FDECEC" />
            <Path d="M46 28h28v42l-14-10-14 10Z" fill="#fff" stroke="#B42318" strokeWidth={3} strokeLinejoin="round" />
          </Svg>
          <Txt style={styles.emptyB}>No saved articles yet</Txt>
          <Txt style={styles.emptyP}>Bookmark stories in Current, or paste a link from any app.</Txt>
          <Pressable style={styles.cta} onPress={() => act('tab', 'current')}>
            <Icon name="current" size={16} color="#FFD27A" />
            <Txt style={styles.ctaT}>Open today’s edition</Txt>
          </Pressable>
        </View>
      )}
    </View>
    <Pressable style={[styles.fab, { top: fabTop }]} onPress={() => act('svAdd')} accessibilityLabel="Add a link" testID="saved.fab">
      <Icon name="plus" size={24} color="#FFFFFF" />
    </Pressable>
    </>
  );
}

const view: ViewDef = {
  useTitle: () => 'Saved Articles',
  Screen: SavedScreen,
};

export default view;
