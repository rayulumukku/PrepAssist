// Source: PrepAssist.html L7974-L7984 (VIEWS.querydb)
// Source: PrepAssist.html L4340-L4375 (.qd-kb, .qd-kh, .qd-add, .qd-items, .qd-dock, .qd-ideas)
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { ViewDef } from '../../navigation/routes';
import { useStore, setS } from '../../store';
import { font, Txt } from '../../theme';
import { TlHero } from './parts';

function QuerydbScreen(): React.JSX.Element {
  const qdb2 = useStore(s => s.qdb2);
  const DOCS = useStore(s => s.DOCS);
  const NOTES = useStore(s => s.NOTES);
  const credits = useStore(s => s.me.credits);
  const [kbText, setKbText] = useState('');
  const [queryText, setQueryText] = useState('');

  const subjects = ['Polity', 'History', 'Geography', 'Economy', 'Environment', 'Science & Tech', 'Ethics'];
  const ideas = [
    'Federalism — features and challenges',
    'Basic structure doctrine in one page',
    'Inflation targeting: pros and cons',
  ];

  const handleAddKb = (): void => {
    if (!kbText.trim()) return;
    setS(s => ({
      qdb2: { ...s.qdb2, items: [...s.qdb2.items, kbText.trim()] },
    }));
    setKbText('');
  };

  const handleSend = (): void => {
    if (!queryText.trim()) return;
    act('qdAsk', queryText.trim());
    setQueryText('');
  };

  return (
    <View style={s.page} testID="view.querydb">
      <TlHero
        tc="#6C5DD3"
        icon="bolt"
        eb="Query your Database"
        title="Query your "
        em="database"
        sub="Ask any question across your uploaded PDFs, notes and verified references to write UPSC-ready study notes."
        stats={[
          [DOCS.length + NOTES.length + qdb2.items.length, 'sources'],
          ['4', 'credits / answer'],
          [credits, 'you have'],
        ]}
      />

      <Txt style={s.kLbl}>SUBJECT CONTEXT</Txt>
      <View style={s.chRow}>
        {subjects.map(sub => {
          const isOn = qdb2.subj === sub;
          return (
            <Pressable
              key={sub}
              style={[s.chip, isOn && s.chipOn]}
              onPress={() => setS(st => ({ qdb2: { ...st.qdb2, subj: sub } }))}
              testID={`querydb.subj.${sub}`}
            >
              <Txt style={[s.chipTx, isOn && s.chipTxOn]}>{sub}</Txt>
            </Pressable>
          );
        })}
      </View>

      <View style={s.kbCard}>
        <View style={s.kbHead}>
          <Icon name="plus" size={16} color="#6C5DD3" />
          <Txt style={s.kbB}>Add custom knowledge</Txt>
          <View style={[s.kbEm, qdb2.items.length > 0 && s.kbEmOn]}>
            <Txt style={[s.kbEmTx, qdb2.items.length > 0 && s.kbEmTxOn]}>
              {qdb2.items.length ? 'Knowledge base active' : 'Optional'}
            </Txt>
          </View>
        </View>

        <TextInput
          style={s.kbArea}
          placeholder="Paste an article, your notes or research text to include it…"
          placeholderTextColor="#98A1AD"
          multiline
          numberOfLines={3}
          value={kbText}
          onChangeText={setKbText}
          testID="querydb.kbInput"
        />

        <Pressable style={s.addBtn} onPress={handleAddKb} testID="querydb.kbAdd">
          <Icon name="plus" size={14} color="#6C5DD3" />
          <Txt style={s.addBtnTx}>Add to knowledge base</Txt>
        </Pressable>

        {qdb2.items.length ? (
          <View style={s.itemsList}>
            {qdb2.items.map((t, i) => (
              <View key={i} style={s.kbItemRow}>
                <Icon name="doc" size={14} color="#6C5DD3" />
                <Txt style={s.kbItemTx} numberOfLines={2}>{t}</Txt>
                <Pressable
                  onPress={() =>
                    setS(st => ({
                      qdb2: { ...st.qdb2, items: st.qdb2.items.filter((_, idx) => idx !== i) },
                    }))
                  }
                  testID={`querydb.kbRm.${i}`}
                >
                  <Icon name="close" size={14} color="#7A8494" />
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={s.ideasBox}>
        <Txt style={s.ideasH}>TRY ASKING</Txt>
        {ideas.map((item, idx) => (
          <Pressable
            key={idx}
            style={s.ideaBtn}
            onPress={() => act('qdAsk', item)}
            testID={`querydb.idea.${idx}`}
          >
            <Icon name="spark" size={16} color="#6C5DD3" />
            <Txt style={s.ideaTx}>{item}</Txt>
          </Pressable>
        ))}
      </View>

      <View style={s.dock}>
        <View style={s.inputRow}>
          <TextInput
            style={s.dockInput}
            placeholder="Ask AI to write notes, e.g. Federalism…"
            placeholderTextColor="#98A1AD"
            value={queryText}
            onChangeText={setQueryText}
            onSubmitEditing={handleSend}
            testID="querydb.dockInput"
          />
          <Pressable style={s.sendBtn} onPress={handleSend} testID="querydb.send">
            <Icon name="send" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
        <Txt style={s.dockSm}>
          {'Uses '}
          <Txt style={s.bold}>4 AI credits</Txt>
          {' per generation'}
        </Txt>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingBottom: 48 },
  kLbl: { ...font('sans', 800), fontSize: 10.5, letterSpacing: 1.4, color: '#8A93A0', marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
  chRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF2' },
  chipOn: { backgroundColor: '#EEEAFF', borderColor: '#6C5DD3' },
  chipTx: { ...font('sans', 600), fontSize: 12.5, color: '#4A505B' },
  chipTxOn: { color: '#6C5DD3' },
  kbCard: { padding: 14, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1', marginTop: 14 },
  kbHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kbB: { ...font('sans', 700), fontSize: 13.5, color: '#14161C', flex: 1 },
  kbEm: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: '#F1F4F8' },
  kbEmOn: { backgroundColor: '#EEEAFF' },
  kbEmTx: { ...font('sans', 700), fontSize: 11, color: '#7A8494' },
  kbEmTxOn: { color: '#6C5DD3' },
  kbArea: { height: 72, borderRadius: 12, borderWidth: 1, borderColor: '#E3E7ED', padding: 10, marginTop: 10, fontSize: 13, textAlignVertical: 'top' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38, borderRadius: 10, backgroundColor: '#F5F3FF', marginTop: 8 },
  addBtnTx: { ...font('sans', 700), fontSize: 12.5, color: '#6C5DD3' },
  itemsList: { gap: 6, marginTop: 10 },
  kbItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: '#F8FAFC' },
  kbItemTx: { flex: 1, fontSize: 12, color: '#3A404B' },
  ideasBox: { marginTop: 18 },
  ideasH: { ...font('sans', 800), fontSize: 10.5, letterSpacing: 1.4, color: '#8A93A0', marginBottom: 8 },
  ideaBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1', marginBottom: 8 },
  ideaTx: { fontSize: 13.5, color: '#25272D', flex: 1 },
  dock: { marginTop: 14, padding: 12, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dockInput: { flex: 1, height: 44, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#F4F6F9', fontSize: 13.5 },
  sendBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#6C5DD3', alignItems: 'center', justifyContent: 'center' },
  dockSm: { fontSize: 11.5, color: '#7A8494', marginTop: 8, textAlign: 'center' },
  bold: { ...font('sans', 700), color: '#14161C' },
});

const view: ViewDef = {
  useTitle: () => 'Query your Database',
  Screen: QuerydbScreen,
};

export default view;
