// Source: PrepAssist.html L2852-L2863 (.msg-a, .who, h5, p, ul/ol, li, table, td/th, .acts, .src), L2979 (.msg-a h5 weight/tracking), L2255 (@keyframes tabIn), L6876 (the .msg-a markup)
// One answer of the mentor. Computed (reference/android/sheet-mentor-answer, sheet-mentor-answer-plan):
//   .msg-a   padding-left 14, border-left 2 --brand, margin-bottom 22, animation tabIn .4s var(--ease)
//   .who     row, gap 6, Inter 700 10.5/15.225, uppercase, letter-spacing 1.47 (.14em), --brand, mb 8; spark 20
//   h5       Inter Tight 700 20/25, letter-spacing -0.5, --ink, mb 8
//   p        Inter 14.5/23.2 (1.6), --ink-2, mb 10; b = Inter 700; i is upright (computed font-style normal)
//   ul/ol    padding-left 18, mb 10; li 14.5/22.475 (1.55) --ink-2, mb 5; browser outside markers
//   table    full width, margin 6 0 12, 13.5/19.575; th/td padding 7 6, border-bottom 1 --rule, top aligned;
//            th 10.5/15.225 700 uppercase, letter-spacing 1.05 (.1em), --muted; td:first-child 600, nowrap
//   .acts    row, wrap, gap 8, margin-top 6; .chip buttons
//   .src     11.5px --muted, margin-top 4
// Vertical margins collapse the CSS way between blocks (p mb 10 + table mt 6 = 10). The last block's
// bottom margin collapses into .msg-a's 22 (the parent has no bottom padding), so it is not drawn here.
//
// Table columns: CSS auto table layout. The first column is nowrap, so it takes its max-content width;
// the others share the rest. The widths below are the computed ones of the two tables reply() can
// draw, measured on both reference viewports (android 412, ios 402). They are linear in the free width
// (CSS distributes it between min- and max-content), so the second column is interpolated on that line
// for the device width; the third column takes what is left.
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, TextStyle, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { act } from '../../../actions';
import { Chip, Icon } from '../../../components';
import { easeVar } from '../../../shell/anim';
import { em, font, palettes, Txt, useTheme } from '../../../theme';
import { parseAnswer } from './mentorMarkup';
import type { Block, Inline } from './mentorMarkup';

const C = palettes.free;

const s = StyleSheet.create({
  msgA: { paddingLeft: 14, borderLeftWidth: 2, marginBottom: 22 },
  who: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, height: 20 },
  whoT: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: em(10.5, 0.14), textTransform: 'uppercase' },
  h5: { ...font('serif', 700), fontSize: 20, lineHeight: 25, letterSpacing: -0.5, color: C.ink },
  p: { fontSize: 14.5, lineHeight: 23.2, color: C.ink2 },
  b: { ...font('sans', 700) },
  i: { ...font('sans', 400) },
  li: { fontSize: 14.5, lineHeight: 22.475, color: C.ink2 },
  list: { paddingLeft: 18 },
  liGap: { marginBottom: 5 },
  marker: { position: 'absolute', right: '100%', top: 0 },
  table: { width: '100%' },
  tr: { flexDirection: 'row' },
  cell: { paddingVertical: 7, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: C.rule },
  th: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: em(10.5, 0.1), textTransform: 'uppercase', color: C.muted },
  td: { fontSize: 13.5, lineHeight: 19.575, color: C.ink },
  td0: { ...font('sans', 600) },
  acts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  src: { fontSize: 11.5, lineHeight: 18.4, color: C.muted },
});

/** The two inline `style` attributes reply() writes on a <p> (L6897, L6900), as computed. */
const P_STYLE: Record<string, { text: TextStyle; box: ViewStyle }> = {
  'font-family:var(--serif);font-size:16.5px;border-left:2px solid var(--rule-2);padding-left:12px': {
    text: { ...font('serif', 400), fontSize: 16.5, lineHeight: 26.4 },
    box: { borderLeftWidth: 2, borderLeftColor: C.rule2, paddingLeft: 12 },
  },
  'font-family:var(--serif);font-style:italic': {
    text: { ...font('serif', 400, true), lineHeight: 23.2 },
    box: {},
  },
};

/** margin-top / margin-bottom of each block (.msg-a rules). */
function margins(b: Block): [number, number] {
  switch (b.t) {
    case 'h5':
      return [0, 8];
    case 'p':
      return [b.cls === 'src' ? 4 : 0, 10];
    case 'table':
      return [6, 12];
    case 'ul':
    case 'ol':
      return [0, 10];
    case 'acts':
      return [6, 0];
  }
}

function Inl({ c }: { c: Inline[] }): React.JSX.Element {
  return (
    <>
      {c.map((n, k) =>
        n.t === 'text' ? (
          n.s
        ) : (
          <Txt key={k} style={n.t === 'b' ? s.b : s.i}>
            <Inl c={n.c} />
          </Txt>
        ),
      )}
    </>
  );
}

/** Column widths of the two tables (see header). `w` = the table's width. */
function colWidths(cols: number, w: number): number[] {
  if (cols === 3) {
    const first = 110.625;
    const free = w - first;
    // android: free 245.375 -> 101.516 ; ios: free 235.375 -> 99.188
    const second = 99.188 + ((101.516 - 99.188) / (245.375 - 235.375)) * (free - 235.375);
    return [first, second, free - second];
  }
  if (cols === 2) return [44.906, w - 44.906];
  return Array.from({ length: cols }, () => w / cols);
}

function Table({ rows }: { rows: { th: boolean; c: Inline[] }[][] }): React.JSX.Element {
  const [w, setW] = useState(0);
  const cols = rows[0]?.length ?? 0;
  const widths = w ? colWidths(cols, w) : null;
  return (
    <View style={s.table} onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
      {widths
        ? rows.map((r, ri) => (
            <View key={ri} style={s.tr}>
              {r.map((cell, ci) => (
                <View key={ci} style={[s.cell, { width: widths[ci] }]}>
                  <Txt style={cell.th ? s.th : [s.td, ci === 0 ? s.td0 : null]} numberOfLines={ci === 0 && !cell.th ? 1 : undefined}>
                    <Inl c={cell.c} />
                  </Txt>
                </View>
              ))}
            </View>
          ))
        : null}
    </View>
  );
}

function List({ b }: { b: { t: 'ul' | 'ol'; items: Inline[][] } }): React.JSX.Element {
  return (
    <View style={s.list}>
      {b.items.map((it, k) => (
        <View key={k} style={k < b.items.length - 1 ? s.liGap : null}>
          <View style={[s.marker, { marginRight: 14.5 * (b.t === 'ol' ? 0.28 : 0.7) }]}>
            <Txt style={s.li}>{b.t === 'ol' ? `${k + 1}.` : '•'}</Txt>
          </View>
          <Txt style={s.li}>
            <Inl c={it} />
          </Txt>
        </View>
      ))}
    </View>
  );
}

function BlockView({ b }: { b: Block }): React.JSX.Element {
  switch (b.t) {
    case 'h5':
      return (
        <Txt style={s.h5}>
          <Inl c={b.c} />
        </Txt>
      );
    case 'p': {
      const ps = b.style ? P_STYLE[b.style] : undefined;
      return (
        <View style={ps?.box}>
          <Txt style={[s.p, b.cls === 'src' ? s.src : null, ps?.text]}>
            <Inl c={b.c} />
          </Txt>
        </View>
      );
    }
    case 'table':
      return <Table rows={b.rows} />;
    case 'ul':
    case 'ol':
      return <List b={b} />;
    case 'acts':
      return (
        <View style={s.acts}>
          {b.chips.map(ch => (
            <Chip key={ch.act + ch.label} label={ch.label} onPress={() => act(ch.act)} />
          ))}
        </View>
      );
  }
}

/** `.msg-a`: `<div class="who">…PrepAssist${using}</div>${reply(q)}`. */
export function MentorAnswer({ using, html }: { using: string; html: string }): React.JSX.Element {
  const t = useTheme();
  const blocks = parseAnswer(html);
  // @keyframes tabIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}} .4s var(--ease)
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: 400, easing: easeVar });
  }, [p]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: (1 - p.value) * 6 }] }));
  return (
    <Animated.View style={[s.msgA, { borderLeftColor: t.brand }, anim]}>
      <View style={s.who}>
        <Icon name="spark" color={t.brand} />
        <Txt style={[s.whoT, { color: t.brand }]}>{'PrepAssist' + using}</Txt>
      </View>
      {blocks.map((b, k) => {
        const prevMb = k ? margins(blocks[k - 1])[1] : 0;
        const mt = k ? Math.max(prevMb, margins(b)[0]) : margins(b)[0];
        return (
          <View key={k} style={{ marginTop: mt }}>
            <BlockView b={b} />
          </View>
        );
      })}
    </Animated.View>
  );
}

