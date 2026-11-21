// Source: PrepAssist.html L8192-L8192 (A.nsSplit)
// Source: PrepAssist.html L4290-L4293 (.sp-p, .sp-f, accent-color #2F8A4A), L4083 (.tq-pdf), L4133 (.mv-lab), L3584 + L4232 (.dl-in.sv-in), L3546 (.by-pay)
// Computed (reference/android/sheet-tracker-split-pdf):
//   .sp-p      13.5 / 19.575 #5B6472, margin-bottom 10
//   .sp-f      label row, padding 10, radius 14, ring 1px #E6EBF1, margin-top 8, gap 10; radio 18 (accent #2F8A4A);
//              .tq-pdf 34x40 radius 8 14 8 8 #E5484D, 9px 800 ls .54 white; b 13.5 700 nowrap ellipsis; small 11.5 #7A8494 (inline, 22.475 line)
// The radio is the browser's native control (accent-color): drawn as the reference shows it, a ring with a dot when checked.
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { SheetFrame } from '../../components';
import type { SheetProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { ByPay, DlIn, MvLab } from './trackerParts';

export function Radio({ on }: { on: boolean }): React.JSX.Element {
  return <View style={[s.radio, on && s.radioOn]}>{on ? <View style={s.dot} /> : null}</View>;
}

function TrackerSplitPdfSheet(_: SheetProps): React.JSX.Element {
  const DOCS = useStore(st => st.DOCS);
  const [sel, setSel] = useState(0);
  const [ranges, setRanges] = useState('1-20, 21-42');
  return (
    <SheetFrame title="Split a PDF" testID="trackerSplitPdf">
      <Txt style={s.p}>Break a big book into chapter-sized files, each tagged to a folder.</Txt>
      {DOCS.filter(d => d.k === 'PDF')
        .slice(0, 3)
        .map((d, i) => (
          <Pressable key={d.t} style={s.f} onPress={() => setSel(i)} testID={`trackerSplitPdf.${i}`}>
            <Radio on={sel === i} />
            <View style={s.pdf}>
              <Txt style={s.pdfTx}>PDF</Txt>
            </View>
            <View style={s.d}>
              <Txt style={s.b} numberOfLines={1}>
                {d.t}
              </Txt>
              <Txt style={s.small}>{d.m}</Txt>
            </View>
          </Pressable>
        ))}
      <MvLab>Page ranges</MvLab>
      <DlIn value={ranges} onChangeText={setRanges} accessibilityLabel="Page ranges" testID="trackerSplitPdf.ranges" />
      <ByPay label="Split into files" icon="scissors" onPress={() => act('nsSplitGo')} testID="trackerSplitPdf.go" />
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  p: { fontSize: 13.5, lineHeight: 19.575, color: '#5B6472', marginBottom: 10 },
  f: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, marginTop: 8, borderRadius: 14, boxShadow: '0px 0px 0px 1px #E6EBF1' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#767676', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: '#2F8A4A' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2F8A4A' },
  pdf: { width: 34, height: 40, borderTopLeftRadius: 8, borderTopRightRadius: 14, borderBottomRightRadius: 8, borderBottomLeftRadius: 8, backgroundColor: '#E5484D', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  pdfTx: { ...font('sans', 800), fontSize: 9, lineHeight: 13.05, letterSpacing: 0.54, color: '#FFFFFF' },
  d: { flex: 1, minWidth: 0 },
  b: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575 },
  small: { fontSize: 11.5, lineHeight: 22.475, color: '#7A8494' },
});

export default TrackerSplitPdfSheet;
