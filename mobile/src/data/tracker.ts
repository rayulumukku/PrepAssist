// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Notes Tracker v2: folders, optionals, sources, raw rows and the built note list (NT).
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.
import type { EnvDerived } from './markers';

// Source: PrepAssist.html L7821 (FOLDERS)
//   Handlers change it while the app runs (L8196 .push()): treat it as the seed of app state, not as a fixed table.
export const FOLDERS: readonly (readonly string[])[] = [
  ['Polity', '#6C5DD3', 'polity'],
  ['History', '#0A97B8', 'history'],
  ['Geography', '#0E9A8A', 'geo'],
  ['Economy', '#E8890C', 'eco'],
  ['Environment', '#3E9A55', 'env'],
  ['Art & Culture', '#D6408B', 'art'],
  ['Science & Tech', '#7C5CD6', 'snt'],
];

// Source: PrepAssist.html L7822 (OPTIONALS)
//   Changed after its declaration at L10336 (.splice()); this is the final value once every script has run.
//   Handlers change it while the app runs (L10627 .push()): treat it as the seed of app state, not as a fixed table.
export const OPTIONALS: readonly string[] = [
  'History',
  'Public Administration',
  'Political Science & IR',
  'Sociology',
  'Psychology',
  'Philosophy',
  'Economics',
  'Anthropology',
  'Geography',
  'Agriculture',
  'Law',
  'Mathematics',
  'Physics',
  'Chemistry',
];

// Source: PrepAssist.html L10335 (NT_OPTS)
//   Local to the IIFE at L10334-L10634 (<script id="notes2js">); not reachable from outside it in the HTML.
export const NT_OPTS: readonly string[] = [
  'History',
  'Public Administration',
  'Political Science & IR',
  'Sociology',
  'Psychology',
  'Philosophy',
  'Economics',
  'Anthropology',
  'Geography',
  'Agriculture',
  'Law',
  'Mathematics',
  'Physics',
  'Chemistry',
];

// Source: PrepAssist.html L10338 (OPT_C)
//   Local to the IIFE at L10334-L10634 (<script id="notes2js">); not reachable from outside it in the HTML.
export const OPT_C: string = '#E8890C';

export interface SrcItem {
  readonly s: string;
  readonly f: string;
  readonly tag: string;
  readonly ic: string;
  readonly c: string;
}

// Source: PrepAssist.html L10340-L10346 (SRC)
//   Local to the IIFE at L10334-L10634 (<script id="notes2js">); not reachable from outside it in the HTML.
export const SRC: readonly SrcItem[] = [
  {
    s: 'Personal Vault',
    f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
    tag: 'Raw Notes · User Upload',
    ic: 'db',
    c: '#8A4FD3',
  },
  { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
  { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
  {
    s: 'X-Ray Scan',
    f: 'Using trade treaty policy to strengthen arbitration',
    tag: 'From X-Ray Reading',
    ic: 'xray',
    c: '#C99B1A',
  },
  {
    s: 'PrepAssist Notes',
    f: 'Faculty compendium revision',
    tag: 'Verified Compendium',
    ic: 'notes',
    c: '#6C5DD3',
  },
];

// Source: PrepAssist.html L10347 (UD)
//   Local to the IIFE at L10334-L10634 (<script id="notes2js">); not reachable from outside it in the HTML.
export const UD: readonly string[] = ['5 Nov 2026', '3 Nov 2026', '1 Nov 2026', '29 Oct 2026', '24 Oct 2026', '18 Oct 2026'];

export interface CoopUpsItem {
  readonly k: number;
  readonly h: string;
}

// Source: PrepAssist.html L10349-L10354 (COOP_UPS)
//   Local to the IIFE at L10334-L10634 (<script id="notes2js">); not reachable from outside it in the HTML.
export const COOP_UPS: readonly CoopUpsItem[] = [
  {
    k: 0,
    h: '<h4>Polity and Governance</h4><h5>Cooperatives</h5><p>Union Home Minister and Minister of Cooperation and Prime Minister of India inaugurated the UN <b>International Year of Cooperatives 2025 (IYC 2025)</b>.</p><h5>About IYC 2025</h5><ul><li><b>Proclaimed by:</b> United Nations General Assembly in June 2024</li><li><b>Theme:</b> “Cooperatives Build a Better World”</li><li><b>Objectives:</b> raise awareness, promote growth, advocate for policies, inspire leadership</li><li><b>Host:</b> Committee for the Promotion and Advancement of Cooperatives (COPAC)</li></ul>',
  },
  {
    k: 2,
    h: '<h5>National Cooperative Policy 2025</h5><p>The new policy aims to set up at least one cooperative in every village and to raise the sector’s share in GDP by 2034.</p><ul><li>Replaces the 2002 policy</li><li>Model bye-laws for PACS adopted by 32 States/UTs</li><li>Focus on cooperative-led exports, organic produce and seeds</li></ul>',
  },
  {
    k: 1,
    h: '<h5>97th Amendment after <i>Union of India v. Rajendra Shah</i> (2021)</h5><p>The Supreme Court struck down Part IX-B to the extent it dealt with State cooperative societies — States retain primary control under Entry 32, List II. Multi-State societies remain with the Union.</p>',
  },
  {
    k: 4,
    h: '<h5>Mains angle</h5><p>Use cooperatives as an example of <b>cooperative federalism in action</b>: Ministry of Cooperation (2021), computerisation of 63,000 PACS, and the Tribhuvan Sahkari University Act 2025.</p>',
  },
];

/** The keys RAW has in the HTML. */
export type RawKey =
  | 'polity'
  | 'history'
  | 'geo'
  | 'eco'
  | 'env'
  | 'art'
  | 'snt';

// Source: PrepAssist.html L10367-L10429 (RAW)
//   Local to the IIFE at L10334-L10634 (<script id="notes2js">); not reachable from outside it in the HTML.
export const RAW: Readonly<Record<string, readonly (readonly [string, string, string, number, readonly string[]])[]>> = {
  polity: [
    [
      'Cooperatives',
      'International Year of Cooperatives 2025, 97th Amendment, Ministry of Cooperation and the National Cooperative Policy.',
      '7 Sep',
      4,
      ['cooperatives', 'federalism'],
    ],
    [
      'Constitutional Architecture — Foundations',
      'The study of Indian Polity requires a profound understanding of the institutional mechanisms that hold the Republic together.',
      '13 Aug',
      5,
      ['basics'],
    ],
    [
      'Indian Polity — Historical Evolution',
      'The genesis of the Indian Constitution is deeply rooted in the colonial administrative framework — Regulating Act 1773 to the GoI Act 1935.',
      '11 Aug',
      6,
      ['laxmikanth', 'history'],
    ],
    [
      'Current Affairs January (converted)',
      'Cooperatives, Election Commission appointments, delimitation debate and the One Nation One Election committee.',
      '2 Aug',
      3,
      ['current-affairs'],
    ],
    [
      'Fundamental Rights — Art. 12–35',
      'Art 32 → SC. Art 226 → HC (wider). Writs: habeas corpus, mandamus, prohibition, certiorari, quo warranto.',
      '28 Jul',
      2,
      ['article-32', 'writs'],
    ],
    [
      'Parliament — Money vs Finance Bills',
      'Art 110 money bills, Speaker’s certificate, Rajya Sabha’s 14-day limit and the Aadhaar Act controversy.',
      '21 Jul',
      1,
      ['parliament'],
    ],
    [
      'Federalism & Inter-State Councils',
      'Art 263, Sarkaria and Punchhi Commissions, zonal councils and GST Council as cooperative federalism.',
      '14 Jul',
      2,
      ['federalism'],
    ],
    [
      'Emergency Provisions',
      'Art 352, 356, 360 — 44th Amendment safeguards, S.R. Bommai (1994) and suspension of FRs under Art 359.',
      '6 Jul',
      0,
      ['emergency'],
    ],
    [
      'Judiciary — Collegium & Appointments',
      'Second and Third Judges cases, NJAC (2015) struck down, memorandum of procedure.',
      '30 Jun',
      1,
      ['judiciary'],
    ],
    [
      'Panchayati Raj — 73rd Amendment',
      'Part IX, Eleventh Schedule (29 subjects), State Election Commission and State Finance Commission.',
      '22 Jun',
      0,
      ['local-govt'],
    ],
    [
      'Election Commission',
      'Art 324, the 2023 Appointment Act, model code of conduct and VVPAT verification.',
      '15 Jun',
      2,
      ['elections'],
    ],
    [
      'Governor — Powers & Controversies',
      'Art 163 discretion, assent to bills (Art 200), the 2025 Tamil Nadu judgment on timelines.',
      '9 Jun',
      3,
      ['governor'],
    ],
    [
      'Anti-Defection Law',
      'Tenth Schedule, Kihoto Hollohan (1992), Speaker as tribunal, 91st Amendment merger rule.',
      '1 Jun',
      0,
      ['tenth-schedule'],
    ],
    [
      'Constitutional Bodies — CAG, UPSC, FC',
      'Appointment, removal, tenure and reports of each body in a single comparison table.',
      '24 May',
      1,
      ['bodies'],
    ],
    [
      'Preamble & Basic Structure',
      'Kesavananda Bharati (1973), Minerva Mills, the 42nd Amendment additions and the 2024 “socialist, secular” ruling.',
      '16 May',
      0,
      ['basic-structure'],
    ],
  ],
  history: [
    [
      'Moderates vs Extremists',
      'Gokhale, Naoroji — drain theory. Surat split 1907, Lal-Bal-Pal and the Swadeshi movement.',
      '14 Oct',
      2,
      ['modern-india'],
    ],
    [
      'Revolt of 1857',
      'Causes, centres and leaders, why it failed, and the Government of India Act 1858.',
      '2 Oct',
      1,
      ['modern-india'],
    ],
    [
      'Bhakti & Sufi Movements',
      'Kabir, Nanak, Mirabai; Chishti and Suhrawardi silsilas; impact on language and music.',
      '20 Sep',
      0,
      ['medieval'],
    ],
    [
      'Harappan Civilisation',
      'Town planning, seals, trade with Mesopotamia; Dholavira as a World Heritage Site.',
      '3 Sep',
      1,
      ['ancient'],
    ],
  ],
  geo: [
    [
      'Indian Monsoon',
      'ITCZ shift, jet streams, El Niño and IOD; break in monsoon and retreating monsoon.',
      '19 Oct',
      3,
      ['climatology'],
    ],
    [
      'Ocean Currents',
      'Warm vs cold currents, gyres, Gulf Stream, Kuroshio; effect on fishing grounds.',
      '7 Oct',
      1,
      ['oceanography'],
    ],
    [
      'Plate Tectonics',
      'Convergent, divergent and transform boundaries; Himalayan origin and earthquakes.',
      '25 Sep',
      0,
      ['geomorphology'],
    ],
    [
      'Soils of India',
      'Alluvial, black, red, laterite, arid; soil health card and erosion control.',
      '12 Sep',
      1,
      ['indian-geo'],
    ],
    [
      'Rivers — Himalayan vs Peninsular',
      'Perennial vs seasonal, river-linking project and inter-state water disputes.',
      '30 Aug',
      0,
      ['drainage'],
    ],
    [
      'Mineral Belts',
      'Chota Nagpur, Odisha, Karnataka belts; critical minerals mission 2025.',
      '16 Aug',
      2,
      ['resources'],
    ],
  ],
  eco: [
    [
      'Monetary Policy Tools',
      'Repo, reverse repo, SDF, MSF, CRR, SLR, OMO. MPC has 6 members; inflation target 4% ± 2%.',
      '21 Oct',
      3,
      ['rbi', 'inflation'],
    ],
    [
      'Union Budget — Key Terms',
      'Fiscal, revenue and primary deficit; capital vs revenue expenditure; FRBM targets.',
      '10 Oct',
      2,
      ['budget'],
    ],
    [
      'GST & Fiscal Federalism',
      'GST Council, compensation cess, 2025 rate rationalisation and State revenue concerns.',
      '28 Sep',
      4,
      ['gst'],
    ],
    [
      'Banking Reforms',
      'IBC, NARCL bad bank, PSB mergers and the 2025 Banking Laws Amendment.',
      '15 Sep',
      1,
      ['banking'],
    ],
    [
      'Inflation — CPI vs WPI',
      'Base years, weights, core inflation and why food inflation drives CPI.',
      '1 Sep',
      0,
      ['inflation'],
    ],
    [
      'External Sector',
      'Current account deficit, FDI vs FPI, forex reserves and rupee internationalisation.',
      '20 Aug',
      2,
      ['bop'],
    ],
    [
      'Agriculture — MSP & Procurement',
      'CACP, Swaminathan formula, PM-AASHA and crop diversification.',
      '6 Aug',
      0,
      ['agriculture'],
    ],
    [
      'Economic Survey 2025–26 Highlights',
      'Growth outlook, deregulation agenda and the AI-and-jobs chapter.',
      '24 Jul',
      3,
      ['survey'],
    ],
    [
      'Poverty & Inequality Measures',
      'MPI, Tendulkar vs Rangarajan, HCES 2023–24 findings.',
      '12 Jul',
      0,
      ['social'],
    ],
  ],
  env: [
    [
      'Ramsar & Wetlands',
      '1971 Iran. India party 1982. Chilika and Keoladeo first (1981); now 90+ sites.',
      '18 Oct',
      2,
      ['wetlands'],
    ],
    [
      'Climate Finance & COP',
      'NCQG at COP29, loss and damage fund, Article 6 carbon markets.',
      '8 Oct',
      3,
      ['climate'],
    ],
    [
      'Biodiversity Hotspots',
      'Western Ghats, Himalaya, Indo-Burma, Sundaland; criteria of endemism and loss.',
      '26 Sep',
      0,
      ['biodiversity'],
    ],
    [
      'Protected Areas',
      'National parks vs sanctuaries vs conservation reserves; tiger reserves and ESZs.',
      '9 Sep',
      1,
      ['wildlife'],
    ],
    [
      'Pollution — Air Quality',
      'NCAP targets, AQI categories, GRAP stages and stubble burning.',
      '27 Aug',
      1,
      ['pollution'],
    ],
    [
      'Environmental Laws',
      'EPA 1986, Forest Conservation Amendment 2023, Wildlife Protection Amendment 2022.',
      '11 Aug',
      0,
      ['laws'],
    ],
  ],
  art: [
    [
      'Temple Architecture',
      'Nagara, Dravida and Vesara styles with key examples and features.',
      '4 Oct',
      1,
      ['architecture'],
    ],
  ],
  snt: [
    [
      'Space Missions',
      'Chandrayaan-3, Aditya-L1, Gaganyaan timeline and the Bharatiya Antariksh Station.',
      '17 Oct',
      2,
      ['isro'],
    ],
    ['Biotechnology Basics', 'CRISPR, gene therapy, GM crops and the BioE3 policy.', '5 Oct', 1, ['biotech']],
    [
      'AI & Semiconductors',
      'IndiaAI Mission, semiconductor fabs, compute capacity and AI governance.',
      '22 Sep',
      3,
      ['tech'],
    ],
    [
      'Nuclear Energy',
      'Three-stage programme, SMRs and the 2025 Nuclear Energy Mission.',
      '10 Sep',
      0,
      ['energy'],
    ],
    [
      'Defence Technology',
      'Agni-V MIRV, INS Arighaat, indigenous fighter programme.',
      '28 Aug',
      1,
      ['defence'],
    ],
    [
      'Health Tech',
      'Ayushman Bharat Digital Mission, vaccines and antimicrobial resistance.',
      '14 Aug',
      0,
      ['health'],
    ],
  ],
};

export type NtValueItemUpsItemSrc = SrcItem;

export interface NtValueItemUpsItem {
  readonly src: NtValueItemUpsItemSrc;
  readonly d: string;
  readonly h: string;
}

export interface NtValueItem {
  readonly id: string;
  readonly s: string;
  readonly t: string;
  readonly p: string;
  readonly d: string;
  readonly ts: EnvDerived<number>;
  readonly star: boolean;
  readonly ups: readonly NtValueItemUpsItem[];
  readonly tags: readonly string[];
  readonly merged: null;
}

/** The keys NT has in the HTML. */
export type NtKey =
  | 'polity'
  | 'history'
  | 'geo'
  | 'eco'
  | 'env'
  | 'art'
  | 'snt';

// Source: PrepAssist.html L10431 (NT)
//   Local to the IIFE at L10334-L10634 (<script id="notes2js">); not reachable from outside it in the HTML.
//   Holds 47 value(s) the HTML computes from the timezone; each is an EnvDerived marker with the value seen in the reference capture.
//     timezone: L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes
//   Handlers change it while the app runs (L10442 assignment): treat it as the seed of app state, not as a fixed table.
export const NT: Readonly<Record<string, readonly NtValueItem[]>> = {
  polity: [
    {
      id: 'nt1',
      s: 'polity',
      t: 'Cooperatives',
      p: 'International Year of Cooperatives 2025, 97th Amendment, Ministry of Cooperation and the National Cooperative Policy.',
      d: '7 Sep',
      ts: { $env: 'timezone', sample: 1788719400000 },
      star: true,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '5 Nov 2026',
          h: '<h4>Polity and Governance</h4><h5>Cooperatives</h5><p>Union Home Minister and Minister of Cooperation and Prime Minister of India inaugurated the UN <b>International Year of Cooperatives 2025 (IYC 2025)</b>.</p><h5>About IYC 2025</h5><ul><li><b>Proclaimed by:</b> United Nations General Assembly in June 2024</li><li><b>Theme:</b> “Cooperatives Build a Better World”</li><li><b>Objectives:</b> raise awareness, promote growth, advocate for policies, inspire leadership</li><li><b>Host:</b> Committee for the Promotion and Advancement of Cooperatives (COPAC)</li></ul>',
        },
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '3 Nov 2026',
          h: '<h5>National Cooperative Policy 2025</h5><p>The new policy aims to set up at least one cooperative in every village and to raise the sector’s share in GDP by 2034.</p><ul><li>Replaces the 2002 policy</li><li>Model bye-laws for PACS adopted by 32 States/UTs</li><li>Focus on cooperative-led exports, organic produce and seeds</li></ul>',
        },
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '1 Nov 2026',
          h: '<h5>97th Amendment after <i>Union of India v. Rajendra Shah</i> (2021)</h5><p>The Supreme Court struck down Part IX-B to the extent it dealt with State cooperative societies — States retain primary control under Entry 32, List II. Multi-State societies remain with the Union.</p>',
        },
        {
          src: {
            s: 'PrepAssist Notes',
            f: 'Faculty compendium revision',
            tag: 'Verified Compendium',
            ic: 'notes',
            c: '#6C5DD3',
          },
          d: '29 Oct 2026',
          h: '<h5>Mains angle</h5><p>Use cooperatives as an example of <b>cooperative federalism in action</b>: Ministry of Cooperation (2021), computerisation of 63,000 PACS, and the Tribhuvan Sahkari University Act 2025.</p>',
        },
      ],
      tags: ['cooperatives', 'federalism'],
      merged: null,
    },
    {
      id: 'nt2',
      s: 'polity',
      t: 'Constitutional Architecture — Foundations',
      p: 'The study of Indian Polity requires a profound understanding of the institutional mechanisms that hold the Republic together.',
      d: '13 Aug',
      ts: { $env: 'timezone', sample: 1786559400000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '1 Nov 2026',
          h: '<h5>Official update</h5><p>The government has notified revised guidelines. Note the date, the nodal ministry and the scheme name — these are common Prelims traps.</p>',
        },
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['basics'],
      merged: null,
    },
    {
      id: 'nt3',
      s: 'polity',
      t: 'Indian Polity — Historical Evolution',
      p: 'The genesis of the Indian Constitution is deeply rooted in the colonial administrative framework — Regulating Act 1773 to the GoI Act 1935.',
      d: '11 Aug',
      ts: { $env: 'timezone', sample: 1786386600000 },
      star: false,
      ups: [
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '1 Nov 2026',
          h: '<h5>Official update</h5><p>The government has notified revised guidelines. Note the date, the nodal ministry and the scheme name — these are common Prelims traps.</p>',
        },
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
        {
          src: {
            s: 'PrepAssist Notes',
            f: 'Faculty compendium revision',
            tag: 'Verified Compendium',
            ic: 'notes',
            c: '#6C5DD3',
          },
          d: '24 Oct 2026',
          h: '<h5>Compendium revision</h5><p>The faculty compendium for this chapter was revised with updated data and one new PYQ (2025).</p>',
        },
      ],
      tags: ['laxmikanth', 'history'],
      merged: null,
    },
    {
      id: 'nt4',
      s: 'polity',
      t: 'Current Affairs January (converted)',
      p: 'Cooperatives, Election Commission appointments, delimitation debate and the One Nation One Election committee.',
      d: '2 Aug',
      ts: { $env: 'timezone', sample: 1785609000000 },
      star: false,
      ups: [
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
        {
          src: {
            s: 'PrepAssist Notes',
            f: 'Faculty compendium revision',
            tag: 'Verified Compendium',
            ic: 'notes',
            c: '#6C5DD3',
          },
          d: '24 Oct 2026',
          h: '<h5>Compendium revision</h5><p>The faculty compendium for this chapter was revised with updated data and one new PYQ (2025).</p>',
        },
      ],
      tags: ['current-affairs'],
      merged: null,
    },
    {
      id: 'nt5',
      s: 'polity',
      t: 'Fundamental Rights — Art. 12–35',
      p: 'Art 32 → SC. Art 226 → HC (wider). Writs: habeas corpus, mandamus, prohibition, certiorari, quo warranto.',
      d: '28 Jul',
      ts: { $env: 'timezone', sample: 1785177000000 },
      star: false,
      ups: [
        {
          src: {
            s: 'PrepAssist Notes',
            f: 'Faculty compendium revision',
            tag: 'Verified Compendium',
            ic: 'notes',
            c: '#6C5DD3',
          },
          d: '24 Oct 2026',
          h: '<h5>Compendium revision</h5><p>The faculty compendium for this chapter was revised with updated data and one new PYQ (2025).</p>',
        },
      ],
      tags: ['article-32', 'writs'],
      merged: null,
    },
    {
      id: 'nt6',
      s: 'polity',
      t: 'Parliament — Money vs Finance Bills',
      p: 'Art 110 money bills, Speaker’s certificate, Rajya Sabha’s 14-day limit and the Aadhaar Act controversy.',
      d: '21 Jul',
      ts: { $env: 'timezone', sample: 1784572200000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '18 Oct 2026',
          h: '<h5>Parliament — Money vs Finance Bills — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['parliament'],
      merged: null,
    },
    {
      id: 'nt7',
      s: 'polity',
      t: 'Federalism & Inter-State Councils',
      p: 'Art 263, Sarkaria and Punchhi Commissions, zonal councils and GST Council as cooperative federalism.',
      d: '14 Jul',
      ts: { $env: 'timezone', sample: 1783967400000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '5 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
      ],
      tags: ['federalism'],
      merged: null,
    },
    {
      id: 'nt8',
      s: 'polity',
      t: 'Emergency Provisions',
      p: 'Art 352, 356, 360 — 44th Amendment safeguards, S.R. Bommai (1994) and suspension of FRs under Art 359.',
      d: '6 Jul',
      ts: { $env: 'timezone', sample: 1783276200000 },
      star: false,
      ups: [],
      tags: ['emergency'],
      merged: null,
    },
    {
      id: 'nt9',
      s: 'polity',
      t: 'Judiciary — Collegium & Appointments',
      p: 'Second and Third Judges cases, NJAC (2015) struck down, memorandum of procedure.',
      d: '30 Jun',
      ts: { $env: 'timezone', sample: 1782757800000 },
      star: false,
      ups: [
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '1 Nov 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['judiciary'],
      merged: null,
    },
    {
      id: 'nt10',
      s: 'polity',
      t: 'Panchayati Raj — 73rd Amendment',
      p: 'Part IX, Eleventh Schedule (29 subjects), State Election Commission and State Finance Commission.',
      d: '22 Jun',
      ts: { $env: 'timezone', sample: 1782066600000 },
      star: false,
      ups: [],
      tags: ['local-govt'],
      merged: null,
    },
    {
      id: 'nt11',
      s: 'polity',
      t: 'Election Commission',
      p: 'Art 324, the 2023 Appointment Act, model code of conduct and VVPAT verification.',
      d: '15 Jun',
      ts: { $env: 'timezone', sample: 1781461800000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '24 Oct 2026',
          h: '<h5>Election Commission — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['elections'],
      merged: null,
    },
    {
      id: 'nt12',
      s: 'polity',
      t: 'Governor — Powers & Controversies',
      p: 'Art 163 discretion, assent to bills (Art 200), the 2025 Tamil Nadu judgment on timelines.',
      d: '9 Jun',
      ts: { $env: 'timezone', sample: 1780943400000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '18 Oct 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '5 Nov 2026',
          h: '<h5>Official update</h5><p>The government has notified revised guidelines. Note the date, the nodal ministry and the scheme name — these are common Prelims traps.</p>',
        },
      ],
      tags: ['governor'],
      merged: null,
    },
    {
      id: 'nt13',
      s: 'polity',
      t: 'Anti-Defection Law',
      p: 'Tenth Schedule, Kihoto Hollohan (1992), Speaker as tribunal, 91st Amendment merger rule.',
      d: '1 Jun',
      ts: { $env: 'timezone', sample: 1780252200000 },
      star: false,
      ups: [],
      tags: ['tenth-schedule'],
      merged: null,
    },
    {
      id: 'nt14',
      s: 'polity',
      t: 'Constitutional Bodies — CAG, UPSC, FC',
      p: 'Appointment, removal, tenure and reports of each body in a single comparison table.',
      d: '24 May',
      ts: { $env: 'timezone', sample: 1779561000000 },
      star: false,
      ups: [
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '3 Nov 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['bodies'],
      merged: null,
    },
    {
      id: 'nt15',
      s: 'polity',
      t: 'Preamble & Basic Structure',
      p: 'Kesavananda Bharati (1973), Minerva Mills, the 42nd Amendment additions and the 2024 “socialist, secular” ruling.',
      d: '16 May',
      ts: { $env: 'timezone', sample: 1778869800000 },
      star: false,
      ups: [],
      tags: ['basic-structure'],
      merged: null,
    },
  ],
  history: [
    {
      id: 'nt16',
      s: 'history',
      t: 'Moderates vs Extremists',
      p: 'Gokhale, Naoroji — drain theory. Surat split 1907, Lal-Bal-Pal and the Swadeshi movement.',
      d: '14 Oct',
      ts: { $env: 'timezone', sample: 1791916200000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '5 Nov 2026',
          h: '<h5>Moderates vs Extremists — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['modern-india'],
      merged: null,
    },
    {
      id: 'nt17',
      s: 'history',
      t: 'Revolt of 1857',
      p: 'Causes, centres and leaders, why it failed, and the Government of India Act 1858.',
      d: '2 Oct',
      ts: { $env: 'timezone', sample: 1790879400000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
      ],
      tags: ['modern-india'],
      merged: null,
    },
    {
      id: 'nt18',
      s: 'history',
      t: 'Bhakti & Sufi Movements',
      p: 'Kabir, Nanak, Mirabai; Chishti and Suhrawardi silsilas; impact on language and music.',
      d: '20 Sep',
      ts: { $env: 'timezone', sample: 1789842600000 },
      star: false,
      ups: [],
      tags: ['medieval'],
      merged: null,
    },
    {
      id: 'nt19',
      s: 'history',
      t: 'Harappan Civilisation',
      p: 'Town planning, seals, trade with Mesopotamia; Dholavira as a World Heritage Site.',
      d: '3 Sep',
      ts: { $env: 'timezone', sample: 1788373800000 },
      star: false,
      ups: [
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['ancient'],
      merged: null,
    },
  ],
  geo: [
    {
      id: 'nt20',
      s: 'geo',
      t: 'Indian Monsoon',
      p: 'ITCZ shift, jet streams, El Niño and IOD; break in monsoon and retreating monsoon.',
      d: '19 Oct',
      ts: { $env: 'timezone', sample: 1792348200000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '5 Nov 2026',
          h: '<h5>Indian Monsoon — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
      ],
      tags: ['climatology'],
      merged: null,
    },
    {
      id: 'nt21',
      s: 'geo',
      t: 'Ocean Currents',
      p: 'Warm vs cold currents, gyres, Gulf Stream, Kuroshio; effect on fishing grounds.',
      d: '7 Oct',
      ts: { $env: 'timezone', sample: 1791311400000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
      ],
      tags: ['oceanography'],
      merged: null,
    },
    {
      id: 'nt22',
      s: 'geo',
      t: 'Plate Tectonics',
      p: 'Convergent, divergent and transform boundaries; Himalayan origin and earthquakes.',
      d: '25 Sep',
      ts: { $env: 'timezone', sample: 1790274600000 },
      star: false,
      ups: [],
      tags: ['geomorphology'],
      merged: null,
    },
    {
      id: 'nt23',
      s: 'geo',
      t: 'Soils of India',
      p: 'Alluvial, black, red, laterite, arid; soil health card and erosion control.',
      d: '12 Sep',
      ts: { $env: 'timezone', sample: 1789151400000 },
      star: false,
      ups: [
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['indian-geo'],
      merged: null,
    },
    {
      id: 'nt24',
      s: 'geo',
      t: 'Rivers — Himalayan vs Peninsular',
      p: 'Perennial vs seasonal, river-linking project and inter-state water disputes.',
      d: '30 Aug',
      ts: { $env: 'timezone', sample: 1788028200000 },
      star: false,
      ups: [],
      tags: ['drainage'],
      merged: null,
    },
    {
      id: 'nt25',
      s: 'geo',
      t: 'Mineral Belts',
      p: 'Chota Nagpur, Odisha, Karnataka belts; critical minerals mission 2025.',
      d: '16 Aug',
      ts: { $env: 'timezone', sample: 1786818600000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '18 Oct 2026',
          h: '<h5>Mineral Belts — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['resources'],
      merged: null,
    },
  ],
  eco: [
    {
      id: 'nt26',
      s: 'eco',
      t: 'Monetary Policy Tools',
      p: 'Repo, reverse repo, SDF, MSF, CRR, SLR, OMO. MPC has 6 members; inflation target 4% ± 2%.',
      d: '21 Oct',
      ts: { $env: 'timezone', sample: 1792521000000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '5 Nov 2026',
          h: '<h5>Monetary Policy Tools — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
      ],
      tags: ['rbi', 'inflation'],
      merged: null,
    },
    {
      id: 'nt27',
      s: 'eco',
      t: 'Union Budget — Key Terms',
      p: 'Fiscal, revenue and primary deficit; capital vs revenue expenditure; FRBM targets.',
      d: '10 Oct',
      ts: { $env: 'timezone', sample: 1791570600000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
      ],
      tags: ['budget'],
      merged: null,
    },
    {
      id: 'nt28',
      s: 'eco',
      t: 'GST & Fiscal Federalism',
      p: 'GST Council, compensation cess, 2025 rate rationalisation and State revenue concerns.',
      d: '28 Sep',
      ts: { $env: 'timezone', sample: 1790533800000 },
      star: false,
      ups: [
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '1 Nov 2026',
          h: '<h5>Official update</h5><p>The government has notified revised guidelines. Note the date, the nodal ministry and the scheme name — these are common Prelims traps.</p>',
        },
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['gst'],
      merged: null,
    },
    {
      id: 'nt29',
      s: 'eco',
      t: 'Banking Reforms',
      p: 'IBC, NARCL bad bank, PSB mergers and the 2025 Banking Laws Amendment.',
      d: '15 Sep',
      ts: { $env: 'timezone', sample: 1789410600000 },
      star: false,
      ups: [
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['banking'],
      merged: null,
    },
    {
      id: 'nt30',
      s: 'eco',
      t: 'Inflation — CPI vs WPI',
      p: 'Base years, weights, core inflation and why food inflation drives CPI.',
      d: '1 Sep',
      ts: { $env: 'timezone', sample: 1788201000000 },
      star: false,
      ups: [],
      tags: ['inflation'],
      merged: null,
    },
    {
      id: 'nt31',
      s: 'eco',
      t: 'External Sector',
      p: 'Current account deficit, FDI vs FPI, forex reserves and rupee internationalisation.',
      d: '20 Aug',
      ts: { $env: 'timezone', sample: 1787164200000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '18 Oct 2026',
          h: '<h5>External Sector — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['bop'],
      merged: null,
    },
    {
      id: 'nt32',
      s: 'eco',
      t: 'Agriculture — MSP & Procurement',
      p: 'CACP, Swaminathan formula, PM-AASHA and crop diversification.',
      d: '6 Aug',
      ts: { $env: 'timezone', sample: 1785954600000 },
      star: false,
      ups: [],
      tags: ['agriculture'],
      merged: null,
    },
    {
      id: 'nt33',
      s: 'eco',
      t: 'Economic Survey 2025–26 Highlights',
      p: 'Growth outlook, deregulation agenda and the AI-and-jobs chapter.',
      d: '24 Jul',
      ts: { $env: 'timezone', sample: 1784831400000 },
      star: false,
      ups: [
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '3 Nov 2026',
          h: '<h5>Official update</h5><p>The government has notified revised guidelines. Note the date, the nodal ministry and the scheme name — these are common Prelims traps.</p>',
        },
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '1 Nov 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['survey'],
      merged: null,
    },
    {
      id: 'nt34',
      s: 'eco',
      t: 'Poverty & Inequality Measures',
      p: 'MPI, Tendulkar vs Rangarajan, HCES 2023–24 findings.',
      d: '12 Jul',
      ts: { $env: 'timezone', sample: 1783794600000 },
      star: false,
      ups: [],
      tags: ['social'],
      merged: null,
    },
  ],
  env: [
    {
      id: 'nt35',
      s: 'env',
      t: 'Ramsar & Wetlands',
      p: '1971 Iran. India party 1982. Chilika and Keoladeo first (1981); now 90+ sites.',
      d: '18 Oct',
      ts: { $env: 'timezone', sample: 1792261800000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '5 Nov 2026',
          h: '<h5>Ramsar & Wetlands — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['wetlands'],
      merged: null,
    },
    {
      id: 'nt36',
      s: 'env',
      t: 'Climate Finance & COP',
      p: 'NCQG at COP29, loss and damage fund, Article 6 carbon markets.',
      d: '8 Oct',
      ts: { $env: 'timezone', sample: 1791397800000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '1 Nov 2026',
          h: '<h5>Official update</h5><p>The government has notified revised guidelines. Note the date, the nodal ministry and the scheme name — these are common Prelims traps.</p>',
        },
      ],
      tags: ['climate'],
      merged: null,
    },
    {
      id: 'nt37',
      s: 'env',
      t: 'Biodiversity Hotspots',
      p: 'Western Ghats, Himalaya, Indo-Burma, Sundaland; criteria of endemism and loss.',
      d: '26 Sep',
      ts: { $env: 'timezone', sample: 1790361000000 },
      star: false,
      ups: [],
      tags: ['biodiversity'],
      merged: null,
    },
    {
      id: 'nt38',
      s: 'env',
      t: 'Protected Areas',
      p: 'National parks vs sanctuaries vs conservation reserves; tiger reserves and ESZs.',
      d: '9 Sep',
      ts: { $env: 'timezone', sample: 1788892200000 },
      star: false,
      ups: [
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['wildlife'],
      merged: null,
    },
    {
      id: 'nt39',
      s: 'env',
      t: 'Pollution — Air Quality',
      p: 'NCAP targets, AQI categories, GRAP stages and stubble burning.',
      d: '27 Aug',
      ts: { $env: 'timezone', sample: 1787769000000 },
      star: false,
      ups: [
        {
          src: {
            s: 'PrepAssist Notes',
            f: 'Faculty compendium revision',
            tag: 'Verified Compendium',
            ic: 'notes',
            c: '#6C5DD3',
          },
          d: '24 Oct 2026',
          h: '<h5>Compendium revision</h5><p>The faculty compendium for this chapter was revised with updated data and one new PYQ (2025).</p>',
        },
      ],
      tags: ['pollution'],
      merged: null,
    },
    {
      id: 'nt40',
      s: 'env',
      t: 'Environmental Laws',
      p: 'EPA 1986, Forest Conservation Amendment 2023, Wildlife Protection Amendment 2022.',
      d: '11 Aug',
      ts: { $env: 'timezone', sample: 1786386600000 },
      star: false,
      ups: [],
      tags: ['laws'],
      merged: null,
    },
  ],
  art: [
    {
      id: 'nt41',
      s: 'art',
      t: 'Temple Architecture',
      p: 'Nagara, Dravida and Vesara styles with key examples and features.',
      d: '4 Oct',
      ts: { $env: 'timezone', sample: 1791052200000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '5 Nov 2026',
          h: '<h5>Temple Architecture — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['architecture'],
      merged: null,
    },
  ],
  snt: [
    {
      id: 'nt42',
      s: 'snt',
      t: 'Space Missions',
      p: 'Chandrayaan-3, Aditya-L1, Gaganyaan timeline and the Bharatiya Antariksh Station.',
      d: '17 Oct',
      ts: { $env: 'timezone', sample: 1792175400000 },
      star: false,
      ups: [
        {
          src: {
            s: 'Personal Vault',
            f: '1_CURRENT_AFFAIRS_JANUARY_2025 - converted',
            tag: 'Raw Notes · User Upload',
            ic: 'db',
            c: '#8A4FD3',
          },
          d: '5 Nov 2026',
          h: '<h5>Space Missions — what’s new</h5><p>A recent development adds a fresh example to this topic. Useful as a current-affairs hook in the introduction of a Mains answer.</p><ul><li>Key fact or figure from the source</li><li>Linked committee, report or judgment</li><li>Possible Prelims statement to remember</li></ul>',
        },
      ],
      tags: ['isro'],
      merged: null,
    },
    {
      id: 'nt43',
      s: 'snt',
      t: 'Biotechnology Basics',
      p: 'CRISPR, gene therapy, GM crops and the BioE3 policy.',
      d: '5 Oct',
      ts: { $env: 'timezone', sample: 1791138600000 },
      star: false,
      ups: [
        {
          src: { s: 'The Hindu', f: 'Editorial · Opinion', tag: 'Current Affairs', ic: 'globe', c: '#1B8AD3' },
          d: '3 Nov 2026',
          h: '<h5>Editorial view</h5><p>The article argues that implementation, not design, is the main gap — and suggests three reforms you can quote in the “way forward”.</p>',
        },
      ],
      tags: ['biotech'],
      merged: null,
    },
    {
      id: 'nt44',
      s: 'snt',
      t: 'AI & Semiconductors',
      p: 'IndiaAI Mission, semiconductor fabs, compute capacity and AI governance.',
      d: '22 Sep',
      ts: { $env: 'timezone', sample: 1790015400000 },
      star: false,
      ups: [
        {
          src: { s: 'PIB', f: 'Press release', tag: 'Government Source', ic: 'shield', c: '#2F8A4A' },
          d: '1 Nov 2026',
          h: '<h5>Official update</h5><p>The government has notified revised guidelines. Note the date, the nodal ministry and the scheme name — these are common Prelims traps.</p>',
        },
        {
          src: {
            s: 'X-Ray Scan',
            f: 'Using trade treaty policy to strengthen arbitration',
            tag: 'From X-Ray Reading',
            ic: 'xray',
            c: '#C99B1A',
          },
          d: '29 Oct 2026',
          h: '<h5>From your X-Ray scan</h5><p>Two highlighted insights from your scanned page relate to this note and have been matched automatically.</p>',
        },
      ],
      tags: ['tech'],
      merged: null,
    },
    {
      id: 'nt45',
      s: 'snt',
      t: 'Nuclear Energy',
      p: 'Three-stage programme, SMRs and the 2025 Nuclear Energy Mission.',
      d: '10 Sep',
      ts: { $env: 'timezone', sample: 1788978600000 },
      star: false,
      ups: [],
      tags: ['energy'],
      merged: null,
    },
    {
      id: 'nt46',
      s: 'snt',
      t: 'Defence Technology',
      p: 'Agni-V MIRV, INS Arighaat, indigenous fighter programme.',
      d: '28 Aug',
      ts: { $env: 'timezone', sample: 1787855400000 },
      star: false,
      ups: [
        {
          src: {
            s: 'PrepAssist Notes',
            f: 'Faculty compendium revision',
            tag: 'Verified Compendium',
            ic: 'notes',
            c: '#6C5DD3',
          },
          d: '24 Oct 2026',
          h: '<h5>Compendium revision</h5><p>The faculty compendium for this chapter was revised with updated data and one new PYQ (2025).</p>',
        },
      ],
      tags: ['defence'],
      merged: null,
    },
    {
      id: 'nt47',
      s: 'snt',
      t: 'Health Tech',
      p: 'Ayushman Bharat Digital Mission, vaccines and antimicrobial resistance.',
      d: '14 Aug',
      ts: { $env: 'timezone', sample: 1786645800000 },
      star: false,
      ups: [],
      tags: ['health'],
      merged: null,
    },
  ],
};
