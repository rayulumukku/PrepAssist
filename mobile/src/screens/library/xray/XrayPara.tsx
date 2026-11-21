// Source: PrepAssist.html L9893-L9896 (x4Para), L9926-L9926 (<p>${x4Para(p, sc)}</p>)
// Source: PrepAssist.html L9656-L9663 (.x4-tx p, .x4-i, .x4-i.seen, .x4-i.cur, .x4-pin, .x4-t: X-Ray v4 final values), L9502 (.f1/.f2), L9510-L9511 (.l-ins / .l-term lenses)
// One reader paragraph. It parses with the shared X-Ray grammar (components/richTextCore parseXray) but
// draws itself instead of using <RichText>, because the reader needs the line layout of the paragraph
// (onTextLayout) to find where each insight starts: x4ScrollTo (L9956) and the scroll spy of x4Mount
// (L9941-L9944) read `mark.getBoundingClientRect().top`. RichText has no onTextLayout prop.
// Computed (reference/android/view-xray, -lens-insights, -lens-terms, -text-larger):
//   p        EB Garamond 400, 17.5px / 30.625px (f1 19.5 / 34.125, f2 21 / 36.75), #2A2722, margin-top 18px
//   mark     background band #FFE89A; .seen #F3EBCB; .cur #FFF1BF; lens "term": no background
//   b.x4-pin 16 x 16 circle, Inter 800 9.5px, #F2C230 / #14161C; .seen #DCEFE2 / #2F8A4A (wins over .cur);
//            .cur #14161C / #FFE27A; margin-right 4px; vertical-align 3px; lens "term": opacity .2
//   span.x4-t EB Garamond 600, #0B7FA6, border-bottom 1px dotted #0B7FA6; lens "ins": inherits colour and weight,
//            border transparent
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TextLayoutEvent, TextStyle } from 'react-native';
import { act } from '../../../actions';
import { parseXray } from '../../../components/richTextCore';
import type { InlineNode } from '../../../components/richTextCore';
import { font, Txt } from '../../../theme';

const SIZES: readonly [number, number][] = [
  [17.5, 30.625],
  [19.5, 34.125],
  [21, 36.75],
];

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

export function XrayPara({ para, scanId, seen, cur, lens, fs, onInsightLines }: XrayParaProps): React.JSX.Element {
  const children = useMemo((): InlineNode[] => {
    const doc = parseXray(para);
    return doc.length && doc[0].type === 'p' ? doc[0].children : [];
  }, [para]);
  const [size, lh] = SIZES[fs] ?? SIZES[0];

  // character offset where each insight's text begins (the pin is an inline view and adds no text)
  const offsets = useMemo(() => {
    const out: Record<number, number> = {};
    let at = 0;
    const walk = (nodes: readonly InlineNode[]): void => {
      for (const n of nodes) {
        if (n.type === 'text') at += n.text.length;
        else if (n.type === 'term') at += n.term.length;
        else if (n.type === 'br') at += 1;
        else if (n.type === 'insight') {
          out[n.n] = at;
          walk(n.children);
        } else walk(n.children);
      }
    };
    walk(children);
    return out;
  }, [children]);

  const onTextLayout = (e: TextLayoutEvent): void => {
    if (!onInsightLines) return;
    const lines = e.nativeEvent.lines;
    const tops: Record<number, number> = {};
    for (const [k, off] of Object.entries(offsets)) {
      let acc = 0;
      for (const ln of lines) {
        if (off < acc + ln.text.length) {
          tops[Number(k)] = ln.y;
          break;
        }
        acc += ln.text.length;
      }
      if (tops[Number(k)] === undefined && lines.length) tops[Number(k)] = lines[lines.length - 1].y;
    }
    onInsightLines(tops);
  };

  const termStyle: TextStyle = lens === 'ins' ? styles.termIns : styles.term;

  const inline = (nodes: readonly InlineNode[], path: string): React.ReactNode[] =>
    nodes.map((n, k) => {
      const key = `${path}.${k}`;
      switch (n.type) {
        case 'text':
          return n.text;
        case 'br':
          return '\n';
        case 'b':
        case 'i':
          return <Txt key={key}>{inline(n.children, key)}</Txt>;
        case 'term':
          return (
            <Txt
              key={key}
              style={termStyle}
              accessibilityRole="button"
              onPress={() => act('x4Term', encodeURIComponent(n.term))}
              testID={`xray.term.${n.term}`}>
              {n.term}
            </Txt>
          );
        case 'insight': {
          const isSeen = !!seen[scanId + ':' + n.n];
          const isCur = n.n === cur && lens !== 'term';
          const bg = lens === 'term' ? undefined : isCur ? styles.markCur : isSeen ? styles.markSeen : styles.mark;
          const pin = [styles.pin, isCur && styles.pinCur, isSeen && styles.pinSeen, lens === 'term' && styles.pinDim];
          const pinTx = [styles.pinTx, isCur && styles.pinTxCur, isSeen && styles.pinTxSeen];
          return (
            <Txt key={key} style={bg} onPress={() => act('x4Ins', String(n.n))} testID={`xray.insight.${n.n}`}>
              <View style={pin}>
                <Txt style={pinTx}>{n.n + 1}</Txt>
              </View>
              {inline(n.children, key)}
            </Txt>
          );
        }
      }
      return null;
    });

  return (
    <View style={styles.p}>
      <Txt style={[styles.text, { fontSize: size, lineHeight: lh }]} onTextLayout={onTextLayout}>
        {inline(children, 'x')}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  p: { marginTop: 18 },
  text: { ...font('book', 400), color: '#2A2722' },
  mark: { backgroundColor: '#FFE89A' },
  markSeen: { backgroundColor: '#F3EBCB' },
  markCur: { backgroundColor: '#FFF1BF' },
  pin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
    backgroundColor: '#F2C230',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -3 }],
  },
  pinCur: { backgroundColor: '#14161C' },
  pinSeen: { backgroundColor: '#DCEFE2' },
  pinDim: { opacity: 0.2 },
  pinTx: { ...font('sans', 800), fontSize: 9.5, lineHeight: 9.5, color: '#14161C' },
  pinTxCur: { color: '#FFE27A' },
  pinTxSeen: { color: '#2F8A4A' },
  term: {
    ...font('book', 600),
    color: '#0B7FA6',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: '#0B7FA6',
  },
  termIns: {},
});
