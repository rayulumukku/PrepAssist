// The shell layers render from the store: tab bar labels (English and Hindi), page header title,
// sheet frame, toast text, Ask button.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { __resetNavTimers, go, openSheet, push, toast } from '../navigation/nav';
import { resetStore, setS } from '../store';
import { AppSizeContext } from './AppSize';
import { AskButton } from './AskButton';
import { NavBar } from './NavBar';
import { PageLayer } from './PageLayer';
import { Scrim, SheetHost } from './SheetHost';
import { Toast } from './Toast';

jest.useFakeTimers();

function tree(): ReactTestRenderer.ReactTestRenderer {
  let r!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    r = ReactTestRenderer.create(
      <AppSizeContext.Provider value={{ w: 412, h: 915 }}>
        <NavBar />
        <PageLayer />
        <AskButton />
        <Scrim />
        <SheetHost />
        <Toast />
      </AppSizeContext.Provider>,
    );
  });
  return r;
}

const texts = (r: ReactTestRenderer.ReactTestRenderer): string[] =>
  r.root.findAll(n => typeof n.type === 'string' && (n.type as string) === 'Text').map(n => n.children.filter(c => typeof c === 'string').join('')).filter(Boolean);

beforeEach(() => {
  __resetNavTimers();
  resetStore();
  go('app');
});

it('labels the six tabs in English, then in Hindi', () => {
  const r = tree();
  expect(texts(r)).toEqual(expect.arrayContaining(['Home', 'Learn', 'Practice', 'Current', 'Menu', 'Profile', 'Ask PrepAssist']));
  ReactTestRenderer.act(() => setS({ lang: 'hi' }));
  expect(texts(r)).toEqual(expect.arrayContaining(['होम', 'सीखें', 'अभ्यास', 'समसामयिकी', 'मेनू', 'प्रोफ़ाइल']));
  ReactTestRenderer.act(() => r.unmount());
});

it('draws the page header of a pushed non-focus view and none for a focus view', () => {
  const r = tree();
  ReactTestRenderer.act(() => push('lesson'));
  expect(texts(r)).toContain('Indian Polity · Lecture 4');
  expect(r.root.findAllByProps({ accessibilityLabel: 'Back' }).length).toBeGreaterThan(0);
  ReactTestRenderer.act(() => {
    push('quiz');
  });
  expect(r.root.findAllByProps({ testID: 'page.quiz' }).length).toBeGreaterThan(0);
  ReactTestRenderer.act(() => r.unmount());
});

it('draws the sheet frame and the toast', () => {
  const r = tree();
  ReactTestRenderer.act(() => {
    openSheet('language');
    toast('Changes saved');
    jest.advanceTimersByTime(20);
  });
  expect(texts(r)).toEqual(expect.arrayContaining(['Language', 'Changes saved']));
  expect(r.root.findAllByProps({ accessibilityLabel: 'Close' }).length).toBeGreaterThan(0);
  ReactTestRenderer.act(() => r.unmount());
});
