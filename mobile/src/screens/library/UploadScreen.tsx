// Source: PrepAssist.html L7918-L7930 (VIEWS.upload)
// Source: PrepAssist.html L4280-L4320 (.up2-stage, .up2-src, .up2-tags, .up2-prog, .tl-drop)
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { ViewDef } from '../../navigation/routes';
import { upTagAdd, vaultMB } from './vault/vlActions';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { TlHero } from './parts';

function UploadScreen(): React.JSX.Element {
  const up = useStore(s => s.up);
  const DOCS = useStore(s => s.DOCS);
  const FOLDERS = useStore(s => s.FOLDERS);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (): void => {
    if (!tagInput.trim()) return;
    upTagAdd(tagInput);
    setTagInput('');
  };

  return (
    <View style={s.page} testID="view.upload">
      <TlHero
        tc="#F5A01F"
        icon="cloud"
        eb="Upload to Cloud"
        title="Feed your "
        em="vault"
        sub="Drop PDFs, docs or images — tag them once and every AI tool can read them."
        stats={[
          ['100 MB', 'max file'],
          ['8', 'formats'],
          [`${vaultMB(DOCS).toFixed(0)} MB`, 'used'],
        ]}
      />

      {up.file ? (
        <View style={s.stage}>
          <View style={s.fileCard}>
            <View style={[s.fileBadge, { backgroundColor: up.file.k === 'JPG' ? '#0E9A8A' : '#E5484D' }]}>
              <Txt style={s.fileBadgeTx}>{up.file.k}</Txt>
            </View>
            <View style={s.fileInfo}>
              <Txt style={s.fileName} numberOfLines={1}>{up.file.n}</Txt>
              <Txt style={s.fileSub}>{`${up.file.sz} · ready to upload`}</Txt>
            </View>
            <Pressable style={s.closeBtn} onPress={() => act('upClear')} testID="upload.clear">
              <Icon name="close" size={16} color="#7A8494" />
            </Pressable>
          </View>

          <Txt style={s.kLbl}>FOLDER</Txt>
          <View style={s.chRow}>
            {FOLDERS.map(([f, c]) => {
              const isOn = up.folder === f;
              return (
                <Pressable
                  key={f}
                  style={[s.folderChip, isOn && s.folderChipOn]}
                  onPress={() => act('upFolder', f)}
                  testID={`upload.folder.${f}`}
                >
                  <Txt style={[s.folderChipTx, isOn && { color: c }]}>{f}</Txt>
                </Pressable>
              );
            })}
          </View>

          <Txt style={s.kLbl}>HASHTAGS</Txt>
          <View style={s.tagsBox}>
            {up.tags.map((t, i) => (
              <View key={i} style={s.tagPill}>
                <Txt style={s.tagPillTx}>{t}</Txt>
                <Pressable onPress={() => act('upTagRm', String(i))} testID={`upload.tagRm.${i}`}>
                  <Icon name="close" size={12} color="#B86E00" />
                </Pressable>
              </View>
            ))}
            <TextInput
              style={s.tagIn}
              placeholder="#add-tag"
              placeholderTextColor="#98A1AD"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              autoCapitalize="none"
              autoCorrect={false}
              testID="upload.tagInput"
            />
          </View>

          {up.prog >= 0 ? (
            <View style={s.progBox}>
              <View style={s.progTrack}>
                <View style={[s.progFill, { width: `${Math.max(2, up.prog)}%` }]} />
              </View>
              <Txt style={s.progTx}>
                {up.prog < 100 ? `Uploading… ${up.prog}%` : 'Uploaded · indexing for AI'}
              </Txt>
            </View>
          ) : null}

          <Pressable
            style={[s.uploadCta, up.prog >= 0 && s.uploadCtaDis]}
            disabled={up.prog >= 0}
            onPress={() => act('upGo')}
            testID="upload.go"
          >
            <Icon name="upload" size={18} color="#FFFFFF" />
            <Txt style={s.uploadCtaTx}>Upload to vault</Txt>
          </Pressable>
        </View>
      ) : (
        <View style={s.pickArea}>
          <Pressable style={s.dropBox} onPress={() => act('upPick', 'pdf')} testID="upload.pick.pdf">
            <View style={s.dropIcon}>
              <Icon name="upload" size={24} color="#F5A01F" />
            </View>
            <Txt style={s.dropB}>Stage a resource</Txt>
            <Txt style={s.dropSm}>PDF, DOCX, TXT, MD, PNG, JPG, WEBP · up to 100 MB</Txt>
          </Pressable>

          <View style={s.srcRow}>
            <Pressable style={s.srcBtn} onPress={() => act('upPick', 'pdf')} testID="upload.src.files">
              <Icon name="file" size={22} color="#E8890C" />
              <Txt style={s.srcB}>Browse files</Txt>
              <Txt style={s.srcSm}>From your phone</Txt>
            </Pressable>
            <Pressable style={s.srcBtn} onPress={() => act('upPick', 'img')} testID="upload.src.gallery">
              <Icon name="image" size={22} color="#E8890C" />
              <Txt style={s.srcB}>Gallery</Txt>
              <Txt style={s.srcSm}>Photos & scans</Txt>
            </Pressable>
            <Pressable style={s.srcBtn} onPress={() => act('push', 'note:new')} testID="upload.src.note">
              <Icon name="pen" size={22} color="#E8890C" />
              <Txt style={s.srcB}>Text note</Txt>
              <Txt style={s.srcSm}>Write it here</Txt>
            </Pressable>
          </View>
        </View>
      )}

      <Txt style={s.kLbl}>RECENTLY UPLOADED</Txt>
      <View style={s.cardList}>
        {DOCS.slice(0, 3).map((d, i) => (
          <View key={i} style={s.cardRow}>
            <View style={[s.cardIcon, { backgroundColor: d.k === 'JPG' ? '#E2F5F1' : '#FDECEC' }]}>
              <Icon name={d.k === 'JPG' ? 'image' : 'file'} size={18} color={d.k === 'JPG' ? '#0E9A8A' : '#E5484D'} />
            </View>
            <View style={s.cardInfo}>
              <Txt style={s.cardTitle} numberOfLines={1}>{d.t}</Txt>
              <Txt style={s.cardMeta}>{d.m}</Txt>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={s.ghostBtn} onPress={() => act('push', 'cloud')} testID="upload.openVault">
        <Icon name="db" size={18} color="#1B8AD3" />
        <Txt style={s.ghostTx}>Open Cloud Data Vault</Txt>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingBottom: 36 },
  kLbl: { ...font('sans', 800), fontSize: 10.5, letterSpacing: 1.4, color: '#8A93A0', marginTop: 18, marginBottom: 8, textTransform: 'uppercase' },
  stage: { padding: 14, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  fileCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 14, backgroundColor: '#F7F9FB' },
  fileBadge: { paddingVertical: 4, paddingHorizontal: 7, borderRadius: 6 },
  fileBadgeTx: { ...font('sans', 800), fontSize: 10, color: '#FFFFFF' },
  fileInfo: { flex: 1 },
  fileName: { ...font('sans', 700), fontSize: 13.5, color: '#14161C' },
  fileSub: { fontSize: 11.5, color: '#7A8494', marginTop: 1 },
  closeBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  chRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  folderChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 9, backgroundColor: '#F1F4F8' },
  folderChipOn: { backgroundColor: '#E8F3FC' },
  folderChipTx: { ...font('sans', 600), fontSize: 12.5, color: '#4A505B' },
  tagsBox: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', padding: 8, borderRadius: 13, borderWidth: 1.5, borderColor: '#E3E7ED', marginTop: 4 },
  tagPill: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 28, paddingLeft: 10, paddingRight: 6, borderRadius: 8, backgroundColor: '#FFF3DF' },
  tagPillTx: { ...font('sans', 700), fontSize: 12.5, color: '#B86E00' },
  tagIn: { flex: 1, minWidth: 90, height: 28, fontSize: 13.5, padding: 0 },
  progBox: { marginTop: 14 },
  progTrack: { height: 7, borderRadius: 4, backgroundColor: '#EEF2F7', overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 4, backgroundColor: '#F5A01F' },
  progTx: { fontSize: 12.5, fontWeight: '600', color: '#5B6472', marginTop: 6 },
  uploadCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 48, borderRadius: 14, backgroundColor: '#F5A01F', marginTop: 14 },
  uploadCtaDis: { opacity: 0.5 },
  uploadCtaTx: { ...font('sans', 700), fontSize: 14.5, color: '#FFFFFF' },
  pickArea: { gap: 10 },
  dropBox: { alignItems: 'center', padding: 24, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#E8ECF2', borderStyle: 'dashed' },
  dropIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF4E2', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  dropB: { ...font('sans', 700), fontSize: 15, color: '#14161C' },
  dropSm: { fontSize: 12, color: '#7A8494', marginTop: 3, textAlign: 'center' },
  srcRow: { flexDirection: 'row', gap: 8 },
  srcBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1' },
  srcB: { ...font('sans', 700), fontSize: 12.5, color: '#14161C', marginTop: 4 },
  srcSm: { fontSize: 10.5, color: '#7A8494', marginTop: 1 },
  cardList: { borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1', overflow: 'hidden' },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderBottomWidth: 1, borderBottomColor: '#F4F6F9' },
  cardIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { ...font('sans', 600), fontSize: 13.5, color: '#14161C' },
  cardMeta: { fontSize: 11.5, color: '#7A8494', marginTop: 2 },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 48, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7E5F2', marginTop: 14 },
  ghostTx: { ...font('sans', 700), fontSize: 13.5, color: '#1B8AD3' },
});

const view: ViewDef = {
  useTitle: () => 'Upload to Cloud',
  Screen: UploadScreen,
};

export default view;
