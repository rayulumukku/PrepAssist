// Handlers of the arrival workstream: book, intro, auth, verify and the forgot / changeEmail sheets.
// OWNED BY THE ARRIVAL WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "arrival", named exactly like the verb and ported from the handler source the map points to.
// The file starts empty; act() ignores a verb that has no handler, exactly like the HTML dispatcher.
import type { CrossFns, HandlerMap, ShellHooks } from './types';

export const handlers: HandlerMap = {};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {};
