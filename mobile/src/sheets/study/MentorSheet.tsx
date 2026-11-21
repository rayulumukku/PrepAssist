// Source: PrepAssist.html L6846-L6861 (openMentor markup), L6862-L6866 (mentorIntro), L6871-L6880 (mentorAsk body updates)
// Source: PrepAssist.html L2834-L2875 (.mentor, .mn-head, .mn-ctx, .mn-body, .mn-intro, .mn-sugg, .msg-u, .typing, .mn-in, .mn-chips), L2979-L2999 (later weight/family overrides), L3013-L3017 (brand overrides)
// Computed (reference/android/sheet-mentor-intro, -typing, -answer, -reopened):
//   .mentor    column filling the tall sheet
//   .mn-head   row, flex-start, space-between; padding 6 20 12; border-bottom 1 --rule
//     h3       row, centre, gap 8; Inter Tight 700 22/31.9, -0.55; star svg 20 filled --brand
//     .mn-ctx  inline row, gap 6, margin-top 6, padding 4 10 4 8, radius 999, --brand-tint, 12.5/18.125 --ink-2;
//              i 6x6 --brand. .off: --paper-2, --muted, line-through; i --faint
//   .mn-body   flex 1, scrolls, padding 18 20
//   .mn-intro  h4 Inter(read) 600 20/24 -0.5 (em --brand, upright); p 13.5/19.575 --muted mt 6;
//              ul margin-top 18, border-top 1 --rule; button row gap 12 padding 13 0 border-bottom, Inter(read) 500 15.5/22.475;
//              span Inter 600 11.5/16.675 --muted width 20; arrow 16 --faint pushed right
//   .msg-u     row, end; margin 6 0 14; bubble max 82%, --brand, padding 10 14, radius 14 14 4 14, 14.5/21.025 #fff
//   .typing    row gap 4, padding 6 0 18 14; dots 6x6 --brand, @keyframes ty 1s ease infinite, delays 0/.15/.3s
//   .mn-chips  horizontal scroller, padding 10 14 0, gap 6; button 12.5/18.125 --ink-2, padding 7 11, radius 999, 1 --rule-2
//   .mn-in     row, flex-end, gap 8, padding 10 14 max(14, --sab), border-top 1 --rule, --paper;
//              .mic 40x46 --muted · textarea flex 1, height 46, padding 12 14, radius 14, 1 --rule-2 (focus --brand), 15.5/20.925
//              · .snd 46 circle --brand, send icon #fff
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import type { LayoutChangeEvent, ScrollViewInstance } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { act } from '../../actions';
import { Circ, Icon, SheetGrab } from '../../components';
import { easeCss } from '../../shell/anim';
import { useStore, setS } from '../../store';
import { font, fontPx, palettes, Txt, useInsets, useTheme } from '../../theme';
import { MentorAnswer } from './mentor/MentorAnswer';
import type { MentorCtx } from './mentor/mentorLogic';
import type { MnView } from './mentor/mentorFlow';

const C = palettes.free;

const s = StyleSheet.create({
  mentor: { flex: 1, flexDirection: 'column' },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.rule,
    flexShrink: 0,
  },
  h3: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 31.9 },
  h3t: { ...font('serif', 700), fontSize: 22, lineHeight: 31.9, letterSpacing: -0.55, color: C.ink },
  ctx: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 6,
    paddingTop: 4,
    paddingRight: 10,
    paddingBottom: 4,
    paddingLeft: 8,
    borderRadius: 999,
  },
  ctxT: { fontSize: 12.5, lineHeight: 18.125 },
  ctxOff: { color: C.muted, textDecorationLine: 'line-through' },
  arrow: { marginLeft: 'auto' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  body: { flex: 1 },
  bodyC: { paddingVertical: 18, paddingHorizontal: 20 },
  h4: { ...font('read', 600), fontSize: 20, lineHeight: 24, letterSpacing: -0.5, color: C.ink },
  introP: { fontSize: 13.5, lineHeight: 19.575, color: C.muted, marginTop: 6 },
  sugg: { marginTop: 18, borderTopWidth: 1, borderTopColor: C.rule },
  suggB: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.rule },
  suggT: { ...font('read', 500), fontSize: 15.5, lineHeight: 22.475, color: C.ink, flexShrink: 1 },
  suggN: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: C.muted, width: 20 },
  msgU: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 6, marginBottom: 14 },
  bubble: { maxWidth: '82%', paddingVertical: 10, paddingHorizontal: 14, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomRightRadius: 4, borderBottomLeftRadius: 14 },
  bubbleT: { fontSize: 14.5, lineHeight: 21.025, color: '#FFFFFF' },
  typing: { flexDirection: 'row', gap: 4, paddingTop: 6, paddingBottom: 18, paddingLeft: 14 },
  chips: { flexGrow: 0, flexShrink: 0 },
  chipsC: { flexDirection: 'row', gap: 6, paddingTop: 10, paddingHorizontal: 14 },
  chip: { paddingVertical: 7, paddingHorizontal: 11, borderRadius: 999, borderWidth: 1, borderColor: C.rule2, backgroundColor: C.sheet },
  chipT: { fontSize: 12.5, lineHeight: 18.125, color: C.ink2 },
  inRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: C.rule,
    backgroundColor: C.paper,
    flexShrink: 0,
  },
  mic: { width: 40, height: 46, alignItems: 'center', justifyContent: 'center' },
  ta: {
    flex: 1,
    height: 46,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.rule2,
    backgroundColor: C.sheet,
    ...font('sans', 400),
    fontSize: fontPx(15.5),
    lineHeight: 20.925,
    color: C.ink,
    textAlignVertical: 'top',
  },
  snd: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});

/** One `.typing i` dot: @keyframes ty{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}} 1s ease infinite. */
function Dot({ delay, color }: { delay: number; color: string }): React.JSX.Element {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 500, easing: easeCss }), withTiming(0, { duration: 500, easing: easeCss })), -1),
    );
  }, [v, delay]);
  const st = useAnimatedStyle(() => ({ opacity: 0.25 + 0.75 * v.value, transform: [{ translateY: -3 * v.value }] }));
  return <Animated.View style={[s.dot, { backgroundColor: color }, st]} />;
}

function Intro({ c, first, brand }: { c: MentorCtx; first: string; brand: string }): React.JSX.Element {
  return (
    <View>
      <Txt style={s.h4}>
        {`Hi ${first}. I can see you’re on `}
        <Txt style={{ color: brand }}>{c.label.split(' · ')[0].toLowerCase()}</Txt>
        {' — what would help right now?'}
      </Txt>
      <Txt style={s.introP}>Answers are grounded in the UPSC syllabus, your notes and your performance.</Txt>
      <View style={s.sugg}>
        {c.p.map((p, i) => (
          <Pressable key={p} style={s.suggB} onPress={() => act('mentorAsk', p)} testID={`sheet.mentor.sugg${i}`}>
            <Txt style={s.suggN}>{`0${i + 1}`}</Txt>
            <Txt style={s.suggT}>{p}</Txt>
            <Icon name="arrow" size={16} color={C.faint} style={s.arrow} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MentorSheet(): React.JSX.Element | null {
  const t = useTheme();
  const { sab } = useInsets();
  const view = useStore(st => st.mnView) as MnView | null;
  const c = useStore(st => st.mctx) as MentorCtx | undefined;
  const ctxOn = useStore(st => st.ctxOn);
  const first = useStore(st => st.user.first);
  const mnIn = useStore(st => st.mnIn);
  const [focus, setFocus] = React.useState(false);
  const scroller = useRef<ScrollViewInstance>(null);
  const bodyY = useRef(0);
  const uY = useRef<Record<number, number>>({});
  const pending = useRef<MnView['scroll'] | null>(null);
  const seq = view?.scroll.seq ?? 0;

  const doScroll = (): void => {
    const r = pending.current;
    if (!r || !scroller.current || !view) return;
    if (r.kind === 'end') {
      scroller.current.scrollToEnd({ animated: false });
      pending.current = null;
    } else {
      // body.scrollTo({ top: last.offsetTop - 12, behavior: 'smooth' }); offsetTop is measured from the sheet
      const lastU = view.items.reduce((a, it, k) => (it.k === 'u' ? k : a), -1);
      const y = uY.current[lastU];
      if (y === undefined) return;
      scroller.current.scrollTo({ y: Math.max(0, y + bodyY.current - 12), animated: true });
      pending.current = null;
    }
  };
  useEffect(() => {
    if (view) pending.current = view.scroll;
    doScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq]);

  if (!view || !c) return null;
  return (
    <View style={s.mentor}>
      <SheetGrab />
      <View style={s.head}>
        <View>
          <View style={s.h3}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z" fill={t.brand} />
            </Svg>
            <Txt style={s.h3t}>Ask PrepAssist</Txt>
          </View>
          <Pressable
            style={[s.ctx, { backgroundColor: ctxOn ? t.brandTint : C.paper2 }]}
            onPress={() => act('ctxToggle')}
            accessibilityLabel="Mentor uses what you’re looking at"
            testID="sheet.mentor.ctx">
            <View style={[s.dot, { backgroundColor: ctxOn ? t.brand : C.faint }]} />
            <Txt style={[s.ctxT, ctxOn ? { color: C.ink2 } : s.ctxOff]}>{c.label}</Txt>
          </Pressable>
        </View>
        <Circ icon="close" label="Close" onPress={() => act('closeSheet')} testID="sheet.mentor.close" />
      </View>
      <ScrollView
        ref={scroller}
        style={s.body}
        contentContainerStyle={s.bodyC}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onLayout={(e: LayoutChangeEvent) => {
          bodyY.current = e.nativeEvent.layout.y;
        }}
        onContentSizeChange={doScroll}
        testID="sheet.mentor.body">
        {view.intro ? <Intro c={c} first={first} brand={t.brand} /> : null}
        {view.items.map((it, k) =>
          it.k === 'u' ? (
            <View
              key={k}
              style={s.msgU}
              onLayout={(e: LayoutChangeEvent) => {
                // offsetTop of .msg-u = top of its border box (the layout frame; the margin is outside it)
                uY.current[k] = e.nativeEvent.layout.y;
                doScroll();
              }}>
              <View style={[s.bubble, { backgroundColor: t.brand }]}>
                <Txt style={s.bubbleT}>{it.q}</Txt>
              </View>
            </View>
          ) : it.k === 'typing' ? (
            <View key={`t${it.id}`} style={s.typing}>
              <Dot delay={0} color={t.brand} />
              <Dot delay={150} color={t.brand} />
              <Dot delay={300} color={t.brand} />
            </View>
          ) : (
            <MentorAnswer key={k} using={it.using} html={it.html} />
          ),
        )}
      </ScrollView>
      {view.chips ? (
        <ScrollView horizontal style={s.chips} contentContainerStyle={s.chipsC} showsHorizontalScrollIndicator={false}>
          {c.p.map(p => (
            <Pressable key={p} style={s.chip} onPress={() => act('mentorAsk', p)}>
              <Txt style={s.chipT}>{p}</Txt>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      <View style={[s.inRow, { paddingBottom: Math.max(14, sab) }]}>
        <Pressable style={s.mic} onPress={() => act('toast:Listening… (voice input demo)')} accessibilityLabel="Voice" testID="sheet.mentor.mic">
          <Icon name="mic" color={C.muted} />
        </Pressable>
        <TextInput
          style={[s.ta, focus ? { borderColor: t.brand } : null]}
          allowFontScaling={false}
          multiline
          submitBehavior="submit"
          onSubmitEditing={() => act('mentorSend')}
          value={mnIn}
          onChangeText={v => setS({ mnIn: v })}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="Ask anything about UPSC…"
          placeholderTextColor="#757575"
          testID="sheet.mentor.input"
        />
        <Pressable style={[s.snd, { backgroundColor: t.brand }]} onPress={() => act('mentorSend')} accessibilityLabel="Send" testID="sheet.mentor.send">
          <Icon name="send" color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

export default MentorSheet;
