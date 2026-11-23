// Tagged serialisation of runtime values.
//
// The page-side function below turns any JS value into JSON without losing
// information that plain JSON drops. Anything that is not a plain
// string / finite number / boolean / null / array / plain object becomes a
// tagged node: { "$t": <tag>, ... }.
//
//   undefined            { $t: 'undefined' }
//   NaN, ±Infinity, -0   { $t: 'number', v: 'NaN' | 'Infinity' | '-Infinity' | '-0' }
//   bigint               { $t: 'bigint', v: '<digits>' }
//   Set                  { $t: 'set', v: [ ...items ] }
//   Map                  { $t: 'map', v: [ [key, value], ... ] }
//   Date                 { $t: 'date', v: <epoch ms>, iso: <ISO string> }
//   RegExp               { $t: 'regexp', source, flags }
//   function             { $t: 'function', name, params, code: <Function#toString()>, returns? }
//   DOM node             { $t: 'dom', v: '<tag#id.class>' }
//   other class instance { $t: 'instance', ctor: <constructor name> }
//   symbol               { $t: 'symbol', v: <description> }
//   circular reference   { $t: 'cycle', to: <path of the ancestor> }
//   array hole           { $t: 'hole' }
//   symbol-keyed props   recorded under "$symbols": { $t: 'symbols', v: [descriptions] }
//
// A plain object in the page that itself owns a "$t" key would be ambiguous,
// so the serialiser throws if it ever meets one.

/** Source text of the page-side serialiser. Evaluate as `(${SERIALIZER})(value, callFns)`. */
export const SERIALIZER = String(function serialise(root, callFns) {
  const stack = [];
  const paths = [];
  const walk = (v, path) => {
    if (v === undefined) return { $t: 'undefined' };
    if (v === null) return null;
    const type = typeof v;
    if (type === 'string' || type === 'boolean') return v;
    if (type === 'number') {
      if (Number.isNaN(v)) return { $t: 'number', v: 'NaN' };
      if (v === Infinity) return { $t: 'number', v: 'Infinity' };
      if (v === -Infinity) return { $t: 'number', v: '-Infinity' };
      if (Object.is(v, -0)) return { $t: 'number', v: '-0' };
      return v;
    }
    if (type === 'bigint') return { $t: 'bigint', v: String(v) };
    if (type === 'symbol') return { $t: 'symbol', v: v.description === undefined ? null : v.description };
    if (type === 'function') {
      const node = { $t: 'function', name: v.name || '', params: v.length, code: Function.prototype.toString.call(v) };
      // Only on request, and only for zero-argument arrow functions: record
      // what the template function returns, so its content is kept.
      if (callFns && v.length === 0 && /^\(\)\s*=>/.test(node.code)) node.returns = walk(v(), path + '()');
      return node;
    }

    const at = stack.indexOf(v);
    if (at >= 0) return { $t: 'cycle', to: paths[at] };

    if (typeof Node !== 'undefined' && v instanceof Node) {
      let d = v.nodeName.toLowerCase();
      if (v.id) d += '#' + v.id;
      if (typeof v.className === 'string' && v.className) d += '.' + v.className.trim().split(/\s+/).join('.');
      return { $t: 'dom', v: d };
    }
    if (v instanceof Date) return { $t: 'date', v: v.getTime(), iso: Number.isNaN(v.getTime()) ? null : v.toISOString() };
    if (v instanceof RegExp) return { $t: 'regexp', source: v.source, flags: v.flags };

    stack.push(v); paths.push(path);
    let out;
    if (v instanceof Set) {
      out = { $t: 'set', v: [...v].map((x, i) => walk(x, path + '<' + i + '>')) };
    } else if (v instanceof Map) {
      out = { $t: 'map', v: [...v].map(([k, x], i) => [walk(k, path + '<key ' + i + '>'), walk(x, path + '<value ' + i + '>')]) };
    } else if (Array.isArray(v)) {
      out = [];
      for (let i = 0; i < v.length; i++) out.push(i in v ? walk(v[i], path + '[' + i + ']') : { $t: 'hole' });
      const extra = Object.keys(v).filter(k => String(k >>> 0) !== k || (k >>> 0) >= v.length);
      if (extra.length) throw new Error('Array with non-index keys at ' + path + ': ' + extra.join(','));
    } else {
      const proto = Object.getPrototypeOf(v);
      if (proto !== null && proto !== Object.prototype) {
        const ctor = proto.constructor && proto.constructor.name;
        out = { $t: 'instance', ctor: ctor || '' };
      } else {
        out = {};
        // Symbol-keyed properties cannot be data from the prototype's
        // scripts (none of them create symbols); they are recorded, not lost.
        const syms = Object.getOwnPropertySymbols(v);
        if (syms.length) out.$symbols = { $t: 'symbols', v: syms.map(s => String(s.description)) };
        for (const k of Object.keys(v)) {
          if (k === '$t' || k === '$symbols') throw new Error('Data object owns a "' + k + '" key at ' + path);
          out[k] = walk(v[k], path + '.' + k);
        }
      }
    }
    stack.pop(); paths.pop();
    return out;
  };
  return JSON.stringify(walk(root, '$'));
});

export const isTagged = v => v !== null && typeof v === 'object' && !Array.isArray(v) && typeof v.$t === 'string';

/** Leaf-level differences between two tagged values, as a list of paths. */
export function diffTagged(a, b, rootPath) {
  const out = [];
  const leaf = v => v === null || typeof v !== 'object';
  const go = (x, y, path) => {
    if (leaf(x) || leaf(y)) { if (x !== y) out.push(path); return; }
    if (Array.isArray(x) !== Array.isArray(y)) { out.push(path); return; }
    if (Array.isArray(x)) {
      if (x.length !== y.length) { out.push(path); return; }
      x.forEach((v, i) => go(v, y[i], `${path}[${i}]`));
      return;
    }
    const tx = isTagged(x), ty = isTagged(y);
    if (tx || ty) {
      if (!tx || !ty || x.$t !== y.$t) { out.push(path); return; }
      if (x.$t === 'set') {
        if (x.v.length !== y.v.length) { out.push(path); return; }
        x.v.forEach((v, i) => go(v, y.v[i], `${path}<${i}>`));
        return;
      }
      if (x.$t === 'map') {
        if (x.v.length !== y.v.length) { out.push(path); return; }
        x.v.forEach(([k, v], i) => { go(k, y.v[i][0], `${path}<key ${i}>`); go(v, y.v[i][1], `${path}<value ${i}>`); });
        return;
      }
      if (JSON.stringify(x) !== JSON.stringify(y)) out.push(path);
      return;
    }
    const kx = Object.keys(x), ky = Object.keys(y);
    if (kx.length !== ky.length || kx.some((k, i) => k !== ky[i])) { out.push(path); return; }
    for (const k of kx) go(x[k], y[k], `${path}.${k}`);
  };
  go(a, b, rootPath);
  return out;
}
