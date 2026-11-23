// Source: PrepAssist.html L6846-L6881 (mentor), L6937-L6951 (cmdk), L7281-L7319 (article reader)
// The mentor and search sheets and the article reader render with their copy and react to their verbs.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act as dispatch } from '../../actions';
import { __resetNavTimers, push } from '../../navigation/nav';
import { AppSizeContext } from '../../shell/AppSize';
import { PageLayer } from '../../shell/PageLayer';
import { SheetHost } from '../../shell/SheetHost';
import { getS, resetStore } from '../../store';

jest.useFakeTimers();
let mounted: ReactTestRenderer.ReactTestRenderer | undefined;

function render(): ReactTestRenderer.ReactTestRenderer {
  let r!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    r = ReactTestRenderer.create(
      <AppSizeContext.Provider value={{ w: 412, h: 915 }}>
        <PageLayer />
        <SheetHost />
      </AppSizeContext.Provider>,
    );
  });
  mounted = r;
  return r;
}
/** Every string in the rendered tree (nested Text included). */
const texts = (r: ReactTestRenderer.ReactTestRenderer): string => {
  const out: string[] = [];
  const walk = (n: unknown): void => {
    if (typeof n === 'string') out.push(n);
    else if (Array.isArray(n)) n.forEach(walk);
    else if (n && typeof n === 'object' && 'children' in n) walk((n as { children: unknown }).children);
  };
  walk(r.toJSON());
  return out.join('|');
};
const run = (f: () => void): void => {
  ReactTestRenderer.act(f);
};

beforeEach(() => {
  resetStore();
  __resetNavTimers();
});
afterEach(() => {
  run(() => mounted?.unmount());
  mounted = undefined;
});

test('mentor: intro, question, typing, answer with table and chips', async () => {
  const r = render();
  run(() => {
    dispatch('mentor');
    jest.advanceTimersByTime(20);
  });
  expect(texts(r)).toContain('Ask PrepAssist');
  expect(texts(r)).toContain('Today’s plan · Fundamental Rights');
  expect(texts(r)).toContain('Explain Article 32 simply.');
  run(() => {
    dispatch('mentorAsk', 'Explain Article 32 simply.');
  });
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(1500);
    await Promise.resolve();
  });
  const t = texts(r);
  expect(t).toContain('Article 32, in one line');
  // the table draws its rows once it knows its width (onLayout), which the test renderer never reports
  expect(t).toContain('Practise 10 questions');
  expect(t).toContain('PrepAssist · using today’s plan');
});

test('search: empty query lists everything; no match shows the empty line', () => {
  const r = render();
  run(() => {
    dispatch('cmdk');
    jest.advanceTimersByTime(20);
  });
  expect(getS().sheet).toMatchObject({ key: 'search', tall: true });
  expect(texts(r)).toContain('Tools');
  const input = r.root.findByProps({ testID: 'sheet.search.input' });
  run(() => input.props.onChangeText('zzzz'));
  expect(texts(r)).toContain('Nothing found. Try “AI Mentor zzzz”.');
  run(() => input.props.onChangeText('art'));
  expect(texts(r)).toContain('Writs & Article 32');
});

test('article: reader copy, text size and save', () => {
  const r = render();
  run(() => {
    push('article', 'c1');
    jest.advanceTimersByTime(500);
  });
  const t = texts(r);
  expect(t).toContain('Mineral Exchanges and Price Transparency in India’s Mining Sector');
  expect(t).toContain('Context & Deep Background');
  expect(t).toContain('Prelims pointers');
  expect(getS().ca.read.has('c1' as never)).toBe(true);
  run(() => dispatch('arSize'));
  expect(getS().arSize).toBe(2);
  expect(getS().toast).toMatchObject({ msg: 'Larger text', icon: 'type' });
  run(() => dispatch('save', 'c1'));
  expect(getS().saved.has('c1')).toBe(true);
  run(() => dispatch('arNext', 'c2'));
  expect(getS().stack[getS().stack.length - 1].arg).toBe('c2');
});
