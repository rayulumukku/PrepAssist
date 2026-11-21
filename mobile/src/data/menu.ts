// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Menu tab: toolkit registry and the syllabus matrix.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface MtValue {
  readonly n: string;
  readonly d: string;
  readonly ic: string;
  readonly c: string;
  readonly act?: string;
}

/** The keys MT has in the HTML. */
export type MtKey =
  | 'pqb'
  | 'testquiz'
  | 'answerbank'
  | 'mains'
  | 'current'
  | 'notesys'
  | 'syllabus'
  | 'saved'
  | 'upload'
  | 'cloud'
  | 'tracker'
  | 'querydb'
  | 'mindmaps';

// Source: PrepAssist.html L7669-L7683 (MT)
export const MT: Readonly<Record<string, MtValue>> = {
  pqb: { n: 'Prelims Question Bank', d: 'Unlimited adaptive MCQs, in English & Hindi', ic: 'list', c: '#6C5DD3' },
  testquiz: { n: 'Test Series to Quiz', d: 'Turn any test PDF into a timed mock', ic: 'upload', c: '#1B8AD3' },
  answerbank: { n: 'Mains Answer Bank', d: 'Model answers mapped to the syllabus', ic: 'bank', c: '#E8890C' },
  mains: { n: 'Mains Evaluation', d: 'AI grades your written answers', ic: 'pen', c: '#0A97B8' },
  current: {
    n: 'Current Affairs',
    d: 'Today’s edition, mapped to GS papers',
    ic: 'current',
    c: '#14304F',
    act: 'tab:current',
  },
  notesys: { n: 'Notes System', d: 'Official faculty compendiums', ic: 'doc', c: '#C8622B' },
  syllabus: { n: 'Syllabus Matrix', d: 'Every topic, with your coverage', ic: 'hash', c: '#3B5BCC' },
  saved: { n: 'Saved Articles', d: 'Your bookmarked reads & links', ic: 'bookmark', c: '#B42318' },
  upload: { n: 'Upload to Cloud', d: 'PDFs, docs, images and text notes', ic: 'cloud', c: '#F5A01F' },
  cloud: { n: 'Cloud Data Vault', d: 'Every file you’ve stored, in one place', ic: 'db', c: '#0E9A8A' },
  tracker: { n: 'Notes Tracker', d: 'Subject folders that stay up to date', ic: 'learn', c: '#3E9A55' },
  querydb: { n: 'Query your Database', d: 'Generate notes from your own material', ic: 'bolt', c: '#6C5DD3' },
  mindmaps: { n: 'AI Mindmaps', d: 'Any topic as a visual map', ic: 'mindmap', c: '#0A97B8' },
};

export interface SylItem {
  readonly g: string;
  readonly p: string;
  readonly s: string;
  readonly t: readonly (readonly [string, number])[];
}

// Source: PrepAssist.html L7758-L7767 (SYL)
export const SYL: readonly SylItem[] = [
  {
    g: 'Early Civilizations and Ancient Beliefs',
    p: 'gs1',
    s: 'history',
    t: [
      ['Great Bath of Mohenjodaro', 13],
      ['Great Granary of Harappa and Food Storage', 10],
      ['Harappan Citadel and Lower Town Structure', 1126],
      ['Harappan Grid Town Planning System', 1139],
      ['Harappan Lost-Wax Casting (Cire Perdue) Metallurgy', 12],
      ['Harappan Soak Pits and Sanitation Infrastructure', 12],
      ['Harappan Steatite Seals and Animal Motifs', 13],
      ['Harappan Terracotta Figurines and Mother Goddess', 12],
      ['Harappan Underground Drainage Network', 1069],
      ['Jain Councils, Sects (Digambara, Svetambara)', 37],
      ['Jainism’s Spread, Decline & Contributions to Art', 36],
      ['Mahavira’s Teachings & Core Doctrines of Jainism', 37],
      ['Origin of Jainism & Early Tirthankaras', 37],
    ],
  },
  {
    g: 'Constitutional Evolution and Framework',
    p: 'gs2',
    s: 'polity',
    t: [
      ['Regulating Act 1773 to Charter Acts', 410],
      ['Government of India Act, 1858 and Councils Acts', 380],
      ['Morley–Minto and Montagu–Chelmsford Reforms', 455],
      ['Government of India Act, 1935', 612],
      ['Constituent Assembly and its Committees', 498],
      ['Sources and Salient Features of the Constitution', 373],
    ],
  },
  {
    g: 'Preamble and Constitutional Philosophy',
    p: 'gs2',
    s: 'polity',
    t: [
      ['Preamble as a Key to the Constitution', 214],
      ['Sovereign, Socialist, Secular Republic', 236],
      ['Justice, Liberty, Equality, Fraternity', 268],
      ['Basic Structure Doctrine', 508],
    ],
  },
  {
    g: 'Macroeconomic Stability and Monetary Policy',
    p: 'gs3',
    s: 'eco',
    t: [
      ['Repo, Reverse Repo and the LAF Corridor', 182],
      ['Monetary Policy Committee', 166],
      ['Inflation Targeting Framework', 144],
      ['Money Supply Measures (M0–M4)', 230],
    ],
  },
  {
    g: 'Physical Geography Core Concepts',
    p: 'gs1',
    s: 'geo',
    t: [
      ['Interior of the Earth', 118],
      ['Plate Tectonics and Continental Drift', 136],
      ['Earthquakes and Volcanoes', 124],
      ['Rock System and Rock Cycle', 92],
    ],
  },
  {
    g: 'Medieval Imperial Administrations and Economy',
    p: 'gs1',
    s: 'history',
    t: [['Delhi Sultanate Administration', 128], ['Mughal Mansabdari System', 142], ['Vijayanagara Empire', 100]],
  },
  {
    g: 'Conservation and Environmental Pollution',
    p: 'gs3',
    s: 'env',
    t: [['Ramsar Convention and Wetlands', 96], ['Air Quality and GRAP', 88], ['Biodiversity Hotspots', 104]],
  },
  {
    g: 'Ethics, Integrity and Aptitude',
    p: 'gs4',
    s: 'ethics',
    t: [
      ['Probity in Public Life', 76],
      ['Emotional Intelligence', 64],
      ['Case Studies: Conflict of Interest', 58],
    ],
  },
];
