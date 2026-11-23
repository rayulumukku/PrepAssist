import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { go } from '../../navigation/nav';
import { resetStore } from '../../store';
import { AppSizeContext } from '../../shell/AppSize';
import HomeTab from './HomeTab';
jest.useFakeTimers();
test('Home renders its sections', () => {
  resetStore();
  go('app');
  let r!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    r = ReactTestRenderer.create(
      <AppSizeContext.Provider value={{ w: 412, h: 915 }}>
        <HomeTab />
      </AppSizeContext.Provider>,
    );
  });
  const t = r.root.findAll(n => (n.type as string) === 'Text').length;
  expect(t).toBeGreaterThan(10);
});
