// Everything about `data-act`: where verbs appear, where their handlers are
// defined, and what the click dispatcher does.
import { createHash } from 'node:crypto';
import { HTML_NAME } from './paths.mjs';

/**
 * Finds every `attr="..."` in the raw HTML text, in markup and in script
 * template strings alike. `${...}` template expressions inside the value are
 * kept verbatim (they may contain quotes).
 */
export function scanAttribute(source, needle) {
  const { html, lineOf, scripts } = source;
  const sites = [];
  let i = 0;
  while ((i = html.indexOf(needle, i)) >= 0) {
    const start = i + needle.length;
    let j = start, depth = 0;
    for (; ; j++) {
      const c = html[j];
      if (c === undefined) throw new Error(`Unterminated ${needle} at L${lineOf(i)}`);
      if (depth === 0 && c === '"') break;
      if (depth === 0 && c === '\n') throw new Error(`${needle} value runs past the end of L${lineOf(i)}`);
      if (c === '$' && html[j + 1] === '{') { depth++; j++; }
      else if (depth > 0 && c === '{') depth++;
      else if (depth > 0 && c === '}') depth--;
    }
    const script = scripts.find(s => i >= s.codeStart && i < s.codeStart + s.code.length);
    sites.push({
      raw: html.slice(start, j),
      line: lineOf(i),
      where: script ? 'template' : 'markup',
      selector: html[i - 1] === '[',
    });
    i = j;
  }
  return sites;
}

/** Splits "verb:arg" the way the dispatcher does (first colon). */
export const splitAct = raw => {
  const i = raw.indexOf(':');
  return i < 0 ? { verb: raw, arg: null } : { verb: raw.slice(0, i), arg: raw.slice(i + 1) };
};

/**
 * Resolves the string values a JS expression can produce, as far as literals
 * allow. Returns patterns { text, complete } (complete = the whole string is
 * known) and `null` for a branch that depends on data.
 */
function literalPatterns(ts, node) {
  while (ts.isParenthesizedExpression(node)) node = node.expression;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [{ text: node.text, complete: true }];
  if (ts.isTemplateExpression(node)) return [{ text: node.head.text, complete: false }];
  if (ts.isConditionalExpression(node)) return [...literalPatterns(ts, node.whenTrue), ...literalPatterns(ts, node.whenFalse)];
  if (ts.isBinaryExpression(node)) {
    const op = node.operatorToken.kind;
    if (op === ts.SyntaxKind.PlusToken) return literalPatterns(ts, node.left).map(p => (p ? { text: p.text, complete: false } : null));
    if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) return [...literalPatterns(ts, node.left), ...literalPatterns(ts, node.right)];
  }
  return [null];
}

function resolveExpression(ts, text) {
  const sf = ts.createSourceFile('expr.js', `(${text})`, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  if (sf.parseDiagnostics.length || sf.statements.length !== 1 || !ts.isExpressionStatement(sf.statements[0])) return [null];
  return literalPatterns(ts, sf.statements[0].expression);
}

/** Turns one attribute value (possibly a template) into verb candidates. */
function classifySite(ts, raw) {
  const tpl = raw.indexOf('${');
  if (tpl < 0) {
    const { verb, arg } = splitAct(raw);
    return { kind: 'literal', hits: [{ verb, arg, argIsTemplate: false }], unresolved: false, expression: null };
  }
  const colon = raw.indexOf(':');
  if (colon >= 0 && colon < tpl) {
    return { kind: 'literal-verb', hits: [{ verb: raw.slice(0, colon), arg: raw.slice(colon + 1), argIsTemplate: true }], unresolved: false, expression: null };
  }
  // The verb itself comes from an expression.
  const whole = /^\$\{([\s\S]*)\}$/.exec(raw);
  if (!whole) return { kind: 'dynamic', hits: [], unresolved: true, expression: raw };
  const hits = [];
  let unresolved = false;
  for (const p of resolveExpression(ts, whole[1])) {
    if (!p) { unresolved = true; continue; }
    const c = p.text.indexOf(':');
    if (c >= 0) hits.push({ verb: p.text.slice(0, c), arg: p.text.slice(c + 1) + (p.complete ? '' : '${…}'), argIsTemplate: !p.complete });
    else if (p.complete) hits.push({ verb: p.text, arg: null, argIsTemplate: false });
    else unresolved = true;
  }
  return { kind: 'dynamic', hits, unresolved, expression: whole[1] };
}

/** Definitions of A.<verb> in source order, and direct `A.verb(...)` uses. */
export function findHandlers(source) {
  const { ts, scripts, lineOf } = source;
  const defs = [];
  const uses = [];
  for (const script of scripts) {
    const { sf, codeStart } = script;
    const line = pos => lineOf(codeStart + pos);
    const addProps = (obj, how) => {
      for (const p of obj.properties) {
        if (ts.isSpreadAssignment(p)) throw new Error(`Spread inside the action table at L${line(p.getStart(sf))} is not supported`);
        const name = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
        if (name === null) throw new Error(`Computed action name at L${line(p.getStart(sf))} is not supported`);
        let kind, text;
        if (ts.isPropertyAssignment(p)) {
          const init = p.initializer;
          kind = ts.isArrowFunction(init) || ts.isFunctionExpression(init) ? 'inline' : 'reference';
          text = init.getText(sf);
        } else if (ts.isShorthandPropertyAssignment(p)) { kind = 'reference'; text = name; }
        else if (ts.isMethodDeclaration(p)) { kind = 'method'; text = p.getText(sf); }
        else throw new Error(`Unsupported member in the action table at L${line(p.getStart(sf))}`);
        defs.push({ verb: name, how, kind, text, pos: codeStart + p.getStart(sf), from: line(p.getStart(sf)), to: line(p.end) });
      }
    };
    const isA = n => ts.isIdentifier(n) && n.text === 'A';
    const visit = node => {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'A' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
        addProps(node.initializer, 'const A = {…}');
      } else if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression)
        && node.expression.expression.text === 'Object' && node.expression.name.text === 'assign' && node.arguments.length && isA(node.arguments[0])) {
        for (const arg of node.arguments.slice(1)) {
          if (!ts.isObjectLiteralExpression(arg)) throw new Error(`Object.assign(A, <non-literal>) at L${line(node.getStart(sf))} is not supported`);
          addProps(arg, 'Object.assign(A, {…})');
        }
      } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isPropertyAccessExpression(node.left) && isA(node.left.expression)) {
        const init = node.right;
        defs.push({
          verb: node.left.name.text, how: 'A.<verb> = …',
          kind: ts.isArrowFunction(init) || ts.isFunctionExpression(init) ? 'inline' : 'reference',
          text: init.getText(sf), pos: codeStart + node.getStart(sf), from: line(node.getStart(sf)), to: line(node.end),
        });
      } else if (ts.isPropertyAccessExpression(node) && isA(node.expression)) {
        const parent = node.parent;
        const isAssignTarget = ts.isBinaryExpression(parent) && parent.left === node && parent.operatorToken.kind === ts.SyntaxKind.EqualsToken;
        if (!isAssignTarget) uses.push({ verb: node.name.text, line: line(node.getStart(sf)) });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  defs.sort((a, b) => a.pos - b.pos);
  return { defs, uses };
}

/** The document-level click listener that dispatches data-act. */
export function findDispatcher(source) {
  const { ts, scripts, lineOf } = source;
  const found = [];
  for (const script of scripts) {
    const { sf, codeStart } = script;
    const visit = node => {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'addEventListener'
        && node.arguments.length >= 2 && ts.isStringLiteral(node.arguments[0]) && node.arguments[0].text === 'click') {
        const text = node.getText(sf);
        if (text.includes('data-act')) found.push({ target: node.expression.expression.getText(sf), text, from: lineOf(codeStart + node.getStart(sf)), to: lineOf(codeStart + node.end) });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return found;
}

/** `el.dataset.act = <expr>` assignments. */
function findDatasetAssignments(source) {
  const { ts, scripts, lineOf } = source;
  const out = [];
  for (const script of scripts) {
    const { sf, codeStart } = script;
    const visit = node => {
      if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isPropertyAccessExpression(node.left)
        && node.left.name.text === 'act' && ts.isPropertyAccessExpression(node.left.expression) && node.left.expression.name.text === 'dataset') {
        out.push({ expression: node.right.getText(sf), line: lineOf(codeStart + node.getStart(sf)), node: node.right });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return out;
}

/**
 * Builds the content of mobile/actions.map.json.
 *
 * @param {object} o
 * @param {object} o.source
 * @param {Record<string, any>} o.runtimeA     tagged capture of `A`
 * @param {Array<[string, string]>} o.harvest  [data-act value, where it was rendered]
 * @param {Array<{path:string, value:string}>} o.dataActs  strings under an `act` key in extracted data
 * @param {(code:string) => ({from:number,to:number}|null)} o.locate
 * @param {Record<string, {owner:any, native:any, test:any}>} o.previous
 * @param {Record<string, string>} o.globalFunctions  name -> source of the function the global holds after load
 * @param {Record<string, string[]>} o.reassignments  name -> lines where the global is reassigned
 */
export function buildActionsMap({ source, runtimeA, harvest, harvestErrors, dataActs, locate, previous, globalFunctions, reassignments }) {
  const { ts } = source;
  const sites = scanAttribute(source, 'data-act="');
  const verbs = new Map();
  const entry = verb => {
    if (!verbs.has(verb)) verbs.set(verb, { verb, occurrences: 0, sites: [], literalArgs: [], argTemplates: [], dataPaths: [], dataArgs: [], runtimeArgs: [], rendered: false, noArg: false });
    return verbs.get(verb);
  };
  const push = (list, v) => { if (!list.includes(v)) list.push(v); };

  const dynamicSites = [];
  const selectorSites = [];
  const record = (classified, line, where) => {
    for (const hit of classified.hits) {
      const e = entry(hit.verb);
      e.occurrences++;
      push(e.sites, line);
      if (hit.arg === null) e.noArg = true;
      else if (hit.argIsTemplate) push(e.argTemplates, hit.arg);
      else push(e.literalArgs, hit.arg);
    }
    if (classified.kind === 'dynamic') {
      dynamicSites.push({
        line, where, expression: classified.expression,
        literalVerbs: [...new Set(classified.hits.map(h => h.verb))],
        dataDriven: classified.unresolved,
      });
    }
  };

  for (const site of sites) {
    if (site.selector) { selectorSites.push({ line: site.line, raw: site.raw }); continue; }
    record(classifySite(ts, site.raw), site.line, site.where);
  }
  for (const a of findDatasetAssignments(source)) {
    const hits = [];
    let unresolved = false;
    for (const p of literalPatterns(ts, a.node)) {
      if (!p) { unresolved = true; continue; }
      const c = p.text.indexOf(':');
      if (c >= 0) hits.push({ verb: p.text.slice(0, c), arg: p.text.slice(c + 1) + (p.complete ? '' : '${…}'), argIsTemplate: !p.complete });
      else if (p.complete) hits.push({ verb: p.text, arg: null, argIsTemplate: false });
      else unresolved = true;
    }
    record({ kind: 'dynamic', hits, unresolved, expression: `dataset.act = ${a.expression}` }, a.line, 'script');
  }

  // Verbs that reach the markup through data (`act:` fields).
  for (const d of dataActs) {
    const { verb, arg } = splitAct(d.value);
    const e = entry(verb);
    push(e.dataPaths, d.path);
    if (arg === null) e.noArg = true; else push(e.dataArgs, arg);
  }
  // Verbs seen when the page actually renders its tabs, sheets and views.
  for (const [value] of harvest) {
    const { verb, arg } = splitAct(value);
    const e = entry(verb);
    e.rendered = true;
    if (arg === null) e.noArg = true; else push(e.runtimeArgs, arg);
  }

  // Handlers.
  const { defs, uses } = findHandlers(source);
  const defsByVerb = new Map();
  for (const d of defs) { if (!defsByVerb.has(d.verb)) defsByVerb.set(d.verb, []); defsByVerb.get(d.verb).push(d); }
  const runtimeVerbs = Object.keys(runtimeA);
  const missingInAst = runtimeVerbs.filter(v => !defsByVerb.has(v));
  const missingAtRuntime = [...defsByVerb.keys()].filter(v => !runtimeVerbs.includes(v));
  if (missingInAst.length || missingAtRuntime.length) {
    throw new Error(`Action table mismatch. At runtime but not found in source: [${missingInAst}]. In source but not at runtime: [${missingAtRuntime}]`);
  }
  for (const v of runtimeVerbs) entry(v);

  const dispatchers = findDispatcher(source);
  if (dispatchers.length !== 1) throw new Error(`Expected exactly one data-act click listener, found ${dispatchers.length}`);
  const dispatcher = dispatchers[0];
  const dispatcherHash = createHash('sha256').update(dispatcher.text).digest('hex');
  if (dispatcherHash !== EXPECTED_DISPATCHER_SHA256) {
    throw new Error(`The click dispatcher at L${dispatcher.from} changed (sha256 ${dispatcherHash}). Re-read it and update DISPATCHER_RULES and EXPECTED_DISPATCHER_SHA256 in lib/actions.mjs.`);
  }

  const NO_HANDLER = 'No A.<verb>: the dispatcher still stops propagation (and prevents default on <a>), then does nothing. No error, no toast.';
  const HAS_HANDLER = 'A.<verb> exists, so it is called as A[verb](arg, el). (If it did not exist the click would be swallowed silently.)';

  const out = [];
  for (const e of [...verbs.values()].sort((a, b) => (a.verb < b.verb ? -1 : a.verb > b.verb ? 1 : 0))) {
    const chain = defsByVerb.get(e.verb) || [];
    const last = chain[chain.length - 1] || null;
    const runtime = runtimeA[e.verb];
    let resolvesTo = null;
    let handlerNote = null;
    if (last) {
      if (!runtime || runtime.$t !== 'function') throw new Error(`A.${e.verb} is not a function at runtime`);
      if (last.kind === 'inline' && runtime.code !== last.text) {
        throw new Error(`A.${e.verb}: the handler running in the page is not the last definition in source (L${last.from})`);
      }
      if (last.kind !== 'inline') {
        const at = locate(runtime.code);
        resolvesTo = { expression: last.text, functionName: runtime.name || null, source: at ? `${HTML_NAME} L${at.from}${at.to !== at.from ? `-L${at.to}` : ''}` : null };
        // `verb: someFunction` copies the function the name held at that
        // moment. If the global was reassigned afterwards, clicks still run
        // the old one.
        const now = globalFunctions[last.text];
        if (now !== undefined && now !== runtime.code) {
          handlerNote = `A.${e.verb} still holds the function that \`${last.text}\` was when L${last.from} ran (${resolvesTo.source}). `
            + `The global \`${last.text}\` was reassigned afterwards (${(reassignments[last.text] || []).map(l => 'L' + l).join(', ')}), but A.${e.verb} was not, `
            + `so a click on data-act="${e.verb}:…" does NOT run the newer versions; only direct calls to ${last.text}() do.`;
        }
      }
    }
    const referenced = e.occurrences > 0 || e.dataPaths.length > 0 || e.rendered;
    const argExamples = [];
    for (const a of [...e.literalArgs, ...e.dataArgs, ...e.runtimeArgs]) { if (argExamples.length < 5 && !argExamples.includes(a)) argExamples.push(a); }
    const prev = previous[e.verb] || {};
    const item = {
      verb: e.verb,
      argExamples,
      argTemplates: e.argTemplates.slice(0, 5),
      usedWithoutArg: e.noArg,
      occurrences: e.occurrences,
      sourceLines: e.sites,
      dataPaths: e.dataPaths,
      seenRendered: e.rendered,
      handlerSource: last ? `${HTML_NAME} L${last.from}` : null,
      handlerLines: last ? [last.from, last.to] : null,
      handlerDefinedBy: last ? last.how : null,
      handlerResolvesTo: resolvesTo,
      handlerNote,
      supersededHandlers: chain.slice(0, -1).map(d => `${HTML_NAME} L${d.from}`),
      directCalls: [...new Set(uses.filter(u => u.verb === e.verb).map(u => u.line))],
      fallthrough: last ? HAS_HANDLER : NO_HANDLER,
      owner: prev.owner ?? null,
      native: prev.native ?? null,
      test: prev.test ?? null,
    };
    if (!referenced) item.unreferenced = true;
    out.push(item);
  }

  const core = {};
  for (const v of ['push', 'back', 'tab', 'sheet', 'closeSheet', 'toast', 'tool', 'article', 'jump']) {
    if (runtimeA[v]) core[v] = runtimeA[v].code;
  }

  return {
    $comment: [
      'GENERATED from PrepAssist.html by tools/reference/extract (node extract/extract.mjs). Do not edit by hand,',
      'except the three fields owner / native / test of each verb: those are kept across regeneration and ignored by verify.mjs.',
    ],
    dispatcher: {
      source: `${HTML_NAME} L${dispatcher.from}-L${dispatcher.to}`,
      listensOn: `${dispatcher.target} (click)`,
      code: dispatcher.text,
      rules: DISPATCHER_RULES,
      coreHandlers: core,
      coreHandlerNotes: CORE_NOTES,
      keyboard: KEYBOARD_NOTE,
    },
    counts: {
      verbs: out.length,
      verbsInMarkupOrTemplates: out.filter(v => v.occurrences > 0).length,
      verbsOnlyFromData: out.filter(v => v.occurrences === 0 && (v.dataPaths.length > 0 || v.seenRendered)).map(v => v.verb),
      verbsWithStaleHandlerReference: out.filter(v => v.handlerNote).map(v => v.verb),
      verbsWithoutHandler: out.filter(v => v.handlerSource === null).map(v => v.verb),
      unreferencedHandlers: out.filter(v => v.unreferenced).map(v => v.verb),
      dataActSites: sites.filter(s => !s.selector).length,
    },
    dynamicSites,
    selectorUses: selectorSites,
    renderHarvest: {
      about: 'To find verbs and arguments that only exist once data is rendered, the extractor rendered the stages, the six tabs, every SHEETS entry and every VIEWS entry (first with no argument, then with each argument found in push:/article:/qbank: values) and read the data-act attributes. seenRendered on a verb means it showed up there.',
      distinctValues: new Set(harvest.map(h => h[0])).size,
      callsThatThrew: harvestErrors,
      callsThatThrewNote: 'These views need an argument; they were rendered again with every argument the collected values pointed to.',
    },
    verbs: out,
  };
}

// DISPATCHER_RULES below describe exactly the listener at L7061-L7068. If its text ever
// changes, the extractor stops so the rules are re-read and rewritten, not left stale.
const EXPECTED_DISPATCHER_SHA256 = '87ba3bb571892b75cce2d49bcc8e2414eee04ef9b37871ee157795fbc9dfb3cd';

const DISPATCHER_RULES = [
  'One click listener on document handles every interactive element.',
  "el = event.target.closest('[data-act]'). If there is none, the listener returns and the click is not handled.",
  "raw = el.dataset.act. i = raw.indexOf(':'). If i < 0: verb = raw and arg = undefined. Otherwise verb = raw.slice(0, i) and arg = raw.slice(i + 1), so only the FIRST colon splits and the arg keeps any later colons (push:note:n1 gives verb 'push', arg 'note:n1').",
  "If el is an <a>, event.preventDefault() is called.",
  'event.stopPropagation() is always called, whether or not a handler exists.',
  'fn = A[verb]. If fn exists it is called as fn(arg, el): the arg is always a string or undefined (handlers convert with unary + where they need a number), and the element is the second parameter. The return value (some handlers are async) is ignored.',
  'If A[verb] does not exist nothing else happens: no error, no toast, no fallback.',
  "The nearest ancestor with data-act wins (closest), so a data-act inside another data-act never reaches the outer one.",
  'There are no verb-specific branches in the dispatcher. push, tab, sheet, toast and the rest are ordinary entries of A (see coreHandlers).',
  'A <button disabled> does not fire click in the browser, so the verb of a disabled button is never dispatched.',
];

const CORE_NOTES = {
  push: "closeSheet(); then the arg is split once more at its first colon when that colon is not at index 0: push(view, viewArg), else push(arg). The Notes Tracker script wraps it (the code shown): 'note:new' opens the new-note sheet through A.ntNew() and everything else goes to the original.",
  back: 'A.back is assigned again after every wrap of the global back() (L8374, L8550, L10060), so it is the newest wrapper: the code shown runs _b4() (the previous wrapper), which runs the one before, down to the original back() at L6488.',
  tab: "closeSheet(); setTab(arg); and the tab's scroll position is reset to the top.",
  sheet: "openSheet(SHEETS[arg](), tall) where tall is true only for 'allTools'.",
  toast: "toast(arg, 'check'): the arg text is shown with the check icon for 2400 ms.",
  closeSheet: 'The global closeSheet().',
  tool: 'A.tool is the ORIGINAL openTool (L6954-L6960), captured when A was created. Later scripts reassign the global openTool twice (L8228, L8369) to redirect xray, notes, tests, mindmap, cloud and querydb, but A.tool is never reassigned and nothing else calls openTool(), so those redirects do not apply to data-act="tool:…" clicks. See handlerNote on the verb.',
  article: "closeSheet(); push('article', arg).",
  jump: 'Only used by the desktop jump panel and the location.hash start (line 8682-8683): jumps straight to a stage, tab or a few named screens.',
};

const KEYBOARD_NOTE = "A separate keydown listener on document (L7070-L7073): Escape closes the open sheet, else pops the top page when S.stack is not empty; '/' opens the search sheet (cmdk) when S.stage === 'app' and focus is not in an input or textarea.";

export { EXPECTED_DISPATCHER_SHA256 };
