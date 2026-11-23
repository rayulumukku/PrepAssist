// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Home tab: hero banners, briefing, flashcards, coverage, week, announcements, day plan, reels.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface BannersItem {
  readonly theme: string;
  readonly tag: string;
  readonly title: string;
  readonly body: string;
  readonly cta: string;
  readonly act: string;
  readonly art: string;
}

// Source: PrepAssist.html L5154-L5159 (BANNERS)
export const BANNERS: readonly BannersItem[] = [
  {
    theme: 'ink',
    tag: 'Prelims 2027',
    title: 'Build your 90-day revision strategy.',
    body: 'PrepAssist AI can identify what deserves your attention first.',
    cta: 'Build My Plan',
    act: 'push:plan',
    art: 'plan',
  },
  {
    theme: 'paper',
    tag: 'UPSC Announcement',
    title: 'CSE 2027 calendar released — key dates added.',
    body: 'Notification, Prelims and Mains dates are now in your Study Calendar.',
    cta: 'View dates',
    act: 'push:calendar',
    art: 'notice',
  },
  {
    theme: 'brand',
    tag: 'New feature',
    title: 'X-Ray Reader: read any PDF like an examiner.',
    body: 'Highlights PYQ-linked lines and syllabus keywords as you read.',
    cta: 'Try X-Ray',
    act: 'push:xray',
    art: 'xray',
  },
  {
    theme: 'sky',
    tag: 'Live · Sat, 6 PM',
    title: 'Answer-writing masterclass with AIR 38, CSE 2025.',
    body: 'Free for every PrepAssist learner. Limited seats.',
    cta: 'Reserve seat',
    act: 'toast:Seat reserved — we’ll remind you on Saturday',
    art: 'live',
  },
];

export interface BriefItem {
  readonly id: string;
  readonly title: string;
  readonly gs: string;
  readonly topic: string;
  readonly sw: string;
}

// Source: PrepAssist.html L5161-L5165 (BRIEF)
export const BRIEF: readonly BriefItem[] = [
  {
    id: 'a1',
    title: 'India–EU Trade Agreement',
    gs: 'GS II',
    topic: 'International Relations',
    sw: 'var(--ir)',
  },
  { id: 'a2', title: 'RBI Monetary Policy', gs: 'GS III', topic: 'Economy', sw: 'var(--eco)' },
  { id: 'a3', title: 'Supreme Court Constitutional Bench', gs: 'GS II', topic: 'Polity', sw: 'var(--polity)' },
];

export interface FlashItem {
  readonly s: string;
  readonly en: readonly string[];
  readonly hi: readonly string[];
}

// Source: PrepAssist.html L5167-L5178 (FLASH)
export const FLASH: readonly FlashItem[] = [
  {
    s: 'polity',
    en: [
      'Which Article did Dr B.R. Ambedkar call the “heart and soul” of the Constitution?',
      '<b>Article 32</b> — the Right to Constitutional Remedies. It lets a citizen move the Supreme Court directly when a Fundamental Right is violated.',
    ],
    hi: [
      'डॉ. बी.आर. आंबेडकर ने किस अनुच्छेद को संविधान का “हृदय और आत्मा” कहा?',
      '<b>अनुच्छेद 32</b> — संवैधानिक उपचारों का अधिकार। मौलिक अधिकार के उल्लंघन पर नागरिक सीधे सर्वोच्च न्यायालय जा सकता है।',
    ],
  },
  {
    s: 'eco',
    en: [
      'What is the repo rate?',
      'The rate at which the <b>RBI lends short-term funds to commercial banks</b> against government securities. It is set by the <b>Monetary Policy Committee</b>.',
    ],
    hi: [
      'रेपो दर क्या है?',
      'वह दर जिस पर <b>RBI वाणिज्यिक बैंकों को अल्पकालिक ऋण</b> सरकारी प्रतिभूतियों के बदले देता है। इसे <b>मौद्रिक नीति समिति</b> तय करती है।',
    ],
  },
  {
    s: 'env',
    en: [
      'Which were India’s first Ramsar sites?',
      '<b>Chilika Lake</b> (Odisha) and <b>Keoladeo National Park</b> (Rajasthan), both designated in <b>1981</b>.',
    ],
    hi: [
      'भारत के पहले रामसर स्थल कौन-से थे?',
      '<b>चिल्का झील</b> (ओडिशा) और <b>केवलादेव राष्ट्रीय उद्यान</b> (राजस्थान), दोनों <b>1981</b> में नामित।',
    ],
  },
  {
    s: 'history',
    en: [
      'Who founded the Servants of India Society in 1905?',
      '<b>Gopal Krishna Gokhale</b> — to train “national missionaries” for public service.',
    ],
    hi: [
      '1905 में सर्वेंट्स ऑफ इंडिया सोसाइटी की स्थापना किसने की?',
      '<b>गोपाल कृष्ण गोखले</b> ने — जनसेवा के लिए “राष्ट्रीय मिशनरी” तैयार करने हेतु।',
    ],
  },
  {
    s: 'geo',
    en: [
      'Which pass links Sikkim with Tibet’s Chumbi Valley and reopened for border trade in 2006?',
      '<b>Nathu La</b>, on the old Silk Route branch through Sikkim.',
    ],
    hi: [
      'कौन-सा दर्रा सिक्किम को तिब्बत की चुंबी घाटी से जोड़ता है और 2006 में सीमा व्यापार हेतु फिर खुला?',
      '<b>नाथु ला</b> — सिक्किम से होकर जाने वाले पुराने रेशम मार्ग की शाखा पर।',
    ],
  },
];

export interface CoverItem {
  readonly k: string;
  readonly v: number;
}

// Source: PrepAssist.html L5180-L5182 (COVER)
export const COVER: readonly CoverItem[] = [
  { k: 'polity', v: 58 },
  { k: 'history', v: 44 },
  { k: 'geo', v: 51 },
  { k: 'eco', v: 36 },
  { k: 'env', v: 29 },
];

export interface WeekItem {
  readonly d: string;
  readonly h: number;
  readonly today?: number;
}

// Source: PrepAssist.html L5183 (WEEK)
export const WEEK: readonly WeekItem[] = [
  { d: 'M', h: 2.67 },
  { d: 'T', h: 1.83 },
  { d: 'W', h: 3.08 },
  { d: 'T', h: 1.92, today: 1 },
  { d: 'F', h: 0 },
  { d: 'S', h: 0 },
  { d: 'S', h: 0 },
];

export interface RevisionsItem {
  readonly id: string;
  readonly s: string;
  readonly t: string;
  readonly d: string;
}

// Source: PrepAssist.html L5390-L5394 (REVISIONS)
export const REVISIONS: readonly RevisionsItem[] = [
  { id: 'r1', s: 'polity', t: 'Preamble', d: 'Last revised 7 days ago · 3rd review' },
  { id: 'r2', s: 'polity', t: 'DPSP vs Fundamental Rights', d: 'Last revised 3 days ago · 2nd review' },
  {
    id: 'r3',
    s: 'polity',
    t: 'Emergency provisions · Art. 352–360',
    d: 'Last revised 14 days ago · 4th review',
  },
];

export interface ReelsItem {
  readonly id: string;
  readonly s: string;
  readonly k: string;
  readonly t: string;
  readonly d: string;
  readonly slides: readonly (readonly string[])[];
}

// Source: PrepAssist.html L5396-L5421 (REELS)
export const REELS: readonly ReelsItem[] = [
  {
    id: 'r1',
    s: 'polity',
    k: 'Art. 21',
    t: 'Right to Life, in 60 sec',
    d: '0:58',
    slides: [
      [
        'Article 21',
        '“No person shall be deprived of his life or personal liberty except according to procedure established by law.”',
      ],
      [
        'Maneka Gandhi, 1978',
        'The procedure must be fair, just and reasonable — not arbitrary. Arts 14, 19 & 21 form the “golden triangle”.',
      ],
      [
        'Read into Art. 21',
        'Privacy (Puttaswamy, 2017) · clean environment · livelihood · speedy trial · dignity.',
      ],
    ],
  },
  {
    id: 'r2',
    s: 'eco',
    k: 'Repo',
    t: 'Repo vs Reverse Repo',
    d: '0:45',
    slides: [
      ['Repo rate', 'The rate at which RBI lends short-term money to banks against government securities.'],
      [
        'Reverse repo',
        'The rate at which RBI absorbs liquidity from banks. Now sits below the SDF in the LAF corridor.',
      ],
      ['Exam trap', 'Raising repo makes borrowing costlier → tightens liquidity → used to cool inflation.'],
    ],
  },
  {
    id: 'r3',
    s: 'history',
    k: '1857',
    t: 'Why 1857 failed',
    d: '1:02',
    slides: [
      ['Limited spread', 'The south, east and much of Punjab stayed largely unaffected.'],
      ['No unified plan', 'Leaders fought locally; there was no common programme for a future India.'],
      ['Outcome', 'Government of India Act 1858 — power passed from the Company to the Crown.'],
    ],
  },
  {
    id: 'r4',
    s: 'geo',
    k: 'ITCZ',
    t: 'How the monsoon arrives',
    d: '0:52',
    slides: [
      ['ITCZ shifts north', 'In summer the low-pressure belt moves over the Indo-Gangetic plain.'],
      [
        'Pull of moist winds',
        'South-east trades cross the equator, turn right and become the south-west monsoon.',
      ],
      ['Also matters', 'Tibetan heating, Tropical Easterly Jet, El Niño and the IOD.'],
    ],
  },
  {
    id: 'r5',
    s: 'env',
    k: 'Ramsar',
    t: 'Ramsar sites, simply',
    d: '0:40',
    slides: [
      ['What it is', 'The 1971 convention on wetlands of international importance, signed in Ramsar, Iran.'],
      ['Montreux Record', 'A list of Ramsar sites under threat. India has had Keoladeo and Loktak on it.'],
      ['PYQ pattern', 'Questions pair a site with its state — make a map, not a list.'],
    ],
  },
  {
    id: 'r6',
    s: 'ethics',
    k: 'Probity',
    t: 'Probity vs Integrity',
    d: '0:50',
    slides: [
      ['Integrity', 'Consistency between your values, words and actions — a personal quality.'],
      ['Probity', 'Integrity applied to public life: honesty and procedural uprightness in governance.'],
      ['Mains tip', 'Anchor answers with Nolan principles or the 2nd ARC report.'],
    ],
  },
];

// Source: PrepAssist.html L6027 (MEGA)
export const MEGA: string = '<svg viewBox="0 0 16 16" class="mg"><path d="M2 6.5v3h2l5 3V3.5l-5 3H2z" fill="currentColor"/><path d="M11.5 5.5a3.5 3.5 0 0 1 0 5M13 4a5.6 5.6 0 0 1 0 8" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';

export interface AnnValue {
  readonly c: string;
  readonly k: string;
  readonly when: string;
  readonly g: string;
  readonly art: string;
}

/** The keys ANN has in the HTML. */
export type AnnKey =
  | 'plan'
  | 'notice'
  | 'xray'
  | 'live';

// Source: PrepAssist.html L6028-L6033 (ANN)
export const ANN: Readonly<Record<string, AnnValue>> = {
  plan: {
    c: '#1B5A93',
    k: 'Announcement',
    when: 'Today',
    g: 'linear-gradient(135deg,#14304F,#1B5A93)',
    art: '<svg viewBox="0 0 110 110"><rect x="14" y="20" width="82" height="76" rx="10" fill="#fff" opacity=".95"/><rect x="14" y="20" width="82" height="20" rx="10" fill="#F5A01F"/><rect x="14" y="32" width="82" height="8" fill="#F5A01F"/><circle cx="34" cy="20" r="4" fill="#14304F"/><circle cx="76" cy="20" r="4" fill="#14304F"/><rect x="22" y="48" width="12" height="9" rx="2" fill="#1B8AD3"/><rect x="40" y="48" width="12" height="9" rx="2" fill="#1B8AD3"/><rect x="58" y="48" width="12" height="9" rx="2" fill="#1B8AD3"/><rect x="76" y="48" width="12" height="9" rx="2" fill="#1B8AD3"/><rect x="22" y="63" width="12" height="9" rx="2" fill="#1B8AD3"/><rect x="40" y="63" width="12" height="9" rx="2" fill="#1B8AD3"/><rect x="58" y="63" width="12" height="9" rx="2" fill="#1B8AD3"/><rect x="76" y="63" width="12" height="9" rx="2" fill="#DCE7F3"/><rect x="22" y="78" width="12" height="9" rx="2" fill="#DCE7F3"/><rect x="40" y="78" width="12" height="9" rx="2" fill="#DCE7F3"/><rect x="58" y="78" width="12" height="9" rx="2" fill="#DCE7F3"/><rect x="76" y="78" width="12" height="9" rx="2" fill="#DCE7F3"/><text x="55" y="35" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="sans-serif">90 DAYS</text></svg>',
  },
  notice: {
    c: '#D97F06',
    k: 'UPSC Notice',
    when: '2 h ago',
    g: 'linear-gradient(135deg,#C35F00,#F5A01F)',
    art: '<svg viewBox="0 0 110 110"><rect x="22" y="10" width="66" height="88" rx="6" fill="#fff" transform="rotate(5 55 55)"/><g transform="rotate(5 55 55)"><rect x="32" y="22" width="46" height="6" rx="2" fill="#14304F"/><rect x="32" y="36" width="46" height="3" rx="1.5" fill="#E6D3B8"/><rect x="32" y="44" width="40" height="3" rx="1.5" fill="#E6D3B8"/><rect x="32" y="52" width="44" height="3" rx="1.5" fill="#E6D3B8"/><rect x="32" y="60" width="30" height="3" rx="1.5" fill="#E6D3B8"/><circle cx="68" cy="80" r="11" fill="none" stroke="#C35F00" stroke-width="2.5"/><circle cx="68" cy="80" r="6" fill="#C35F00" opacity=".25"/></g></svg>',
  },
  xray: {
    c: '#1B8AD3',
    k: 'New feature',
    when: 'This week',
    g: 'linear-gradient(135deg,#0F6FB0,#2BA3EA)',
    art: '<svg viewBox="0 0 110 110"><rect x="16" y="14" width="60" height="80" rx="6" fill="#fff"/><rect x="25" y="26" width="42" height="3.5" rx="1.7" fill="#CFDDEB"/><rect x="25" y="36" width="42" height="7" rx="2" fill="#FFE08A"/><rect x="25" y="50" width="36" height="3.5" rx="1.7" fill="#CFDDEB"/><rect x="25" y="60" width="42" height="7" rx="2" fill="#FFE08A"/><rect x="25" y="74" width="30" height="3.5" rx="1.7" fill="#CFDDEB"/><circle cx="74" cy="66" r="18" fill="rgba(255,255,255,.25)" stroke="#fff" stroke-width="5"/><path d="M87 79l12 12" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>',
  },
  live: {
    c: '#6C5DD3',
    k: 'Live event',
    when: 'Sat · 6 PM',
    g: 'linear-gradient(135deg,#3B2F8F,#6C5DD3)',
    art: '<svg viewBox="0 0 110 110"><rect x="10" y="22" width="90" height="62" rx="10" fill="#fff"/><rect x="18" y="30" width="74" height="46" rx="6" fill="#E9E6FB"/><circle cx="55" cy="47" r="10" fill="#B8AEF0"/><path d="M38 76c2-12 32-12 34 0" fill="#B8AEF0"/><rect x="18" y="30" width="26" height="12" rx="6" fill="#E5484D"/><circle cx="25" cy="36" r="2.4" fill="#fff"/><text x="36" y="39.5" text-anchor="middle" font-size="7.5" font-weight="800" fill="#fff" font-family="sans-serif">LIVE</text><rect x="40" y="90" width="30" height="5" rx="2.5" fill="#fff" opacity=".7"/></svg>',
  },
};

export interface AnnIc {
  readonly plan: string;
  readonly notice: string;
  readonly xray: string;
  readonly live: string;
}

// Source: PrepAssist.html L6034 (ANN_IC)
export const ANN_IC: AnnIc = { plan: 'target', notice: 'calendar', xray: 'xray', live: 'lecture' };

export interface DayplanItem {
  readonly h: number;
  readonly l: string;
}

// Source: PrepAssist.html L6399 (DAYPLAN)
export const DAYPLAN: readonly DayplanItem[] = [
  { h: 7, l: 'Paper' },
  { h: 10, l: 'Lecture' },
  { h: 14.5, l: 'PYQs' },
  { h: 18, l: 'Current' },
  { h: 21, l: 'Revise' },
];

// Source: PrepAssist.html L6416-L6428 (SKYLINE)
export const SKYLINE: string = '<svg viewBox="0 0 390 96" preserveAspectRatio="xMidYMax slice">\n  <path class="sk-b" d="M0 70 Q12 58 24 66 Q34 54 46 64 Q60 50 74 62 Q88 52 100 62 L112 60 Q124 48 138 60 Q150 52 162 62 Q176 54 188 62 L360 62 Q370 50 380 58 Q386 54 390 58 V96 H0Z"/>\n  <g class="sk-f">\n    <path fill-rule="evenodd" d="M54 34 H96 V84 H54Z M67 84 V56 A8 8 0 0 1 83 56 V84Z"/>\n    <rect x="50" y="28" width="50" height="7"/><rect x="58" y="19" width="34" height="9"/><path d="M66 19 Q75 10 84 19Z"/>\n    <rect x="186" y="66" width="170" height="20"/><rect x="198" y="58" width="146" height="9"/>\n    <rect x="246" y="50" width="50" height="9"/><rect x="252" y="40" width="38" height="11"/>\n    <path d="M250 41 A21 21 0 0 1 292 41Z"/><rect x="270" y="11" width="2" height="10"/><circle cx="271" cy="21" r="2.5"/>\n    <path d="M272 11 L282 14 L272 17Z" class="sk-flag"/>\n    <rect x="0" y="84" width="390" height="12"/>\n  </g>\n  <g class="sk-w"><rect x="204" y="70" width="3" height="11"/><rect x="215" y="70" width="3" height="11"/><rect x="226" y="70" width="3" height="11"/><rect x="237" y="70" width="3" height="11"/><rect x="248" y="70" width="3" height="11"/><rect x="259" y="70" width="3" height="11"/><rect x="270" y="70" width="3" height="11"/><rect x="281" y="70" width="3" height="11"/><rect x="292" y="70" width="3" height="11"/><rect x="303" y="70" width="3" height="11"/><rect x="314" y="70" width="3" height="11"/><rect x="325" y="70" width="3" height="11"/><rect x="336" y="70" width="3" height="11"/><rect x="254" y="51" width="2.4" height="7"/><rect x="262" y="51" width="2.4" height="7"/><rect x="270" y="51" width="2.4" height="7"/><rect x="278" y="51" width="2.4" height="7"/><rect x="286" y="51" width="2.4" height="7"/></g>\n</svg>';
