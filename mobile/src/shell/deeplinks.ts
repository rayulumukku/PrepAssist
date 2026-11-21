// Deep links, scheme prepassist://. They mirror the prototype's location.hash start (A.jump,
// PrepAssist.html L6971, L8682-L8683) and add test-only routes. There is no UI for any of this.
//
//   prepassist://jump/<target>              A.jump(target): book intro auth verify home learn practice
//                                           quiz current mains mentor menu profile article plans status
//   prepassist://stage/<stage>              go(stage)
//   prepassist://tab/<tab>                  go('app') if needed, then A.tab(tab)
//   prepassist://push/<view>/<arg?>         go('app') if needed, then push(view, arg)
//   prepassist://sheet/<key>/<arg?>         openSheet(key, { arg, tall }); tall as the HTML opens that sheet
//                                           (SHEET_TALL), or forced with ?tall=1 / ?tall=0
//   prepassist://act/<verb>/<arg?>          act(verb, arg): any data-act
//   prepassist://lang/<en|hi>               S.lang (labels only; A.setLang also closes the sheet and toasts)
//   prepassist://plan/<free|pro|ultimate>   S.me.plan and html[data-plan] at once (no overlay)
//   prepassist://back                       back()
//   prepassist://closeSheet                 closeSheet()
//   prepassist://toast/<msg>/<icon?>        toast(msg, icon)
//   prepassist://ask/<full|mini>            #ask.mini off / on
//   prepassist://insets/<zero|device>       --sat/--sab forced to 0 (as in the reference capture) or real
//   prepassist://clock/<ISO date-time|device>  pin the clock (see env/clock.ts) and reload the state
//   prepassist://reset                      state as at page load, then go('book')
// On iOS a start link can also be given as a launch argument (-prepassistLink "<link without scheme>").
// Path segments are URL-decoded. Several links can be chained in one URL with `;` between them:
//   prepassist://insets/zero;tab/profile;sheet/language
import { Linking, Platform, Settings } from 'react-native';
import { act } from '../actions';
import { setClockOverride } from '../env/clock';
import { ICONS } from '../icons/iconPaths.generated';
import type { IconName } from '../icons/iconPaths.generated';
import { __cancelAskTimer, __resetNavTimers, back, closeSheet, go, openSheet, pushRaw, setPlanTheme, toast } from '../navigation/nav';
import { SHEET_TALL, isSheetKey, isStage, isTab, isViewId } from '../navigation/routes';
import { getS, resetStore, setS } from '../store';
import type { Plan } from '../theme/tokens';

const SCHEME = 'prepassist://';

const decode = (s: string): string => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

export interface ParsedLink {
  cmd: string;
  args: string[];
  query: Record<string, string>;
}

/** 'prepassist://a/b;c/d?x=1' -> [{cmd:'a',args:['b']}, {cmd:'c',args:['d'],query:{x:'1'}}] */
export function parseLink(url: string): ParsedLink[] {
  if (!url.startsWith(SCHEME)) return [];
  return url
    .slice(SCHEME.length)
    .split(';')
    .map(part => {
      const qi = part.indexOf('?');
      const pathPart = qi < 0 ? part : part.slice(0, qi);
      const query: Record<string, string> = {};
      if (qi >= 0) {
        for (const kv of part.slice(qi + 1).split('&')) {
          if (!kv) continue;
          const ei = kv.indexOf('=');
          query[decode(ei < 0 ? kv : kv.slice(0, ei))] = ei < 0 ? '' : decode(kv.slice(ei + 1));
        }
      }
      const segs = pathPart.split('/').filter((x, i) => i === 0 || x !== '');
      return { cmd: segs[0] ?? '', args: segs.slice(1).map(decode), query };
    })
    .filter(l => l.cmd !== '');
}

const ensureApp = (): void => {
  if (getS().stage !== 'app') go('app');
};

function run(link: ParsedLink): void {
  const [a0, a1] = link.args;
  switch (link.cmd) {
    case 'jump':
      act('jump', a0);
      return;
    case 'stage':
      if (a0 !== undefined && isStage(a0)) go(a0);
      return;
    case 'tab':
      if (a0 !== undefined && isTab(a0)) {
        ensureApp();
        act('tab', a0);
      }
      return;
    case 'push':
      if (a0 !== undefined && isViewId(a0)) {
        ensureApp();
        pushRaw(a0, link.args.length > 1 ? link.args.slice(1).join('/') : undefined);
      }
      return;
    case 'sheet':
      if (a0 !== undefined && isSheetKey(a0)) {
        openSheet(a0, { arg: a1, tall: link.query.tall === undefined ? !!SHEET_TALL[a0] : link.query.tall === '1' });
      }
      return;
    case 'act':
      if (a0 !== undefined) act(a0, link.args.length > 1 ? link.args.slice(1).join('/') : undefined);
      return;
    case 'lang':
      if (a0 === 'en' || a0 === 'hi') setS({ lang: a0 });
      return;
    case 'plan':
      if (a0 === 'free' || a0 === 'pro' || a0 === 'ultimate') {
        const plan: Plan = a0;
        setS(s => ({ me: { ...s.me, plan } }));
        setPlanTheme(plan);
      }
      return;
    case 'back':
      back();
      return;
    case 'closeSheet':
      closeSheet();
      return;
    case 'toast':
      if (a0 !== undefined) toast(a0, a1 === undefined ? 'check' : a1 === 'none' ? null : a1 in ICONS ? (a1 as IconName) : 'check');
      return;
    case 'ask':
      // also stops the 3500 ms auto-mini timer, so a 'full' state stays put for a screenshot
      if (a0 === 'full' || a0 === 'mini') {
        __cancelAskTimer();
        setS({ askMini: a0 === 'mini' });
      }
      return;
    case 'insets':
      if (a0 === 'zero' || a0 === 'device') setS({ insetsMode: a0 });
      return;
    case 'clock': {
      if (a0 === undefined) return;
      const ok = setClockOverride(a0 === 'device' ? null : link.args.join('/'));
      if (ok) reload();
      return;
    }
    case 'reset':
      reload();
      go('book');
      return;
    default:
      return;
  }
}

/** A page reload: load-time state, keeping the test settings (insets mode). */
function reload(): void {
  const insetsMode = getS().insetsMode;
  __resetNavTimers();
  resetStore();
  setS({ insetsMode });
}

/** Run every command of a link, in order. Returns false when the URL is not ours. */
export function handleLink(url: string | null | undefined): boolean {
  if (!url) return false;
  const links = parseLink(url);
  if (!links.length) return false;
  for (const l of links) run(l);
  return true;
}

/**
 * The prototype's init (L8682-L8683): `if (startAt && A.jump) A.jump(startAt); else go('book')`.
 * Here the start link, if any, plays the role of location.hash. Returns the unsubscribe function.
 */
export function startDeepLinks(): () => void {
  let started = false;
  const start = (url: string | null | undefined): void => {
    if (started) return;
    started = true;
    const handled = handleLink(url);
    // a start link that only sets test options (insets, clock, lang, plan) still starts at the book
    if (!handled || getS().stage === null) go('book');
  };
  // iOS, tests only: `xcrun simctl openurl` makes iOS ask "Open in PrepAssist?" and wait for a tap,
  // so an automated run passes the start link as a launch argument instead:
  //   xcrun simctl launch booted com.prepassist.app -prepassistLink "insets/zero;tab/home"
  // Launch arguments of that form land in NSUserDefaults, which the Settings module reads.
  let launchArg: unknown;
  try {
    launchArg = Platform.OS === 'ios' ? Settings.get('prepassistLink') : undefined;
  } catch {
    launchArg = undefined; // no Settings module (unit tests)
  }
  if (typeof launchArg === 'string' && launchArg !== '') {
    start(SCHEME + launchArg);
  } else {
    Linking.getInitialURL().then(start, () => start(null));
  }
  const sub = Linking.addEventListener('url', e => {
    if (!started) {
      start(e.url);
      return;
    }
    handleLink(e.url);
  });
  return () => sub.remove();
}
