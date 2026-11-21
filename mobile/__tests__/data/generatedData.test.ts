// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
/// <reference types="node" />
// Structural guard for the generated data: every export listed in snapshot.json must exist and hash
// to the same value, so a broken import, a truncated module or a hand edit fails `npm test`.
// snapshot.json is written by the extractor in the same run as the modules.
import { createHash } from 'crypto';
import snapshot from './snapshot.json';
import * as subjects from '../../src/data/subjects';
import * as home from '../../src/data/home';
import * as learn from '../../src/data/learn';
import * as notes from '../../src/data/notes';
import * as practice from '../../src/data/practice';
import * as current from '../../src/data/current';
import * as plans from '../../src/data/plans';
import * as legal from '../../src/data/legal';
import * as menu from '../../src/data/menu';
import * as tools from '../../src/data/tools';
import * as xray from '../../src/data/xray';
import * as tracker from '../../src/data/tracker';
import * as book from '../../src/data/book';
import * as auth from '../../src/data/auth';
import * as onestep from '../../src/data/onestep';
import * as illustrations from '../../src/data/illustrations';
import * as inline from '../../src/data/inline';
import * as markers from '../../src/data/markers';
import * as dataIndex from '../../src/data';
import { createInitialState, INITIAL_STATE_ENV_SAMPLE, STATE_FIELDS_ASSIGNED_LATER } from '../../src/data/initialState';
import { I18N, I18N_KEYS, LANGS } from '../../src/i18n/strings';
import { ICONS, ICON_NAMES, ILLUSTRATION_SYMBOLS } from '../../src/icons/iconPaths.generated';
import actionsMap from '../../actions.map.json';

type Json = null | string | number | boolean | Json[] | { [key: string]: Json };

/** Same canonical form as canon() in tools/reference/extract/lib/emit-ts.mjs. */
function canon(v: unknown): Json {
  if (v === undefined) return { $undefined: true };
  if (v === null || typeof v === 'string' || typeof v === 'boolean') return v;
  if (typeof v === 'number') {
    if (Number.isNaN(v)) return { $number: 'NaN' };
    if (v === Infinity) return { $number: 'Infinity' };
    if (v === -Infinity) return { $number: '-Infinity' };
    if (Object.is(v, -0)) return { $number: '-0' };
    return v;
  }
  if (typeof v === 'bigint') return { $bigint: String(v) };
  if (v instanceof Set) return { $set: Array.from(v, canon) };
  if (v instanceof Map) return { $map: Array.from(v, ([k, x]) => [canon(k), canon(x)]) };
  if (Array.isArray(v)) return v.map(canon);
  if (typeof v === 'object') {
    const out: { [key: string]: Json } = {};
    for (const k of Object.keys(v)) out[k] = canon((v as Record<string, unknown>)[k]);
    return out;
  }
  throw new Error('Unexpected ' + typeof v + ' in generated data');
}

const sha256 = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

function facts(v: unknown) {
  const c = canon(v);
  let kind: string;
  let count: number | null = null;
  if (c === null) kind = 'null';
  else if (Array.isArray(c)) { kind = 'array'; count = c.length; }
  else if (typeof c === 'object') {
    if ('$set' in c) { kind = 'set'; count = (c.$set as Json[]).length; }
    else if ('$map' in c) { kind = 'map'; count = (c.$map as Json[]).length; }
    else if ('$undefined' in c) kind = 'undefined';
    else { kind = 'object'; count = Object.keys(c).length; }
  } else { kind = typeof c; if (typeof c === 'string') count = c.length; }
  return { kind, count, sha256: sha256(c) };
}

interface ExportFacts { kind: string; count: number | null; sha256: string; source: string }
const modules: Record<string, Record<string, unknown>> = { subjects, home, learn, notes, practice, current, plans, legal, menu, tools, xray, tracker, book, auth, onestep, illustrations, inline };
const expected = snapshot.modules as unknown as Record<string, { path: string; exports: Record<string, ExportFacts> }>;

describe('generated data modules', () => {
  test('the set of modules is the one in the snapshot', () => {
    expect(Object.keys(modules).sort()).toEqual(Object.keys(expected).sort());
  });

  for (const file of Object.keys(expected)) {
    describe(expected[file].path, () => {
      test('exports exactly the constants in the snapshot', () => {
        expect(Object.keys(modules[file]).sort()).toEqual(Object.keys(expected[file].exports).sort());
      });
      for (const name of Object.keys(expected[file].exports)) {
        test(name + ' (' + expected[file].exports[name].source + ') has the recorded kind, size and content hash', () => {
          const recorded = expected[file].exports[name];
          expect(facts(modules[file][name])).toEqual({ kind: recorded.kind, count: recorded.count, sha256: recorded.sha256 });
        });
      }
    });
  }

  test('the barrel re-exports every constant', () => {
    const barrel = dataIndex as unknown as Record<string, unknown>;
    const aliases = snapshot.indexAliases as { name: string; module: string; alias: string }[];
    for (const file of Object.keys(expected)) {
      for (const name of Object.keys(expected[file].exports)) {
        const alias = aliases.find(a => a.module === file && a.name === name);
        expect(barrel[alias ? alias.alias : name]).toBe(modules[file][name]);
      }
    }
  });

  test('markers list the environment-derived values and the functions kept in data', () => {
    expect(markers.ENV_DERIVED.length).toBe(snapshot.markers.envDerived);
    expect(markers.FUNCTIONS_IN_DATA.length).toBe(snapshot.markers.functionsInData);
    expect(markers.ENV_SAMPLE).toEqual(snapshot.referenceEnv);
  });
});

describe('initial state', () => {
  test('has the recorded fields and content hash', () => {
    const s = createInitialState(INITIAL_STATE_ENV_SAMPLE);
    expect(Object.keys(s)).toEqual(snapshot.initialState.fields);
    const { kind, count, sha256: hash } = facts(s);
    expect({ kind, count, sha256: hash }).toEqual({ kind: snapshot.initialState.kind, count: snapshot.initialState.count, sha256: snapshot.initialState.sha256 });
    expect(Object.keys(INITIAL_STATE_ENV_SAMPLE)).toEqual(snapshot.initialState.envKeys);
    expect(STATE_FIELDS_ASSIGNED_LATER.length).toBe(snapshot.initialState.laterFields);
  });

  test('every call returns a fresh copy', () => {
    const a = createInitialState(INITIAL_STATE_ENV_SAMPLE);
    const b = createInitialState(INITIAL_STATE_ENV_SAMPLE);
    expect(a).not.toBe(b);
    expect(a.saved).not.toBe(b.saved);
    expect(a.saved).toBeInstanceOf(Set);
    a.saved.add('changed');
    a.user.name = 'changed';
    expect(b.saved.has('changed')).toBe(false);
    expect(facts(b).sha256).toBe(snapshot.initialState.sha256);
  });
});

describe('i18n strings', () => {
  test('have the recorded languages, keys and content hash', () => {
    expect([...LANGS]).toEqual(snapshot.i18n.langs);
    expect(I18N_KEYS.length).toBe(snapshot.i18n.keys);
    for (const lang of LANGS) expect(Object.keys(I18N[lang])).toEqual([...I18N_KEYS]);
    expect(facts(I18N).sha256).toBe(snapshot.i18n.sha256);
  });
});

describe('icons', () => {
  test('have the recorded names and content hash', () => {
    expect([...ICON_NAMES]).toEqual(snapshot.icons.names);
    expect(Object.keys(ICONS)).toEqual(snapshot.icons.names);
    expect(sha256(ICONS)).toBe(snapshot.icons.sha256);
    expect(Object.keys(ILLUSTRATION_SYMBOLS)).toEqual(snapshot.icons.illustrationSymbols);
    expect(sha256(ILLUSTRATION_SYMBOLS)).toBe(snapshot.icons.illustrationSha256);
  });

  test('every icon has a viewBox and at least one shape', () => {
    for (const name of ICON_NAMES) {
      expect(typeof ICONS[name].viewBox).toBe('string');
      expect(ICONS[name].shapes.length).toBeGreaterThan(0);
    }
  });
});

describe('actions.map.json', () => {
  test('lists the recorded verbs', () => {
    const verbs = actionsMap.verbs.map(v => v.verb);
    expect(verbs.length).toBe(snapshot.actions.verbs);
    expect(new Set(verbs).size).toBe(verbs.length);
    expect(sha256(verbs)).toBe(snapshot.actions.verbsSha256);
    expect(actionsMap.counts.verbsWithoutHandler.length).toBe(snapshot.actions.withoutHandler);
    expect(typeof actionsMap.dispatcher.code).toBe('string');
  });

  test('every verb has the fields the porting agents fill in', () => {
    for (const v of actionsMap.verbs) {
      expect(v).toHaveProperty('owner');
      expect(v).toHaveProperty('native');
      expect(v).toHaveProperty('test');
      expect(Array.isArray(v.argExamples)).toBe(true);
      expect(v.argExamples.length).toBeLessThanOrEqual(5);
    }
  });
});
