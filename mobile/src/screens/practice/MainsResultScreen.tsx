// Source: PrepAssist.html L6658-L6658 (VIEWS.mainsResult)
// Source: PrepAssist.html L6804-L6831 (mainsResultHTML)
// Source: PrepAssist.html L6803-L6803 (animateRubric)
// Source: PrepAssist.html L8217-L8224 (mvProcess)
// Source: PrepAssist.html L2776-L2813 (.ev*, .remark, .rub, .rb, .fbk, .appr, .annot), L3050, L3070, L3073 (overrides)
// The evaluation report. Computed (reference/android view-mainsResult, view-mainsResult-pushed):
//   .ev        padding 0 20 120
//   .ev-head   two columns (1fr, auto) gap 16, bottom-aligned; padding-bottom 18; border-bottom 1px --brand
//     .k       inline (line box 22.475) Inter 700 10.5px, letter-spacing 1.47px, uppercase, --muted
//     h1       Inter Tight 600 18px / 24.3px, letter-spacing -0.18px, margin-top 6
//     .ev-score right-aligned: b Inter Tight 700 58px / 49.3px (-1.74px), span Inter Tight 400 20px --muted
//              (inline, one line box), small 11.5px / 16.675px --muted, margin-top 6
//   .remark    margin 18 0 6, padding 14 16, #FFFDF8, 1px #F1D9B0, radius 4, Caveat 400 20px / 24px #C0392B,
//              rotate(-.6deg); small Inter 700 10.5px / 12.6px, letter-spacing 1.47px, uppercase --muted, mb 4
//   .rub       margin-top 20; .rb rows are the shared RatioBar; .rub-k right-aligned key with a 10 x 1 --brand line
//   .fbk       margin-top 26; h3 row gap 8 Inter 700 10.5px letter-spacing 1.68px uppercase (icon 20)
//     li       Inter (--read) 400 15.5px / 23.25px #25272D, padding 10 0 10 22, border-bottom --rule;
//              ::before 8 x 1.5 dash at left 4 top 19; em = highlighter gradient (transparent 55%, rgba(255,196,90,.6) 55%)
//   .appr      1px --rule-2, radius 12, #fff; rows padding 12 14, two columns 86 / 1fr gap 10,
//              b Inter 700 11.5px / 16.675px letter-spacing 1.15px uppercase --muted padding-top 2;
//              span 13.5px / 19.575px
//   .annot     margin-top 18, radius 6, 1px --rule-2; the annotated handPage at full width (280 x 300 box)
// Bars: animateRubric() (L6803) sets the widths 120 ms after the report replaces the mains page; a plain
// push:mainsResult never calls it, so the bars stay at 0 (reference view-mainsResult-pushed).
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn, Icon, RatioBar, pageHeaderActStyle } from '../../components';
import { ANSWERBANK, MAINSQ } from '../../data';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, palettes, Txt, useTheme } from '../../theme';
import { resultQuestion } from './logic/mains';
import { HandPage } from './parts/HandPage';
import { ModelBox } from './parts/ModelBox';

const C = palettes.free;

const s = StyleSheet.create({
  ev: { paddingHorizontal: 20, paddingBottom: 120 },
  head: { flexDirection: 'row', alignItems: 'flex-end', gap: 16, paddingBottom: 18, borderBottomWidth: 1 },
  k: { ...font('sans', 700), fontSize: 10.5, lineHeight: 22.475, letterSpacing: 1.47, textTransform: 'uppercase', color: C.muted },
  h1: { ...font('serif', 600), fontSize: 18, lineHeight: 24.3, letterSpacing: -0.18, marginTop: 6 },
  score: { alignItems: 'flex-end' },
  scoreLine: { ...font('serif', 700), fontSize: 58, lineHeight: 49.3, letterSpacing: -1.74, textAlign: 'right' },
  scoreS: { ...font('serif', 400), fontSize: 20, letterSpacing: 0, color: C.muted },
  scoreSm: { fontSize: 11.5, lineHeight: 16.675, color: C.muted, marginTop: 6, textAlign: 'right' },
  remark: {
    marginTop: 18,
    marginBottom: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFDF8',
    borderWidth: 1,
    borderColor: '#F1D9B0',
    borderRadius: 4,
    transform: [{ rotate: '-0.6deg' }],
  },
  remarkSm: { ...font('sans', 700), fontSize: 10.5, lineHeight: 12.6, letterSpacing: 1.47, textTransform: 'uppercase', color: C.muted, marginBottom: 4 },
  remarkT: { ...font('hand', 400), fontSize: 20, lineHeight: 24, color: '#C0392B' },
  u: { textDecorationLine: 'underline', textDecorationColor: '#C0392B' },
  rub: { marginTop: 20 },
  rubK: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 6 },
  rubKi: { width: 10, height: 1 },
  rubKt: { fontSize: 11.5, lineHeight: 16.675, color: C.muted },
  fbk: { marginTop: 26 },
  h3: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  h3t: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase' },
  li: { paddingVertical: 10, paddingLeft: 22, borderBottomWidth: 1, borderBottomColor: C.rule },
  liDash: { position: 'absolute', left: 4, top: 19, width: 8, height: 1.5, backgroundColor: '#25272D' },
  liT: { ...font('read', 400), fontSize: 15.5, lineHeight: 23.25, color: '#25272D' },
  em: { backgroundColor: 'rgba(255, 196, 90, 0.6)' },
  appr: { borderWidth: 1, borderColor: C.rule2, borderRadius: 12, overflow: 'hidden', backgroundColor: C.sheet },
  apprRow: { flexDirection: 'row', gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: C.rule },
  apprB: { ...font('sans', 700), width: 86, fontSize: 11.5, lineHeight: 16.675, letterSpacing: 1.15, textTransform: 'uppercase', color: C.muted, paddingTop: 2 },
  apprS: { flex: 1, fontSize: 13.5, lineHeight: 19.575 },
  annot: { marginTop: 18, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: C.rule2, backgroundColor: '#FFFFFF' },
  btns: { gap: 10, marginTop: 24 },
});

const RUB: [string, number][] = [
  ['Structure', 6.5],
  ['Content', 5.5],
  ['Relevance', 8],
  ['Presentation', 7],
];

/**
 * `em` inside .fbk li: `background: linear-gradient(transparent 55%, rgba(255,196,90,.6) 55%)` on an
 * inline element. React Native draws no gradients on nested text; the lower 45 % band is not
 * reproducible there (see the practice report). The highlight is drawn as the em's background colour.
 */
function Li({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={s.li}>
      <View style={s.liDash} />
      <Txt style={s.liT}>{children}</Txt>
    </View>
  );
}

function Fbk({ icon, color, title, children }: { icon: IconName; color: string; title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={s.fbk}>
      <View style={s.h3}>
        <Icon name={icon} color={color} />
        <Txt style={[s.h3t, { color }]}>{title}</Txt>
      </View>
      {children}
    </View>
  );
}

/** mainsResultHTML(). `animate`: the page came from mvProcess() and animateRubric() runs. */
export function MainsReport({ animate, entryKey }: { animate: boolean; entryKey: number }): React.JSX.Element {
  const t = useTheme();
  const mv = useStore(st => st.mv);
  // the question is read when the report is built (S.mv changes later do not rebuild it)
  const [q] = useState(() => resultQuestion(mv, ANSWERBANK, MAINSQ));
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    if (!animate) return;
    const id = setTimeout(() => setGrown(true), 120);
    return () => clearTimeout(id);
  }, [animate]);
  const open = useStore(st => !!st.modelOpen[`${entryKey}:evModel`]);
  return (
    <View style={s.ev}>
      <View style={[s.head, { borderBottomColor: t.brand }]}>
        <View style={{ flex: 1 }}>
          <Txt style={s.k}>
            {q.p} · {q.m} marks · {q.words} words
          </Txt>
          <Txt style={s.h1}>{q.t}</Txt>
        </View>
        <View style={s.score}>
          <Txt style={s.scoreLine}>
            8.5<Txt style={s.scoreS}>/15</Txt>
          </Txt>
          <Txt style={s.scoreSm}>Top 32% this week</Txt>
        </View>
      </View>
      <View style={s.remark}>
        <Txt style={s.remarkSm}>Examiner’s note</Txt>
        {q.custom ? (
          <Txt style={s.remarkT}>
            Good range of examples, but you use the key term before defining it. Open with <Txt style={s.u}>one crisp definition</Txt>, add a data point, then close with a way forward.
          </Txt>
        ) : (
          <Txt style={s.remarkT}>
            Good grasp of writs, but the answer reads like a list. Build an argument — show <Txt style={s.u}>how</Txt> the Court expanded Art. 32, with cases.
          </Txt>
        )}
      </View>
      <View style={s.rub}>
        {RUB.map(([k, v]) => (
          <RatioBar key={k} label={k} percent={grown ? v * 10 : 0} value={`${v}/10`} />
        ))}
        <View style={s.rubK}>
          <View style={[s.rubKi, { backgroundColor: t.brand }]} />
          <Txt style={s.rubKt}>Toppers’ benchmark (7/10)</Txt>
        </View>
      </View>
      <Fbk icon="doc" color={t.brandDeep} title="Your answer, annotated · Page 1 of 2">
        <View style={s.annot}>
          <AnnotPage />
        </View>
      </Fbk>
      <Fbk icon="check" color={C.ok} title="Strengths">
        <Li>All five writs explained accurately, with the Art. 32 vs Art. 226 distinction made clearly.</Li>
        <Li>
          Quotes Dr Ambedkar in the introduction — an <Txt style={s.em}>effective, examiner-friendly opening</Txt>.
        </Li>
        <Li>Legible handwriting and clear paragraphing.</Li>
      </Fbk>
      <Fbk icon="x" color={C.bad} title="Areas to improve">
        <Li>
          The question asks about <Txt style={s.em}>judicial interpretation</Txt>; only one case (Kesavananda) is cited. Add PIL, compensation and continuing mandamus.
        </Li>
        <Li>310 words against a 250-word limit — the writ definitions can be compressed into a single table or line.</Li>
        <Li>Conclusion is generic. End with a forward-looking line on access to justice and institutional capacity.</Li>
      </Fbk>
      <Fbk icon="list" color={t.brandDeep} title="Suggested approach">
        <View style={s.appr}>
          {[
            ['Intro', 'Define Art. 32 + Ambedkar’s quote (≈30 words).'],
            ['Body 1', 'Expansion: locus standi & PIL (S.P. Gupta), compensation (Rudul Sah, Nilabati Behera), continuing mandamus (Vineet Narain).'],
            ['Body 2', 'Rights widened via Art. 21 (Maneka Gandhi → Puttaswamy), basic structure (L. Chandra Kumar).'],
            ['Balance', 'Docket pressure, overreach, HC-first approach.'],
            ['Close', 'Way forward in one line.'],
          ].map(([b, x], k) => (
            <View key={b} style={[s.apprRow, k === 4 && { borderBottomWidth: 0 }]}>
              <Txt style={s.apprB}>{b}</Txt>
              <Txt style={s.apprS}>{x}</Txt>
            </View>
          ))}
        </View>
      </Fbk>
      <ModelBox id="evModel" title="Model answer · 248 words" open={open} style={{ marginTop: 12 }} />
      <View style={s.btns}>
        <Btn variant="ink" wide icon="spark" label="Discuss this feedback with AI Mentor" onPress={() => act('mentorAsk:Why was my Mains answer weak?')} />
        <Btn variant="line" wide icon="refresh" label="Re-attempt this question" onPress={() => act('mainsWith:mq1')} />
      </View>
    </View>
  );
}

/** `.annot svg{width:100%}`: the 280 x 300 viewBox at the box width (370 -> 396.4 high). */
function AnnotPage(): React.JSX.Element {
  const [w, setW] = useState(0);
  return (
    <View onLayout={e => setW(e.nativeEvent.layout.width)}>
      {w ? <HandPage seed={1} annotated width={w} height={(w * 300) / 280} /> : null}
    </View>
  );
}

/** v.action: `<button class="act" data-act="toast:Report saved to Cloud Data Vault">` with the share icon. */
export function ReportAction(): React.JSX.Element {
  return (
    <Pressable style={pageHeaderActStyle} onPress={() => act('toast:Report saved to Cloud Data Vault')} accessibilityLabel="Share" testID="mainsResult.share">
      <Icon name="share" color={C.ink} />
    </Pressable>
  );
}

function MainsResultScreen({ entryKey }: ViewProps): React.JSX.Element {
  return <MainsReport animate={false} entryKey={entryKey} />;
}

const view: ViewDef = {
  useTitle: () => 'Evaluation report',
  Action: ReportAction,
  Screen: MainsResultScreen,
};

export default view;
