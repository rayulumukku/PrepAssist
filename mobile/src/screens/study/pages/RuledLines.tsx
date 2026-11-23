// Source: PrepAssist.html L2512 (.nt background-image: repeating-linear-gradient(180deg,transparent 0 21px,#E8EDF3 21px 22px), background-position 0 34px)
// The ruled-paper background of `.nt` (and of `.big-ta`, L6537 view-note): a 1px line every `period` px,
// the first at `first` px below the top of the padding box. A repeating gradient positioned at `pos`
// draws its line at (pos + period - 1) mod period, then every period, which is what is computed here.
// Drawn as absolutely positioned 1px views inside a clipping layer that covers the padding box.
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface RuledLinesProps {
  /** pattern height (22 for .nt, 28 for .big-ta) */
  period: number;
  /** background-position y (34 for .nt, 14 for .big-ta) */
  pos: number;
  /** height to fill (lines beyond are clipped) */
  height: number;
  color?: string;
  radius?: number;
}

/** First line offset of `repeating-linear-gradient(transparent 0 (period-1)px, c (period-1)px period px)` at background-position y = pos. */
export const firstLine = (period: number, pos: number): number => (pos + period - 1) % period;

const styles = StyleSheet.create({
  box: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  line: { position: 'absolute', left: 0, right: 0, height: 1 },
});

export function RuledLines({ period, pos, height, color = '#E8EDF3', radius = 0 }: RuledLinesProps): React.JSX.Element {
  const lines: number[] = [];
  for (let y = firstLine(period, pos); y < height; y += period) lines.push(y);
  return (
    <View pointerEvents="none" style={[styles.box, { borderRadius: radius }]}>
      {lines.map(y => (
        <View key={y} style={[styles.line, { top: y, backgroundColor: color }]} />
      ))}
    </View>
  );
}
