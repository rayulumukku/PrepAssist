// Builds reference/index.json from the screen definitions plus the meta.json
// each capture wrote. Source line ranges are resolved from the live page:
// fn.toString() of the final (effective) definition is located in the file.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { HTML_PATH, VIEWPORTS, FIXED_TIME_ISO, TIMEZONE, LOCALE, CONTEXT_BASE } from './config.mjs';
import { SCENARIOS, allCaptures } from './screens.mjs';
import { linesOf, allDefs } from './engine.mjs';
import { openPausedPage } from './runtime.mjs';

// helpers that every renderer calls; not interesting as "rendered by"
const COMMON = new Set(['$', '$$', 'ic', 'wait', 'toast', 't', 'push', 'back', 'go', 'openSheet', 'closeSheet', 'sheetFrame', 'setTab', 'syncChrome', 'closeAllPages', 'pageShell', 'refreshTop', 'refreshAll', 'refreshPage', 'setTimeout', 'requestAnimationFrame', 'String', 'Math', 'Array', 'Object', 'Number', 'parseInt', 'parseFloat', 'encodeURIComponent', 'decodeURIComponent', 'esc', 'isoD', 'parseD', 'addD', 'fmtShort', 'fmtLong']);

async function resolveSources(page, wants) {
  // wants: [{ key, expr }] where expr is a global expression that evaluates to a function
  return page.evaluate(({ wants, common }) => {
    const g = code => { try { return (0, eval)(code); } catch (e) { return undefined; } };
    const out = {};
    for (const w of wants) {
      const fn = g(w.expr);
      if (typeof fn !== 'function') { out[w.key] = { missing: true }; continue; }
      const src = fn.toString();
      const callees = [];
      const seen = new Set(common);
      const re = /(^|[^.\w$])([A-Za-z_$][\w$]*)\s*\(/g; let m;
      while ((m = re.exec(src))) {
        const name = m[2]; if (seen.has(name)) continue; seen.add(name);
        const f = g(`typeof ${name} === 'function' ? ${name} : undefined`);
        if (typeof f === 'function') { const s = f.toString(); if (!/\[native code\]/.test(s)) callees.push({ name, src: s }); }
        else if (f === undefined && name.length > 2) callees.push({ name, src: null });
      }
      out[w.key] = { src, callees };
    }
    return out;
  }, { wants, common: [...COMMON] });
}

const where = (name, src) => {
  // a function declaration prints exactly as written; a const arrow prints only the arrow, so both are found verbatim
  if (src) { const l = linesOf(src); if (l) return { name, lines: l }; }
  // not a global at runtime (declared inside one of the later IIFE scripts): find its definition by name in the file
  const defs = allDefs(name);
  return defs.length ? { name, lines: defs[defs.length - 1], scope: 'not global (inside an IIFE); located by name' } : null;
};

export async function buildIndex(browser, outRoot, { failures = [] } = {}) {
  const caps = allCaptures();
  const wants = [];
  for (const c of caps) {
    if (c.view) wants.push({ key: `${c.id}|view`, expr: `VIEWS[${JSON.stringify(c.view)}]` });
    if (c.sheet) wants.push({ key: `${c.id}|sheet`, expr: `SHEETS[${JSON.stringify(c.sheet)}]` });
    for (const f of c.fns || []) wants.push({ key: `${c.id}|fn|${f}`, expr: f });
  }
  const { context, page } = await openPausedPage(browser);
  let resolved;
  try { resolved = await resolveSources(page, wants); } finally { await context.close(); }

  const html = fs.readFileSync(HTML_PATH);
  const registry = await (async () => { const o = await openPausedPage(browser); try { return await o.page.evaluate(() => ({ VIEWS: Object.keys(VIEWS), SHEETS: Object.keys(SHEETS), A: Object.keys(A), sheetOpeners: Object.fromEntries(Object.keys(SHEETS).map(k => [k, Object.keys(A).filter(a => A[a].toString().includes('SHEETS.' + k + '('))])) })); } finally { await o.context.close(); } })();
  const actsSeen = {}; // data-act value -> screens whose captured DOM contains it
  const screens = [];
  const counts = {};
  for (const c of caps) {
    const source = [];
    const renderedBy = [];
    const addCallees = r => { for (const k of (r.callees || [])) { if (renderedBy.some(x => x.name === k.name)) continue; const w = where(k.name, k.src); if (w) renderedBy.push(w); } };
    if (c.view) { const r = resolved[`${c.id}|view`]; if (r && !r.missing) { source.push({ what: `VIEWS.${c.view} (final effective definition)`, lines: linesOf(r.src) }); addCallees(r); } else source.push({ what: `VIEWS.${c.view}`, lines: null, note: 'not found at runtime' }); }
    if (c.sheet) { const r = resolved[`${c.id}|sheet`]; if (r && !r.missing) { source.push({ what: `SHEETS.${c.sheet}`, lines: linesOf(r.src) }); addCallees(r); } else source.push({ what: `SHEETS.${c.sheet}`, lines: null, note: 'not found at runtime' }); }
    for (const f of c.fns || []) { const r = resolved[`${c.id}|fn|${f}`]; if (r && !r.missing) { source.push({ what: f, lines: linesOf(r.src) }); addCallees(r); } else source.push({ what: f, lines: null, note: 'not a global function at runtime' }); }
    for (const d of c.defs || []) { const all = allDefs(d); all.forEach((l, i) => source.push({ what: all.length > 1 ? `${d} (definition ${i + 1} of ${all.length}${i === all.length - 1 ? ', effective' : ', wrapped or replaced by a later one'})` : d, lines: l })); if (!all.length) source.push({ what: d, lines: null, note: 'no top-level definition found' }); }
    for (const m of c.markup || []) source.push({ what: m.what, lines: m.lines });

    const viewports = {};
    let reach = null, focus = null;
    for (const vpName of Object.keys(VIEWPORTS)) {
      const dir = path.join(outRoot, vpName, c.id);
      const mp = path.join(dir, 'meta.json');
      if (!fs.existsSync(mp)) { viewports[vpName] = { captured: false }; continue; }
      const meta = JSON.parse(fs.readFileSync(mp, 'utf8'));
      const present = meta.files.filter(f => fs.existsSync(path.join(dir, f)));
      counts[vpName] = (counts[vpName] || 0) + 1;
      if (vpName === Object.keys(VIEWPORTS)[0]) {
        try {
          const dom = JSON.parse(fs.readFileSync(path.join(dir, 'dom.json'), 'utf8'));
          const walk = n => { const a = n.attrs && n.attrs['data-act']; if (a) (actsSeen[a] = actsSeen[a] || new Set()).add(c.id); if (n.svg) for (const m of n.svg.matchAll(/data-act="([^"]*)"/g)) (actsSeen[m[1]] = actsSeen[m[1]] || new Set()).add(c.id); (n.children || []).forEach(walk); };
          walk(dom.root); (dom.chrome || []).forEach(walk);
        } catch (e) { /* dom.json unreadable: reported by verify.mjs */ }
      }
      reach = reach || meta.reach;
      if (meta.state.top) focus = meta.state.top.focusClass;
      viewports[vpName] = {
        captured: true,
        dir: `${vpName}/${c.id}`,
        files: present.map(f => `${vpName}/${c.id}/${f}`),
        missingFiles: meta.files.filter(f => !present.includes(f)),
        scrollLength: meta.scroll ? meta.scroll.scrollHeight : null,
        scrollViewport: meta.scroll ? meta.scroll.clientHeight : null,
        scrollContainer: meta.scroll ? meta.scroll.container : null,
        scrollShots: meta.scroll ? meta.scroll.shots : 0,
        domNodes: meta.domNodes,
        chrome: meta.chromeNodes,
        ask: meta.state.ask, toast: meta.state.toast, sheetOpen: meta.state.sheetOn,
        stage: meta.state.stage, tab: meta.state.tab, stack: meta.state.stack, lang: meta.state.lang, planTheme: meta.state.plan,
        shellScroll: meta.state.shellScroll && meta.state.shellScroll.length ? meta.state.shellScroll : undefined,
        scrollTopAtShot: meta.scroll ? meta.scroll.scrollTopAtShot : null,
        clippedOverflow: meta.clippedOverflow || undefined,
        atRest: meta.rest,
        systemFontGlyphs: meta.fonts.systemFallback,
        fakeClockElapsedMs: meta.fakeElapsedMsAtShot,
        pageErrors: meta.pageErrors, failedRequests: meta.failedRequests,
      };
    }
    screens.push({
      id: c.id, kind: c.kind, title: c.title, scenario: c.scenario,
      reach: reach || c.plannedReach,
      reachCaptured: !!reach,
      source, renderedBy,
      focus: c.view ? focus : null,
      timeline: !!c.timeline,
      view: c.view || null, viewArg: c.arg ?? null, sheet: c.sheet || null,
      fixedTime: c.time || FIXED_TIME_ISO,
      timeDependent: c.timeDependent || null,
      notes: c.notes || null,
      viewports,
    });
  }

  const doc = {
    generatedAt: new Date().toISOString(),
    prototype: { file: 'PrepAssist.html', sha1: crypto.createHash('sha1').update(html).digest('hex'), bytes: html.length, lines: html.toString('utf8').split('\n').length },
    fixedClock: { iso: FIXED_TIME_ISO, timezone: TIMEZONE, locale: LOCALE, how: 'Playwright clock: install + pauseAt before navigation; time only advances through clock.runFor(ms) steps recorded in each "reach" list' },
    viewports: VIEWPORTS,
    emulation: { ...CONTEXT_BASE, note: 'isMobile is false on purpose: with Chromium mobile emulation the <head> script on line 4 runs while the layout viewport is still the 980px fallback, so the page adds class "framed". hasTouch keeps (hover:hover) and (pointer:fine) false. Every capture asserts html.framed is absent.' },
    reachLegend: {
      goto: 'load PrepAssist.html with that location.hash (handled by A.jump, L6971); no hash runs go("book")',
      call: 'expression evaluated in the page global scope (the prototype\'s own functions)',
      act: 'click() on the visible element whose data-act equals this value (prefix:true = starts with), in the top-most layer: sheet, reel viewer, top page, active stage',
      click: 'click() on the first visible element matching this CSS selector',
      fill: '[selector, text]: set the input value and dispatch input + change',
      run: 'advance the fake clock by this many ms (fires the page\'s timers and rAF callbacks), then wait in real time for finite CSS animations/transitions to end. Every goto/call/act/click is followed by run 600 unless it carries its own run value',
      wait: 'real-time wait only (ms)',
      scroll: '[selector, scrollTop]',
      captured: 'an earlier state in the same scenario was captured here (its scroll captures ran and scrollTop was put back to 0)',
    },
    counts: { definitions: caps.length, scenarios: SCENARIOS.length, ...counts },
    registryCoverage: (() => {
      const verbs = {}; for (const a of Object.keys(actsSeen)) { const v = a.split(':')[0]; verbs[v] = (verbs[v] || 0) + 1; }
      const pushed = k => Object.keys(actsSeen).filter(a => a === `push:${k}` || a.startsWith(`push:${k}:`)).flatMap(a => [...actsSeen[a]]);
      const viaAct = { quiz: ['quiz', 'testStart', 'engineGo'], article: ['article:'], qbank: ['qbank:'], mainsResult: ['mvRun'], xrayhome: [], note2: [], ntNote: [] };
      return {
        note: 'uiEntryPoints lists captured screens whose DOM contains a data-act that opens the key; an empty list means no captured screen links to it (it may still be opened from JS). For sheets, openedByActions are the A.* handlers whose live source calls SHEETS.<key>(). Based on the android dom.json files.',
        VIEWS: Object.fromEntries(registry.VIEWS.map(k => [k, { captures: caps.filter(c => c.view === k).map(c => c.id), uiEntryPoints: [...new Set([...pushed(k), ...(viaAct[k] || []).flatMap(p => Object.keys(actsSeen).filter(a => p.endsWith(':') ? a.startsWith(p) : a === p).flatMap(a => [...actsSeen[a]]))])].slice(0, 12) }])),
        SHEETS: Object.fromEntries(registry.SHEETS.map(k => [k, { captures: caps.filter(c => c.sheet === k).map(c => c.id), openedByActions: registry.sheetOpeners[k], uiEntryPoints: [...new Set(Object.keys(actsSeen).filter(a => a === `sheet:${k}` || registry.sheetOpeners[k].includes(a.split(':')[0])).flatMap(a => [...actsSeen[a]]))].slice(0, 12) }])),
        viewsWithoutCapture: registry.VIEWS.filter(k => !caps.some(c => c.view === k)),
        sheetsWithoutCapture: registry.SHEETS.filter(k => !caps.some(c => c.sheet === k)),
        actionCount: registry.A.length,
        actionVerbsSeenInCapturedDom: Object.keys(verbs).sort(),
        actionsNeverSeenInCapturedDom: registry.A.filter(k => !verbs[k]),
      };
    })(),
    failures,
    screens,
  };
  fs.mkdirSync(outRoot, { recursive: true });
  fs.writeFileSync(path.join(outRoot, 'index.json'), JSON.stringify(doc, null, 1));
  return doc;
}
