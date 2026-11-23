// Source: PrepAssist.html L10495-L10503 (VIEWS.folder)
// Source: PrepAssist.html L10489-L10494 (sorted, folderList), L10079-L10080 + L10300 (.n2-plus), L10282-L10284 (.n2-sort), L10122-L10124 (.n2-empty, .n2-cta)
// Computed (reference/android/view-folder, -sort-az, -sort-starred):
//   .ph action  .n2-plus 38 circle #14161C, icon plus 18 white
//   .n2-sort    ch2 row margin 0 -20 14, padding 0 20 2, gap 8; buttons 34 high padding 0 16 pill, 13px 600;
//               off white + ring #E1E8F0 #3A404B, on #14161C white
//   .n2-list    gap 12
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, pageHeaderActStyle } from '../../components';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { TlHero } from './parts';
import { NoteCard } from './tracker/NoteCard';
import { fold, notesOf, sorted, upsOf } from './tracker/nt';

function FolderAction({ arg }: ViewProps): React.JSX.Element {
  const name = arg ?? '';
  return (
    <Pressable style={[pageHeaderActStyle, f.plus]} onPress={() => act('ntNew', name)} accessibilityLabel="New note" testID="folder.new">
      <Icon name="plus" size={18} color="#FFFFFF" />
    </Pressable>
  );
}

function FolderScreen({ arg }: ViewProps): React.JSX.Element {
  const name = arg ?? '';
  const NT = useStore(s => s.NT);
  const FOLDERS = useStore(s => s.FOLDERS);
  const optional = useStore(s => s.optional);
  const sort = useStore(s => s.ntSort);
  const F = fold(name, { FOLDERS, optional });
  const k = F[2];
  const L = notesOf(k, { NT });
  const u = upsOf(k, { NT });
  const wn = L.filter(n => n.ups.length).length;
  const list = sorted(k, sort, { NT });
  return (
    <View style={f.page}>
      <TlHero
        tc={F[1]}
        icon="learn"
        eb="Subject folder"
        title={name}
        sub={
          u
            ? `${u} new update${u === 1 ? '' : 's'} waiting across ${wn} note${wn === 1 ? '' : 's'}.`
            : L.length
            ? 'Every note in this folder is up to date.'
            : 'Start your first note — we’ll keep it current.'
        }
        stats={[
          [L.length, 'notes'],
          [u, 'updates'],
          [L.filter(n => n.star).length, 'starred'],
        ]}
      />
      <ScrollView horizontal style={f.sort} contentContainerStyle={f.sortC} showsHorizontalScrollIndicator={false}>
        {(
          [
            ['new', 'Newest'],
            ['az', 'A–Z'],
            ['star', 'Starred'],
          ] as const
        ).map(([s, l]) => (
          <Pressable key={s} style={[f.sb, sort === s && f.sbOn]} onPress={() => act('ntSort', s)} testID={`folder.sort.${s}`}>
            <Txt style={[f.sbTx, sort === s && f.sbTxOn]}>{l}</Txt>
          </Pressable>
        ))}
      </ScrollView>
      <View style={f.list}>
        {list.length ? (
          list.map(n => <NoteCard key={n.id} n={n} />)
        ) : (
          <View style={f.empty}>
            {sort === 'star' ? (
              <>
                <Txt style={f.emptyB}>No starred notes</Txt>
                <Txt style={f.emptyP}>Tap the star on a note to keep it here.</Txt>
              </>
            ) : (
              <>
                <Txt style={f.emptyB}>No notes yet</Txt>
                <Txt style={f.emptyP}>Type, scan or upload your first note.</Txt>
                <View style={f.ctaRow}>
                  <Pressable style={[f.cta, { backgroundColor: F[1] }]} onPress={() => act('ntNew', F[0])} testID="folder.empty.new">
                    <Icon name="plus" size={15} color="#FFFFFF" />
                    <Txt style={f.ctaTx}>New note</Txt>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const f = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  plus: { backgroundColor: '#14161C', borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  sort: { flexGrow: 0, marginHorizontal: -20, marginBottom: 14 },
  sortC: { gap: 8, paddingHorizontal: 20, paddingBottom: 2 },
  sb: { height: 34, paddingHorizontal: 16, borderRadius: 999, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E1E8F0', justifyContent: 'center' },
  sbOn: { backgroundColor: '#14161C', boxShadow: 'none' },
  sbTx: { ...font('sans', 600), fontSize: 13, lineHeight: 18.85, color: '#3A404B', textAlign: 'center' },
  sbTxOn: { color: '#FFFFFF' },
  list: { gap: 12 },
  empty: { paddingVertical: 28, paddingHorizontal: 18, borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E8ECF2' },
  emptyB: { ...font('sans', 700), fontSize: 15, lineHeight: 21.75, color: '#14161C', textAlign: 'center' },
  emptyP: { fontSize: 13, lineHeight: 18.85, color: '#7A8494', marginTop: 4, textAlign: 'center' },
  ctaRow: { flexDirection: 'row', justifyContent: 'center' },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, height: 38, paddingHorizontal: 16, borderRadius: 12 },
  ctaTx: { ...font('sans', 700), fontSize: 13, lineHeight: 18.85, color: '#FFFFFF' },
});

const view: ViewDef = {
  useTitle: arg => arg ?? '',
  Action: FolderAction,
  Screen: FolderScreen,
};

export default view;
