// Source: PrepAssist.html L6619-L6625 (VIEWS.answer)
// Source: PrepAssist.html L2725-L2738 (.article, .kick, h1, .ptr), L7026 (A.modelOpen)
// Computed (reference/android view-answer, view-answer-model-open):
//   .article  padding 0 20 120
//   .kick     margin-top 6; Inter 700 11.5px / 16.675px, letter-spacing 1.38px, uppercase, --muted
//   h1        Inter Tight 700 22px / 24.2px (inline font-size 22), letter-spacing -0.55px, margin-top 10
//   .ptr      margin 20 0; h6 Inter 700 10.5px / 15.225px letter-spacing 1.68px uppercase --muted, mb 8;
//             li padding 8 0 8 18, border-bottom --rule, Inter 400 14.5px / 21.75px; ::before 6 x 6 --hl
//             square rotated 45deg at left 2 top 16, radius 1; b Inter 700
//   #abModel  the model box (parts/ModelBox) with `.article .body p` text (16.5px / 28.05px --ink-2)
//   button    .btn-ink.btn-wide margin-top 22, pen icon, "Write & get it evaluated"
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn } from '../../components';
import { ANSWERBANK } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, palettes, Txt } from '../../theme';
import { ModelBox } from './parts/ModelBox';

const C = palettes.free;
const s = StyleSheet.create({
  article: { paddingHorizontal: 20, paddingBottom: 120 },
  kick: { ...font('sans', 700), marginTop: 6, fontSize: 11.5, lineHeight: 16.675, letterSpacing: 1.38, textTransform: 'uppercase', color: C.muted },
  h1: { ...font('serif', 700), marginTop: 10, fontSize: 22, lineHeight: 24.2, letterSpacing: -0.55 },
  ptr: { marginVertical: 20 },
  h6: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', color: C.muted, marginBottom: 8 },
  li: { paddingVertical: 8, paddingLeft: 18, borderBottomWidth: 1, borderBottomColor: C.rule },
  dot: { position: 'absolute', left: 2, top: 16, width: 6, height: 6, borderRadius: 1, backgroundColor: C.hl, transform: [{ rotate: '45deg' }] },
  liT: { fontSize: 14.5, lineHeight: 21.75 },
  b: { ...font('sans', 700) },
});

/** the directive word of the question (L6622) */
const directive = (t: string): string => (/Discuss/.test(t) ? 'Discuss' : /Examine/.test(t) ? 'Examine' : /Evaluate/.test(t) ? 'Evaluate' : 'Explain');

function AnswerScreen({ arg, entryKey }: ViewProps): React.JSX.Element | null {
  const open = useStore(st => !!st.modelOpen[`${entryKey}:abModel`]);
  const q = ANSWERBANK.find(x => x.id === arg);
  if (!q) return null; // the HTML throws on an unknown id and no page is pushed
  const items: [string, string][] = [
    ['Directive:', ` “${directive(q.t)}” — present multiple dimensions and reach a reasoned view.`],
    ['Core demand:', ' show evolution and impact, not a list of facts.'],
    ['Value-add:', ' cases, committee reports, a simple flow diagram.'],
  ];
  return (
    <View style={s.article}>
      <Txt style={s.kick}>
        {q.p} · {q.m} marks · {q.w} words
      </Txt>
      <Txt style={s.h1}>{q.t}</Txt>
      <View style={s.ptr}>
        <Txt style={s.h6}>Decode the question</Txt>
        {items.map(([b, x]) => (
          <View key={b} style={s.li}>
            <View style={s.dot} />
            <Txt style={s.liT}>
              <Txt style={s.b}>{b}</Txt>
              {x}
            </Txt>
          </View>
        ))}
      </View>
      <ModelBox id="abModel" title="Model answer" open={open} article style={{ marginTop: 0 }} />
      <Btn variant="ink" wide icon="pen" label="Write & get it evaluated" onPress={() => act(`mainsWith:${q.id}`)} style={{ marginTop: 22 }} />
    </View>
  );
}

const view: ViewDef = {
  useTitle: arg => {
    const q = ANSWERBANK.find(x => x.id === arg);
    return q ? q.p + ' · ' + q.m + ' marks' : '';
  },
  Screen: AnswerScreen,
};

export default view;
