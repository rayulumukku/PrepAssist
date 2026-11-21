// Source: PrepAssist.html L7031 (A.planGo), L7034 (A.calDay), L2512 (.nt ruled background)
import { push } from '../../../navigation/nav';
import { getS, resetStore } from '../../../store';
import { handlers } from './handlers';
import { firstLine } from './RuledLines';

const topKey = (): number => getS().stack[getS().stack.length - 1].key;

describe('study pages handlers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetStore();
  });
  afterEach(() => jest.useRealTimers());

  it('calDay moves .on to the pressed day and dims the slots for 180 ms', () => {
    push('calendar');
    handlers.calDay(undefined, { index: 4 });
    expect(getS().calPage).toEqual({ key: topKey(), on: 4, dim: true });
    jest.advanceTimersByTime(179);
    expect(getS().calPage?.dim).toBe(true);
    jest.advanceTimersByTime(1);
    expect(getS().calPage).toEqual({ key: topKey(), on: 4, dim: false });
  });

  it('calDay without a page or an element does nothing', () => {
    handlers.calDay(undefined, { index: 2 });
    expect(getS().calPage).toBeNull();
    push('calendar');
    handlers.calDay(undefined, undefined);
    expect(getS().calPage).toBeNull();
  });

  it('planGo shows the spinner, then the result after 1400 ms', async () => {
    push('plan');
    const p = handlers.planGo(undefined) as Promise<void>;
    expect(getS().planPage).toEqual({ key: topKey(), step: 'busy' });
    jest.advanceTimersByTime(1399);
    expect(getS().planPage?.step).toBe('busy');
    jest.advanceTimersByTime(1);
    await p;
    expect(getS().planPage).toEqual({ key: topKey(), step: 'done' });
  });

  it('ruled lines start where the positioned repeating gradient draws its first line', () => {
    expect(firstLine(22, 34)).toBe(11); // .nt
    expect(firstLine(28, 14)).toBe(13); // .big-ta
  });
});
