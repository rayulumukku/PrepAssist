// Source: PrepAssist.html L7831-L7846 (VIEWS.testquiz)
// Source: PrepAssist.html L7322 (ring), L8143-L8151 (A.tq*)
// Source: PrepAssist.html L4052-L4102 (.tl-k, .tl-drop, .tl-cta, .tl-ghost, .tq-*), L9312-L9394 (ds overrides)
// Computed (reference/android view-testquiz, -file-picked, -building, -library, -library-new):
//   h6.tl-k     Inter 800 10.5px / 15.225px, letter-spacing 1.47px, uppercase, #8A93A0, margin 22 0 10
//   .tl-drop    column centred, padding 26 18, radius 18, 1px dashed #BFD3E6, #fff; icon tile 48 radius 15
//               #EAF4FC (upload 24 --brand); b Inter 700 15.5px / 22.475px #14161C mt 12; small 12.5 #7A8494 mt 4
//   .tq-file    row gap 12, padding 12, radius 18, #fff, 0 0 0 1.5px #BFD3E6; .tq-pdf 42 x 48 radius 8 14 8 8
//               #E5484D, Inter 800 10.5px .63px #fff; b Inter 700 13.5px one line with ellipsis; small inline
//               12.5px #7A8494; .tq-x 38 round #F1F4F8 (close 20 #5B6472)
//   .tq-tips    margin-top 18, padding 14 16, radius 18, #FFF8EC, 0 0 0 1px #F7E3BE; h6 #B86E00;
//               ol margin-top 8, padding-left 18, Inter 400 12.5px / 18.75px #5B4A2A, li + li margin-top 4
//   .tl-cta     height 52, margin-top 20, radius 16, row centred gap 8, Inter 700 15.5px #fff,
//               linear-gradient(90deg, #1B8AD3, mix(#1B8AD3 70%, #3B5BCC)), 0 14px 24px -14px rgba(27,138,211,.9);
//               .off #E3E8EE / #98A1AD, no shadow
//   .tq-card    margin-top 12, padding 16, radius 18, #fff, 0 0 0 1px #E6EBF1; ring 50 (svg rotated -90deg,
//               its circle rotated -90 again); % Inter Tight 700 12.5px; b Inter 700 14.5px / 21.025px;
//               small 12.5px / 18.125px #7A8494 mt 2; .tq-cf row space-between, margin-top 12, padding-top 12,
//               1px dashed #E6EBF1 top; span 12.5 #5B6472 (history 15); button height 36 padding 0 13 radius 12
//               #14161C, Inter 700 13px / 18.85px #fff, icon 15
//   .tl-ghost   height 46, margin-top 14, radius 14, 1px #DCE4ED, #fff, Inter 600 14.5px / 21.025px #3A404B
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { ViewDef } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { ProcBox } from './parts/Proc';
import { Seg } from './parts/Seg';
import { mix, TlHero } from './parts/TlHero';

const s = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  k: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase', color: '#8A93A0', marginTop: 22, marginBottom: 10 },
  drop: { alignItems: 'center', paddingVertical: 26, paddingHorizontal: 18, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: '#BFD3E6', backgroundColor: '#FFFFFF' },
  dropI: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAF4FC' },
  dropB: { ...font('sans', 700), marginTop: 12, fontSize: 15.5, lineHeight: 22.475, color: '#14161C', textAlign: 'center' },
  dropS: { marginTop: 4, fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', textAlign: 'center' },
  file: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1.5px #BFD3E6' },
  pdf: { width: 42, height: 48, borderTopLeftRadius: 8, borderTopRightRadius: 14, borderBottomRightRadius: 8, borderBottomLeftRadius: 8, backgroundColor: '#E5484D', alignItems: 'center', justifyContent: 'center' },
  pdfT: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 0.63, color: '#FFFFFF' },
  fileB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575 },
  fileS: { fontSize: 12.5, lineHeight: 22.475, color: '#7A8494' },
  x: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F4F8' },
  tips: { marginTop: 18, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 18, backgroundColor: '#FFF8EC', boxShadow: '0px 0px 0px 1px #F7E3BE' },
  tipsH: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase', color: '#B86E00' },
  ol: { marginTop: 8, paddingLeft: 18 },
  li: { flexDirection: 'row' },
  liN: { position: 'absolute', left: -18, width: 18, fontSize: 12.5, lineHeight: 18.75, color: '#5B4A2A' },
  liT: { fontSize: 12.5, lineHeight: 18.75, color: '#5B4A2A' },
  cta: { height: 52, marginTop: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  ctaOn: {
    backgroundImage: `linear-gradient(90deg, #1B8AD3, ${mix('#1B8AD3', 0.7, '#3B5BCC')})`,
    boxShadow: '0px 14px 24px -14px rgba(27, 138, 211, 0.9)',
  },
  ctaOff: { backgroundColor: '#E3E8EE' },
  ctaT: { ...font('sans', 700), fontSize: 15.5, lineHeight: 22.475 },
  card: { marginTop: 12, padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1' },
  ct: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sc: { width: 50, height: 50 },
  scB: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  scT: { ...font('serif', 700), fontSize: 12.5, lineHeight: 18.125 },
  ctB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025 },
  ctS: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
  cf: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: '#E6EBF1' },
  cfS: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cfSt: { fontSize: 12.5, lineHeight: 18.125, color: '#5B6472' },
  cfB: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 13, borderRadius: 12, backgroundColor: '#14161C' },
  cfBt: { ...font('sans', 700), fontSize: 13, lineHeight: 18.85, color: '#FFFFFF' },
  ghost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 46, marginTop: 14, borderRadius: 14, borderWidth: 1, borderColor: '#DCE4ED', backgroundColor: '#FFFFFF' },
  ghostT: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: '#3A404B' },
});

const TIPS = [
  'Use text-based PDFs — scanned images or camera photos won’t work.',
  'Digital question banks and printed booklets are both supported.',
  'Bilingual papers are split automatically using the language you pick.',
  'Finished conversions are saved to your library for free re-attempts.',
];

/** ring(19, frac, 5, '#1B8AD3', '#EEF2F7') (L7322) inside `.tq-sc svg{transform:rotate(-90deg)}` */
function Ring({ frac }: { frac: number }): React.JSX.Element {
  const C = 2 * Math.PI * 19;
  return (
    <Svg width={50} height={50} viewBox="0 0 48 48" style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={24} cy={24} r={19} fill="none" stroke="#EEF2F7" strokeWidth={5} />
      <Circle
        cx={24}
        cy={24}
        r={19}
        fill="none"
        stroke="#1B8AD3"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${(C * Math.max(0.02, Math.min(1, frac))).toFixed(1)} ${C.toFixed(1)}`}
        transform="rotate(-90 24 24)"
      />
    </Svg>
  );
}

function TestquizScreen(): React.JSX.Element {
  const T = useStore(st => st.tq);
  const busyRows = useStore(st => st.tqBusyRows);
  const steps = ['Reading 48 pages', 'Detecting questions & options', 'Matching the answer key', T.lang === 'hi' ? 'Isolating the Hindi version' : 'Isolating the English version'];
  return (
    <View style={s.page}>
      <TlHero
        id="testquiz"
        title={['Any test PDF, ', 'a live mock']}
        sub="100-question UPSC mocks with instant, free re-attempts."
        stats={[
          [String(T.lib.length), 'in library'],
          [String(T.lib.reduce((a, b) => a + b.att, 0)), 'attempts'],
          ['Free', 're-attempts'],
        ]}
      />
      <Seg
        kind="sg2"
        items={[
          { label: 'Upload new', act: 'tqTab:new', on: T.tab === 'new', icon: 'upload' },
          { label: 'My test series', act: 'tqTab:lib', on: T.tab === 'lib', icon: 'learn' },
        ]}
      />
      {T.tab === 'new' ? (
        <>
          <Txt style={s.k}>PDF document</Txt>
          {T.file ? (
            <View style={s.file}>
              <View style={s.pdf}>
                <Txt style={s.pdfT}>PDF</Txt>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt style={s.fileB} numberOfLines={1} ellipsizeMode="tail">
                  {T.file.n}
                </Txt>
                <Txt style={s.fileS}>
                  {T.file.pg} pages · {T.file.sz}
                </Txt>
              </View>
              <Pressable style={s.x} onPress={() => act('tqClear')} accessibilityLabel="Remove">
                <Icon name="close" color="#5B6472" />
              </Pressable>
            </View>
          ) : (
            <Pressable style={s.drop} onPress={() => act('tqPick')} testID="testquiz.pick">
              <View style={s.dropI}>
                <Icon name="upload" size={24} color="#1B8AD3" />
              </View>
              <Txt style={s.dropB}>Tap to upload a PDF</Txt>
              <Txt style={s.dropS}>Test series papers · question banks · mock booklets</Txt>
            </Pressable>
          )}
          <Txt style={s.k}>Language version</Txt>
          <Seg
            kind="sg2"
            items={[
              { label: 'English', act: 'tqLang:en', on: T.lang === 'en', icon: 'globe' },
              { label: 'हिन्दी', act: 'tqLang:hi', on: T.lang === 'hi', icon: 'language' },
            ]}
          />
          <View style={s.tips}>
            <Txt style={s.tipsH}>Tips for best results</Txt>
            <View style={s.ol}>
              {TIPS.map((x, k) => (
                <View key={k} style={[s.li, k > 0 && { marginTop: 4 }]}>
                  <Txt style={s.liN}>{k + 1}.</Txt>
                  <Txt style={s.liT}>{x}</Txt>
                </View>
              ))}
            </View>
          </View>
          {busyRows >= 0 ? <ProcBox title="Building your mock…" steps={steps} done={busyRows} style={{ marginTop: 16 }} /> : null}
          <Pressable style={[s.cta, T.file ? s.ctaOn : s.ctaOff]} onPress={() => act('tqGo')} disabled={!T.file} testID="testquiz.go">
            <Icon name="bolt" color={T.file ? '#FFFFFF' : '#98A1AD'} />
            <Txt style={[s.ctaT, { color: T.file ? '#FFFFFF' : '#98A1AD' }]}>{T.file ? 'Convert to quiz' : 'Select a PDF first'}</Txt>
          </Pressable>
        </>
      ) : (
        <>
          {T.lib.map((x, i) => (
            <View key={i} style={s.card}>
              <View style={s.ct}>
                <View style={s.sc}>
                  <Ring frac={x.best / x.q} />
                  <View style={s.scB}>
                    <Txt style={s.scT}>{Math.round((x.best / x.q) * 100)}%</Txt>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Txt style={s.ctB}>{x.t}</Txt>
                  <Txt style={s.ctS}>
                    {x.q} questions · {x.lang} · added {x.d}
                  </Txt>
                </View>
              </View>
              <View style={s.cf}>
                <View style={s.cfS}>
                  <Icon name="history" size={15} color="#5B6472" />
                  <Txt style={s.cfSt}>{x.att ? `${x.att} attempt${x.att > 1 ? 's' : ''} · best ${x.best}/${x.q}` : 'New · not attempted yet'}</Txt>
                </View>
                <Pressable style={s.cfB} onPress={() => act(`tqStart:${i}`)} testID={`testquiz.start.${i}`}>
                  <Icon name={x.att ? 'refresh' : 'play'} size={15} color="#FFFFFF" />
                  <Txt style={s.cfBt}>{x.att ? 'Re-attempt' : 'Start mock'}</Txt>
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable style={s.ghost} onPress={() => act('tqTab:new')}>
            <Icon name="plus" color="#3A404B" />
            <Txt style={s.ghostT}>Convert another PDF</Txt>
          </Pressable>
        </>
      )}
    </View>
  );
}

const view: ViewDef = {
  useTitle: () => 'Test Series to Quiz',
  Screen: TestquizScreen,
};

export default view;
