// Source: PrepAssist.html L2110-L2111 (.vig transition), L3886 (.vig > *{transition:opacity .6s var(--ease),transform .7s var(--ease)})
// Source: PrepAssist.html L5896-L5907 (setIntro: the vignettes switch class; on a fresh entry the stage was display:none)
// A value that follows a class switch the way a CSS transition does, with the transition-delay of the
// rule that applies in each direction. When `fresh` changes (go('intro') -> setIntro(0, true)), the
// stage has just become visible: no transition runs and the value jumps, as in a browser.
import { useEffect, useRef } from 'react';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { easeVar } from '../../shell/anim';

type EasingFn = typeof easeVar;

export function useClassTransition(
  target: number,
  ms: number,
  easing: EasingFn,
  delayIn: number,
  delayOut: number,
  fresh: number,
): SharedValue<number> {
  const v = useSharedValue(target);
  const lastFresh = useRef(fresh);
  const lastTarget = useRef(target);
  useEffect(() => {
    if (fresh !== lastFresh.current) {
      lastFresh.current = fresh;
      lastTarget.current = target;
      v.value = target;
      return;
    }
    if (target === lastTarget.current) return;
    const delay = target > lastTarget.current ? delayIn : delayOut;
    lastTarget.current = target;
    v.value = delay > 0 ? withDelay(delay, withTiming(target, { duration: ms, easing })) : withTiming(target, { duration: ms, easing });
  }, [target, fresh, ms, easing, delayIn, delayOut, v]);
  return v;
}
