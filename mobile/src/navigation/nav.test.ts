// go / setTab / push / back / closeAllPages / openSheet / toast against PrepAssist.html L5616-L5627,
// L6002-L6009, L6474-L6506, L6909-L6915, L5117-L5123.
import { getS, resetStore, setS } from '../store';
import { __resetNavTimers, askOnScroll, back, closeAllPages, closeSheet, go, openSheet, push, setTab, setTopArg, toast } from './nav';
import { SHEET_KEYS, VIEW_IDS, VIEW_META } from './routes';
import { OVERLAYS, SHEETS, STAGE_SCREENS, TAB_SCREENS, VIEWS } from './registry';

jest.useFakeTimers();

beforeEach(() => {
  __resetNavTimers();
  resetStore();
});

const layer = () => getS().layer.map(p => `${p.id}${p.live ? '' : '-leaving'}${p.under ? '-under' : ''}`);

describe('stages', () => {
  it('starts with no stage; go(book) shows the book', () => {
    expect(getS().stage).toBeNull();
    go('book');
    expect(getS().stage).toBe('book');
    expect(getS().rendered).toBe(false);
  });

  it('the first go(app) runs renderAll: rendered flag, home tab, Ask minimises after 3500 ms', () => {
    go('app');
    expect(getS()).toMatchObject({ stage: 'app', rendered: true, tab: 'home', askMini: false });
    jest.advanceTimersByTime(3499);
    expect(getS().askMini).toBe(false);
    jest.advanceTimersByTime(1);
    expect(getS().askMini).toBe(true);
  });

  it('leaving the app stage removes every page at once', () => {
    go('app');
    push('lesson');
    push('legal', 'terms');
    go('auth');
    expect(getS().stack).toEqual([]);
    expect(getS().layer).toEqual([]);
  });

  it('a page can be pushed over a non-app stage (Terms from sign-up) and hides nothing else', () => {
    go('auth');
    push('legal', 'terms');
    expect(getS().stage).toBe('auth');
    expect(layer()).toEqual(['legal']);
  });
});

describe('page stack', () => {
  beforeEach(() => go('app'));

  it('push marks the previous page under and minimises the Ask button', () => {
    push('lesson');
    expect(layer()).toEqual(['lesson']);
    expect(getS().askMini).toBe(true);
    push('mindmap', 'Federalism');
    expect(layer()).toEqual(['lesson-under', 'mindmap']);
    expect(getS().stack.map(e => [e.id, e.arg, e.focus])).toEqual([['lesson', undefined, false], ['mindmap', 'Federalism', false]]);
  });

  it('focus and noAsk views are flagged like S.stack[i].focus', () => {
    push('quiz');
    push('saved');
    expect(getS().stack.map(e => e.focus)).toEqual([true, true]);
    expect(VIEW_META.quiz.focus && !VIEW_META.saved.focus && VIEW_META.saved.noAsk).toBe(true);
  });

  it('back slides the top page out for 420 ms and frees the page under it', () => {
    push('lesson');
    push('note', 'n1');
    back();
    expect(getS().stack.map(e => e.id)).toEqual(['lesson']);
    expect(layer()).toEqual(['lesson', 'note-leaving']);
    jest.advanceTimersByTime(419);
    expect(layer()).toEqual(['lesson', 'note-leaving']);
    jest.advanceTimersByTime(1);
    expect(layer()).toEqual(['lesson']);
  });

  it('back with an empty stack does nothing', () => {
    const before = getS();
    back();
    expect(getS()).toBe(before);
  });

  it('back then push in the same tick keeps both pages in the layer (engineGo, L7030)', () => {
    push('engine');
    back();
    push('quiz');
    expect(layer()).toEqual(['engine-leaving', 'quiz']);
    jest.advanceTimersByTime(420);
    expect(layer()).toEqual(['quiz']);
  });

  it('closeAllPages keeps `under` on the pages below: they do not slide', () => {
    push('lesson');
    push('note', 'n1');
    closeAllPages();
    expect(getS().stack).toEqual([]);
    expect(layer()).toEqual(['lesson-leaving-under', 'note-leaving']);
    jest.advanceTimersByTime(420);
    expect(layer()).toEqual([]);
  });

  it('closeAllPages(true) removes at once', () => {
    push('lesson');
    closeAllPages(true);
    expect(layer()).toEqual([]);
  });

  it('setTab closes the pages', () => {
    push('lesson');
    setTab('current');
    expect(getS().tab).toBe('current');
    expect(getS().stack).toEqual([]);
  });

  it('setTopArg replaces the argument of the top entry (A.arNext, A.legalSwap)', () => {
    push('legal', 'terms');
    setTopArg('privacy');
    expect(getS().stack[0].arg).toBe('privacy');
    expect(getS().layer[0].arg).toBe('privacy');
  });
});

describe('sheet', () => {
  it('opens on the next frame, replaces content on re-open, closes without dropping the content', () => {
    openSheet('language');
    expect(getS().sheet).toMatchObject({ key: 'language', on: false, tall: false });
    jest.runOnlyPendingTimers();
    expect(getS().sheet.on).toBe(true);
    const n = getS().sheet.n;
    openSheet('allTools', { tall: true });
    expect(getS().sheet).toMatchObject({ key: 'allTools', on: false, tall: true, n: n + 1 });
    jest.runOnlyPendingTimers();
    closeSheet();
    expect(getS().sheet).toMatchObject({ key: 'allTools', on: false });
  });
});

describe('toast', () => {
  it('restarts its 2400 ms on every call and takes an icon or none', () => {
    toast('one', 'mail');
    jest.advanceTimersByTime(2000);
    toast('two', null);
    jest.advanceTimersByTime(2000);
    expect(getS().toast).toMatchObject({ msg: 'two', icon: null, on: true });
    jest.advanceTimersByTime(400);
    expect(getS().toast.on).toBe(false);
  });
});

describe('Ask button scroll rule (L5992-L5997)', () => {
  it('minimises on a downward move of more than 6 px past 120, restores on an upward move of more than 6 px', () => {
    const st = { last: 0 };
    askOnScroll(100, st);
    expect(getS().askMini).toBe(false);
    askOnScroll(125, st);
    expect(getS().askMini).toBe(true);
    askOnScroll(121, st); // only 4 px up
    expect(getS().askMini).toBe(true);
    askOnScroll(110, st);
    expect(getS().askMini).toBe(false);
    setS({ askMini: false });
    askOnScroll(114, st); // 4 px down
    expect(getS().askMini).toBe(false);
  });
});

describe('registry', () => {
  it('has a file for every route key', () => {
    for (const id of VIEW_IDS) expect([id, typeof VIEWS[id]?.Screen]).toEqual([id, 'function']);
    for (const k of SHEET_KEYS) expect([k, typeof SHEETS[k]]).toEqual([k, 'function']);
    expect(Object.keys(STAGE_SCREENS).sort()).toEqual(['auth', 'book', 'intro', 'verify']);
    expect(Object.keys(TAB_SCREENS).sort()).toEqual(['current', 'home', 'learn', 'menu', 'practice', 'profile']);
    expect(Object.keys(OVERLAYS).sort()).toEqual(['planMagic', 'reel']);
    expect(VIEW_IDS).toHaveLength(42);
    expect(SHEET_KEYS).toHaveLength(35);
  });

  it('non-focus views have a header background, focus views do not', () => {
    for (const id of VIEW_IDS) expect([id, VIEW_META[id].phBg === null]).toEqual([id, VIEW_META[id].focus]);
    expect(VIEW_IDS.filter(id => VIEW_META[id].focus).sort()).toEqual(['article', 'note2', 'onestep', 'pqb', 'quiz', 'upgrade', 'xray']);
    expect(VIEW_IDS.filter(id => VIEW_META[id].noAsk).sort()).toEqual(['noteshub', 'querydb', 'saved']);
  });
});
