import { caFiltered, caPool, dayOfYear, filterCounts, fmtLong, gsCounts, gsOf } from './currentLogic';

const TODAY = new Date(2026, 9, 24);

test('today’s edition is the fixed eight stories (L7180)', () => {
  expect(caPool('2026-10-24', TODAY).map(a => a.id)).toEqual(['c1', 'c2', 'c3', 'c4', 'a2', 'a4', 'a7', 'a6']);
});

test('an archive edition is seeded from the date (L7181-L7183)', () => {
  // seed = 21 + 9 * 31 = 300, n = 4 + 300 % 3 = 4
  expect(caPool('2026-10-21', TODAY).map(a => a.id)).toEqual(['a7', 'a3', 'a6', 'a2']);
});

test('reference numbers of tab-current: 8 stories, GS II 2, GS III 7, sources 4/2/2, No. 297', () => {
  const all = caPool('2026-10-24', TODAY);
  const gc = gsCounts(all);
  expect([gc.gs2, gc.gs3]).toEqual([2, 7]);
  expect(['The Hindu', 'Times of India', 'PIB'].map(s => all.filter(a => a.src === s).length)).toEqual([4, 2, 2]);
  expect(dayOfYear(TODAY)).toBe(297);
  expect(fmtLong(TODAY)).toBe('Saturday, 24 October 2026');
});

test('filters and the filter sheet counts', () => {
  const all = caPool('2026-10-24', TODAY);
  expect(caFiltered(all, 'PIB', 'gs2')).toEqual([]);
  expect(caFiltered(all, 'All', 'gs3').length).toBe(7);
  const n = filterCounts(all, 'All');
  expect(['All', 'gs1', 'gs2', 'gs3', 'gs4'].map(n)).toEqual([8, 0, 2, 7, 0]);
  expect(gsOf(all[0])).toEqual(['gs3']);
});
