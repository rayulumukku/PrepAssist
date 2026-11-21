// The tab scroll panes (#homeScroll … #profileScroll, PrepAssist.html L5077-L5082) as seen by the shell:
//   - renderAll attaches a scroll listener to each that drives the Ask button (L5991-L5998)
//   - A.tab resets the target pane's scrollTop to 0 (L6993)
// A tab screen attaches its ScrollView with useTabScroll(tab); see CONTRACT.md.
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { askOnScroll } from '../navigation/nav';
import type { TabId } from '../navigation/routes';

/** The part of a ScrollView instance the shell uses. */
export interface Scrollable {
  scrollTo(options: { x?: number; y?: number; animated?: boolean }): void;
}
const panes: Partial<Record<TabId, Scrollable | null>> = {};

/** `$('#t-' + x + ' .scroll').scrollTop = 0` */
export function resetTabScroll(tab: TabId): void {
  panes[tab]?.scrollTo({ y: 0, animated: false });
}

/** Scroll a tab pane (for handlers such as A.pxGo, L7019, or `scrollIntoView` ports). */
export function scrollTab(tab: TabId, y: number, animated = false): void {
  panes[tab]?.scrollTo({ y, animated });
}

export interface TabScrollProps {
  ref: (node: Scrollable | null) => void;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle: number;
  /** .scroll{scrollbar-width:none} (L76-L77) */
  showsVerticalScrollIndicator: false;
}

/**
 * Props for the tab's main ScrollView (the `.tabp > .scroll` element):
 *   const scroll = useTabScroll('home');
 *   <ScrollView {...scroll} contentContainerStyle={{ paddingBottom: 96 }}> … </ScrollView>
 * If the screen needs its own onScroll, call `scroll.onScroll(e)` from it.
 */
export function useTabScroll(tab: TabId): TabScrollProps {
  const state = useRef({ last: 0 }).current;
  const ref = useCallback(
    (node: Scrollable | null) => {
      panes[tab] = node;
    },
    [tab],
  );
  useEffect(
    () => () => {
      panes[tab] = null;
    },
    [tab],
  );
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      askOnScroll(e.nativeEvent.contentOffset.y, state);
    },
    [state],
  );
  return useMemo(
    () => ({ ref, onScroll, scrollEventThrottle: 16, showsVerticalScrollIndicator: false as const }),
    [ref, onScroll],
  );
}
