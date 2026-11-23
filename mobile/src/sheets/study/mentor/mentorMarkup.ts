// Source: PrepAssist.html L6882-L6906 (reply: the answer markup), L31 (*{margin:0;padding:0}), L2854-L2863 (.msg-a children)
// Parses the markup reply() returns into blocks. The grammar is exactly what reply() can produce:
//   blocks   <h5> · <p> · <p style="…"> · <p class="src"> · <table><tr><th|td>… · <ul>/<ol><li>…
//            · <div class="acts"><button class="chip" data-act="…">label</button>…</div>
//   inline   text · <b> · <i> · the entities &lt; &gt; &amp; &quot; &#39;
// White space follows `white-space: normal`: runs collapse to one space, space at the start and end
// of a block goes, and white space between blocks is no node. Anything else is kept as literal text,
// so an unexpected tag shows on screen instead of vanishing (tested in mentor.test.ts).

export type Inline = { t: 'text'; s: string } | { t: 'b' | 'i'; c: Inline[] };

export type Block =
  | { t: 'h5'; c: Inline[] }
  | { t: 'p'; c: Inline[]; style?: string; cls?: string }
  | { t: 'table'; rows: { th: boolean; c: Inline[] }[][] }
  | { t: 'ul' | 'ol'; items: Inline[][] }
  | { t: 'acts'; chips: { act: string; label: string }[] };

const ENT: Record<string, string> = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'" };
const decode = (s: string): string => s.replace(/&(lt|gt|amp|quot|#39);/g, m => ENT[m]);

/** Inline content: text, <b>, <i>. Unknown tags stay literal. */
export function parseInline(src: string): Inline[] {
  const root: Inline[] = [];
  const stack: { tag: 'b' | 'i'; c: Inline[] }[] = [];
  const cur = (): Inline[] => (stack.length ? stack[stack.length - 1].c : root);
  const pushText = (s: string): void => {
    if (!s) return;
    const c = cur();
    const last = c[c.length - 1];
    if (last && last.t === 'text') last.s += s;
    else c.push({ t: 'text', s });
  };
  const re = /<(\/?)(b|i)>/g;
  let at = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    pushText(decode(src.slice(at, m.index)));
    at = re.lastIndex;
    const tag = m[2] as 'b' | 'i';
    if (!m[1]) {
      const node = { t: tag, c: [] as Inline[] };
      cur().push(node);
      stack.push({ tag, c: node.c });
    } else if (stack.length && stack[stack.length - 1].tag === tag) {
      stack.pop();
    } else {
      pushText(m[0]);
    }
  }
  pushText(decode(src.slice(at)));
  return collapse(root);
}

/** white-space: normal inside one block: runs collapse, leading and trailing space goes. */
function collapse(nodes: Inline[]): Inline[] {
  let prevSpace = true; // start of the block
  const walk = (list: Inline[]): Inline[] =>
    list
      .map(n => {
        if (n.t !== 'text') return { t: n.t, c: walk(n.c) };
        let s = n.s.replace(/[ \t\n\r\f]+/g, ' ');
        if (prevSpace && s.startsWith(' ')) s = s.slice(1);
        if (s) prevSpace = s.endsWith(' ');
        return { t: 'text' as const, s };
      })
      .filter(n => n.t !== 'text' || n.s !== '');
  const out = walk(nodes);
  // trailing space of the block
  const trimEnd = (list: Inline[]): boolean => {
    for (let k = list.length - 1; k >= 0; k--) {
      const n = list[k];
      if (n.t === 'text') {
        n.s = n.s.replace(/ $/, '');
        if (n.s === '') list.splice(k, 1);
        else return true;
      } else if (trimEnd(n.c)) return true;
    }
    return false;
  };
  trimEnd(out);
  return out;
}

const BLOCK = /<(h5|p|table|ul|ol|div)((?:\s+[a-z-]+="[^"]*")*)>/y;
const attr = (attrs: string, name: string): string | undefined => {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(attrs);
  return m ? m[1] : undefined;
};

function cells(rowSrc: string): { th: boolean; c: Inline[] }[] {
  const out: { th: boolean; c: Inline[] }[] = [];
  const re = /<(th|td)>([\s\S]*?)<\/\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rowSrc))) out.push({ th: m[1] === 'th', c: parseInline(m[2]) });
  return out;
}

/** The answer markup of reply() as blocks. */
export function parseAnswer(src: string): Block[] {
  const out: Block[] = [];
  let at = 0;
  const lit = (s: string): void => {
    const c = parseInline(s);
    if (c.length) out.push({ t: 'p', c });
  };
  while (at < src.length) {
    const ws = /\s*/y;
    ws.lastIndex = at;
    ws.exec(src);
    at = ws.lastIndex;
    if (at >= src.length) break;
    BLOCK.lastIndex = at;
    const m = BLOCK.exec(src);
    const tag = m?.[1];
    const close = tag ? src.indexOf(`</${tag}>`, BLOCK.lastIndex) : -1;
    if (!m || !tag || close < 0) {
      // not a block we know: literal text up to the next block start
      const next = src.slice(at + 1).search(/<(h5|p|table|ul|ol|div)[\s>]/);
      const end = next < 0 ? src.length : at + 1 + next;
      lit(src.slice(at, end));
      at = end;
      continue;
    }
    const inner = src.slice(BLOCK.lastIndex, close);
    const attrs = m[2] ?? '';
    const start = at;
    at = close + tag.length + 3;
    if (tag === 'h5') out.push({ t: 'h5', c: parseInline(inner) });
    else if (tag === 'p') out.push({ t: 'p', c: parseInline(inner), style: attr(attrs, 'style'), cls: attr(attrs, 'class') });
    else if (tag === 'table') {
      const rows: { th: boolean; c: Inline[] }[][] = [];
      const re = /<tr>([\s\S]*?)<\/tr>/g;
      let r: RegExpExecArray | null;
      while ((r = re.exec(inner))) rows.push(cells(r[1]));
      out.push({ t: 'table', rows });
    } else if (tag === 'ul' || tag === 'ol') {
      const items: Inline[][] = [];
      const re = /<li>([\s\S]*?)<\/li>/g;
      let r: RegExpExecArray | null;
      while ((r = re.exec(inner))) items.push(parseInline(r[1]));
      out.push({ t: tag, items });
    } else if (tag === 'div' && attr(attrs, 'class') === 'acts') {
      const chips: { act: string; label: string }[] = [];
      const re = /<button class="chip" data-act="([^"]*)">([\s\S]*?)<\/button>/g;
      let r: RegExpExecArray | null;
      while ((r = re.exec(inner))) chips.push({ act: decode(r[1]), label: decode(r[2]) });
      out.push({ t: 'acts', chips });
    } else lit(src.slice(start, at));
  }
  return out;
}

/** Plain text of inline content (tests, accessibility). */
export const inlineText = (c: Inline[]): string => c.map(n => (n.t === 'text' ? n.s : inlineText(n.c))).join('');
