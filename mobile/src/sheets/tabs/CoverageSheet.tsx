// Source: PrepAssist.html L6933-L6933 (SHEETS.coverage)
// "Syllabus progress": eight .rb rows (grid 110px 1fr 40px, inline), fill colour SUBJ[k].c, and a muted note.
// Computed: reference/android/sheet-coverage (p: 12.5/18.125 --muted, margin-top 12, inline style).
import React from 'react';
import { StyleSheet } from 'react-native';
import { RatioBar, SheetFrame } from '../../components';
import { SUBJ } from '../../data';
import { cssColor, palettes, Txt, useTheme } from '../../theme';

const COV: readonly (readonly [string, number])[] = Object.entries({ polity: 58, history: 44, geo: 51, eco: 36, env: 29, snt: 33, ir: 47, ethics: 22 });

function CoverageSheet(): React.JSX.Element {
  const t = useTheme();
  return (
    <SheetFrame title="Syllabus progress" testID="sheet.coverage">
      {COV.map(([k, v]) => (
        <RatioBar key={k} label={SUBJ[k].n} percent={v} value={`${v}%`} color={cssColor(SUBJ[k].c, t)} labelWidth={110} testID={`sheet.coverage.${k}`} />
      ))}
      <Txt style={styles.p}>Coverage counts a topic once you’ve finished its lecture, made notes and attempted its questions.</Txt>
    </SheetFrame>
  );
}

const styles = StyleSheet.create({
  p: { fontSize: 12.5, lineHeight: 18.125, color: palettes.free.muted, marginTop: 12 },
});

export default CoverageSheet;
