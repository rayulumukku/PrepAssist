// Source: PrepAssist.html L6921-L6921 (SHEETS.revisions)
// "Due for revision": intro line, one .sh-list row per REVISIONS item (check when done, struck-through title),
// and the ink wide button. Computed: reference/android/sheet-revisions, sheet-revisions-one-done.
//   p        13.5/19.575 --muted, margin-bottom 6 (inline style)
//   .ti      colour SUBJ[r.s].c (inline), icon layers / check; chev --ink
//   b (done) text-decoration line-through, colour --muted (inline style)
//   .btn.btn-ink.btn-wide margin-top 16 (inline); --brand background (.btn-ink is recoloured to --brand, computed rgb(27,138,211))
import React from 'react';
import { StyleSheet } from 'react-native';
import { act } from '../../actions';
import { Btn, Icon, SheetFrame, SheetList, SheetListItem } from '../../components';
import { REVISIONS, SUBJ } from '../../data';
import { useStore } from '../../store';
import { cssColor, palettes, Txt, useTheme } from '../../theme';

function RevisionsSheet(): React.JSX.Element {
  const done = useStore(s => s.revDone);
  const t = useTheme();
  return (
    <SheetFrame title="Due for revision" testID="sheet.revisions">
      <Txt style={styles.p}>Spaced repetition picks these so you revise just before you’d forget.</Txt>
      <SheetList>
        {REVISIONS.map(r => (
          <SheetListItem
            key={r.id}
            title={r.t}
            subtitle={r.d}
            icon={done.has(r.id) ? 'check' : 'layers'}
            iconColor={cssColor(SUBJ[r.s].c, t)}
            titleStyle={done.has(r.id) ? styles.done : undefined}
            after={<Icon name="chev" />}
            onPress={() => act('revDo', r.id)}
            testID={`sheet.revisions.${r.id}`}
          />
        ))}
      </SheetList>
      <Btn variant="ink" wide label="Revise all as flashcards" onPress={() => act('revAll')} style={styles.btn} testID="sheet.revisions.all" />
    </SheetFrame>
  );
}

const styles = StyleSheet.create({
  p: { color: palettes.free.muted, fontSize: 13.5, lineHeight: 19.575, marginBottom: 6 },
  done: { textDecorationLine: 'line-through', color: palettes.free.muted },
  btn: { marginTop: 16 },
});

export default RevisionsSheet;
