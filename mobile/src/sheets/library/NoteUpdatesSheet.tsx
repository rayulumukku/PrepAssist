// Source: PrepAssist.html L10529-L10534 (upsSheet)
// Source: PrepAssist.html L10522-L10528 (upCard), L10598-L10609 (A.ntMerge: #ntUpB proc / done, footer), L10145-L10187 (.n2-sh … .n2-done), L10324 (.n2-uf colour)
// Computed (reference/android/sheet-note-updates, -expanded, -merging, -merged):
//   .n2-shh   padding 4 16 12 20, border-bottom 1px #EEF1F5; h3 Inter 700 20 / 29 ls -.4 #14161C; small 12.5 #7A8494 margin-top 2
//   .n2-shb   scrolls, padding 14 20 20; .n2-shp 13 / 19.5 #6B7380, margin 2 0 12
//   .n2-u     margin-top 10, padding 14, radius 16, white, ring #E8ECF2
//   .n2-uh    gap 8: i 8 circle #1FA463 margin-top 5; b 13px 600 (inline in a 22.475 line); p 12 / 17.4 #7A8494 margin-top 1; small 11.5 #9AA3AF
//   .n2-ut    margin 8 0 0 16, padding 4 9, radius 8, 11.5px 600 uc on mix(uc 10%, #fff), icon 13
//   .n2-ub    margin-top 12, max-height 150, clipped, fade 46 high at the bottom; .open: no limit, no fade
//   .n2-uf    margin-top 8, padding-top 8, border-top #F0F2F6; buttons 30 high padding 0 4, 12.5px 700 #2F8A4A / #8A93A0
//   .n2-shf   padding 12 20 14 (+ --sab), border-top #EEF1F5, gap 10, --paper; .n2-b1 50 high radius 15 #1FA463 flex 1.6; .n2-b2 #EEF1F6 flex 1
//   .n2-proc  centred, padding 36 10; spark 34 #1FA463 spinning 1.6s; b 17 / 24.65; rows fade in (n2In .35s, delay i * .45s)
//   .n2-done  padding 10 0; 52 circle #DDF3E6 check 24; b 19 / 27.55; p 13.5 #6B7380; ul padding 12 14 12 30, radius 14, #F6F8FB
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { act } from '../../actions';
import { Circ, Icon, RichText, SheetGrab } from '../../components';
import type { NtValueItemUpsItem } from '../../data/tracker';
import type { IconName } from '../../icons/iconPaths.generated';
import type { SheetProps } from '../../navigation/routes';
import { mix } from '../../screens/library/mix';
import { bodyStyles } from '../../screens/library/NtNoteScreen';
import { foldKey, noteBy } from '../../screens/library/tracker/nt';
import type { NtEl } from '../../screens/library/tracker/ntActions';
import { useStore } from '../../store';
import { EASE, font, useInsets, Txt } from '../../theme';

const easeVar = Easing.bezier(EASE[0], EASE[1], EASE[2], EASE[3]);

function UpCard({ id, u, k }: { id: string; u: NtValueItemUpsItem; k: number }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const uc = u.src.c;
  const el: NtEl = { toggle: () => setOpen(o => !o) };
  return (
    <View style={s.u}>
      <View style={s.uh}>
        <View style={s.uhI} />
        <View style={s.uhD}>
          <Txt style={s.uhB}>{u.src.s}</Txt>
          <Txt style={s.uhP}>{u.src.f}</Txt>
        </View>
        <Txt style={s.uhSmall}>{u.d}</Txt>
      </View>
      <View style={s.utRow}>
        <View style={[s.ut, { backgroundColor: mix(uc, 10, '#FFFFFF') }]}>
          <Icon name={u.src.ic as IconName} size={13} color={uc} />
          <Txt style={[s.utTx, { color: uc }]}>{u.src.tag}</Txt>
        </View>
      </View>
      <View style={[s.ub, !open && s.ubClosed]}>
        <RichText html={u.h} styles={bodyStyles} />
        {!open ? <View style={s.ubFade} pointerEvents="none" /> : null}
      </View>
      <View style={s.uf}>
        <Pressable style={s.ufB} onPress={() => act('ntMore', undefined, el)} testID={`noteUpdates.more.${k}`}>
          <Txt style={[s.ufTx, s.ufMore]}>{open ? 'Show less' : 'Show more'}</Txt>
        </Pressable>
        <Pressable style={s.ufB} onPress={() => act('ntIgn', `${id}:${k}`)} testID={`noteUpdates.ignore.${k}`}>
          <Txt style={[s.ufTx, s.ufIgn]}>Ignore</Txt>
        </Pressable>
      </View>
    </View>
  );
}

function Spinner(): React.JSX.Element {
  const r = useSharedValue(0);
  useEffect(() => {
    r.value = withRepeat(withTiming(360, { duration: 1600, easing: Easing.linear }), -1);
  }, [r]);
  const anim = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.value}deg` }] }));
  return (
    <Animated.View style={anim}>
      <Icon name="spark" size={34} color="#1FA463" />
    </Animated.View>
  );
}

function ProcRow({ i, text }: { i: number; text: string }): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(i * 450, withTiming(1, { duration: 350, easing: easeVar }));
  }, [p, i]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: (1 - p.value) * 4 }] }));
  return (
    <Animated.View style={[s.procP, anim]}>
      <Icon name="check" size={15} color="#1FA463" />
      <Txt style={s.procTx}>{text}</Txt>
    </Animated.View>
  );
}

function NoteUpdatesSheet({ arg }: SheetProps): React.JSX.Element | null {
  const { sab } = useInsets();
  const NT = useStore(st => st.NT);
  const FOLDERS = useStore(st => st.FOLDERS);
  const merge = useStore(st => st.ntMerge);
  const gen = useStore(st => st.ntUpsGen);
  const id = arg ?? '';
  const n = noteBy(id, { NT });
  if (!n) return null;
  const F = foldKey(n.s, { FOLDERS });
  const u = n.ups.length;
  const m = merge && merge.id === id ? merge : null;
  return (
    <>
      <SheetGrab />
      <View style={s.sh}>
        <View style={s.shh}>
          <View style={s.shhD}>
            <Txt style={s.h3}>Note Updates</Txt>
            <Txt style={s.shhSmall}>{`${n.t} (${F[0]})`}</Txt>
          </View>
          <Circ icon="close" label="Close" onPress={() => act('closeSheet')} />
        </View>
        <ScrollView style={s.shb} contentContainerStyle={s.shbC} showsVerticalScrollIndicator={false} testID="noteUpdates.body">
          {m && m.phase === 'proc' ? (
            <View style={s.proc}>
              <Spinner />
              <Txt style={s.procB}>Merging updates…</Txt>
              <View style={s.procL}>
                {m.steps.map((st, i) => (
                  <ProcRow key={i} i={i} text={st} />
                ))}
              </View>
            </View>
          ) : m && m.phase === 'done' ? (
            <View style={s.done}>
              <View style={s.doneI}>
                <Icon name="check" size={24} color="#1FA463" />
              </View>
              <Txt style={s.doneB}>Merged into your note</Txt>
              <Txt style={s.doneP}>{`${m.c} update${m.c === 1 ? '' : 's'} summarised into ${m.pts.length} new point${m.pts.length === 1 ? '' : 's'}. Duplicates were skipped.`}</Txt>
              <RichText
                html={`<ul>${m.pts.map(p => `<li>${p}</li>`).join('')}</ul>`}
                styles={{ ...bodyStyles, ul: { marginTop: 14, paddingTop: 12, paddingRight: 14, paddingBottom: 12, paddingLeft: 30, borderRadius: 14, backgroundColor: '#F6F8FB' } }}
              />
            </View>
          ) : (
            <View key={gen}>
              <Txt style={s.shp}>{`${u} update${u === 1 ? '' : 's'} matched to this note. Ignore what you don’t need — the rest can be summarised and merged in one tap.`}</Txt>
              {n.ups.map((x, k) => (
                <UpCard key={k} id={n.id} u={x} k={k} />
              ))}
            </View>
          )}
        </ScrollView>
        {m && m.phase === 'proc' ? null : (
          <View style={[s.shf, { paddingBottom: sab + 14 }]}>
            {m && m.phase === 'done' ? (
              <>
                <Pressable style={s.b2} onPress={() => act('closeSheet')} testID="noteUpdates.done">
                  <Txt style={s.b2Tx}>Done</Txt>
                </Pressable>
                <Pressable style={s.b1} onPress={() => act('ntView', id)} testID="noteUpdates.view">
                  <Txt style={s.b1Tx}>View note</Txt>
                  <Icon name="arrow" size={16} color="#FFFFFF" />
                </Pressable>
              </>
            ) : (
              <>
                <Pressable style={s.b2} onPress={() => act('ntIgnAll', id)} testID="noteUpdates.ignoreAll">
                  <Txt style={s.b2Tx}>Ignore All</Txt>
                </Pressable>
                <Pressable style={s.b1} onPress={() => act('ntMerge', id)} testID="noteUpdates.merge">
                  <Icon name="bolt" size={16} color="#FFFFFF" />
                  <Txt style={s.b1Tx}>AI Summarise & Merge</Txt>
                </Pressable>
              </>
            )}
          </View>
        )}
      </View>
    </>
  );
}

export const s = StyleSheet.create({
  sh: { flex: 1, minHeight: 0 },
  shh: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, paddingTop: 4, paddingRight: 16, paddingBottom: 12, paddingLeft: 20, borderBottomWidth: 1, borderBottomColor: '#EEF1F5', flexShrink: 0 },
  shhD: { flexShrink: 1 },
  h3: { ...font('sans', 700), fontSize: 20, lineHeight: 29, letterSpacing: -0.4, color: '#14161C' },
  shhSmall: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
  shb: { flex: 1 },
  shbC: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 20 },
  shp: { fontSize: 13, lineHeight: 19.5, color: '#6B7380', marginTop: 2, marginBottom: 12 },
  u: { marginTop: 10, padding: 14, borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0px 0px 0px 1px #E8ECF2' },
  uh: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  uhI: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1FA463', marginTop: 5, flexShrink: 0 },
  uhD: { flex: 1, minWidth: 0 },
  uhB: { ...font('sans', 600), fontSize: 13, lineHeight: 22.475 },
  uhP: { fontSize: 12, lineHeight: 17.4, color: '#7A8494', marginTop: 1 },
  uhSmall: { fontSize: 11.5, lineHeight: 16.675, color: '#9AA3AF' },
  utRow: { flexDirection: 'row' },
  ut: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, marginLeft: 16, paddingVertical: 4, paddingHorizontal: 9, borderRadius: 8 },
  utTx: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675 },
  ub: { marginTop: 12 },
  ubClosed: { maxHeight: 150, overflow: 'hidden' },
  ubFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 46, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0), #FFFFFF)' },
  uf: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F0F2F6' },
  ufB: { height: 30, paddingHorizontal: 4, justifyContent: 'center' },
  ufTx: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, textAlign: 'center' },
  ufMore: { color: '#2F8A4A' },
  ufIgn: { color: '#8A93A0' },
  shf: { flexDirection: 'row', gap: 10, paddingTop: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#EEF1F5', flexShrink: 0, backgroundColor: '#FFFFFF' },
  b1: { flex: 1.6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 50, borderRadius: 15, backgroundColor: '#1FA463', boxShadow: '0px 10px 18px -12px rgba(31, 164, 99, 0.9)' },
  b1Tx: { ...font('sans', 700), fontSize: 14, lineHeight: 20.3, color: '#FFFFFF', textAlign: 'center' },
  b2: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 50, borderRadius: 15, backgroundColor: '#EEF1F6' },
  b2Tx: { ...font('sans', 700), fontSize: 14, lineHeight: 20.3, textAlign: 'center' },
  proc: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 10 },
  procB: { ...font('sans', 700), fontSize: 17, lineHeight: 24.65, color: '#14161C', marginTop: 12, textAlign: 'center' },
  procL: { marginTop: 16, gap: 10 },
  procP: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  procTx: { fontSize: 13.5, lineHeight: 19.575, color: '#5B6472' },
  done: { paddingVertical: 10 },
  doneI: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#DDF3E6', alignItems: 'center', justifyContent: 'center' },
  doneB: { ...font('sans', 700), fontSize: 19, lineHeight: 27.55, color: '#14161C', marginTop: 12 },
  doneP: { fontSize: 13.5, lineHeight: 19.575, color: '#6B7380', marginTop: 4 },
});

export default NoteUpdatesSheet;
