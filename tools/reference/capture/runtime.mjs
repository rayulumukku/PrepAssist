// Dumps facts from the live page that porting agents need: registries, the
// :root custom properties under every plan theme, and all @keyframes.
import fs from 'node:fs';
import path from 'node:path';
import { HTML_URL, CONTEXT_BASE, FIXED_TIME_ISO, VIEWPORTS, TIMEZONE, LOCALE, WEB_FONTS } from './config.mjs';

export async function openPausedPage(browser, hash = 'home', vp = VIEWPORTS.android, timeIso = FIXED_TIME_ISO) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, ...CONTEXT_BASE });
  const t0 = new Date(timeIso);
  await context.clock.install({ time: t0 });
  await context.clock.pauseAt(t0);
  const page = await context.newPage();
  await page.goto(HTML_URL + (hash ? '#' + hash : ''), { waitUntil: 'load' });
  await page.clock.runFor(600);
  await page.evaluate(() => document.fonts.ready.then(() => 1));
  return { context, page };
}

export async function dumpRuntime(browser, outRoot) {
  const { context, page } = await openPausedPage(browser);
  try {
    const framed = await page.evaluate(() => document.documentElement.classList.contains('framed'));
    if (framed) throw new Error('runtime dump: page is framed');

    const registries = await page.evaluate(() => ({
      VIEWS: Object.keys(VIEWS),
      SHEETS: Object.keys(SHEETS),
      A: Object.keys(A),
      stages: [...document.querySelectorAll('#app > .stage')].map(s => s.id.replace(/^s-/, '')),
      tabs: [...document.querySelectorAll('#nav button')].map(b => b.dataset.act.replace(/^tab:/, '')),
      jumpTargets: [...document.querySelectorAll('#proto-panel [data-act^="jump:"]')].map(b => b.dataset.act.slice(5)),
      iconSymbols: [...document.querySelectorAll('symbol[id]')].map(s => s.id),
      i18nKeys: Object.keys(I18N.en),
      initialState: JSON.parse(JSON.stringify(S, (k, v) => v instanceof Set ? { __set: [...v] } : (v instanceof Element ? '[element]' : (k === 'heroTimer' ? '[timer id]' : v)))),
    }));

    const css = await page.evaluate(() => {
      const keyframes = [], customDecls = [], names = new Set(), sheets = [];
      const walk = (rules, sheetLabel, media) => {
        for (const r of rules) {
          if (r instanceof CSSKeyframesRule) keyframes.push({ name: r.name, sheet: sheetLabel, media: media || null, cssText: r.cssText });
          else if (r instanceof CSSStyleRule) {
            const props = {};
            for (let i = 0; i < r.style.length; i++) { const p = r.style[i]; if (p.startsWith('--')) { props[p] = r.style.getPropertyValue(p).trim(); names.add(p); } }
            if (Object.keys(props).length) customDecls.push({ selector: r.selectorText, sheet: sheetLabel, media: media || null, props });
          } else if (r.cssRules) walk(r.cssRules, sheetLabel, r.conditionText ? (media ? media + ' and ' : '') + r.conditionText : media);
        }
      };
      [...document.styleSheets].forEach((s, i) => {
        const label = s.ownerNode && s.ownerNode.id ? `<style id="${s.ownerNode.id}">` : s.href ? s.href.slice(0, 60) : `<style> #${i}`;
        try { walk(s.cssRules, label, null); sheets.push({ label, rules: s.cssRules.length }); }
        catch (e) { sheets.push({ label, unreadable: 'cross-origin stylesheet (Google Fonts: @font-face only)' }); }
      });
      // later @keyframes with the same name win
      const lastIdx = {}; keyframes.forEach((k, i) => { lastIdx[k.name] = i; });
      keyframes.forEach((k, i) => { k.effective = lastIdx[k.name] === i; });
      return { keyframes, customDecls, names: [...names].sort(), sheets };
    });

    const readVars = () => page.evaluate(names => {
      const cs = getComputedStyle(document.documentElement), app = getComputedStyle(document.querySelector('#app'));
      const root = {}, onApp = {};
      for (const n of names) { const v = cs.getPropertyValue(n).trim(); if (v !== '') root[n] = v; const a = app.getPropertyValue(n).trim(); if (a !== '' && a !== v) onApp[n] = a; }
      return { dataPlan: document.documentElement.dataset.plan, root, differsOnApp: onApp };
    }, css.names);

    const themes = {};
    themes.free = await readVars();
    for (const plan of ['pro', 'ultimate']) {
      // the page's own theme switch (window.planMagic, L10753): sets html[data-plan] after 800 ms and removes its overlay at 3250 ms
      await page.evaluate(p => { planMagic(p); }, plan);
      await page.clock.runFor(3600);
      await page.waitForTimeout(300);
      themes[plan] = await readVars();
      if (themes[plan].dataPlan !== plan) throw new Error(`runtime dump: theme ${plan} did not apply`);
    }
    await page.evaluate(() => { planMagic('free'); });
    await page.clock.runFor(3600);
    const back = await readVars();
    if (JSON.stringify(back.root) !== JSON.stringify(themes.free.root)) throw new Error('runtime dump: free theme did not restore');

    const themeDiff = {};
    for (const n of Object.keys(themes.free.root)) {
      const f = themes.free.root[n], p = themes.pro.root[n], u = themes.ultimate.root[n];
      if (f !== p || f !== u) themeDiff[n] = { free: f, pro: p, ultimate: u };
    }
    for (const plan of ['pro', 'ultimate']) for (const n of Object.keys(themes[plan].root)) if (!(n in themes.free.root)) themeDiff[n] = { free: null, pro: themes.pro.root[n] ?? null, ultimate: themes.ultimate.root[n] ?? null };

    const fonts = await page.evaluate(() => [...document.fonts].map(f => ({ family: f.family.replace(/["']/g, ''), weight: f.weight, style: f.style, status: f.status, unicodeRange: f.unicodeRange.slice(0, 60) })));
    const env = await page.evaluate(() => ({ userAgent: navigator.userAgent, innerWidth, innerHeight, devicePixelRatio, hoverNone: matchMedia('(hover:none)').matches, pointerCoarse: matchMedia('(pointer:coarse)').matches, maxTouchPoints: navigator.maxTouchPoints, safeAreaTop: getComputedStyle(document.documentElement).getPropertyValue('--sat'), safeAreaBottom: getComputedStyle(document.documentElement).getPropertyValue('--sab'), reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }));

    const doc = {
      generatedAt: new Date().toISOString(),
      source: 'PrepAssist.html, read from the live page in headless Chromium (Playwright)',
      fixedClock: FIXED_TIME_ISO, timezone: TIMEZONE, locale: LOCALE,
      environment: env,
      registries: {
        VIEWS: registries.VIEWS, SHEETS: registries.SHEETS, A: registries.A,
        counts: { VIEWS: registries.VIEWS.length, SHEETS: registries.SHEETS.length, A: registries.A.length },
        stages: registries.stages, tabs: registries.tabs, hashJumpTargets: registries.jumpTargets,
        iconSymbols: registries.iconSymbols, i18nKeys: registries.i18nKeys,
      },
      initialState_S: registries.initialState,
      cssCustomProperties: {
        note: 'root = getComputedStyle(document.documentElement) for every custom property name declared anywhere in the stylesheets. Themes are switched with the page\'s own window.planMagic(plan), which sets html[data-plan]. Properties that are only declared on narrower selectors are empty at :root and are listed under declarations.',
        names: css.names,
        byPlanTheme: themes,
        changedByPlanTheme: themeDiff,
        declarations: css.customDecls,
      },
      keyframes: { count: css.keyframes.length, distinctNames: new Set(css.keyframes.map(k => k.name)).size, note: 'effective=false means a later @keyframes with the same name overrides this one', list: css.keyframes },
      styleSheets: css.sheets,
      fonts: { expectedFamilies: WEB_FONTS, faces: fonts },
    };
    fs.writeFileSync(path.join(outRoot, 'runtime.json'), JSON.stringify(doc, null, 1));
    return doc;
  } finally { await context.close(); }
}
