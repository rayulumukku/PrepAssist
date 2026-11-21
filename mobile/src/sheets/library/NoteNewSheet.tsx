// Source: PrepAssist.html L10539-L10561 (nnSheet)
// Source: PrepAssist.html L10562-L10565 (nnOpen, nnRe, ntField), L10191-L10215 + L10315-L10322 (.n2-mode, .n2-lab, .n2-subj, .n2-in, .n2-ta, .n2-att, .n2-thumbs, .n2-zone, .n2-file, .n2-link, .n2-hint), L10316-L10317 (.n2-save)
// Computed (reference/android/sheet-note-new-type, -type-filled, -camera, -camera-reading, -camera-captured, -pdf, -pdf-picked):
//   .n2-mode   row gap 8; pills 38 high padding 0 15, 13.5px 600, icon 16; off white + inset ring #E1E5EC #5B6472; on #14161C white
//   .n2-lab    "Subject *" + em "Target: <b>name</b>" 12px #8A93A0, b 700 in the folder colour
//   .n2-subj   scrolls sideways, margin 0 -20, padding 2 20, gap 8; pills 36 high padding 0 14 13px 600; i 8 dot fc; .on fc / white
//   .n2-zone   margin-top 20, padding 24 16, radius 16, 1px dashed #BFE3CB on #F3FAF5, gap 4; icon 26 #2F8A4A (+4 below); b 14.5 / 21.025; small 12 #7A8494
//   .n2-file   margin-top 20, padding 12, radius 14, white, inset ring #E1E5EC, gap 12; 40 box radius 10 (#FDECEC "PDF" 10.5px 800 #D64545,
//              .n2-cap #E3F4EA camera 18 #2F8A4A); b 13.5 700 nowrap ellipsis; small 11.5 #7A8494; remove 30 box close 15 #8A93A0
//   .n2-link   margin-top 10, 12.5px 700 #C46A00, scissors 14
//   .n2-att    two columns gap 10; buttons 46 high radius 14 inset ring, 14px 600 #2F8A4A, icons 17
//   .n2-thumbs row gap 8, margin-bottom 10; 54 boxes radius 12 #E3F4EA, image 20 #2F8A4A
//   .n2-hint   margin-top 20, gap 8, 12 / 18 #7A8494, refresh 15 #1FA463 (margin-top 1)
//   .n2-save   #14161C (disabled #C9CED6 white), 50 high radius 15, 14px 700
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Circ, Icon, SheetGrab } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import type { SheetProps } from '../../navigation/routes';
import { foldKey, nnSubjects } from '../../screens/library/tracker/nt';
import { setS, useStore } from '../../store';
import type { NnDraft } from '../../store/slices/library';
import { font, useInsets, Txt } from '../../theme';
import { s as us } from './NoteUpdatesSheet';
import { N2In, N2Lab } from './trackerParts';

/** window.ntField (L10565): S.nn[f] = v without re-rendering the sheet in the HTML; the Save button follows the title. */
const field = (f: 't' | 'b' | 'g', v: string): void => setS(st => (st.nn ? { nn: { ...st.nn, [f]: v } } : {}));

function Zone({ N }: { N: NnDraft }): React.JSX.Element | null {
  if (N.mode === 'cam') {
    if (N.b && !N.busy) {
      return (
        <Pressable style={z.file} onPress={() => act('ntCap')} testID="noteNew.retake">
          <View style={[z.fileI, z.capI]}>
            <Icon name="camera" size={18} color="#2F8A4A" />
          </View>
          <View style={z.fileD}>
            <Txt style={z.fileB} numberOfLines={1}>
              Page captured
            </Txt>
            <Txt style={z.fileSmall}>Text extracted below · tap to retake</Txt>
          </View>
        </Pressable>
      );
    }
    return (
      <Pressable style={z.zone} onPress={() => act('ntCap')} testID="noteNew.capture">
        <Icon name="camera" size={26} color="#2F8A4A" style={z.zoneIc} />
        <Txt style={z.zoneB}>{N.busy ? 'Reading your page…' : 'Take a photo of your notes'}</Txt>
        <Txt style={z.zoneSmall}>{N.busy ? 'Extracting handwriting and print' : 'Handwritten or printed — we turn it into editable text'}</Txt>
      </Pressable>
    );
  }
  if (N.mode === 'pdf') {
    if (N.file) {
      return (
        <>
          <View style={z.file}>
            <View style={z.fileI}>
              <Txt style={z.pdfTx}>PDF</Txt>
            </View>
            <View style={z.fileD}>
              <Txt style={z.fileB} numberOfLines={1}>
                {N.file}
              </Txt>
              <Txt style={z.fileSmall}>12 pages · text extracted</Txt>
            </View>
            <Pressable style={z.x} onPress={() => act('ntFileX')} accessibilityLabel="Remove" testID="noteNew.fileX">
              <Icon name="close" size={15} color="#8A93A0" />
            </Pressable>
          </View>
          <View style={z.linkRow}>
            <Pressable style={z.link} onPress={() => act('nsSplit')} testID="noteNew.split">
              <Icon name="scissors" size={14} color="#C46A00" />
              <Txt style={z.linkTx}>Big book? Split it into chapters first</Txt>
            </Pressable>
          </View>
        </>
      );
    }
    return (
      <Pressable style={z.zone} onPress={() => act('ntPick')} testID="noteNew.pick">
        <Icon name="file" size={26} color="#2F8A4A" style={z.zoneIc} />
        <Txt style={z.zoneB}>{N.busy ? 'Extracting text…' : 'Choose a PDF or Word file'}</Txt>
        <Txt style={z.zoneSmall}>{N.busy ? 'This takes a few seconds' : 'Up to 100 MB · text is matched to your notes'}</Txt>
      </Pressable>
    );
  }
  return null;
}

function NoteNewSheet(_: SheetProps): React.JSX.Element | null {
  const { sab } = useInsets();
  const N = useStore(st => st.nn);
  const FOLDERS = useStore(st => st.FOLDERS);
  const optional = useStore(st => st.optional);
  if (!N) return null;
  const F = foldKey(N.k, { FOLDERS });
  const modes: [string, IconName, string][] = [
    ['type', 'pen', 'Type'],
    ['cam', 'camera', 'Camera'],
    ['pdf', 'file', 'PDF / Doc'],
  ];
  const can = !!N.t.trim();
  return (
    <>
      <SheetGrab />
      <View style={us.sh}>
        <View style={us.shh}>
          <View style={us.shhD}>
            <Txt style={us.h3}>New Note</Txt>
          </View>
          <Circ icon="close" label="Close" onPress={() => act('closeSheet')} />
        </View>
        <ScrollView style={us.shb} contentContainerStyle={us.shbC} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} testID="noteNew.body">
          <View style={z.mode}>
            {modes.map(([m, ic, l]) => {
              const on = N.mode === m;
              return (
                <Pressable key={m} style={[z.modeB, on && z.modeBOn]} onPress={() => act('ntMode', m)} testID={`noteNew.mode.${m}`}>
                  <Icon name={ic} size={16} color={on ? '#FFFFFF' : '#5B6472'} />
                  <Txt style={[z.modeTx, on && z.modeTxOn]}>{l}</Txt>
                </Pressable>
              );
            })}
          </View>
          <N2Lab
            label="Subject *"
            em={
              <Txt style={z.em}>
                {'Target: '}
                <Txt style={[z.emB, { color: F[1] }]}>{F[0]}</Txt>
              </Txt>
            }
          />
          <ScrollView horizontal style={z.subj} contentContainerStyle={z.subjC} showsHorizontalScrollIndicator={false}>
            {nnSubjects({ FOLDERS, optional }).map(([n, c, k]) => {
              const on = N.k === k;
              return (
                <Pressable key={k} style={[z.subjB, on && { backgroundColor: c, boxShadow: 'none' }]} onPress={() => act('ntSubj', k)} testID={`noteNew.subj.${k}`}>
                  <View style={[z.subjI, { backgroundColor: on ? '#FFFFFF' : c }]} />
                  <Txt style={[z.subjTx, on && z.subjTxOn]}>{n}</Txt>
                </Pressable>
              );
            })}
          </ScrollView>
          <Zone N={N} />
          <N2Lab label="Title *" />
          <N2In placeholder="Note title…" value={N.t} onChangeText={v => field('t', v)} testID="noteNew.title" />
          {N.mode === 'type' || N.b ? (
            <>
              <N2Lab label="Content" em={N.mode !== 'type' ? <Txt style={z.em}>Extracted — edit freely</Txt> : undefined} />
              <N2In multiline placeholder="Write your notes here…" value={N.b} onChangeText={v => field('b', v)} testID="noteNew.content" />
            </>
          ) : null}
          <N2Lab label="Tags" em={<Txt style={z.em}>Comma separated</Txt>} />
          <N2In placeholder="e.g. federalism, article 370" value={N.g} onChangeText={v => field('g', v)} testID="noteNew.tags" />
          {N.mode === 'type' ? (
            <>
              <N2Lab label="Attach image" />
              {N.img ? (
                <View style={z.thumbs}>
                  {Array.from({ length: N.img }, (_, i) => (
                    <View key={i} style={z.thumb}>
                      <Icon name="image" size={20} color="#2F8A4A" />
                    </View>
                  ))}
                </View>
              ) : null}
              <View style={z.att}>
                <Pressable style={z.attB} onPress={() => act('ntImg')} testID="noteNew.gallery">
                  <Icon name="image" size={17} color="#2F8A4A" />
                  <Txt style={z.attTx}>Gallery</Txt>
                </Pressable>
                <Pressable style={z.attB} onPress={() => act('ntImg')} testID="noteNew.camera">
                  <Icon name="camera" size={17} color="#2F8A4A" />
                  <Txt style={z.attTx}>Camera</Txt>
                </Pressable>
              </View>
            </>
          ) : null}
          <View style={z.hint}>
            <Icon name="refresh" size={15} color="#1FA463" style={z.hintIc} />
            <Txt style={z.hintTx}>We’ll keep this note up to date — matching material from your uploads and current affairs will appear as updates.</Txt>
          </View>
        </ScrollView>
        <View style={[us.shf, { paddingBottom: sab + 14 }]}>
          <Pressable style={[us.b1, z.save, !can && z.saveOff]} disabled={!can} onPress={() => act('ntSave')} testID="noteNew.save">
            <Txt style={us.b1Tx}>Save Note</Txt>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const z = StyleSheet.create({
  mode: { flexDirection: 'row', gap: 8 },
  modeB: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 15, borderRadius: 999, backgroundColor: '#FFFFFF', boxShadow: 'inset 0px 0px 0px 1px #E1E5EC' },
  modeBOn: { backgroundColor: '#14161C', boxShadow: 'none' },
  modeTx: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, color: '#5B6472', textAlign: 'center' },
  modeTxOn: { color: '#FFFFFF' },
  em: { fontSize: 12, lineHeight: 17.4, color: '#8A93A0' },
  emB: font('sans', 700),
  subj: { flexGrow: 0, marginHorizontal: -20 },
  subjC: { gap: 8, paddingVertical: 2, paddingHorizontal: 20 },
  subjB: { flexDirection: 'row', alignItems: 'center', gap: 7, height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#FFFFFF', boxShadow: 'inset 0px 0px 0px 1px #E1E5EC' },
  subjI: { width: 8, height: 8, borderRadius: 4 },
  subjTx: { ...font('sans', 600), fontSize: 13, lineHeight: 18.85, color: '#3A404B', textAlign: 'center' },
  subjTxOn: { color: '#FFFFFF' },
  zone: { alignItems: 'center', gap: 4, marginTop: 20, paddingVertical: 24, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BFE3CB', backgroundColor: '#F3FAF5' },
  zoneIc: { marginBottom: 4 },
  zoneB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: '#14161C', textAlign: 'center' },
  zoneSmall: { fontSize: 12, lineHeight: 17.4, color: '#7A8494', textAlign: 'center' },
  file: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, padding: 12, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: 'inset 0px 0px 0px 1px #E1E5EC' },
  fileI: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FDECEC', alignItems: 'center', justifyContent: 'center' },
  capI: { backgroundColor: '#E3F4EA' },
  pdfTx: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, color: '#D64545' },
  fileD: { flex: 1, minWidth: 0 },
  fileB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575 },
  fileSmall: { fontSize: 11.5, lineHeight: 22.475, color: '#7A8494' },
  x: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  linkRow: { flexDirection: 'row' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  linkTx: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#C46A00', textAlign: 'center' },
  thumbs: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  thumb: { width: 54, height: 54, borderRadius: 12, backgroundColor: '#E3F4EA', alignItems: 'center', justifyContent: 'center' },
  att: { flexDirection: 'row', gap: 10 },
  attB: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 46, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: 'inset 0px 0px 0px 1px #E1E5EC' },
  attTx: { ...font('sans', 600), fontSize: 14, lineHeight: 20.3, color: '#2F8A4A', textAlign: 'center' },
  hint: { flexDirection: 'row', gap: 8, marginTop: 20 },
  hintIc: { marginTop: 1 },
  hintTx: { flex: 1, fontSize: 12, lineHeight: 18, color: '#7A8494' },
  save: { backgroundColor: '#14161C', boxShadow: '0px 10px 18px -12px rgba(0, 0, 0, 0.6)' },
  saveOff: { backgroundColor: '#C9CED6', boxShadow: 'none' },
});

export default NoteNewSheet;
