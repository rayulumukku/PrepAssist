// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Subject palette shared by every area.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface SubjValue {
  readonly n: string;
  readonly c: string;
  readonly hex: string;
}

/** The keys SUBJ has in the HTML. */
export type SubjKey =
  | 'polity'
  | 'history'
  | 'geo'
  | 'eco'
  | 'env'
  | 'ir'
  | 'snt'
  | 'ethics';

// Source: PrepAssist.html L5143-L5152 (SUBJ)
export const SUBJ: Readonly<Record<string, SubjValue>> = {
  polity: { n: 'Polity', c: 'var(--polity)', hex: '#1667B0' },
  history: { n: 'History', c: 'var(--history)', hex: '#E8890C' },
  geo: { n: 'Geography', c: 'var(--geo)', hex: '#0E9A8A' },
  eco: { n: 'Economy', c: 'var(--eco)', hex: '#3B5BCC' },
  env: { n: 'Environment', c: 'var(--env)', hex: '#3E9A55' },
  ir: { n: 'Intl. Relations', c: 'var(--ir)', hex: '#6C5DD3' },
  snt: { n: 'Science & Tech', c: 'var(--snt)', hex: '#0A97B8' },
  ethics: { n: 'Ethics', c: 'var(--ethics)', hex: '#C8622B' },
};
