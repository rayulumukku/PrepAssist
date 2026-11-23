// Source: PrepAssist.html L7404-L7434 (LEGAL section bodies), L7569 (`${s[1]}` inserted as HTML)
// The section bodies of LEGAL are small HTML strings made of <p>, <h4>, <b>, <ul class="lg-ul">,
// <ul class="lg-dl"> and <ol class="lg-ol">. This turns them into blocks the Legal screen draws with
// the .lg-* rules (the list classes need different styles, which the shared RichText maps per tag).
export interface Run {
  text: string;
  b: boolean;
}
export type Block =
  | { t: 'p'; runs: Run[] }
  | { t: 'h4'; text: string }
  | { t: 'lg-ul' | 'lg-ol' | 'lg-dl'; items: Run[][] };

const decode = (s: string): string =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

export function runs(html: string): Run[] {
  const out: Run[] = [];
  const re = /<b>([\s\S]*?)<\/b>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m.index > last)
      out.push({ text: decode(html.slice(last, m.index)), b: false });
    out.push({ text: decode(m[1]), b: true });
    last = m.index + m[0].length;
  }
  if (last < html.length)
    out.push({ text: decode(html.slice(last)), b: false });
  return out;
}

export function parseLegal(html: string): Block[] {
  const blocks: Block[] = [];
  const re =
    /<p>([\s\S]*?)<\/p>|<h4>([\s\S]*?)<\/h4>|<(ul|ol) class="(lg-ul|lg-ol|lg-dl)">([\s\S]*?)<\/\3>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) blocks.push({ t: 'p', runs: runs(m[1]) });
    else if (m[2] !== undefined) blocks.push({ t: 'h4', text: decode(m[2]) });
    else {
      const items = [...m[5].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x =>
        runs(x[1]),
      );
      blocks.push({ t: m[4] as 'lg-ul' | 'lg-ol' | 'lg-dl', items });
    }
  }
  return blocks;
}
