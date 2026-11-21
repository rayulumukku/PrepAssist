// Loads PrepAssist.html in headless Chromium and reads the values its scripts
// leave behind.
//
//  * Script-level const/let bindings: listed by V8 itself
//    (Runtime.globalLexicalScopeNames) and read after the load event.
//  * Properties the page added to `window` (function declarations, `var`s,
//    `window.X = ...`): the difference against about:blank in the same context.
//  * IIFE-local bindings: a debugger breakpoint on the closing brace of each
//    IIFE; while paused there, V8 lists the function's locals and each one is
//    read in that call frame. These are the real runtime values, read without
//    touching the page's source.
//
// The page clock is installed and paused at a fixed instant, so no timer,
// animation frame or interval runs between the end of the scripts and the
// read: the capture is the state exactly as the last script left it.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { SERIALIZER } from './serialize.mjs';

export const PHONE_CONTEXT = {
  viewport: { width: 412, height: 915 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
};

/**
 * @param {object} o
 * @param {string} o.htmlPath
 * @param {Array<{id:string, closeLine:number, closeCol:number}>} o.iifes
 * @param {string} o.clock        ISO instant the page clock is frozen at
 * @param {string} o.timezoneId
 * @param {string} o.locale
 * @param {string[]} [o.callFns]  global constants whose zero-argument arrow functions are also called
 * @param {(page: import('playwright').Page) => Promise<any>} [o.afterCapture]
 */
export async function captureRuntime({ htmlPath, iifes, clock, timezoneId, locale, callFns = [], afterCapture }) {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ ...PHONE_CONTEXT, timezoneId, locale });
    // The page must not depend on the network: fonts and the one remote
    // image are blocked, so the capture is the same offline and online.
    const blocked = [];
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.startsWith('file:') || url.startsWith('data:') || url.startsWith('about:')) return route.continue();
      blocked.push(url);
      return route.abort();
    });

    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', e => pageErrors.push(String(e && e.stack || e)));

    await page.clock.install({ time: new Date(clock) });
    await page.clock.pauseAt(new Date(clock));

    // Baseline for "what did the page add to window": an empty document
    // served from file://, so it has the same set of browser globals.
    const blankDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prepassist-blank-'));
    let baselineGlobals;
    try {
      const blank = path.join(blankDir, 'blank.html');
      fs.writeFileSync(blank, '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
      await page.goto(pathToFileURL(blank).href);
      baselineGlobals = await page.evaluate(() => Object.getOwnPropertyNames(window));
    } finally {
      fs.rmSync(blankDir, { recursive: true, force: true });
    }

    const url = pathToFileURL(htmlPath).href;
    const cdp = await context.newCDPSession(page);
    await cdp.send('Runtime.enable');
    await cdp.send('Debugger.enable');

    const byBreakpoint = new Map();
    for (const iife of iifes) {
      const res = await cdp.send('Debugger.setBreakpointByUrl', {
        url, lineNumber: iife.closeLine - 1, columnNumber: iife.closeCol,
      });
      byBreakpoint.set(res.breakpointId, iife);
    }

    const iifeLocals = {};
    const pauseErrors = [];
    let chain = Promise.resolve();
    cdp.on('Debugger.paused', params => {
      chain = chain.then(async () => {
        try {
          const hit = (params.hitBreakpoints || []).map(id => byBreakpoint.get(id)).filter(Boolean);
          if (hit.length !== 1) throw new Error(`Unexpected pause (reason ${params.reason}, breakpoints ${JSON.stringify(params.hitBreakpoints)})`);
          const iife = hit[0];
          const frame = params.callFrames[0];
          const { lineNumber, columnNumber } = frame.location;
          if (lineNumber !== iife.closeLine - 1 || columnNumber !== iife.closeCol) {
            throw new Error(`${iife.id}: paused at L${lineNumber + 1}:${columnNumber}, expected the closing brace at L${iife.closeLine}:${iife.closeCol}`);
          }
          if (iifeLocals[iife.id]) throw new Error(`${iife.id}: paused twice`);
          const names = [];
          for (const scope of frame.scopeChain) {
            if (scope.type === 'global' || scope.type === 'script') break;
            const props = await cdp.send('Runtime.getProperties', { objectId: scope.object.objectId, ownProperties: true });
            for (const p of props.result) if (!names.includes(p.name)) names.push(p.name);
          }
          const locals = {};
          for (const name of names) {
            const res = await cdp.send('Debugger.evaluateOnCallFrame', {
              callFrameId: frame.callFrameId,
              expression: `(${SERIALIZER})(${name})`,
              returnByValue: true,
            });
            if (res.exceptionDetails) throw new Error(`${iife.id}: reading ${name} failed: ${res.exceptionDetails.exception?.description || res.exceptionDetails.text}`);
            locals[name] = JSON.parse(res.result.value);
          }
          iifeLocals[iife.id] = locals;
        } catch (err) {
          pauseErrors.push(err);
        } finally {
          await cdp.send('Debugger.resume').catch(() => {});
        }
      });
    });

    await page.goto(url, { waitUntil: 'load' });
    await chain;
    if (pauseErrors.length) throw pauseErrors[0];
    for (const iife of iifes) if (!iifeLocals[iife.id]) throw new Error(`${iife.id}: breakpoint at L${iife.closeLine}:${iife.closeCol} was never hit`);
    await cdp.send('Debugger.disable');

    const evalGlobal = async expression => {
      const res = await cdp.send('Runtime.evaluate', { expression, returnByValue: true });
      if (res.exceptionDetails) throw new Error(`Evaluating failed: ${res.exceptionDetails.exception?.description || res.exceptionDetails.text}\n${expression.slice(0, 200)}`);
      return res.result.value;
    };

    const { names: lexicalNames } = await cdp.send('Runtime.globalLexicalScopeNames', {});
    const globalLexical = {};
    for (const name of lexicalNames) {
      globalLexical[name] = JSON.parse(await evalGlobal(`(${SERIALIZER})(${name}, ${callFns.includes(name)})`));
    }

    const allGlobals = await page.evaluate(() => Object.getOwnPropertyNames(window));
    const base = new Set(baselineGlobals);
    const addedNames = allGlobals.filter(n => !base.has(n));
    const windowAdded = {};
    for (const name of addedNames) {
      windowAdded[name] = JSON.parse(await evalGlobal(`(${SERIALIZER})(window[${JSON.stringify(name)}])`));
    }

    const extra = afterCapture ? await afterCapture(page) : undefined;
    if (pageErrors.length) throw new Error('The page threw while loading:\n' + pageErrors.join('\n'));

    return { url, clock, timezoneId, locale, globalLexical, windowAdded, iifeLocals, blockedRequests: [...new Set(blocked)].sort(), extra };
  } finally {
    await browser.close();
  }
}

/** Opens the page (clock running) for tasks that need a live document. */
export async function withLivePage({ htmlPath, clock, timezoneId, locale, hash }, fn) {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ ...PHONE_CONTEXT, timezoneId, locale });
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url.startsWith('file:') || url.startsWith('data:') || url.startsWith('about:')) return route.continue();
      return route.abort();
    });
    const page = await context.newPage();
    await page.clock.install({ time: new Date(clock) });
    await page.clock.pauseAt(new Date(clock));
    await page.goto(pathToFileURL(htmlPath).href + (hash ? '#' + hash : ''), { waitUntil: 'load' });
    return await fn(page);
  } finally {
    await browser.close();
  }
}
