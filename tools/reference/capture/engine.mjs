// Capture engine: drives PrepAssist.html through its own functions and
// data-act handlers, waits for rest, and writes shot/scroll PNGs, dom.json,
// html.txt and meta.json for each captured state.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  HTML_URL, HTML_PATH, CONTEXT_BASE, FIXED_TIME_ISO, WEB_FONTS,
  STEP_FAKE_MS, AMBIENT_SETTLE_MS, SCROLL_STEP,
} from './config.mjs';
import { snapshotInPage, countNodes } from './dom-snapshot.mjs';

const CHROME_SELECTORS = ['#nav', '#ask', '#scrim', '#sheet', '#toast', '#reelV', '#app > .pm-ov', '#layer > .page'];
const MAX_SCROLL_SHOTS = 40;

export class CaptureError extends Error {}

const sha1 = buf => crypto.createHash('sha1').update(buf).digest('hex');

// ---------------------------------------------------------------- page helpers

/**
 * Fonts: for every character actually rendered inside #app, find the first
 * family in its font-family list that has a web-font face covering it (that is
 * the face the browser uses) and require document.fonts.check() to be true for
 * exactly that family at the element's weight/style. Checking the whole
 * fallback list at once would be wrong: 'Noto Sans Devanagari' also declares a
 * latin subset that is never downloaded because Inter comes first.
 */
async function fontAudit(page) {
  return page.evaluate(async (WEB_FONTS) => {
    await document.fonts.ready;
    const clean = f => f.replace(/["']/g, '').trim();
    const faces = [...document.fonts].map(f => ({
      family: clean(f.family), weight: f.weight, style: f.style, status: f.status,
      ranges: f.unicodeRange.split(',').map(r => { const m = r.trim().replace(/^U\+/i, '').split('-'); const lo = parseInt(m[0].replace(/\?/g, '0'), 16), hi = parseInt((m[1] || m[0]).replace(/\?/g, 'F'), 16); return [lo, hi]; }),
    }));
    const declared = WEB_FONTS.filter(f => faces.some(x => x.family === f));
    const errored = faces.filter(x => x.status === 'error').map(x => `${x.family} ${x.weight} ${x.style}`);
    const loading = faces.filter(x => x.status === 'loading').map(x => `${x.family} ${x.weight} ${x.style}`);
    const loaded = [...new Set(faces.filter(x => x.status === 'loaded').map(x => `${x.family} ${x.weight} ${x.style}`))].sort();
    const covers = (fam, cp) => faces.some(f => f.family === fam && f.ranges.some(([lo, hi]) => cp >= lo && cp <= hi));
    const combos = new Map();
    const app = document.querySelector('#app');
    const walker = document.createTreeWalker(app, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const txt = n.nodeValue; if (!txt.trim()) continue;
      const el = n.parentElement; if (!el || el.closest('script,style,template')) continue;
      if (!el.getClientRects().length) continue;
      const cs = getComputedStyle(el);
      const key = `${cs.fontStyle}|${cs.fontWeight}|${cs.fontFamily}`;
      let set = combos.get(key); if (!set) combos.set(key, set = new Set());
      for (const ch of txt) if (ch.trim()) set.add(ch);
    }
    for (const el of app.querySelectorAll('input,textarea')) {
      if (!el.getClientRects().length) continue;
      const cs = getComputedStyle(el); const key = `${cs.fontStyle}|${cs.fontWeight}|${cs.fontFamily}`;
      let set = combos.get(key); if (!set) combos.set(key, set = new Set());
      for (const ch of (el.value || '') + (el.placeholder || '')) if (ch.trim()) set.add(ch);
    }
    const missing = [], system = {};
    for (const [key, chars] of combos) {
      const [style, weight, famList] = key.split('|');
      const fams = famList.split(',').map(clean);
      const need = new Map(); // web family -> chars it must render
      for (const ch of chars) {
        const cp = ch.codePointAt(0);
        let hit = null;
        for (const fam of fams) { if (WEB_FONTS.includes(fam)) { if (covers(fam, cp)) { hit = fam; break; } } else break; }
        if (hit) need.set(hit, (need.get(hit) || '') + ch);
        else { const k = fams.join(', '); system[k] = system[k] || new Set(); system[k].add(ch); }
      }
      for (const [fam, text] of need) {
        const font = `${style} ${weight} 16px "${fam}"`;
        let ok = false; try { ok = document.fonts.check(font, text); } catch (e) { ok = false; }
        const anyLoaded = faces.some(f => f.family === fam && f.status === 'loaded');
        if (!ok || !anyLoaded) missing.push(`${font} for "${text.slice(0, 24)}"`);
      }
    }
    const systemFallback = Object.entries(system).map(([stack, set]) => ({ stack, chars: [...set].sort().join('').slice(0, 80) }));
    return { declared, errored, loading, loaded, missing, systemFallback, combos: combos.size, faceCount: faces.length };
  }, WEB_FONTS);
}

async function assertFonts(page, where) {
  let a;
  for (let i = 0; i < 40; i++) {
    a = await fontAudit(page);
    if (!a.loading.length && !a.missing.length) break;
    await page.waitForTimeout(150);
  }
  if (a.declared.length !== WEB_FONTS.length) throw new CaptureError(`FONTS: Google Fonts stylesheet did not load at ${where}: declared families = [${a.declared.join(', ')}], expected [${WEB_FONTS.join(', ')}]`);
  if (a.errored.length) throw new CaptureError(`FONTS: font faces failed to load at ${where}: ${a.errored.join('; ')}`);
  if (a.loading.length || a.missing.length) throw new CaptureError(`FONTS: fonts not loaded at ${where}: loading=[${a.loading.join('; ')}] missing=[${a.missing.join('; ')}]`);
  return a;
}

async function assertUnframed(page, where) {
  const framed = await page.evaluate(() => document.documentElement.classList.contains('framed'));
  if (framed) throw new CaptureError(`FRAMED: <html> has class "framed" at ${where}; refusing to capture the desktop frame`);
}

/**
 * Wait (real time) until no finite CSS animation/transition is running, no
 * element is still scrolling (smooth scrollTo / scrollIntoView run in real
 * time and are not animations), and fonts are idle.
 */
async function waitIdle(page, maxReal = 9000) {
  const t0 = Date.now(); let quiet = 0; let st = null; let lastScroll = null;
  while (Date.now() - t0 < maxReal) {
    st = await page.evaluate(() => {
      const fin = [], inf = new Set();
      for (const a of document.getAnimations()) {
        if (a.playState !== 'running') continue;
        const t = a.effect && a.effect.getComputedTiming(); if (!t) continue;
        const name = a.animationName || (a.transitionProperty ? `transition:${a.transitionProperty}` : 'animation');
        if (t.endTime === Infinity) inf.add(name); else fin.push(name);
      }
      let scroll = 0;
      for (const el of document.querySelectorAll('#app, #app *')) { if (el.scrollTop || el.scrollLeft) scroll += el.scrollTop * 1.0001 + el.scrollLeft * 1.37; }
      return { fin, inf: [...inf].sort(), fontsLoading: document.fonts.status === 'loading', scroll };
    });
    const scrolling = lastScroll !== null && st.scroll !== lastScroll; lastScroll = st.scroll;
    if (!st.fin.length && !st.fontsLoading && !scrolling) { if (++quiet >= 2) return { ...st, timeout: false, realMs: Date.now() - t0 }; }
    else quiet = 0;
    await page.waitForTimeout(70);
  }
  return { ...st, timeout: true, realMs: Date.now() - t0 };
}

async function pageState(page) {
  return page.evaluate(() => {
    const ask = document.querySelector('#ask'), toast = document.querySelector('#toast'), sheet = document.querySelector('#sheet');
    const imgs = [...document.querySelectorAll('#app img')].filter(i => i.getClientRects().length).map(i => ({ src: (i.getAttribute('src') || '').slice(0, 120), naturalWidth: i.naturalWidth, complete: i.complete }));
    const top = S.stack[S.stack.length - 1];
    return {
      stage: S.stage, tab: S.tab, stack: S.stack.map(p => p.arg !== undefined ? `${p.id}:${p.arg}` : p.id),
      top: top ? { id: top.id, arg: top.arg === undefined ? null : top.arg, focusClass: top.el.classList.contains('focus'), hidesAsk: !!top.focus } : null,
      lang: S.lang, plan: document.documentElement.dataset.plan || null, mePlan: S.me && S.me.plan,
      sheetOn: sheet.classList.contains('on'), sheetClass: sheet.className,
      ask: ask.classList.contains('hide') ? 'hidden' : ask.classList.contains('mini') ? 'mini' : 'full',
      toast: toast.classList.contains('on') ? toast.textContent : null,
      now: new Date().toString(), nowMs: Date.now(),
      // scrollIntoView() in the prototype can also scroll overflow:hidden ancestors by a few px; record it when it happens
      shellScroll: [document.scrollingElement, document.body, document.querySelector('#app'), document.querySelector('.stage.on'), document.querySelector('#layer'), top && top.el]
        .filter(Boolean).filter(e => e.scrollTop || e.scrollLeft).map(e => ({ el: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).join('.') : ''), scrollTop: e.scrollTop, scrollLeft: e.scrollLeft })),
      images: imgs,
    };
  });
}

// ---------------------------------------------------------------- steps

async function doAct(page, step) {
  const res = await page.evaluate(({ act, prefix, nth, within, selector }) => {
    const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; return el.getClientRects().length > 0; };
    const layers = [];
    if (within) layers.push([within, document.querySelector(within)]);
    else {
      layers.push(['#sheet.on', document.querySelector('#sheet.on')]);
      layers.push(['#reelV.on', document.querySelector('#reelV.on')]);
      const pages = document.querySelectorAll('#layer > .page'); if (pages.length) layers.push(['top page', pages[pages.length - 1]]);
      layers.push(['.stage.on', document.querySelector('.stage.on')]);
      layers.push(['#app', document.querySelector('#app')]);
    }
    for (const [name, L] of layers) {
      if (!L) continue;
      let m;
      if (selector) m = [...L.querySelectorAll(selector)];
      else m = [...L.querySelectorAll('[data-act]')].filter(e => prefix ? e.dataset.act.startsWith(act) : e.dataset.act === act);
      m = m.filter(vis);
      const el = m[nth || 0];
      if (el) { const used = el.dataset ? el.dataset.act : null; el.click(); return { ok: true, layer: name, matches: m.length, act: used, disabled: el.disabled === true }; }
    }
    return { ok: false };
  }, { act: step.act, prefix: !!step.prefix, nth: step.nth, within: step.within, selector: step.click });
  if (!res.ok) throw new CaptureError(`step ${JSON.stringify(step)}: no visible element found`);
  if (res.disabled) throw new CaptureError(`step ${JSON.stringify(step)}: element is disabled`);
  return res;
}

async function doFill(page, [selector, value]) {
  const ok = await page.evaluate(({ selector, value }) => {
    const all = [...document.querySelectorAll(selector)].filter(e => e.getClientRects().length);
    const el = all[all.length - 1]; if (!el) return false;
    el.focus({ preventScroll: true });
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
    el.dispatchEvent(new InputEvent('input', { bubbles: true, data: value, inputType: 'insertText' }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { selector, value });
  if (!ok) throw new CaptureError(`fill: no visible element for ${selector}`);
}

// ---------------------------------------------------------------- capture

async function findScroller(page, cap) {
  return page.evaluateHandle(({ scroller, root, topPage }) => {
    let rootEl;
    if (topPage) { const p = document.querySelectorAll('#layer > .page'); rootEl = p[p.length - 1]; } else rootEl = document.querySelector(root);
    if (!rootEl) return null;
    if (scroller && scroller !== 'auto') { const all = [...rootEl.querySelectorAll(scroller)]; if (rootEl.matches(scroller)) all.unshift(rootEl); return all.find(e => e.getClientRects().length) || document.querySelector(scroller); }
    let best = null, bestArea = 0;
    const consider = el => {
      const cs = getComputedStyle(el);
      if (!/auto|scroll/.test(cs.overflowY)) return;
      if (el.scrollHeight - el.clientHeight < 8) return;
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)), h = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      const area = w * h; if (area > bestArea) { best = el; bestArea = area; }
    };
    consider(rootEl); rootEl.querySelectorAll('*').forEach(consider);
    return bestArea > innerWidth * innerHeight * 0.15 ? best : null;
  }, { scroller: cap.scroller || 'auto', root: cap.root, topPage: cap.root === 'top-page' });
}

const describeEl = h => h.evaluate(el => {
  const cls = typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '';
  return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + cls;
});

async function stableShot(page, hasAmbient) {
  // Two frames 180 ms apart must be byte-identical unless ambient animations run.
  let prev = await page.screenshot({ type: 'png' });
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(180);
    const cur = await page.screenshot({ type: 'png' });
    if (cur.equals(prev)) return { buf: cur, stable: true, tries: i + 1 };
    prev = cur;
    if (hasAmbient && i >= 1) break;
  }
  return { buf: prev, stable: false, tries: 6 };
}

export async function runScenario(browser, scenario, vpName, vp, opts) {
  const { outRoot, only, log } = opts;
  const timeIso = scenario.time || FIXED_TIME_ISO;
  const t0 = new Date(timeIso);
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, ...CONTEXT_BASE });
  const results = [];
  const pageErrors = [], failedRequests = [];
  let fakeElapsed = 0;
  try {
    await context.clock.install({ time: t0 });
    await context.clock.pauseAt(t0);
    const page = await context.newPage();
    page.on('pageerror', e => pageErrors.push(e.message));
    page.on('requestfailed', r => failedRequests.push(`${r.url().slice(0, 120)} ${r.failure() ? r.failure().errorText : ''}`));

    let actionAt = Date.now();
    const advance = async ms => { if (ms > 0) { await page.clock.runFor(ms); fakeElapsed += ms; } };
    // idle:false on a step = do not wait for animations (used before timeline captures)
    const settle = async (ms = STEP_FAKE_MS, step = null) => { await advance(ms); actionAt = Date.now(); if (step && step.idle === false) return null; return waitIdle(page); };
    const reach = [];

    for (const step of scenario.steps) {
      if ('goto' in step) {
        await page.goto(HTML_URL + (step.goto ? '#' + step.goto : ''), { waitUntil: 'load' });
        const d = await page.evaluate(t => Date.now() - t, t0.getTime());
        if (d !== 0) throw new CaptureError(`clock: page started ${d} ms away from the fixed time`);
        await assertUnframed(page, `goto #${step.goto}`);
        await settle(step.run ?? STEP_FAKE_MS);
        await assertFonts(page, `goto #${step.goto}`);
        reach.push({ goto: `PrepAssist.html${step.goto ? '#' + step.goto : ''}`, ...(step.run != null ? { thenRunMs: step.run } : {}) });
      } else if ('call' in step) {
        const err = await page.evaluate(code => { try { void (0, eval)(code); return null; } catch (e) { return e.message; } }, step.call);
        if (err) throw new CaptureError(`call ${step.call}: ${err}`);
        await settle(step.run ?? STEP_FAKE_MS, step);
        reach.push(step);
      } else if ('act' in step || 'click' in step) {
        await doAct(page, step);
        await settle(step.run ?? STEP_FAKE_MS, step);
        reach.push(step);
      } else if ('fill' in step) {
        await doFill(page, step.fill);
        await settle(step.run ?? 100);
        reach.push(step);
      } else if ('run' in step) {
        await settle(step.run);
        reach.push(step);
      } else if ('wait' in step) {
        await page.waitForTimeout(step.wait);
        reach.push(step);
      } else if ('until' in step) {
        // real-time offset measured from the end of the previous action step
        const left = step.until - (Date.now() - actionAt);
        if (left > 0) await page.waitForTimeout(left);
        reach.push(step);
      } else if ('reveal' in step) {
        // Centre the element inside its nearest real scroll container by setting scrollTop. scrollIntoView() is
        // deliberately not used: it also scrolls overflow:hidden ancestors (#app), which shifts the whole shell.
        const ok = await page.evaluate(sel => {
          const all = [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length); const el = all[all.length - 1]; if (!el) return false;
          let sc = el.parentElement;
          while (sc && !(/auto|scroll/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight - sc.clientHeight > 1)) sc = sc.parentElement;
          if (!sc) return 'no scroll container';
          const er = el.getBoundingClientRect(), sr = sc.getBoundingClientRect();
          sc.scrollTop += (er.top + er.height / 2) - (sr.top + sr.height / 2);
          return true;
        }, step.reveal);
        if (ok === 'no scroll container') throw new CaptureError(`reveal: ${step.reveal} is not inside a scrollable container`);
        if (!ok) throw new CaptureError(`reveal: no visible element for ${step.reveal}`);
        await settle(step.run ?? 200);
        reach.push(step);
      } else if ('scroll' in step) {
        const [sel, y] = step.scroll;
        const ok = await page.evaluate(({ sel, y }) => { const all = [...document.querySelectorAll(sel)].filter(e => e.getClientRects().length); const el = all[all.length - 1]; if (!el) return false; el.scrollTop = y === 'end' ? el.scrollHeight : y; return true; }, { sel, y });
        if (!ok) throw new CaptureError(`scroll: no visible element for ${sel}`);
        await settle(step.run ?? 200);
        reach.push(step);
      } else if ('capture' in step) {
        const cap = normaliseCapture(step.capture);
        if (only && !only.has(cap.id)) { reach.push({ captured: cap.id, skipped: true }); continue; }
        const meta = await captureState(page, cap, { vpName, vp, outRoot, reach: [...reach], timeIso, fakeElapsed, advance, scenarioId: scenario.id, actionAt });
        meta.pageErrors = [...pageErrors]; meta.failedRequests = [...failedRequests];
        fs.writeFileSync(path.join(outRoot, vpName, cap.id, 'meta.json'), JSON.stringify(meta, null, 1));
        results.push({ id: cap.id, ok: true, files: meta.files.length, scrollShots: meta.scroll ? meta.scroll.shots : 0 });
        log(`  [${vpName}] ${cap.id}: ${meta.files.length} files${meta.clippedOverflow ? `, CLIPPED ${meta.clippedOverflow.hiddenPx}px unscrollable` : ''}${meta.scroll ? `, scroll ${meta.scroll.scrollHeight}px in ${meta.scroll.shots} steps` : ''}${meta.rest.ambientAnimations.length ? ', ambient' : ''}${meta.rest.settleTimeout ? ', SETTLE TIMEOUT' : ''}`);
        reach.push({ captured: cap.id });
      } else throw new CaptureError(`unknown step ${JSON.stringify(step)}`);
    }
  } finally {
    await context.close();
  }
  return results;
}

export function normaliseCapture(c) {
  const cap = { ...c };
  if (!cap.root) {
    if (cap.kind === 'view') cap.root = 'top-page';
    else if (cap.kind === 'sheet') cap.root = '#sheet';
    else throw new Error(`capture ${cap.id}: root selector required for kind ${cap.kind}`);
  }
  return cap;
}

async function captureState(page, cap, env) {
  const { vpName, vp, outRoot, reach, timeIso, advance, scenarioId } = env;
  const dir = path.join(outRoot, vpName, cap.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  await assertUnframed(page, cap.id);
  const files = [];
  let idle, fonts, ambientAll = [], first, timelineOffsetMs = null;
  if (cap.timeline) {
    // A frame at a real-time offset inside a running animation sequence: no waiting, one screenshot.
    timelineOffsetMs = Date.now() - env.actionAt;
    if (cap.timelineTargetMs != null && Math.abs(timelineOffsetMs - cap.timelineTargetMs) > 150) throw new CaptureError(`${cap.id}: timeline frame would be ${timelineOffsetMs} ms in, target ${cap.timelineTargetMs} ms (machine too busy; rerun with --jobs 1)`);
    const buf = await page.screenshot({ type: 'png' });
    first = { buf, stable: false, tries: 1 };
    idle = await waitIdle(page, 1);
    fonts = await assertFonts(page, cap.id);
    ambientAll = idle.inf || [];
  } else {
    idle = await waitIdle(page, cap.settleMaxMs || 9000);
    fonts = await assertFonts(page, cap.id);
    idle = await waitIdle(page, cap.settleMaxMs || 9000);
    ambientAll = idle.inf || [];
  }
  if (cap.expect) {
    const ok = await page.evaluate(code => { try { return !!(0, eval)(code); } catch (e) { return 'threw: ' + e.message; } }, cap.expect);
    if (ok !== true) throw new CaptureError(`${cap.id}: expectation not met (${cap.expect}) -> ${ok}`);
  }
  // infinite animations that belong to what is being captured (root or visible chrome), as opposed to covered layers
  const amb = await page.evaluate(({ root, topPage, chromeSelectors }) => {
    let rootEl; if (topPage) { const p = document.querySelectorAll('#layer > .page'); rootEl = p[p.length - 1]; } else rootEl = document.querySelector(root);
    const chrome = chromeSelectors.flatMap(s => [...document.querySelectorAll(s)]).filter(el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight; });
    const here = new Set(), elsewhere = new Set();
    for (const a of document.getAnimations()) {
      if (a.playState !== 'running') continue;
      const t = a.effect && a.effect.getComputedTiming(); if (!t || t.endTime !== Infinity) continue;
      const name = a.animationName || 'animation', target = a.effect.target;
      const inside = target && ((rootEl && rootEl.contains(target)) || chrome.some(c => c.contains(target)));
      (inside ? here : elsewhere).add(name);
    }
    return { here: [...here].sort(), elsewhere: [...elsewhere].sort() };
  }, { root: cap.root, topPage: cap.root === 'top-page', chromeSelectors: CHROME_SELECTORS });
  const ambient = amb.here;
  if (!cap.timeline && ambientAll.length) await page.waitForTimeout(AMBIENT_SETTLE_MS);
  const state = await pageState(page);
  if (cap.expectToast && !state.toast) throw new CaptureError(`${cap.id}: expected a visible toast`);

  if (!cap.timeline) first = await stableShot(page, ambientAll.length > 0);
  fs.writeFileSync(path.join(dir, 'shot.png'), first.buf); files.push('shot.png');

  const snap = await page.evaluate(snapshotInPage, { rootSelector: cap.root, rootIsTopPage: cap.root === 'top-page', chromeSelectors: CHROME_SELECTORS, pruneSelector: cap.domPrune || null });
  if (snap.error) throw new CaptureError(`${cap.id}: ${snap.error}`);
  const html = snap.html; delete snap.html;
  const domDoc = {
    meta: { id: cap.id, viewport: vpName, cssWidth: vp.width, cssHeight: vp.height, deviceScaleFactor: vp.deviceScaleFactor, fixedTime: timeIso, root: cap.root, rectUnits: 'CSS px, [x, y, width, height] relative to the viewport exactly as in shot.png (scroll containers carry their scrollTop in the scroll field)' },
    ...(cap.domPrune ? { pruned: { selector: cap.domPrune, note: 'elements matching this selector are listed with pruned:true and without their children (exact duplicates of content kept elsewhere in this file); html.txt still has everything' } } : {}),
    defaults: snap.defaults, root: snap.root, chrome: snap.chrome,
  };
  fs.writeFileSync(path.join(dir, 'dom.json'), JSON.stringify(domDoc));
  files.push('dom.json');
  fs.writeFileSync(path.join(dir, 'html.txt'), html); files.push('html.txt');

  // scroll captures
  let scroll = null;
  if (cap.scroller !== null && !cap.timeline) {
    const h = await findScroller(page, cap);
    const el = h.asElement();
    if (el) {
      const m = await el.evaluate(e => ({ scrollHeight: e.scrollHeight, clientHeight: e.clientHeight, top: e.scrollTop }));
      const max = m.scrollHeight - m.clientHeight;
      if (max > 8) {
        const stepPx = Math.round(m.clientHeight * SCROLL_STEP);
        const positions = [];
        for (let y = stepPx; ; y += stepPx) { const yy = Math.min(y, max); positions.push(yy); if (yy >= max) break; if (positions.length >= MAX_SCROLL_SHOTS) break; }
        const shots = [];
        if (m.top > 4) {
          // The state rests scrolled (the page scrolled itself, e.g. to feedback). shot.png and dom.json show that
          // position; scroll-00.png adds the top of the content before the regular steps.
          await el.evaluate(e => { e.scrollTop = 0; });
          await advance(150);
          let last0 = -1;
          for (let k = 0; k < 30; k++) { const cur = await el.evaluate(e => e.scrollTop); if (cur === last0) break; last0 = cur; await page.waitForTimeout(60); }
          await waitIdle(page, 4000);
          const s0 = await stableShot(page, ambientAll.length > 0);
          fs.writeFileSync(path.join(dir, 'scroll-00.png'), s0.buf); files.push('scroll-00.png');
          shots.push({ file: 'scroll-00.png', scrollTop: last0, stable: s0.stable });
        }
        for (let i = 0; i < positions.length; i++) {
          await el.evaluate((e, y) => { e.scrollTop = y; }, positions[i]);
          await advance(150);
          // wait for smooth scrolling / scroll-driven transitions to finish
          let last = -1;
          for (let k = 0; k < 30; k++) { const cur = await el.evaluate(e => e.scrollTop); if (cur === last) break; last = cur; await page.waitForTimeout(60); }
          await waitIdle(page, 4000);
          const s = await stableShot(page, ambientAll.length > 0);
          const name = `scroll-${String(i + 1).padStart(2, '0')}.png`;
          fs.writeFileSync(path.join(dir, name), s.buf); files.push(name);
          shots.push({ file: name, scrollTop: last, stable: s.stable });
        }
        scroll = { container: await describeEl(el), scrollHeight: m.scrollHeight, clientHeight: m.clientHeight, maxScrollTop: max, stepPx, scrollTopAtShot: m.top, shots: shots.length, positions: shots, truncated: positions[positions.length - 1] < max };
        await el.evaluate((e, y) => { e.scrollTop = y; }, m.top);
        await advance(150);
        await waitIdle(page, 4000);
      } else scroll = { container: await describeEl(el), scrollHeight: m.scrollHeight, clientHeight: m.clientHeight, maxScrollTop: Math.max(0, max), scrollTopAtShot: m.top, shots: 0 };
    }
    await h.dispose();
  }

  // Content that overflows the screen root but cannot be scrolled (no overflow:auto container holds it): it is
  // clipped by #app in the prototype, so no screenshot can show it. Reported, never worked around.
  const clippedOverflow = await page.evaluate(({ root, topPage }) => {
    let rootEl; if (topPage) { const p = document.querySelectorAll('#layer > .page'); rootEl = p[p.length - 1]; } else rootEl = document.querySelector(root);
    if (!rootEl || getComputedStyle(rootEl).overflowY !== 'visible') return null;
    const extra = rootEl.scrollHeight - rootEl.clientHeight; if (extra <= 8) return null;
    const scrollers = [...rootEl.querySelectorAll('*')].filter(e => /auto|scroll/.test(getComputedStyle(e).overflowY) && e.scrollHeight - e.clientHeight > 8 && e.clientHeight > innerHeight * 0.3);
    if (scrollers.length) return null;
    return { contentHeight: rootEl.scrollHeight, visibleHeight: rootEl.clientHeight, hiddenPx: extra };
  }, { root: cap.root, topPage: cap.root === 'top-page' });

  return {
    id: cap.id, scenario: scenarioId, viewport: vpName, capturedAt: new Date().toISOString(),
    fixedTime: timeIso, fakeElapsedMsAtShot: env.fakeElapsed, reach,
    state, root: cap.root,
    rest: cap.timeline
      ? { timeline: true, timelineOffsetMs, note: 'not a rest frame: taken at a real-time offset inside a running animation sequence', ambientAnimations: ambient, ambientElsewhere: amb.elsewhere, stableFrames: false, settleTimeout: false, stillRunning: idle.fin || [] }
      : { ambientAnimations: ambient, ambientElsewhere: amb.elsewhere, ambientSettleMs: ambientAll.length ? AMBIENT_SETTLE_MS : 0, stableFrames: first.stable, settleTimeout: !!idle.timeout, stillRunning: idle.timeout ? idle.fin : [] },
    fonts: { loaded: fonts.loaded, combosChecked: fonts.combos, systemFallback: fonts.systemFallback },
    domNodes: countNodes(snap.root), chromeNodes: snap.chrome.map(c => (c.id ? '#' + c.id : c.tag + (c.cls ? '.' + c.cls.join('.') : ''))),
    scroll, clippedOverflow, files, shotSha1: sha1(first.buf),
  };
}

// ---------------------------------------------------------------- preflight

/** Proves the network fonts are reachable before any capture is taken. */
export async function preflight(browser, vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, ...CONTEXT_BASE });
  try {
    const page = await context.newPage();
    const failed = [];
    page.on('requestfailed', r => failed.push(`${r.url().slice(0, 140)} ${r.failure() ? r.failure().errorText : ''}`));
    await page.goto(HTML_URL + '#home', { waitUntil: 'load' });
    await assertUnframed(page, 'preflight');
    const res = await page.evaluate(async (WEB_FONTS) => {
      const out = {};
      const probes = { 'EB Garamond': ['500 16px "EB Garamond"', 'italic 400 16px "EB Garamond"'], 'Inter Tight': ['700 16px "Inter Tight"'], Inter: ['400 16px "Inter"', '600 16px "Inter"'], 'Noto Sans Devanagari': ['500 16px "Noto Sans Devanagari"'], Caveat: ['600 16px "Caveat"'] };
      const text = { 'Noto Sans Devanagari': 'हिन्दी' };
      for (const f of WEB_FONTS) {
        out[f] = [];
        for (const p of probes[f]) {
          let loaded = 0, err = null;
          try { loaded = (await document.fonts.load(p, text[f] || 'Ag')).length; } catch (e) { err = e.message; }
          out[f].push({ probe: p, facesLoaded: loaded, check: document.fonts.check(p, text[f] || 'Ag'), err });
        }
      }
      return { out, declared: [...new Set([...document.fonts].map(x => x.family.replace(/["']/g, '')))], errored: [...document.fonts].filter(x => x.status === 'error').length };
    }, WEB_FONTS);
    const bad = [];
    for (const f of WEB_FONTS) for (const p of res.out[f]) if (!p.facesLoaded || !p.check) bad.push(`${p.probe}: facesLoaded=${p.facesLoaded} check=${p.check}${p.err ? ' ' + p.err : ''}`);
    if (bad.length || res.errored) throw new CaptureError(`FONT PREFLIGHT FAILED (network fonts unavailable, not capturing with fallback fonts):\n  ${bad.join('\n  ')}\n  declared=[${res.declared.join(', ')}] erroredFaces=${res.errored}\n  failed requests: ${failed.join(' | ') || 'none'}`);
    return res;
  } finally { await context.close(); }
}

// ---------------------------------------------------------------- source lines

let _src = null;
function srcText() { if (!_src) _src = fs.readFileSync(HTML_PATH, 'utf8'); return _src; }
export function linesOf(snippet, { last = true } = {}) {
  const text = srcText();
  const i = last ? text.lastIndexOf(snippet) : text.indexOf(snippet);
  if (i < 0) return null;
  const from = text.slice(0, i).split('\n').length;
  const to = from + snippet.split('\n').length - 1;
  return [from, to];
}

/**
 * Every top-level definition of a global function, in file order: the
 * original `function name(` and each later `name = function` reassignment
 * (the prototype wraps several renderers this way; the last one is effective).
 */
export function allDefs(name) {
  const lines = srcText().split('\n');
  const esc = name.replace(/[$]/g, '\\$&');
  const re = new RegExp(`^(?:async\\s+)?function\\s+${esc}\\s*\\(|^${esc}\\s*=\\s*(?:async\\s+)?function|^(?:const|let|var)\\s+${esc}\\s*=|^window\\.${esc}\\s*=`);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!re.test(lines[i])) continue;
    // end = first line at which brackets opened since the start line are balanced again
    let end = i, depth = 0;
    for (let j = i; j < lines.length && j < i + 600; j++) {
      for (const ch of lines[j]) { if (ch === '{' || ch === '(' || ch === '[') depth++; else if (ch === '}' || ch === ')' || ch === ']') depth--; }
      if (depth <= 0) { end = j; break; }
    }
    out.push([i + 1, end + 1]);
  }
  return out;
}
