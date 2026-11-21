// Source: PrepAssist.html L7865-L7887 (VIEWS.mains)
// Source: PrepAssist.html L8106-L8106 (mvCount), L8158-L8165 (A.mv*), L8217-L8225 (mvProcess)
// Source: PrepAssist.html L4132-L4161 (.mv-*), L9312-L9360 (ds overrides)
// The Mains evaluation panel (the final VIEWS.mains; the older S.mains flow is dead code, see actions).
// Computed (reference/android view-mains, view-mains-pages-added, view-mains-typed(-filled), view-mains-evaluating):
//   .me-page.tlp  padding 4 20 40 (page background #F5F7FA comes from VIEW_META)
//   .mv-panel     padding 16, radius 18, #fff, box-shadow 0 0 0 1px #E6EBF1
//   .mv-lab       row, space-between, margin 18 0 8; Inter 700 12.5px / 18.125px #3A404B;
//                 em Inter 700 10.5px, letter-spacing .42px, uppercase, #C0392B (upright)
//   .mv-q / .mv-t padding 12 13, radius 14, 1px #E3E7ED, #FAFBFC, Inter 400 14.5px / 21.75px #14161C;
//                 rows 4 (113 high) / 9 (221.75 high); :focus border #1B8AD3, background #fff
//   .mv-pick      row gap 6, margin-top 8; Inter 700 12.5px / 18.125px #0A97B8; bank icon 15
//   .mv-ctx       column gap 8; button row gap 11, padding 11 12, radius 14, box-shadow 0 0 0 1.5px #E6EBF1;
//                 .on #F0FAFC + 1.5px #0A97B8; i 22 x 22 radius 7 (inset 1.5px #C9D2DD, .on #0A97B8 with a 14 px
//                 check, stroke 2.6); b Inter 600 13.5px / 19.575px; small 11.5px / 16.675px #7A8494 mt 1
//   .mv-drop      column, centred; padding 18 14 14; radius 18; 1px dashed #BFD3E6; #FAFCFE
//   .mv-thumbs    row gap 10, padding 4 2; .mv-th 84 wide: page 84 x 112 radius 8 (shadow 0 0 0 1px #E1E8F0,
//                 0 6px 12px -8px rgba(0,0,0,.3)), label 11.5 / 16.675 #7A8494 mt 5, delete 22 round #14161C at -6/-6
//   .mv-src       three columns gap 8, margin-top 14; button column gap 5, padding 10 4, radius 14, #fff,
//                 0 0 0 1px #E1E8F0; Inter 600 12.5px / 18.125px #3A404B; icon 19 #0A97B8
//   .mv-wc        row gap 10, margin-top 8; track 5 high #EEF2F7 radius 5, fill #0A97B8 (`width .2s`);
//                 span Inter 700 11.5px / 16.675px #5B6472 (.over #C0392B)
//   #mvRun        margin-top 18: the pen CTA, or the evaluating box
//   .mv-note      row centred gap 6, margin-top 10, 12.5px / 18.125px #7A8494; spark 14 #6C5DD3
// After mvProcess() the HTML turns this page into the evaluation report in place (top.id = 'mainsResult').
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { act } from '../../actions';
import { mainsRender, mvCount, mvSetQ } from '../../actions/practice';
import { Icon, PenCTA, pageHeaderActStyle } from '../../components';
import { ANSWERBANK } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { easeCss, useTransition } from '../../shell/anim';
import { font, fontPx, Txt } from '../../theme';
import { wcPct, wordCount } from './logic/mains';
import { HandPage } from './parts/HandPage';
import { ProcBox } from './parts/Proc';
import { Seg } from './parts/Seg';
import { TlHero } from './parts/TlHero';
import { MainsReport, ReportAction } from './MainsResultScreen';

const TEAL = '#0A97B8';

const s = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  panel: { padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  lab: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, marginBottom: 8 },
  labT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B' },
  labEm: { ...font('sans', 700), fontSize: 10.5, lineHeight: 18.125, letterSpacing: 0.42, textTransform: 'uppercase', color: '#C0392B' },
  area: {
    ...font('sans', 400),
    fontSize: fontPx(14.5),
    lineHeight: 21.75,
    color: '#14161C',
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E7ED',
    backgroundColor: '#FAFBFC',
    textAlignVertical: 'top',
    // a <textarea> is inline-block: it sits on the line box's baseline, leaving the descender gap below
    // (computed: 6.47 px between the textarea and the next block's margin)
    marginBottom: 6.47,
  },
  focus: { borderColor: '#1B8AD3', backgroundColor: '#FFFFFF' },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, alignSelf: 'flex-start' },
  pickT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: TEAL },
  ctx: { gap: 8 },
  ctxB: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 14, boxShadow: '0px 0px 0px 1.5px #E6EBF1' },
  ctxOn: { backgroundColor: '#F0FAFC', boxShadow: `0px 0px 0px 1.5px ${TEAL}` },
  ctxI: { width: 22, height: 22, borderRadius: 7, alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0px 0px 0px 1.5px #C9D2DD' },
  ctxIOn: { backgroundColor: TEAL, boxShadow: 'none' },
  ctxBt: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575 },
  ctxSm: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 1 },
  drop: { alignItems: 'center', paddingTop: 18, paddingHorizontal: 14, paddingBottom: 14, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BFD3E6', backgroundColor: '#FAFCFE' },
  di: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E6F6FA' },
  dropB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, marginTop: 10, textAlign: 'center' },
  dropS: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 3, textAlign: 'center' },
  thumbs: { flexDirection: 'row', gap: 10, alignSelf: 'stretch', paddingVertical: 4, paddingHorizontal: 2 },
  th: { width: 84 },
  thPage: { width: 84, height: 112, borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  thShadow: { width: 84, height: 112, borderRadius: 8, boxShadow: '0px 0px 0px 1px #E1E8F0, 0px 6px 12px -8px rgba(0, 0, 0, 0.3)', backgroundColor: '#FFFFFF' },
  thT: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 5, textAlign: 'center' },
  thX: { position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#14161C' },
  src: { flexDirection: 'row', gap: 8, alignSelf: 'stretch', marginTop: 14 },
  srcB: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 10, paddingHorizontal: 4, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E1E8F0' },
  srcT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B', textAlign: 'center' },
  wc: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  wcTr: { flex: 1, height: 5, borderRadius: 5, backgroundColor: '#EEF2F7', overflow: 'hidden' },
  wcI: { height: '100%', backgroundColor: TEAL, borderRadius: 5 },
  wcT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#5B6472' },
  run: { marginTop: 18 },
  note: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10 },
  noteT: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
});

function Lab({ children, req }: { children: string; req?: boolean }): React.JSX.Element {
  return (
    <View style={s.lab}>
      <Txt style={s.labT}>{children}</Txt>
      {req ? <Txt style={s.labEm}>required</Txt> : null}
    </View>
  );
}

function Area({ value, onChange, rows, placeholder, testID }: { value: string; onChange: (v: string) => void; rows: number; placeholder: string; testID: string }): React.JSX.Element {
  const [f, setF] = useState(false);
  return (
    <TextInput
      style={[s.area, { height: rows * 21.75 + 24 + 2 }, f && s.focus]}
      multiline
      allowFontScaling={false}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#757575"
      // unfocused, a textarea shows its text from the top (Android scrolls a multiline input to the caret)
      selection={f ? undefined : { start: 0, end: 0 }}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      testID={testID}
    />
  );
}

function WordMeter({ wc, limit }: { wc: number; limit: number }): React.JSX.Element {
  const w = useTransition(wcPct(wc, limit), 200, easeCss);
  const a = useAnimatedStyle(() => ({ width: `${w.value}%` as DimensionValue }));
  return (
    <View style={s.wc}>
      <View style={s.wcTr}>
        <Animated.View style={[s.wcI, a]} />
      </View>
      <Txt style={[s.wcT, wc > limit && { color: '#C0392B' }]}>
        {wc} / {limit} words
      </Txt>
    </View>
  );
}

function Panel(): React.JSX.Element {
  const V = useStore(st => st.mv);
  const credits = useStore(st => st.me.credits);
  const rows = useStore(st => st.mvProcRows);
  const steps = useStore(st => st.mvProcSteps);
  useEffect(() => mainsRender(), []);
  const q = V.q || ANSWERBANK[0].t;
  const wc = wordCount(V.typed);
  return (
    <View style={s.page}>
      <TlHero
        id="mains"
        title={['Write it. ', 'We’ll grade it.']}
        sub="Examiner-style scoring on structure, content, relevance and presentation — with your own notes as context."
        stats={[
          ['~2 min', 'per answer'],
          ['20', 'credits'],
          [String(credits), 'you have'],
        ]}
      />
      <View style={s.panel}>
        <Seg
          kind="sg2"
          items={[
            { label: 'Handwritten', act: 'mvMode:hand', on: V.mode === 'hand', icon: 'image' },
            { label: 'Typed', act: 'mvMode:type', on: V.mode === 'type', icon: 'type2' },
          ]}
        />
        <Lab req>Question</Lab>
        <Area value={q} onChange={mvSetQ} rows={4} placeholder="Paste or type the question you answered…" testID="mains.q" />
        <Pressable style={s.pick} onPress={() => act('push:answerbank')}>
          <Icon name="bank" size={15} color={TEAL} />
          <Txt style={s.pickT}>Pick from the Answer Bank</Txt>
        </Pressable>
        <Lab>Word limit</Lab>
        <Seg kind="cx" items={[150, 250, 300, 1000].map(n => ({ label: String(n), act: `mvLim:${n}`, on: V.limit === n }))} />
        <Lab>Evaluation context</Lab>
        <View style={s.ctx}>
          {(
            [
              ['notes', 'Use my notes on this topic', 'Fundamental Rights notebook · 2 files'],
              ['ca', 'Add current-affairs context', 'Relevant stories from the last 12 months'],
            ] as const
          ).map(([k, b, sm]) => (
            <Pressable key={k} style={[s.ctxB, V[k] && s.ctxOn]} onPress={() => act(`mvCtx:${k}`)} testID={`mains.ctx.${k}`}>
              <View style={[s.ctxI, V[k] && s.ctxIOn]}>{V[k] ? <Icon name="check" size={14} strokeWidth={2.6} color="#FFFFFF" /> : null}</View>
              <View style={{ flexShrink: 1 }}>
                <Txt style={s.ctxBt}>{b}</Txt>
                <Txt style={s.ctxSm}>{sm}</Txt>
              </View>
            </Pressable>
          ))}
        </View>
        {V.mode === 'hand' ? (
          <>
            <Lab>Your answer sheet</Lab>
            <View style={s.drop}>
              {V.pages ? (
                <View style={s.thumbs}>
                  {Array.from({ length: V.pages }, (_, k) => (
                    <View key={k} style={s.th}>
                      <View style={s.thShadow}>
                        <View style={s.thPage}>
                          <HandPage seed={k + 1} width={84} height={112} />
                        </View>
                      </View>
                      <Txt style={s.thT}>Page {k + 1}</Txt>
                      <Pressable style={s.thX} onPress={() => act('mvDel')} accessibilityLabel="Remove page">
                        <Icon name="close" size={12} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : (
                <>
                  <View style={s.di}>
                    <Icon name="file" color={TEAL} />
                  </View>
                  <Txt style={s.dropB}>Upload your handwritten answer</Txt>
                  <Txt style={s.dropS}>A photo or scanned PDF of each page</Txt>
                </>
              )}
              <View style={s.src}>
                {(
                  [
                    ['camera', 'Camera'],
                    ['image', 'Gallery'],
                    ['file', 'PDF'],
                  ] as const
                ).map(([ic, l]) => (
                  <Pressable key={l} style={s.srcB} onPress={() => act('mvAdd')} testID={`mains.add.${l}`}>
                    <Icon name={ic} size={19} color={TEAL} />
                    <Txt style={s.srcT}>{l}</Txt>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : (
          <>
            <Lab>Your answer</Lab>
            <Area value={V.typed} onChange={mvCount} rows={9} placeholder="Start typing your answer…" testID="mains.typed" />
            <WordMeter wc={wc} limit={V.limit} />
          </>
        )}
      </View>
      <View style={s.run}>
        {rows >= 0 ? (
          <ProcBox title="Evaluating your answer…" steps={steps} done={rows} />
        ) : (
          <PenCTA label="Run UPSC evaluation" onPress={() => act('mvRun')} accessibilityLabel="Run UPSC evaluation" />
        )}
      </View>
      <View style={s.note}>
        <Icon name="spark" size={14} color="#6C5DD3" />
        <Txt style={s.noteT}>Uses 20 AI credits · you have {credits}</Txt>
      </View>
    </View>
  );
}

function MainsScreen({ entryKey }: ViewProps): React.JSX.Element {
  const done = useStore(st => st.mvDone === entryKey);
  return done ? <MainsReport animate entryKey={entryKey} /> : <Panel />;
}

/** v.title: the page becomes the report in place after mvProcess(). */
function useMainsTitle(): string {
  const swapped = useStore(st => st.mvDone !== 0 && st.stack.some(e => e.key === st.mvDone && e.id === 'mains'));
  return swapped ? 'Evaluation report' : 'AI Mains Evaluation';
}

function MainsAction({ entryKey }: ViewProps): React.JSX.Element {
  const done = useStore(st => st.mvDone === entryKey);
  return done ? <ReportAction /> : <View style={pageHeaderActStyle} />;
}

const view: ViewDef = {
  useTitle: useMainsTitle,
  Action: MainsAction,
  Screen: MainsScreen,
};

export default view;
