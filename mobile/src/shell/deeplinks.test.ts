import { __resetNavTimers } from '../navigation/nav';
import { getS, resetStore } from '../store';
import { handleLink, parseLink } from './deeplinks';

jest.useFakeTimers();
beforeEach(() => {
  __resetNavTimers();
  resetStore();
});

describe('parseLink', () => {
  it('reads command, decoded arguments and query; chains with ;', () => {
    expect(parseLink('prepassist://tab/learn')).toEqual([{ cmd: 'tab', args: ['learn'], query: {} }]);
    expect(parseLink('prepassist://toast/Seat%20reserved%20%E2%80%94%20ok/mail')).toEqual([{ cmd: 'toast', args: ['Seat reserved — ok', 'mail'], query: {} }]);
    expect(parseLink('prepassist://insets/zero;sheet/language?tall=1')).toEqual([
      { cmd: 'insets', args: ['zero'], query: {} },
      { cmd: 'sheet', args: ['language'], query: { tall: '1' } },
    ]);
    expect(parseLink('https://example.com')).toEqual([]);
  });
});

describe('handleLink', () => {
  it('tab enters the app stage first', () => {
    expect(handleLink('prepassist://tab/learn')).toBe(true);
    expect(getS()).toMatchObject({ stage: 'app', tab: 'learn' });
  });
  it('push, act, lang, plan, insets', () => {
    handleLink('prepassist://push/course/c2;lang/hi;plan/ultimate;insets/zero');
    expect(getS().stack.map(e => [e.id, e.arg])).toEqual([['course', 'c2']]);
    expect(getS()).toMatchObject({ lang: 'hi', planTheme: 'ultimate', insetsMode: 'zero' });
    expect(getS().me.plan).toBe('ultimate');
    handleLink('prepassist://act/push/legal%3Aterms');
    expect(getS().stack.map(e => [e.id, e.arg])).toEqual([['course', 'c2'], ['legal', 'terms']]);
  });
  it('jump mirrors the location.hash start', () => {
    handleLink('prepassist://jump/status');
    expect(getS()).toMatchObject({ stage: 'app', tab: 'profile' });
    expect(getS().stack.map(e => e.id)).toEqual(['status']);
  });
  it('ignores links that are not ours or name nothing known', () => {
    expect(handleLink('other://x')).toBe(false);
    handleLink('prepassist://tab/nowhere');
    expect(getS().stage).toBeNull();
  });
});
