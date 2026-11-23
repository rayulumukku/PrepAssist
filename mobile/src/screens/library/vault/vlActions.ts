// Upload to Cloud and Cloud Data Vault handlers (PrepAssist.html L8180-L8190, A.upload / A.uploaded L7039,
// window.upTagAdd L8110). DOM refreshes (refreshTop) are re-renders from the store.
import type { HandlerMap } from '../../../actions/types';
import { closeSheet, openSheet, toast } from '../../../navigation/nav';
import { getS, setS } from '../../../store';
import type { LibrarySlice } from '../../../store/slices/library';

const wait = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

type Up = LibrarySlice['up'];
const setUp = (p: Partial<Up> | ((u: Up) => Partial<Up>)): void => setS(s => ({ up: { ...s.up, ...(typeof p === 'function' ? p(s.up) : p) } }));
const setVlt = (p: Partial<LibrarySlice['vlt']>): void => setS(s => ({ vlt: { ...s.vlt, ...p } }));

/** vaultMB (L7687) */
export const vaultMB = (docs: LibrarySlice['DOCS'] = getS().DOCS): number =>
  docs.reduce((s, d) => s + (parseFloat((d.m.match(/([\d.]+) MB/) || [0, '1.5'])[1] as string) || 1.5), 0);

/** window.upTagAdd (L8110) */
export function upTagAdd(v: string): void {
  const t = v.trim();
  if (!t) return;
  setUp(u => ({ tags: [...u.tags, t.startsWith('#') ? t : '#' + t] }));
}

const SORT_NEXT: Record<string, string> = { new: 'big', big: 'az', az: 'new' };
const SORT_TOAST: Record<string, string> = { new: 'newest first', big: 'largest first', az: 'name' };

export const vlHandlers: HandlerMap = {
  upload: () => openSheet('upload'),
  uploaded: () => {
    closeSheet();
    toast('Uploading… we’ll index it for X-Ray & Query', 'upload');
  },
  upPick: k => setUp({ file: k === 'img' ? { n: 'Answer_scan_GS2_page1.jpg', sz: '2.4 MB', k: 'JPG' } : { n: 'Laxmikanth_Ch9_Parliament.pdf', sz: '3.8 MB', k: 'PDF' }, prog: -1 }),
  upClear: () => setUp({ file: null, prog: -1 }),
  upFolder: f => setUp({ folder: f ?? '' }),
  upTagRm: i => setUp(u => ({ tags: u.tags.filter((_, k) => k !== Number(i)) })),
  upGo: async () => {
    for (let p = 0; p <= 100; p += 20) {
      setUp({ prog: p });
      await wait(260);
    }
    const U = getS().up;
    if (U.file) {
      const f = U.file;
      setS(s => ({ DOCS: [{ t: f.n, m: `${f.k === 'JPG' ? 'Image' : 'PDF'} · ${f.sz} · ${U.folder} · just now`, k: f.k, c: 'var(--polity)' }, ...s.DOCS] }));
    }
    toast(`Uploaded to ${U.folder} · indexed for AI`, 'check');
    await wait(500);
    setUp({ file: null, prog: -1 });
  },
  vlTab: t => setVlt({ tab: t ?? 'all' }),
  vlSort: () => {
    const next = SORT_NEXT[getS().vlt.sort];
    setVlt({ sort: next });
    toast('Sorted by ' + SORT_TOAST[next], 'sort');
  },
  vlWarn: () => setVlt({ warn: false }),
  vlDel: x => openSheet('cloudDelete', { arg: x }),
  vlDelGo: x => {
    const [k, i] = (x ?? '').split(':');
    if (k === 'doc') setS(s => ({ DOCS: s.DOCS.filter((_, n) => n !== Number(i)) }));
    else setS(s => ({ NOTES: s.NOTES.filter((_, n) => n !== Number(i)) }));
    closeSheet();
    toast('Deleted from your vault', 'trash');
  },
};
