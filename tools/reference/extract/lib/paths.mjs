// Shared paths and the one borrowed dependency (the TypeScript parser).
//
// tools/reference has no JS parser of its own (only playwright, pixelmatch,
// pngjs). The extractor needs a real parser to locate declarations, IIFE
// bodies and handler definitions, so it borrows `typescript` from
// mobile/node_modules, where it is a direct devDependency. Nothing is
// installed. If that package is missing the extractor stops with a clear
// message instead of falling back to regexes.
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

export const EXTRACT_DIR = path.resolve(here, '..');
export const TOOLS_DIR = path.resolve(EXTRACT_DIR, '..');
export const REPO_ROOT = path.resolve(TOOLS_DIR, '..', '..');
export const HTML_PATH = path.join(REPO_ROOT, 'PrepAssist.html');
export const HTML_NAME = 'PrepAssist.html';

let cachedTs = null;
export function loadTypeScript() {
  if (cachedTs) return cachedTs;
  const require = createRequire(path.join(REPO_ROOT, 'mobile', 'package.json'));
  try {
    cachedTs = require('typescript');
  } catch (err) {
    throw new Error(
      'The extractor needs the TypeScript parser from mobile/node_modules/typescript ' +
        '(run `npm install` in mobile/ first). Original error: ' + err.message,
    );
  }
  return cachedTs;
}
