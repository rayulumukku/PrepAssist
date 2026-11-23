import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act as dispatch } from '../../actions';
import { go } from '../../navigation/nav';
import { resetStore } from '../../store';
import { AppSizeContext } from '../../shell/AppSize';
import PracticeTab from './PracticeTab';

jest.useFakeTimers();

function render(): ReactTestRenderer.ReactTestRenderer {
  let r!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    r = ReactTestRenderer.create(
      <AppSizeContext.Provider value={{ w: 412, h: 915 }}>
        <PracticeTab />
      </AppSizeContext.Provider>,
    );
  });
  return r;
}
const texts = (r: ReactTestRenderer.ReactTestRenderer): string =>
  r.root
    .findAll(n => (n.type as string) === 'Text')
    .map(n => n.children.filter(c => typeof c === 'string').join(''))
    .join('|');

test('Practice renders the Prelims layout, and Mains after pxGo', () => {
  resetStore();
  go('app');
  const r = render();
  expect(texts(r)).toContain('Question bank');
  ReactTestRenderer.act(() => dispatch('pxGo:mains'));
  expect(texts(r)).toContain('Past evaluations');
});
