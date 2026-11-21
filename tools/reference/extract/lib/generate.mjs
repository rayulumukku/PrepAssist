// The whole extraction, as a pure function of PrepAssist.html: returns the
// generated files (relative path -> content) and a report. extract.mjs writes
// them into the repo; verify.mjs writes them to a temp dir and compares.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { HTML_PATH, HTML_NAME, REPO_ROOT } from './paths.mjs';
import { loadSource, analyseScripts, locateText } from './source.mjs';
import { captureRuntime, withLivePage } from './runtime.mjs';
import { diffTagged, isTagged } from './serialize.mjs';
import { createTyper, printValue, canon, strLit, keyLit, pascal, shapeOf } from './emit-ts.mjs';
import { buildActionsMap } from './actions.mjs';
import { READ_SYMBOLS, buildIcons, emitIconsModule } from './icons.mjs';
import { PARSE_MARKUP, buildMarkupInventory, analyseXrayMarkup, contentStrings } from './inventory.mjs';
import { findInlineLiterals, impurityOf, evaluateSlice } from './inline.mjs';
import { PARSE_TEMPLATES, buildTemplateInventory } from './templates.mjs';
import { REFERENCE_ENV, ALT_CLOCK, ALT_TIMEZONE, MODULES, EXCLUDED, CALL_ZERO_ARG_FUNCTIONS, ENV_NOTES, TEMPLATE_SYMBOLS, STATIC_GROUP_SELECTOR } from '../config.mjs';

export const HEADER = '// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.';
const REGEN = '// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.';

const sha256 = s => createHash('sha256').update(s).digest('hex');
const json = v => JSON.stringify(v, null, 2) + '\n';
const lines = (from, to) => (from === to ? `L${from}` : `L${from}-L${to}`);

/** Runs in a live page: renders tabs, sheets and views and collects every data-act value. */
const HARVEST = String(function harvest() {
  const seen = [];
  const errors = [];
  const tpl = document.createElement('template');
  const fromHtml = (html, where) => {
    if (typeof html !== 'string') return;
    tpl.innerHTML = html;
    for (const el of tpl.content.querySelectorAll('[data-act]')) seen.push([el.getAttribute('data-act'), where]);
  };
  const fromDom = where => { for (const el of document.querySelectorAll('[data-act]')) seen.push([el.getAttribute('data-act'), where]); };
  const attempt = (label, fn) => { try { fn(); } catch (e) { errors.push(label + ': ' + (e && e.message || e)); } };

  fromDom('document at load');
  for (const stage of ['intro', 'auth', 'verify', 'app']) attempt('go(' + stage + ')', () => { go(stage); fromDom('stage ' + stage); });
  for (const tab of ['home', 'learn', 'practice', 'current', 'menu', 'profile']) attempt('setTab(' + tab + ')', () => { setTab(tab); fromDom('tab ' + tab); });
  for (const k of Object.keys(SHEETS)) attempt('SHEETS.' + k, () => fromHtml(SHEETS[k](), 'sheet ' + k));

  // Views: every key with no argument, then every view + argument that the
  // collected push:/article:/qbank: values point to, until nothing new shows up.
  const done = new Set();
  const queue = Object.keys(VIEWS).map(k => [k, undefined]);
  let cursor = 0;
  const enqueueFromSeen = () => {
    for (; cursor < seen.length; cursor++) {
      const raw = seen[cursor][0];
      const i = raw.indexOf(':');
      if (i < 0) continue;
      const verb = raw.slice(0, i), arg = raw.slice(i + 1);
      if (verb === 'push') { const j = arg.indexOf(':'); queue.push(j > 0 ? [arg.slice(0, j), arg.slice(j + 1)] : [arg, undefined]); }
      else if (verb === 'article' || verb === 'qbank') queue.push([verb, arg]);
    }
  };
  enqueueFromSeen();
  while (queue.length && done.size < 600) {
    const [view, arg] = queue.shift();
    const key = view + '\u0000' + arg;
    if (done.has(key) || !VIEWS[view]) continue;
    done.add(key);
    attempt('VIEWS.' + view + '(' + (arg === undefined ? '' : arg) + ')', () => {
      const v = VIEWS[view](arg);
      fromHtml(pageShell(v), 'view ' + view + (arg === undefined ? '' : ':' + arg));
    });
    enqueueFromSeen();
  }
  return { seen, errors, views: done.size };
});

/**
 * Runs in the page: objects reachable from more than one place among the given
 * script-level constants (the same object, not an equal copy). Changing such
 * an object through one constant changes it in the other.
 */
const FIND_SHARED = String(function findShared(names) {
  const first = new Map();
  const out = [];
  const walk = (v, path) => {
    if (v === null || typeof v !== 'object') return;
    if (v instanceof Node || v instanceof Set || v instanceof Map || v instanceof Date) return;
    if (first.has(v)) { out.push({ first: first.get(v), again: path }); return; }
    first.set(v, path);
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, path + '[' + i + ']'));
    else if (Object.getPrototypeOf(v) === Object.prototype) for (const k of Object.keys(v)) walk(v[k], path + '.' + k);
  };
  for (const n of names) walk((0, eval)(n), n);
  return out;
});

/** Array methods whose callback runs immediately, as part of the calling statement. */
const SYNC_METHODS = ['forEach', 'map', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex', 'flatMap', 'sort'];

/** Array methods that change the array in place. */
const MUTATING_METHODS = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin'];

export async function generate({ log = () => {} } = {}) {
  const files = new Map();
  const source = loadSource(HTML_PATH);
  const htmlSha = sha256(source.html);
  const analysis = analyseScripts(source);
  const { ts } = source;
  const srcRef = (from, to) => `${HTML_NAME} ${lines(from, to)}`;
  const locate = code => locateText(source, code);

  /* ---------------- scopes ---------------- */
  const scopeKey = {};
  for (const iife of analysis.iifes) {
    const script = source.scripts.find(s => (s.id ? `#${s.id}` : `script@L${s.startLine}`) === iife.script);
    const alone = analysis.iifes.filter(i => i.script === iife.script).length === 1;
    scopeKey[iife.id] = script.id && alone ? `#${script.id}` : iife.id;
  }

  /* ---------------- runtime captures ---------------- */
  log('Loading the page in Chromium (3 captures: reference, other clock, other timezone)…');
  const base = { htmlPath: HTML_PATH, iifes: analysis.iifes, locale: REFERENCE_ENV.locale, callFns: CALL_ZERO_ARG_FUNCTIONS };
  const sharedCandidates = analysis.bindings.filter(b => b.scope === 'global' && b.kind === 'const' && ['ArrayLiteralExpression', 'ObjectLiteralExpression'].includes(b.init)).map(b => b.name)
    .concat(analysis.windowAssigns.filter(w => w.initNode && (ts.isArrayLiteralExpression(w.initNode) || ts.isObjectLiteralExpression(w.initNode))).map(w => w.name));
  const liveTasks = async page => ({
    sharedObjects: await page.evaluate(`(${FIND_SHARED})(${JSON.stringify(sharedCandidates.filter(n => !['A', 'VIEWS', 'SHEETS'].includes(n)))})`),
    symbols: await page.evaluate(`(${READ_SYMBOLS})(document)`),
    templateSymbols: await Promise.all(TEMPLATE_SYMBOLS.map(async t => ({
      ...t,
      symbols: await page.evaluate(`(() => { const d = document.createElement('div'); d.innerHTML = ${t.expression}; return (${READ_SYMBOLS})(d); })()`),
    }))),
  });
  const [ref, altClock, altTz] = await Promise.all([
    captureRuntime({ ...base, clock: REFERENCE_ENV.clock, timezoneId: REFERENCE_ENV.timezoneId, afterCapture: liveTasks }),
    captureRuntime({ ...base, clock: ALT_CLOCK, timezoneId: REFERENCE_ENV.timezoneId }),
    captureRuntime({ ...base, clock: REFERENCE_ENV.clock, timezoneId: ALT_TIMEZONE }),
  ]);

  /* ---------------- binding table ---------------- */
  const valueIn = (cap, r) => {
    if (r.scopeId === 'window') return cap.windowAdded[r.name];
    if (r.scopeId === 'global') return ['const', 'let', 'class'].includes(r.kind) ? cap.globalLexical[r.name] : cap.windowAdded[r.name];
    return cap.iifeLocals[r.scopeId][r.name];
  };
  const records = [];
  for (const b of analysis.bindings) {
    const sk = b.scope === 'global' ? 'global' : scopeKey[b.scope];
    const r = { key: sk === 'global' ? b.name : `${b.name}@${sk}`, name: b.name, kind: b.kind, scope: sk, scopeId: b.scope, script: b.script, from: b.from, to: b.to };
    r.initNode = b.initNode; r.initText = b.initText;
    r.value = valueIn(ref, r);
    // The name of a function expression is a local only when its body uses it.
    if (r.value === undefined && b.kind === 'function-expression-name') continue;
    if (r.value === undefined) throw new Error(`${r.key} (L${b.from}) is declared in the source but was not found at runtime`);
    if (records.some(x => x.key === r.key)) throw new Error(`${r.key} is declared more than once in the same scope`);
    records.push(r);
  }
  // V8's own list of script-level const/let must match the parser's.
  const astLexical = records.filter(r => r.scope === 'global' && ['const', 'let', 'class'].includes(r.kind)).map(r => r.name);
  const extraLexical = Object.keys(ref.globalLexical).filter(n => !astLexical.includes(n));
  if (extraLexical.length) throw new Error(`Script-level bindings found at runtime but not by the parser: ${extraLexical}`);
  for (const iife of analysis.iifes) {
    const known = records.filter(r => r.scopeId === iife.id).map(r => r.name);
    const extra = Object.keys(ref.iifeLocals[iife.id]).filter(n => !known.includes(n));
    if (extra.length) throw new Error(`${iife.id}: locals found at runtime but not by the parser: ${extra}`);
  }
  // Globals the page added through `window.X = …`.
  for (const name of Object.keys(ref.windowAdded)) {
    if (records.some(r => r.scope === 'global' && r.name === name)) continue;
    const assigns = analysis.windowAssigns.filter(w => w.name === name);
    if (!assigns.length) throw new Error(`The page added window.${name} but no \`window.${name} = …\` statement was found`);
    const a = assigns[assigns.length - 1];
    const r = { key: `${name}@window`, name, kind: 'window', scope: 'window', scopeId: 'window', script: a.script, from: a.from, to: a.to, assignedIn: a.scope === 'global' ? 'global' : scopeKey[a.scope] };
    r.initNode = a.initNode; r.initText = a.initText;
    r.value = ref.windowAdded[name];
    records.push(r);
  }

  const isFn = v => isTagged(v) && v.$t === 'function';
  const isPlainObject = v => v !== null && typeof v === 'object' && !Array.isArray(v) && !isTagged(v);
  for (const r of records) {
    const v = r.value;
    if (r.key === 'S') { r.cls = 'state'; r.reason = EXCLUDED.S; }
    else if (r.key === 'I18N') { r.cls = 'i18n'; r.reason = EXCLUDED.I18N; }
    else if (isFn(v)) { r.cls = 'function'; r.reason = 'A function (code, not data).'; }
    else if (['let', 'var', 'param'].includes(r.kind)) { r.cls = 'mutable'; r.reason = `Declared with \`${r.kind}\`: a working variable of the page (timer ids, drag state, element lists…), not a constant.`; }
    else if (EXCLUDED[r.key]) { r.cls = 'excluded'; r.reason = EXCLUDED[r.key]; }
    else if (isTagged(v) && (v.$t === 'dom' || v.$t === 'instance')) { r.cls = 'handle'; r.reason = 'Holds a DOM node or a browser object.'; }
    else if (isPlainObject(v) && Object.keys(v).length && Object.values(v).every(isFn) && !CALL_ZERO_ARG_FUNCTIONS.includes(r.name)) {
      r.cls = 'function-table'; r.reason = 'An object whose members are all functions (code, not data).';
    } else r.cls = 'data';
  }
  for (const key of Object.keys(EXCLUDED)) if (!records.some(r => r.key === key)) throw new Error(`config EXCLUDED names "${key}", which does not exist`);

  /* ---------------- environment-derived values ---------------- */
  const envDerived = [];
  const envByRecord = new Map();
  for (const r of records) {
    if (!['data', 'state', 'i18n'].includes(r.cls)) continue;
    const kinds = new Map();
    for (const p of diffTagged(r.value, valueIn(altClock, r), r.key)) kinds.set(p, 'clock');
    for (const p of diffTagged(r.value, valueIn(altTz, r), r.key)) kinds.set(p, kinds.has(p) ? 'clock+timezone' : 'timezone');
    envByRecord.set(r.key, kinds);
    for (const [p, kind] of kinds) {
      const note = ENV_NOTES.find(n => n.pattern.test(p));
      if (!note) throw new Error(`${p} changes with the ${kind} but config ENV_NOTES has no entry for it. Read how the HTML computes it and add a note.`);
      envDerived.push({ constant: r.key, path: p, kind, source: note.source });
    }
  }

  /* ---------------- tagged capture -> emit tree ---------------- */
  const functionsInData = [];
  const toEmit = (v, p, env, mode, rootKey) => {
    const kind = env && env.get(p);
    if (kind) {
      const sample = toEmit(v, p, null, mode, rootKey);
      return mode === 'state' ? { $t: 'param', key: p.slice(rootKey.length + 1), sample } : { $env: kind, sample };
    }
    if (v === null || typeof v !== 'object') return v;
    if (Array.isArray(v)) return v.map((x, i) => toEmit(x, `${p}[${i}]`, env, mode, rootKey));
    if (isTagged(v)) {
      switch (v.$t) {
        case 'undefined': case 'number': case 'bigint': return v;
        case 'set': return { $t: 'set', v: v.v.map((x, i) => toEmit(x, `${p}<${i}>`, env, mode, rootKey)) };
        case 'map': return { $t: 'map', v: v.v.map(([k, x], i) => [toEmit(k, `${p}<key ${i}>`, env, mode, rootKey), toEmit(x, `${p}<value ${i}>`, env, mode, rootKey)]) };
        case 'date':
          if (v.iso === null) throw new Error(`${p}: invalid Date`);
          return { $date: v.iso };
        case 'regexp': return { $regexp: { source: v.source, flags: v.flags } };
        case 'function': {
          const at = locate(v.code);
          if (!at) throw new Error(`${p}: could not find the source of this function in the HTML`);
          const fn = { name: v.name, params: v.params, source: srcRef(at.from, at.to), code: v.code };
          if ('returns' in v) fn.returns = toEmit(v.returns, `${p}()`, env, mode, rootKey);
          functionsInData.push({ path: p, name: v.name, params: v.params, source: fn.source, returnsRecorded: 'returns' in v });
          return { $fn: fn };
        }
        case 'dom': return { $dom: v.v };
        case 'instance': return { $instance: v.ctor };
        case 'cycle': return { $cycle: v.to };
        default: throw new Error(`${p}: cannot export a value tagged "${v.$t}"`);
      }
    }
    const out = {};
    for (const k of Object.keys(v)) {
      if (k.startsWith('$')) throw new Error(`${p}: data key "${k}" would clash with the marker keys`);
      out[k] = toEmit(v[k], `${p}.${k}`, env, mode, rootKey);
    }
    return out;
  };

  /* ---------------- constants that handlers change after load ---------------- */
  // A constant that a function pushes to, splices or assigns into is really
  // state: the app has to copy it into its store instead of reading it.
  const runtimeChanges = new Map();
  {
    const dataNames = new Set(records.filter(r => r.cls === 'data').map(r => r.name));
    const rootOf = e => {
      while (ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e) || ts.isParenthesizedExpression(e)) e = e.expression;
      return ts.isIdentifier(e) ? e.text : null;
    };
    const note = (name, line, how) => {
      if (!dataNames.has(name)) return;
      if (!runtimeChanges.has(name)) runtimeChanges.set(name, []);
      const list = runtimeChanges.get(name);
      if (!list.some(x => x.line === line && x.how === how)) list.push({ line, how });
    };
    for (const script of source.scripts) {
      // Code that runs later than page load: inside a function that is neither
      // a script-level IIFE wrapper nor an inline callback of a synchronous
      // array method (forEach, map …) that itself runs at load.
      const unwrap = n => { while (ts.isParenthesizedExpression(n)) n = n.expression; return n; };
      const wrappers = new Set();
      for (const st of script.sf.statements) {
        if (!ts.isExpressionStatement(st)) continue;
        let e = unwrap(st.expression);
        if (ts.isPrefixUnaryExpression(e)) e = unwrap(e.operand);
        if (ts.isCallExpression(e)) { const c = unwrap(e.expression); if (ts.isFunctionExpression(c) || ts.isArrowFunction(c)) wrappers.add(c); }
      }
      const isSyncCallback = f => ts.isCallExpression(f.parent) && f.parent.arguments.includes(f) && ts.isPropertyAccessExpression(f.parent.expression) && SYNC_METHODS.includes(f.parent.expression.name.text);
      const insideFunction = n => {
        for (let p = n.parent; p; p = p.parent) if (ts.isFunctionLike(p) && !wrappers.has(p) && !isSyncCallback(p)) return true;
        return false;
      };
      const visit = node => {
        const line = () => source.lineOf(script.codeStart + node.getStart(script.sf));
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && MUTATING_METHODS.includes(node.expression.name.text)) {
          const root = rootOf(node.expression.expression);
          if (root && insideFunction(node)) note(root, line(), `.${node.expression.name.text}()`);
        } else if (ts.isBinaryExpression(node) && node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && node.operatorToken.kind <= ts.SyntaxKind.LastAssignment
          && (ts.isPropertyAccessExpression(node.left) || ts.isElementAccessExpression(node.left))) {
          const root = rootOf(node.left);
          if (root && insideFunction(node)) note(root, line(), 'assignment');
        } else if ((ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) && (node.operator === ts.SyntaxKind.PlusPlusToken || node.operator === ts.SyntaxKind.MinusMinusToken)
          && (ts.isPropertyAccessExpression(node.operand) || ts.isElementAccessExpression(node.operand))) {
          const root = rootOf(node.operand);
          if (root && insideFunction(node)) note(root, line(), '++/--');
        }
        ts.forEachChild(node, visit);
      };
      visit(script.sf);
    }
  }

  /* ---------------- data modules ---------------- */
  const dataRecords = records.filter(r => r.cls === 'data');
  const placed = new Map();
  for (const m of MODULES) for (const c of m.consts) {
    const r = records.find(x => x.key === c);
    if (!r) throw new Error(`config MODULES places "${c}" in ${m.file}.ts, but no such binding exists`);
    if (r.cls !== 'data') throw new Error(`config MODULES places "${c}", but it is classified "${r.cls}": ${r.reason}`);
    if (placed.has(c)) throw new Error(`config MODULES places "${c}" twice`);
    placed.set(c, m.file);
  }
  const unplaced = dataRecords.filter(r => !placed.has(r.key));
  if (unplaced.length) {
    throw new Error('These constants are not placed in any module (add them to MODULES or EXCLUDED in extract/config.mjs):\n' +
      unplaced.map(r => `  ${r.key}  ${srcRef(r.from, r.to)}`).join('\n'));
  }

  const typeNames = new Set();
  const snapshot = { generatedFrom: HTML_NAME, htmlSha256: htmlSha, referenceEnv: REFERENCE_ENV, modules: {} };
  const describe = tree => {
    const c = canon(tree);
    let kind, count = null;
    if (c === null) kind = 'null';
    else if (Array.isArray(c)) { kind = 'array'; count = c.length; }
    else if (typeof c === 'object') {
      if ('$set' in c) { kind = 'set'; count = c.$set.length; }
      else if ('$map' in c) { kind = 'map'; count = c.$map.length; }
      else if ('$undefined' in c) kind = 'undefined';
      else { kind = 'object'; count = Object.keys(c).length; }
    } else { kind = typeof c; if (kind === 'string') count = c.length; }
    return { kind, count, sha256: sha256(JSON.stringify(c)) };
  };

  // A top-level statement that changes NAME belongs to the innermost binding of that name.
  const mutationsOf = r => analysis.mutations.filter(m => {
    if (m.root !== r.name || m.from <= r.to) return false;
    const shadowed = m.scope !== 'global' && records.some(x => x.name === r.name && x.scopeId === m.scope);
    return r.scope === 'global' || r.scope === 'window' ? !shadowed : m.scope === r.scopeId;
  });
  const scopeNote = r => {
    if (r.scope === 'global') return null;
    if (r.scope === 'window') return `Assigned as window.${r.name} inside ${r.assignedIn === 'global' ? 'the main script' : `the IIFE of <script id="${r.assignedIn.slice(1)}">`}.`;
    const iife = analysis.iifes.find(i => i.id === r.scopeId);
    return `Local to the IIFE at ${lines(iife.from, iife.to)}${r.scope.startsWith('#') ? ` (<script id="${r.scope.slice(1)}">)` : ''}; not reachable from outside it in the HTML.`;
  };

  // Second opinion on the runtime capture: a constant written as a plain
  // literal and never changed afterwards must equal its own source text
  // evaluated in isolation.
  const crossChecked = [], notCrossChecked = [], changedThroughSharing = [];
  const sharedObjects = ref.extra.sharedObjects;
  for (const r of records.filter(x => x.cls === 'data' || x.cls === 'i18n')) {
    const why = !r.initNode ? 'no initializer' : impurityOf(ts, r.initNode);
    const muts = mutationsOf(r).filter(x => x.how !== 'reassign');
    if (why) notCrossChecked.push({ constant: r.key, because: `its initializer ${why}` });
    else if (muts.length) notCrossChecked.push({ constant: r.key, because: `it is changed after its declaration (${muts.map(x => lines(x.from, x.to)).join(', ')})` });
    else {
      const literal = evaluateSlice(r.initText);
      if (JSON.stringify(literal) === JSON.stringify(r.value)) crossChecked.push(r.key);
      else {
        // No statement changes it by name, yet it differs: its objects are
        // shared with another constant that is changed (see sharedObjects).
        const paths = diffTagged(literal, r.value, r.key);
        const shared = sharedObjects.filter(x => x.first.startsWith(r.name + '[') || x.first.startsWith(r.name + '.') || x.again.startsWith(r.name + '[') || x.again.startsWith(r.name + '.'));
        if (!shared.length) throw new Error(`${r.key}: the value read from the running page differs from its literal at ${lines(r.from, r.to)} at ${paths.slice(0, 5).join(', ')}, and it shares no objects with another constant that would explain it`);
        changedThroughSharing.push({ constant: r.key, source: lines(r.from, r.to), differsAt: paths, sharedWith: [...new Set(shared.map(x => (x.first.startsWith(r.name) ? x.again : x.first).replace(/[.[].*$/, '')))] });
      }
    }
  }

  const moduleInfo = [];
  const emitTrees = []; // { constant, module, tree } for the markup inventory
  const exportIndex = []; // { module, valueNames, typeNames }
  for (const m of MODULES) {
    const typer = createTyper({ readonly: true, names: typeNames });
    const body = [];
    const valueNames = [], localTypes = [];
    snapshot.modules[m.file] = { path: `src/data/${m.file}`, exports: {} };
    let declCursor = 0;
    for (const c of m.consts) {
      const r = records.find(x => x.key === c);
      const tree = toEmit(r.value, r.key, envByRecord.get(r.key), 'data', r.key);
      emitTrees.push({ constant: r.key, module: `src/data/${m.file}.ts`, tree });
      const baseName = pascal(r.name);
      const type = typer.typeOf(tree, baseName);
      const newDecls = typer.decls.slice(declCursor);
      declCursor = typer.decls.length;
      for (const d of newDecls) { body.push(d, ''); localTypes.push(/^export (?:interface|type) (\w+)/.exec(d)[1]); }
      if (type.startsWith('Readonly<Record<string,') && !Array.isArray(tree) && Object.keys(tree).length) {
        let keyType = baseName + 'Key';
        while (typeNames.has(keyType)) keyType += '_';
        typeNames.add(keyType);
        body.push(`/** The keys ${r.name} has in the HTML. */`, `export type ${keyType} =\n${Object.keys(tree).map(k => `  | ${strLit(k)}`).join('\n')};`, '');
        localTypes.push(keyType);
      }
      body.push(`// Source: ${srcRef(r.from, r.to)} (${r.name})`);
      const sn = scopeNote(r);
      if (sn) body.push(`//   ${sn}`);
      const muts = mutationsOf(r).filter(x => x.how !== 'reassign');
      if (muts.length) body.push(`//   Changed after its declaration at ${muts.map(x => `${lines(x.from, x.to)} (${x.how})`).join(', ')}; this is the final value once every script has run.`);
      const envs = envDerived.filter(e => e.constant === r.key);
      if (envs.length) {
        const bySource = [...new Set(envs.map(e => `${e.kind}: ${e.source}`))];
        body.push(`//   Holds ${envs.length} value(s) the HTML computes from the ${[...new Set(envs.map(e => e.kind))].join(' / ')}; each is an EnvDerived marker with the value seen in the reference capture.`);
        for (const s of bySource) body.push(`//     ${s}`);
      }
      const rc = runtimeChanges.get(r.name);
      if (rc) body.push(`//   Handlers change it while the app runs (${rc.map(x => `L${x.line} ${x.how}`).join(', ')}): treat it as the seed of app state, not as a fixed table.`);
      const sh = changedThroughSharing.find(x => x.constant === r.key);
      if (sh) body.push(`//   Its objects are the same objects as in ${sh.sharedWith.join(', ')}, so it also carries what the scripts add there (differs from its own literal at ${sh.differsAt.length} place(s)).`);
      const fns = functionsInData.filter(f => f.path === r.key || f.path.startsWith(r.key + '.') || f.path.startsWith(r.key + '['));
      if (fns.length) body.push(`//   Holds ${fns.length} function(s): each is a FnMarker with its source code${fns.every(f => f.returnsRecorded) ? ' and, being a zero-argument template, the string it returns' : ''}.`);
      body.push(`export const ${r.name}: ${type} = ${printValue(tree, '')};`, '');
      valueNames.push(r.name);
      const d = describe(tree);
      snapshot.modules[m.file].exports[r.name] = { ...d, source: lines(r.from, r.to) };
      r.exportedTo = `mobile/src/data/${m.file}.ts`;
      moduleInfo.push({ module: `mobile/src/data/${m.file}.ts`, export: r.name, scope: r.scope, source: lines(r.from, r.to), kind: d.kind, count: d.count });
    }
    const markers = [...typer.usedMarkers].sort();
    const head = [HEADER, `// ${m.about}`, REGEN];
    if (markers.length) head.push(`import type { ${markers.join(', ')} } from './markers';`);
    head.push('');
    files.set(`mobile/src/data/${m.file}.ts`, head.join('\n') + '\n' + body.join('\n'));
    exportIndex.push({ file: m.file, valueNames, typeNames: localTypes });
  }

  /* ---------------- markers.ts ---------------- */
  {
    const out = [HEADER,
      '// Marker types used inside the generated data, and the list of values that depend on the environment.',
      REGEN, '',
      "export type EnvKind = 'clock' | 'timezone' | 'clock+timezone';",
      '',
      '/**',
      ' * A value the HTML computes from the current time and/or the device timezone. `sample` is what the',
      ' * reference capture saw (ENV_SAMPLE) and must not be used as content: compute the real value the way',
      ' * `source` in ENV_DERIVED says.',
      ' */',
      'export interface EnvDerived<T> {',
      '  readonly $env: EnvKind;',
      '  readonly sample: T;',
      '}',
      '',
      '/** A Date, as its ISO string. */',
      'export interface DateValue {',
      '  readonly $date: string;',
      '}',
      '',
      '/**',
      ' * A function found inside data. `code` is its exact source text. `returns` is present only for',
      ' * zero-argument template functions and is the string the function returns.',
      ' */',
      'export interface FnMarker<R = never> {',
      '  readonly $fn: {',
      '    readonly name: string;',
      '    readonly params: number;',
      '    readonly source: string;',
      '    readonly code: string;',
      '    readonly returns?: R;',
      '  };',
      '}',
      '',
      'export interface RegExpValue {',
      '  readonly $regexp: { readonly source: string; readonly flags: string };',
      '}',
      '',
      '/** A DOM node that was stored inside a value (described as tag#id.class). */',
      'export interface DomRef {',
      '  readonly $dom: string;',
      '}',
      '',
      '/** An instance of a browser class that was stored inside a value. */',
      'export interface InstanceRef {',
      '  readonly $instance: string;',
      '}',
      '',
      '/** A reference back to an ancestor object. */',
      'export interface CycleRef {',
      '  readonly $cycle: string;',
      '}',
      '',
      '/** The environment of the reference capture. */',
      `export const ENV_SAMPLE = ${printValue(REFERENCE_ENV, '')} as const;`,
      '',
      'export interface EnvDerivedEntry {',
      '  readonly constant: string;',
      '  readonly path: string;',
      '  readonly kind: EnvKind;',
      '  /** How the HTML computes the value. */',
      '  readonly source: string;',
      '}',
      '',
      '/** Every value in the generated data that depends on the clock or the timezone. */',
      `export const ENV_DERIVED: readonly EnvDerivedEntry[] = ${printValue(envDerived, '')};`,
      '',
      'export interface FunctionInDataEntry {',
      '  readonly path: string;',
      '  readonly name: string;',
      '  readonly params: number;',
      '  readonly source: string;',
      '  readonly returnsRecorded: boolean;',
      '}',
      '',
      '/** Every function found inside an exported constant. */',
      `export const FUNCTIONS_IN_DATA: readonly FunctionInDataEntry[] = ${printValue(functionsInData, '')};`,
      ''];
    files.set('mobile/src/data/markers.ts', out.join('\n'));
    snapshot.markers = { envDerived: envDerived.length, functionsInData: functionsInData.length };
  }

  /* ---------------- initialState.ts ---------------- */
  {
    const r = records.find(x => x.key === 'S');
    const tree = toEmit(r.value, 'S', envByRecord.get('S'), 'state', 'S');
    const typer = createTyper({ readonly: false, names: new Set(['InitialState']) });
    const shape = shapeOf(tree);
    // The state root is always a struct, never a dictionary.
    const fields = [...shape.obj.keys].map(([k, e]) => `  ${keyLit(k)}: ${typer.typeOfShape(e.shape, 'State' + pascal(k))};`);
    const params = [];
    const collect = v => {
      if (v === null || typeof v !== 'object') return;
      if (Array.isArray(v)) return v.forEach(collect);
      if (v.$t === 'param') { params.push(v); return; }
      if (v.$t === 'set') return v.v.forEach(collect);
      if (v.$t === 'map') return v.v.forEach(([k, x]) => { collect(k); collect(x); });
      if (typeof v.$t === 'string') return;
      Object.values(v).forEach(collect);
    };
    collect(tree);
    const muts = analysis.mutations.filter(x => x.root === 'S');
    // Fields the scripts assign later (inside functions), so they are absent at load.
    const assigned = new Map();
    for (const script of source.scripts) {
      const visit = node => {
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isPropertyAccessExpression(node.left)
          && ts.isIdentifier(node.left.expression) && node.left.expression.text === 'S') {
          const name = node.left.name.text;
          if (!assigned.has(name)) assigned.set(name, []);
          assigned.get(name).push(source.lineOf(script.codeStart + node.getStart(script.sf)));
        }
        ts.forEachChild(node, visit);
      };
      visit(script.sf);
    }
    const later = [...assigned.entries()].filter(([k]) => !(k in r.value)).map(([field, ls]) => ({ field, assignedAt: [...new Set(ls)].map(l => `L${l}`) }));

    const out = [HEADER,
      '// The state object `S` exactly as the page leaves it when its last script has run, with the page',
      '// clock paused (so no timer or animation frame has fired) and no location.hash.',
      '//   Sets are real Sets. createInitialState() returns a fresh, mutable copy on every call.',
      "//   `stage` is 'book' because the page starts with go('book') (L8683).",
      REGEN, '',
      ...typer.decls.flatMap(d => [d, '']),
      `// Source: ${srcRef(r.from, r.to)} (S)`,
      `//   Extended after its declaration at ${muts.map(x => lines(x.from, x.to)).join(', ')}.`,
      'export interface InitialState {', ...fields, '}', ''];
    if (params.length) {
      out.push('/** Values of the initial state that the HTML computes from the clock; the caller supplies them. */', 'export interface InitialStateEnv {');
      for (const p of params) {
        const e = envDerived.find(x => x.path === 'S.' + p.key);
        out.push(`  /** ${e.kind}. ${e.source} */`, `  ${keyLit(p.key)}: ${typer.typeOf(p.sample, 'Env')};`);
      }
      out.push('}', '',
        `/** The values seen in the reference capture (${REFERENCE_ENV.clock}, ${REFERENCE_ENV.timezoneId}). For tests only. */`,
        `export const INITIAL_STATE_ENV_SAMPLE: InitialStateEnv = ${printValue(Object.fromEntries(params.map(p => [p.key, p.sample])), '')};`, '');
    }
    out.push(`export function createInitialState(${params.length ? 'env: InitialStateEnv' : ''}): InitialState {`,
      `  return ${printValue(tree, '  ')};`, '}', '',
      'export interface LaterStateField {', '  readonly field: string;', '  readonly assignedAt: readonly string[];', '}', '',
      '/** Fields of S that do not exist at load: the scripts create them later, at these lines. */',
      `export const STATE_FIELDS_ASSIGNED_LATER: readonly LaterStateField[] = ${printValue(later, '')};`, '');
    files.set('mobile/src/data/initialState.ts', out.join('\n'));
    const d = describe(tree);
    snapshot.initialState = { ...d, fields: Object.keys(r.value), source: lines(r.from, r.to), envKeys: params.map(p => p.key), laterFields: later.length };
    r.exportedTo = 'mobile/src/data/initialState.ts';
    emitTrees.push({ constant: 'S', module: 'src/data/initialState.ts', tree });
  }

  /* ---------------- i18n ---------------- */
  let i18nInfo;
  {
    const r = records.find(x => x.key === 'I18N');
    if (envByRecord.get('I18N').size) throw new Error('I18N depends on the environment');
    const table = r.value;
    const langs = Object.keys(table);
    const keys = Object.keys(table[langs[0]]);
    for (const l of langs) {
      const k = Object.keys(table[l]);
      if (k.length !== keys.length || k.some(x => !keys.includes(x))) throw new Error(`I18N.${l} does not have the same keys as I18N.${langs[0]}`);
      for (const x of k) if (typeof table[l][x] !== 'string') throw new Error(`I18N.${l}.${x} is not a string`);
    }
    const t = records.find(x => x.key === 't');
    const out = [HEADER,
      '// App-chrome strings in English and Hindi, exactly as in the HTML.',
      `// Lookup in the HTML (${srcRef(t.from, t.to)}): const t = ${t.value.code.replace(/\s*\n\s*/g, ' ')};`,
      REGEN, '',
      `export type Lang = ${langs.map(strLit).join(' | ')};`, '',
      `export type I18nKey =\n${keys.map(k => `  | ${strLit(k)}`).join('\n')};`, '',
      `export const LANGS: readonly Lang[] = ${printValue(langs, '')};`, '',
      `export const I18N_KEYS: readonly I18nKey[] = ${printValue(keys, '')};`, '',
      `// Source: ${srcRef(r.from, r.to)} (I18N)`,
      `export const I18N: Readonly<Record<Lang, Readonly<Record<I18nKey, string>>>> = ${printValue(table, '')};`, ''];
    files.set('mobile/src/i18n/strings.ts', out.join('\n'));
    snapshot.i18n = { ...describe(table), langs, keys: keys.length, source: lines(r.from, r.to) };
    r.exportedTo = 'mobile/src/i18n/strings.ts';
    i18nInfo = { langs, keys: keys.length, source: lines(r.from, r.to) };
    emitTrees.push({ constant: 'I18N', module: 'src/i18n/strings.ts', tree: table });
  }

  /* ---------------- inline literals ---------------- */
  const inline = findInlineLiterals(source);
  {
    const typer = createTyper({ readonly: true, names: typeNames });
    const body = [];
    const valueNames = [], localTypes = [];
    snapshot.modules.inline = { path: 'src/data/inline', exports: {} };
    let cursor = 0;
    for (const item of inline.filter(i => i.pure)) {
      const name = `INLINE_${item.id}`;
      const type = typer.typeOf(item.value, 'Inline' + pascal(item.id));
      for (const d of typer.decls.slice(cursor)) { body.push(d, ''); localTypes.push(/^export (?:interface|type) (\w+)/.exec(d)[1]); }
      cursor = typer.decls.length;
      body.push(`// Source: ${srcRef(item.from, item.to)} (inline literal in ${item.function}(), ${item.role})`,
        `export const ${name}: ${type} = ${printValue(item.value, '')};`, '');
      valueNames.push(name);
      snapshot.modules.inline.exports[name] = { ...describe(item.value), source: lines(item.from, item.to) };
      emitTrees.push({ constant: name, module: 'src/data/inline.ts', tree: item.value });
      moduleInfo.push({ module: 'mobile/src/data/inline.ts', export: name, scope: `inside ${item.function}()`, source: lines(item.from, item.to), kind: Array.isArray(item.value) ? 'array' : 'object', count: Array.isArray(item.value) ? item.value.length : Object.keys(item.value).length });
    }
    const head = [HEADER,
      '// Data that the HTML writes inline inside a function instead of in a named constant.',
      '// Each export is the exact source slice of one array/object literal, evaluated on its own.',
      '// Only literals that use no variables are here; the rest are listed with their source text in',
      '// tools/reference/extract/out/inline-literals.json. Names are INLINE_<function>_L<first line>.',
      REGEN, ''];
    files.set('mobile/src/data/inline.ts', head.join('\n') + '\n' + body.join('\n'));
    exportIndex.push({ file: 'inline', valueNames, typeNames: localTypes });
    files.set('tools/reference/extract/out/inline-literals.json', json({
      about: 'Array/object literals written inside functions (at least 3 strings and 60 characters of text). pure = uses no variables, so it was evaluated and exported from mobile/src/data/inline.ts; the others are view code and are listed for reference only.',
      generatedFrom: HTML_NAME,
      count: inline.length, exported: inline.filter(i => i.pure).length,
      items: inline.map(i => ({ id: i.id, function: i.function, role: i.role, source: srcRef(i.from, i.to), script: i.script, pure: i.pure, exportedAs: i.pure ? `INLINE_${i.id}` : null, notEvaluatedBecause: i.notEvaluatedBecause, strings: i.strings, sourceText: i.source })),
    }));
  }

  /* ---------------- data/index.ts ---------------- */
  {
    const out = [HEADER,
      '// Barrel for the generated data. A constant name that exists in two scopes of the HTML is exported',
      '// here as NAME__<module> for the later module; import from the module file to get it under its own name.',
      REGEN, ''];
    const taken = new Set();
    const aliases = [];
    for (const m of exportIndex) {
      const names = m.valueNames.map(n => {
        if (!taken.has(n)) { taken.add(n); return n; }
        const alias = `${n}__${m.file}`;
        taken.add(alias);
        aliases.push({ name: n, module: m.file, alias });
        return `${n} as ${alias}`;
      });
      if (names.length) out.push(`export { ${names.join(', ')} } from './${m.file}';`);
      if (m.typeNames.length) out.push(`export type { ${m.typeNames.join(', ')} } from './${m.file}';`);
    }
    out.push("export { ENV_SAMPLE, ENV_DERIVED, FUNCTIONS_IN_DATA } from './markers';",
      "export type { EnvKind, EnvDerived, DateValue, FnMarker, RegExpValue, DomRef, InstanceRef, CycleRef, EnvDerivedEntry, FunctionInDataEntry } from './markers';",
      `export { createInitialState, STATE_FIELDS_ASSIGNED_LATER${snapshot.initialState.envKeys.length ? ', INITIAL_STATE_ENV_SAMPLE' : ''} } from './initialState';`,
      `export type { InitialState, LaterStateField${snapshot.initialState.envKeys.length ? ', InitialStateEnv' : ''} } from './initialState';`, '');
    files.set('mobile/src/data/index.ts', out.join('\n'));
    snapshot.indexAliases = aliases;
  }

  /* ---------------- icons ---------------- */
  const iconResult = buildIcons({ domSymbols: ref.extra.symbols, templateSymbols: ref.extra.templateSymbols, source });
  files.set('mobile/src/icons/iconPaths.generated.ts', emitIconsModule({ ...iconResult, header: HEADER, source }));
  snapshot.icons = {
    count: iconResult.icons.length,
    names: iconResult.icons.map(i => i.name),
    sha256: sha256(JSON.stringify(Object.fromEntries(iconResult.icons.map(i => [i.name, i.def])))),
    illustrationSymbols: iconResult.illustration.map(i => i.name),
    illustrationSha256: sha256(JSON.stringify(Object.fromEntries(iconResult.illustration.map(i => [i.name, i.def])))),
  };

  /* ---------------- icon references ---------------- */
  // Every icon name the page asks for must exist: literal <use href="#i-NAME">,
  // literal ic('NAME') calls, and `ic:` fields in the data.
  const iconUsage = { literalUse: new Set(), literalIcCalls: new Set(), dataFields: new Set() };
  for (const m of source.html.matchAll(/href="#i-([A-Za-z0-9_-]+)"/g)) iconUsage.literalUse.add(m[1]);
  for (const script of source.scripts) {
    const visit = node => {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'ic' && node.arguments.length && ts.isStringLiteralLike(node.arguments[0])) iconUsage.literalIcCalls.add(node.arguments[0].text);
      ts.forEachChild(node, visit);
    };
    visit(script.sf);
  }
  for (const t of emitTrees) for (const s of contentStrings(t.tree, t.constant)) if (/(^|\.)ic$/.test(s.path)) iconUsage.dataFields.add(s.value);
  const iconNames = new Set(iconResult.icons.map(i => i.name));
  const asked = new Set([...iconUsage.literalUse, ...iconUsage.literalIcCalls, ...iconUsage.dataFields]);
  const iconCheck = {
    about: 'Icon names the page asks for (literal <use href="#i-NAME">, literal ic(\'NAME\') calls, `ic` fields in extracted data) against the extracted icons. Names passed to ic() through other variables are not traced.',
    referenced: asked.size,
    referencedButNotDefined: [...asked].filter(n => !iconNames.has(n)).sort(),
    definedButNeverReferencedByName: [...iconNames].filter(n => !asked.has(n) && n !== 'logo').sort(),
  };

  /* ---------------- live page: markup parsing + render harvest ---------------- */
  log('Rendering tabs, sheets and views to collect data-act values; parsing markup strings…');
  let parseCalls = 0;
  const live = await withLivePage({ htmlPath: HTML_PATH, clock: REFERENCE_ENV.clock, timezoneId: REFERENCE_ENV.timezoneId, locale: REFERENCE_ENV.locale }, async page => {
    const inventory = await buildMarkupInventory(emitTrees, async strings => { parseCalls++; return page.evaluate(`(${PARSE_MARKUP})(${JSON.stringify(strings)})`); });
    const templateInventory = await buildTemplateInventory({
      source,
      parseInPage: (strings, selector) => page.evaluate(`(${PARSE_TEMPLATES})(${JSON.stringify(strings)}, ${JSON.stringify(selector)})`),
      staticGroupSelector: STATIC_GROUP_SELECTOR,
      dataTags: new Set(Object.keys(inventory.tags)),
      dataClasses: new Set(Object.keys(inventory.classes)),
    });
    const harvest = await page.evaluate(`(${HARVEST})()`);
    return { inventory, templateInventory, harvest };
  });

  /* ---------------- markup inventory ---------------- */
  {
    const xsc = records.find(x => x.key === 'XSC@window');
    const xray = analyseXrayMarkup(xsc.value);
    if (xray.problems.length) throw new Error('X-Ray markup does not follow the grammar the extractor documents:\n' + xray.problems.join('\n'));
    // The consumer line numbers quoted in the grammar must still be right.
    const L = n => source.html.slice(source.lineStarts[n - 1], source.lineStarts[n]);
    if (!L(9893).startsWith('function x4Para') || !L(9857).startsWith('const plain') || !L(9858).startsWith('const insText') || !L(9859).startsWith('const termCount')) {
      throw new Error('The X-Ray consumers moved; update the line numbers in lib/inventory.mjs');
    }
    files.set('tools/reference/extract/out/markup-inventory.json', json({
      about: 'What the strings inside the extracted data contain: every HTML/SVG tag, class, inline style property, attribute (as "tag attribute") and entity, with the number of occurrences, the number of constants they occur in and two example constants. Covers every exported constant, the i18n table, the initial state, the returned strings of functions kept in data, and the inline literals. `fields` lists each field that holds markup, line breaks or X-Ray markers.',
      generatedFrom: HTML_NAME,
      ...live.inventory,
      xrayMarkup: xray,
      notInThisFile: {
        about: 'Markup written inside functions as template strings (views, sheets, mentor replies …) and the static document markup are code, not data, and are not counted above. They are inventoried separately.',
        file: 'tools/reference/extract/out/template-inventory.json',
        tagsThatOccurOnlyThere: live.templateInventory.tagsOnlyInCode,
      },
    }));
    files.set('tools/reference/extract/out/template-inventory.json', json({
      about: 'Markup that lives in code: every string/template literal in the scripts that holds HTML, grouped by the function it is written in, plus the static markup of the document grouped by stage. Per place: tags, classes, inline style properties, entities, the visible text (each ${…} shown as its expression) and label attributes (aria-label, placeholder, title, alt, value). toastCalls lists every toast(…) call. Counts are occurrences in source text, not in the rendered page. Class names or attributes built by a ${…} expression are not listed.',
      generatedFrom: HTML_NAME,
      ...live.templateInventory,
    }));
  }

  /* ---------------- actions.map.json ---------------- */
  const dataActs = [];
  for (const t of emitTrees) for (const s of contentStrings(t.tree, t.constant)) if (/(^|\.)act$/.test(s.path)) dataActs.push(s);
  let previous = {};
  const existing = path.join(REPO_ROOT, 'mobile', 'actions.map.json');
  if (fs.existsSync(existing)) {
    for (const v of JSON.parse(fs.readFileSync(existing, 'utf8')).verbs || []) previous[v.verb] = { owner: v.owner, native: v.native, test: v.test };
  }
  const globalFunctions = {};
  for (const r of records) if (r.scope === 'global' && r.cls === 'function') globalFunctions[r.name] = r.value.code;
  const reassignments = {};
  for (const m of analysis.mutations) if (m.how === 'reassign') (reassignments[m.root] ||= []).push(m.from);
  const actions = buildActionsMap({ source, runtimeA: records.find(r => r.key === 'A').value, harvest: live.harvest.seen, harvestErrors: live.harvest.errors, dataActs, locate, previous, globalFunctions, reassignments });
  actions.inlineHandlers = inlineHandlers(source);
  files.set('mobile/actions.map.json', json(actions));
  snapshot.actions = { verbs: actions.verbs.length, verbsSha256: sha256(JSON.stringify(actions.verbs.map(v => v.verb))), withoutHandler: actions.counts.verbsWithoutHandler.length };

  /* ---------------- tests ---------------- */
  files.set('mobile/__tests__/data/snapshot.json', json(snapshot));
  files.set('mobile/__tests__/data/generatedData.test.ts', testFile(exportIndex.map(m => m.file)));

  /* ---------------- reports ---------------- */
  const summarise = v => {
    if (v === null) return 'null';
    if (Array.isArray(v)) return `array(${v.length})`;
    if (isTagged(v)) return v.$t;
    if (typeof v === 'object') return `object(${Object.keys(v).length})`;
    return typeof v;
  };
  const bindingRows = records.map(r => {
    const row = { name: r.name, key: r.key, declaredWith: r.kind, scope: r.scope, source: srcRef(r.from, r.to), class: r.cls, value: summarise(r.value), exportedTo: r.exportedTo || null, reason: r.reason || null };
    if (r.cls === 'function-table') row.members = Object.keys(r.value);
    if (['mutable', 'excluded', 'handle'].includes(r.cls)) {
      const text = JSON.stringify(r.value);
      row.valueAtEndOfLoad = text.length <= 600 ? r.value : `(${text.length} characters, not listed)`;
    }
    return row;
  });
  files.set('tools/reference/extract/out/bindings.json', json({
    about: 'Every binding the scripts create at script level and at the top level of each IIFE, with what the extractor did with it. class: data = exported to a data module; state / i18n = exported to initialState.ts / strings.ts; function, function-table = code; mutable = let/var working variable; handle = DOM node; excluded = see reason.',
    generatedFrom: HTML_NAME,
    scopes: analysis.iifes.map(i => ({ scope: scopeKey[i.id], lines: lines(i.from, i.to), script: i.script, name: i.name })),
    bindings: bindingRows,
  }));

  const count = cls => records.filter(r => r.cls === cls).length;
  const consts = records.filter(r => r.kind === 'const' || r.kind === 'window');
  const report = {
    generatedFrom: HTML_NAME,
    htmlSha256: htmlSha,
    referenceEnv: REFERENCE_ENV,
    blockedNetworkRequests: ref.blockedRequests,
    bindings: {
      total: records.length,
      byClass: Object.fromEntries(['data', 'state', 'i18n', 'function', 'function-table', 'mutable', 'handle', 'excluded'].map(c => [c, count(c)])),
      constDeclarations: consts.length,
      constNonFunction: consts.filter(r => r.cls !== 'function').length,
      constExported: consts.filter(r => ['data', 'state', 'i18n'].includes(r.cls)).length,
      constNotExported: consts.filter(r => !['data', 'state', 'i18n', 'function'].includes(r.cls)).map(r => ({ key: r.key, source: lines(r.from, r.to), class: r.cls, reason: r.reason })),
      mutable: records.filter(r => r.cls === 'mutable').map(r => `${r.key} (${lines(r.from, r.to)})`),
    },
    modules: moduleInfo,
    initialState: snapshot.initialState,
    i18n: i18nInfo,
    crossCheck: { about: 'Constants whose runtime value was also compared with their source literal evaluated in isolation.', checked: crossChecked.length, constants: crossChecked, notChecked: notCrossChecked, changedThroughSharing },
    sharedObjects: { about: 'The same object reachable from two places among the script-level constants (first = where it was met first).', count: sharedObjects.length, pairs: sharedObjects },
    changedAtRuntime: { about: 'Data constants that functions (handlers) modify by name after load. Element changes made through another variable are not traceable statically and are not listed.', constants: Object.fromEntries([...runtimeChanges.entries()].map(([k, v]) => [k, v.map(x => `L${x.line} ${x.how}`)])) },
    envDerived: { count: envDerived.length, byConstant: Object.fromEntries([...new Set(envDerived.map(e => e.constant))].map(c => [c, envDerived.filter(e => e.constant === c).length])) },
    functionsInData,
    inlineLiterals: { found: inline.length, exported: inline.filter(i => i.pure).length, notPure: inline.filter(i => !i.pure).map(i => `${i.id} (${lines(i.from, i.to)}): ${i.notEvaluatedBecause}`) },
    iconReferences: iconCheck,
    icons: { count: iconResult.icons.length, illustrationSymbols: iconResult.illustration.map(i => i.name), symbolsInSource: iconResult.sourceSymbolCount, issues: iconResult.issues,
      byOrigin: iconResult.icons.reduce((o, i) => { o[i.def.origin] = (o[i.def.origin] || 0) + 1; return o; }, {}) },
    actions: { ...actions.counts, dynamicSites: actions.dynamicSites.length, renderHarvest: { values: live.harvest.seen.length, viewsRendered: live.harvest.views, errors: live.harvest.errors.length }, inlineHandlers: actions.inlineHandlers.length },
    markup: live.inventory.summary,
    codeTemplates: { ...live.templateInventory.summary, tagsOnlyInCode: live.templateInventory.tagsOnlyInCode },
    files: [...files.keys()].sort(),
  };
  files.set('tools/reference/extract/out/report.json', json(report));
  report.files = [...files.keys()].sort();
  return { files, report };
}

/** Inline event-handler attributes (on*="…"), which bypass the data-act dispatcher. */
function inlineHandlers(source) {
  const { html, lineOf, scripts } = source;
  const out = [];
  const re = /\s(on[a-z]+)="/g;
  let m;
  while ((m = re.exec(html))) {
    const start = m.index + m[0].length;
    let j = start, depth = 0;
    for (; j < html.length; j++) {
      const c = html[j];
      if (depth === 0 && (c === '"' || c === '\n')) break;
      if (c === '$' && html[j + 1] === '{') { depth++; j++; }
      else if (depth > 0 && c === '{') depth++;
      else if (depth > 0 && c === '}') depth--;
    }
    if (html[j] !== '"') continue;
    const script = scripts.find(s => m.index >= s.codeStart && m.index < s.codeStart + s.code.length);
    out.push({ attribute: m[1], code: html.slice(start, j), source: `${HTML_NAME} L${lineOf(m.index)}`, where: script ? 'template' : 'markup' });
  }
  return out;
}

function testFile(moduleFiles) {
  const imp = moduleFiles.map(f => `import * as ${f} from '../../src/data/${f}';`).join('\n');
  return `${HEADER}
/// <reference types="node" />
// Structural guard for the generated data: every export listed in snapshot.json must exist and hash
// to the same value, so a broken import, a truncated module or a hand edit fails \`npm test\`.
// snapshot.json is written by the extractor in the same run as the modules.
import { createHash } from 'crypto';
import snapshot from './snapshot.json';
${imp}
import * as markers from '../../src/data/markers';
import * as dataIndex from '../../src/data';
import { createInitialState, INITIAL_STATE_ENV_SAMPLE, STATE_FIELDS_ASSIGNED_LATER } from '../../src/data/initialState';
import { I18N, I18N_KEYS, LANGS } from '../../src/i18n/strings';
import { ICONS, ICON_NAMES, ILLUSTRATION_SYMBOLS } from '../../src/icons/iconPaths.generated';
import actionsMap from '../../actions.map.json';

type Json = null | string | number | boolean | Json[] | { [key: string]: Json };

/** Same canonical form as canon() in tools/reference/extract/lib/emit-ts.mjs. */
function canon(v: unknown): Json {
  if (v === undefined) return { $undefined: true };
  if (v === null || typeof v === 'string' || typeof v === 'boolean') return v;
  if (typeof v === 'number') {
    if (Number.isNaN(v)) return { $number: 'NaN' };
    if (v === Infinity) return { $number: 'Infinity' };
    if (v === -Infinity) return { $number: '-Infinity' };
    if (Object.is(v, -0)) return { $number: '-0' };
    return v;
  }
  if (typeof v === 'bigint') return { $bigint: String(v) };
  if (v instanceof Set) return { $set: Array.from(v, canon) };
  if (v instanceof Map) return { $map: Array.from(v, ([k, x]) => [canon(k), canon(x)]) };
  if (Array.isArray(v)) return v.map(canon);
  if (typeof v === 'object') {
    const out: { [key: string]: Json } = {};
    for (const k of Object.keys(v)) out[k] = canon((v as Record<string, unknown>)[k]);
    return out;
  }
  throw new Error('Unexpected ' + typeof v + ' in generated data');
}

const sha256 = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

function facts(v: unknown) {
  const c = canon(v);
  let kind: string;
  let count: number | null = null;
  if (c === null) kind = 'null';
  else if (Array.isArray(c)) { kind = 'array'; count = c.length; }
  else if (typeof c === 'object') {
    if ('$set' in c) { kind = 'set'; count = (c.$set as Json[]).length; }
    else if ('$map' in c) { kind = 'map'; count = (c.$map as Json[]).length; }
    else if ('$undefined' in c) kind = 'undefined';
    else { kind = 'object'; count = Object.keys(c).length; }
  } else { kind = typeof c; if (typeof c === 'string') count = c.length; }
  return { kind, count, sha256: sha256(c) };
}

interface ExportFacts { kind: string; count: number | null; sha256: string; source: string }
const modules: Record<string, Record<string, unknown>> = { ${moduleFiles.join(', ')} };
const expected = snapshot.modules as unknown as Record<string, { path: string; exports: Record<string, ExportFacts> }>;

describe('generated data modules', () => {
  test('the set of modules is the one in the snapshot', () => {
    expect(Object.keys(modules).sort()).toEqual(Object.keys(expected).sort());
  });

  for (const file of Object.keys(expected)) {
    describe(expected[file].path, () => {
      test('exports exactly the constants in the snapshot', () => {
        expect(Object.keys(modules[file]).sort()).toEqual(Object.keys(expected[file].exports).sort());
      });
      for (const name of Object.keys(expected[file].exports)) {
        test(name + ' (' + expected[file].exports[name].source + ') has the recorded kind, size and content hash', () => {
          const recorded = expected[file].exports[name];
          expect(facts(modules[file][name])).toEqual({ kind: recorded.kind, count: recorded.count, sha256: recorded.sha256 });
        });
      }
    });
  }

  test('the barrel re-exports every constant', () => {
    const barrel = dataIndex as unknown as Record<string, unknown>;
    const aliases = snapshot.indexAliases as { name: string; module: string; alias: string }[];
    for (const file of Object.keys(expected)) {
      for (const name of Object.keys(expected[file].exports)) {
        const alias = aliases.find(a => a.module === file && a.name === name);
        expect(barrel[alias ? alias.alias : name]).toBe(modules[file][name]);
      }
    }
  });

  test('markers list the environment-derived values and the functions kept in data', () => {
    expect(markers.ENV_DERIVED.length).toBe(snapshot.markers.envDerived);
    expect(markers.FUNCTIONS_IN_DATA.length).toBe(snapshot.markers.functionsInData);
    expect(markers.ENV_SAMPLE).toEqual(snapshot.referenceEnv);
  });
});

describe('initial state', () => {
  test('has the recorded fields and content hash', () => {
    const s = createInitialState(INITIAL_STATE_ENV_SAMPLE);
    expect(Object.keys(s)).toEqual(snapshot.initialState.fields);
    const { kind, count, sha256: hash } = facts(s);
    expect({ kind, count, sha256: hash }).toEqual({ kind: snapshot.initialState.kind, count: snapshot.initialState.count, sha256: snapshot.initialState.sha256 });
    expect(Object.keys(INITIAL_STATE_ENV_SAMPLE)).toEqual(snapshot.initialState.envKeys);
    expect(STATE_FIELDS_ASSIGNED_LATER.length).toBe(snapshot.initialState.laterFields);
  });

  test('every call returns a fresh copy', () => {
    const a = createInitialState(INITIAL_STATE_ENV_SAMPLE);
    const b = createInitialState(INITIAL_STATE_ENV_SAMPLE);
    expect(a).not.toBe(b);
    expect(a.saved).not.toBe(b.saved);
    expect(a.saved).toBeInstanceOf(Set);
    a.saved.add('changed');
    a.user.name = 'changed';
    expect(b.saved.has('changed')).toBe(false);
    expect(facts(b).sha256).toBe(snapshot.initialState.sha256);
  });
});

describe('i18n strings', () => {
  test('have the recorded languages, keys and content hash', () => {
    expect([...LANGS]).toEqual(snapshot.i18n.langs);
    expect(I18N_KEYS.length).toBe(snapshot.i18n.keys);
    for (const lang of LANGS) expect(Object.keys(I18N[lang])).toEqual([...I18N_KEYS]);
    expect(facts(I18N).sha256).toBe(snapshot.i18n.sha256);
  });
});

describe('icons', () => {
  test('have the recorded names and content hash', () => {
    expect([...ICON_NAMES]).toEqual(snapshot.icons.names);
    expect(Object.keys(ICONS)).toEqual(snapshot.icons.names);
    expect(sha256(ICONS)).toBe(snapshot.icons.sha256);
    expect(Object.keys(ILLUSTRATION_SYMBOLS)).toEqual(snapshot.icons.illustrationSymbols);
    expect(sha256(ILLUSTRATION_SYMBOLS)).toBe(snapshot.icons.illustrationSha256);
  });

  test('every icon has a viewBox and at least one shape', () => {
    for (const name of ICON_NAMES) {
      expect(typeof ICONS[name].viewBox).toBe('string');
      expect(ICONS[name].shapes.length).toBeGreaterThan(0);
    }
  });
});

describe('actions.map.json', () => {
  test('lists the recorded verbs', () => {
    const verbs = actionsMap.verbs.map(v => v.verb);
    expect(verbs.length).toBe(snapshot.actions.verbs);
    expect(new Set(verbs).size).toBe(verbs.length);
    expect(sha256(verbs)).toBe(snapshot.actions.verbsSha256);
    expect(actionsMap.counts.verbsWithoutHandler.length).toBe(snapshot.actions.withoutHandler);
    expect(typeof actionsMap.dispatcher.code).toBe('string');
  });

  test('every verb has the fields the porting agents fill in', () => {
    for (const v of actionsMap.verbs) {
      expect(v).toHaveProperty('owner');
      expect(v).toHaveProperty('native');
      expect(v).toHaveProperty('test');
      expect(Array.isArray(v.argExamples)).toBe(true);
      expect(v.argExamples.length).toBeLessThanOrEqual(5);
    }
  });
});
`;
}
