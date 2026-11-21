// Source: PrepAssist.html L6533-L6541 (VIEWS.note)
// The note editor. Computed (reference/android/view-note, arg n1):
//   .act       38 x 38 header button with ic('check') (v.action), data-act="toast:Note saved & synced"
//   .sec       padding 0 20px; .tag with the subject colour (pages/PageParts.tsx swatchFix)
//   input      (inline style) block, no border/background; Inter Tight 500 28px / 40.6px; margin 10px 0 14px; 40.59 high
//   .big-ta    min-height 200px, padding 16px, 1px --rule-2, radius 6, #fff, Inter Tight 400 (-> 500 face) 16.5px / 28px,
//              ruled background every 28px at position 14px (pages/RuledLines.tsx), pre-wrap, scrolls
//   .eyebrow   margin 18px 0 8px (inline); chips row: wrap, gap 8px
// The input and textarea are uncontrolled, like the HTML's (their text lives only in the element).
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { act } from '../../actions';
import { Chip, Eyebrow, Icon, pageHeaderActStyle, Tag } from '../../components';
import { NOTES, SUBJ } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { cssColor, font, fontPx, palettes, useTheme } from '../../theme';
import { pageStyles, swatchFix } from './pages/PageParts';
import { RuledLines } from './pages/RuledLines';

const C = palettes.free;

/** L6537: the text the textarea holds for n1 (the other notes show n.b). */
const N1_TEXT =
  'Art 12 — definition of “State”.\nArt 13 — laws inconsistent with FRs void (judicial review).\n\nArt 32 — right to move SC for enforcement of FRs. Itself a FR.\nArt 226 — HCs: FRs + “any other purpose” → wider than 32.\n\nWrits: Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto.\nArt 359 — enforcement suspended in Emergency (except 20, 21).';

const styles = StyleSheet.create({
  title: {
    ...font('serif', 500),
    fontSize: fontPx(28),
    lineHeight: 40.6,
    height: 40.59,
    marginTop: 10,
    marginBottom: 14,
    padding: 0,
    color: C.ink,
  },
  taBox: { height: 200, borderWidth: 1, borderColor: C.rule2, borderRadius: 6, backgroundColor: '#FFFFFF' },
  ta: {
    flex: 1,
    padding: 16,
    ...font('serif', 400),
    fontSize: fontPx(16.5),
    lineHeight: 28,
    color: C.ink,
    textAlignVertical: 'top',
  },
  eyebrow: { marginTop: 18, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});

const noteOf = (id: string | undefined) => NOTES.find(x => x.id === id) ?? { s: 'polity', t: '', b: '' };

function NoteAction(): React.JSX.Element {
  return (
    <Pressable style={pageHeaderActStyle} onPress={() => act('toast:Note saved & synced')} accessibilityRole="button" testID="note.save">
      <Icon name="check" />
    </Pressable>
  );
}

function NoteScreen({ arg }: ViewProps): React.JSX.Element {
  const t = useTheme();
  const n = noteOf(arg);
  return (
    <View style={pageStyles.sec}>
      <Tag color={cssColor(SUBJ[n.s].c, t)} swatch swatchStyle={swatchFix}>{`${SUBJ[n.s].n} · linked to syllabus`}</Tag>
      <TextInput allowFontScaling={false} defaultValue={n.t} placeholder="Title" style={styles.title} testID="note.title" />
      <View style={styles.taBox}>
        <RuledLines period={28} pos={14} height={200} radius={5} />
        <TextInput
          allowFontScaling={false}
          multiline
          defaultValue={arg === 'n1' ? N1_TEXT : n.b}
          placeholder="Start writing…"
          style={styles.ta}
          testID="note.body"
        />
      </View>
      <Eyebrow style={styles.eyebrow}>With PrepAssist AI</Eyebrow>
      <View style={styles.chips}>
        <Chip icon="spark" label="Summarise" onPress={() => act('toast:Summary added at the top')} />
        <Chip icon="layers" label="Make flashcards" onPress={() => act('toast:6 flashcards created from this note')} />
        <Chip icon="mindmap" label="Mindmap" onPress={() => act('push:mindmap')} />
        <Chip icon="target" label="Link to syllabus" onPress={() => act('toast:Linked to GS II › Fundamental Rights')} />
      </View>
    </View>
  );
}

const view: ViewDef = {
  useTitle: arg => (arg === 'new' ? 'New note' : 'Note'),
  Action: NoteAction,
  Screen: NoteScreen,
};

export default view;
