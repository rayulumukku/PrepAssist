// Notes Tracker handlers: Object.assign(A, {...}) of <script id="notes2js"> (PrepAssist.html L10591-L10633),
// the earlier tracker handlers it keeps (ntAdd, ntCol, nsSplit, nsSplitGo L8192-L8196) and A.ntAddGo's
// wrapper (L10631-L10632). DOM writes are state changes; the screens and sheets re-render from the store.
import type { HandlerMap } from '../../../actions/types';
import { closeSheet, openSheet, push, toast } from '../../../navigation/nav';
import { getS, setS } from '../../../store';
import type { NnDraft } from '../../../store/slices/library';
import { ensureKey, fold, foldKey, noteBy, notesOf, updateNote } from './nt';
import type { NtNote } from './nt';

let seq = 47; // `seq` after the 47 seeded notes (L10432-L10436)

/** The el of ntMore / ntAddGo / ntOptCus: what the sheet hands over instead of the DOM node. */
export interface NtEl {
  toggle?: () => void;
  value?: string;
}

const mergeTimers: ReturnType<typeof setTimeout>[] = [];

export const ntHandlers: HandlerMap = {
  ntSort: s => setS({ ntSort: s ?? 'new' }),
  ntStar: id => {
    const n = noteBy(id ?? '');
    if (!n) return;
    updateNote(n.id, x => ({ star: !x.star }));
    toast(!n.star ? 'Starred' : 'Removed from starred', 'star');
  },
  ntUps: id => {
    const n = noteBy(id ?? '');
    if (!n) return;
    if (!n.ups.length) {
      toast('This note is up to date', 'check');
      return;
    }
    setS({ ntMerge: null });
    openSheet('noteUpdates', { arg: n.id, tall: true });
  },
  ntMore: (_a, el) => (el as NtEl | undefined)?.toggle?.(),
  ntIgn: x => {
    const [id, k] = (x ?? '').split(':');
    const n = noteBy(id);
    if (!n) return;
    const ups = n.ups.filter((_, i) => i !== Number(k));
    updateNote(id, () => ({ ups }));
    if (!ups.length) {
      closeSheet();
      toast('All updates cleared', 'check');
    } else {
      // `$('#sheet').innerHTML = upsSheet(id)`: the cards are rebuilt (every "Show more" closes again)
      setS(s => ({ ntUpsGen: s.ntUpsGen + 1 }));
    }
  },
  ntIgnAll: id => {
    const n = noteBy(id ?? '');
    if (!n) return;
    const c = n.ups.length;
    updateNote(n.id, () => ({ ups: [] }));
    closeSheet();
    toast(`${c} update${c === 1 ? '' : 's'} ignored`, 'check');
  },
  ntMerge: id => {
    const n = noteBy(id ?? '');
    if (!n) return;
    const c = n.ups.length;
    const steps = ['Reading ' + c + ' update' + (c === 1 ? '' : 's'), 'Removing what’s already in your note', 'Summarising in UPSC style', 'Merging into “' + n.t + '”'];
    setS({ ntMerge: { id: n.id, phase: 'proc', steps, c, pts: [] } });
    mergeTimers.push(
      setTimeout(() => {
        const cur = noteBy(n.id);
        if (!cur) return;
        const pts =
          cur.t === 'Cooperatives'
            ? [
                'UN International Year of Cooperatives 2025 — theme “Cooperatives Build a Better World”, proclaimed by UNGA (June 2024).',
                'National Cooperative Policy 2025: a cooperative in every village; replaces the 2002 policy.',
                'Rajendra Shah (2021): Part IX-B struck down for State societies — Entry 32, List II.',
                'Mains hook: cooperatives as cooperative federalism — Ministry of Cooperation, PACS computerisation.',
              ]
            : cur.ups.map(u => u.h.replace(/<h5>(.*?)<\/h5>[\s\S]*/, '$1').replace(/<[^>]+>/g, '') + ' — added from ' + u.src.s + '.');
        updateNote(cur.id, () => ({ merged: { n: c, at: 'just now', pts }, ups: [], d: 'today', ts: Date.now() }));
        // `if (!$('#ntUpB')) return`: the result only shows while the updates sheet is still there
        const sh = getS().sheet;
        if (sh.key === 'noteUpdates' && getS().ntMerge?.id === cur.id) setS({ ntMerge: { id: cur.id, phase: 'done', steps, c, pts } });
      }, 2100),
    );
  },
  ntView: id => {
    closeSheet();
    const p = getS().stack[getS().stack.length - 1];
    if (p && p.id === 'ntNote' && p.arg === id) return; // refreshTop(): the page re-renders from the store
    push('ntNote', id ?? '');
  },
  ntInbox: () => openSheet('trackerInbox', { tall: true }),
  ntNew: name => {
    const p = getS().stack[getS().stack.length - 1];
    let k = 'polity';
    if (name) k = fold(name)[2];
    else if (p && p.id === 'folder') k = fold(p.arg ?? '')[2];
    setS({ nn: { mode: 'type', k, t: '', b: '', g: '', img: 0, file: '', busy: false } });
    openSheet('noteNew', { tall: true });
  },
  ntMode: m => setNn({ mode: m ?? 'type' }),
  ntSubj: k => setNn({ k: k ?? '' }),
  ntImg: () => {
    setNn({ img: Math.min(4, (getS().nn?.img ?? 0) + 1) });
    toast('Image attached', 'image');
  },
  ntCap: () => {
    const N = getS().nn;
    if (!N || N.busy) return;
    setNn({ busy: true });
    setTimeout(() => {
      const M = getS().nn;
      if (!M) return;
      setNn({
        busy: false,
        t: M.t || 'Scanned notes — ' + foldKey(M.k)[0],
        b: 'Art 19(1)(c) — right to form associations, unions and cooperative societies.\nArt 43B — State shall promote voluntary formation and democratic control of cooperatives.\nPart IX-B (Art 243ZH–243ZT) — added by the 97th Amendment, 2011.',
      });
      toast('Text extracted from your photo', 'camera');
    }, 1300);
  },
  ntPick: () => {
    const N = getS().nn;
    if (!N || N.busy) return;
    setNn({ busy: true });
    setTimeout(() => {
      const M = getS().nn;
      if (!M) return;
      setNn({
        busy: false,
        file: 'Chapter_notes_' + foldKey(M.k)[0].replace(/\W+/g, '_') + '.pdf',
        t: M.t || 'Chapter notes — ' + foldKey(M.k)[0],
        b: 'Text extracted from 12 pages. Headings, lists and tables are kept so you can edit before saving.',
      });
    }, 1200);
  },
  ntFileX: () => setNn({ file: '', b: '' }),
  ntSave: () => {
    const N = getS().nn;
    if (!N || !N.t.trim()) return;
    const F = foldKey(N.k);
    const note: NtNote = {
      id: 'nt' + ++seq,
      s: N.k,
      t: N.t.trim(),
      p: (N.b || (N.file ? 'Imported from ' + N.file : 'No content yet')).split('\n')[0].slice(0, 160),
      d: 'Today',
      ts: Date.now(),
      star: false,
      ups: [],
      tags: N.g
        .split(',')
        .map(x => x.trim().replace(/^#/, ''))
        .filter(Boolean),
      merged: null,
    };
    setS(s => ({ NT: { ...s.NT, [N.k]: [note, ...notesOf(N.k, s)] } }));
    closeSheet();
    toast(`Saved to ${F[0]} · we’ll watch for updates`, 'check');
  },
  ntOpt: () => openSheet('trackerOptional', { tall: true }),
  ntOptSet: o => {
    setS({ optional: o ?? null });
    ensureKey('opt:' + o);
    closeSheet();
    toast(`Tracking ${o} as your optional`, 'check');
  },
  ntOptCus: (_a, el) => {
    const v = ((el as NtEl | undefined)?.value ?? '').trim();
    if (!v) {
      toast('Type a subject name', 'x');
      return;
    }
    if (!getS().OPTIONALS.includes(v)) setS(s => ({ OPTIONALS: [...s.OPTIONALS, v] }));
    ntHandlers.ntOptSet(v);
  },
  // ---- kept from the first tracker (L8192-L8196) ----
  nsSplit: () => openSheet('trackerSplitPdf'),
  nsSplitGo: () => {
    closeSheet();
    toast('Split into 2 PDFs · saved to your vault', 'scissors');
  },
  ntAdd: () => openSheet('trackerNewFolder'),
  ntCol: c => setS({ _ntc: c }),
  ntAddGo: (_a, el) => {
    const n = ((el as NtEl | undefined)?.value ?? '').trim();
    if (!n) {
      toast('Give the folder a name', 'x');
      return;
    }
    const c = getS()._ntc || '#6C5DD3';
    // S.folders.push(...) then S.folders = [] (L8196): net effect nothing; FOLDERS gains the folder
    setS(s => ({ FOLDERS: [...s.FOLDERS, [n, c, 'x-' + n]], folders: [] }));
    closeSheet();
    toast(`Folder “${n}” created`, 'folder');
    // wrapper L10632: notesOf(f[2]) for the new folder
    ensureKey('x-' + n);
  },
};

function setNn(p: Partial<NnDraft>): void {
  setS(s => (s.nn ? { nn: { ...s.nn, ...p } } : {}));
}
