// Source: PrepAssist.html L31-L31 (*{margin:0;padding:0}), L9857-L9859 (plain, insText, termCount), L9893-L9896 (x4Para)
// Pure logic of RichText: no React, no React Native. Three things live here.
//
// 1. parseRichText(html): the HTML subset found inside the DATA strings, as a typed node tree.
//    Ground truth is tools/reference/extract/out/markup-inventory.json. Accepted, and nothing more:
//      <b> <i> <p> <li> <h4> <h5> <ul> <ol>   lower case, no attributes, with their closing tags
//      <ul class="…"> <ol class="…">          the one attribute that occurs (lg-ul, lg-dl, lg-ol)
//      <br>                                   exactly this spelling
//      &amp;                                  the one entity
//      <svg> <g> <rect> <circle> <path> <text> elements: not parsed, kept whole as an opaque `svg` node
//    RULE: anything else is literal text. An unknown tag (<span>, <B>, <br/>, <b style="…">), an unknown
//    entity (&nbsp;, &#39;), a closing tag that does not close the innermost open element, a tag in a
//    place its parent cannot hold (a <p> inside <b>, an <li> outside a list), an svg element that never
//    closes: each stays in the text exactly as written. Nothing is dropped, nothing is invented, so a
//    new kind of markup in the data shows up on screen instead of disappearing.
//    Elements still open at the end of the string are closed there.
//
// 2. parseXray(para): one paragraph of XSC[*].paras in the X-Ray grammar, `[[n|text]]` insight spans
//    and `{{term}}` term spans, with the two patterns of x4Para (L9894-L9895) applied in its order:
//    insights first, then terms, so a term inside an insight is still a term. Insights do not nest.
//    An X-Ray paragraph does NOT contain the HTML subset: the inventory describes it as "plain text …
//    no HTML tags" and none of the 11 paragraphs in mobile/src/data/xray.ts holds a `<` or `&`. So in
//    this grammar `<b>` and `&amp;` are literal characters, as is an unclosed `[[` or `{{`.
//
// 3. collapseMargins(boxes): the CSS rule React Native does not have. Vertical margins of blocks in
//    normal flow collapse: between siblings, and between a parent without padding or border on that
//    side and its first / last child. The prototype relies on it, e.g. `.n2-ub ul{margin-top:6px}`
//    with `.n2-ub li{margin-top:5px}` (L10135-L10136) puts the first item 6 px down, not 11.
//
// White space follows `white-space: normal`, in both grammars: runs of space, tab and line break
// become one space, space at the start and end of a block and around a <br> goes, and text that is
// only white space between two blocks is no node at all. U+00A0 is not white space.
//
// Tree shape. A block container (the root, li, ul, ol) holds blocks only: inline content that sits
// directly in one is wrapped in an anonymous `run` block, like the anonymous block box of CSS.

export type InlineNode =
  | { type: 'text'; text: string }
  | { type: 'br' }
  | { type: 'b' | 'i'; children: InlineNode[] }
  /** `[[n|text]]`: n is the zero-based index into the scan's `ins` array. */
  | { type: 'insight'; n: number; children: InlineNode[] }
  /** `{{term}}`: a key of the scan's `terms` object. */
  | { type: 'term'; term: string };

/** A block of inline content. `run` is the anonymous block around inline content that has no block element of its own. */
export interface TextBlock {
  type: 'p' | 'h4' | 'h5' | 'run';
  children: InlineNode[];
}
export interface ListBlock {
  type: 'ul' | 'ol';
  className?: string;
  children: BlockNode[];
}
export interface ItemBlock {
  type: 'li';
  children: BlockNode[];
}
/** Raw markup of one <svg> element, or of adjacent bare svg elements (fragment: LX[*].art). */
export interface SvgBlock {
  type: 'svg';
  markup: string;
  fragment: boolean;
}
export type BlockNode = TextBlock | ListBlock | ItemBlock | SvgBlock;

export type RichNode = InlineNode | BlockNode;

export const isTextBlock = (n: RichNode): n is TextBlock => n.type === 'p' || n.type === 'h4' || n.type === 'h5' || n.type === 'run';
const isBlock = (n: RichNode): n is BlockNode => isTextBlock(n) || n.type === 'ul' || n.type === 'ol' || n.type === 'li' || n.type === 'svg';

type BlockTag = 'p' | 'h4' | 'h5' | 'ul' | 'ol' | 'li';
type InlineTag = 'b' | 'i';
export type Token =
  | { kind: 'text'; text: string }
  | { kind: 'open'; tag: BlockTag | InlineTag; className?: string; raw: string }
  | { kind: 'close'; tag: BlockTag | InlineTag; raw: string }
  | { kind: 'br'; raw: string }
  | { kind: 'svg'; markup: string; fragment: boolean };

const TAG = /<(\/?)(b|i|p|ul|ol|li|h4|h5)>/y;
const LIST_WITH_CLASS = /<(ul|ol) class="([^"<>]*)">/y;
const SVG_OPEN = /<(svg|g|rect|circle|path|text)(?=[\s/>])/y;
const BR = '<br>';
const AMP = '&amp;';
/** White space of `white-space: normal`. U+00A0 is not in it. */
const SPACES = /[ \t\n\r\f]+/g;
const ONLY_SPACES = /^[ \t\n\r\f]*$/;

/** Index just past the svg element that opens at `at`, or -1 when it never closes. */
function svgElementEnd(src: string, at: number, name: string): number {
  const openEnd = src.indexOf('>', at);
  if (openEnd < 0) return -1;
  if (src[openEnd - 1] === '/') return openEnd + 1;
  const same = new RegExp(`<(/?)${name}(?=[\\s/>])[^>]*>`, 'g');
  same.lastIndex = openEnd + 1;
  let depth = 1;
  for (let m = same.exec(src); m; m = same.exec(src)) {
    if (m[1]) depth--;
    else if (!m[0].endsWith('/>')) depth++;
    if (depth === 0) return same.lastIndex;
  }
  return -1;
}

/** Splits a data string into tokens. Everything the grammar does not name ends up in a text token. */
export function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let text = '';
  const flush = (): void => {
    if (text) out.push({ kind: 'text', text });
    text = '';
  };
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '&') {
      const amp = src.startsWith(AMP, i);
      text += '&';
      i += amp ? AMP.length : 1;
      continue;
    }
    if (c !== '<') {
      text += c;
      i++;
      continue;
    }
    if (src.startsWith(BR, i)) {
      flush();
      out.push({ kind: 'br', raw: BR });
      i += BR.length;
      continue;
    }
    TAG.lastIndex = i;
    const tag = TAG.exec(src);
    if (tag) {
      flush();
      out.push({ kind: tag[1] ? 'close' : 'open', tag: tag[2] as BlockTag | InlineTag, raw: tag[0] });
      i = TAG.lastIndex;
      continue;
    }
    LIST_WITH_CLASS.lastIndex = i;
    const list = LIST_WITH_CLASS.exec(src);
    if (list) {
      flush();
      out.push({ kind: 'open', tag: list[1] as BlockTag, className: list[2], raw: list[0] });
      i = LIST_WITH_CLASS.lastIndex;
      continue;
    }
    SVG_OPEN.lastIndex = i;
    const svg = SVG_OPEN.exec(src);
    const end = svg ? svgElementEnd(src, i, svg[1]) : -1;
    if (svg && end > 0) {
      const fragment = svg[1] !== 'svg';
      const prev = out[out.length - 1];
      if (fragment && prev?.kind === 'svg' && prev.fragment && ONLY_SPACES.test(text)) {
        // Adjacent bare svg elements are one illustration: keep them in one node.
        prev.markup += text + src.slice(i, end);
        text = '';
      } else {
        flush();
        out.push({ kind: 'svg', markup: src.slice(i, end), fragment });
      }
      i = end;
      continue;
    }
    text += c;
    i++;
  }
  flush();
  return out;
}

interface Frame {
  tag: 'root' | BlockTag | InlineTag;
  /** Block containers only (root, li, ul, ol): their block children. */
  blocks?: BlockNode[];
  /** Inline containers: their children. Block containers: the children of the open `run`, if any. */
  inline: InlineNode[] | null;
}

function pushText(list: InlineNode[], text: string): void {
  const last = list[list.length - 1];
  if (last?.type === 'text') last.text += text;
  else list.push({ type: 'text', text });
}

/**
 * `white-space: normal` over the inline content of one block, in place.
 * Returns false when nothing is left (the block was white space only).
 */
function collapseWhiteSpace(children: InlineNode[]): boolean {
  let atSpace = true; // start of a line: a leading space goes
  let lastText: { type: 'text'; text: string } | null = null;
  const trimEnd = (): void => {
    if (lastText?.text.endsWith(' ')) lastText.text = lastText.text.slice(0, -1);
  };
  const walk = (nodes: InlineNode[]): void => {
    for (const n of nodes) {
      if (n.type === 'text') {
        let t = n.text.replace(SPACES, ' ');
        if (atSpace && t.startsWith(' ')) t = t.slice(1);
        n.text = t;
        if (t) {
          atSpace = t.endsWith(' ');
          lastText = n;
        }
      } else if (n.type === 'br') {
        trimEnd();
        atSpace = true;
        lastText = null;
      } else if (n.type === 'term') {
        atSpace = false;
        lastText = null;
      } else {
        walk(n.children);
      }
    }
  };
  walk(children);
  trimEnd();
  const prune = (nodes: InlineNode[]): void => {
    for (let k = nodes.length - 1; k >= 0; k--) {
      const n = nodes[k];
      if (n.type === 'text') {
        if (!n.text) nodes.splice(k, 1);
      } else if (n.type === 'b' || n.type === 'i' || n.type === 'insight') {
        prune(n.children);
      }
    }
  };
  prune(children);
  return children.length > 0;
}

function finishBlocks(blocks: BlockNode[]): void {
  for (let k = blocks.length - 1; k >= 0; k--) {
    const b = blocks[k];
    if (isTextBlock(b)) {
      if (!collapseWhiteSpace(b.children) && b.type === 'run') blocks.splice(k, 1);
    } else if (b.type !== 'svg') {
      finishBlocks(b.children);
    }
  }
}

/** Parses a data string holding the HTML subset. See the file header for the grammar and the literal rule. */
export function parseRichText(html: string): BlockNode[] {
  const root: BlockNode[] = [];
  const stack: Frame[] = [{ tag: 'root', blocks: root, inline: null }];
  const top = (): Frame => stack[stack.length - 1];
  /** The inline list text goes to: of the innermost inline container, or of an anonymous run. */
  const inlineList = (): InlineNode[] => {
    const f = top();
    if (!f.inline) {
      f.inline = [];
      (f.blocks as BlockNode[]).push({ type: 'run', children: f.inline });
    }
    return f.inline;
  };
  const literal = (raw: string): void => pushText(inlineList(), raw);

  for (const t of tokenize(html)) {
    const f = top();
    if (t.kind === 'text') {
      literal(t.text);
    } else if (t.kind === 'br') {
      inlineList().push({ type: 'br' });
    } else if (t.kind === 'svg') {
      if (!f.blocks) {
        literal(t.markup); // inside p, h4, h5, b, i: not a place this renderer can put an illustration
      } else {
        f.inline = null;
        f.blocks.push({ type: 'svg', markup: t.markup, fragment: t.fragment });
      }
    } else if (t.kind === 'close') {
      if (f.tag === t.tag) stack.pop();
      else literal(t.raw);
    } else if (t.tag === 'b' || t.tag === 'i') {
      const node = { type: t.tag, children: [] as InlineNode[] };
      inlineList().push(node);
      stack.push({ tag: t.tag, inline: node.children });
    } else if (!f.blocks || (t.tag === 'li' && f.tag !== 'ul' && f.tag !== 'ol')) {
      literal(t.raw); // a block inside an inline container, or an li outside a list
    } else {
      f.inline = null;
      if (t.tag === 'ul' || t.tag === 'ol' || t.tag === 'li') {
        const children: BlockNode[] = [];
        if (t.tag === 'li') f.blocks.push({ type: 'li', children });
        else f.blocks.push(t.className === undefined ? { type: t.tag, children } : { type: t.tag, className: t.className, children });
        stack.push({ tag: t.tag, blocks: children, inline: null });
      } else {
        const children: InlineNode[] = [];
        f.blocks.push({ type: t.tag, children });
        stack.push({ tag: t.tag, inline: children });
      }
    }
  }
  finishBlocks(root);
  return root;
}

// The two patterns of x4Para (L9894-L9895), unchanged.
const INSIGHT = /\[\[(\d+)\|([\s\S]*?)\]\]/g;
const TERM = /\{\{(.+?)\}\}/g;

function termsOf(text: string): InlineNode[] {
  const out: InlineNode[] = [];
  let at = 0;
  for (const m of text.matchAll(TERM)) {
    if (m.index > at) out.push({ type: 'text', text: text.slice(at, m.index) });
    out.push({ type: 'term', term: m[1] });
    at = m.index + m[0].length;
  }
  if (at < text.length) out.push({ type: 'text', text: text.slice(at) });
  return out;
}

/**
 * Parses one X-Ray paragraph (XSC[*].paras[*]). The result is a single `p` block, because the reader
 * wraps every paragraph in one: `<p>${x4Para(p, sc)}</p>` (L9926). An empty paragraph gives [].
 */
export function parseXray(para: string): BlockNode[] {
  const children: InlineNode[] = [];
  let at = 0;
  for (const m of para.matchAll(INSIGHT)) {
    if (m.index > at) children.push(...termsOf(para.slice(at, m.index)));
    children.push({ type: 'insight', n: Number(m[1]), children: termsOf(m[2]) });
    at = m.index + m[0].length;
  }
  if (at < para.length) children.push(...termsOf(para.slice(at)));
  return collapseWhiteSpace(children) ? [{ type: 'p', children }] : [];
}

/**
 * The text of a tree without its markup: <br> is a line break, blocks are separated by a line break,
 * a term is its word, an svg node is nothing. For a string without markup this is the string itself.
 * It is what `plain` (L9857) gives for an X-Ray paragraph, without the insight brackets.
 */
export function toPlainText(nodes: readonly RichNode[]): string {
  const inline = (n: InlineNode): string => {
    if (n.type === 'text') return n.text;
    if (n.type === 'br') return '\n';
    if (n.type === 'term') return n.term;
    return n.children.map(inline).join('');
  };
  const block = (n: BlockNode): string => {
    if (isTextBlock(n)) return n.children.map(inline).join('');
    return n.type === 'svg' ? '' : blocks(n.children);
  };
  const blocks = (list: readonly BlockNode[]): string =>
    list
      .map(block)
      .filter(s => s !== '')
      .join('\n');
  const out: string[] = [];
  let run = '';
  for (const n of nodes) {
    if (isBlock(n)) {
      if (run) out.push(run);
      run = '';
      const s = block(n);
      if (s) out.push(s);
    } else {
      run += inline(n);
    }
  }
  if (run) out.push(run);
  return out.join('\n');
}

/** One block in normal flow, for collapseMargins. */
export interface FlowBox {
  marginTop: number;
  marginBottom: number;
  /** Padding or border on that side: the margins of the children stay inside. */
  sealedTop: boolean;
  sealedBottom: boolean;
  children: FlowBox[];
}

/** Adjoining margins: the largest positive plus the most negative; with one sign only, the extreme. */
export function collapsed(a: number, b: number): number {
  if (a >= 0 && b >= 0) return Math.max(a, b);
  if (a < 0 && b < 0) return Math.min(a, b);
  return a + b;
}

/**
 * CSS margin collapsing over a list of sibling boxes whose container keeps margins inside (it has
 * padding, a border, or is a formatting context of its own: the RichText root is treated so).
 * Rewrites marginTop / marginBottom in place to the values a layout without collapsing must use:
 * each gap is carried by the lower box's marginTop, and a margin handed to the parent becomes 0.
 */
export function collapseMargins(boxes: FlowBox[]): void {
  for (const box of boxes) {
    const kids = box.children;
    if (!kids.length) continue;
    collapseMargins(kids);
    if (!box.sealedTop) {
      box.marginTop = collapsed(box.marginTop, kids[0].marginTop);
      kids[0].marginTop = 0;
    }
    const last = kids[kids.length - 1];
    if (!box.sealedBottom) {
      box.marginBottom = collapsed(box.marginBottom, last.marginBottom);
      last.marginBottom = 0;
    }
  }
  for (let k = 1; k < boxes.length; k++) {
    boxes[k].marginTop = collapsed(boxes[k - 1].marginBottom, boxes[k].marginTop);
    boxes[k - 1].marginBottom = 0;
  }
}
