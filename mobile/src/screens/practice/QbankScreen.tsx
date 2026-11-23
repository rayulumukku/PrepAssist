// Source: PrepAssist.html L6631-L6636 (VIEWS.qbank)
// Source: PrepAssist.html L2787-L2792 (.rb), L3010 (fill colour)
// Computed (reference/android view-qbank, view-qbank-economy):
//   .pg-hero with a .tag (inline colour = the subject; the unrelated `.sw` rule L924 gives the square
//   margin-top 12 and rgb(122,114,98)); h1 margin-top 8
//   .rb rows with the inline grid `1fr 70px 36px`: the label column flexes and holds a block <small>
//   ("N questions", 11.5px / 16.675px --muted); the 70 px track; fill --bad under 55 %, else the subject
//   colour; the shared ::after --brand mark at 70 %. The shared RatioBar has fixed label / value widths and
//   a text-only label, so this row is a private port of `.rb` (see the practice report).
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn, Icon, Tag } from '../../components';
import { INLINE_qbank_L6631, SUBJ } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { cssColor, font, palettes, Txt, useTheme } from '../../theme';
import { PgHero, Sec } from './parts/PgHero';

const C = palettes.free;
const s = StyleSheet.create({
  rb: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.rule },
  b: { ...font('sans', 600), flex: 1, fontSize: 13.5, lineHeight: 19.575 },
  sm: { ...font('sans', 400), fontSize: 11.5, lineHeight: 16.675, color: C.muted },
  tr: { width: 70, height: 6, borderRadius: 3, backgroundColor: C.paper3, overflow: 'hidden' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 3 },
  mark: { position: 'absolute', left: '70%', top: 0, bottom: 0, width: 1 },
  sp: { ...font('sans', 600), width: 36, fontSize: 13.5, lineHeight: 19.575, textAlign: 'right', fontVariant: ['tabular-nums'] },
});

function QbankScreen({ arg }: { arg: string | undefined }): React.JSX.Element {
  const t = useTheme();
  const sj = SUBJ[arg ?? ''] || SUBJ.polity;
  const c = cssColor(sj.c, t);
  const topics = INLINE_qbank_L6631[arg ?? ''] || ['Topic A', 'Topic B', 'Topic C'];
  return (
    <>
      <PgHero
        before={
          <Tag color={c} swatch swatchStyle={{ marginTop: 12, backgroundColor: 'rgb(122, 114, 98)' }}>
            Unlimited Question Bank
          </Tag>
        }
        h1Style={{ marginTop: 8 }}
        title={sj.n}
        sub="Practise by topic. Accuracy is from your last 30 days."
      />
      <Sec>
        {topics.map((x, i) => {
          const acc = [48, 62, 71, 52, 66, 80][i] || 60;
          return (
            <Pressable key={x} style={s.rb} onPress={() => act('quiz')}>
              <Txt style={s.b}>
                {x}
                {'\n'}
                <Txt style={s.sm}>{180 + i * 74} questions</Txt>
              </Txt>
              <View style={s.tr}>
                <View style={[s.fill, { width: `${acc}%`, backgroundColor: acc < 55 ? C.bad : c }]} />
                <View style={[s.mark, { backgroundColor: t.brand }]} />
              </View>
              <Txt style={s.sp}>{acc}%</Txt>
            </Pressable>
          );
        })}
        <Btn variant="ink" wide label="Start 10 mixed questions" onPress={() => act('quiz')} style={{ marginTop: 20 }}>
          <Icon name="arrow" color="#FFFFFF" />
        </Btn>
      </Sec>
    </>
  );
}

const view: ViewDef = {
  useTitle: arg => (SUBJ[arg ?? ''] || SUBJ.polity).n + ' · Question bank',
  Screen: QbankScreen,
};

export default view;
