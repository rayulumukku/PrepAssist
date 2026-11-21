// Source: PrepAssist.html L8175 (A.svAdd), L4133 (.mv-lab), L3584-L3585 (.dl-in, :focus), L4232 (.sv-in), L3546-L3547 (.by-pay), L9337, L9360 (ds overrides)
// sheetFrame('Save a link', …). Computed (reference/android/sheet-saved-add-link):
//   .mv-lab  row, space-between, margin 18 0 8; Inter 700 12.5px / 18.125px #3A404B
//   .dl-in.sv-in  50 high, margin-top 8, radius 14, 1px #E3E7ED, padding 0 14, #fff; Inter 500 15.5px --ink, no tracking;
//            placeholder rgb(117,117,117). :focus border #C0392B + box-shadow 0 0 0 3px #FDECEC
//   .by-pay  row centred, gap 8, 52 high, margin-top 14, radius 16, linear-gradient(90deg, #1B8AD3, #3B5BCC),
//            box-shadow 0 14px 24px -14px rgba(27,138,211,.9); Inter 700 15.5px / 22.475px #fff; ic 16px
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import type { SheetProps } from '../../navigation/routes';
import { setS, useStore } from '../../store';
import { font, fontPx, palettes, Txt } from '../../theme';

const styles = StyleSheet.create({
  lab: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B', marginTop: 18, marginBottom: 8 },
  in: {
    height: 50,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E7ED',
    paddingHorizontal: 14,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
    ...font('sans', 500),
    fontSize: fontPx(15.5),
    color: palettes.free.ink,
  },
  focus: { borderColor: '#C0392B', boxShadow: '0px 0px 0px 3px #FDECEC' },
  pay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    marginTop: 14,
    borderRadius: 16,
    backgroundImage: 'linear-gradient(90deg, #1B8AD3, #3B5BCC)',
    boxShadow: '0px 14px 24px -14px rgba(27, 138, 211, 0.9)',
  },
  payT: { ...font('sans', 700), fontSize: 15.5, lineHeight: 22.475, color: '#FFFFFF' },
});

function In({ value, field, placeholder, url, testID }: { value: string; field: 'svUrl' | 'svT'; placeholder: string; url?: boolean; testID: string }): React.JSX.Element {
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      style={[styles.in, focus && styles.focus]}
      value={value}
      onChangeText={v => setS(field === 'svUrl' ? { svUrl: v } : { svT: v })}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      placeholder={placeholder}
      placeholderTextColor="rgb(117, 117, 117)"
      keyboardType={url ? 'url' : 'default'}
      autoCapitalize={url ? 'none' : 'sentences'}
      autoCorrect={!url}
      allowFontScaling={false}
      testID={testID}
    />
  );
}

function SavedAddLinkSheet(_props: SheetProps): React.JSX.Element {
  const url = useStore(s => s.svUrl);
  const t = useStore(s => s.svT);
  return (
    <SheetFrame title="Save a link" testID="sheet.savedAddLink">
      <Txt style={styles.lab}>Paste a URL</Txt>
      <In value={url} field="svUrl" placeholder="https://…" url testID="sheet.savedAddLink.url" />
      <Txt style={styles.lab}>Title (optional)</Txt>
      <In value={t} field="svT" placeholder="We’ll use the page title" testID="sheet.savedAddLink.title" />
      <Pressable style={styles.pay} onPress={() => act('svSave')} accessibilityRole="button" testID="sheet.savedAddLink.save">
        <Icon name="bookmark" size={16} color="#FFFFFF" />
        <Txt style={styles.payT}>Save to reading list</Txt>
      </Pressable>
    </SheetFrame>
  );
}

export default SavedAddLinkSheet;
