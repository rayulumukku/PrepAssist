// Source: PrepAssist.html L10007-L10017 (x4TermSheet)
// Source: PrepAssist.html L9598-L9611 (.x4d, .x4d-top, .x4d-k, .x4d-f, .x4d-n, .x4d-m, .x4d-a)
// Computed (reference/android/sheet-xray-term):
//   .x4d      padding 2 20 18
//   .x4d-k    26 high, padding 0 10, radius 8, #E2F5FB / #0B7FA6, 10.5px 800 ls 1.26 uppercase, icon 14
//   h3        EB Garamond 500 28 / 30.8 #0A5F7D, margin-top 14
//   .x4d-f    13px 600 / 18.85 #7A8494, margin-top 4
//   p         15.5 / 24.8, margin-top 14, padding-top 14, border-top 1px #EEF2F6
//   .x4d-n    margin-top 14, padding 12, radius 14, #FFF8EA, inset ring 1px #F6E2C2, 13 / 19.5 #5B4A2A, icon 17 #E8890C
//   .x4d-m    margin-top 12, 12 / 17.4 #8A93A0, icon 14, gap 6
//   .x4d-a    two columns, gap 8, margin-top 16; buttons 46 high radius 14, 13.5px 700; first #0B7FA6 / white
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Circ, Icon, SheetGrab } from '../../components';
import type { SheetProps } from '../../navigation/routes';
import { scanBy, subN, termCount } from '../../screens/library/xray/x4';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';

function XrayTermSheet({ arg }: SheetProps): React.JSX.Element {
  const scan = useStore(s => s.x4.scan);
  const list = useStore(s => s.XSC);
  const k = arg ?? '';
  const sc = scanBy(scan, list);
  const T = sc.terms[k] || ['', 'Definition coming soon.', ''];
  const n = termCount(sc, k);
  return (
    <>
      <SheetGrab />
      <View style={s.x4d}>
        <View style={s.top}>
          <View style={s.k}>
            <Icon name="learn" size={14} color="#0B7FA6" />
            <Txt style={s.kTx}>UPSC statutory dictionary</Txt>
          </View>
          <Circ icon="close" label="Close" onPress={() => act('closeSheet')} />
        </View>
        <Txt style={s.h3}>{k}</Txt>
        <Txt style={s.f}>{T[0]}</Txt>
        <Txt style={s.p}>{T[1]}</Txt>
        {T[2] ? (
          <View style={s.n}>
            <Icon name="target" size={17} color="#E8890C" />
            <Txt style={s.nTx}>
              <Txt style={s.nB}>Exam angle · </Txt>
              {T[2]}
            </Txt>
          </View>
        ) : null}
        <View style={s.m}>
          <Icon name="xray" size={14} color="#8A93A0" />
          <Txt style={s.mTx}>{`Appears ${n} time${n > 1 ? 's' : ''} in this article · ${subN(sc.s)}`}</Txt>
        </View>
        <View style={s.a}>
          <Pressable style={[s.btn, s.btn1]} onPress={() => act('x4Flash', encodeURIComponent(k))} testID="xrayTerm.flash">
            <Icon name="layers" size={16} color="#FFFFFF" />
            <Txt style={[s.btnTx, s.btnTx1]}>Add to flashcards</Txt>
          </Pressable>
          <Pressable style={s.btn} onPress={() => act('x4Ask')} testID="xrayTerm.ask">
            <Icon name="spark" size={16} color="#14161C" />
            <Txt style={s.btnTx}>Ask the mentor</Txt>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  x4d: { paddingTop: 2, paddingHorizontal: 20, paddingBottom: 18 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  k: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#E2F5FB' },
  kTx: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#0B7FA6' },
  h3: { ...font('book', 500), fontSize: 28, lineHeight: 30.8, color: '#0A5F7D', marginTop: 14 },
  f: { ...font('sans', 600), fontSize: 13, lineHeight: 18.85, color: '#7A8494', marginTop: 4 },
  p: { lineHeight: 24.8, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  n: { flexDirection: 'row', gap: 10, marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: '#FFF8EA', boxShadow: 'inset 0px 0px 0px 1px #F6E2C2' },
  nTx: { flex: 1, fontSize: 13, lineHeight: 19.5, color: '#5B4A2A' },
  nB: { ...font('sans', 700) },
  m: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  mTx: { fontSize: 12, lineHeight: 17.4, color: '#8A93A0' },
  a: { flexDirection: 'row', gap: 8, marginTop: 16 },
  btn: { flex: 1, height: 46, borderRadius: 14, backgroundColor: '#F1F4F8', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btn1: { backgroundColor: '#0B7FA6' },
  btnTx: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#14161C', textAlign: 'center' },
  btnTx1: { color: '#FFFFFF' },
});

export default XrayTermSheet;
