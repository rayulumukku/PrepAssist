// Data written inline inside functions (not as a named constant), e.g. the
// task list inside renderHome(). These cannot be read at runtime, so they are
// taken from the source: the exact slice of each literal is evaluated in an
// empty, isolated context. Only literals that reference nothing outside
// themselves ("pure") can be evaluated; the others are listed with their
// source text so a porter can see them, but are not turned into data.
import vm from 'node:vm';

/** Why an expression cannot be evaluated on its own, or null if it can (literals only). */
export function impurityOf(ts, n) {
  let why = null;
  const walk = x => {
    if (why) return;
    if (ts.isFunctionLike(x)) { why = 'contains a function'; return; }
    if (ts.isTemplateExpression(x)) { why = 'contains a template with ${…}'; return; }
    if (ts.isSpreadElement(x) || ts.isSpreadAssignment(x)) { why = 'contains a spread'; return; }
    if (ts.isShorthandPropertyAssignment(x)) { why = `uses the variable ${x.name.text}`; return; }
    if (ts.isIdentifier(x)) {
      const p = x.parent;
      const isKey = p && ts.isPropertyAssignment(p) && p.name === x;
      if (!isKey) { why = `uses the variable ${x.text}`; return; }
    }
    if (ts.isCallExpression(x) || ts.isNewExpression(x)) { why = 'contains a call'; return; }
    ts.forEachChild(x, walk);
  };
  walk(n);
  return why;
}

/** Evaluates the exact source text of a pure literal in an empty, isolated context. */
export function evaluateSlice(text) {
  return JSON.parse(JSON.stringify(vm.runInNewContext(`(${text})`, Object.create(null), { timeout: 1000 })));
}

const MIN_STRINGS = 3;
const MIN_STRING_CHARS = 60;

export function findInlineLiterals(source) {
  const { ts, scripts, lineOf } = source;
  const out = [];

  for (const script of scripts) {
    const { sf, codeStart } = script;
    const label = script.id ? `#${script.id}` : `script@L${script.startLine}`;
    const line = pos => lineOf(codeStart + pos);
    const isLiteral = n => ts.isArrayLiteralExpression(n) || ts.isObjectLiteralExpression(n);
    const unwrap = n => { while (ts.isParenthesizedExpression(n)) n = n.expression; return n; };

    // Script-level IIFE wrappers do not count as "inside a function": their
    // top-level constants are read at runtime instead.
    const wrappers = new Set();
    for (const st of sf.statements) {
      if (!ts.isExpressionStatement(st)) continue;
      let e = unwrap(st.expression);
      if (ts.isPrefixUnaryExpression(e)) e = unwrap(e.operand);
      if (!ts.isCallExpression(e)) continue;
      const callee = unwrap(e.expression);
      if (ts.isFunctionExpression(callee) || ts.isArrowFunction(callee)) wrappers.add(callee);
    }

    /** Functions enclosing `n`, innermost first, without script-level IIFE wrappers. */
    const enclosing = n => {
      const fns = [];
      for (let p = n.parent; p; p = p.parent) if (ts.isFunctionLike(p) && !wrappers.has(p)) fns.push(p);
      return fns;
    };
    const fnName = f => {
      if (f.name && ts.isIdentifier(f.name)) return f.name.text;
      const p = f.parent;
      if (p && (ts.isVariableDeclaration(p) || ts.isPropertyAssignment(p)) && p.name) return p.name.getText(sf);
      if (p && ts.isBinaryExpression(p) && p.right === f) return p.left.getText(sf);
      return null;
    };

    const measure = n => {
      let strings = 0, chars = 0, fnLike = false;
      const walk = x => {
        if (ts.isStringLiteralLike(x)) { strings++; chars += x.text.length; }
        else if (ts.isTemplateExpression(x)) { strings++; chars += x.getText(sf).length; }
        if (ts.isFunctionLike(x)) fnLike = true;
        ts.forEachChild(x, walk);
      };
      walk(n);
      return { strings, chars, fnLike };
    };

    const impurity = n => impurityOf(ts, n);

    const visit = n => {
      if (isLiteral(n)) {
        const fns = enclosing(n);
        if (fns.length) {
          const m = measure(n);
          if (m.strings >= MIN_STRINGS && m.chars >= MIN_STRING_CHARS) {
            const p = n.parent;
            let role = ts.SyntaxKind[p.kind];
            if (ts.isVariableDeclaration(p)) role = `const ${p.name.getText(sf)}`;
            else if (ts.isPropertyAccessExpression(p)) role = `literal.${p.name.text}(…)`;
            else if (ts.isElementAccessExpression(p)) role = 'lookup table literal[…]';
            else if (ts.isReturnStatement(p)) role = 'return value';
            else if (ts.isCallExpression(p)) role = `argument of ${p.expression.getText(sf).slice(0, 40)}`;
            const text = n.getText(sf);
            const why = impurity(n);
            const names = fns.map(fnName);
            const item = {
              function: names.find(Boolean) || '(anonymous)',
              role,
              from: line(n.getStart(sf)), to: line(n.end),
              script: label,
              strings: m.strings,
              pure: why === null,
              notEvaluatedBecause: why,
              source: text,
            };
            if (why === null) {
              // A pure literal holds only JSON values, so the JSON round trip inside is exact.
              item.value = evaluateSlice(text);
            }
            out.push(item);
          }
          return; // outermost literal only
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }

  // Stable, unique ids.
  const seen = new Map();
  for (const item of out) {
    const base = `${item.function.replace(/[^A-Za-z0-9_$]/g, '_')}_L${item.from}`;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    item.id = n === 1 ? base : `${base}_${n}`;
  }
  return out;
}
