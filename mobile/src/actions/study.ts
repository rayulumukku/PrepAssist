// Handlers of the study workstream: lesson, courses, course, note, mindmap, mindmaps, calendar, plan, article, saved and the mentor, search and edition-calendar sheets.
// OWNED BY THE STUDY WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "study", named exactly like the verb and ported from the handler source the map points to.
// The handler bodies of the page groups live next to their screens (pure modules, no import of
// src/actions at load); this file merges them.
import { handlers as mapsHandlers } from '../screens/study/maps/handlers';
import { handlers as pagesHandlers } from '../screens/study/pages/handlers';
import type { CrossFns, HandlerMap, ShellHooks } from './types';

export const handlers: HandlerMap = {
  ...pagesHandlers,
  ...mapsHandlers,
};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {};
