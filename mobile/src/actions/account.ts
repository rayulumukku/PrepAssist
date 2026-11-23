// Handlers of the account workstream: account, wallet, payments, upgrade, settings, status, legal, onestep, the profile sheets, the purchase sheet and the plan-change overlay.
// OWNED BY THE ACCOUNT WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "account", named exactly like the verb and ported from the handler source the map points to.
//   L6990 logout · L7037 tog · L7038 setLang · L7040 saved · L7606-L7628 (credits … legalSwap)
//   L8544-L8546 stepGo/stepReplay/stepSnd · L8548-L8550 back wrapper (stStop) · L10753-L10776
//   planMagic, the applyBuy wrapper and A.planFree
// What the HTML does that is not ported, and why:
//   - navigator.vibrate (byPay L7611, meTog L7621, planMagic L10760): CONTRACT.md section 10 forbids haptics.
//   - meTog('motion') toggles class `calm` on <html> (L7624): the `html.calm` rules restyle every area;
//     there is no shell hook for a global "calm" flag. Reported as blocked; S.me.motion is still kept.
import {
  closeAllPages,
  closeSheet,
  go,
  openSheet,
  push,
  setPlanTheme,
  setTab,
  setTopArg,
  toast,
} from '../navigation/nav';
import { getS, setS } from '../store';
import type { Me, Payment } from '../store/slices/account';
import { fmtShort } from '../screens/account/mePage';
import { buyItem, planMagicSparks } from '../screens/account/buy';
import { scrollUpgradeToPacks } from '../screens/account/upgradeScroll';
import { stPlay, stStop } from '../screens/account/stepSound';
import { today } from '../env/clock';
// read at call time only (index imports this file): CONTRACT.md section 7 "cross-area functions"
import { fns as crossFns } from './index';
import type { CrossFns, HandlerMap, ShellHooks } from './types';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));
const setMe = (patch: Partial<Me> | ((m: Me) => Partial<Me>)): void =>
  setS(s => ({
    me: { ...s.me, ...(typeof patch === 'function' ? patch(s.me) : patch) },
  }));
const top = () => {
  const st = getS().stack;
  return st[st.length - 1];
};

type PlanId = Me['plan'];
const isPlan = (p: string): p is PlanId =>
  p === 'free' || p === 'pro' || p === 'ultimate';

let pmN = 0;
/** window.planMagic (L10753-L10764). The overlay element is an entry of S.planMagic. */
export function planMagic(p: PlanId): void {
  const n = ++pmN;
  setS(s => ({
    planMagic: [
      ...s.planMagic,
      { n, p, sparks: planMagicSparks(), out: false },
    ],
  }));
  setTimeout(() => setPlanTheme(p), 800);
  setTimeout(
    () =>
      setS(s => ({
        planMagic: s.planMagic.map(o => (o.n === n ? { ...o, out: true } : o)),
      })),
    2500,
  );
  setTimeout(
    () => setS(s => ({ planMagic: s.planMagic.filter(o => o.n !== n) })),
    3250,
  );
}

/** applyBuy (L7460-L7466) as wrapped at L10767. */
export function applyBuy(kind: string, id: string): void {
  const before = getS().me.plan;
  const it = buyItem(kind, id);
  if (!it) return;
  const d = fmtShort(today());
  setMe(M => {
    const out: Partial<Me> = {};
    if (kind === 'plan' && id === 'vault') out.vault = true;
    else if (kind === 'plan' && isPlan(id)) out.plan = id;
    if (it.credits) {
      out.credits = M.credits + it.credits;
      out.ledger = [
        {
          t: kind === 'plan' ? it.n + ' · monthly credits' : 'Top-up · ' + it.n,
          d,
          v: it.credits,
        },
        ...M.ledger,
      ];
    }
    const pay: Payment = {
      t: kind === 'plan' ? it.n + ' · monthly' : it.n + ' pack',
      amt: it.p,
      d,
      m: 'UPI · Google Pay',
      id: 'INV-' + (26041 + M.payments.length),
      k: it.id,
    };
    out.payments = [pay, ...M.payments];
    return out;
  });
  const after = getS().me.plan;
  if (kind === 'plan' && id !== 'vault' && after !== before)
    setTimeout(() => planMagic(getS().me.plan), 650);
}

const logout = (): void => {
  closeSheet();
  // S.tab = 'home' (L6990): the tab is a base field written through nav only; setTab is the nav writer.
  setTab('home');
  go('auth');
  toast('You’ve been logged out', 'logout');
};

const TOG_NAMES: Record<string, string> = {
  haptics: 'Haptic feedback',
  sound: 'Sound effects',
  push: 'Push notifications',
  plan7: 'Morning plan',
  nudges: 'Revision nudges',
  dataSaver: 'Data saver',
  wifi: 'Wi-Fi-only downloads',
  bigText: 'Larger reading text',
  motion: 'Reduce motion',
};
type TogKey =
  | 'haptics'
  | 'sound'
  | 'push'
  | 'plan7'
  | 'nudges'
  | 'dataSaver'
  | 'wifi'
  | 'bigText'
  | 'motion';
const isTogKey = (k: string): k is TogKey => k in TOG_NAMES;

/** The `el` some handlers receive: a callback for element-local state (`.tog.on`). */
interface TogEl {
  toggle: () => void;
}
const asTogEl = (el: unknown): TogEl | null =>
  el && typeof (el as TogEl).toggle === 'function' ? (el as TogEl) : null;

export const handlers: HandlerMap = {
  logout,

  /** L7037: el.classList.toggle('on'). The sheet row keeps its own on-state and passes { toggle }. */
  tog: (_x, el) => {
    asTogEl(el)?.toggle();
  },

  /** L7038 (relabel() and renderProfile() follow S.lang reactively) */
  setLang: l => {
    if (l !== 'en' && l !== 'hi') return;
    setS({ lang: l });
    closeSheet();
    toast(l === 'hi' ? 'भाषा: हिन्दी' : 'Language: English', 'globe');
  },

  saved: () => {
    closeSheet();
    toast('Changes saved', 'check');
  },

  credits: () => {
    closeSheet();
    push('wallet');
  },
  ledger: () => openSheet('ledger'),
  topup: () => {
    closeSheet();
    const t = top();
    if (t && t.id === 'upgrade') scrollUpgradeToPacks(t.key);
    else push('upgrade', 'topup');
  },
  pack: i => setMe({ pack: Number(i) }),
  buy: x => {
    if (x === undefined) return;
    setS({ buyStep: 'confirm' });
    openSheet('purchase', { arg: x });
  },
  byPay: async x => {
    if (x === undefined) return;
    const [k, id] = x.split(':');
    setS({ buyStep: 'wait' });
    await wait(1500);
    applyBuy(k, id);
    setS({ buyStep: 'done' });
  },
  byReceipt: () => {
    closeSheet();
    push('payments');
  },
  restore: async () => {
    toast('Checking your store account…', 'refresh');
    await wait(1200);
    const n = getS().me.payments.length;
    toast(
      n ? 'Purchases restored' : 'No previous purchases found',
      n ? 'check' : 'x',
    );
  },
  /** L7614. The input's value arrives as el.value (the screen owns the TextInput). */
  wlSave: (_x, el) => {
    const v = String(
      (el as { value?: string } | undefined)?.value ?? '',
    ).trim();
    if (!v) {
      toast('Display name can’t be empty', 'x');
      return;
    }
    setS(s => ({ user: { ...s.user, first: v } }));
    toast('Display name saved', 'check');
  },
  acEdit: () => setMe({ edit: true }),
  acCancel: () => setMe({ edit: false }),
  /** L7617. #acName / #acPhone values arrive as el.name / el.phone. */
  acSave: (_x, el) => {
    const f = (el ?? {}) as { name?: string; phone?: string };
    const n = (f.name ?? '').trim();
    const ph = (f.phone ?? '').trim();
    if (n)
      setS(s => ({ user: { ...s.user, name: n, first: n.split(' ')[0] } }));
    setMe(ph ? { phone: ph, edit: false } : { edit: false });
    toast('Personal details updated', 'check');
  },
  delAsk: () => openSheet('delAsk'),
  delGo: async () => {
    closeSheet();
    toast('Deleting your account…', 'trash');
    await wait(1000);
    logout();
  },
  meTog: k => {
    if (k === undefined || !isTogKey(k)) return;
    const on = !getS().me[k];
    setMe({ [k]: on } as Partial<Me>);
    if (k === 'sound') {
      setS(s => ({ SFX: { ...s.SFX, on } }));
      if (on) crossFns.sfx?.('page');
    }
    if (k === 'bigText') setS({ arSize: on ? 2 : 1 });
    toast(TOG_NAMES[k] + (on ? ' on' : ' off'), on ? 'check' : 'x');
  },
  ssRerun: () => {
    setS(s => ({ ssRun: s.ssRun + 1 }));
    toast('Running diagnostics…', 'pulse');
  },
  /**
   * L7628: p.arg = k; refreshPage(p); scrollTop = 0. The arg swap is ported; the scroll reset is NOT:
   * legal is a non-focus view whose scroller belongs to the shell (PageLayer) and the shell exposes no
   * way to scroll a page. Reported as blocked (lgGo L7627 is blocked for the same reason).
   */
  legalSwap: k => {
    if (k === undefined) return;
    setTopArg(k);
  },

  /** L8544 */
  stepGo: () => {
    stStop();
    closeAllPagesInstant();
    setTab('home');
    toast('Today’s step: Lecture 4 · Fundamental Rights', 'play');
  },
  /** L8545: .go removed and re-added (restarts every animation), then the sound restarts. */
  stepReplay: () => {
    setS(s => ({ stepRun: s.stepRun + 1 }));
    stPlay();
  },
  /** L8546 */
  stepSnd: () => {
    const on = !getS().STS.on;
    setS({ STS: { on } });
    if (!on) stStop();
  },

  /** L10776 */
  planFree: () => {
    setMe({ plan: 'free' });
    planMagic('free');
  },
};

function closeAllPagesInstant(): void {
  closeAllPages(true);
}

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {
  /** back = function () { if (t && t.id === 'onestep') stStop(); _backSt(); } (L8548-L8550) */
  beforeBack: t => {
    if (t.id === 'onestep') stStop();
  },
};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {};
