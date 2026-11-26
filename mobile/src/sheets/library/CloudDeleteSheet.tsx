// Source: PrepAssist.html L8185-L8189 (A.vlDel)
// Source: PrepAssist.html L3577-L3580 (.dl-warn, .dl-go, .by-lnk)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import type { SheetProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';

function CloudDeleteSheet({ arg }: SheetProps): React.JSX.Element {
  const rawArg = arg || '';
  const [k, i] = rawArg.split(':');
  const DOCS = useStore(s => s.DOCS);
  const NOTES = useStore(s => s.NOTES);
  const it = k === 'doc' ? DOCS[Number(i)] : NOTES[Number(i)];
  const title = it ? it.t : 'This file';

  return (
    <SheetFrame title="Delete this file?" testID="sheet.cloudDelete">
      <View style={s.warn}>
        <View style={s.warnIcon}>
          <Icon name="trash" size={18} color="#FFFFFF" />
        </View>
        <Txt style={s.warnText}>
          <Txt style={s.bold}>{title}</Txt>
          {' will be permanently removed from your vault.'}
        </Txt>
      </View>
      <Pressable style={s.goBtn} onPress={() => act('vlDelGo', rawArg)} testID="cloudDelete.go">
        <Icon name="trash" size={17} color="#FFFFFF" />
        <Txt style={s.goText}>Delete permanently</Txt>
      </Pressable>
      <Pressable style={s.lnkBtn} onPress={() => act('closeSheet')} testID="cloudDelete.keep">
        <Txt style={s.lnkText}>Keep it</Txt>
      </Pressable>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  warn: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#FDECEC', alignItems: 'center' },
  warnIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#C0392B', alignItems: 'center', justifyContent: 'center' },
  warnText: { flex: 1, fontSize: 13.5, lineHeight: 20.25, color: '#7F1D1D' },
  bold: { ...font('sans', 700), color: '#7F1D1D' },
  goBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 52, marginTop: 14, borderRadius: 16, backgroundColor: '#C0392B' },
  goText: { ...font('sans', 700), fontSize: 15.5, color: '#FFFFFF' },
  lnkBtn: { width: '100%', marginTop: 10, padding: 8, alignItems: 'center', justifyContent: 'center' },
  lnkText: { ...font('sans', 600), fontSize: 13.5, color: '#7A8494', textAlign: 'center' },
});

export default CloudDeleteSheet;
