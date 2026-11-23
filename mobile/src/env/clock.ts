// The prototype reads the clock in many places (TODAY L7092, dateLine L6023, the Home greeting, the quiz
// timer). All of them go through here so a test can pin the time the reference pack was captured at
// (reference/index.json fixedClock: 2026-10-24T09:41:00+05:30) with the deep link
// prepassist://clock/<ISO date-time>. Without an override this is the device clock.

let offsetMs = 0;

/** `new Date()` of the HTML. */
export function now(): Date {
  return new Date(Date.now() + offsetMs);
}

/** `Date.now()` of the HTML. */
export function nowMs(): number {
  return Date.now() + offsetMs;
}

/** TODAY (L7092): local midnight of the current day. */
export function today(): Date {
  const d = now();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** isoD (L7093): local date as YYYY-MM-DD. */
export function isoD(d: Date): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/** parseD (L7094) */
export function parseD(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Test only: make now() return `iso` at the moment of the call and keep running from there. null = device clock. */
export function setClockOverride(iso: string | null): boolean {
  if (iso === null) {
    offsetMs = 0;
    return true;
  }
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  offsetMs = t - Date.now();
  return true;
}

export function clockOverridden(): boolean {
  return offsetMs !== 0;
}
