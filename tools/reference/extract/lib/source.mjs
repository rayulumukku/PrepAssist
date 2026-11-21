// Reads PrepAssist.html and analyses its scripts with the TypeScript parser.
// Nothing here rewrites content: the parser is used only to locate things
// (declarations, IIFE bodies, handler definitions, literal slices).
import fs from 'node:fs';
import { loadTypeScript } from './paths.mjs';

/** @typedef {{ index:number, id:string|null, attrs:string, code:string, codeStart:number, startLine:number, endLine:number, sf:any }} ScriptBlock */

export function loadSource(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const lineStarts = [0];
  for (let i = 0; i < html.length; i++) if (html.charCodeAt(i) === 10) lineStarts.push(i + 1);

  /** 1-based line and 0-based column of an absolute offset in the HTML. */
  const lineCol = offset => {
    let lo = 0, hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= offset) lo = mid; else hi = mid - 1;
    }
    return { line: lo + 1, col: offset - lineStarts[lo] };
  };
  const lineOf = offset => lineCol(offset).line;

  const ts = loadTypeScript();
  /** @type {ScriptBlock[]} */
  const scripts = [];
  // <script> elements cannot nest and the prototype never writes "</script>"
  // inside a string, which the parse check below would catch.
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    const codeStart = m.index + m[0].indexOf('>') + 1;
    const code = m[2];
    const idMatch = /\bid="([^"]*)"/.exec(m[1]);
    const sf = ts.createSourceFile(`script${scripts.length}.js`, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    if (sf.parseDiagnostics.length) {
      const d = sf.parseDiagnostics[0];
      throw new Error(`Script at L${lineOf(codeStart)} does not parse: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
    }
    scripts.push({
      index: scripts.length,
      id: idMatch ? idMatch[1] : null,
      attrs: m[1].trim(),
      code,
      codeStart,
      startLine: lineOf(codeStart),
      endLine: lineOf(codeStart + code.length),
      sf,
    });
  }

  return { htmlPath, html, lineStarts, lineCol, lineOf, scripts, ts };
}

const scriptLabel = s => (s.id ? `#${s.id}` : `script@L${s.startLine}`);

/**
 * Enumerates every binding the scripts create at script top level and at the
 * top level of each immediately-invoked function (IIFE), the IIFEs
 * themselves, top-level mutation statements, and `window.X = ...` assignments.
 */
export function analyseScripts(source) {
  const { ts, scripts, lineCol, lineOf } = source;
  const bindings = [];
  const iifes = [];
  const mutations = [];
  const windowAssigns = [];

  for (const script of scripts) {
    const { sf, codeStart } = script;
    const abs = pos => codeStart + pos;
    const range = node => ({ from: lineOf(abs(node.getStart(sf))), to: lineOf(abs(node.end)) });

    const bindingNames = name => {
      if (ts.isIdentifier(name)) return [name.text];
      const out = [];
      for (const el of name.elements) if (!ts.isOmittedExpression(el)) out.push(...bindingNames(el.name));
      return out;
    };

    const unwrapParens = n => { while (ts.isParenthesizedExpression(n)) n = n.expression; return n; };

    /** Returns the function node if `expr` is an immediately-invoked function. */
    const asIife = expr => {
      let e = unwrapParens(expr);
      if (ts.isPrefixUnaryExpression(e)) e = unwrapParens(e.operand);
      if (!ts.isCallExpression(e)) return null;
      const callee = unwrapParens(e.expression);
      if ((ts.isFunctionExpression(callee) || ts.isArrowFunction(callee)) && callee.body && ts.isBlock(callee.body)) return callee;
      return null;
    };

    const rootIdentifier = expr => {
      let e = expr;
      while (ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e) || ts.isCallExpression(e) || ts.isParenthesizedExpression(e) || ts.isNonNullExpression?.(e)) e = e.expression;
      return ts.isIdentifier(e) ? e.text : null;
    };

    const recordWindowAssign = (expr, scopeId) => {
      // window.NAME = value  (also when chained: const NT = window.NT = {})
      let e = unwrapParens(expr);
      while (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
        const left = e.left;
        if (ts.isPropertyAccessExpression(left) && ts.isIdentifier(left.expression) && left.expression.text === 'window') {
          const w = { name: left.name.text, script: scriptLabel(script), scope: scopeId, ...range(e) };
          let rhs = unwrapParens(e.right);
          while (ts.isBinaryExpression(rhs) && rhs.operatorToken.kind === ts.SyntaxKind.EqualsToken) rhs = unwrapParens(rhs.right);
          Object.defineProperty(w, 'initNode', { value: rhs, enumerable: false });
          Object.defineProperty(w, 'initText', { value: rhs.getText(sf), enumerable: false });
          windowAssigns.push(w);
        }
        e = unwrapParens(e.right);
      }
    };

    const recordMutation = (stmt, scopeId) => {
      const e = unwrapParens(stmt.expression);
      let root = null, how = null;
      if (ts.isBinaryExpression(e) && e.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && e.operatorToken.kind <= ts.SyntaxKind.LastAssignment) {
        if (ts.isIdentifier(e.left)) { root = e.left.text; how = 'reassign'; }
        else { root = rootIdentifier(e.left); how = 'assign-member'; }
      } else if (ts.isCallExpression(e)) {
        const callee = e.expression;
        if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.expression) && callee.expression.text === 'Object' && callee.name.text === 'assign' && e.arguments.length) {
          root = rootIdentifier(e.arguments[0]); how = 'Object.assign';
        } else if (ts.isPropertyAccessExpression(callee)) {
          root = rootIdentifier(callee.expression); how = `.${callee.name.text}()`;
        }
      }
      if (root) mutations.push({ root, how, script: scriptLabel(script), scope: scopeId, ...range(stmt) });
    };

    /** Collects `var` names hoisted out of nested blocks (never out of functions). */
    const hoistedVars = (node, out) => {
      ts.forEachChild(node, child => {
        if (ts.isFunctionLike(child) || ts.isClassLike(child)) return;
        if (ts.isVariableDeclarationList(child) && !(child.flags & ts.NodeFlags.BlockScoped)) {
          for (const d of child.declarations) for (const n of bindingNames(d.name)) out.push({ name: n, node: d });
        }
        hoistedVars(child, out);
      });
    };

    const walkStatements = (statements, scopeId) => {
      for (const st of statements) {
        if (ts.isVariableStatement(st)) {
          const flags = st.declarationList.flags;
          const kind = flags & ts.NodeFlags.Const ? 'const' : flags & ts.NodeFlags.Let ? 'let' : 'var';
          for (const d of st.declarationList.declarations) {
            for (const name of bindingNames(d.name)) {
              const b = {
                name, kind, scope: scopeId, script: scriptLabel(script), ...range(d),
                init: d.initializer ? ts.SyntaxKind[d.initializer.kind] : null,
              };
              // Kept off the enumerable surface: only used to cross-check literals.
              if (d.initializer && ts.isIdentifier(d.name)) Object.defineProperty(b, 'initNode', { value: d.initializer, enumerable: false });
              if (d.initializer && ts.isIdentifier(d.name)) Object.defineProperty(b, 'initText', { value: d.initializer.getText(sf), enumerable: false });
              bindings.push(b);
            }
            if (d.initializer) recordWindowAssign(d.initializer, scopeId);
          }
        } else if (ts.isFunctionDeclaration(st) && st.name) {
          bindings.push({ name: st.name.text, kind: 'function', scope: scopeId, script: scriptLabel(script), ...range(st), init: 'FunctionDeclaration' });
        } else if (ts.isClassDeclaration(st) && st.name) {
          bindings.push({ name: st.name.text, kind: 'class', scope: scopeId, script: scriptLabel(script), ...range(st), init: 'ClassDeclaration' });
        } else if (ts.isExpressionStatement(st)) {
          const fn = asIife(st.expression);
          if (fn) {
            const close = fn.body.end - 1; // offset of the closing brace
            if (script.code[close] !== '}') throw new Error(`IIFE at L${range(st).from}: closing brace not found`);
            const lc = lineCol(abs(close));
            const id = `iife@L${range(st).from}`;
            const r = range(st);
            iifes.push({
              id, script: scriptLabel(script), parentScope: scopeId, from: r.from, to: r.to,
              name: fn.name ? fn.name.text : null,
              closeLine: lc.line, closeCol: lc.col,
            });
            if (fn.name) bindings.push({ name: fn.name.text, kind: 'function-expression-name', scope: id, script: scriptLabel(script), ...r, init: 'FunctionExpression' });
            for (const p of fn.parameters) for (const n of bindingNames(p.name)) bindings.push({ name: n, kind: 'param', scope: id, script: scriptLabel(script), ...range(p), init: null });
            walkStatements(fn.body.statements, id);
          } else {
            recordMutation(st, scopeId);
            recordWindowAssign(st.expression, scopeId);
          }
        } else {
          // Compound statements (if / try / for …): only hoisted `var`s escape.
          const vars = [];
          hoistedVars(st, vars);
          for (const v of vars) bindings.push({ name: v.name, kind: 'var', scope: scopeId, script: scriptLabel(script), ...range(v.node), init: v.node.initializer ? ts.SyntaxKind[v.node.initializer.kind] : null });
          // …and function declarations in blocks at script level are hoisted
          // in sloppy mode; record them so nothing goes missing.
          const visit = node => ts.forEachChild(node, child => {
            if (ts.isFunctionDeclaration(child) && child.name) {
              bindings.push({ name: child.name.text, kind: 'function', scope: scopeId, script: scriptLabel(script), ...range(child), init: 'FunctionDeclaration(block)' });
              return;
            }
            if (ts.isFunctionLike(child)) return;
            visit(child);
          });
          visit(st);
        }
      }
    };

    walkStatements(sf.statements, 'global');
  }

  return { bindings, iifes, mutations, windowAssigns };
}

/**
 * Finds the 1-based line range of an exact text inside the script blocks
 * (used to locate the source of a function found inside data).
 */
export function locateText(source, text) {
  for (const s of source.scripts) {
    const i = s.code.indexOf(text);
    if (i >= 0) return { from: source.lineOf(s.codeStart + i), to: source.lineOf(s.codeStart + i + text.length) };
  }
  return null;
}
