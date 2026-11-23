// Base slice (shell-owned, FROZEN). Mirrors the shell part of the prototype's `S` (PrepAssist.html
// L5126-L5133) plus the DOM state the shell functions keep in classes: #layer children, #sheet/#scrim
// `.on`, #toast `.on`, #ask `.mini`, html[data-plan].
import type { InitialState, StateUser } from '../../data/initialState';
import type { Lang } from '../../i18n/strings';
import type { IconName } from '../../icons/iconPaths.generated';
import type { SheetKey, Stage, TabId, ViewId } from '../../navigation/routes';
import type { Plan } from '../../theme/tokens';

/** One entry of S.stack (L6482): `{ id, arg, el, focus }`. `el` has no equivalent; `key` identifies the push. */
export interface StackEntry {
  key: number;
  id: ViewId;
  arg: string | undefined;
  /** !!(v.focus || v.noAsk): hides the Ask button while this entry is on top (L6482, L6504). */
  focus: boolean;
}

/** One <section class="page"> inside #layer, in DOM order. Pages stay here for 420 ms after they leave S.stack. */
export interface LayerPage extends StackEntry {
  /** In S.stack. false = `.in` was removed and the element is sliding out, waiting for el.remove(). */
  live: boolean;
  /** class `under` (L6480): shifted to translateX(-18%) and dimmed. */
  under: boolean;
}

export interface ToastState {
  /** Increments on every toast() so an identical message re-triggers. */
  n: number;
  msg: string;
  /** toast(msg, icon = 'check'); null draws no icon (L5119). */
  icon: IconName | null;
  /** class `on` */
  on: boolean;
}

export interface SheetState {
  /** Increments on every openSheet(): the content is replaced even when the key is the same. */
  n: number;
  key: SheetKey | null;
  arg: string | undefined;
  /** class `tall` (L6911) */
  tall: boolean;
  /** class `on` on #sheet and #scrim */
  on: boolean;
}

export interface BaseSlice {
  // ---- S fields ----
  /** S.stage. null until the first go() (the HTML declares it null, L5127). */
  stage: Stage | null;
  /** S.tab */
  tab: TabId;
  /** S.stack */
  stack: StackEntry[];
  /** S.lang */
  lang: Lang;
  /** S.user */
  user: StateUser;
  /** S.rendered: renderAll() has run (first go('app')). */
  rendered: boolean;

  // ---- DOM state of the shell ----
  /** html[data-plan] (setPlanTheme, L10751). Follows S.me.plan, but planMagic changes it 800 ms late (L10761). */
  planTheme: Plan;
  /** #layer children */
  layer: LayerPage[];
  toast: ToastState;
  sheet: SheetState;
  /** #ask.mini (L5995, L6000, L6505) */
  askMini: boolean;
  /** Stages and tab panes that have been shown at least once: they stay mounted (display:none in the HTML). */
  stagesSeen: Partial<Record<Stage, true>>;
  tabsSeen: Partial<Record<TabId, true>>;
  /** Increments each time a tab pane gets class `on` again, to restart its tabIn animation (L2254). */
  tabShown: Record<TabId, number>;
  /** Increments each time a stage gets class `on` again, to restart stageIn (L74). */
  stageShown: number;

  // ---- test support (no equivalent in the HTML) ----
  /** 'zero' forces --sat/--sab to 0 like the reference capture; set by prepassist://insets/zero. */
  insetsMode: 'device' | 'zero';
}

export function createBaseSlice(seed: InitialState, planTheme: Plan): BaseSlice {
  return {
    stage: null,
    tab: seed.tab as TabId,
    stack: [],
    lang: seed.lang as Lang,
    user: seed.user,
    rendered: false,
    planTheme,
    layer: [],
    toast: { n: 0, msg: '', icon: 'check', on: false },
    sheet: { n: 0, key: null, arg: undefined, tall: false, on: false },
    askMini: false,
    stagesSeen: {},
    tabsSeen: {},
    tabShown: { home: 0, learn: 0, practice: 0, current: 0, menu: 0, profile: 0 },
    stageShown: 0,
    insetsMode: 'device',
  };
}
