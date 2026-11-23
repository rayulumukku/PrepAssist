// Source: PrepAssist.html L10508-L10520 (VIEWS.ntNote)
// Source: PrepAssist.html L10504-L10507 (noteBody), L10126-L10143 + L10302-L10309 (.n2-doc, .n2-eb, .n2-tags, .n2-ubar, .n2-mg, .n2-body, .n2-ai), L10083 (.n2-k), L10081 (.n2-sa)
// Computed (reference/android/view-ntNote, -no-updates, -merged):
//   .n2-doc    padding 22 18 20, radius 22, white, ring 1px #E6EBF1; ::before 110 high linear(mix(fc 12%, #fff), #fff)
//   .n2-eb     row gap 6, 11.5px 700 fc, icon 14; em margin-left auto 500 #8A93A0
//   h1         EB Garamond 500 27 / 32.4 #14161C, margin-top 8
//   .n2-tags   margin-top 10, gap 6; span padding 3 8 radius 7 #F1F4F8 11.5px 600 #5B6472
//   .n2-ubar   margin-top 14, padding 10 12, radius 14, #F0F9F3 + inset ring #D4EEDD; 30 box radius 9 #1FA463; b 13.5 700; small 11.5 #4E7A62
//   .n2-mg     margin-top 14, padding 12 14, radius 14, #F3F1FD, inset 3px 0 #6C5DD3; h6 11px 800 ls .88 uppercase #5A4CC0
//   .n2-body   margin-top 14, padding-top 14, border-top 1px #F0F2F6; h5 14.5 700 #14161C (margin-top 14, first 0);
//              p 14.5 / 23.2 #2A2E36 margin-top 6; ul padding-left 18 margin-top 6; li 14 / 21.7 #2A2E36 margin-top 5
//   .n2-k      margin 20 2 10, 10.5px 800 ls 1.47 uppercase #8A93A0
//   .n2-ai     wrap, gap 8; buttons 38 high padding 0 14 radius 12 white ring #E8ECF2 13px 600; icons 15 #3E9A55
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, pageHeaderActStyle, RichText } from '../../components';
import type { RichTextStyles } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { mix } from './mix';
import { foldKey, noteBy } from './tracker/nt';
import type { NtNote } from './tracker/nt';

/** noteBody (L10504-L10507). `esc(n.p)` is text inside <p>: escaped here so the string stays literal. */
export function noteBody(n: NtNote): string {
  const esc = (v: string): string => v.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
  return n.t === 'Cooperatives'
    ? '<h5>Constitutional status</h5><ul><li><b>97th Amendment (2011):</b> right to form cooperatives under Art 19(1)(c); Art 43B (DPSP); Part IX-B.</li><li><b>Entry 32, List II</b> — cooperative societies are a State subject; multi-State societies under the Union.</li></ul><h5>Institutions</h5><ul><li>Ministry of Cooperation created in July 2021.</li><li>NCDC, NAFED, IFFCO, AMUL as leading examples.</li></ul><h5>Issues</h5><ul><li>Political interference, weak governance, poor audit and low professional management.</li></ul>'
    : `<p>${esc(n.p)}</p><h5>Key points</h5><ul><li>Definition, constitutional or statutory basis</li><li>Important committees, reports and judgments</li><li>Recent developments and PYQ angles</li></ul>`;
}

/** `.n2-body` / `.n2-ub` / `.n2-mg` content styles (L10135-L10141). */
export const bodyStyles: RichTextStyles = {
  base: { fontSize: 14.5, lineHeight: 23.2, color: '#2A2E36' },
  b: font('sans', 700),
  p: { marginTop: 6 },
  h5: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: '#14161C', marginTop: 14 },
  h4: { ...font('sans', 600), fontSize: 16, lineHeight: 23.2, letterSpacing: 0.32, textTransform: 'uppercase', color: '#14161C', marginBottom: 10 },
  ul: { paddingLeft: 18, marginTop: 6 },
  li: { fontSize: 14, lineHeight: 21.7, color: '#2A2E36', marginTop: 5 },
  first: { h5: { marginTop: 0 } },
};

function NtNoteAction({ arg }: ViewProps): React.JSX.Element {
  const NT = useStore(s => s.NT);
  const n = noteBy(arg ?? '', { NT });
  const on = !!n?.star;
  return (
    <Pressable style={[pageHeaderActStyle, nn.sa]} onPress={() => act('ntStar', arg)} accessibilityLabel="Star" testID="ntNote.star">
      <Icon name="star" color={on ? '#F5A01F' : '#8A93A0'} fill={on ? '#F5A01F' : 'none'} />
    </Pressable>
  );
}

function NtNoteScreen({ arg }: ViewProps): React.JSX.Element | null {
  const NT = useStore(s => s.NT);
  const FOLDERS = useStore(s => s.FOLDERS);
  const n = noteBy(arg ?? '', { NT });
  if (!n) return null;
  const F = foldKey(n.s, { FOLDERS });
  const fc = F[1];
  const u = n.ups.length;
  const ai: [string, IconName, string][] = [
    ['toast:Summary added at the top', 'spark', 'Summarise'],
    ['toast:6 flashcards created from this note', 'layers', 'Flashcards'],
    ['push:mindmap:' + n.t, 'mindmap', 'Mindmap'],
    ['quiz', 'test', 'Quiz me'],
  ];
  return (
    <View style={nn.page}>
      <View style={nn.doc}>
        <View style={[nn.docBg, { backgroundImage: `linear-gradient(180deg, ${mix(fc, 12, '#FFFFFF')}, #FFFFFF)` }]} pointerEvents="none" />
        <View style={nn.eb}>
          <Icon name="learn" size={14} color={fc} />
          <Txt style={[nn.ebTx, { color: fc }]}>{F[0]}</Txt>
          <Txt style={nn.ebEm}>{`Edited ${n.d}`}</Txt>
        </View>
        <Txt style={nn.h1}>{n.t}</Txt>
        {n.tags.length ? (
          <View style={nn.tags}>
            {n.tags.map(tg => (
              <View key={tg} style={nn.tag}>
                <Txt style={nn.tagTx}>{`#${tg}`}</Txt>
              </View>
            ))}
          </View>
        ) : null}
        {u ? (
          <Pressable style={nn.ubar} onPress={() => act('ntUps', n.id)} testID="ntNote.ups">
            <View style={nn.ubarI}>
              <Icon name="refresh" size={15} color="#FFFFFF" />
            </View>
            <View style={nn.ubarD}>
              <Txt style={nn.ubarB}>{`${u} new update${u === 1 ? '' : 's'} for this note`}</Txt>
              <Txt style={nn.ubarSmall}>Review, then ignore or merge with AI</Txt>
            </View>
            <Icon name="chev" size={15} color="#4E7A62" />
          </Pressable>
        ) : null}
        {n.merged ? (
          <View style={nn.mg}>
            <View style={nn.mgH}>
              <Icon name="spark" size={14} color="#5A4CC0" />
              <Txt style={nn.mgHTx}>{`Merged from ${n.merged.n} update${n.merged.n === 1 ? '' : 's'} · ${n.merged.at}`}</Txt>
            </View>
            <RichText html={`<ul>${n.merged.pts.map(p => `<li>${p}</li>`).join('')}</ul>`} styles={bodyStyles} />
          </View>
        ) : null}
        <View style={nn.body}>
          <RichText html={noteBody(n)} styles={bodyStyles} />
        </View>
      </View>
      <Txt style={nn.k}>With PrepAssist AI</Txt>
      <View style={nn.ai}>
        {ai.map(([a, ic, l]) => (
          <Pressable key={l} style={nn.aiB} onPress={() => act(a)} testID={`ntNote.ai.${l}`}>
            <Icon name={ic} size={15} color="#3E9A55" />
            <Txt style={nn.aiTx}>{l}</Txt>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const nn = StyleSheet.create({
  page: { paddingTop: 4, paddingHorizontal: 20, paddingBottom: 40 },
  sa: { alignItems: 'center', justifyContent: 'center' },
  doc: { paddingTop: 22, paddingHorizontal: 18, paddingBottom: 20, borderRadius: 22, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  docBg: { position: 'absolute', left: 0, right: 0, top: 0, height: 110 },
  eb: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ebTx: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675 },
  ebEm: { ...font('sans', 500), fontSize: 11.5, lineHeight: 16.675, color: '#8A93A0', marginLeft: 'auto' },
  h1: { ...font('book', 500), fontSize: 27, lineHeight: 32.4, color: '#14161C', marginTop: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 7, backgroundColor: '#F1F4F8' },
  tagTx: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#5B6472' },
  ubar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, marginTop: 14, borderRadius: 14, backgroundColor: '#F0F9F3', boxShadow: 'inset 0px 0px 0px 1px #D4EEDD' },
  ubarI: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#1FA463', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ubarD: { flex: 1 },
  ubarB: { ...font('sans', 700), fontSize: 13.5, lineHeight: 19.575, color: '#14161C' },
  ubarSmall: { fontSize: 11.5, lineHeight: 16.675, color: '#4E7A62' },
  mg: { marginTop: 14, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: '#F3F1FD', boxShadow: 'inset 3px 0px 0px 0px #6C5DD3' },
  mgH: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mgHTx: { ...font('sans', 800), fontSize: 11, lineHeight: 15.95, letterSpacing: 0.88, textTransform: 'uppercase', color: '#5A4CC0', flexShrink: 1 },
  body: { marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F0F2F6' },
  k: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase', color: '#8A93A0', marginTop: 20, marginBottom: 10, marginHorizontal: 2 },
  ai: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  aiB: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E8ECF2' },
  aiTx: { ...font('sans', 600), fontSize: 13, lineHeight: 18.85, textAlign: 'center' },
});

const view: ViewDef = {
  useTitle: arg => {
    const NT = useStore(s => s.NT);
    const FOLDERS = useStore(s => s.FOLDERS);
    const n = noteBy(arg ?? '', { NT });
    return n ? foldKey(n.s, { FOLDERS })[0] : '';
  },
  Action: NtNoteAction,
  Screen: NtNoteScreen,
};

export default view;
