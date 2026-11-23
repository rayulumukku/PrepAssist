// Every practice view renders from the store without throwing, in the states the reference pack captures.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act } from '../../actions';
import { mainsRender } from '../../actions/practice';
import { __resetNavTimers, closeAllPages, go } from '../../navigation/nav';
import { PageLayer } from '../../shell/PageLayer';
import { SheetHost } from '../../shell/SheetHost';
import { AppSizeContext } from '../../shell/AppSize';
import { resetStore } from '../../store';

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
  closeAllPages(true);
  resetStore();
  go('app');
});

const run = (r: ReactTestRenderer.ReactTestRenderer, ...acts: string[]): void => {
  for (const a of acts) ReactTestRenderer.act(() => act(a));
  ReactTestRenderer.act(() => {
    jest.advanceTimersByTime(50);
  });
  void r;
};

it('quiz: question, feedback, results', () => {
  const r = tree();
  run(r, 'jump:quiz');
  expect(texts(r)).toContain('Which of the statements given above are correct?');
  run(r, 'opt:1', 'qSubmit');
  expect(texts(r)).toContain('Correct');
  run(r, 'qResults');
  expect(texts(r)).toContain('Question map');
  ReactTestRenderer.act(() => r.unmount());
});

it.each([
  ['push:engine', 'Generate test'],
  ['push:tests', 'Upcoming'],
  ['push:history', 'avg. accuracy'],
  ['push:pastevals', '/ 15 average'],
  ['push:qbank:eco', 'Economy'],
  ['push:answerbank', 'Model answer'],
  ['push:answer:mq1', 'Decode the question'],
  ['push:mainsResult', 'Examiner’s note'],
  ['push:testquiz', 'Tap to upload a PDF'],
  ['push:pqb', 'Prelims Question Bank'],
])('%s renders', (a, txt) => {
  const r = tree();
  run(r, a);
  expect(texts(r)).toContain(txt);
  ReactTestRenderer.act(() => r.unmount());
});

it('mains panel, evaluation and report', async () => {
  const r = tree();
  run(r, 'jump:mains');
  ReactTestRenderer.act(() => mainsRender());
  expect(texts(r)).toContain('Run UPSC evaluation');
  run(r, 'mvAdd', 'mvAdd', 'mForce');
  expect(texts(r)).toContain('Evaluating your answer…');
  await ReactTestRenderer.act(async () => {
    await jest.advanceTimersByTimeAsync(560 * 5 + 400);
  });
  expect(texts(r)).toContain('Examiner’s note');
  run(r, 'mvMode:type');
  ReactTestRenderer.act(() => r.unmount());
});

it('pqb attempts sheet', () => {
  const r = tree();
  run(r, 'push:pqb', 'pqPick:1', 'pqLang:hi', 'pqHist');
  expect(texts(r)).toContain('Your attempts');
  ReactTestRenderer.act(() => r.unmount());
});

it('the device-shot chain reaches the quiz', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { handleLink } = require('../../shell/deeplinks');
  const r = tree();
  ReactTestRenderer.act(() => {
    handleLink('prepassist://reset;insets/zero;clock/2026-10-24T09%3A41%3A00%2B05%3A30');
  });
  ReactTestRenderer.act(() => {
    handleLink('prepassist://jump/quiz');
  });
  ReactTestRenderer.act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(texts(r)).toContain('Which of the statements given above are correct?');
  ReactTestRenderer.act(() => r.unmount());
});
