// What the X-Ray handlers reach in the DOM of the open reader (x4Page(), L9949): scrolling to an insight
// (x4ScrollTo, L9956-L9961) and restarting its `.pulse` animation. The mounted reader registers itself here.

export interface ReaderApi {
  /** sc.scrollTo({ top: sc.scrollTop + mark.top - sc.top - 150, behavior: 'smooth' }) */
  scrollToInsight(i: number): void;
  /** m.classList.remove('pulse'); void m.offsetWidth; m.classList.add('pulse') */
  pulse(i: number): void;
}

let current: ReaderApi | null = null;

export function registerReader(api: ReaderApi | null): void {
  current = api;
}

export function reader(): ReaderApi | null {
  return current;
}
