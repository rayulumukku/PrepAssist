// Turns captured values into TypeScript source: a literal printer and a type
// inferrer. Strings are never altered; they are only quoted and escaped.
//
// Input is the "emit tree": plain JSON plus these tagged nodes
//   { $t: 'undefined' }                     -> undefined
//   { $t: 'number', v: 'NaN' | ... }        -> NaN, Infinity, -Infinity, -0
//   { $t: 'bigint', v }                     -> 123n
//   { $t: 'set', v: [...] }                 -> new Set([...])
//   { $t: 'map', v: [[k, v], ...] }         -> new Map([[k, v], ...])
//   { $t: 'param', key, sample }            -> env['key']   (initial state only)
// Marker objects ({ $env }, { $fn }, { $date } ...) are ordinary objects in the
// tree and get the named marker types from markers.ts.

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const WIDTH = 110;

export const isNode = (v, tag) => v !== null && typeof v === 'object' && !Array.isArray(v) && v.$t === tag;
const isTaggedNode = v => v !== null && typeof v === 'object' && !Array.isArray(v) && typeof v.$t === 'string';

/** A TypeScript string literal for `s`, byte-for-byte the same string when evaluated. */
export function strLit(s) {
  const quote = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = quote;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const code = s.charCodeAt(i);
    if (ch === quote || ch === '\\') out += '\\' + ch;
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (code < 0x20 || code === 0x7f || code === 0x2028 || code === 0x2029 || code === 0xfeff) out += '\\u' + code.toString(16).padStart(4, '0');
    else if (code >= 0xd800 && code <= 0xdfff) {
      const next = s.charCodeAt(i + 1);
      if (code <= 0xdbff && next >= 0xdc00 && next <= 0xdfff) { out += ch + s[i + 1]; i++; }
      else out += '\\u' + code.toString(16).padStart(4, '0'); // lone surrogate
    } else out += ch;
  }
  return out + quote;
}

export const keyLit = k => (IDENT.test(k) ? k : strLit(k));

export function pascal(name) {
  return String(name)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(seg => (/[a-z]/.test(seg) ? seg[0].toUpperCase() + seg.slice(1) : seg[0].toUpperCase() + seg.slice(1).toLowerCase()))
    .join('') || 'X';
}

/* ------------------------------------------------------------------ */
/* values                                                              */
/* ------------------------------------------------------------------ */

function compact(v) {
  if (v === null) return 'null';
  if (typeof v === 'string') return strLit(v);
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) throw new Error('Non-finite number must be tagged');
    return String(v);
  }
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return '[' + v.map(compact).join(', ') + ']';
  if (isTaggedNode(v)) {
    switch (v.$t) {
      case 'undefined': return 'undefined';
      case 'number': return v.v;
      case 'bigint': return v.v + 'n';
      case 'set': return 'new Set(' + compact(v.v) + ')';
      case 'map': return 'new Map(' + compact(v.v) + ')';
      case 'param': return `env[${strLit(v.key)}]`;
      default: throw new Error(`Cannot print a value tagged "${v.$t}"`);
    }
  }
  const keys = Object.keys(v);
  if (!keys.length) return '{}';
  return '{ ' + keys.map(k => `${keyLit(k)}: ${compact(v[k])}`).join(', ') + ' }';
}

/** Pretty-prints an emit tree as a TypeScript expression. */
export function printValue(v, indent = '') {
  const one = compact(v);
  if (indent.length + one.length <= WIDTH && !one.includes('\n')) return one;
  const inner = indent + '  ';
  if (Array.isArray(v)) return '[\n' + v.map(x => inner + printValue(x, inner) + ',\n').join('') + indent + ']';
  if (isTaggedNode(v)) {
    if (v.$t === 'set') return 'new Set(' + printValue(v.v, indent) + ')';
    if (v.$t === 'map') return 'new Map(' + printValue(v.v, indent) + ')';
    return one;
  }
  if (v !== null && typeof v === 'object') {
    return '{\n' + Object.keys(v).map(k => `${inner}${keyLit(k)}: ${printValue(v[k], inner)},\n`).join('') + indent + '}';
  }
  return one; // a long string stays on one line
}

/**
 * Canonical JSON form of an emit tree, for hashing. The Jest test builds the
 * same form from the imported module values (see canon() in the test).
 */
export function canon(v) {
  if (v === null || typeof v === 'string' || typeof v === 'boolean') return v;
  if (typeof v === 'number') return v;
  if (Array.isArray(v)) return v.map(canon);
  if (isTaggedNode(v)) {
    switch (v.$t) {
      case 'undefined': return { $undefined: true };
      case 'number': return { $number: v.v };
      case 'bigint': return { $bigint: v.v };
      case 'set': return { $set: v.v.map(canon) };
      case 'map': return { $map: v.v.map(([k, x]) => [canon(k), canon(x)]) };
      case 'param': return canon(v.sample);
      default: throw new Error(`Cannot canonicalise a value tagged "${v.$t}"`);
    }
  }
  const out = {};
  for (const k of Object.keys(v)) out[k] = canon(v[k]);
  return out;
}

/* ------------------------------------------------------------------ */
/* types                                                               */
/* ------------------------------------------------------------------ */

const MARKER_KEYS = { $date: 'DateValue', $regexp: 'RegExpValue', $dom: 'DomRef', $instance: 'InstanceRef', $cycle: 'CycleRef' };

const emptyShape = () => ({ prims: new Set(), obj: null, arr: null, set: null, map: null, env: null, fn: null, named: new Set() });

function mergeInto(a, b) {
  for (const p of b.prims) a.prims.add(p);
  for (const n of b.named) a.named.add(n);
  if (b.obj) {
    if (!a.obj) a.obj = { n: 0, keys: new Map() };
    a.obj.n += b.obj.n;
    for (const [k, e] of b.obj.keys) {
      const cur = a.obj.keys.get(k);
      if (cur) { cur.count += e.count; mergeInto(cur.shape, e.shape); }
      else a.obj.keys.set(k, { count: e.count, shape: cloneShape(e.shape) });
    }
  }
  if (b.arr) {
    if (!a.arr) a.arr = { n: 0, lens: new Map(), elem: emptyShape(), idx: [] };
    a.arr.n += b.arr.n;
    for (const [len, c] of b.arr.lens) a.arr.lens.set(len, (a.arr.lens.get(len) || 0) + c);
    mergeInto(a.arr.elem, b.arr.elem);
    b.arr.idx.forEach((s, i) => { if (!a.arr.idx[i]) a.arr.idx[i] = emptyShape(); mergeInto(a.arr.idx[i], s); });
  }
  if (b.set) { if (!a.set) a.set = { elem: emptyShape() }; mergeInto(a.set.elem, b.set.elem); }
  if (b.map) { if (!a.map) a.map = { k: emptyShape(), v: emptyShape() }; mergeInto(a.map.k, b.map.k); mergeInto(a.map.v, b.map.v); }
  if (b.env) { if (!a.env) a.env = { inner: emptyShape() }; mergeInto(a.env.inner, b.env.inner); }
  if (b.fn) {
    if (!a.fn) a.fn = { returns: null };
    if (b.fn.returns) { if (!a.fn.returns) a.fn.returns = emptyShape(); mergeInto(a.fn.returns, b.fn.returns); }
  }
  return a;
}
const cloneShape = s => mergeInto(emptyShape(), s);

export function shapeOf(v) {
  const s = emptyShape();
  if (v === null) { s.prims.add('null'); return s; }
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') { s.prims.add(typeof v); return s; }
  if (Array.isArray(v)) {
    s.arr = { n: 1, lens: new Map([[v.length, 1]]), elem: emptyShape(), idx: [] };
    v.forEach((x, i) => { const xs = shapeOf(x); mergeInto(s.arr.elem, xs); s.arr.idx[i] = xs; });
    return s;
  }
  if (isTaggedNode(v)) {
    switch (v.$t) {
      case 'undefined': s.prims.add('undefined'); return s;
      case 'number': s.prims.add('number'); return s;
      case 'bigint': s.prims.add('bigint'); return s;
      case 'set': s.set = { elem: emptyShape() }; v.v.forEach(x => mergeInto(s.set.elem, shapeOf(x))); return s;
      case 'map': s.map = { k: emptyShape(), v: emptyShape() }; v.v.forEach(([k, x]) => { mergeInto(s.map.k, shapeOf(k)); mergeInto(s.map.v, shapeOf(x)); }); return s;
      case 'param': return shapeOf(v.sample);
      default: throw new Error(`Cannot type a value tagged "${v.$t}"`);
    }
  }
  const keys = Object.keys(v);
  if (keys[0] === '$env') { s.env = { inner: shapeOf(v.sample) }; return s; }
  if (keys[0] === '$fn') { s.fn = { returns: 'returns' in v.$fn ? shapeOf(v.$fn.returns) : null }; return s; }
  if (keys.length === 1 && MARKER_KEYS[keys[0]]) { s.named.add(MARKER_KEYS[keys[0]]); return s; }
  s.obj = { n: 1, keys: new Map() };
  for (const k of keys) s.obj.keys.set(k, { count: 1, shape: shapeOf(v[k]) });
  return s;
}

/** A coarse signature used to decide whether array positions differ in kind. */
function signature(s) {
  const parts = [...s.prims].filter(p => p !== 'null' && p !== 'undefined').sort();
  if (s.obj) parts.push('obj');
  if (s.arr) parts.push('arr');
  if (s.set) parts.push('set');
  if (s.map) parts.push('map');
  if (s.env) parts.push('env');
  if (s.fn) parts.push('fn');
  for (const n of [...s.named].sort()) parts.push(n);
  return parts.join('|');
}

const onlyKind = (s, kind) => {
  const has = { prim: s.prims.size > 0, obj: !!s.obj, arr: !!s.arr, other: !!(s.set || s.map || s.env || s.fn || s.named.size) };
  return Object.entries(has).every(([k, v]) => (k === kind ? v : !v));
};

/**
 * @param {object} o
 * @param {boolean} o.readonly  true for data modules, false for the mutable initial state
 * @param {Set<string>} [o.names]  type names already taken (shared across modules so names stay unique)
 * @returns {{ typeOf(value, baseName): string, typeOfShape(shape, baseName): string, decls: string[], usedMarkers: Set<string> }}
 */
export function createTyper({ readonly, names = new Set() }) {
  const decls = [];
  const bodies = new Map();
  const aliases = new Set();
  const usedMarkers = new Set();
  const ro = readonly ? 'readonly ' : '';

  const uniqueName = base => {
    let name = base, i = 2;
    while (names.has(name)) name = base + i++;
    names.add(name);
    return name;
  };

  const isDict = obj => {
    const entries = [...obj.keys.values()];
    if (!entries.length) return true; // {} : open-ended
    const allObj = entries.every(e => onlyKind(e.shape, 'obj'));
    const allArr = entries.every(e => onlyKind(e.shape, 'arr'));
    const primKinds = new Set(entries.flatMap(e => [...e.shape.prims]));
    const allSamePrim = entries.every(e => onlyKind(e.shape, 'prim')) && primKinds.size === 1;
    if (!allObj && !allArr && !allSamePrim) return false;
    const anyOddKey = [...obj.keys.keys()].some(k => !IDENT.test(k));
    if (obj.n === 1) {
      if (allObj || allArr) return entries.length >= 3 || anyOddKey;
      return entries.length >= 6 || anyOddKey;
    }
    const uniform = entries.every(e => e.count === obj.n);
    return !uniform && (anyOddKey || entries.length >= 6);
  };

  const objType = (obj, name) => {
    if (isDict(obj)) {
      const merged = emptyShape();
      for (const e of obj.keys.values()) mergeInto(merged, e.shape);
      // {} at capture time: nothing is known about its values, so `never`
      // (assignable to any wider record type the app declares).
      const v = obj.keys.size ? typeOfShape(merged, name + 'Value') : 'never';
      return readonly ? `Readonly<Record<string, ${v}>>` : `Record<string, ${v}>`;
    }
    const lines = [];
    for (const [k, e] of obj.keys) {
      const optional = e.count < obj.n ? '?' : '';
      lines.push(`  ${ro}${keyLit(k)}${optional}: ${typeOfShape(e.shape, name + pascal(k))};`);
    }
    const body = lines.join('\n');
    if (bodies.has(body)) {
      // Same shape as an interface already declared in this module: keep the
      // natural name as an alias so every constant has a type named after it.
      const existing = bodies.get(body);
      if (aliases.has(name + '=' + existing)) return name;
      if (names.has(name)) return existing;
      names.add(name);
      aliases.add(name + '=' + existing);
      decls.push(`export type ${name} = ${existing};`);
      return name;
    }
    const finalName = uniqueName(name);
    bodies.set(body, finalName);
    decls.push(`export interface ${finalName} {\n${body}\n}`);
    return finalName;
  };

  /** True when `t` has a union or a `readonly` operator at the top level, so it needs parentheses as an element type. */
  const needsParens = t => {
    if (t.startsWith('readonly ')) return true;
    let depth = 0;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (c === '<' || c === '[' || c === '(' || c === '{') depth++;
      else if (c === '>' || c === ']' || c === ')' || c === '}') depth--;
      else if (c === '|' && depth === 0) return true;
    }
    return false;
  };
  const wrapElem = t => (needsParens(t) ? `(${t})` : t);

  const arrType = (arr, name) => {
    const lens = [...arr.lens.keys()];
    const maxLen = Math.max(...lens), minLen = Math.min(...lens);
    if (maxLen === 0) return `${ro}never[]`; // always empty at capture time
    const sigs = new Set(arr.idx.map(signature));
    // Positions of different kinds (['07:00', 'Lecture', 1]) make a tuple;
    // positions of one kind make a list.
    if (sigs.size > 1 && maxLen <= 8) {
      const parts = arr.idx.map((s, i) => {
        const t = typeOfShape(s, `${name}Item${i}`);
        if (i < minLen) return t;
        return (needsParens(t) ? `(${t})` : t) + '?';
      });
      return `${ro}[${parts.join(', ')}]`;
    }
    return `${ro}${wrapElem(typeOfShape(arr.elem, name + 'Item'))}[]`;
  };

  const typeOfShape = (s, name) => {
    const parts = [];
    for (const p of ['string', 'number', 'boolean', 'bigint']) if (s.prims.has(p)) parts.push(p);
    if (s.obj) parts.push(objType(s.obj, name));
    if (s.arr) parts.push(arrType(s.arr, name));
    if (s.set) parts.push(`${readonly ? 'ReadonlySet' : 'Set'}<${typeOfShape(s.set.elem, name + 'Item')}>`);
    if (s.map) parts.push(`${readonly ? 'ReadonlyMap' : 'Map'}<${typeOfShape(s.map.k, name + 'Key')}, ${typeOfShape(s.map.v, name + 'Value')}>`);
    if (s.env) { usedMarkers.add('EnvDerived'); parts.push(`EnvDerived<${typeOfShape(s.env.inner, name)}>`); }
    if (s.fn) { usedMarkers.add('FnMarker'); parts.push(s.fn.returns ? `FnMarker<${typeOfShape(s.fn.returns, name + 'Returns')}>` : 'FnMarker'); }
    for (const n of [...s.named].sort()) { usedMarkers.add(n); parts.push(n); }
    if (s.prims.has('null')) parts.push('null');
    if (s.prims.has('undefined')) parts.push('undefined');
    return parts.length ? parts.join(' | ') : 'never'; // e.g. the element type of an empty Set
  };

  return {
    decls,
    usedMarkers,
    typeOfShape,
    typeOf: (value, baseName) => typeOfShape(shapeOf(value), baseName),
    reserve: name => names.add(name),
  };
}
