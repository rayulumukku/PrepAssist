import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { go } from '../../navigation/nav';
import { getS, resetStore, setS } from '../../store';
import BookStage from './BookStage';
import { bookExit, bookNext, bookPrev, bookReplay, openBook } from './flow';

jest.useFakeTimers();

function collectText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(collectText).join(' ');
  if (typeof node === 'object') {
    if (Array.isArray(node.children)) {
      return node.children.map(collectText).join(' ');
    }
    if (node.props && node.props.children) {
      return collectText(node.props.children);
    }
  }
  return '';
}

describe('BookStage', () => {
  let activeTree: ReactTestRenderer.ReactTestRenderer | null = null;

  afterEach(() => {
    if (activeTree) {
      ReactTestRenderer.act(() => {
        activeTree?.unmount();
      });
      activeTree = null;
    }
  });

  beforeEach(() => {
    resetStore();
    go('book');
  });

  it('renders closed cover at step 0', () => {
    ReactTestRenderer.act(() => {
      activeTree = ReactTestRenderer.create(<BookStage />);
    });
    expect(getS().bkStep).toBe(0);
    const cover = activeTree!.root.findByProps({ testID: 'book.cover' });
    expect(cover).toBeDefined();
    const allText = collectText(activeTree!.toJSON());
    expect(allText).toContain('UPSC');
    expect(allText).toContain('2027');
    expect(allText).toContain('PRELIMS');
  });

  it('openBook transitions to step 1 and renders Notes page', () => {
    ReactTestRenderer.act(() => {
      openBook();
      activeTree = ReactTestRenderer.create(<BookStage />);
    });
    expect(getS().bkStep).toBe(1);
    expect(getS().bk.opened).toBe(true);

    const allText = collectText(activeTree!.toJSON());
    expect(allText).toContain('Notes');
    expect(allText).toContain('Faculty compendium');
  });

  it('bookNext advances through pages to Cloud Upload', () => {
    ReactTestRenderer.act(() => {
      openBook();
      bookNext();
      bookNext();
      bookNext();
      activeTree = ReactTestRenderer.create(<BookStage />);
    });
    expect(getS().bkStep).toBe(4);

    const allText = collectText(activeTree!.toJSON());
    expect(allText).toContain('Cloud Upload');
    expect(allText).toContain('Start preparing');
  });

  it('bookPrev navigates back to previous page', () => {
    ReactTestRenderer.act(() => {
      setS({ bkStep: 3 });
      bookPrev();
    });
    expect(getS().bkStep).toBe(2);
  });

  it('bookReplay resets book back to step 0', () => {
    ReactTestRenderer.act(() => {
      setS({ bkStep: 4 });
      bookReplay();
    });
    expect(getS().bkStep).toBe(0);
  });

  it('bookExit initiates exit sequence and navigates to auth', () => {
    ReactTestRenderer.act(() => {
      openBook();
      bookExit();
    });
    expect(getS().bk.exit).toBe(true);
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(600);
    });
    expect(getS().stage).toBe('auth');
  });
});
