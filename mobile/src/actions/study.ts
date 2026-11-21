// Handlers of the study workstream: lesson, courses, course, note, mindmap, mindmaps, calendar, plan, article, saved and the mentor, search and edition-calendar sheets.
// OWNED BY THE STUDY WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "study", named exactly like the verb and ported from the handler source the map points to.
// The file starts empty; act() ignores a verb that has no handler, exactly like the HTML dispatcher.
import type { CrossFns, HandlerMap, ShellHooks } from './types';

export const handlers: HandlerMap = {};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {};
