// Tests of richTextCore.ts (grammar, literal rule, X-Ray grammar, margin collapsing) and of the
// RichText component. The grammar is checked against the ground truth twice: by hand-written cases
// for every tag of tools/reference/extract/out/markup-inventory.json, and by parsing the real data
// constants and comparing the node counts with the counts of that inventory.
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import inventory from '../../../tools/reference/extract/out/markup-inventory.json';
import { FLASH, MEGA, ANN, SKYLINE } from '../data/home';
import { INLINE_caFilter_L7596 } from '../data/inline';
import { LEGAL } from '../data/legal';
import { LX } from '../data/learn';
import { NOTESYS } from '../data/notes';
import { ANSWERBANK, MODEL } from '../data/practice';
import { COOP_UPS, NT } from '../data/tracker';
import { XSC } from '../data/xray';
import { Txt } from '../theme/Txt';
import { RichText } from './RichText';
import type { RichTextProps } from './RichText';
import { collapseMargins, parseRichText, parseXray, toPlainText, tokenize } from './richTextCore';
import type { BlockNode, FlowBox, InlineNode, RichNode } from './richTextCore';

const text = (s: string): InlineNode => ({ type: 'text', text: s });
const run = (...children: InlineNode[]): BlockNode => ({ type: 'run', children });
const b = (...children: InlineNode[]): InlineNode => ({ type: 'b', children });

describe('parseRichText: every tag of the inventory', () => {
  it('p', () => {
    expect(parseRichText('<p>One.</p><p>Two.</p>')).toEqual([
      { type: 'p', children: [text('One.')] },
      { type: 'p', children: [text('Two.')] },
    ]);
  });
  it('h4 and h5', () => {
    expect(parseRichText('<h4>Head</h4><h5>Sub</h5><p>Body</p>')).toEqual([
      { type: 'h4', children: [text('Head')] },
      { type: 'h5', children: [text('Sub')] },
      { type: 'p', children: [text('Body')] },
    ]);
  });
  it('b and i', () => {
    expect(parseRichText('a <b>bold</b> and <i>italic</i>.')).toEqual([
      run(text('a '), b(text('bold')), text(' and '), { type: 'i', children: [text('italic')] }, text('.')),
    ]);
  });
  it('ul, ol, li', () => {
    expect(parseRichText('<ul><li>x</li><li>y</li></ul><ol><li>z</li></ol>')).toEqual([
      { type: 'ul', children: [{ type: 'li', children: [run(text('x'))] }, { type: 'li', children: [run(text('y'))] }] },
      { type: 'ol', children: [{ type: 'li', children: [run(text('z'))] }] },
    ]);
  });
  it('the class of ul / ol, the one attribute that occurs', () => {
    const [ul, ol] = parseRichText('<ul class="lg-dl"><li>x</li></ul><ol class="lg-ol"><li>y</li></ol>');
    expect(ul).toMatchObject({ type: 'ul', className: 'lg-dl' });
    expect(ol).toMatchObject({ type: 'ol', className: 'lg-ol' });
  });
  it('br is a node inside the running text, and the space around it goes', () => {
    expect(parseRichText('<p>one. <br> <b>two:</b> three</p>')).toEqual([
      { type: 'p', children: [text('one.'), { type: 'br' }, b(text('two:')), text(' three')] },
    ]);
  });
  it('nesting: b inside li inside ul', () => {
    expect(parseRichText('<ul><li><b>Term</b> meaning</li></ul>')).toEqual([
      { type: 'ul', children: [{ type: 'li', children: [run(b(text('Term')), text(' meaning'))] }] },
    ]);
  });
  it('blocks inside li: the text before a nested list is its own run', () => {
    expect(parseRichText('<ul><li>outer<ul><li>inner</li></ul></li></ul>')).toEqual([
      {
        type: 'ul',
        children: [{ type: 'li', children: [run(text('outer')), { type: 'ul', children: [{ type: 'li', children: [run(text('inner'))] }] }] }],
      },
    ]);
  });
  it('elements still open at the end are closed there', () => {
    expect(parseRichText('<p>open <b>bold')).toEqual([{ type: 'p', children: [text('open '), b(text('bold'))] }]);
  });
});

describe('parseRichText: entities', () => {
  it('decodes &amp; and only &amp;', () => {
    expect(toPlainText(parseRichText('S&amp;T, security'))).toBe('S&T, security');
    expect(toPlainText(parseRichText('a&nbsp;b &lt;c&gt; &#39;d&#39; &AMP; e & f &amp g'))).toBe('a&nbsp;b &lt;c&gt; &#39;d&#39; &AMP; e & f &amp g');
  });
  it('does not decode twice', () => {
    expect(toPlainText(parseRichText('&amp;amp; &amp;lt;'))).toBe('&amp; &lt;');
  });
});

describe('parseRichText: what the inventory does not list stays literal text', () => {
  const literal = (s: string): void => expect(parseRichText(s)).toEqual([run(text(s))]);
  it('unknown tags', () => {
    literal('<span>x</span>');
    literal('<a href="#">x</a>');
    literal('<h1>x</h1>');
    literal('<div class="k">x</div>');
  });
  it('known names in a spelling that never occurs', () => {
    literal('<B>x</B>');
    literal('one<br/>two');
    literal('one<br />two');
    literal('<b style="color:red">x</b>'); // the unmatched </b> stays as well
    literal('<p class="x">y</p>');
    literal('<ul id="x">y</ul>');
  });
  it('keeps the literal tag inside the surrounding text of a known element', () => {
    expect(parseRichText('<p>a <em>b</em> c</p>')).toEqual([{ type: 'p', children: [text('a <em>b</em> c')] }]);
  });
  it('a closing tag that does not close the innermost open element', () => {
    literal('x</p>');
    expect(parseRichText('<p>a<b>b</p>c')).toEqual([{ type: 'p', children: [text('a'), b(text('b</p>c'))] }]);
  });
  it('a tag where its parent cannot hold it', () => {
    literal('<li>x</li>'); // li outside a list
    expect(parseRichText('<b><p>x</b>')).toEqual([run(b(text('<p>x')))]); // block inside inline
    expect(parseRichText('<p><ul>x</p>')).toEqual([{ type: 'p', children: [text('<ul>x')] }]);
  });
  it('plain comparison signs and ampersands', () => {
    literal('if a < b and b > c then R&D');
  });
});

describe('parseRichText: svg is detected and kept opaque', () => {
  const svg = '<svg viewBox="0 0 10 10"><g fill="none"><rect x="1" y="1" width="2" height="2"/><text x="1" y="2">A&amp;B</text></g></svg>';
  it('one svg element is one node with its raw markup', () => {
    expect(parseRichText(svg)).toEqual([{ type: 'svg', markup: svg, fragment: false }]);
  });
  it('between blocks', () => {
    expect(parseRichText(`<p>a</p>${svg}<p>b</p>`).map(n => n.type)).toEqual(['p', 'svg', 'p']);
  });
  it('nested svg closes at the matching tag', () => {
    const nested = '<svg><svg><path d="M0 0"/></svg><circle cx="1" cy="1" r="1"/></svg>';
    expect(parseRichText(`${nested}tail`)).toEqual([{ type: 'svg', markup: nested, fragment: false }, run(text('tail'))]);
  });
  it('bare svg elements (LX[*].art) are one fragment node', () => {
    const frag = '<g fill="#fff"><rect x="6" y="8" width="11" height="11"/></g> <circle cx="1" cy="1" r="1"/>';
    expect(parseRichText(frag)).toEqual([{ type: 'svg', markup: frag, fragment: true }]);
  });
  it('an svg element that never closes is literal text', () => {
    expect(parseRichText('<svg viewBox="0 0 1 1"><rect>')).toEqual([run(text('<svg viewBox="0 0 1 1"><rect>'))]);
  });
  it('inside an inline container it is literal text', () => {
    expect(parseRichText('<p>x<svg></svg></p>')).toEqual([{ type: 'p', children: [text('x<svg></svg>')] }]);
  });
  it('tokenize leaves the markup of the svg untouched, entity included', () => {
    expect(tokenize(svg)).toEqual([{ kind: 'svg', markup: svg, fragment: false }]);
  });
});

describe('parseRichText: white space is that of white-space: normal', () => {
  it('collapses runs, trims block edges, drops white space between blocks', () => {
    expect(parseRichText('<p> a \n  b <b> c </b> d </p>\n  <p>e</p>\n')).toEqual([
      { type: 'p', children: [text('a b '), b(text('c ')), text('d')] },
      { type: 'p', children: [text('e')] },
    ]);
  });
  it('keeps U+00A0', () => {
    expect(toPlainText(parseRichText('a  b'))).toBe('a  b');
  });
});

describe('plain text round trip', () => {
  it.each(['Just a sentence.', 'Polity, governance, IR', 'गणतंत्र दिवस 2026', '5 < 7 > 3, {{not xray}} [[0|here]]', '100% — “quoted” · R&D'])('%s', s => {
    expect(parseRichText(s)).toEqual([run(text(s))]);
    expect(toPlainText(parseRichText(s))).toBe(s);
  });
  it('the empty string is no node', () => {
    expect(parseRichText('')).toEqual([]);
    expect(toPlainText([])).toBe('');
  });
  it('toPlainText: br and block boundaries are line breaks', () => {
    expect(toPlainText(parseRichText('<h5>T</h5><p>a<br>b</p><ul><li>x</li><li><b>y</b> z</li></ul>'))).toBe('T\na\nb\nx\ny z');
  });
});

describe('parseXray', () => {
  const ins = (n: number, ...children: InlineNode[]): InlineNode => ({ type: 'insight', n, children });
  const term = (t: string): InlineNode => ({ type: 'term', term: t });
  it('several spans in one paragraph, terms inside and outside an insight', () => {
    expect(parseXray('Lead. [[0|First ({{BITs}}) and ({{FTAs}}).]] Middle {{ISDS}} text [[12|second.]] End.')).toEqual([
      {
        type: 'p',
        children: [
          text('Lead. '),
          ins(0, text('First ('), term('BITs'), text(') and ('), term('FTAs'), text(').')),
          text(' Middle '),
          term('ISDS'),
          text(' text '),
          ins(12, text('second.')),
          text(' End.'),
        ],
      },
    ]);
  });
  it('a paragraph without markers is one text', () => {
    expect(parseXray('No markers here.')).toEqual([{ type: 'p', children: [text('No markers here.')] }]);
    expect(parseXray('')).toEqual([]);
  });
  it('the insight text runs lazily to the first ]]; insights do not nest', () => {
    expect(parseXray('[[0|a [[1|b]] c]]')).toEqual([{ type: 'p', children: [ins(0, text('a [[1|b')), text(' c]]')] }]);
  });
  it('what is not a span stays literal', () => {
    const keep = (s: string): void => expect(parseXray(s)).toEqual([{ type: 'p', children: [text(s)] }]);
    keep('[[x|not a number]]');
    keep('[[3 no bar]]');
    keep('[[4|never closed');
    keep('{{never closed');
    keep('{{}}');
  });
  it('does not contain the HTML subset: tags and entities are literal characters', () => {
    expect(parseXray('<b>x</b> &amp; <br>')).toEqual([{ type: 'p', children: [text('<b>x</b> &amp; <br>')] }]);
  });
  it('toPlainText is `plain` (L9857) without the insight brackets', () => {
    expect(toPlainText(parseXray('[[0|The ({{BITs}}) text.]] More.'))).toBe('The (BITs) text. More.');
  });
});

describe('collapseMargins', () => {
  const box = (marginTop: number, marginBottom: number, children: FlowBox[] = [], sealed = false): FlowBox => ({
    marginTop,
    marginBottom,
    sealedTop: sealed,
    sealedBottom: sealed,
    children,
  });
  const margins = (x: FlowBox): number[] => [x.marginTop, x.marginBottom];
  it('siblings: the larger margin, carried by the lower box', () => {
    const boxes = [box(0, 12), box(4, 4), box(0, 12)]; // .lg-sec p, h4, p
    collapseMargins(boxes);
    expect(boxes.map(margins)).toEqual([
      [0, 0],
      [12, 0],
      [4, 12],
    ]);
  });
  it('a parent without padding takes the margin of its first child', () => {
    const items = [box(5, 0), box(5, 0)]; // .n2-ub li{margin-top:5px}
    const list = box(6, 0, items); // .n2-ub ul{margin-top:6px}
    const boxes = [box(6, 0), list];
    collapseMargins(boxes);
    expect(margins(list)).toEqual([6, 0]);
    expect(items.map(margins)).toEqual([
      [0, 0],
      [5, 0],
    ]);
  });
  it('and of its last child', () => {
    const items = [box(0, 5), box(0, 5)]; // .msg-a li{margin-bottom:5px}
    const list = box(0, 10, items); // .msg-a ul{margin-bottom:10px}
    collapseMargins([list]);
    expect(margins(list)).toEqual([0, 10]);
    expect(items.map(margins)).toEqual([
      [0, 0],
      [5, 0],
    ]);
  });
  it('padding or a border keeps the margins of the children inside', () => {
    const child = box(8, 8);
    const parent = box(2, 2, [child], true);
    collapseMargins([parent]);
    expect(margins(parent)).toEqual([2, 2]);
    expect(margins(child)).toEqual([8, 8]);
  });
  it('negative margins: sum with a positive one, the most negative of two', () => {
    const one = [box(0, 12), box(-4, 0)];
    collapseMargins(one);
    expect(one[1].marginTop).toBe(8);
    const two = [box(0, -3), box(-5, 0)];
    collapseMargins(two);
    expect(two[1].marginTop).toBe(-5);
  });
});

describe('the real data', () => {
  const strings = (v: unknown, out: string[] = []): string[] => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(x => strings(x, out));
    else if (v && typeof v === 'object') Object.values(v).forEach(x => strings(x, out));
    return out;
  };
  const count = (nodes: readonly RichNode[], seen: Record<string, number>, texts: string[]): void => {
    for (const n of nodes) {
      seen[n.type] = (seen[n.type] ?? 0) + 1;
      if (n.type === 'text') texts.push(n.text);
      if ('children' in n) count(n.children, seen, texts);
    }
  };

  it('parses to exactly the tags the inventory counted, with no markup left in the text', () => {
    // Every constant that holds one of the HTML tags (inventory.fields).
    const all = strings([FLASH, NOTESYS, ANSWERBANK, MODEL, LEGAL, COOP_UPS, NT, INLINE_caFilter_L7596]);
    const seen: Record<string, number> = {};
    const texts: string[] = [];
    for (const s of all) count(parseRichText(s), seen, texts);
    for (const tag of ['p', 'li', 'b', 'h5', 'ul', 'i', 'h4', 'br', 'ol'] as const) {
      expect([tag, seen[tag]]).toEqual([tag, inventory.tags[tag].count]);
    }
    expect(texts.filter(t => /<\/?[a-zA-Z]|&[a-zA-Z#][a-zA-Z0-9]*;/.test(t))).toEqual([]);
    expect(texts.some(t => t.includes('S&T'))).toBe(true);
  });

  it('keeps the classes of the legal lists', () => {
    const classes: string[] = [];
    const walk = (nodes: readonly BlockNode[]): void => {
      for (const n of nodes) {
        if (n.type === 'ul' || n.type === 'ol') classes.push(`${n.type}.${n.className ?? ''}`);
        if (n.type === 'ul' || n.type === 'ol' || n.type === 'li') walk(n.children);
      }
    };
    strings(LEGAL).forEach(s => walk(parseRichText(s)));
    expect(classes.sort()).toEqual(['ol.lg-ol', 'ul.lg-dl', 'ul.lg-ul', 'ul.lg-ul', 'ul.lg-ul']);
  });

  it('exposes each illustration string as one svg node', () => {
    for (const s of [MEGA, SKYLINE, ...Object.values(ANN).map(a => a.art)]) {
      expect(parseRichText(s)).toEqual([{ type: 'svg', markup: s.trim(), fragment: false }]);
    }
    for (const lx of LX) expect(parseRichText(lx.art)).toEqual([{ type: 'svg', markup: lx.art.trim(), fragment: true }]);
  });

  it('X-Ray paragraphs match the statistics of the inventory', () => {
    const stats = { paragraphs: 0, insightSpans: 0, termSpans: 0, termsInsideInsight: 0 };
    const walk = (nodes: readonly InlineNode[], inside: boolean): void => {
      for (const n of nodes) {
        if (n.type === 'insight') {
          stats.insightSpans++;
          walk(n.children, true);
        } else if (n.type === 'term') {
          stats.termSpans++;
          if (inside) stats.termsInsideInsight++;
        } else if (n.type === 'text') {
          expect(n.text).not.toMatch(/\[\[|\]\]|\{\{|\}\}/);
        }
      }
    };
    for (const sc of XSC) {
      for (const para of sc.paras) {
        const [p] = parseXray(para);
        stats.paragraphs++;
        if (p.type === 'p') walk(p.children, false);
        for (const n of p.type === 'p' ? p.children : []) {
          if (n.type === 'insight') expect(n.n).toBeLessThan(sc.ins.length);
        }
      }
      // every term span is a key of the scan's glossary
      const terms = sc.paras.flatMap(para => [...para.matchAll(/\{\{(.+?)\}\}/g)].map(m => m[1]));
      for (const t of terms) expect(Object.keys(sc.terms)).toContain(t);
    }
    const x = inventory.xrayMarkup.stats;
    expect(stats).toEqual({ paragraphs: x.paragraphs, insightSpans: x.insightSpans, termSpans: x.termSpans, termsInsideInsight: x.termsInsideInsight });
  });
});

describe('<RichText>', () => {
  type Json = ReactTestRenderer.ReactTestRendererJSON;
  const render = async (props: RichTextProps): Promise<ReactTestRenderer.ReactTestRenderer> => {
    let r!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      r = ReactTestRenderer.create(React.createElement(RichText, props));
    });
    return r;
  };
  const flat = (style: unknown): Record<string, unknown> => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
  /** The text of a rendered node, the way it reads on screen. */
  const shown = (n: Json | string | null | (Json | string)[]): string => {
    if (n === null) return '';
    if (typeof n === 'string') return n;
    if (Array.isArray(n)) return n.map(shown).join('');
    return (n.children ?? []).map(shown).join(n.type === 'View' ? '|' : '');
  };
  const txt = (r: ReactTestRenderer.ReactTestRenderer, testID: string): ReactTestRenderer.ReactTestInstance =>
    r.root.findAll(n => n.type === Txt && n.props.testID === testID)[0];
  const faceOf = (r: ReactTestRenderer.ReactTestRenderer, word: string): unknown =>
    flat(r.root.findAll(n => n.type === Txt && shown(n.props.children as string) === word)[0]?.props.style).fontFamily;

  it('blocks are Views, the inline content of a block is one Txt, b / i switch the face', async () => {
    const r = await render({ html: '<p>a <b>bold</b> <i>it</i><br>next</p><ul><li>x</li><li><b>y</b> z</li></ul>', testID: 'rt' });
    const root = r.toJSON() as Json;
    expect(root.type).toBe('View');
    expect(root.props.testID).toBe('rt');
    expect(shown(root)).toBe('a bold it\nnext|•|x|•|y z');
    const [p, ul] = root.children as Json[];
    expect(p.children).toHaveLength(1); // one Text for the whole paragraph
    expect((ul.children as Json[]).map(li => li.type)).toEqual(['View', 'View']);
    expect(faceOf(r, 'bold')).toBe('Inter-Bold');
    expect(faceOf(r, 'it')).toBe('Inter-Italic');
    expect(JSON.stringify(root)).not.toContain('fontWeight');
  });

  it('styles come from the map: text inherits downwards, ol items count, markers follow `bullet`', async () => {
    const r = await render({
      html: '<ol><li>one</li><li>two</li></ol><ul><li><b>three</b></li></ul>',
      styles: { base: { color: '#111111', fontSize: 14 }, li: { color: '#222222', paddingLeft: 24 }, b: { fontFamily: 'EBGaramond-SemiBold' }, olLi: { paddingLeft: 32 } },
      bullet: (k, ordered) => (ordered ? `(${k + 1})` : '-'),
    });
    const root = r.toJSON() as Json;
    expect(shown(root)).toBe('(1)|one|(2)|two|-|three');
    const [ol, ul] = root.children as Json[];
    const li = (ol.children as Json[])[0];
    expect(flat(li.props.style)).toMatchObject({ paddingLeft: 32 });
    expect(flat((ul.children as Json[])[0].props.style)).toMatchObject({ paddingLeft: 24 });
    expect(flat(li.props.style).color).toBeUndefined(); // text properties do not go to the View
    const content = (li.children as Json[])[1];
    expect(flat(content.props.style)).toMatchObject({ color: '#222222', fontSize: 14 });
    expect(faceOf(r, 'three')).toBe('EBGaramond-SemiBold');
  });

  it('default markers: the disc and "1.", hanging outside the item', async () => {
    const r = await render({ html: '<ul><li>x</li></ul><ol><li>y</li></ol>' });
    const root = r.toJSON() as Json;
    expect(shown(root)).toBe('•|x|1.|y');
    const marker = (((root.children as Json[])[0].children as Json[])[0].children as Json[])[0];
    expect(flat(marker.props.style)).toMatchObject({ position: 'absolute', right: '100%' });
  });

  it('a marker style with a position replaces the default placement; bullet "" draws the box alone', async () => {
    const r = await render({
      html: '<ul><li>x</li></ul>',
      bullet: '',
      styles: { marker: { left: 6, top: 15, width: 6, height: 6, borderRadius: 3, backgroundColor: '#1B8AD3' } },
    });
    const li = ((r.toJSON() as Json).children as Json[])[0].children as Json[];
    const marker = (li[0].children as Json[])[0];
    expect(marker.type).toBe('View');
    expect(marker.children).toBeNull();
    const style = flat(marker.props.style);
    expect(style).toMatchObject({ position: 'absolute', left: 6, top: 15, width: 6, backgroundColor: '#1B8AD3' });
    expect(style.right).toBeUndefined();
  });

  it('margins come from the map and collapse like CSS; first-child rules apply', async () => {
    // .n2-ub (L10135-L10141)
    const r = await render({
      html: '<h5>Head</h5><p>Text</p><ul><li>a</li><li>b</li></ul><h5>Next</h5>',
      styles: { h5: { marginTop: 14 }, first: { h5: { marginTop: 0 } }, p: { marginTop: 6 }, ul: { paddingLeft: 18, marginTop: 6 }, li: { marginTop: 5 } },
    });
    const [h5, p, ul, h5b] = (r.toJSON() as Json).children as Json[];
    const top = (n: Json): unknown => flat(n.props.style).marginTop;
    expect([top(h5), top(p), top(ul), top(h5b)]).toEqual([0, 6, 6, 14]);
    expect((ul.children as Json[]).map(top)).toEqual([0, 5]);
    expect(flat(ul.props.style).paddingLeft).toBe(18);
  });

  it('unknown markup is shown as written', async () => {
    const r = await render({ html: '<p>a <em>b</em> &nbsp; c</p>' });
    expect(shown(r.toJSON() as Json)).toBe('a <em>b</em> &nbsp; c');
  });

  it('svg: nothing without renderSvg, the caller’s element with it', async () => {
    const html = '<p>a</p><svg viewBox="0 0 1 1"></svg><p>b</p><svg viewBox="0 0 2 2"></svg>';
    expect(shown((await render({ html })).toJSON() as Json)).toBe('a|b');
    const calls: [string, number][] = [];
    const r = await render({
      html,
      renderSvg: (markup, index) => {
        calls.push([markup, index]);
        return React.createElement(Txt, null, `svg${index}`);
      },
    });
    expect(shown(r.toJSON() as Json)).toBe('a|svg0|b|svg1');
    expect(calls).toEqual([
      ['<svg viewBox="0 0 1 1"></svg>', 0],
      ['<svg viewBox="0 0 2 2"></svg>', 1],
    ]);
  });

  it('renderBlock takes over one block and leaves the rest', async () => {
    const r = await render({
      html: '<p>Intro</p><ul class="lg-dl"><li><b>Account</b> A unique account.</li></ul>',
      renderBlock: node => (node.type === 'ul' && node.className === 'lg-dl' ? React.createElement(Txt, null, `dl:${toPlainText(node.children)}`) : undefined),
    });
    expect(shown(r.toJSON() as Json)).toBe('Intro|dl:Account A unique account.');
  });

  it('X-Ray: spans are pressable, the active and per-insight styles apply, the pin comes first', async () => {
    const onInsight = jest.fn();
    const onTerm = jest.fn();
    const r = await render({
      xray: 'Lead [[0|one ({{BITs}})]] and [[1|two]] {{ISDS}}.',
      testID: 'x',
      styles: { p: { marginBottom: 14, fontSize: 17 }, insight: { backgroundColor: '#FFE89A' }, term: { color: '#0A66C2' } },
      onInsight,
      onTerm,
      activeInsight: 1,
      insightActiveStyle: { backgroundColor: '#FFF1BF' },
      insightStyle: n => (n === 0 ? { backgroundColor: '#F3EBCB' } : undefined),
      renderPin: n => `${n + 1} `,
    });
    const root = r.toJSON() as Json;
    expect(shown(root)).toBe('Lead 1 one (BITs) and 2 two ISDS.');
    const p = (root.children as Json[])[0];
    expect(flat(p.props.style)).toMatchObject({ marginBottom: 14 });
    expect(p.children).toHaveLength(1);
    expect(flat(txt(r, 'x.insight.0').props.style).backgroundColor).toBe('#F3EBCB');
    expect(flat(txt(r, 'x.insight.1').props.style).backgroundColor).toBe('#FFF1BF');
    expect(flat(txt(r, 'x.term.BITs').props.style).color).toBe('#0A66C2');
    await ReactTestRenderer.act(() => {
      txt(r, 'x.insight.1').props.onPress();
      txt(r, 'x.term.BITs').props.onPress();
      txt(r, 'x.term.ISDS').props.onPress();
    });
    expect(onInsight.mock.calls).toEqual([[1]]);
    expect(onTerm.mock.calls).toEqual([['BITs'], ['ISDS']]);
  });

  it('renders every markup string of the data without throwing', async () => {
    for (const sec of [...LEGAL.privacy.secs, ...LEGAL.terms.secs]) await render({ html: sec[1] });
    await render({ html: MODEL });
    for (const sc of XSC) for (const xray of sc.paras) await render({ xray });
  });
});
