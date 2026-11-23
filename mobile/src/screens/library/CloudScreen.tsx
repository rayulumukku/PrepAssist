// Source: PrepAssist.html L7933-L7973 (VIEWS.cloud)
// Source: PrepAssist.html L4295-L4335 (.vl-hero, .vl-top, .vl-chip, .vl-bar, .vl-stats, .vl-up, .vl-row, .vl-fi, .vl-del)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import { SUBJ } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { vaultMB } from './vault/vlActions';
import { useStore, setS } from '../../store';
import { font, Txt } from '../../theme';
import { SySearch } from './parts';

const SORT_LABELS: Record<string, string> = {
  new: 'newest first',
  big: 'largest first',
  az: 'name, A–Z',
};

function CloudScreen(): React.JSX.Element {
  const vlt = useStore(s => s.vlt);
  const me = useStore(s => s.me);
  const DOCS = useStore(s => s.DOCS);
  const NOTES = useStore(s => s.NOTES);

  const cap = me.vault ? 1536 : 512;
  const used = vaultMB(DOCS);

  let items = [
    ...DOCS.map((d, i) => ({
      k: 'doc' as const,
      i,
      t: d.t,
      m: d.m,
      kind: d.k,
      mb: parseFloat((d.m.match(/([\d.]+) MB/) || [0, 1.5])[1] as string) || 1.5,
    })),
    ...NOTES.map((n, i) => ({
      k: 'note' as const,
      i,
      t: n.t,
      m: `${SUBJ[n.s as keyof typeof SUBJ] ? SUBJ[n.s as keyof typeof SUBJ].n : 'General'} · note · ${n.when}`,
      kind: 'NOTE',
      mb: 0.02,
      s: n.s,
    })),
  ];

  items = items.filter(
    x =>
      (vlt.tab === 'all' || (vlt.tab === 'up' ? x.k === 'doc' : x.k === 'note')) &&
      (!vlt.q || x.t.toLowerCase().includes(vlt.q.toLowerCase()))
  );

  if (vlt.sort === 'big') items.sort((a, b) => b.mb - a.mb);
  else if (vlt.sort === 'az') items.sort((a, b) => a.t.localeCompare(b.t));

  return (
    <View style={s.page} testID="view.cloud">
      <View style={s.hero}>
        <View style={s.heroTop}>
          <View style={s.chip}>
            <Icon name="shield" size={14} color="#0E9A8A" />
            <Txt style={s.chipTx}>Encrypted · private to you</Txt>
          </View>
          <View style={[s.chip, s.chipG]}>
            <Txt style={[s.chipTx, s.chipGTx]}>
              {`${used.toFixed(1)} MB / ${cap >= 1024 ? (cap / 1024).toFixed(1) + ' GB' : cap + ' MB'}`}
            </Txt>
          </View>
        </View>

        <Txt style={s.h1}>
          {'Your secure '}
          <Txt style={s.em}>data vault</Txt>
        </Txt>
        <Txt style={s.p}>
          Every PDF, scan and note you’ve stored — searchable, and readable by X-Ray, Query and Mains evaluation.
        </Txt>

        <View style={s.barTrack}>
          <View style={[s.barFill, { width: `${Math.min(100, (used / cap) * 100)}%` }]} />
        </View>

        <View style={s.statsRow}>
          <View style={s.stat}>
            <Txt style={s.statB}>{DOCS.length + NOTES.length}</Txt>
            <Txt style={s.statL}>items</Txt>
          </View>
          <View style={s.stat}>
            <Txt style={s.statB}>{DOCS.filter(d => d.k === 'PDF').length}</Txt>
            <Txt style={s.statL}>PDFs</Txt>
          </View>
          <View style={s.stat}>
            <Txt style={s.statB}>{NOTES.length}</Txt>
            <Txt style={s.statL}>notes</Txt>
          </View>
        </View>

        <Pressable style={s.upBtn} onPress={() => act('push', 'upload')} testID="cloud.upload">
          <Icon name="upload" size={17} color="#FFFFFF" />
          <Txt style={s.upBtnTx}>Upload new document</Txt>
        </Pressable>
      </View>

      <View style={s.fbar}>
        <View style={s.seg}>
          {[
            ['all', 'All'],
            ['up', 'Uploads'],
            ['notes', 'Notes'],
          ].map(([k, l]) => (
            <Pressable
              key={k}
              style={[s.segBtn, vlt.tab === k && s.segBtnOn]}
              onPress={() => act('vlTab', k)}
              testID={`cloud.tab.${k}`}
            >
              <Txt style={[s.segTx, vlt.tab === k && s.segTxOn]}>{l}</Txt>
            </Pressable>
          ))}
        </View>
        <Pressable style={s.sortBtn} onPress={() => act('vlSort')} testID="cloud.sort">
          <Icon name="sort" size={18} color="#4A505B" />
        </Pressable>
      </View>

      <SySearch
        placeholder="Search by title or subject…"
        value={vlt.q}
        onChangeText={v => setS(st => ({ vlt: { ...st.vlt, q: v } }))}
        testID="cloud.search"
      />

      <View style={s.sortedRow}>
        <Icon name="sort" size={13} color="#7A8494" />
        <Txt style={s.sortedTx}>
          {'Sorted by '}
          <Txt style={s.sortedB}>{SORT_LABELS[vlt.sort] || 'newest first'}</Txt>
        </Txt>
      </View>

      {vlt.warn ? (
        <View style={s.warnBox}>
          <Icon name="warn" size={18} color="#B86E00" />
          <Txt style={s.warnTx}>
            Deleting a file removes it from your vault permanently. Notes and answers already generated from it stay where they are.
          </Txt>
          <Pressable onPress={() => act('vlWarn')} testID="cloud.warn.dismiss">
            <Icon name="close" size={14} color="#7A8494" />
          </Pressable>
        </View>
      ) : null}

      <View style={s.itemsWrap}>
        {items.length ? (
          <View style={s.cardList}>
            {items.map((x, idx) => (
              <View key={idx} style={s.row}>
                <View style={[s.kindBadge, x.kind === 'NOTE' && s.kindNote]}>
                  <Txt style={s.kindTx}>{x.kind === 'NOTE' ? 'NOTE' : x.kind}</Txt>
                </View>
                <View style={s.rowInfo}>
                  <Txt style={s.rowTitle} numberOfLines={1}>{x.t}</Txt>
                  <Txt style={s.rowMeta}>{x.m}</Txt>
                </View>
                <Pressable
                  style={s.delBtn}
                  onPress={() => act('vlDel', `${x.k}:${x.i}`)}
                  testID={`cloud.del.${x.k}.${x.i}`}
                >
                  <Icon name="trash" size={16} color="#B42318" />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={s.empty}>
            <Txt style={s.emptyB}>Nothing here yet</Txt>
            <Txt style={s.emptyP}>
              {vlt.q ? 'No files match your search.' : 'Upload a PDF or create a note to fill your vault.'}
            </Txt>
            <Pressable style={s.emptyCta} onPress={() => act('push', 'upload')} testID="cloud.emptyUpload">
              <Icon name="upload" size={16} color="#FFFFFF" />
              <Txt style={s.emptyCtaTx}>Upload a file</Txt>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingBottom: 36 },
  hero: { padding: 18, borderRadius: 24, backgroundColor: '#EBF6F4', marginTop: 4, marginBottom: 12 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: '#FFFFFF' },
  chipTx: { ...font('sans', 700), fontSize: 11, color: '#0E9A8A' },
  chipG: { backgroundColor: '#D6EFEA' },
  chipGTx: { color: '#097063' },
  h1: { ...font('book', 500), fontSize: 24, lineHeight: 28, color: '#14161C', marginTop: 12 },
  em: { ...font('book', 400, true), color: '#0E9A8A' },
  p: { fontSize: 13, lineHeight: 18, color: '#4A505B', marginTop: 6 },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: '#D2ECE6', marginTop: 14, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3, backgroundColor: '#0E9A8A' },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  stat: { flex: 1, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center' },
  statB: { ...font('serif', 800), fontSize: 16, color: '#14161C' },
  statL: { fontSize: 10.5, color: '#7A8494', marginTop: 2 },
  upBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 46, borderRadius: 14, backgroundColor: '#0E9A8A', marginTop: 14 },
  upBtnTx: { ...font('sans', 700), fontSize: 14, color: '#FFFFFF' },
  fbar: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 8 },
  seg: { flex: 1, flexDirection: 'row', padding: 3, borderRadius: 12, backgroundColor: '#EEF2F7' },
  segBtn: { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 9 },
  segBtnOn: { backgroundColor: '#FFFFFF' },
  segTx: { ...font('sans', 600), fontSize: 12.5, color: '#7A8494' },
  segTxOn: { color: '#14161C' },
  sortBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E8F0', alignItems: 'center', justifyContent: 'center' },
  sortedRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, marginBottom: 8 },
  sortedTx: { fontSize: 12, color: '#7A8494' },
  sortedB: { ...font('sans', 700), color: '#4A505B' },
  warnBox: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 14, backgroundColor: '#FFF8EB', borderWidth: 1, borderColor: '#F5E4C4', alignItems: 'flex-start', marginBottom: 12 },
  warnTx: { flex: 1, fontSize: 12, lineHeight: 17, color: '#8A5800' },
  itemsWrap: { gap: 10 },
  cardList: { borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  kindBadge: { paddingVertical: 4, paddingHorizontal: 7, borderRadius: 6, backgroundColor: '#EBF6F4' },
  kindNote: { backgroundColor: '#EEF2F7' },
  kindTx: { ...font('sans', 800), fontSize: 10, color: '#0E9A8A' },
  rowInfo: { flex: 1 },
  rowTitle: { ...font('sans', 600), fontSize: 13.5, color: '#14161C' },
  rowMeta: { fontSize: 11.5, color: '#7A8494', marginTop: 2 },
  delBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: 32, alignItems: 'center', borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  emptyB: { ...font('sans', 700), fontSize: 16, color: '#14161C' },
  emptyP: { fontSize: 13, color: '#7A8494', marginTop: 4, textAlign: 'center' },
  emptyCta: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#0E9A8A', marginTop: 14 },
  emptyCtaTx: { ...font('sans', 700), fontSize: 13.5, color: '#FFFFFF' },
});

const view: ViewDef = {
  useTitle: () => 'Cloud Data Vault',
  Screen: CloudScreen,
};

export default view;
