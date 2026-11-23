// Source: PrepAssist.html L3240-L3242 (.ar-body p, .s2/.s3 sizes, .ar-body > p:first-of-type::first-letter)
// The first paragraph of the reader with its floated drop cap:
//   ::first-letter  float left; EB Garamond 600 56px, line-height .82 (45.92); padding 6 8 0 0; #14304F
// React Native text cannot flow around a float, so the paragraph is laid out the way the browser
// does it: the lines beside the cap are measured at the narrower width (onTextLayout of an invisible
// copy), drawn next to the cap, and the rest of the text continues at full width below the float.
// The cap is 51.92 px tall (45.92 + 6), so it sits beside the first two lines at every text size
// (28.38, 30.1 and 33.15 px lines).
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent, TextLayoutEvent, TextStyle } from 'react-native';
import { font, Txt } from '../../../theme';

const CAP_H = 45.92 + 6;

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  cap: { paddingTop: 6, paddingRight: 8 },
  capT: { ...font('book', 600), fontSize: 56, lineHeight: 45.92, color: '#14304F' },
  side: { flex: 1 },
  ghost: { position: 'absolute', left: 0, top: 0, opacity: 0 },
});

export function DropCapP({ text, style }: { text: string; style: TextStyle }): React.JSX.Element {
  const first = text.slice(0, 1);
  const rest = text.slice(1);
  const lh = (style.lineHeight as number) || 28.38;
  const besideLines = Math.ceil(CAP_H / lh);
  const [capW, setCapW] = useState(0);
  const [boxW, setBoxW] = useState(0);
  const [split, setSplit] = useState<{ key: string; beside: string } | null>(null);
  const key = `${text}|${capW}|${boxW}|${lh}`;
  const onLines = (e: TextLayoutEvent): void => {
    const beside = e.nativeEvent.lines.slice(0, besideLines).map(l => l.text).join('');
    setSplit({ key, beside });
  };
  const ready = split && split.key === key;
  const beside = ready ? split.beside : rest;
  const after = ready ? rest.slice(split.beside.length) : '';
  return (
    <View onLayout={(e: LayoutChangeEvent) => setBoxW(e.nativeEvent.layout.width)}>
      {capW && boxW ? (
        <View style={[s.ghost, { width: boxW - capW }]} pointerEvents="none">
          <Txt style={style} systemDevanagari onTextLayout={onLines}>
            {rest}
          </Txt>
        </View>
      ) : null}
      <View style={s.row}>
        <View style={s.cap} onLayout={(e: LayoutChangeEvent) => setCapW(e.nativeEvent.layout.width)}>
          <Txt style={s.capT}>{first}</Txt>
        </View>
        <View style={s.side}>
          <Txt style={style} systemDevanagari>
            {beside.replace(/\s+$/, '')}
          </Txt>
        </View>
      </View>
      {after ? (
        <Txt style={style} systemDevanagari>
          {after.replace(/^\s+/, '')}
        </Txt>
      ) : null}
    </View>
  );
}
