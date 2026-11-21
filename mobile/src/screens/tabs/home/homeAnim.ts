// Source: PrepAssist.html L6010-L6015 (animateHome)
// Kept out of actions/tabs.ts so that screens can call it without importing an action file directly
// (actions/index.ts must load before the area files: it installs their shell hooks).
import { setS } from '../../../store';

/** animateHome(): 60 ms after the next frame the Home bars take their data-w / data-h. */
export function animateHome(): void {
  requestAnimationFrame(() =>
    setTimeout(() => {
      setS(s => ({ homeAnim: s.homeAnim + 1 }));
    }, 60),
  );
}
