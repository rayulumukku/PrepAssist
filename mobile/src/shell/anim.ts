// CSS transitions and one-shot keyframes of the shell, expressed with Reanimated timing animations:
// same duration, same cubic-bezier. A CSS transition restarts from the current value when its target
// changes mid-flight; withTiming does the same.
import { useEffect } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { EASE, EASE_CSS } from '../theme/tokens';

/** var(--ease) */
export const easeVar = Easing.bezier(EASE[0], EASE[1], EASE[2], EASE[3]);
/** the CSS keyword `ease` */
export const easeCss = Easing.bezier(EASE_CSS[0], EASE_CSS[1], EASE_CSS[2], EASE_CSS[3]);

type EasingFn = typeof easeVar;

/**
 * A value that follows `target` like a CSS transition: `transition: <prop> <ms> <easing>`.
 * The first render starts AT the target (no transition on mount, as in CSS). Under the OS
 * "reduce motion" setting Reanimated jumps to the end value (its default ReduceMotion.System), which
 * is what the HTML's prefers-reduced-motion rule does (L4654).
 */
export function useTransition(target: number, ms: number, easing: EasingFn = easeVar): SharedValue<number> {
  const v = useSharedValue(target);
  useEffect(() => {
    v.value = withTiming(target, { duration: ms, easing });
  }, [target, ms, easing, v]);
  return v;
}
