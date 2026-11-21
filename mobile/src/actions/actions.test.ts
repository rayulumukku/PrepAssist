// The dispatcher rules of PrepAssist.html L7061-L7068 and the shell-level handlers.
import actionsMap from '../../actions.map.json';
import { __resetNavTimers, closeSheet, go, openSheet } from '../navigation/nav';
import { getS, resetStore } from '../store';
import { A, __areasForTest, act, splitAct } from './index';

jest.useFakeTimers();

beforeEach(() => {
  __resetNavTimers();
  resetStore();
  go('app');
});

describe('splitAct (L7064-L7065)', () => {
  it('splits at the first colon only', () => {
    expect(splitAct('push:note:n1')).toEqual({ verb: 'push', arg: 'note:n1' });
    expect(splitAct('toast:Saved: ok')).toEqual({ verb: 'toast', arg: 'Saved: ok' });
  });
  it('gives undefined, not an empty string, when there is no colon', () => {
    expect(splitAct('back')).toEqual({ verb: 'back', arg: undefined });
    expect(splitAct('push:')).toEqual({ verb: 'push', arg: '' });
  });
});

describe('act', () => {
  it('ignores a verb that has no handler', () => {
    const before = getS();
    expect(() => act('noSuchVerb:1')).not.toThrow();
    expect(getS()).toBe(before);
  });

  it('push re-splits its argument once and closes the sheet first (L6994)', () => {
    openSheet('language');
    jest.runOnlyPendingTimers();
    expect(getS().sheet.on).toBe(true);
    act('push:legal:terms');
    expect(getS().sheet.on).toBe(false);
    expect(getS().stack.map(e => [e.id, e.arg])).toEqual([['legal', 'terms']]);
    act('push', 'lesson');
    expect(getS().stack.map(e => [e.id, e.arg])).toEqual([['legal', 'terms'], ['lesson', undefined]]);
  });

  it('push:note:new never pushes: it runs the ntNew verb instead (L10630)', () => {
    act('push:note:new');
    expect(getS().stack).toHaveLength(0);
  });

  it('push of an unknown view does nothing', () => {
    act('push:nowhere');
    expect(getS().stack).toHaveLength(0);
  });

  it('tab closes the sheet, switches tab and closes every page (L6993, L6002-L6009)', () => {
    act('push:lesson');
    openSheet('language');
    act('tab:learn');
    expect(getS().tab).toBe('learn');
    expect(getS().stack).toHaveLength(0);
    expect(getS().sheet.on).toBe(false);
  });

  it('tool is the ORIGINAL openTool (L6954-L6960), not the later redirects', () => {
    act('tool:notes');
    expect(getS().stack.map(e => [e.id, e.arg])).toEqual([['note', 'n1']]);
    act('back');
    act('tool:xray');
    // the L8369 redirect to xrayhome never reaches A.tool
    expect(getS().stack.map(e => e.id)).toEqual(['xray']);
    act('back');
    act('tool:tests');
    expect(getS().stack.map(e => e.id)).toEqual(['tests']);
  });

  it('sheet opens a SHEETS key, tall only for allTools (L7014)', () => {
    act('sheet:language');
    expect(getS().sheet).toMatchObject({ key: 'language', tall: false });
    act('sheet:allTools');
    expect(getS().sheet).toMatchObject({ key: 'allTools', tall: true });
    closeSheet();
    const n = getS().sheet.n;
    act('sheet:mentor'); // not a SHEETS key
    expect(getS().sheet.n).toBe(n);
  });

  it('toast shows the text with the check icon for 2400 ms (L7041, L5117-L5123)', () => {
    act('toast:Note saved & synced');
    expect(getS().toast).toMatchObject({ msg: 'Note saved & synced', icon: 'check', on: true });
    jest.advanceTimersByTime(2399);
    expect(getS().toast.on).toBe(true);
    jest.advanceTimersByTime(1);
    expect(getS().toast.on).toBe(false);
  });

  it('jump goes to a stage, a tab or a named screen (L6971-L6983)', () => {
    act('jump:auth');
    expect(getS().stage).toBe('auth');
    act('jump:plans');
    expect(getS().stage).toBe('app');
    expect(getS().tab).toBe('profile');
    expect(getS().stack.map(e => e.id)).toEqual(['upgrade']);
    act('jump:article');
    expect(getS().tab).toBe('current');
    expect(getS().stack.map(e => [e.id, e.arg])).toEqual([['article', 'c4']]);
  });
});

describe('registry', () => {
  it('no verb is defined by two files', () => {
    const seen = new Map<string, string>();
    for (const [area, mod] of Object.entries(__areasForTest)) {
      for (const verb of Object.keys(mod.handlers)) {
        expect([verb, seen.get(verb)]).toEqual([verb, undefined]);
        seen.set(verb, area);
      }
    }
  });

  it('every handler is defined by the owner actions.map.json names, and every verb has an owner', () => {
    const owner = new Map(actionsMap.verbs.map(v => [v.verb, v.owner]));
    for (const v of actionsMap.verbs) expect([v.verb, typeof v.owner]).toEqual([v.verb, 'string']);
    for (const [area, mod] of Object.entries(__areasForTest)) {
      for (const verb of Object.keys(mod.handlers)) expect([verb, owner.get(verb)]).toEqual([verb, area]);
    }
  });

  it('base defines all of its verbs', () => {
    const base = actionsMap.verbs.filter(v => v.owner === 'base').map(v => v.verb).sort();
    expect(Object.keys(__areasForTest.base.handlers).sort()).toEqual(base);
    for (const verb of base) expect(typeof A[verb]).toBe('function');
  });
});
