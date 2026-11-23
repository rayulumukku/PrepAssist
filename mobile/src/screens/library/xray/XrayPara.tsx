// Source: PrepAssist.html L9893-L9896 (x4Para), L9926-L9926 (<p>${x4Para(p, sc)}</p>)
// Source: PrepAssist.html L9656-L9663 (.x4-tx p, .x4-i, .x4-i.seen, .x4-i.cur, .x4-pin, .x4-t: X-Ray v4 final values), L9502 (.f1/.f2), L9510-L9511 (.l-ins / .l-term lenses)
// One reader paragraph. It parses with the shared X-Ray grammar (components/richTextCore parseXray) but
// draws itself instead of using <RichText>, because the reader needs the line layout of the paragraph:
//   - x4ScrollTo (L9956) and the scroll spy of x4Mount (L9941-L9944) read `mark.getBoundingClientRect().top`;
//   - the highlighter of `mark.x4-i` is a gradient BAND (52%-92% of the inline box, 8%-94% when .cur),
//     and `span.x4-t` has a 1px dotted bottom border. A nested Text can only paint a full-line background
//     and a solid underline, so both are drawn here as views behind / under the text, from the line
//     boxes of onTextLayout plus measured prefix widths for lines that a mark starts or ends inside.
// Computed (reference/android/view-xray, -lens-insights, -lens-terms, -text-larger):
//   p        EB Garamond 400, 17.5px / 30.625px (f1 19.5 / 34.125, f2 21 / 36.75), #2A2722, margin-top 18px
//   mark     padding 0 1px, radius 2, box-decoration-break clone; band #FFE89A 52%-92%; .seen #F3EBCB;
//            .cur #FFF1BF 8%-94%; lens "term": no band. Inline box 23px high at 17.5px, 3px below the line top
//   b.x4-pin 16 x 16 circle, Inter 800 9.5px, #F2C230 / #14161C; .seen #DCEFE2 / #2F8A4A (wins over .cur);
//            .cur #14161C / #FFE27A; margin-right 4px; vertical-align 3px; lens "term": opacity .2
//   span.x4-t EB Garamond 600, #0B7FA6, padding 0 1px, border-bottom 1px dotted #0B7FA6 under the inline box;
//            lens "ins": inherits colour and weight, border transparent
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TextLayoutEvent, TextStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { act } from '../../../actions';
import { parseXray } from '../../../components/richTextCore';
import type { InlineNode } from '../../../components/richTextCore';
import { font, Txt } from '../../../theme';

const SIZES: readonly [number, number][] = [
  [17.5, 30.625],
  [19.5, 34.125],
  [21, 36.75],
];
/** EB Garamond content area = 1.314 em (23px at 17.5px in the reference) */
const CONTENT = 23 / 17.5;

export interface XrayParaProps {
  para: string;
  scanId: string;
  seen: Record<string, number>;
  cur: number;
  lens: string;
  fs: number;
  /** y of each insight's first line, relative to the paragraph, reported after layout */
  onInsightLines?: (tops: Record<number, number>) => void;
}

interface Seg {
  kind: 'ins' | 'term';
  n: number; // insight index, or term ordinal
  from: number; // text offsets (pins excluded); an insight's `from` is where its pin sits
  to: number;
}

interface Ln {
  y: number;
  x: number;
  width: number;
  start: number; // layout offset
  end: number;
}

interface Rect {
  kind: 'ins' | 'term';
  n: number;
  y: number;
  x0: number;
  x1: number;
}

/** Segments, pin offsets and total text length of the inline tree. */
function model(nodes: readonly InlineNode[]): { segs: Seg[]; pins: number[]; len: number } {
  const segs: Seg[] = [];
  const pins: number[] = [];
  let at = 0;
  let t = 0;
  const walk = (list: readonly InlineNode[]): void => {
    for (const n of list) {
      if (n.type === 'text') at += n.text.length;
      else if (n.type === 'br') at += 1;
      else if (n.type === 'term') {
        segs.push({ kind: 'term', n: t++, from: at, to: at + n.term.length });
        at += n.term.length;
      } else if (n.type === 'insight') {
        const from = at;
        pins.push(at);
        walk(n.children);
        segs.push({ kind: 'ins', n: n.n, from, to: at });
      } else walk(n.children);
    }
  };
  walk(nodes);
  return { segs, pins, len: at };
}

export function XrayPara({ para, scanId, seen, cur, lens, fs, onInsightLines }: XrayParaProps): React.JSX.Element {
  const children = useMemo((): InlineNode[] => {
    const doc = parseXray(para);
    return doc.length && doc[0].type === 'p' ? doc[0].children : [];
  }, [para]);
  const m = useMemo(() => model(children), [children]);
  const [size, lh] = SIZES[fs] ?? SIZES[0];
  const content = size * CONTENT;
  const half = (lh - content) / 2;

  const [lines, setLines] = useState<Ln[] | null>(null);
  // prefix widths, keyed by `${line}:${layoutOffset}`
  const [widths, setWidths] = useState<Record<string, number>>({});
  const [pinsInText, setPinsInText] = useState(false);

  // text offset -> layout offset. `pinFirst`: an insight start counts its own pin (the mark box starts before it).
  const lay = (off: number, pinFirst: boolean): number => (pinsInText ? off + m.pins.filter(p => (pinFirst ? p < off : p <= off)).length : off);

  const onTextLayout = (e: TextLayoutEvent): void => {
    const ls = e.nativeEvent.lines;
    const total = ls.reduce((a, l) => a + l.text.length, 0);
    const withPins = total >= m.len + m.pins.length;
    let acc = 0;
    const out: Ln[] = ls.map(l => {
      const ln = { y: l.y, x: l.x, width: l.width, start: acc, end: acc + l.text.length };
      acc += l.text.length;
      return ln;
    });
    const same = lines !== null && withPins === pinsInText && JSON.stringify(lines) === JSON.stringify(out);
    if (!same) {
      setPinsInText(withPins);
      setWidths({});
      setLines(out);
    }
    if (onInsightLines) {
      const tops: Record<number, number> = {};
      for (const s of m.segs) {
        if (s.kind !== 'ins') continue;
        const o = withPins ? s.from + m.pins.filter(p => p < s.from).length : s.from;
        const ln = out.find(l => o < l.end) ?? out[out.length - 1];
        if (ln) tops[s.n] = ln.y;
      }
      onInsightLines(tops);
    }
  };

  // which prefix widths are needed, and the rects once they are known
  const { need, rects } = useMemo(() => {
    const needOut: { key: string; line: number; to: number }[] = [];
    const out: Rect[] = [];
    if (!lines) return { need: needOut, rects: out };
    for (const s of m.segs) {
      const a = lay(s.from, true);
      const b = lay(s.to, false);
      lines.forEach((ln, li) => {
        if (b <= ln.start || a >= ln.end) return;
        let x0 = ln.x;
        let x1 = ln.x + ln.width;
        if (a > ln.start) {
          const k = `${li}:${a}`;
          if (widths[k] === undefined) needOut.push({ key: k, line: li, to: a });
          else x0 = ln.x + widths[k];
        }
        if (b < ln.end) {
          const k = `${li}:${b}`;
          if (widths[k] === undefined) needOut.push({ key: k, line: li, to: b });
          else x1 = ln.x + widths[k];
        }
        out.push({ kind: s.kind, n: s.n, y: ln.y, x0, x1 });
      });
    }
    return { need: needOut, rects: needOut.length ? [] : out };
  }, [lines, widths, m, pinsInText]); // eslint-disable-line react-hooks/exhaustive-deps

  const termStyle: TextStyle = lens === 'ins' ? styles.termIns : styles.term;

  /** The inline nodes, optionally cut to the layout range [from, to). */
  const inline = (nodes: readonly InlineNode[], path: string, cut?: { from: number; to: number }): React.ReactNode[] => {
    let at = 0; // layout offset while walking
    const take = (text: string): string => {
      const s = at;
      at += text.length;
      if (!cut) return text;
      return text.slice(Math.max(0, cut.from - s), Math.max(0, cut.to - s));
    };
    const pinCounts = pinsInText;
    const go = (list: readonly InlineNode[], p: string): React.ReactNode[] =>
      list.map((n, k) => {
        const key = `${p}.${k}`;
        switch (n.type) {
          case 'text':
            return take(n.text);
          case 'br':
            return take('\n');
          case 'b':
          case 'i':
            return <Txt key={key}>{go(n.children, key)}</Txt>;
          case 'term': {
            const tx = take(n.term);
            if (cut && !tx) return null;
            return (
              <Txt
                key={key}
                style={termStyle}
                accessibilityRole={cut ? undefined : 'button'}
                onPress={cut ? undefined : () => act('x4Term', encodeURIComponent(n.term))}
                testID={cut ? undefined : `xray.term.${n.term}`}>
                {tx}
              </Txt>
            );
          }
          case 'insight': {
            const isSeen = !!seen[scanId + ':' + n.n];
            const isCur = n.n === cur && lens !== 'term';
            const pinAt = at;
            if (pinCounts) at += 1;
            const showPin = !cut || (pinAt >= cut.from && pinAt < cut.to) || (!pinCounts && pinAt >= cut.from && pinAt <= cut.to && cut.to > cut.from);
            const pin = [styles.pin, isCur && styles.pinCur, isSeen && styles.pinSeen, lens === 'term' && styles.pinDim];
            const pinTx = [styles.pinTx, isCur && styles.pinTxCur, isSeen && styles.pinTxSeen];
            const inner = go(n.children, key);
            return (
              <Txt key={key} onPress={cut ? undefined : () => act('x4Ins', String(n.n))} testID={cut ? undefined : `xray.insight.${n.n}`}>
                {showPin ? (
                  <View style={pin}>
                    <Txt style={pinTx}>{n.n + 1}</Txt>
                  </View>
                ) : null}
                {inner}
              </Txt>
            );
          }
        }
        return null;
      });
    return go(nodes, path);
  };

  const textStyle = [styles.text, { fontSize: size, lineHeight: lh }];

  // ---- drawn decorations ----
  const bands: React.ReactNode[] = [];
  const dots: React.ReactNode[] = [];
  rects.forEach((r, k) => {
    if (r.kind === 'ins') {
      if (lens === 'term') return;
      const isCur = r.n === cur;
      const isSeen = !!seen[scanId + ':' + r.n];
      const [f0, f1] = isCur ? [0.08, 0.94] : [0.52, 0.92];
      const bg = isCur ? '#FFF1BF' : isSeen ? '#F3EBCB' : '#FFE89A';
      const top = r.y + half + content * f0;
      bands.push(
        <View
          key={'b' + k}
          style={[styles.band, { left: r.x0 - 1, width: r.x1 - r.x0 + 2, top, height: content * (f1 - f0), backgroundColor: bg }]}
        />,
      );
    } else if (lens !== 'ins') {
      const y = r.y + half + content + 0.5;
      const w = r.x1 - r.x0 + 2;
      dots.push(
        <Svg key={'t' + k} style={[styles.dots, { left: r.x0 - 1, top: y - 0.5, width: w }]} width={w} height={1}>
          <Line x1={0} y1={0.5} x2={w} y2={0.5} stroke="#0B7FA6" strokeWidth={1} strokeDasharray="1 1" />
        </Svg>,
      );
    }
  });

  return (
    <View style={styles.p}>
      {bands}
      <Txt style={textStyle} onTextLayout={onTextLayout}>
        {inline(children, 'x')}
      </Txt>
      {dots}
      {lines
        ? need.map(q => (
            <Txt
              key={q.key}
              style={[textStyle, styles.measure]}
              numberOfLines={1}
              onTextLayout={e => {
                const w = e.nativeEvent.lines[0]?.width ?? 0;
                setWidths(prev => (prev[q.key] === undefined ? { ...prev, [q.key]: w } : prev));
              }}>
              {inline(children, 'm' + q.key, { from: lines[q.line].start, to: q.to })}
            </Txt>
          ))
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  p: { marginTop: 18 },
  text: { ...font('book', 400), color: '#2A2722' },
  band: { position: 'absolute', borderRadius: 2 },
  dots: { position: 'absolute', height: 1 },
  measure: { position: 'absolute', left: 0, top: 0, opacity: 0, width: 2000 },
  pin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
    backgroundColor: '#F2C230',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: 0 }],
  },
  pinCur: { backgroundColor: '#14161C' },
  pinSeen: { backgroundColor: '#DCEFE2' },
  pinDim: { opacity: 0.2 },
  pinTx: { ...font('sans', 800), fontSize: 9.5, lineHeight: 9.5, color: '#14161C' },
  pinTxCur: { color: '#FFE27A' },
  pinTxSeen: { color: '#2F8A4A' },
  term: { ...font('book', 600), color: '#0B7FA6' },
  termIns: {},
});
