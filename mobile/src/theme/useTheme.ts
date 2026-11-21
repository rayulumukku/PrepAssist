// The plan theme, driven by the store's `planTheme` (html[data-plan] in the HTML, PrepAssist.html L10751).
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { palettes } from './tokens';
import type { Palette, Plan } from './tokens';

/** 'free' | 'pro' | 'ultimate': for the rules written as html[data-plan="…"] (planthemes, L10636-L10743). */
export function usePlan(): Plan {
  return useStore(s => s.planTheme);
}

/** The CSS custom properties of the current plan theme. */
export function useTheme(): Palette {
  return palettes[useStore(s => s.planTheme)];
}

export interface Insets {
  /** --sat: env(safe-area-inset-top) */
  sat: number;
  /** --sab: env(safe-area-inset-bottom) */
  sab: number;
}

/**
 * --sat / --sab (L29). The app draws edge to edge like the HTML (viewport-fit=cover) and each element
 * adds the inset exactly where its CSS does. In the test mode set by prepassist://insets/zero both
 * are 0, as in the reference capture.
 */
export function useInsets(): Insets {
  const i = useSafeAreaInsets();
  const zero = useStore(s => s.insetsMode === 'zero');
  return zero ? ZERO : { sat: i.top, sab: i.bottom };
}
const ZERO: Insets = { sat: 0, sab: 0 };
