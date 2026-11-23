import { devanagariFaceFor, em, font, splitScriptRuns } from './fonts';

describe('font()', () => {
  it('returns the loaded face for loaded weights', () => {
    expect(font('sans', 400)).toEqual({ fontFamily: 'Inter-Regular' });
    expect(font('sans', 600)).toEqual({ fontFamily: 'Inter-SemiBold' });
    expect(font('serif', 800)).toEqual({ fontFamily: 'InterTight-ExtraBold' });
    expect(font('book', 500)).toEqual({ fontFamily: 'EBGaramond-Medium' });
    expect(font('hand', 600)).toEqual({ fontFamily: 'Caveat-SemiBold' });
    expect(font('deva', 500)).toEqual({ fontFamily: 'NotoSansDevanagari-Medium' });
  });
  it('maps weights that are not loaded the way the browser did', () => {
    expect(font('sans', 800).fontFamily).toBe('Inter-Bold');
    expect(font('sans', 900).fontFamily).toBe('Inter-Bold');
    expect(font('serif', 400).fontFamily).toBe('InterTight-Medium');
    expect(font('book', 700).fontFamily).toBe('EBGaramond-SemiBold');
    expect(font('hand', 400).fontFamily).toBe('Caveat-Medium');
    expect(font('deva', 700).fontFamily).toBe('NotoSansDevanagari-SemiBold');
  });
  it('uses the one italic face of Inter and EB Garamond, with synthesised bold from 600', () => {
    expect(font('sans', 400, true)).toEqual({ fontFamily: 'Inter-Italic' });
    expect(font('sans', 700, true)).toEqual({ fontFamily: 'Inter-Italic', fontWeight: '700' });
    expect(font('book', 500, true)).toEqual({ fontFamily: 'EBGaramond-Italic' });
    expect(font('book', 600, true)).toEqual({ fontFamily: 'EBGaramond-Italic', fontWeight: '700' });
    expect(font('serif', 400, true)).toEqual({ fontFamily: 'InterTight-Medium', fontStyle: 'italic' });
  });
});

describe('Devanagari runs', () => {
  it('splits mixed text like per-glyph fallback', () => {
    expect(splitScriptRuns('भाषा: हिन्दी')).toEqual([
      { text: 'भाषा', devanagari: true },
      { text: ': ', devanagari: false },
      { text: 'हिन्दी', devanagari: true },
    ]);
    expect(splitScriptRuns('Home')).toEqual([{ text: 'Home', devanagari: false }]);
    expect(splitScriptRuns('')).toEqual([]);
  });
  it('pairs Inter faces with the Noto face of the same or next lower weight', () => {
    expect(devanagariFaceFor('Inter-SemiBold')).toBe('NotoSansDevanagari-SemiBold');
    expect(devanagariFaceFor('Inter-Bold')).toBe('NotoSansDevanagari-SemiBold');
    expect(devanagariFaceFor('Inter-Regular')).toBe('NotoSansDevanagari-Regular');
    expect(devanagariFaceFor('InterTight-Bold')).toBeNull();
  });
});

it('em() resolves letter-spacing', () => {
  expect(em(9.5, 0.03)).toBe(0.285);
  expect(em(22, -0.025)).toBe(-0.55);
});
