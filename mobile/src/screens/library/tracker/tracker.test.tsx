// Notes Tracker: screens render from the store and the handlers change NT like the HTML.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { act as dispatch } from '../../../actions';
import { __resetNavTimers, go, push } from '../../../navigation/nav';
import { AppSizeContext } from '../../../shell/AppSize';
import { PageLayer } from '../../../shell/PageLayer';
import { SheetHost } from '../../../shell/SheetHost';
import { getS, resetStore } from '../../../store';
import { noteBy, ntTotal, sorted } from './nt';

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
const step = (f: () => void): void => {
  ReactTestRenderer.act(f);
  ReactTestRenderer.act(() => jest.advanceTimersByTime(500));
};

beforeEach(() => {
  __resetNavTimers();
  resetStore();
  go('app');
});

test('seed counts match the reference (47 notes, 48 updates)', () => {
  expect(ntTotal()).toBe(48);
  expect(sorted('polity', 'new')[0].id).toBe('nt1');
  expect(sorted('polity', 'az')[0].t).toBe('Anti-Defection Law');
});

test('tracker, folder, note, updates and merge', () => {
  const r = tree();
  step(() => push('tracker'));
  expect(texts(r)).toContain('Review 48 updates');
  step(() => dispatch('push:folder:Polity'));
  expect(texts(r)).toContain('20 new updates waiting across 11 notes.');
  step(() => dispatch('push:ntNote:nt1'));
  expect(texts(r)).toContain('4 new updates for this note');
  step(() => dispatch('ntUps:nt1'));
  expect(texts(r)).toContain('Note Updates');
  step(() => dispatch('ntIgn:nt1:0'));
  expect(noteBy('nt1')?.ups.length).toBe(3);
  step(() => dispatch('ntMerge:nt1'));
  expect(texts(r)).toContain('Merging updates…');
  step(() => jest.advanceTimersByTime(2100));
  expect(texts(r)).toContain('Merged into your note');
  expect(noteBy('nt1')?.merged?.pts.length).toBe(4);
  step(() => dispatch('ntStar:nt1'));
  expect(noteBy('nt1')?.star).toBe(false);
});

test('new note saves into the folder', () => {
  tree();
  step(() => dispatch('ntNew:History'));
  expect(getS().nn?.k).toBe('history');
  step(() => dispatch('ntCap'));
  step(() => dispatch('ntMode:cam'));
  step(() => dispatch('ntCap'));
  step(() => jest.advanceTimersByTime(1300));
  expect(getS().nn?.t).toBe('Scanned notes — History');
  step(() => dispatch('ntSave'));
  expect(getS().NT.history[0].t).toBe('Scanned notes — History');
  step(() => dispatch('ntAddGo', undefined, { value: 'Security' }));
  expect(getS().FOLDERS[getS().FOLDERS.length - 1]).toEqual(['Security', '#6C5DD3', 'x-Security']);
  step(() => dispatch('ntOptCus', undefined, { value: 'Medical Science' }));
  expect(getS().optional).toBe('Medical Science');
  expect(getS().OPTIONALS).toContain('Medical Science');
});
