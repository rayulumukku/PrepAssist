// Handlers of the library workstream: noteshub, notesys, note2, tracker, folder, ntNote, xrayhome, xray, syllabus, upload, cloud, querydb and their sheets.
// OWNED BY THE LIBRARY WORKSTREAM. One entry per data-act verb whose owner in actions.map.json is
// "library", named exactly like the verb and ported from the handler source the map points to.
// The handler bodies live next to their screens (src/screens/library/**/…Actions.ts) and are merged here.
import { nsHandlers } from '../screens/library/notes/nsActions';
import { qdHandlers } from '../screens/library/querydb/qdActions';
import { syHandlers } from '../screens/library/syllabus/syActions';
import { ntHandlers } from '../screens/library/tracker/ntActions';
import { vlHandlers } from '../screens/library/vault/vlActions';
import { x4Handlers, x4Hooks } from '../screens/library/xray/x4Actions';
import type { CrossFns, HandlerMap, ShellHooks } from './types';

export const handlers: HandlerMap = {
  ...x4Handlers,
  ...ntHandlers,
  ...syHandlers,
  ...vlHandlers,
  ...nsHandlers,
  ...qdHandlers,
};

/** Calls the shell functions make into this area (see ShellHooks in ./types). */
export const hooks: ShellHooks = {
  afterBack: (t, prev) => {
    x4Hooks.afterBack?.(t, prev);
  },
};

/** Functions of this area that base or another area calls directly (see CrossFns in ./types). */
export const fns: Partial<CrossFns> = {};
