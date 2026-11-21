// In-page DOM serialiser. `snapshotInPage` is passed to page.evaluate, so it
// must be self-contained (no closures over Node-side values).
//
// Output shape (see reference/README.md for the full legend):
//   { defaults, root: Node, chrome: Node[] }
//   Node = { tag, id?, cls?, text?, content?, attrs?, rect:[x,y,w,h], style,
//            before?, after?, placeholder?, svg?, scroll?, children? }
// Style values are getComputedStyle() results. To keep files small:
//   * a property equal to the value in `defaults` is omitted;
//   * inherited text properties (TEXT_PROPS) are written in full on the root
//     and on every node that has its own text; on other nodes they are written
//     only where the value differs from the parent node's value, so "missing"
//     always means "same as the nearest ancestor that has it";
//   * padding / margin / border-radius / inset are 4-value strings
//     (top right bottom left; radius: tl tr br bl);
//   * border-<side> appears only for sides that are actually drawn.

export function snapshotInPage({ rootSelector, rootIsTopPage, chromeSelectors, pruneSelector }) {
  const DEFAULTS = {
    display: 'block', position: 'static', opacity: '1', transform: 'none',
    'background-color': 'rgba(0, 0, 0, 0)', 'background-image': 'none', 'box-shadow': 'none',
    overflow: 'visible', 'z-index': 'auto', 'backdrop-filter': 'none', filter: 'none',
    'flex-grow': '0', 'flex-shrink': '1', 'flex-basis': 'auto', 'align-self': 'auto', order: '0',
    padding: '0px 0px 0px 0px', margin: '0px 0px 0px 0px', 'border-radius': '0px 0px 0px 0px',
    visibility: 'visible', 'pointer-events': 'auto', 'mix-blend-mode': 'normal', 'clip-path': 'none',
    'mask-image': 'none', '-webkit-line-clamp': 'none', 'aspect-ratio': 'auto', 'object-fit': 'fill',
    'min-width': 'auto', 'min-height': 'auto', 'max-width': 'none', 'max-height': 'none',
    'text-shadow': 'none', 'white-space': 'normal', 'text-overflow': 'clip', 'vertical-align': 'baseline',
    'font-style': 'normal', 'text-transform': 'none', 'letter-spacing': 'normal', 'text-align': 'start',
    'text-decoration': 'none', '-webkit-background-clip': 'border-box', 'background-clip': 'border-box',
    'grid-column': 'auto', 'grid-row': 'auto', 'transform-style': 'flat', perspective: 'none',
    'backface-visibility': 'visible', 'word-break': 'normal', 'font-variant-numeric': 'normal',
    'font-feature-settings': 'normal', 'will-change': 'auto', 'box-sizing': 'border-box',
  };
  const TEXT_PROPS = ['color', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
    'letter-spacing', 'text-align', 'text-transform', 'white-space', 'word-break', 'text-shadow',
    'font-variant-numeric', 'font-feature-settings'];
  const BOX_PROPS = ['display', 'position', 'opacity', 'transform', 'background-color', 'box-shadow',
    'z-index', 'backdrop-filter', 'filter', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-self', 'order',
    'visibility', 'pointer-events', 'mix-blend-mode', 'clip-path', '-webkit-line-clamp', 'aspect-ratio',
    'min-width', 'min-height', 'max-width', 'max-height', 'text-overflow', 'vertical-align',
    'grid-column', 'grid-row', 'transform-style', 'perspective', 'backface-visibility', 'will-change',
    'box-sizing'];
  const SIDES = ['top', 'right', 'bottom', 'left'];
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'LINK', 'META']);
  const ATTRS = ['data-act', 'data-i18n', 'aria-label', 'aria-pressed', 'aria-checked', 'aria-disabled',
    'aria-selected', 'aria-hidden', 'role', 'placeholder', 'type', 'href', 'for', 'name', 'inputmode',
    'maxlength', 'rows', 'alt', 'title', 'style', 'data-f', 'data-i', 'data-k', 'data-v', 'data-w',
    'data-h', 'data-tab', 'key', 'tabindex', 'contenteditable', 'autocomplete'];

  const shortData = s => typeof s === 'string'
    ? s.replace(/data:([a-z0-9.+\/-]+);base64,([A-Za-z0-9+\/=]{200,})/gi, (m, mime, b) => `data:${mime};base64,[${b.length} base64 chars omitted, starts ${b.slice(0, 24)}]`)
    : s;
  const r2 = n => Math.round(n * 100) / 100;
  const four = (cs, pre, suf = '') => SIDES.map(s => cs.getPropertyValue(`${pre}-${s}${suf}`)).join(' ');
  const radius = cs => ['top-left', 'top-right', 'bottom-right', 'bottom-left'].map(c => cs.getPropertyValue(`border-${c}-radius`)).join(' ');
  const ZERO_OK = new Set(['min-width', 'min-height']); // computed 0px (non-flex items) and auto (flex items) both mean "no minimum"
  const put = (o, k, v) => { if (v !== '' && v != null && v !== DEFAULTS[k] && !(ZERO_OK.has(k) && v === '0px')) o[k] = shortData(v); };

  function boxStyle(cs, o) {
    for (const p of BOX_PROPS) put(o, p, cs.getPropertyValue(p));
    o.width = cs.getPropertyValue('width'); o.height = cs.getPropertyValue('height');
    put(o, 'padding', four(cs, 'padding'));
    put(o, 'margin', four(cs, 'margin'));
    put(o, 'border-radius', radius(cs));
    const ox = cs.getPropertyValue('overflow-x'), oy = cs.getPropertyValue('overflow-y');
    put(o, 'overflow', ox === oy ? ox : `${ox} ${oy}`);
    for (const s of SIDES) {
      const w = cs.getPropertyValue(`border-${s}-width`), st = cs.getPropertyValue(`border-${s}-style`);
      if (st !== 'none' && st !== 'hidden' && parseFloat(w) > 0) o[`border-${s}`] = `${w} ${st} ${cs.getPropertyValue(`border-${s}-color`)}`;
    }
    const ol = cs.getPropertyValue('outline-style');
    if (ol !== 'none' && parseFloat(cs.getPropertyValue('outline-width')) > 0) o.outline = `${cs.getPropertyValue('outline-width')} ${ol} ${cs.getPropertyValue('outline-color')} / offset ${cs.getPropertyValue('outline-offset')}`;
    const bi = cs.getPropertyValue('background-image');
    if (bi !== 'none') {
      o['background-image'] = shortData(bi);
      o['background-size'] = cs.getPropertyValue('background-size');
      o['background-position'] = cs.getPropertyValue('background-position');
      o['background-repeat'] = cs.getPropertyValue('background-repeat');
    }
    put(o, 'background-clip', cs.getPropertyValue('background-clip'));
    put(o, '-webkit-background-clip', cs.getPropertyValue('-webkit-background-clip'));
    const tfc = cs.getPropertyValue('-webkit-text-fill-color');
    if (tfc && tfc !== cs.getPropertyValue('color')) o['-webkit-text-fill-color'] = tfc;
    const mi = cs.getPropertyValue('mask-image') || cs.getPropertyValue('-webkit-mask-image');
    if (mi && mi !== 'none') o['mask-image'] = shortData(mi);
    if (cs.getPropertyValue('position') !== 'static') o.inset = SIDES.map(s => cs.getPropertyValue(s)).join(' ');
    if (cs.getPropertyValue('transform') !== 'none') o['transform-origin'] = cs.getPropertyValue('transform-origin');
    const d = cs.getPropertyValue('display');
    if (d.includes('flex') || d.includes('grid')) {
      if (d.includes('flex')) { o['flex-direction'] = cs.getPropertyValue('flex-direction'); o['flex-wrap'] = cs.getPropertyValue('flex-wrap'); }
      o['justify-content'] = cs.getPropertyValue('justify-content');
      o['align-items'] = cs.getPropertyValue('align-items');
      const ac = cs.getPropertyValue('align-content'); if (ac !== 'normal') o['align-content'] = ac;
      o.gap = `${cs.getPropertyValue('row-gap')} ${cs.getPropertyValue('column-gap')}`;
      if (d.includes('grid')) {
        o['grid-template-columns'] = cs.getPropertyValue('grid-template-columns');
        o['grid-template-rows'] = cs.getPropertyValue('grid-template-rows');
        const gaf = cs.getPropertyValue('grid-auto-flow'); if (gaf !== 'row') o['grid-auto-flow'] = gaf;
        const ji = cs.getPropertyValue('justify-items'); if (ji !== 'normal' && ji !== 'legacy') o['justify-items'] = ji;
      }
    }
    const tdl = cs.getPropertyValue('text-decoration-line');
    if (tdl !== 'none') o['text-decoration'] = `${tdl} ${cs.getPropertyValue('text-decoration-style')} ${cs.getPropertyValue('text-decoration-color')} / thickness ${cs.getPropertyValue('text-decoration-thickness')} / offset ${cs.getPropertyValue('text-underline-offset')}`;
    const an = cs.getPropertyValue('animation-name');
    if (an !== 'none') o.animation = {
      name: an, duration: cs.getPropertyValue('animation-duration'), delay: cs.getPropertyValue('animation-delay'),
      'timing-function': cs.getPropertyValue('animation-timing-function'), 'iteration-count': cs.getPropertyValue('animation-iteration-count'),
      direction: cs.getPropertyValue('animation-direction'), 'fill-mode': cs.getPropertyValue('animation-fill-mode'),
      'play-state': cs.getPropertyValue('animation-play-state'),
    };
    const td = cs.getPropertyValue('transition-duration');
    if (td.split(',').some(x => parseFloat(x) > 0)) o.transition = {
      property: cs.getPropertyValue('transition-property'), duration: td,
      'timing-function': cs.getPropertyValue('transition-timing-function'), delay: cs.getPropertyValue('transition-delay'),
    };
    return o;
  }
  function textStyle(cs, o, parentText, full) {
    const mine = {};
    for (const p of TEXT_PROPS) {
      const v = cs.getPropertyValue(p); mine[p] = v;
      if (full || !parentText || parentText[p] !== v) o[p] = v;
    }
    return mine;
  }
  function pseudo(el, which) {
    const cs = getComputedStyle(el, which);
    const c = cs.getPropertyValue('content');
    if (!c || c === 'none' || c === 'normal') return null;
    if (cs.getPropertyValue('display') === 'none') return null;
    const o = { content: shortData(c) };
    boxStyle(cs, o);
    textStyle(cs, o, null, c !== '""');
    if (c === '""') { for (const p of ['color']) o[p] = cs.getPropertyValue(p); }
    return o;
  }
  function ownText(el) {
    const parts = []; let hasEl = false, hasText = false; let idx = 0;
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { const t = n.nodeValue.replace(/\s+/g, ' '); if (t.trim()) { parts.push(t); hasText = true; } }
      else if (n.nodeType === 1) { hasEl = true; parts.push(idx++); }
    }
    if (!hasText) return null;
    const text = parts.filter(p => typeof p === 'string').join(' ').replace(/\s+/g, ' ').trim();
    return { text, content: hasEl ? parts.map(p => typeof p === 'string' ? p : { child: p }) : null };
  }
  function node(el, parentText, isRoot) {
    if (SKIP_TAGS.has(el.tagName)) return null;
    const cs = getComputedStyle(el);
    if (cs.getPropertyValue('display') === 'none') return null;
    const tag = el.tagName.toLowerCase();
    const o = { tag };
    if (el.id) o.id = el.id;
    const cls = typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '';
    if (cls.trim()) o.cls = cls.trim().split(/\s+/);
    const isSvg = tag === 'svg';
    const ot = isSvg ? null : ownText(el);
    if (ot) { o.text = ot.text; if (ot.content) o.content = ot.content; }
    const attrs = {};
    for (const a of ATTRS) if (el.hasAttribute(a)) attrs[a] = shortData(el.getAttribute(a));
    if (el.disabled === true) attrs.disabled = true;
    if (tag === 'input' || tag === 'textarea' || tag === 'select') { attrs.value = el.value; if (el.type === 'checkbox' || el.type === 'radio') attrs.checked = el.checked; if (document.activeElement === el) attrs.focused = true; }
    if (tag === 'img') { attrs.src = shortData(el.getAttribute('src') || ''); attrs.naturalWidth = el.naturalWidth; attrs.naturalHeight = el.naturalHeight; attrs.complete = el.complete; }
    if (tag === 'canvas') { attrs.width = el.width; attrs.height = el.height; }
    if (Object.keys(attrs).length) o.attrs = attrs;
    const r = el.getBoundingClientRect();
    o.rect = [r2(r.x), r2(r.y), r2(r.width), r2(r.height)];
    const style = {};
    boxStyle(cs, style);
    const formish = tag === 'input' || tag === 'textarea' || tag === 'button' || tag === 'select' || isSvg;
    const myText = textStyle(cs, style, parentText, isRoot || !!ot || formish);
    if (isSvg) { for (const p of ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']) style[p] = cs.getPropertyValue(p); }
    o.style = style;
    const b = pseudo(el, '::before'); if (b) o.before = b;
    const a = pseudo(el, '::after'); if (a) o.after = a;
    if ((tag === 'input' || tag === 'textarea') && el.hasAttribute('placeholder')) {
      const pc = getComputedStyle(el, '::placeholder');
      o.placeholder = { color: pc.getPropertyValue('color'), opacity: pc.getPropertyValue('opacity'), 'font-style': pc.getPropertyValue('font-style'), 'font-weight': pc.getPropertyValue('font-weight') };
    }
    if (el.scrollHeight - el.clientHeight > 1 || el.scrollWidth - el.clientWidth > 1) {
      const oy = cs.getPropertyValue('overflow-y'), ox = cs.getPropertyValue('overflow-x');
      if (/auto|scroll/.test(oy + ox)) o.scroll = { scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight, clientWidth: el.clientWidth, clientHeight: el.clientHeight, scrollTop: r2(el.scrollTop), scrollLeft: r2(el.scrollLeft) };
    }
    if (isSvg) { o.svg = shortData(el.outerHTML); return o; }
    if (pruneSelector && el.matches(pruneSelector)) { o.pruned = true; return o; }
    const kids = [];
    const map = [];
    for (const c of el.children) { const k = node(c, myText, false); map.push(k ? kids.length : -1); if (k) kids.push(k); }
    if (kids.length) o.children = kids;
    // content child indices refer to element order in the DOM; remap to the kept children (display:none ones are dropped)
    if (o.content) o.content = o.content.map(p => typeof p === 'string' ? p : (map[p.child] < 0 ? { hidden: true } : { child: map[p.child] }));
    return o;
  }

  let rootEl = null;
  if (rootIsTopPage) { const pages = document.querySelectorAll('#layer > .page'); rootEl = pages[pages.length - 1] || null; }
  else rootEl = document.querySelector(rootSelector);
  if (!rootEl) return { error: `root not found: ${rootIsTopPage ? '(top page)' : rootSelector}` };
  const vw = innerWidth, vh = innerHeight;
  const chrome = [];
  for (const sel of chromeSelectors) {
    for (const el of document.querySelectorAll(sel)) {
      if (el === rootEl || rootEl.contains(el) || el.contains(rootEl)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || r.right <= 0 || r.bottom <= 0 || r.left >= vw || r.top >= vh) continue;
      // Drop chrome that is fully covered by an opaque layer (the bottom nav under a pushed page, a page under another page).
      if (cs.pointerEvents !== 'none') {
        const cx = Math.min(vw - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(vh - 1, Math.max(0, r.top + r.height / 2));
        const hit = document.elementFromPoint(cx, cy);
        const cover = hit && !el.contains(hit) ? hit.closest('#layer > .page, #reelV, #app > .pm-ov') : null;
        if (cover && !cover.contains(el)) continue;
      }
      const n = node(el, null, true); if (n) chrome.push(n);
    }
  }
  const root = node(rootEl, null, true);
  return { defaults: DEFAULTS, root, chrome, html: rootEl.outerHTML };
}

export function countNodes(n) {
  if (!n) return 0;
  let c = 1; for (const k of n.children || []) c += countNodes(k); return c;
}
