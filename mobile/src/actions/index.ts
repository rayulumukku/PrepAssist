// The action dispatcher: PrepAssist.html L7061-L7068 without the DOM. FROZEN.
//
//   act('push:legal:terms')         a raw data-act value, split at the FIRST colon only
//   act('push', 'legal:terms')      verb and argument given separately (the argument is NOT split again
//                                   by the dispatcher; the `push` handler itself splits it once more)
//
// Rules (actions.map.json dispatcher.rules):
//   - the argument is always a string or undefined; handlers convert with unary + where they need a number
//   - a verb with no handler does nothing: no error, no toast, no fallback
//   - the handler's return value (some are async) is ignored
import { installShellHooks } from '../navigation/nav';
import * as account from './account';
import * as arrival from './arrival';
import { bindBase, handlers as baseHandlers } from './base';
import * as library from './library';
import * as practice from './practice';
import * as study from './study';
import * as tabs from './tabs';
import type { CrossFns, Handler, HandlerMap } from './types';

/** Split a raw data-act value: L7064-L7065. */
export function splitAct(raw: string): { verb: string; arg: string | undefined } {
  const i = raw.indexOf(':');
  return i < 0 ? { verb: raw, arg: undefined } : { verb: raw.slice(0, i), arg: raw.slice(i + 1) };
}

const areas = [arrival, tabs, practice, study, library, account] as const;

/**
 * Every handler. An area must not define a base verb or a verb another area owns; the unit test
 * `actions.test.ts` fails if two files define the same verb.
 */
export const A: Readonly<HandlerMap> = Object.assign(
  Object.create(null) as HandlerMap,
  ...areas.map(a => a.handlers),
  baseHandlers,
);

export const fns: Partial<CrossFns> = Object.assign({}, ...areas.map(a => a.fns));

/**
 * Dispatch. With one argument it takes a raw data-act value; with two, the verb and its argument.
 * `el` is passed through to the handler as its second parameter.
 */
export function act(rawOrVerb: string, arg?: string, el?: unknown): void {
  let verb = rawOrVerb;
  let a = arg;
  if (arg === undefined && rawOrVerb.indexOf(':') >= 0) ({ verb, arg: a } = splitAct(rawOrVerb));
  const fn: Handler | undefined = A[verb];
  if (fn) fn(a, el);
}

bindBase(act, fns);
installShellHooks(areas.map(a => a.hooks));

export type { CrossFns, Handler, HandlerMap, ShellHooks } from './types';
export const __areasForTest = { arrival, tabs, practice, study, library, account, base: { handlers: baseHandlers } };
