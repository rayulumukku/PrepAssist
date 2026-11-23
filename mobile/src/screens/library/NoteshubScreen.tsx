// Source: PrepAssist.html L8327-L8340 (VIEWS.noteshub)
// Source: PrepAssist.html L4245-L4280 (.nh-grid, .nh-card, .lx-scan)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import { NOTES, NOTESYS, SUBJ } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { useStore, setS } from '../../store';
import { font, Txt } from '../../theme';
import { SySearch, TlHero } from './parts';

function NoteshubScreen(): React.JSX.Element {
  const nh = useStore(s => s.nh);
  const q = (nh.q || '').toLowerCase();
  const subs = [...new Set(NOTES.map(n => n.s))];
  const mine = NOTES.filter(
    n => (nh.s === 'all' || n.s === nh.s) && (!q || (n.t + n.b).toLowerCase().includes(q))
  );

  return (
    <View style={s.page} testID="view.noteshub">
      <TlHero
        tc="#6C5DD3"
        icon="notes"
        eb="Notes"
        title="Your notes, "
        em="in one place"
        sub="Your own notes, scanned pages and verified faculty compendiums — all searchable and ready for AI."
        stats={[
          [NOTES.length, 'my notes'],
          [NOTESYS.length, 'compendiums'],
          [48, 'this month'],
        ]}
      />

      <View style={s.segRow}>
        <Pressable
          style={[s.segBtn, nh.tab === 'mine' && s.segBtnOn]}
          onPress={() => act('nhTab', 'mine')}
          testID="noteshub.tab.mine"
        >
          <Icon name="pen" size={14} color={nh.tab === 'mine' ? '#6C5DD3' : '#7A8494'} />
          <Txt style={[s.segTx, nh.tab === 'mine' && s.segTxOn]}>My notes</Txt>
        </Pressable>
        <Pressable
          style={[s.segBtn, nh.tab === 'fac' && s.segBtnOn]}
          onPress={() => act('nhTab', 'fac')}
          testID="noteshub.tab.fac"
        >
          <Icon name="spark" size={14} color={nh.tab === 'fac' ? '#6C5DD3' : '#7A8494'} />
          <Txt style={[s.segTx, nh.tab === 'fac' && s.segTxOn]}>Faculty notes</Txt>
        </Pressable>
      </View>

      {nh.tab === 'mine' ? (
        <View style={s.mineWrap}>
          <SySearch
            placeholder="Search your notes…"
            value={nh.q}
            onChangeText={v => setS(st => ({ nh: { ...st.nh, q: v } }))}
            testID="noteshub.search"
          />

          <View style={s.chRow}>
            <Pressable
              style={[s.chip, nh.s === 'all' && s.chipOn]}
              onPress={() => act('nhS', 'all')}
              testID="noteshub.chip.all"
            >
              <Txt style={[s.chipTx, nh.s === 'all' && s.chipTxOn]}>All</Txt>
            </Pressable>
            {subs.map(subjKey => {
              const isOn = nh.s === subjKey;
              const subjObj = SUBJ[subjKey as keyof typeof SUBJ];
              const name = subjObj ? subjObj.n : subjKey;
              return (
                <Pressable
                  key={subjKey}
                  style={[s.chip, isOn && s.chipOn]}
                  onPress={() => act('nhS', subjKey)}
                  testID={`noteshub.chip.${subjKey}`}
                >
                  <Txt style={[s.chipTx, isOn && s.chipTxOn]}>{name}</Txt>
                </Pressable>
              );
            })}
          </View>

          <Pressable style={s.scanBtn} onPress={() => act('lxScanNote')} testID="noteshub.scan">
            <Icon name="camera" size={20} color="#6C5DD3" />
            <View style={s.scanInfo}>
              <Txt style={s.scanB}>Scan handwritten notes</Txt>
              <Txt style={s.scanSm}>We’ll turn a photo into searchable text</Txt>
            </View>
            <Icon name="arrow" size={16} color="#6C5DD3" />
          </Pressable>

          <View style={s.grid}>
            {mine.map(n => {
              const subjObj = SUBJ[n.s as keyof typeof SUBJ];
              return (
                <Pressable
                  key={n.id}
                  style={s.noteCard}
                  onPress={() => act('push', `note:${n.id}`)}
                  testID={`noteshub.note.${n.id}`}
                >
                  <Txt style={s.noteSubj}>{subjObj ? subjObj.n : n.s}</Txt>
                  <Txt style={s.noteTitle} numberOfLines={2}>{n.t}</Txt>
                  <Txt style={s.noteBody} numberOfLines={2}>{n.b}</Txt>
                  <View style={s.noteFt}>
                    <Icon name="clock" size={11} color="#7A8494" />
                    <Txt style={s.noteWhen}>{n.when}</Txt>
                  </View>
                </Pressable>
              );
            })}
            <Pressable
              style={s.newCard}
              onPress={() => act('push', 'note:new')}
              testID="noteshub.newCard"
            >
              <View style={s.newPlus}>
                <Icon name="plus" size={18} color="#6C5DD3" />
              </View>
              <Txt style={s.newTx}>New note</Txt>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={s.facWrap}>
          {NOTESYS.map(n => (
            <Pressable
              key={n.id}
              style={[s.facCard, { borderLeftColor: n.c, borderLeftWidth: 4 }]}
              onPress={() => act('push', `note2:${n.id}`)}
              testID={`noteshub.fac.${n.id}`}
            >
              <View style={s.facTp}>
                <View style={s.facSubj}>
                  <Icon name="learn" size={12} color="#3B5BCC" />
                  <Txt style={s.facSubjTx}>{n.subj}</Txt>
                </View>
                <View style={s.facTag}>
                  <Txt style={s.facTagTx}>{n.tag}</Txt>
                </View>
              </View>
              <Txt style={s.facTitle}>{n.t}</Txt>
              <View style={s.facFt}>
                <View style={s.facTime}>
                  <Icon name="clock" size={12} color="#7A8494" />
                  <Txt style={s.facTimeTx}>{`${n.min} min read · ${n.date}`}</Txt>
                </View>
                <View style={s.facLink}>
                  <Txt style={s.facLinkTx}>Read note</Txt>
                  <Icon name="arrow" size={12} color="#1B8AD3" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Pressable
        style={s.fab}
        onPress={() => act('push', 'note:new')}
        testID="noteshub.fab"
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingBottom: 64, position: 'relative' },
  segRow: { flexDirection: 'row', padding: 4, borderRadius: 14, backgroundColor: '#F1F4F8', marginBottom: 12 },
  segBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 10 },
  segBtnOn: { backgroundColor: '#FFFFFF', boxShadow: '0px 2px 6px rgba(0,0,0,0.06)' },
  segTx: { ...font('sans', 600), fontSize: 13, color: '#7A8494' },
  segTxOn: { color: '#6C5DD3' },
  mineWrap: { gap: 10 },
  chRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF2' },
  chipOn: { backgroundColor: '#EEEAFF', borderColor: '#6C5DD3' },
  chipTx: { ...font('sans', 600), fontSize: 12, color: '#4A505B' },
  chipTxOn: { color: '#6C5DD3' },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#F5F3FF', borderWidth: 1, borderColor: '#E5E1FA' },
  scanInfo: { flex: 1 },
  scanB: { ...font('sans', 700), fontSize: 13.5, color: '#14161C' },
  scanSm: { fontSize: 11.5, color: '#7A8494', marginTop: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  noteCard: { width: '48%', padding: 12, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  noteSubj: { ...font('sans', 700), fontSize: 10.5, color: '#7A8494', textTransform: 'uppercase' },
  noteTitle: { ...font('sans', 700), fontSize: 13.5, color: '#14161C', marginTop: 4 },
  noteBody: { fontSize: 12, lineHeight: 16, color: '#5B6472', marginTop: 4 },
  noteFt: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  noteWhen: { fontSize: 10.5, color: '#7A8494' },
  newCard: { width: '48%', minHeight: 110, borderRadius: 16, backgroundColor: '#F8F9FD', borderWidth: 1.5, borderColor: '#E2E6F2', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 6 },
  newPlus: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EEEAFF', alignItems: 'center', justifyContent: 'center' },
  newTx: { ...font('sans', 700), fontSize: 13, color: '#6C5DD3' },
  facWrap: { gap: 10 },
  facCard: { padding: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  facTp: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  facSubj: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  facSubjTx: { ...font('sans', 700), fontSize: 11, color: '#3B5BCC', textTransform: 'uppercase' },
  facTag: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: '#F1F4F8' },
  facTagTx: { ...font('sans', 700), fontSize: 10.5, color: '#7A8494' },
  facTitle: { ...font('book', 500), fontSize: 17, lineHeight: 21, color: '#14161C', marginVertical: 8 },
  facFt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F8F9FA' },
  facTime: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  facTimeTx: { fontSize: 11.5, color: '#7A8494' },
  facLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  facLinkTx: { ...font('sans', 700), fontSize: 12, color: '#1B8AD3' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 18, backgroundColor: '#6C5DD3', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 8px 16px rgba(108,93,211,0.4)' },
});

const view: ViewDef = {
  useTitle: () => 'Notes',
  Screen: NoteshubScreen,
};

export default view;
