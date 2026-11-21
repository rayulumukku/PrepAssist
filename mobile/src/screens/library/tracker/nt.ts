// Notes Tracker v2 helpers (<script id="notes2js">, PrepAssist.html L10327-L10635), ported 1:1 over the store.
// NT / FOLDERS / OPTIONALS live in the store (S.NT …) and are replaced, never mutated.
import { OPT_C } from '../../../data/tracker';
import type { NtValueItemUpsItem } from '../../../data/tracker';
import { getS, setS } from '../../../store';
import type { AppState } from '../../../store';

export type Folder = readonly string[]; // [name, colour, key]

export interface NtMerged {
  n: number;
  at: string;
  pts: string[];
}

export interface NtNote {
  id: string;
  s: string;
  t: string;
  p: string;
  d: string;
  ts: number;
  star: boolean;
  ups: readonly NtValueItemUpsItem[];
  tags: readonly string[];
  merged: NtMerged | null;
}

/** NT as the store holds it: the generated rows with `ts` resolved to its captured value. */
export const ntOf = (s: Pick<AppState, 'NT'> = getS()): Record<string, readonly NtNote[]> => s.NT as unknown as Record<string, readonly NtNote[]>;

/** allNotes (L10440) */
export const allNotes = (s: Pick<AppState, 'NT'> = getS()): NtNote[] => Object.values(ntOf(s)).flat();
/** noteBy (L10441) */
export const noteBy = (id: string, s: Pick<AppState, 'NT'> = getS()): NtNote | undefined => allNotes(s).find(n => n.id === id);

/** fold (L10442) */
export function fold(name: string, s: Pick<AppState, 'FOLDERS' | 'optional'> = getS()): Folder {
  return s.FOLDERS.find(f => f[0] === name) || (name === s.optional ? [name, OPT_C, 'opt:' + name] : [name, '#6C5DD3', 'x-' + name]);
}
/** foldKey (L10443) */
export function foldKey(k: string, s: Pick<AppState, 'FOLDERS'> = getS()): Folder {
  return s.FOLDERS.find(f => f[2] === k) || (k.startsWith('opt:') ? [k.slice(4), OPT_C, k] : ['Notes', '#6C5DD3', k]);
}
/** notesOf (L10444) without the side effect: reading never creates a key here (see ensureKey). */
export const notesOf = (k: string, s: Pick<AppState, 'NT'> = getS()): readonly NtNote[] => ntOf(s)[k] || [];
/** `NT[k] || (NT[k] = [])`: the write half of notesOf. */
export function ensureKey(k: string): void {
  if (!ntOf()[k]) setS(s => ({ NT: { ...s.NT, [k]: [] } }));
}
/** upsOf (L10445) */
export const upsOf = (k: string, s: Pick<AppState, 'NT'> = getS()): number => notesOf(k, s).reduce((a, n) => a + n.ups.length, 0);
/** ntTotal (L10446) */
export const ntTotal = (s: Pick<AppState, 'NT'> = getS()): number => allNotes(s).reduce((a, n) => a + n.ups.length, 0);

/** Replace one note (n.x = … in the HTML). */
export function updateNote(id: string, f: (n: NtNote) => Partial<NtNote>): void {
  setS(s => {
    const NT = ntOf(s);
    const out: Record<string, readonly NtNote[]> = {};
    for (const [k, list] of Object.entries(NT)) out[k] = list.map(n => (n.id === id ? { ...n, ...f(n) } : n));
    return { NT: out as unknown as AppState['NT'] };
  });
}

/** sorted (L10489-L10493) */
export function sorted(k: string, sort: string, s: Pick<AppState, 'NT'> = getS()): NtNote[] {
  const l = [...notesOf(k, s)];
  if (sort === 'az') l.sort((a, b) => a.t.localeCompare(b.t));
  else if (sort === 'star') return l.filter(n => n.star).sort((a, b) => b.ts - a.ts);
  else l.sort((a, b) => b.ts - a.ts);
  return l;
}

/** nnSubjects (L10537) */
export const nnSubjects = (s: Pick<AppState, 'FOLDERS' | 'optional'> = getS()): Folder[] => [
  ...s.FOLDERS,
  ...(s.optional ? [[s.optional, OPT_C, 'opt:' + s.optional]] : []),
];

/** The search of ntSearch (L10468-L10475). */
export function search(v: string, s: Pick<AppState, 'NT' | 'FOLDERS'> = getS()): { q: string; fs: Folder[]; ns: NtNote[] } {
  const q = v.trim().toLowerCase().replace(/^#/, '');
  const fs = s.FOLDERS.filter(f => f[0].toLowerCase().includes(q));
  const ns = allNotes(s)
    .filter(n => (n.t + ' ' + n.p + ' ' + n.tags.join(' ')).toLowerCase().includes(q))
    .slice(0, 12);
  return { q, fs, ns };
}

/** `[...new Set(n.ups.map(x => x.src.s))]` */
export const srcNames = (n: NtNote): string[] => [...new Set(n.ups.map(x => x.src.s))];
