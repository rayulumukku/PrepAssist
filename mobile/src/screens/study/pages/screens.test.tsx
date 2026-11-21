// Source: PrepAssist.html L6510-L6575 (VIEWS.lesson … calendar), L6637-L6644 (VIEWS.plan), L7051-L7059 (planResult)
// The six views of the pages group render inside the page layer with their copy, and the calendar and
// plan follow A.calDay / A.planGo.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act as dispatch } from '../../../actions';
import { __resetNavTimers, push } from '../../../navigation/nav';
import { AppSizeContext } from '../../../shell/AppSize';
import { PageLayer } from '../../../shell/PageLayer';
import { resetStore } from '../../../store';

jest.useFakeTimers();

let mounted: ReactTestRenderer.ReactTestRenderer | undefined;

function render(): ReactTestRenderer.ReactTestRenderer {
  let r!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    r = ReactTestRenderer.create(
      <AppSizeContext.Provider value={{ w: 412, h: 915 }}>
        <PageLayer />
      </AppSizeContext.Provider>,
    );
  });
  mounted = r;
  return r;
}

const texts = (r: ReactTestRenderer.ReactTestRenderer): string =>
  r.root
    .findAll(n => (n.type as unknown) === 'Text')
    .map(n => n.children.filter(c => typeof c === 'string').join(''))
    .join('|');

afterEach(() => {
  ReactTestRenderer.act(() => mounted?.unmount());
  mounted = undefined;
});

beforeEach(() => {
  __resetNavTimers();
  resetStore();
});

it.each([
  ['lesson', undefined, ['Right to Constitutional Remedies', 'Constitutional Remedies · Art. 32', 'Fundamental Rights — Art. 12–35']],
  ['courses', undefined, ['Courses & Lectures', 'Indian Polity: Foundations', 'Answer Writing Programme — GS I']],
  ['course', 'c2', ['Modern Indian History', '31 lectures · 40% complete · Last: Lecture 12 · Moderates', 'Lecture 8']],
  ['note', 'n1', ['Polity · linked to syllabus', 'With PrepAssist AI', 'Link to syllabus']],
  ['calendar', undefined, ['October 2026', 'Newspaper · The Hindu', 'Your Mock 4 · Full length']],
  ['plan', undefined, ['Your 90-day revision strategy', 'Lowest coverage · high PYQ weight', 'Build My Plan']],
] as const)('%s renders', (id, arg, copy) => {
  const r = render();
  ReactTestRenderer.act(() => {
    (push as (v: string, a?: string) => void)(id, arg); // push is typed per view; this table mixes them
    jest.advanceTimersByTime(100); // the page's `.in` frames
  });
  const t = texts(r);
  for (const c of copy) expect(t).toContain(c);
});

it('plan shows the spinner label, then the result', async () => {
  const r = render();
  ReactTestRenderer.act(() => {
    push('plan');
    jest.advanceTimersByTime(100);
  });
  ReactTestRenderer.act(() => dispatch('planGo'));
  expect(texts(r)).toContain('Analysing your preparation…');
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(1400);
  });
  const t = texts(r);
  expect(t).toContain('Your plan is ready');
  expect(t).toContain('Days 76–90 · Recall & mocks');
  expect(t).toContain('Ask Mentor to adjust it');
});
