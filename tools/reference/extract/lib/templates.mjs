// Inventory of the markup that lives in CODE rather than in data: the HTML
// template strings inside functions (views, sheets, tab renderers, mentor
// replies …) and the static markup of the document.
//
// This is not content extraction: template strings mix text with `${…}`
// expressions and cannot become data. The inventory tells the porting agents,
// per function, which tags / classes / inline style properties / entities the
// templates use and which visible text they contain, with source lines, so
// (a) the lead can see what the rich-text renderer does NOT need to cover
// because it is ported as components, and (b) copy can be checked against the
// HTML instead of being retyped from memory.
//
// Each `${…}` is replaced by a private-use marker only for parsing; in the
// reported text it is shown again as `${expression}`.

const OPEN = '', CLOSE = '';
const HAS_MARKUP = /<[A-Za-z/!]|&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/;
const ENTITY = /&(?:#\d+|#x[0-9a-fA-F]+|[A-Za-z][A-Za-z0-9]*);/g;

/** Runs in the page. Parses each string as HTML and reports tags, classes, styles, attributes and text. */
export const PARSE_TEMPLATES = String(function parseTemplates(strings, groupSelector) {
  const OPEN = '';
  const tpl = document.createElement('template');
  const LABEL_ATTRS = ['aria-label', 'placeholder', 'title', 'alt', 'value'];
  return strings.map(s => {
    tpl.innerHTML = s;
    const byGroup = new Map();
    const bucket = key => {
      if (!byGroup.has(key)) byGroup.set(key, { group: key, tags: {}, classes: {}, styles: {}, attrs: {}, texts: [], labels: [] });
      return byGroup.get(key);
    };
    const bump = (o, k) => { if (!k.includes(OPEN)) o[k] = (o[k] || 0) + 1; };
    const groupOf = el => {
      if (!groupSelector) return '';
      const g = el.closest(groupSelector);
      return g ? '#' + g.id : '';
    };
    const walker = document.createTreeWalker(tpl.content, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (n.nodeType === 3) {
        const t = n.nodeValue.replace(/\s+/g, ' ').trim();
        if (!t) continue;
        const parent = n.parentElement;
        if (parent && (parent.localName === 'script' || parent.localName === 'style')) continue;
        bucket(parent ? groupOf(parent) : '').texts.push(t);
        continue;
      }
      const b = bucket(groupOf(n));
      bump(b.tags, n.localName);
      for (const a of n.attributes) {
        bump(b.attrs, n.localName + ' ' + a.name);
        if (a.name === 'class') for (const c of a.value.split(/\s+/).filter(Boolean)) bump(b.classes, c);
        if (a.name === 'style') for (const decl of a.value.split(';')) { const i = decl.indexOf(':'); if (i > 0) bump(b.styles, decl.slice(0, i).trim()); }
        if (LABEL_ATTRS.includes(a.name) && a.value.trim()) b.labels.push(a.name + '=' + a.value);
      }
    }
    return [...byGroup.values()];
  });
});

/** Every HTML-bearing string or template literal in the scripts, with its owning function. */
export function collectCodeTemplates(source) {
  const { ts, scripts, lineOf } = source;
  const out = [];
  const toasts = [];
  for (const script of scripts) {
    const { sf, codeStart } = script;
    const line = pos => lineOf(codeStart + pos);

    /** The name a function is known by, from how it is declared or assigned. */
    const nameOfFunction = f => {
      if (ts.isFunctionDeclaration(f) && f.name) return `${f.name.text}()`;
      const p = f.parent;
      if (!p) return null;
      if (ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return `${p.name.text}()`;
      if (ts.isBinaryExpression(p) && p.right === f) return `${p.left.getText(sf)}()`;
      if ((ts.isPropertyAssignment(p) || ts.isMethodDeclaration(p)) && p.name) {
        const obj = ts.isMethodDeclaration(f) ? f.parent : p.parent; // the object literal
        const holder = obj && obj.parent;
        let owner = null;
        if (holder && ts.isVariableDeclaration(holder) && ts.isIdentifier(holder.name)) owner = holder.name.text;
        else if (holder && ts.isCallExpression(holder) && holder.expression.getText(sf) === 'Object.assign' && holder.arguments.length) owner = holder.arguments[0].getText(sf);
        const key = ts.isMethodDeclaration(f) ? f.name.getText(sf) : p.name.getText(sf);
        return owner ? `${owner}.${key}()` : null;
      }
      if (ts.isMethodDeclaration(f) && f.name) return `${f.name.getText(sf)}()`;
      return null;
    };
    /** Outermost named function around a node; null at script level. */
    const ownerOf = n => {
      let found = null;
      for (let p = n.parent; p; p = p.parent) if (ts.isFunctionLike(p)) { const nm = nameOfFunction(p); if (nm) found = nm; }
      return found;
    };

    const visit = n => {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'toast' && n.arguments.length) {
        const a = n.arguments[0];
        toasts.push({ source: `L${line(n.getStart(sf))}`, in: ownerOf(n) || '(script level)', message: a.getText(sf), icon: n.arguments[1] ? n.arguments[1].getText(sf) : "(default 'check')" });
      }
      let text = null, exprs = [];
      if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) text = n.text;
      else if (ts.isTemplateExpression(n)) {
        text = n.head.text;
        n.templateSpans.forEach((span, i) => { exprs.push(span.expression.getText(sf)); text += OPEN + i + CLOSE + span.literal.text; });
      }
      if (text !== null && HAS_MARKUP.test(text)) {
        out.push({ owner: ownerOf(n) || '(script level)', from: line(n.getStart(sf)), to: line(n.end), text, exprs });
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return { templates: out, toasts };
}

/** The document's own markup: <body> without its <script> and <style> blocks. */
export function staticMarkup(source) {
  const { html } = source;
  const start = html.indexOf('<body');
  const end = html.lastIndexOf('</body>');
  if (start < 0 || end < 0) throw new Error('No <body> found');
  let body = html.slice(html.indexOf('>', start) + 1, end);
  body = body.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '');
  return body;
}

const showExprs = (s, exprs) => s.replace(new RegExp(`${OPEN}(\\d+)${CLOSE}`, 'g'), (_, i) => {
  const e = exprs[Number(i)] || '';
  return '${' + (e.length > 60 ? e.slice(0, 57).replace(/\s+/g, ' ') + '…' : e.replace(/\s+/g, ' ')) + '}';
});

/**
 * @param {object} o
 * @param {object} o.source
 * @param {(strings:string[], groupSelector:string|null) => Promise<any[]>} o.parseInPage
 * @param {string} o.staticGroupSelector  CSS selector whose matches name the groups of the static markup
 * @param {Set<string>} o.dataTags     tags that occur in data strings (from the markup inventory)
 * @param {Set<string>} o.dataClasses  classes that occur in data strings
 */
export async function buildTemplateInventory({ source, parseInPage, staticGroupSelector, dataTags, dataClasses }) {
  const { templates, toasts } = collectCodeTemplates(source);
  const parsed = await parseInPage(templates.map(t => t.text), null);
  const body = staticMarkup(source);
  const [staticParsed] = await parseInPage([body], staticGroupSelector);

  const tallies = { tags: new Map(), classes: new Map(), styleProperties: new Map(), attributes: new Map(), entities: new Map() };
  const add = (map, key, n, where) => {
    if (!map.has(key)) map.set(key, { count: 0, where: [] });
    const e = map.get(key);
    e.count += n;
    if (!e.where.includes(where)) e.where.push(where);
  };

  const groups = new Map();
  const group = (name, kind) => {
    if (!groups.has(name)) groups.set(name, { where: name, kind, lines: [], tags: new Set(), classes: new Set(), styleProperties: new Set(), entities: new Set(), text: [], labels: [] });
    return groups.get(name);
  };
  const absorb = (g, p, exprs) => {
    for (const [k, n] of Object.entries(p.tags)) { add(tallies.tags, k, n, g.where); g.tags.add(k); }
    for (const [k, n] of Object.entries(p.classes)) { add(tallies.classes, k, n, g.where); g.classes.add(k); }
    for (const [k, n] of Object.entries(p.styles)) { add(tallies.styleProperties, k, n, g.where); g.styleProperties.add(k); }
    for (const [k, n] of Object.entries(p.attrs)) add(tallies.attributes, k, n, g.where);
    for (const t of p.texts) g.text.push(showExprs(t, exprs));
    for (const l of p.labels) g.labels.push(showExprs(l, exprs));
  };

  templates.forEach((t, i) => {
    const g = group(t.owner, 'function');
    g.lines.push(t.from === t.to ? `L${t.from}` : `L${t.from}-L${t.to}`);
    for (const p of parsed[i]) absorb(g, p, t.exprs);
    for (const e of t.text.match(ENTITY) || []) { add(tallies.entities, e, 1, g.where); g.entities.add(e); }
  });
  for (const p of staticParsed) {
    const g = group(`static markup ${p.group || '(outside the stages)'}`, 'static');
    absorb(g, p, []);
  }
  for (const e of body.match(ENTITY) || []) add(tallies.entities, e, 1, 'static markup');

  const dump = map => Object.fromEntries([...map.entries()]
    .sort((a, b) => b[1].count - a[1].count || (a[0] < b[0] ? -1 : 1))
    .map(([k, e]) => [k, { count: e.count, places: e.where.length, examples: e.where.slice(0, 2) }]));

  const tagNames = [...tallies.tags.keys()];
  const classNames = [...tallies.classes.keys()];
  return {
    summary: {
      templateLiterals: templates.length,
      functionsWithMarkup: [...groups.values()].filter(g => g.kind === 'function').length,
      staticGroups: [...groups.values()].filter(g => g.kind === 'static').length,
      distinctTags: tallies.tags.size, distinctClasses: tallies.classes.size,
      distinctStyleProperties: tallies.styleProperties.size, distinctEntities: tallies.entities.size,
      toastCalls: toasts.length,
    },
    tagsOnlyInCode: tagNames.filter(t => !dataTags.has(t)).sort(),
    tagsAlsoInData: tagNames.filter(t => dataTags.has(t)).sort(),
    classesAlsoInData: classNames.filter(c => dataClasses.has(c)).sort(),
    tags: dump(tallies.tags),
    classes: dump(tallies.classes),
    styleProperties: dump(tallies.styleProperties),
    attributes: dump(tallies.attributes),
    entities: dump(tallies.entities),
    toastCalls: toasts,
    places: [...groups.values()].map(g => ({
      where: g.where, kind: g.kind, lines: g.lines,
      tags: [...g.tags].sort(), classes: [...g.classes].sort(), styleProperties: [...g.styleProperties].sort(), entities: [...g.entities].sort(),
      text: g.text, labels: g.labels,
    })),
  };
}
