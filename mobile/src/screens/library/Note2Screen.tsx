// Source: PrepAssist.html L8006-L8006 (VIEWS.note2)
// Source: PrepAssist.html L8028-L8054 (nrHTML)
// Source: PrepAssist.html L8055-L8059 (nrMount)
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, RichText } from '../../components';
import type { RichTextStyles } from '../../components';
import { NOTESYS } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt, useInsets } from '../../theme';

const bodyRichStyles: RichTextStyles = {
  base: { fontSize: 14, lineHeight: 22, color: '#25272D' },
  b: font('sans', 700),
  p: { marginTop: 6 },
  ul: { paddingLeft: 18, marginTop: 6 },
  li: { fontSize: 14, lineHeight: 22, color: '#25272D', marginTop: 4 },
  first: { p: { marginTop: 0 }, ul: { marginTop: 0 } },
};

function Note2Screen({ arg }: ViewProps): React.JSX.Element {
  const { sat, sab } = useInsets();
  const id = arg || 'ns1';
  const n = NOTESYS.find(x => x.id === id) || NOTESYS[0];
  const idx = NOTESYS.indexOf(n);
  const nx = NOTESYS[(idx + 1) % NOTESYS.length];

  const nsSaved = useStore(s => s.nsSaved);
  const isSaved = nsSaved.has(id);

  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<any>(null);

  const handleScroll = (event: { nativeEvent: { contentOffset: { y: number }; contentSize: { height: number }; layoutMeasurement: { height: number } } }): void => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScroll = contentSize.height - layoutMeasurement.height;
    if (maxScroll > 0) {
      const p = Math.min(100, Math.max(0, (contentOffset.y / maxScroll) * 100));
      setProgress(p);
    }
  };

  return (
    <View style={s.root} testID="view.note2">
      <View style={[s.topBar, { paddingTop: sat, height: 48 + sat }]}>
        <Pressable style={s.topIb} onPress={() => act('back')} testID="note2.back">
          <Icon name="back" size={18} color="#14161C" />
        </Pressable>
        <View style={s.srcWrap}>
          <Icon name="logo" size={16} color="#1B8AD3" />
          <Txt style={s.srcTx}>PrepAssist Notes</Txt>
        </View>
        <Pressable
          style={[s.topIb, isSaved && s.saveOn]}
          onPress={() => act('nrSave', id)}
          testID="note2.save"
        >
          <Icon name="bookmark" size={18} color={isSaved ? '#1B8AD3' : '#14161C'} />
        </Pressable>
        <Pressable style={s.topIb} onPress={() => act('nrDl', id)} testID="note2.download">
          <Icon name="download" size={18} color="#14161C" />
        </Pressable>
        <View style={s.progTrack}>
          <View style={[s.progFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={s.scroller}
        contentContainerStyle={s.scrollerContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.hero}>
          <View style={[s.heroBadge, { backgroundColor: n.c }]}>
            <Icon name={n.ic as any} size={13} color="#FFFFFF" />
            <Txt style={s.heroBadgeTx}>{n.subj}</Txt>
          </View>
          <Txt style={s.h1}>{n.t}</Txt>
          <View style={s.metaRow}>
            <View style={s.metaItem}>
              <Icon name="clock" size={12} color="#7A8494" />
              <Txt style={s.metaTx}>{`${n.min} min read`}</Txt>
            </View>
            <Txt style={s.metaTag}>{n.tag}</Txt>
            {n.pyq ? (
              <View style={s.metaItem}>
                <Icon name="target" size={12} color="#6C5DD3" />
                <Txt style={[s.metaTx, { color: '#6C5DD3' }]}>{`${n.pyq} PYQs linked`}</Txt>
              </View>
            ) : null}
          </View>
          <View style={s.verBox}>
            <Icon name="shield" size={18} color="#2F8A4A" />
            <View style={s.verTxt}>
              <Txt style={s.verB}>Verified faculty compendium</Txt>
              <Txt style={s.verSm}>{`Published ${n.date} · reviewed by the PrepAssist faculty`}</Txt>
            </View>
          </View>
        </View>

        <View style={s.glanceBox}>
          <View style={s.glanceH}>
            <Icon name="spark" size={14} color="#6C5DD3" />
            <Txt style={s.glanceHTx}>At a glance</Txt>
          </View>
          {n.glance.map((g, gi) => (
            <View key={gi} style={s.glanceRow}>
              <Txt style={s.glanceNum}>{`${gi + 1}.`}</Txt>
              <Txt style={s.glanceTx}>{g}</Txt>
            </View>
          ))}
        </View>

        <View style={s.tocBox}>
          <Txt style={s.tocH}>IN THIS NOTE</Txt>
          <View style={s.tocList}>
            {n.sec.map((sec, ki) => (
              <Pressable
                key={ki}
                style={s.tocBtn}
                onPress={() => act('nrJump', String(ki))}
                testID={`note2.toc.${ki}`}
              >
                <View style={[s.tocIdx, sec[2] === 'trap' && s.tocIdxTrap]}>
                  <Txt style={s.tocIdxTx}>{sec[2] === 'trap' ? '!' : String(ki + 1)}</Txt>
                </View>
                <Txt style={s.tocTitle} numberOfLines={1}>{sec[0]}</Txt>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={s.sectionsWrap}>
          {n.sec.map((sec, ki) => {
            const isTrap = sec[2] === 'trap';
            return (
              <View key={ki} style={[s.secBox, isTrap && s.secTrap]}>
                <View style={s.secH}>
                  <View style={[s.secNumBadge, isTrap && s.secNumTrap]}>
                    <Txt style={s.secNumTx}>{isTrap ? '!' : String(ki + 1).padStart(2, '0')}</Txt>
                  </View>
                  <Txt style={s.secTitle}>{sec[0]}</Txt>
                </View>
                {sec[2] === 'grid' && Array.isArray(sec[1]) ? (
                  <View style={s.gridWrap}>
                    {sec[1].map(([a, b], idx2) => (
                      <View key={idx2} style={s.gridItem}>
                        <Txt style={s.gridB}>{a}</Txt>
                        <Txt style={s.gridSm}>{b}</Txt>
                      </View>
                    ))}
                  </View>
                ) : (
                  <RichText html={String(sec[1])} styles={bodyRichStyles} />
                )}
              </View>
            );
          })}
        </View>

        <View style={s.endWrap}>
          {n.pyq ? (
            <Pressable style={s.testBtn} onPress={() => act('nrTest')} testID="note2.test">
              <Icon name="test" size={20} color="#6C5DD3" />
              <View style={s.testInfo}>
                <Txt style={s.testB}>Test yourself</Txt>
                <Txt style={s.testSm}>5 quick MCQs from this note</Txt>
              </View>
              <Icon name="arrow" size={16} color="#6C5DD3" />
            </Pressable>
          ) : null}

          <Pressable style={s.nextBtn} onPress={() => act('nrNext', nx.id)} testID="note2.next">
            <View style={s.nextInfo}>
              <Txt style={s.nextSm}>{`Up next · ${nx.subj}`}</Txt>
              <Txt style={s.nextB} numberOfLines={1}>{nx.t}</Txt>
            </View>
            <Icon name="arrow" size={18} color="#14161C" />
          </Pressable>
        </View>
      </ScrollView>

      <View style={[s.dock, { paddingBottom: Math.max(6, sab) }]}>
        <Pressable style={s.dockBtn} onPress={() => act('mentor')} testID="note2.dock.ask">
          <Icon name="spark" size={18} color="#6C5DD3" />
          <Txt style={s.dockTx}>Ask</Txt>
        </Pressable>
        <Pressable style={s.dockBtn} onPress={() => act('nrTest')} testID="note2.dock.practise">
          <Icon name="test" size={18} color="#3B5BCC" />
          <Txt style={s.dockTx}>Practise</Txt>
        </Pressable>
        <Pressable
          style={s.dockBtn}
          onPress={() => act('toast', '8 flashcards made from this note')}
          testID="note2.dock.fc"
        >
          <Icon name="layers" size={18} color="#E8890C" />
          <Txt style={s.dockTx}>Flashcards</Txt>
        </Pressable>
        <Pressable style={s.dockBtn} onPress={() => act('nrDl', id)} testID="note2.dock.pdf">
          <Icon name="download" size={18} color="#14161C" />
          <Txt style={s.dockTx}>PDF</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#F1F4F8', position: 'relative' },
  topIb: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  saveOn: {},
  srcWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  srcTx: { ...font('sans', 700), fontSize: 13, color: '#14161C' },
  progTrack: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, backgroundColor: '#F1F4F8' },
  progFill: { height: '100%', backgroundColor: '#1B8AD3' },
  scroller: { flex: 1 },
  scrollerContent: { paddingHorizontal: 16, paddingBottom: 64 },
  hero: { paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F4F8' },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  heroBadgeTx: { ...font('sans', 700), fontSize: 11, color: '#FFFFFF' },
  h1: { ...font('book', 500), fontSize: 24, lineHeight: 28, color: '#14161C', marginVertical: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTx: { fontSize: 12, color: '#7A8494' },
  metaTag: { ...font('sans', 600), fontSize: 11.5, color: '#4A505B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, backgroundColor: '#F1F4F8' },
  verBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, backgroundColor: '#F3F9F5', marginTop: 14 },
  verTxt: { flex: 1 },
  verB: { ...font('sans', 700), fontSize: 12.5, color: '#1B6A3A' },
  verSm: { fontSize: 11, color: '#5A7F67', marginTop: 1 },
  glanceBox: { padding: 14, borderRadius: 16, backgroundColor: '#F8F9FD', marginVertical: 14 },
  glanceH: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  glanceHTx: { ...font('sans', 700), fontSize: 12.5, color: '#6C5DD3' },
  glanceRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  glanceNum: { ...font('sans', 700), fontSize: 12.5, color: '#6C5DD3' },
  glanceTx: { flex: 1, fontSize: 13, lineHeight: 18, color: '#3A404B' },
  tocBox: { marginBottom: 16 },
  tocH: { ...font('sans', 800), fontSize: 10.5, letterSpacing: 1.4, color: '#8A93A0', marginBottom: 8 },
  tocList: { gap: 6 },
  tocBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  tocIdx: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#F1F4F8', alignItems: 'center', justifyContent: 'center' },
  tocIdxTrap: { backgroundColor: '#FDECEC' },
  tocIdxTx: { ...font('sans', 700), fontSize: 11, color: '#14161C' },
  tocTitle: { flex: 1, fontSize: 13, color: '#4A505B' },
  sectionsWrap: { gap: 18 },
  secBox: { paddingVertical: 10 },
  secTrap: { padding: 12, borderRadius: 14, backgroundColor: '#FFF7F7', borderWidth: 1, borderColor: '#FADBD8' },
  secH: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  secNumBadge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: '#F1F4F8' },
  secNumTrap: { backgroundColor: '#FDECEC' },
  secNumTx: { ...font('sans', 700), fontSize: 11, color: '#14161C' },
  secTitle: { ...font('book', 600), fontSize: 18, color: '#14161C', flex: 1 },
  secBody: { fontSize: 14, lineHeight: 22, color: '#25272D' },
  gridWrap: { gap: 8 },
  gridItem: { padding: 10, borderRadius: 10, backgroundColor: '#F8F9FA' },
  gridB: { ...font('sans', 700), fontSize: 13, color: '#14161C' },
  gridSm: { fontSize: 12, color: '#5B6472', marginTop: 2 },
  endWrap: { marginTop: 24, gap: 10 },
  testBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#E5E1FA' },
  testInfo: { flex: 1 },
  testB: { ...font('sans', 700), fontSize: 14, color: '#6C5DD3' },
  testSm: { fontSize: 12, color: '#7A8494', marginTop: 1 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  nextInfo: { flex: 1 },
  nextSm: { fontSize: 11.5, color: '#7A8494' },
  nextB: { ...font('book', 600), fontSize: 15, color: '#14161C', marginTop: 2 },
  dock: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F4F8', backgroundColor: '#FFFFFF', paddingVertical: 6 },
  dockBtn: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  dockTx: { ...font('sans', 600), fontSize: 10.5, color: '#5B6472', marginTop: 2 },
});

const view: ViewDef = {
  Screen: Note2Screen,
};

export default view;
