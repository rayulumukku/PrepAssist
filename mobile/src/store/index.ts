// The app store: one flat object like the prototype's `S` (PrepAssist.html L5126), split into a base
// slice (shell) and one slice per workstream. FROZEN: add fields in your own slice file, not here.
//
//   useStore(s => s.tab)            subscribe in components (always through a selector)
//   getS()                          read inside handlers, like reading `S`
//   setS({ fc: 2 })                 write; pass NEW objects/arrays/Sets (S.saved.add(id) in the HTML
//   setS(s => ({ pages: s.pages + 1 }))   becomes setS(s => ({ saved: new Set(s.saved).add(id) })))
import { create } from 'zustand';
import { createInitialState } from '../data/initialState';
import { isoD, today } from '../env/clock';
import type { Plan } from '../theme/tokens';
import { createAccountSlice } from './slices/account';
import type { AccountSlice } from './slices/account';
import { createArrivalSlice } from './slices/arrival';
import type { ArrivalSlice } from './slices/arrival';
import { createBaseSlice } from './slices/base';
import type { BaseSlice } from './slices/base';
import { createLibrarySlice } from './slices/library';
import type { LibrarySlice } from './slices/library';
import { createPracticeSlice } from './slices/practice';
import type { PracticeSlice } from './slices/practice';
import { createStudySlice } from './slices/study';
import type { StudySlice } from './slices/study';
import { createTabsSlice } from './slices/tabs';
import type { TabsSlice } from './slices/tabs';

export type AppState = BaseSlice & ArrivalSlice & TabsSlice & PracticeSlice & StudySlice & LibrarySlice & AccountSlice;

const PLAN_VALUES: readonly string[] = ['free', 'pro', 'ultimate'];

/** A fresh state, as the page is when its last script has run (no stage yet). */
export function createAppState(): AppState {
  // L7104: S.ca.date = isoD(TODAY)
  const seed = createInitialState({ 'ca.date': isoD(today()) });
  // L10752: setPlanTheme(S.me.plan || 'free')
  const planTheme: Plan = PLAN_VALUES.includes(seed.me.plan) ? (seed.me.plan as Plan) : 'free';
  return {
    ...createBaseSlice(seed, planTheme),
    ...createArrivalSlice(seed),
    ...createTabsSlice(seed),
    ...createPracticeSlice(seed),
    ...createStudySlice(seed),
    ...createLibrarySlice(seed),
    ...createAccountSlice(seed),
  };
}

export const useStore = create<AppState>()(() => createAppState());

/** Read the current state (the prototype's `S`). */
export const getS = (): AppState => useStore.getState();

/** Merge a partial state. Never mutate what getS() returns. */
export const setS = (partial: Partial<AppState> | ((s: AppState) => Partial<AppState>)): void => {
  useStore.setState(partial);
};

/** Tests and the clock deep link: back to the load-time state (a page reload in the HTML). */
export function resetStore(): void {
  useStore.setState(createAppState(), true);
}

export type { BaseSlice, LayerPage, SheetState, StackEntry, ToastState } from './slices/base';
export type { AccountSlice, ArrivalSlice, LibrarySlice, PracticeSlice, StudySlice, TabsSlice };
