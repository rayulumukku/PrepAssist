// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Notes, documents, mindmap notes and the Notes System compendiums.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface NotesItem {
  readonly id: string;
  readonly s: string;
  readonly t: string;
  readonly b: string;
  readonly when: string;
}

// Source: PrepAssist.html L5214-L5219 (NOTES)
export const NOTES: readonly NotesItem[] = [
  {
    id: 'n1',
    s: 'polity',
    t: 'Fundamental Rights — Art. 12–35',
    b: 'Art 32 → SC. Art 226 → HC (wider!). Writs: HC, M, P, C, QW…',
    when: '2 h ago',
  },
  {
    id: 'n2',
    s: 'eco',
    t: 'Monetary policy tools',
    b: 'Repo, reverse repo, SDF, MSF, CRR, SLR, OMO. MPC = 6 members…',
    when: 'Yesterday',
  },
  {
    id: 'n3',
    s: 'env',
    t: 'Ramsar & wetlands',
    b: '1971 Iran. India party 1982. Chilika + Keoladeo first (1981)…',
    when: 'Mon',
  },
  {
    id: 'n4',
    s: 'history',
    t: 'Moderates vs Extremists',
    b: 'Gokhale, Naoroji — drain theory. Surat split 1907…',
    when: '14 Oct',
  },
];

export interface DocsItem {
  readonly t: string;
  readonly m: string;
  readonly k: string;
  readonly c: string;
}

// Source: PrepAssist.html L5221-L5227 (DOCS)
//   Handlers change it while the app runs (L8184 .unshift()): treat it as the seed of app state, not as a fixed table.
export const DOCS: readonly DocsItem[] = [
  {
    t: 'Laxmikanth — Ch. 7–8 annotated.pdf',
    m: 'PDF · 4.2 MB · Uploaded 18 Oct',
    k: 'PDF',
    c: 'var(--polity)',
  },
  { t: 'Economic Survey 2025-26, Vol. 1.pdf', m: 'PDF · 12.8 MB · Cloud', k: 'PDF', c: 'var(--eco)' },
  { t: 'PYQ Polity 2013–2025.pdf', m: 'PDF · 2.1 MB · Cloud', k: 'PDF', c: 'var(--polity)' },
  { t: 'Answer — Article 32 (handwritten).jpg', m: 'Image · 3 pages · Evaluated', k: 'JPG', c: 'var(--sky)' },
  { t: 'Monsoon notes — scanned.pdf', m: 'PDF · 6.4 MB · Uploaded 9 Oct', k: 'PDF', c: 'var(--geo)' },
];

// Source: PrepAssist.html L6678-L6685 (MM_NOTES)
export const MM_NOTES: readonly (readonly string[])[] = [
  [
    'Right to Equality · Art. 14–18',
    'Equality before law & equal protection (14); no discrimination (15); equal opportunity in public employment (16); abolition of untouchability (17) and titles (18).',
  ],
  [
    'Right to Freedom · Art. 19–22',
    'Six freedoms in Art 19; protection in conviction (20); life & liberty (21); education 6–14 (21A); safeguards against arrest (22).',
  ],
  [
    'Against exploitation · Art. 23–24',
    'Prohibits traffic in human beings and forced labour (23); child labour in factories, mines and hazardous work below 14 (24).',
  ],
  [
    'Freedom of religion · Art. 25–28',
    'Conscience & free profession (25); manage religious affairs (26); no tax for promotion of religion (27); religious instruction in institutions (28).',
  ],
  [
    'Cultural & educational · Art. 29–30',
    'Protection of interests of minorities (29); right of minorities to establish and administer educational institutions (30).',
  ],
  [
    'Constitutional Remedies · Art. 32',
    'Five writs. SC under Art 32 (FRs only); HCs under Art 226 (wider). Suspended under Art 359 except Arts 20–21. Part of basic structure (L. Chandra Kumar, 1997).',
  ],
];

export interface NotesysItem {
  readonly id: string;
  readonly subj: string;
  readonly c: string;
  readonly ic: string;
  readonly t: string;
  readonly tag: string;
  readonly min: number;
  readonly date: string;
  readonly pyq: number;
  readonly glance: readonly string[];
  readonly sec: readonly (readonly [string, string | readonly (readonly string[])[], string?])[];
}

// Source: PrepAssist.html L7788-L7817 (NOTESYS)
export const NOTESYS: readonly NotesysItem[] = [
  {
    id: 'ns1',
    subj: 'Polity & Governance',
    c: '#1667B0',
    ic: 'scale',
    t: 'Fundamental Rights — One-page Synopsis',
    tag: 'UPSC Prelims 2027',
    min: 4,
    date: 'Oct 21, 2026',
    pyq: 14,
    glance: [
      'Part III · Articles 12–35 — justiciable and enforceable against the State',
      'Six categories today; property moved to Art 300A (44th Amendment, 1978)',
      'Art 32 lets you go straight to the Supreme Court — itself a Fundamental Right',
    ],
    sec: [
      [
        'Overview',
        '<p>Part III of the Constitution is the <b>Magna Carta of India</b>. Fundamental Rights are justiciable, can be enforced against the “State” as defined in Article 12, and are not absolute — Parliament can impose reasonable restrictions.</p>',
      ],
      [
        'The six rights',
        [
          ['Equality', 'Arts 14–18'],
          ['Freedom', 'Arts 19–22'],
          ['Against exploitation', 'Arts 23–24'],
          ['Freedom of religion', 'Arts 25–28'],
          ['Cultural & educational', 'Arts 29–30'],
          ['Constitutional remedies', 'Art 32'],
        ],
        'grid',
      ],
      [
        'Citizens only',
        '<p>Articles <b>15, 16, 19, 29 and 30</b> are available only to citizens. The rest extend to foreigners as well, except enemy aliens.</p>',
      ],
      [
        'Exam traps',
        '<ul><li>Article 226 is <b>wider</b> than Article 32 — High Courts can issue writs for any legal right, not just Fundamental Rights.</li><li>During a National Emergency, enforcement can be suspended under Article 359 — <b>except Articles 20 and 21</b>.</li></ul>',
        'trap',
      ],
    ],
  },
  {
    id: 'ns2',
    subj: 'Economy',
    c: '#3B5BCC',
    ic: 'chart',
    t: 'Monetary Policy Framework in India',
    tag: 'UPSC Prelims 2027',
    min: 5,
    date: 'Oct 14, 2026',
    pyq: 9,
    glance: [
      'Flexible inflation targeting: 4% CPI with a ±2% band',
      'Six-member MPC; the Governor has a casting vote',
      'SDF is the floor and MSF the ceiling of the LAF corridor',
    ],
    sec: [
      [
        'Framework',
        '<p>India follows <b>flexible inflation targeting</b>. The target — 4% CPI inflation within a band of 2–6% — is set by the Government in consultation with the RBI and reviewed every five years.</p>',
      ],
      [
        'Monetary Policy Committee',
        '<p>Six members: three from the RBI including the Governor, and three external members appointed by the Centre for four years. Decisions are by majority; the Governor has a casting vote.</p>',
      ],
      [
        'Key instruments',
        [
          ['Repo rate', 'Policy rate'],
          ['SDF', 'Corridor floor'],
          ['MSF', 'Corridor ceiling'],
          ['CRR', 'Cash with RBI'],
          ['SLR', 'Liquid assets'],
          ['OMOs', 'Bond buy / sell'],
        ],
        'grid',
      ],
      [
        'Exam traps',
        '<ul><li>The MPC sets <b>only the repo rate</b>. CRR and SLR are decided by the RBI, not the MPC.</li><li>The SDF replaced the fixed-rate reverse repo as the corridor floor in <b>April 2022</b>.</li></ul>',
        'trap',
      ],
    ],
  },
  {
    id: 'ns3',
    subj: 'Geography',
    c: '#0E9A8A',
    ic: 'globe',
    t: 'Indian Monsoon — Mechanism and Variability',
    tag: 'UPSC Mains 2026',
    min: 6,
    date: 'Oct 2, 2026',
    pyq: 11,
    glance: [
      'The ITCZ shifts north in summer and pulls in the south-east trades',
      'Tibetan heating and the Tropical Easterly Jet sustain the monsoon',
      'ENSO and the Indian Ocean Dipole drive year-to-year variability',
    ],
    sec: [
      [
        'Onset',
        '<p>In summer the ITCZ shifts north over the Indo-Gangetic plain, creating a deep low. Moist south-east trades cross the equator, turn right under the Coriolis force and arrive as the <b>south-west monsoon</b>.</p>',
      ],
      [
        'What drives it',
        [
          ['Land–sea heating', 'Pressure gradient'],
          ['Tibetan plateau', 'Heat source'],
          ['Easterly jet', 'Upper air'],
          ['ENSO · IOD', 'Variability'],
        ],
        'grid',
      ],
      [
        'Why it matters',
        '<p>Monsoon variability drives kharif output, rural demand and food inflation — a favourite <b>GS I ↔ GS III</b> linkage question.</p>',
      ],
      [
        'Exam trap',
        '<ul><li>El Niño <b>weakens</b> and La Niña strengthens the Indian monsoon — but a positive IOD can offset an El Niño year.</li></ul>',
        'trap',
      ],
    ],
  },
  {
    id: 'ns4',
    subj: 'History & Culture',
    c: '#E8890C',
    ic: 'history',
    t: 'Harappan Civilisation — Town Planning',
    tag: 'UPSC Prelims 2027',
    min: 4,
    date: 'Sep 28, 2026',
    pyq: 8,
    glance: [
      'Grid-pattern cities with a western citadel and eastern lower town',
      'Covered drains, soak pits and standardised burnt bricks',
      'Signature sites: Mohenjodaro, Harappa, Lothal, Dholavira',
    ],
    sec: [
      [
        'Layout',
        '<p>Cities followed a <b>grid pattern</b>, usually with a raised citadel to the west and a larger lower town to the east. Streets crossed at right angles.</p>',
      ],
      [
        'Civic features',
        [
          ['Great Bath', 'Mohenjodaro'],
          ['Granaries', 'Harappa'],
          ['Dockyard', 'Lothal'],
          ['Reservoirs', 'Dholavira'],
        ],
        'grid',
      ],
      [
        'Exam trap',
        '<ul><li>The Great Bath is at <b>Mohenjodaro</b>, not Harappa — and Lothal’s dockyard is in Gujarat, on the Bhogavo river.</li></ul>',
        'trap',
      ],
    ],
  },
  {
    id: 'ns5',
    subj: 'Study Strategy',
    c: '#6C5DD3',
    ic: 'target',
    t: 'Making Your Notes Work for You',
    tag: 'All stages',
    min: 3,
    date: 'Sep 17, 2026',
    pyq: 0,
    glance: [
      'Notes should generate practice, not just be re-read',
      'An AI that has read your notes can quiz you from them',
      'One chapter a week is enough to build the habit',
    ],
    sec: [
      [
        'The problem',
        '<p>Most aspirants treat their notes as a one-way street. They pour effort into making notes, and then those notes sit quietly, revisited by rereading and little else.</p>',
      ],
      [
        'The shift',
        '<p>An AI that reads your UPSC notes flips this relationship. Once a tool has actually read and understood your material, your notes stop being a passive archive and start <b>working for you</b> — generating questions, mindmaps and answer outlines.</p>',
      ],
      [
        'Try this week',
        [['Upload', 'One chapter'], ['Summarise', 'One page'], ['Practise', '10 flashcards']],
        'grid',
      ],
    ],
  },
];
