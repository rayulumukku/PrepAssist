// Source: PrepAssist.html L7585-L7588 (SHEETS.delAsk and its oninput)
// Source: PrepAssist.html L3577-L3587 (.dl-*), L9337 (.dl-go), L9360 (.dl-in radius)
// Computed from reference/android/sheet-delAsk and sheet-delAsk-confirmed. The button is enabled
// when the input, trimmed and upper-cased, is DELETE; opacity .35 while disabled, transition .2s.
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import { NOTES } from '../../data/notes';
import { easeCss, useTransition } from '../../shell/anim';
import { useStore } from '../../store';
import { font, fontPx, palettes, Txt } from '../../theme';

function DelAskSheet(): React.JSX.Element {
  const credits = useStore(st => st.me.credits);
  const docs = useStore(st => st.DOCS.length);
  const [v, setV] = useState('');
  const [focus, setFocus] = useState(false);
  const ok = v.trim().toUpperCase() === 'DELETE';
  const o = useTransition(ok ? 1 : 0.35, 200, easeCss);
  const go = useAnimatedStyle(() => ({ opacity: o.value }));
  const items = [
    `${NOTES.length} notebooks and ${docs} uploaded files`,
    `${credits} AI credits`,
    '23-day streak and all progress',
  ];
  return (
    <SheetFrame
      title="Delete account?"
      testID="sheet.delAsk"
      scrollProps={{ keyboardShouldPersistTaps: 'handled' }}
    >
      <View style={s.warn}>
        <View style={s.warnIc}>
          <Icon name="trash" color="#fff" />
        </View>
        <Txt style={s.warnP}>
          This permanently removes your account, notes, Cloud Vault files,
          evaluations and remaining credits. It can’t be undone.
        </Txt>
      </View>
      <View style={s.list}>
        {items.map(x => (
          <View key={x} style={s.li}>
            <Icon name="x" size={15} color="#C0392B" />
            <Txt style={s.liT}>{x}</Txt>
          </View>
        ))}
      </View>
      <Txt style={s.lab}>
        {'Type '}
        <Txt style={s.labB}>DELETE</Txt>
        {' to confirm'}
      </Txt>
      <View>
        {focus ? <View style={s.ring} /> : null}
        <TextInput
          value={v}
          onChangeText={setV}
          autoComplete="off"
          autoCorrect={false}
          allowFontScaling={false}
          underlineColorAndroid="transparent"
          cursorColor={palettes.free.ink}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={[s.in, focus && s.inFocus]}
          testID="sheet.delAsk.input"
        />
      </View>
      <Animated.View style={go}>
        <Pressable
          style={s.go}
          disabled={!ok}
          onPress={() => act('delGo')}
          testID="sheet.delAsk.go"
        >
          <Icon name="trash" size={17} color="#fff" />
          <Txt style={s.goT}>Delete my account</Txt>
        </Pressable>
      </Animated.View>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  warn: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FDECEC',
  },
  warnIc: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnP: { flex: 1, fontSize: 13.5, lineHeight: 20.25, color: '#7F1D1D' },
  list: { marginVertical: 14, marginHorizontal: 2 },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  liT: { fontSize: 13.5, lineHeight: 19.575, color: '#3A404B' },
  // margin-top 6 collapses into the list's margin-bottom 14
  lab: { fontSize: 12.5, lineHeight: 18.125, color: '#5B6472' },
  labB: { ...font('sans', 700) },
  ring: {
    position: 'absolute',
    top: 5,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 17,
    backgroundColor: '#FDECEC',
  },
  in: {
    height: 50,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E7ED',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 0,
    ...font('sans', 700),
    fontSize: fontPx(16.5),
    letterSpacing: 3.3,
    color: palettes.free.ink,
    includeFontPadding: false,
  },
  inFocus: { borderColor: '#C0392B' },
  go: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: '#C0392B',
  },
  goT: {
    ...font('sans', 700),
    fontSize: 15.5,
    lineHeight: 22.475,
    color: '#fff',
  },
});

export default DelAskSheet;
