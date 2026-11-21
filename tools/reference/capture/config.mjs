// Shared configuration for the PrepAssist.html reference capture.
// Everything here is read-only observation of the prototype: nothing in this
// tool edits PrepAssist.html, injects CSS, or disables animations.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(here, '..', '..', '..');
export const HTML_PATH = path.join(REPO_ROOT, 'PrepAssist.html');
export const HTML_URL = pathToFileURL(HTML_PATH).href;
export const OUT_ROOT = path.join(REPO_ROOT, 'reference');

// The prototype hard-codes "today = 24" in an October grid whose 1st is a
// Thursday (calDays(), L6458) and its ledger ends on 24 Oct, so the mock data
// is written for Saturday 24 October 2026. 09:41 gives the "Good morning"
// greeting and the "morning" sky phase.
export const FIXED_TIME_ISO = '2026-10-24T09:41:00+05:30';
export const TIMEZONE = 'Asia/Kolkata';
export const LOCALE = 'en-IN';

export const VIEWPORTS = {
  android: { width: 412, height: 915, deviceScaleFactor: 2.625 },
  // iPhone 17 simulator: screenshots are 1206 x 2622 px = 402 x 874 pt at 3x
  ios: { width: 402, height: 874, deviceScaleFactor: 3 },
};

// Why isMobile is false: line 4 of PrepAssist.html decides "framed" (desktop
// device frame) with matchMedia('(min-width:640px)') in a <head> script that
// runs BEFORE the <meta name="viewport"> tag is parsed. Under Chromium mobile
// emulation the layout viewport is still the 980px fallback at that moment,
// so the page frames itself (measured: innerWidth 981 at that point). With
// isMobile:false the viewport is the real CSS width from the first byte, and
// hasTouch:true makes (hover:hover) and (pointer:fine) false, so the page
// takes its unframed full-bleed phone layout. capture.mjs asserts this.
export const CONTEXT_BASE = {
  isMobile: false,
  hasTouch: true,
  locale: LOCALE,
  timezoneId: TIMEZONE,
  reducedMotion: 'no-preference',
  colorScheme: 'light',
};

export const WEB_FONTS = ['EB Garamond', 'Inter Tight', 'Inter', 'Noto Sans Devanagari', 'Caveat'];

// Default fake-clock advance after every action step (ms). Long enough for the
// page's own short timers (double rAF for .in, 60-420 ms setTimeouts), short
// enough not to expire a toast (2400 ms) or auto-advance the hero (6000 ms).
export const STEP_FAKE_MS = 600;
// Extra real-time wait applied when a screen has infinite (ambient) animations.
export const AMBIENT_SETTLE_MS = 400;
// Fraction of the scroll container's height stepped per scroll-NN.png.
export const SCROLL_STEP = 0.8;
