// Renders the Current tab from the store (today's edition, a paper filter, the empty state).
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act as dispatch } from '../../../actions';
import { go } from '../../../navigation/nav';
import { resetStore } from '../../../store';
import { AppSizeContext } from '../../../shell/AppSize';
import CurrentTab from '../CurrentTab';

jest.useFakeTimers();

const texts = (r: ReactTestRenderer.ReactTestRenderer): string =>
  r.root
    .findAll(n => (n.type as string) === 'Text')
    .map(n => n.children.filter(c => typeof c === 'string').join(''))
    .join('|');

function render(): ReactTestRenderer.ReactTestRenderer {
  let r!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    r = ReactTestRenderer.create(
      <AppSizeContext.Provider value={{ w: 412, h: 915 }}>
        <CurrentTab />
      </AppSizeContext.Provider>,
    );
  });
  return r;
}

beforeEach(() => {
  resetStore();
  go('app');
});

test('today’s edition: lead story, cards and the end line', () => {
  const t = texts(render());
  expect(t).toContain('Lead story');
  expect(t).toContain('Turn this edition into 10 MCQs');
});

test('PIB + GS II is empty', () => {
  const r = render();
  ReactTestRenderer.act(() => {
    dispatch('caGs', 'gs2');
    dispatch('caSrc', 'PIB');
  });
  expect(texts(r)).toContain('Nothing in this edition');
});
