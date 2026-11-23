// <symbol> extraction. The browser parses the markup (static sprite, the
// `logo` symbol, and the sprites that scripts inject at load), so the data is
// exactly what the page uses.
import { HTML_NAME } from './paths.mjs';
import { strLit, keyLit, printValue } from './emit-ts.mjs';

export const SHAPE_TYPES = ['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon'];

/** Runs in the page: every <symbol> under `root`, as plain data. */
export const READ_SYMBOLS = String(function readSymbols(root) {
  const conv = el => {
    const node = { tag: el.localName, attrs: {} };
    for (const a of el.attributes) node.attrs[a.name] = a.value;
    const kids = [...el.children].map(conv);
    if (kids.length) node.children = kids;
    const text = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join('');
    if (text.trim()) node.text = text;
    return node;
  };
  return [...root.querySelectorAll('symbol')].map(conv);
});

/** stroke-linejoin -> strokeLinejoin, xlink:href -> xlinkHref (react-native-svg prop names). */
export const camelAttr = name => name.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase());

function convertShape(node, issues, iconName) {
  const attrs = {};
  for (const [k, v] of Object.entries(node.attrs)) attrs[camelAttr(k)] = v;
  const out = { type: node.tag, attrs };
  if (!SHAPE_TYPES.includes(node.tag)) issues.push({ icon: iconName, element: node.tag, representedAs: `{ type: '${node.tag}', attrs, children }` });
  if (node.children) out.children = node.children.map(c => convertShape(c, issues, iconName));
  if (node.text) { out.text = node.text; issues.push({ icon: iconName, element: `${node.tag} text content`, representedAs: 'text' }); }
  return out;
}

/**
 * @param {object} o
 * @param {Array} o.domSymbols        symbols in the document after load
 * @param {Array} o.templateSymbols   [{ expression, about, symbols }] built by view templates
 * @param {object} o.source
 */
export function buildIcons({ domSymbols, templateSymbols, source }) {
  const { html, lineOf, scripts } = source;
  const issues = [];
  const where = id => {
    const at = html.indexOf(`<symbol id="${id}"`);
    if (at < 0) throw new Error(`<symbol id="${id}"> is in the document but not in the source text`);
    if (html.indexOf(`<symbol id="${id}"`, at + 1) >= 0) throw new Error(`<symbol id="${id}"> is defined twice in the source`);
    const script = scripts.find(s => at >= s.codeStart && at < s.codeStart + s.code.length);
    return { line: lineOf(at), origin: script ? 'injected-by-script' : 'static-markup' };
  };

  const convert = (sym, nameOf) => {
    const { id, viewBox, ...rest } = sym.attrs;
    if (!id) throw new Error('A <symbol> has no id');
    const name = nameOf(id);
    const w = where(id);
    const attrs = {};
    for (const [k, v] of Object.entries(rest)) attrs[camelAttr(k)] = v;
    return {
      name,
      def: {
        id,
        viewBox: viewBox === undefined ? null : viewBox,
        attrs,
        shapes: (sym.children || []).map(c => convertShape(c, issues, name)),
        source: `${HTML_NAME} L${w.line}`,
        origin: w.origin,
      },
    };
  };

  const icons = domSymbols.map(s => convert(s, id => id.replace(/^i-/, '')));
  const names = icons.map(i => i.name);
  const dup = names.filter((n, i) => names.indexOf(n) !== i);
  if (dup.length) throw new Error(`Icon names collide after removing the "i-" prefix: ${dup}`);
  for (const i of icons) {
    if (i.def.viewBox === null) issues.push({ icon: i.name, element: 'symbol without viewBox', representedAs: 'viewBox: null' });
    if (Object.keys(i.def.attrs).length) issues.push({ icon: i.name, element: `symbol attributes ${Object.keys(i.def.attrs).join(', ')}`, representedAs: 'attrs' });
  }

  const illustration = [];
  for (const t of templateSymbols) {
    for (const s of t.symbols) {
      const c = convert(s, id => id);
      c.def.origin = 'view-template';
      c.def.builtBy = t.expression;
      illustration.push(c);
    }
  }

  // Nothing in the source may be left behind.
  const got = new Set([...domSymbols, ...templateSymbols.flatMap(t => t.symbols)].map(s => s.attrs.id));
  const inSource = [...html.matchAll(/<symbol id="([^"]+)"/g)].map(m => m[1]);
  const missing = inSource.filter(id => !got.has(id));
  if (missing.length) throw new Error(`<symbol> ids in the source that were not extracted: ${missing}`);

  // The CSS rule every ic() icon gets, quoted from the source.
  const ruleAt = html.indexOf('svg.ic{');
  if (ruleAt < 0) throw new Error('The base icon rule `svg.ic{…}` was not found');
  const baseRule = { text: html.slice(ruleAt, html.indexOf('}', ruleAt) + 1), source: `${HTML_NAME} L${lineOf(ruleAt)}` };

  return { icons, illustration, issues, sourceSymbolCount: inSource.length, baseRule };
}

export function emitIconsModule({ icons, illustration, header, baseRule }) {
  const lines = [];
  lines.push(header, '//');
  lines.push('// Every <symbol> of the prototype as data for react-native-svg. No component here.');
  lines.push('//   ICONS                 the icon sprite: static markup L4658-L4724, the `logo` symbol, and the two');
  lines.push('//                         sprites that scripts inject at load. `<use href="#i-NAME">` in the HTML is ICONS[NAME].');
  lines.push('//   ILLUSTRATION_SYMBOLS  <symbol>s that a view template builds (not icons, no viewBox).');
  lines.push('// Attribute names are camelCased (stroke-width -> strokeWidth); values are the HTML strings, unchanged.');
  lines.push('// A shape without its own fill/stroke attrs takes them from the element that uses the icon. For the');
  lines.push(`// icon helper ic() that is the rule at ${baseRule.source}:`);
  lines.push(`//   ${baseRule.text}`);
  lines.push('// Per-shape attrs (e.g. the fills of `logo`) override it.');
  lines.push('');
  lines.push(`export type IconShapeType = ${SHAPE_TYPES.map(strLit).join(' | ')};`);
  lines.push('');
  lines.push('export interface IconShape {');
  lines.push('  /** Element name. Always an IconShapeType for the icons in this file. */');
  lines.push('  readonly type: IconShapeType;');
  lines.push('  readonly attrs: Readonly<Record<string, string>>;');
  lines.push('}');
  lines.push('');
  lines.push('export interface IconDef {');
  lines.push('  /** The id of the <symbol> in the HTML. */');
  lines.push('  readonly id: string;');
  lines.push('  readonly viewBox: string | null;');
  lines.push('  /** Attributes of the <symbol> itself other than id and viewBox. */');
  lines.push('  readonly attrs: Readonly<Record<string, string>>;');
  lines.push('  /** Child shapes in document order (later shapes paint on top). */');
  lines.push('  readonly shapes: readonly IconShape[];');
  lines.push('  readonly source: string;');
  lines.push("  readonly origin: 'static-markup' | 'injected-by-script' | 'view-template';");
  lines.push('  /** For view-template symbols: the expression that builds the markup. */');
  lines.push('  readonly builtBy?: string;');
  lines.push('}');
  lines.push('');
  lines.push(`export type IconName =\n${icons.map(i => `  | ${strLit(i.name)}`).join('\n')};`);
  lines.push('');
  lines.push(`export const ICON_NAMES: readonly IconName[] = ${printValue(icons.map(i => i.name), '')};`);
  lines.push('');
  lines.push('export const ICONS: Readonly<Record<IconName, IconDef>> = {');
  for (const i of icons) {
    lines.push(`  // Source: ${i.def.source} (<symbol id="${i.def.id}">, ${i.def.origin})`);
    lines.push(`  ${keyLit(i.name)}: ${printValue(i.def, '  ')},`);
  }
  lines.push('};');
  lines.push('');
  lines.push(`export type IllustrationSymbolName = ${illustration.length ? illustration.map(i => strLit(i.name)).join(' | ') : 'never'};`);
  lines.push('');
  lines.push('export const ILLUSTRATION_SYMBOLS: Readonly<Record<IllustrationSymbolName, IconDef>> = {');
  for (const i of illustration) {
    lines.push(`  // Source: ${i.def.source} (<symbol id="${i.def.id}">, built by ${i.def.builtBy})`);
    lines.push(`  ${keyLit(i.name)}: ${printValue(i.def, '  ')},`);
  }
  lines.push('};');
  lines.push('');
  return lines.join('\n');
}
