// Library slice: OWNED BY THE LIBRARY WORKSTREAM (noteshub, notesys, note2, tracker, folder, ntNote,
// xrayhome, xray, syllabus, upload, cloud, querydb and their sheets).
// Seeded with the fields of the prototype's `S` that those views and handlers use, plus the five data
// constants the library handlers change while the app runs. Add fields here (and to
// createLibrarySlice) as you port; keep the prototype's names. Retype the seeded fields when the
// generated type is too narrow (the generator only saw the initial values).
import type {
  InitialState,
  StateNh,
  StateNsRead,
  StateNsys,
  StateQdb2,
  StateSyl,
  StateUp,
  StateVlt,
  StateX4,
  StateXr,
  StateXr2,
} from '../../data/initialState';
import { DOCS } from '../../data/notes';
import type { DocsItem } from '../../data/notes';
import { FOLDERS, NT, OPTIONALS } from '../../data/tracker';
import type { NtValueItem } from '../../data/tracker';
import { XSC } from '../../data/xray';
import type { XscItem } from '../../data/xray';

/** S.x4 (L9854) with the fields the handlers add (mcq answers, busy upload, scroll lock). */
export interface X4State extends Omit<StateX4, 'mcq' | 'busy'> {
  /** answer per `scanId:insight`: option index or 'r' (revealed), L10044 */
  mcq: Record<string, number | 'r'>;
  /** x4Up in progress (L10025): kind, the running row (-1 = none yet), rows done, percent */
  busy: { kind: string; run: number; done: number; pc: number } | null;
  /** x4ScrollTo sets it for 700 ms so the scroll spy does not move `cur` (L9958) */
  lock?: boolean;
  /** --dx of the tab body animation (L10042): 14 forward, -14 back */
  dx?: number;
}

/** A scan; x4Up adds `isNew` to the copy it unshifts (L10032). */
export type X4Scan = XscItem & { readonly isNew?: boolean };

/** One NT note (L10437-L10439) with `ts` resolved to the captured value; ntMerge sets `merged`. */
export interface NtNote extends Omit<NtValueItem, 'ts' | 'merged'> {
  readonly ts: number;
  readonly merged: { n: number; at: string; pts: string[] } | null;
}

/** S.nn (L10615) */
export interface NnDraft {
  mode: string;
  k: string;
  t: string;
  b: string;
  g: string;
  img: number;
  file: string;
  busy: boolean;
}

export interface LibrarySlice {
  /** S.syl (L7657) */
  syl: StateSyl;
  /** S.sylDone (L7658) */
  sylDone: Record<string, number>;
  /** S.up (L7659) */
  up: StateUp;
  /** S.vlt (L7660) */
  vlt: StateVlt;
  /** S.qdb2 (L7661) */
  qdb2: StateQdb2;
  /** S.nsys (L7664) */
  nsys: StateNsys;
  /** S.optional (L7665): chosen optional subject or null. */
  optional: string | null;
  /** S.folders (L7666): user-made folders `{ n, c }` (L8196). Retype when porting. */
  folders: unknown[];
  /** S.nsRead (L7818) */
  nsRead: StateNsRead;
  /** S.nsSaved (L7819): saved NOTESYS ids. */
  nsSaved: Set<string>;
  /** S.nh (L8234) */
  nh: StateNh;
  /** S.xr (L8235) */
  xr: StateXr;
  /** S.xr2 (L8378) */
  xr2: StateXr2;
  /** S.x4 (L9854). `busy` also carries the progress the HTML wrote into #x4Proc (row states, bar, %). */
  x4: X4State;
  /** S.ntSort (L10337) */
  ntSort: string;
  /** S._ntc (created L8195): colour picked in the New folder sheet. */
  _ntc: string | undefined;
  /** S.nn (created L10615): the New note sheet's draft. */
  nn: NnDraft | undefined;
  /** The merge running in the Note Updates sheet (A.ntMerge L10598-L10609 writes it into #ntUpB). */
  ntMerge: { id: string; phase: 'proc' | 'done'; steps: string[]; c: number; pts: string[] } | null;
  /** Bumped when the Note Updates sheet is rebuilt in place (A.ntIgn L10596). */
  ntUpsGen: number;

  // Data constants that handlers change (seed copies; replace, never mutate the generated modules).
  /** DOCS (L5221): A.upGo unshifts uploads (L8184). */
  DOCS: readonly DocsItem[];
  /** FOLDERS (tracker.ts): A.ntAddGo pushes a folder (L8196, L10632). */
  FOLDERS: readonly (readonly string[])[];
  /** XSC (xray.ts): a finished scan is unshifted (L10032). */
  XSC: readonly X4Scan[];
  /** OPTIONALS (tracker.ts): A.ntOptCus pushes a custom subject (L10627). */
  OPTIONALS: readonly string[];
  /** NT (tracker.ts): notes per folder key; notesOf creates keys (L10442), ntSave/ntMerge change rows. */
  NT: Readonly<Record<string, readonly NtNote[]>>;
}

export function createLibrarySlice(seed: InitialState): LibrarySlice {
  return {
    syl: seed.syl,
    sylDone: seed.sylDone,
    up: seed.up,
    vlt: seed.vlt,
    qdb2: seed.qdb2,
    nsys: seed.nsys,
    optional: seed.optional,
    folders: seed.folders,
    nsRead: seed.nsRead,
    nsSaved: new Set<string>(seed.nsSaved),
    nh: seed.nh,
    xr: seed.xr,
    xr2: seed.xr2,
    x4: { ...seed.x4, mcq: {}, busy: null },
    ntSort: seed.ntSort,
    _ntc: undefined,
    nn: undefined,
    ntMerge: null,
    ntUpsGen: 0,
    DOCS: [...DOCS],
    FOLDERS: [...FOLDERS],
    XSC: [...XSC],
    OPTIONALS: [...OPTIONALS],
    NT: Object.fromEntries(
      Object.entries(NT).map(([k, list]) => [k, list.map((n): NtNote => ({ ...n, ts: n.ts.sample, merged: null }))]),
    ),
  };
}
