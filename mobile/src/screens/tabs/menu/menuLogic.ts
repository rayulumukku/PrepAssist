// Source: PrepAssist.html L7684-L7697 (mAct, sylAll, vaultMB, mStat), L7179-L7184 (caPool for today), L7715-L7720 (menuBody search)
// Pure logic of the Menu tab.
import { ANSWERBANK, MT, NOTES, NOTESYS, SYL } from '../../../data';
import type { DocsItem } from '../../../data';

/** mAct(id) L7684 */
export const mAct = (id: string): string => MT[id].act || 'push:' + id;

/** vaultMB() L7687 */
export function vaultMB(docs: readonly DocsItem[]): number {
  return docs.reduce((s, d) => s + (parseFloat((d.m.match(/([\d.]+) MB/) || ['', '1.5'])[1]) || 1.5), 0);
}

/** caPool(isoD(TODAY)) is always the fixed list of today's eight stories (L7180). */
const TODAY_POOL = ['c1', 'c2', 'c3', 'c4', 'a2', 'a4', 'a7', 'a6'];

export interface MStatInput {
  pqbDone: number;
  tqLib: number;
  sylDone: Record<string, number>;
  saved: number;
  savedLinks: number;
  docs: readonly DocsItem[];
  maps: number;
}

/** mStat(id) L7688-L7696 */
export function mStat(id: string, x: MStatInput): string {
  const all = SYL.flatMap(g => g.t.map(([n]) => x.sylDone[n] || 0));
  const map: Record<string, string> = {
    pqb: `${x.pqbDone} solved`,
    testquiz: `${x.tqLib} in library`,
    answerbank: `${ANSWERBANK.length} questions`,
    mains: '20 credits',
    current: `${TODAY_POOL.length} today`,
    notesys: `${NOTESYS.length} compendiums`,
    syllabus: `${Math.round((all.filter(a => a).length / all.length) * 100)}% started`,
    saved: `${x.saved + x.savedLinks} saved`,
    upload: 'PDF · DOCX · JPG',
    cloud: `${vaultMB(x.docs).toFixed(1)} MB used`,
    tracker: `${NOTES.length} notes`,
    querydb: '4 credits',
    mindmaps: `${x.maps} saved`,
  };
  return map[id];
}

/** The search of menuBody L7717-L7718: ids whose name + description contain the query. */
export function menuHits(q: string): string[] {
  const s = q.trim().toLowerCase();
  return Object.keys(MT).filter(id => (MT[id].n + ' ' + MT[id].d).toLowerCase().includes(s));
}
