// Source: PrepAssist.html L10468-L10468 (VIEWS.tracker)
// Source: PrepAssist.html L10448-L10467 (fCard, optCard, trackerHTML), L10469-L10476 (ntSearch)
// Source: PrepAssist.html L10258-L10284 (.n2-hcta, .n2-two, .n2-f, .n2-tab, .n2-new, .n2-opt …), L10089 (.n2-grid), L10122-L10123 (.n2-empty)
// Computed (reference/android/view-tracker, -search, -search-empty, -optional-set, -folder-added):
//   .n2-hcta   40 high, padding 0 14, radius 13, white, 13px 800 #1F6B3A, shadow 0 10 18 -12 rgba(0,0,0,.5), margin-top 14, icons 15
//   .n2-two    two columns, gap 8, margin-top 10; buttons 44 high radius 14; .p #14161C with icon #9BE3B0; other white + ring #E1E8F0, icon #3E9A55
//   .n2-grid   two columns 181, gap 12 10
//   .n2-f      margin-top 9, padding 18 14 14, radius 6 18 18 18, linear(165deg, mix(fc 13%, #fff), #fff 62%),
//              shadow 0 0 0 1px mix(fc 20%, #E6EBF1), 0 14 22 -20 fc; .n2-tab 56x12 at top -9, radius 7 9 0 0, mix(fc 28%, #fff);
//              .n2-fi 38 box radius 12 fc; b EB Garamond 500 19 / 20.9 margin-top 14; small 12px 600 mix(fc 75%, #4A515C) margin-top 3
//   .n2-new    22 high at right 12 / top 14, padding 0 8, radius 11, #E3F4EA, 11px 800 #1F6B3A, dot 6 #2FA562
//   .n2-f.add  white, 1px dashed #C9D2DD, radius 18, centred; fi #F1F4F8 / #5B6472; b Inter 700 14 / 15.4 #3A404B; small 500 #9AA3AF
//   .n2-opt    padding 16, radius 20, radial + linear(130deg, #14304F, #1B4C7C), gap 12; em 12.5px 800 padding 8 13 radius 11 #FFD27A
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import { MT } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { mix } from './mix';
import { MuH, SySearch, TlHero } from './parts';
import { NoteCard } from './tracker/NoteCard';
import { allNotes, notesOf, ntTotal, search, upsOf } from './tracker/nt';
import type { Folder } from './tracker/nt';

export function FolderCard({ f }: { f: Folder }): React.JSX.Element {
  const NT = useStore(s => s.NT);
  const [n, fc, k] = f;
  const cnt = notesOf(k, { NT }).length;
  const u = upsOf(k, { NT });
  return (
    <Pressable
      style={[
        t.f,
        {
          backgroundImage: `linear-gradient(165deg, ${mix(fc, 13, '#FFFFFF')}, #FFFFFF 62%)`,
          boxShadow: `0px 0px 0px 1px ${mix(fc, 20, '#E6EBF1')}, 0px 14px 22px -20px ${fc}`,
        },
      ]}
      onPress={() => act('push:folder:' + n)}
      testID={`tracker.folder.${k}`}>
      <View style={[t.tab, { backgroundColor: mix(fc, 28, '#FFFFFF') }]} />
      <View style={[t.fi, { backgroundColor: fc, boxShadow: `0px 8px 14px -8px ${fc}` }]}>
        <Icon name="learn" size={18} color="#FFFFFF" />
      </View>
      {u ? (
        <View style={t.new}>
          <View style={t.newDot} />
          <Txt style={t.newTx}>{`${u} new`}</Txt>
        </View>
      ) : null}
      <Txt style={t.fB}>{n}</Txt>
      <Txt style={[t.fSmall, { color: mix(fc, 75, '#4A515C') }]}>{`${cnt} note${cnt === 1 ? '' : 's'}`}</Txt>
    </Pressable>
  );
}

function OptCard(): React.JSX.Element {
  const o = useStore(s => s.optional);
  const NT = useStore(s => s.NT);
  const cnt = o ? notesOf('opt:' + o, { NT }).length : 0;
  return (
    <Pressable style={t.opt} onPress={() => (o ? act('push:folder:' + o) : act('ntOpt'))} testID="tracker.optional">
      <View style={t.oi}>
        <Icon name="crown" size={20} color="#FFD27A" />
      </View>
      <View style={t.optD}>
        <Txt style={t.optSmall}>{o ? 'Your optional' : 'Optional mastery'}</Txt>
        <Txt style={t.optB}>{o || 'Set your optional'}</Txt>
        <Txt style={t.optP}>{o ? `${cnt} note${cnt === 1 ? '' : 's'} · tracked alongside GS` : 'Track one optional subject alongside GS'}</Txt>
      </View>
      <Pressable style={t.optEm} onPress={() => act('ntOpt')} testID="tracker.optional.set">
        <Txt style={t.optEmTx}>{o ? 'Change' : 'Set'}</Txt>
      </Pressable>
    </Pressable>
  );
}

function TrackerScreen(): React.JSX.Element {
  const NT = useStore(s => s.NT);
  const FOLDERS = useStore(s => s.FOLDERS);
  const optional = useStore(s => s.optional);
  const [v, setV] = useState('');
  const T = ntTotal({ NT });
  const L = allNotes({ NT });
  const q = v.trim().toLowerCase().replace(/^#/, '');
  const res = q ? search(v, { NT, FOLDERS }) : null;
  return (
    <View style={t.page}>
      <TlHero
        tc={MT.tracker.c}
        icon={MT.tracker.ic as 'learn'}
        eb={MT.tracker.n}
        title="Notes that "
        em="stay current"
        sub="New material from your uploads, X-Ray scans and the news is matched to the right note — you review and merge."
        stats={[
          [L.length, 'notes'],
          [T, 'new updates'],
          [FOLDERS.length + (optional ? 1 : 0), 'subjects'],
        ]}>
        {T ? (
          <View style={t.hctaRow}>
            <Pressable style={t.hcta} onPress={() => act('ntInbox')} testID="tracker.inbox">
              <Icon name="refresh" size={15} color="#1F6B3A" />
              <Txt style={t.hctaTx}>{`Review ${T} updates`}</Txt>
              <Icon name="arrow" size={15} color="#1F6B3A" />
            </Pressable>
          </View>
        ) : null}
      </TlHero>
      <SySearch placeholder="Search subjects, topics or #tags…" value={v} onChangeText={setV} testID="tracker.search" />
      <View style={t.two}>
        <Pressable style={[t.twoB, t.twoP]} onPress={() => act('ntNew')} testID="tracker.new">
          <Icon name="plus" size={16} color="#9BE3B0" />
          <Txt style={[t.twoTx, t.twoTxP]}>New note</Txt>
        </Pressable>
        <Pressable style={t.twoB} onPress={() => act('nsSplit')} testID="tracker.split">
          <Icon name="scissors" size={16} color="#3E9A55" />
          <Txt style={t.twoTx}>Split PDF</Txt>
        </Pressable>
      </View>
      {res ? (
        <View>
          {res.fs.length ? (
            <>
              <MuH title="Folders" />
              <View style={t.grid}>
                {res.fs.map(f => (
                  <View key={f[2]} style={t.cell}>
                    <FolderCard f={f} />
                  </View>
                ))}
              </View>
            </>
          ) : null}
          <MuH title="Notes" right={`${res.ns.length} found`} />
          {res.ns.length ? (
            <View style={t.list}>
              {res.ns.map(n => (
                <NoteCard key={n.id} n={n} />
              ))}
            </View>
          ) : (
            <View style={t.empty}>
              <Txt style={t.emptyB}>{`No notes match “${v}”`}</Txt>
              <Txt style={t.emptyP}>Try a subject, a topic or a #tag.</Txt>
            </View>
          )}
        </View>
      ) : (
        <View>
          <MuH title="Core studies" right={`${FOLDERS.length} folders`} />
          <View style={t.grid}>
            {FOLDERS.map(f => (
              <View key={f[2]} style={t.cell}>
                <FolderCard f={f} />
              </View>
            ))}
            <View style={t.cell}>
              <Pressable style={[t.f, t.add]} onPress={() => act('ntAdd')} testID="tracker.addFolder">
                <View style={[t.fi, t.addFi]}>
                  <Icon name="folder" size={18} color="#5B6472" />
                </View>
                <Txt style={t.addB}>Add folder</Txt>
                <Txt style={t.addSmall}>Custom subject</Txt>
              </Pressable>
            </View>
          </View>
          <MuH title="Optional mastery" right="One at a time" />
          <OptCard />
        </View>
      )}
    </View>
  );
}

export const t = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  hctaRow: { flexDirection: 'row' },
  hcta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 14,
    marginTop: 14,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 10px 18px -12px rgba(0, 0, 0, 0.5)',
  },
  hctaTx: { ...font('sans', 800), fontSize: 13, lineHeight: 18.85, color: '#1F6B3A', textAlign: 'center' },
  two: { flexDirection: 'row', gap: 8, marginTop: 10 },
  twoB: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
  },
  twoP: { backgroundColor: '#14161C', boxShadow: 'none' },
  twoTx: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, textAlign: 'center' },
  twoTxP: { color: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12, columnGap: 10 },
  cell: { width: '48.65%' },
  f: { marginTop: 9, paddingTop: 18, paddingHorizontal: 14, paddingBottom: 14, borderTopLeftRadius: 6, borderTopRightRadius: 18, borderBottomRightRadius: 18, borderBottomLeftRadius: 18, alignItems: 'flex-start' },
  tab: { position: 'absolute', left: 0, top: -9, width: 56, height: 12, borderTopLeftRadius: 7, borderTopRightRadius: 9 },
  fi: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  new: { position: 'absolute', right: 12, top: 14, height: 22, paddingHorizontal: 8, borderRadius: 11, backgroundColor: '#E3F4EA', flexDirection: 'row', alignItems: 'center', gap: 5 },
  newDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2FA562' },
  newTx: { ...font('sans', 800), fontSize: 11, lineHeight: 15.95, color: '#1F6B3A' },
  fB: { ...font('book', 500), fontSize: 19, lineHeight: 20.9, color: '#14161C', marginTop: 14 },
  fSmall: { ...font('sans', 600), fontSize: 12, lineHeight: 17.4, marginTop: 3 },
  add: { flex: 1, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: '#C9D2DD', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  addFi: { backgroundColor: '#F1F4F8' },
  addB: { ...font('sans', 700), fontSize: 14, lineHeight: 15.4, color: '#3A404B', marginTop: 14, textAlign: 'center' },
  addSmall: { ...font('sans', 500), fontSize: 12, lineHeight: 17.4, color: '#9AA3AF', marginTop: 3, textAlign: 'center' },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundImage: 'radial-gradient(80% 90% at 100% 0%, rgba(255, 210, 122, 0.22), transparent 60%), linear-gradient(130deg, #14304F, #1B4C7C)',
    boxShadow: '0px 16px 26px -18px rgba(20, 48, 79, 0.95)',
  },
  oi: { width: 44, height: 44, borderRadius: 14, flexShrink: 0, backgroundColor: 'rgba(255, 210, 122, 0.16)', boxShadow: 'inset 0px 0px 0px 1px rgba(255, 210, 122, 0.25)', alignItems: 'center', justifyContent: 'center' },
  optD: { flex: 1, minWidth: 0 },
  optSmall: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.6)' },
  optB: { ...font('book', 500), fontSize: 21, lineHeight: 24.15, color: '#FFFFFF', marginTop: 2 },
  optP: { fontSize: 12, lineHeight: 17.4, color: 'rgba(255, 255, 255, 0.7)', marginTop: 2 },
  optEm: { flexShrink: 0, paddingVertical: 8, paddingHorizontal: 13, borderRadius: 11, backgroundColor: '#FFD27A' },
  optEmTx: { ...font('sans', 800), fontSize: 12.5, lineHeight: 18.125, color: '#3D2E00' },
  list: { gap: 12 },
  empty: { paddingVertical: 28, paddingHorizontal: 18, borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E8ECF2' },
  emptyB: { ...font('sans', 700), fontSize: 15, lineHeight: 21.75, color: '#14161C', textAlign: 'center' },
  emptyP: { fontSize: 13, lineHeight: 18.85, color: '#7A8494', marginTop: 4, textAlign: 'center' },
});

const view: ViewDef = {
  useTitle: () => 'Notes Tracker',
  Screen: TrackerScreen,
};

export default view;
