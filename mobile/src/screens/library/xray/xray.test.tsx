// The X-Ray screens and sheets render from the store and the handlers change S.x4 like the HTML.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act as dispatch } from '../../../actions';
import { __resetNavTimers, go, push } from '../../../navigation/nav';
import { AppSizeContext } from '../../../shell/AppSize';
import { PageLayer } from '../../../shell/PageLayer';
import { SheetHost } from '../../../shell/SheetHost';
import { getS, resetStore } from '../../../store';
import { insText, sumInfo, termCount, scanBy } from './x4';
import { mix } from '../mix';

jest.useFakeTimers();

function tree(): ReactTestRenderer.ReactTestRenderer {
  let r!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    r = ReactTestRenderer.create(
      <AppSizeContext.Provider value={{ w: 412, h: 915 }}>
        <PageLayer />
        <SheetHost />
      </AppSizeContext.Provider>,
    );
  });
  return r;
}
const texts = (r: ReactTestRenderer.ReactTestRenderer): string =>
  r.root
    .findAll(n => typeof n.type === 'string' && (n.type as string) === 'Text')
    .map(n => n.children.filter(c => typeof c === 'string').join(''))
    .join('|');

beforeEach(() => {
  __resetNavTimers();
  resetStore();
  go('app');
});

test('helpers', () => {
  const sc = scanBy('arb');
  expect(termCount(sc, 'BITs')).toBe(1);
  expect(insText(sc, 2)).toMatch(/^The Arbitration and Conciliation Act, 1996 covers/);
  expect(sumInfo(sc, { 'arb:0': 1 }).title).toBe('3 insights left to explore');
  expect(mix('#1B8AD3', 35, '#FFFFFF')).toBe('rgb(175, 214, 240)');
});

test('library and reader render', () => {
  const r = tree();
  ReactTestRenderer.act(() => push('xrayhome'));
  ReactTestRenderer.act(() => jest.advanceTimersByTime(500));
  expect(texts(r)).toContain('Past Polity scans');
  ReactTestRenderer.act(() => dispatch('push:xray:celeb'));
  ReactTestRenderer.act(() => jest.advanceTimersByTime(500));
  expect(getS().x4.scan).toBe('celeb');
  expect(texts(r)).toContain('How celebrities become intimates, enter our lives');
  ReactTestRenderer.act(() => dispatch('x4Ins:1'));
  ReactTestRenderer.act(() => jest.advanceTimersByTime(500));
  expect(getS().x4.seen['celeb:1']).toBe(1);
  expect(texts(r)).toContain('Key insight 2');
  ReactTestRenderer.act(() => dispatch('x4Tab:2'));
  ReactTestRenderer.act(() => dispatch('x4Mcq:0'));
  expect(texts(r)).toContain('Not quite · correct answer (B)');
  ReactTestRenderer.act(() => dispatch('x4Term:CCPA'));
  ReactTestRenderer.act(() => jest.advanceTimersByTime(500));
  expect(texts(r)).toContain('Central Consumer Protection Authority');
});
