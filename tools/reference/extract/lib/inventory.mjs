// Markup inventory: what the strings inside the extracted data contain, so the
// native rich-text renderer can cover exactly that and nothing else.
//
// Tags, classes, attributes and inline styles are read with the browser's own
// HTML parser (an inert <template>); entities and the X-Ray markers are
// counted on the raw string.

/** Strings of an emit tree with their paths; marker internals are skipped except real content. */
export function contentStrings(tree, root) {
  const out = [];
  const go = (v, path) => {
    if (typeof v === 'string') { out.push({ path, value: v }); return; }
    if (v === null || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach((x, i) => go(x, `${path}[${i}]`)); return; }
    if (typeof v.$t === 'string') {
      if (v.$t === 'set') v.v.forEach((x, i) => go(x, `${path}<${i}>`));
      else if (v.$t === 'map') v.v.forEach(([k, x], i) => { go(k, `${path}<key ${i}>`); go(x, `${path}<value ${i}>`); });
      else if (v.$t === 'param') go(v.sample, path);
      return;
    }
    const keys = Object.keys(v);
    if (keys[0] === '$fn') { if ('returns' in v.$fn) go(v.$fn.returns, `${path}()`); return; } // not the code
    if (keys[0] === '$env') { go(v.sample, path); return; }
    if (keys.length === 1 && keys[0].startsWith('$')) return; // $date, $dom …
    for (const k of keys) go(v[k], /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? `${path}.${k}` : `${path}[${JSON.stringify(k)}]`);
  };
  go(tree, root);
  return out;
}

/** Runs in the page: parses each string as HTML and reports what it holds. */
export const PARSE_MARKUP = String(function parseMarkup(strings) {
  const tpl = document.createElement('template');
  return strings.map(s => {
    tpl.innerHTML = s;
    const tags = {}, classes = {}, styles = {}, attrs = {};
    const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };
    for (const el of tpl.content.querySelectorAll('*')) {
      const tag = el.localName;
      bump(tags, tag);
      for (const a of el.attributes) {
        bump(attrs, tag + ' ' + a.name);
        if (a.name === 'class') for (const c of a.value.split(/\s+/).filter(Boolean)) bump(classes, c);
        if (a.name === 'style') {
          for (const decl of a.value.split(';')) {
            const i = decl.indexOf(':');
            if (i > 0) bump(styles, decl.slice(0, i).trim());
          }
        }
      }
    }
    return { tags, classes, styles, attrs, textLength: tpl.content.textContent.length };
  });
});

const ENTITY = /&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/g;
const LOOKS_LIKE_MARKUP = /<[A-Za-z/!]|&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/;

const fieldOf = path => path.replace(/\[\d+\]/g, '[*]').replace(/<\d+>/g, '<*>');

/**
 * @param {Array<{constant:string, module:string, tree:any}>} items
 * @param {(strings:string[]) => Promise<Array>} parseInPage
 */
export async function buildMarkupInventory(items, parseInPage) {
  const all = [];
  for (const it of items) for (const s of contentStrings(it.tree, it.constant)) all.push({ ...s, constant: it.constant, module: it.module });

  const markup = all.filter(s => LOOKS_LIKE_MARKUP.test(s.value));
  const parsed = await parseInPage(markup.map(s => s.value));

  const tally = () => new Map();
  const tags = tally(), classes = tally(), styles = tally(), attrs = tally(), entities = tally(), cssVars = tally();
  const add = (map, key, n, constant) => {
    if (!map.has(key)) map.set(key, { count: 0, constants: [] });
    const e = map.get(key);
    e.count += n;
    if (!e.constants.includes(constant)) e.constants.push(constant);
  };
  const fields = new Map();
  const field = s => {
    const key = fieldOf(s.path);
    if (!fields.has(key)) fields.set(key, { constant: s.constant, module: s.module, field: key, strings: 0, markupStrings: 0, withNewline: 0, tags: new Set(), classes: new Set(), entities: new Set(), xray: 0 });
    return fields.get(key);
  };

  for (const s of all) {
    const f = field(s);
    f.strings++;
    if (s.value.includes('\n')) f.withNewline++;
    for (const m of s.value.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) add(cssVars, m[1], 1, s.constant);
    if (/\[\[\d+\||\{\{.+?\}\}/.test(s.value)) f.xray++;
  }
  markup.forEach((s, i) => {
    const p = parsed[i];
    const f = field(s);
    const tagNames = Object.keys(p.tags);
    const ents = s.value.match(ENTITY) || [];
    if (!tagNames.length && !ents.length) return; // "<" that was not a tag
    f.markupStrings++;
    for (const [k, n] of Object.entries(p.tags)) { add(tags, k, n, s.constant); f.tags.add(k); }
    for (const [k, n] of Object.entries(p.classes)) { add(classes, k, n, s.constant); f.classes.add(k); }
    for (const [k, n] of Object.entries(p.styles)) add(styles, k, n, s.constant);
    for (const [k, n] of Object.entries(p.attrs)) add(attrs, k, n, s.constant);
    for (const e of ents) { add(entities, e, 1, s.constant); f.entities.add(e); }
  });

  const dump = map => Object.fromEntries([...map.entries()]
    .sort((a, b) => b[1].count - a[1].count || (a[0] < b[0] ? -1 : 1))
    .map(([k, e]) => [k, { count: e.count, constants: e.constants.length, examples: e.constants.slice(0, 2) }]));

  return {
    summary: {
      constants: items.length,
      strings: all.length,
      stringsWithMarkup: [...fields.values()].reduce((n, f) => n + f.markupStrings, 0),
      distinctTags: tags.size, distinctClasses: classes.size, distinctStyleProperties: styles.size, distinctEntities: entities.size,
    },
    tags: dump(tags),
    classes: dump(classes),
    styleProperties: dump(styles),
    attributes: dump(attrs),
    entities: dump(entities),
    cssVariables: dump(cssVars),
    fields: [...fields.values()]
      .filter(f => f.markupStrings || f.withNewline || f.xray)
      .map(f => ({ constant: f.constant, module: f.module, field: f.field, strings: f.strings, markupStrings: f.markupStrings, stringsWithNewline: f.withNewline, stringsWithXrayMarkers: f.xray, tags: [...f.tags].sort(), classes: [...f.classes].sort(), entities: [...f.entities].sort() })),
  };
}

/**
 * The X-Ray markup, measured on the data (XSC[].paras) and checked against
 * the code that consumes it.
 */
export function analyseXrayMarkup(xsc) {
  const INSIGHT = /\[\[(\d+)\|([\s\S]*?)\]\]/g; // same regex as x4Para (L9894)
  const TERM = /\{\{(.+?)\}\}/g; //                 same regex as x4Para (L9895) and plain() (L9857)
  const stats = { scans: xsc.length, paragraphs: 0, insightSpans: 0, termSpans: 0, termsInsideInsight: 0, termsOutsideInsight: 0, paragraphsWithoutMarkers: 0 };
  const problems = [];
  const examples = [];
  for (const sc of xsc) {
    const termKeys = Object.keys(sc.terms || {});
    const seenInsights = new Set();
    sc.paras.forEach((p, pi) => {
      stats.paragraphs++;
      const where = `XSC[id=${sc.id}].paras[${pi}]`;
      let any = false;
      for (const m of p.matchAll(INSIGHT)) {
        any = true;
        stats.insightSpans++;
        const n = Number(m[1]);
        if (seenInsights.has(n)) problems.push(`${where}: insight ${n} marked more than once in this scan`);
        seenInsights.add(n);
        if (!(n >= 0 && n < sc.ins.length)) problems.push(`${where}: insight index ${n} has no entry in ins (length ${sc.ins.length})`);
        if (m[2].includes('[[')) problems.push(`${where}: nested [[ inside an insight span`);
        if (/<[A-Za-z/]/.test(m[2])) problems.push(`${where}: HTML tag inside an insight span`);
        stats.termsInsideInsight += (m[2].match(TERM) || []).length;
        if (examples.length < 2) examples.push(m[0]);
      }
      for (const m of p.matchAll(TERM)) {
        any = true;
        stats.termSpans++;
        if (!termKeys.includes(m[1])) problems.push(`${where}: term "${m[1]}" has no key in terms`);
      }
      if (/<[A-Za-z/]/.test(p)) problems.push(`${where}: HTML tag in an X-Ray paragraph`);
      const stripped = p.replace(INSIGHT, '$2').replace(TERM, '$1');
      if (/\[\[|\]\]|\{\{|\}\}/.test(stripped)) problems.push(`${where}: marker characters left over after both patterns are applied`);
      if (!any) stats.paragraphsWithoutMarkers++;
    });
    for (let i = 0; i < sc.ins.length; i++) if (!seenInsights.has(i)) problems.push(`XSC[id=${sc.id}]: ins[${i}] has no [[${i}|…]] span in paras`);
    for (const k of termKeys) if (!sc.paras.some(p => p.includes(`{{${k}}}`))) problems.push(`XSC[id=${sc.id}]: terms["${k}"] is never marked in paras`);
  }
  stats.termsOutsideInsight = stats.termSpans - stats.termsInsideInsight;
  return {
    usedIn: 'XSC[*].paras[*] (mobile/src/data/xray.ts)',
    grammar: {
      paragraph: 'plain text with zero or more insight spans and term spans; no HTML tags',
      insightSpan: '"[[" DIGITS "|" TEXT "]]"  where DIGITS is the zero-based index into the scan\'s `ins` array and TEXT is matched lazily up to the first "]]"',
      termSpan: '"{{" TERM "}}"  where TERM is matched lazily (one or more characters, no line breaks) and is a key of the scan\'s `terms` object',
      nesting: 'A term span may sit inside an insight span or outside one. Insight spans do not nest.',
      order: 'x4Para applies the insight pattern first, then the term pattern over the result, so terms inside insights are still linked.',
    },
    consumers: {
      'x4Para (PrepAssist.html L9893-L9896)': 'insight -> <mark class="x4-i [seen]" id="x4i{n}" data-act="x4Ins:{n}"><b class="x4-pin">{n+1}</b>TEXT</mark>; term -> <span class="x4-t" data-act="x4Term:{encodeURIComponent(TERM)}" role="button">TERM</span>',
      'plain (L9857)': 'removes the braces of term spans, keeping TERM',
      'insText (L9858)': 'finds the text of insight n in a scan: first paragraph matching [[n|…]], with term braces removed',
      'termCount (L9859)': 'counts occurrences of "{{TERM}}" across all paragraphs of a scan',
    },
    regexes: { insight: String(INSIGHT), term: String(TERM) },
    stats,
    examples,
    problems,
  };
}
