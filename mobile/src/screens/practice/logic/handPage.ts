// handPage(seed, annotated) (PrepAssist.html L5589-L5608): the handwriting lines of a scanned answer page.
// Pure geometry; the screen draws it with react-native-svg.

export interface HandPageGeom {
  viewBox: string;
  /** ruled lines `M0 y H x2` */
  rules: { y: number; x2: number }[];
  /** the handwriting strokes (path data) */
  strokes: string[];
}

export function handPage(seed = 1, annotated = false): HandPageGeom {
  let y = 30;
  const strokes: string[] = [];
  const rnd = (i: number): number => (Math.sin(seed * 99 + i * 12.9898) * 43758.5453) % 1;
  for (let i = 0; i < 15; i++) {
    const len = 150 + Math.abs(rnd(i)) * 80;
    let d = `M${i === 0 ? 50 : 24} ${y}`;
    for (let x = i === 0 ? 50 : 24; x < len; x += 9) d += ` q2.2 -${3 + Math.abs(rnd(i + x)) * 3} 4.5 0 t4.5 0`;
    strokes.push(d);
    y += 17;
  }
  return {
    viewBox: `0 0 ${annotated ? 280 : 240} 300`,
    rules: Array.from({ length: 17 }, (_, i) => ({ y: 36 + i * 17, x2: annotated ? 186 : 240 })),
    strokes,
  };
}
