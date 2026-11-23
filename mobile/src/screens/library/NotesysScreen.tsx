// Source: PrepAssist.html L7997-L8005 (VIEWS.notesys)
// Source: PrepAssist.html L4165-L4190 (.ns-card, .ns-tp, .ns-ft)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import { NOTESYS } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { useStore, setS } from '../../store';
import { font, Txt } from '../../theme';
import { SySearch, TlHero } from './parts';

function NotesysScreen(): React.JSX.Element {
  const nsys = useStore(s => s.nsys);
  const subs = ['All', ...new Set(NOTESYS.map(n => n.subj))];
  const q = (nsys.q || '').toLowerCase();
  const list = NOTESYS.filter(
    n => (nsys.subj === 'All' || n.subj === nsys.subj) && (!q || (n.t + n.subj).toLowerCase().includes(q))
  );

  return (
    <View style={s.page} testID="view.notesys">
      <TlHero
        tc="#C8622B"
        icon="doc"
        eb="Notes System"
        title="Official "
        em="compendiums"
        sub="Verified subject synopses and standard-book extracts, written by PrepAssist faculty."
        stats={[
          [NOTESYS.length, 'compendiums'],
          [subs.length - 1, 'subjects'],
          ['PDF', 'download'],
        ]}
      />

      <SySearch
        placeholder="Search by topic, keyword or chapter…"
        value={nsys.q}
        onChangeText={v => setS(st => ({ nsys: { ...st.nsys, q: v } }))}
        testID="notesys.search"
      />

      <View style={s.chRow}>
        {subs.map(sub => {
          const isOn = nsys.subj === sub;
          return (
            <Pressable
              key={sub}
              style={[s.chip, isOn && s.chipOn]}
              onPress={() => act('nsSubj', sub)}
              testID={`notesys.subj.${sub}`}
            >
              <Txt style={[s.chipTx, isOn && s.chipTxOn]}>{sub === 'All' ? 'All subjects' : sub}</Txt>
            </Pressable>
          );
        })}
      </View>

      <View style={s.countRow}>
        <Icon name="bookmark" size={13} color="#7A8494" />
        <Txt style={s.countTx}>
          <Txt style={s.countB}>{list.length}</Txt>
          {` article${list.length === 1 ? '' : 's'} available`}
        </Txt>
      </View>

      <View style={s.listWrap}>
        {list.length ? (
          list.map(n => (
            <Pressable
              key={n.id}
              style={[s.card, { borderLeftColor: n.c, borderLeftWidth: 4 }]}
              onPress={() => act('push', `note2:${n.id}`)}
              testID={`notesys.card.${n.id}`}
            >
              <View style={s.tp}>
                <View style={s.tpLeft}>
                  <Icon name="learn" size={13} color="#3B5BCC" />
                  <Txt style={s.tpSubj}>{n.subj}</Txt>
                </View>
                <View style={s.tagBadge}>
                  <Txt style={s.tagTx}>{n.tag}</Txt>
                </View>
              </View>
              <Txt style={s.cardTitle}>{n.t}</Txt>
              <View style={s.ft}>
                <View style={s.ftLeft}>
                  <Icon name="clock" size={12} color="#7A8494" />
                  <Txt style={s.ftTime}>{`${n.min} min read · ${n.date}`}</Txt>
                </View>
                <View style={s.ftRight}>
                  <Txt style={s.ftLink}>Read note</Txt>
                  <Icon name="arrow" size={12} color="#1B8AD3" />
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={s.empty}>
            <Txt style={s.emptyB}>No compendiums match</Txt>
            <Txt style={s.emptyP}>Try another subject.</Txt>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingBottom: 36 },
  chRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 10 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF2' },
  chipOn: { backgroundColor: '#FFF3DF', borderColor: '#C8622B' },
  chipTx: { ...font('sans', 600), fontSize: 12.5, color: '#4A505B' },
  chipTxOn: { color: '#C8622B' },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  countTx: { fontSize: 12, color: '#7A8494' },
  countB: { ...font('sans', 700), color: '#14161C' },
  listWrap: { gap: 10 },
  card: { padding: 14, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  tp: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tpLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tpSubj: { ...font('sans', 700), fontSize: 11, color: '#3B5BCC', textTransform: 'uppercase' },
  tagBadge: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: '#F1F4F8' },
  tagTx: { ...font('sans', 700), fontSize: 10.5, color: '#7A8494' },
  cardTitle: { ...font('book', 500), fontSize: 17, lineHeight: 21, color: '#14161C', marginVertical: 8 },
  ft: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F8F9FA' },
  ftLeft: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ftTime: { fontSize: 11.5, color: '#7A8494' },
  ftRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ftLink: { ...font('sans', 700), fontSize: 12, color: '#1B8AD3' },
  empty: { padding: 32, alignItems: 'center', borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF2' },
  emptyB: { ...font('sans', 700), fontSize: 16, color: '#14161C' },
  emptyP: { fontSize: 13, color: '#7A8494', marginTop: 4 },
});

const view: ViewDef = {
  useTitle: () => 'Notes System',
  Screen: NotesysScreen,
};

export default view;
