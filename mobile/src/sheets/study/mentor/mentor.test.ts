// Tests of the mentor: reply routing against the HTML's own reply(), the markup parser, ctx(), and the
// openMentor / mentorAsk / ctxToggle flow with fake timers.
import fs from 'fs';
import path from 'path';
import { ARTICLES, QUIZ } from '../../../data';
import { getS, resetStore, setS } from '../../../store';
import { ctx, reply } from './mentorLogic';
import type { MentorCtx, MentorState } from './mentorLogic';
import { inlineText, parseAnswer } from './mentorMarkup';
import { ctxToggle, mentorAsk, mentorAskAct, mentorSend, openMentor } from './mentorFlow';
import type { MnView } from './mentorFlow';

const HTML = fs.readFileSync(path.join(__dirname, '../../../../../PrepAssist.html'), 'utf8').split('\n');
/** The HTML's reply() (L6882-L6906), evaluated with the given S. */
function htmlReply(S: MentorState): (q: string) => string {
  const src = HTML.slice(6881, 6906).join('\n');
  expect(src.startsWith('function reply(q) {')).toBe(true);
  // eslint-disable-next-line no-new-func
  return new Function('S', 'QUIZ', `${src}\nreturn reply;`)(S, QUIZ);
}
function htmlCtx(S: MentorState): MentorCtx {
  const src = HTML.slice(6833, 6845).join('\n');
  expect(src.startsWith('function ctx() {')).toBe(true);
  // eslint-disable-next-line no-new-func
  return new Function('S', 'QUIZ', 'ARTICLES', `${src}\nreturn ctx();`)(S, QUIZ, ARTICLES);
}

const QUESTIONS = [
  'Explain Article 32 simply.',
  'What is art 32?',
  'How should I revise Polity in 15 days?',
  'Why was my Mains answer weak?',
  'Rewrite my introduction',
  'Give me 3 similar questions',
  'Summarise this for Prelims',
  'What’s the Mains angle?',
  'Why is statement 3 wrong?',
  'Explain this question simply',
  'Tell me about <b>monsoon</b>',
  '',
];

describe('reply() routing equals the HTML', () => {
  const states: [string, MentorState][] = [
    ['home tab', { stack: [], tab: 'home', quiz: null }],
    ['article c1', { stack: [{ id: 'article', arg: 'c1' }], tab: 'current', quiz: null }],
    ['quiz q1', { stack: [{ id: 'quiz' }], tab: 'home', quiz: { i: 0 } }],
    ['quiz q3', { stack: [{ id: 'quiz' }], tab: 'home', quiz: { i: 2, showRes: false } }],
  ];
  for (const [name, st] of states) {
    test(name, () => {
      const S = { ...st, mctx: ctx(st) };
      const h = htmlReply(JSON.parse(JSON.stringify(S)));
      for (const q of QUESTIONS) expect(reply(q, S)).toBe(h(q));
    });
  }
});

describe('ctx() equals the HTML', () => {
  const cases: MentorState[] = [
    { stack: [], tab: 'home', quiz: null },
    { stack: [], tab: 'practice', quiz: null },
    { stack: [], tab: 'nowhere', quiz: null },
    { stack: [{ id: 'lesson' }], tab: 'learn', quiz: null },
    { stack: [{ id: 'mains' }], tab: 'learn', quiz: null },
    { stack: [{ id: 'article', arg: 'a3' }], tab: 'current', quiz: null },
    { stack: [{ id: 'quiz' }], tab: 'home', quiz: { i: 1, showRes: true } },
    { stack: [{ id: 'saved' }], tab: 'menu', quiz: null },
  ];
  test.each(cases.map(c => [JSON.stringify(c.stack) + c.tab, c]))('%s', (_n, c) => {
    expect(JSON.parse(JSON.stringify(ctx(c)))).toEqual(JSON.parse(JSON.stringify(htmlCtx(c))));
  });
});

describe('parseAnswer', () => {
  const S: MentorState = { stack: [], tab: 'home', quiz: null };
  test('Article 32 answer: blocks, table, chips', () => {
    const b = parseAnswer(reply('Explain Article 32 simply.', S));
    expect(b.map(x => x.t)).toEqual(['h5', 'p', 'p', 'table', 'p', 'acts']);
    const table = b[3] as Extract<(typeof b)[number], { t: 'table' }>;
    expect(table.rows).toHaveLength(6);
    expect(table.rows[0].map(c => c.th)).toEqual([true, true, true]);
    expect(inlineText(table.rows[5][2].c)).toBe('Someone holds a public office illegally');
    expect(b[5]).toEqual({ t: 'acts', chips: [{ act: 'quiz', label: 'Practise 10 questions' }, { act: 'push:mindmap', label: 'Open the mindmap' }] });
    const p1 = b[1] as Extract<(typeof b)[number], { t: 'p' }>;
    expect(inlineText(p1.c)).toBe(
      'If the State violates one of your Fundamental Rights, you can go straight to the Supreme Court — and that right to go is itself a Fundamental Right.',
    );
    expect(p1.c[1]).toEqual({ t: 'b', c: [{ t: 'text', s: 'straight to the Supreme Court' }] });
  });
  test('15-day plan: table rows, list, chips', () => {
    const b = parseAnswer(reply('How should I revise Polity in 15 days?', S));
    expect(b.map(x => x.t)).toEqual(['h5', 'p', 'table', 'ul', 'acts']);
  });
  test('styled p and src p', () => {
    expect(parseAnswer(reply('Rewrite my introduction', S))[1]).toMatchObject({
      t: 'p',
      style: 'font-family:var(--serif);font-size:16.5px;border-left:2px solid var(--rule-2);padding-left:12px',
    });
    const d = parseAnswer(reply('anything', S));
    expect(d[d.length - 1]).toMatchObject({ t: 'p', cls: 'src' });
  });
  test('escaped user text comes back as typed', () => {
    const d = parseAnswer(reply('a <b>x</b>', S));
    expect(inlineText((d[1] as Extract<(typeof d)[number], { t: 'p' }>).c)).toBe('Here’s how I’d approach “a <b>x</b>” for UPSC:');
  });
  test('unknown markup stays literal', () => {
    expect(parseAnswer('<span>x</span>')).toEqual([{ t: 'p', c: [{ t: 'text', s: '<span>x</span>' }] }]);
  });
});

describe('mentor flow', () => {
  beforeEach(() => {
    resetStore();
    jest.useFakeTimers();
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation(cb => setTimeout(() => cb(0), 0) as unknown as number);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  const view = (): MnView => getS().mnView as MnView;

  test('open shows the intro, ask types, answers after 900-1400 ms', async () => {
    openMentor();
    jest.advanceTimersByTime(1);
    expect(getS().sheet).toMatchObject({ key: 'mentor', tall: true, on: true });
    expect(view()).toMatchObject({ intro: true, chips: false, items: [] });
    expect((getS().mctx as MentorCtx).label).toBe('Today’s plan · Fundamental Rights');
    const done = mentorAsk('Explain Article 32 simply.');
    expect(view().intro).toBe(false);
    expect(view().items.map(i => i.k)).toEqual(['u', 'typing']);
    jest.advanceTimersByTime(899);
    expect(view().items.map(i => i.k)).toEqual(['u', 'typing']);
    jest.advanceTimersByTime(501);
    await done;
    expect(view().items.map(i => i.k)).toEqual(['u', 'a']);
    expect(view().items[1]).toMatchObject({ k: 'a', using: ' · using today’s plan' });
    expect(getS().mlog).toHaveLength(1);
  });

  test('reopen replays the log with the chips row; context off drops "using"', async () => {
    openMentor();
    jest.advanceTimersByTime(1);
    const d = mentorAsk('Explain Article 32 simply.');
    jest.advanceTimersByTime(1400);
    await d;
    ctxToggle();
    expect(getS().ctxOn).toBe(false);
    expect(getS().toast).toMatchObject({ msg: 'Context off — general answers', icon: null });
    openMentor();
    jest.advanceTimersByTime(1);
    expect(view()).toMatchObject({ intro: false, chips: true });
    expect(view().items.map(i => i.k)).toEqual(['u', 'a']);
    const d2 = mentorAsk('How should I revise Polity in 15 days?');
    expect(view().items.map(i => i.k)).toEqual(['u', 'a', 'u', 'typing']);
    jest.advanceTimersByTime(1400);
    await d2;
    expect(view().items[3]).toMatchObject({ k: 'a', using: '' });
  });

  test('A.mentorAsk opens the sheet with a prefill when the mentor is not showing', async () => {
    mentorAskAct('Why was my Mains answer weak?');
    jest.advanceTimersByTime(1);
    expect(view().intro).toBe(true);
    jest.advanceTimersByTime(350);
    expect(view().items.map(i => i.k)).toEqual(['u', 'typing']);
  });

  test('mentorSend sends the trimmed input and ignores blank input', () => {
    openMentor();
    jest.advanceTimersByTime(1);
    setS({ mnIn: '   ' });
    mentorSend();
    expect(view().items).toHaveLength(0);
    setS({ mnIn: '  hello ' });
    mentorSend();
    expect(getS().mnIn).toBe('');
    expect(view().items[0]).toEqual({ k: 'u', q: 'hello' });
  });
});
