// Source: PrepAssist.html L7257-L7277 (caCalHTML), L8175-L8178 (A.sv*), L8208-L8213 (A.mm*), L7599-L7603 (A.ca*)
import { act } from '../../../actions';
import { setClockOverride } from '../../../env/clock';
import { __resetNavTimers } from '../../../navigation/nav';
import { getS, resetStore, setS } from '../../../store';
import { calModel, colorMix, isFrMap, makeSavedLink, mmCentre } from './mapsLogic';

const REF = '2026-10-24T09:41:00+05:30';

beforeEach(() => {
  setClockOverride(REF);
  resetStore(); // S.ca.date is seeded from the clock
});
afterEach(() => {
  __resetNavTimers();
  setClockOverride(null);
  jest.useRealTimers();
});

describe('mapsLogic', () => {
  test('colorMix matches the computed tl-hero colours', () => {
    // view-mindmaps: color(srgb 0.0403137 0.45051 0.572235) = rgb(10.28, 114.88, 145.92)
    expect(colorMix('#0A97B8', 0.72, '#0B1630')).toBe('rgb(10, 115, 146)');
  });
  test('mindmap routing and centre label', () => {
    expect(isFrMap(undefined)).toBe(true);
    expect(isFrMap('fr')).toBe(true);
    expect(isFrMap('Fundamental Rights')).toBe(true);
    expect(isFrMap('Federalism')).toBe(false);
    expect(mmCentre('Inflation impacts on poor')).toBe('Inflation impacts…');
  });
  test('saved link parsing (A.svSave)', () => {
    const d = new Date(2026, 9, 24);
    expect(makeSavedLink('thehindu.com', '', d)).toBeNull();
    expect(makeSavedLink(' https://www.thehindu.com/opinion/editorial/federalism ', 'Editorial on federalism', d)).toEqual({
      u: 'https://www.thehindu.com/opinion/editorial/federalism',
      dom: 'thehindu.com',
      t: 'Editorial on federalism',
      d: '24 Oct',
    });
    expect(makeSavedLink('http://pib.gov.in/x', '  ', d)?.t).toBe('Saved from pib.gov.in');
  });
  test('October 2026 grid (sheet-edition-calendar)', () => {
    const today = new Date(2026, 9, 24);
    const m = calModel(new Date(2026, 9, 1), today, today);
    expect(m.lead).toBe(3); // 1 Oct 2026 is a Thursday
    expect(m.cells).toHaveLength(31);
    expect(m.nextOk).toBe(false);
    expect(m.cells[0].dots).toBe(1); // reference: one em on the 1st
    expect(m.cells[1].dots).toBe(3);
    const d24 = m.cells[23];
    expect(d24.on && d24.td).toBe(true);
    expect(m.cells[24].fut).toBe(true);
    expect(calModel(new Date(2026, 8, 1), today, today).nextOk).toBe(true);
  });
});

describe('maps handlers', () => {
  test('mmGo charges 3 credits, shows the busy box, then saves the map and opens it', async () => {
    jest.useFakeTimers();
    const credits = getS().me.credits;
    const n = getS().maps.length;
    act('mmTry', 'Federalism');
    expect(getS().mmBusy).toBe('Federalism');
    expect(getS().me.credits).toBe(credits - 3);
    expect(getS().me.ledger[0]).toEqual({ t: 'AI Mindmap · Federalism', d: '24 Oct', v: -3 });
    await jest.advanceTimersByTimeAsync(1600);
    expect(getS().mmBusy).toBeNull();
    expect(getS().maps).toHaveLength(n + 1);
    expect(getS().maps[0]).toEqual({ t: 'Federalism', d: '24 Oct', n: 6, id: 'Federalism' });
    const top = getS().stack[getS().stack.length - 1];
    expect(top.id).toBe('mindmap');
    expect(top.arg).toBe('Federalism');
  });
  test('mmGo without a topic only toasts', () => {
    act('mmGo');
    expect(getS().toast.msg).toBe('Enter a topic to map');
    expect(getS().mmBusy).toBeNull();
  });
  test('mmGo with too few credits opens the low-credits sheet', () => {
    setS(s => ({ me: { ...s.me, credits: 2 }, mmIn: 'X' }));
    act('mmGo');
    expect(getS().sheet.key).toBe('lowCredits');
  });
  test('mm bumps the note counter', () => {
    const n = getS().mmPick.n;
    act('mm', '1');
    expect(getS().mmPick).toEqual({ i: 1, n: n + 1 });
  });
  test('svSave rejects a bare domain and saves a full link at the top', () => {
    act('svAdd');
    expect(getS().sheet.key).toBe('savedAddLink');
    setS({ svUrl: 'thehindu.com' });
    act('svSave');
    expect(getS().toast.msg).toBe('Paste a full link starting with https://');
    setS({ svUrl: 'https://www.thehindu.com/opinion/editorial/federalism', svT: 'Editorial on federalism' });
    act('svSave');
    expect(getS().savedLinks[0].dom).toBe('thehindu.com');
    expect(getS().toast.msg).toBe('Link saved');
    act('svRmL', '0');
    expect(getS().savedLinks).toHaveLength(0);
    act('svRm', 'a3');
    expect(getS().saved.has('a3')).toBe(false);
  });
  test('edition calendar: open, month back, pick, done', () => {
    act('caCal');
    expect(getS().sheet.key).toBe('editionCalendar');
    expect(getS().caView.getMonth()).toBe(9);
    act('caMon', '1'); // November is in the future: ignored
    expect(getS().caView.getMonth()).toBe(9);
    act('caMon', '-1');
    expect(getS().caView.getMonth()).toBe(8);
    act('caPick', '2026-10-21');
    expect(getS().caView.getMonth()).toBe(9);
    act('caDone');
    expect(getS().ca.date).toBe('2026-10-21');
    act('caRecent');
    expect(getS().ca.date).toBe('2026-10-24');
    expect(getS().toast.msg).toBe('Showing today’s edition');
  });
});
