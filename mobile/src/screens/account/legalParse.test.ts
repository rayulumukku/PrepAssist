import { LEGAL } from '../../data/legal';
import { parseLegal } from './legalParse';

test('every LEGAL section body parses without losing text', () => {
  for (const k of ['privacy', 'terms'] as const) {
    for (const [, html] of LEGAL[k].secs) {
      const blocks = parseLegal(html);
      expect(blocks.length).toBeGreaterThan(0);
      const text = JSON.stringify(blocks);
      const plain = html.replace(/<[^>]+>/g, ' ');
      for (const word of plain
        .split(/\s+/)
        .filter(w => w.length > 3 && !w.includes('&'))) {
        expect(text).toContain(word.replace(/"/g, '\\"'));
      }
    }
  }
});

test('lists keep their class and bold runs', () => {
  const b = parseLegal(
    '<p>You agree:</p><ol class="lg-ol"><li>One</li><li>Two</li></ol><ul class="lg-dl"><li><b>Account</b> A thing.</li></ul>',
  );
  expect(b[0]).toEqual({ t: 'p', runs: [{ text: 'You agree:', b: false }] });
  expect(b[1]).toEqual({
    t: 'lg-ol',
    items: [[{ text: 'One', b: false }], [{ text: 'Two', b: false }]],
  });
  expect(b[2]).toEqual({
    t: 'lg-dl',
    items: [
      [
        { text: 'Account', b: true },
        { text: ' A thing.', b: false },
      ],
    ],
  });
});
