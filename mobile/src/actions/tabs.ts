// Handlers of the tabs workstream: the six tab panes, the reels viewer and the revisions / coverage / allTools / current-filter sheets.
// OWNED BY THE TABS WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "tabs", named exactly like the verb and ported from the handler source the map points to.
// The file starts empty; act() ignores a verb that has no handler, exactly like the HTML dispatcher.
import type { CrossFns, HandlerMap, ShellHooks } from './types';

export const handlers: HandlerMap = {};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {};
