// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Practice tab: quiz, mains questions, answer bank, past evaluations, tests, question banks, model answer.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface QuizItem {
  readonly topic: string;
  readonly sub: string;
  readonly pyq: string;
  readonly q: string;
  readonly st: readonly string[];
  readonly ask: string;
  readonly o: readonly string[];
  readonly a: number;
  readonly ex: string;
  readonly path: readonly string[];
}

// Source: PrepAssist.html L5295-L5362 (QUIZ)
export const QUIZ: readonly QuizItem[] = [
  {
    topic: 'Constitutional Remedies',
    sub: 'Article 32',
    pyq: 'UPSC pattern',
    q: 'Consider the following statements regarding the right to constitutional remedies:',
    st: [
      'The enforcement of this right can be suspended during a National Emergency by a Presidential order under Article 359.',
      'The right to move the Supreme Court under Article 32 is itself a Fundamental Right.',
      'The writ jurisdiction of High Courts under Article 226 is narrower than that of the Supreme Court under Article 32.',
    ],
    ask: 'Which of the statements given above are correct?',
    o: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
    a: 1,
    ex: 'Statements 1 and 2 are correct. Under Article 359, the President can suspend the right to move courts for enforcement of Fundamental Rights during a National Emergency (except Articles 20 and 21, after the 44th Amendment). Statement 3 is wrong: Article 226 is wider — High Courts can issue writs for Fundamental Rights and “for any other purpose”, whereas Article 32 is limited to Fundamental Rights.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 32'],
  },
  {
    topic: 'Writs',
    sub: 'Quo Warranto',
    pyq: 'UPSC pattern',
    q: 'With reference to the writ of Quo Warranto, consider the following statements:',
    st: [
      'It can be sought by any interested person, not necessarily the aggrieved person.',
      'It can be issued in respect of a ministerial office or a private office.',
      'The office in question must be a substantive public office created by a statute or the Constitution.',
    ],
    ask: 'Which of the statements given above are correct?',
    o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    a: 2,
    ex: 'Quo Warranto (“by what authority”) inquires into the legality of a person’s claim to a public office. Any interested person can seek it. It cannot be issued for a ministerial office or a private office — so statement 2 is wrong.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Writs'],
  },
  {
    topic: 'Writs',
    sub: 'Mandamus',
    pyq: 'PYQ 2017 theme',
    q: 'The writ of Mandamus cannot be issued against which of the following?',
    st: [
      'The President of India or a State Governor',
      'A private individual or body',
      'The Chief Justice of a High Court acting in a judicial capacity',
    ],
    ask: 'Select the correct answer using the code given below:',
    o: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
    a: 3,
    ex: 'Mandamus (“we command”) directs a public official or body to perform a public duty. It does not lie against a private individual or body, the President or Governors, or a Chief Justice acting judicially.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Writs'],
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Right to Property',
    pyq: 'PYQ classic',
    q: 'The Right to Property was removed from the list of Fundamental Rights by which Constitutional Amendment Act?',
    st: [],
    ask: '',
    o: [
      '42nd Amendment Act, 1976',
      '44th Amendment Act, 1978',
      '52nd Amendment Act, 1985',
      '61st Amendment Act, 1989',
    ],
    a: 1,
    ex: 'The 44th Amendment Act, 1978 deleted Article 19(1)(f) and Article 31 and made property a legal right under Article 300A in Part XII.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Amendments'],
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Article 21A',
    pyq: 'UPSC pattern',
    q: 'Consider the following statements about Article 21A:',
    st: [
      'It was inserted by the 86th Constitutional Amendment Act, 2002.',
      'It provides free and compulsory education to all children aged 3 to 14 years.',
    ],
    ask: 'Which of the statements given above is/are correct?',
    o: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    a: 0,
    ex: 'Article 21A was inserted by the 86th Amendment Act, 2002 and covers children aged 6 to 14 years — not 3 to 14. Early childhood care for children below six is addressed under Article 45 (DPSP).',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 21A'],
  },
  {
    topic: 'Judiciary',
    sub: 'Basic Structure',
    pyq: 'PYQ classic',
    q: 'The doctrine of the “basic structure” of the Constitution was first propounded in which case?',
    st: [],
    ask: '',
    o: [
      'Golaknath v. State of Punjab (1967)',
      'Kesavananda Bharati v. State of Kerala (1973)',
      'Indira Gandhi v. Raj Narain (1975)',
      'Minerva Mills v. Union of India (1980)',
    ],
    a: 1,
    ex: 'A 13-judge Bench in Kesavananda Bharati (1973) held that Parliament can amend any part of the Constitution but cannot alter its basic structure.',
    path: ['GS II', 'Indian Constitution', 'Amendment', 'Basic Structure'],
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Article 17',
    pyq: 'UPSC pattern',
    q: 'With reference to Article 17 of the Constitution, consider the following statements:',
    st: [
      'The term “untouchability” is defined in the Constitution.',
      'The right under Article 17 is available against private individuals as well.',
    ],
    ask: 'Which of the statements given above is/are correct?',
    o: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    a: 1,
    ex: 'Neither the Constitution nor the Protection of Civil Rights Act, 1955 defines “untouchability”. Article 17 is enforceable against private individuals too, and the State is obliged to protect this right.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 17'],
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Citizens only',
    pyq: 'PYQ 2019 theme',
    q: 'Which of the following Fundamental Rights are available only to citizens of India?',
    st: ['Article 15', 'Article 19', 'Article 21', 'Article 29'],
    ask: 'Select the correct answer using the code given below:',
    o: ['1 and 2 only', '1, 2 and 4 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
    a: 1,
    ex: 'Articles 15, 16, 19, 29 and 30 are available only to citizens. Article 21 (life and personal liberty) is available to all persons, including foreigners.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Citizens vs persons'],
  },
  {
    topic: 'Writs',
    sub: 'Habeas Corpus',
    pyq: 'UPSC pattern',
    q: 'The writ of Habeas Corpus can be issued against:',
    st: [],
    ask: '',
    o: [
      'Only public authorities',
      'Only private individuals',
      'Both public authorities and private individuals',
      'Neither — it applies only to courts',
    ],
    a: 2,
    ex: 'Habeas Corpus (“to have the body”) can be issued against both public authorities and private individuals who unlawfully detain a person.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Writs'],
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Right to Privacy',
    pyq: 'PYQ 2017 theme',
    q: 'The Right to Privacy was declared a Fundamental Right by a nine-judge Bench of the Supreme Court in:',
    st: [],
    ask: '',
    o: [
      'Maneka Gandhi v. Union of India (1978)',
      'Justice K.S. Puttaswamy v. Union of India (2017)',
      'Navtej Singh Johar v. Union of India (2018)',
      'Shreya Singhal v. Union of India (2015)',
    ],
    a: 1,
    ex: 'In Puttaswamy (2017), the Court held privacy to be intrinsic to life and liberty under Article 21 and the freedoms in Part III.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 21'],
  },
];

export interface MainsqItem {
  readonly id: string;
  readonly p: string;
  readonly m: number;
  readonly w: number;
  readonly t: string;
  readonly code: string;
}

// Source: PrepAssist.html L5364-L5368 (MAINSQ)
//   Its objects are the same objects as in ANSWERBANK, so it also carries what the scripts add there (differs from its own literal at 3 place(s)).
export const MAINSQ: readonly MainsqItem[] = [
  {
    id: 'mq1',
    p: 'GS II',
    m: 15,
    w: 250,
    t: '“Article 32 is the very soul of the Constitution.” Discuss how judicial interpretation has expanded the scope of the right to constitutional remedies.',
    code: 'MQ1X7Q',
  },
  {
    id: 'mq2',
    p: 'GS III',
    m: 10,
    w: 150,
    t: 'What instruments does the RBI use to control inflation? Evaluate their effectiveness in the present context.',
    code: 'MQ2X7Q',
  },
  {
    id: 'mq3',
    p: 'GS I',
    m: 15,
    w: 250,
    t: 'Discuss the role of the Moderates in shaping the early phase of the Indian national movement.',
    code: 'MQ3X7Q',
  },
];

export interface AnswerbankItem {
  readonly id: string;
  readonly p: string;
  readonly m: number;
  readonly w: number;
  readonly t: string;
  readonly hi?: string;
  readonly fw?: readonly (readonly string[])[];
  readonly code: string;
}

// Source: PrepAssist.html L5369-L5374 (ANSWERBANK)
//   Changed after its declaration at L7778-L7785 (.unshift()), L7786 (.forEach()); this is the final value once every script has run.
export const ANSWERBANK: readonly AnswerbankItem[] = [
  {
    id: 'ey26ti',
    p: 'GS II',
    m: 15,
    w: 250,
    t: 'Analyse the changing contours of minilateralism and strategic partnerships in the Indo-Pacific and West Asian architecture, with specific focus on plurilateral groupings like India–US–UAE cooperation.',
    hi: 'हिंद-प्रशांत और पश्चिम एशियाई संरचना में लघुपक्षवाद (मिनीलेटरलिज़्म) और रणनीतिक साझेदारियों की बदलती रूपरेखा का विश्लेषण कीजिए, विशेषकर भारत–अमेरिका–यूएई जैसे बहुपक्षीय समूहों के संदर्भ में।',
    fw: [
      [
        'Introduction',
        'Contemporary geopolitics is increasingly shaped by minilateral frameworks that go beyond traditional alliances and focus on functional cooperation in trade, technology and energy security. The India–US–UAE engagement — alongside I2U2 with Israel — exemplifies this shift.',
      ],
      [
        'Strategic convergence',
        '<b>Energy & economic complementarity:</b> India’s refining capacity and market scale, the UAE’s energy reserves and capital, and US technology and finance create robust economic corridors.<br><b>Connectivity:</b> the India–Middle East–Europe Economic Corridor (IMEC) links the Indo-Pacific with West Asia.<br><b>Food & clean energy:</b> I2U2 projects on food parks and renewables.',
      ],
      [
        'Why minilaterals are rising',
        'Gridlock in large multilateral forums; issue-based coalitions deliver faster; they let India pursue strategic autonomy without formal alliance commitments.',
      ],
      [
        'Challenges',
        'Volatility in West Asia; diverging priorities among partners; overlapping groupings that dilute focus; gaps between announcements and implementation.',
      ],
      [
        'Way forward',
        'Institutionalise working groups, prioritise concrete deliverables (green hydrogen, digital payments, food corridors) and keep minilaterals complementary to multilateralism — in line with India’s multi-alignment.',
      ],
    ],
    code: 'EY26TI',
  },
  {
    id: 'mq1',
    p: 'GS II',
    m: 15,
    w: 250,
    t: '“Article 32 is the very soul of the Constitution.” Discuss how judicial interpretation has expanded the scope of the right to constitutional remedies.',
    code: 'MQ1X7Q',
  },
  {
    id: 'mq2',
    p: 'GS III',
    m: 10,
    w: 150,
    t: 'What instruments does the RBI use to control inflation? Evaluate their effectiveness in the present context.',
    code: 'MQ2X7Q',
  },
  {
    id: 'mq3',
    p: 'GS I',
    m: 15,
    w: 250,
    t: 'Discuss the role of the Moderates in shaping the early phase of the Indian national movement.',
    code: 'MQ3X7Q',
  },
  {
    id: 'mq4',
    p: 'GS II',
    m: 15,
    w: 250,
    t: 'Cooperative federalism has evolved into “competitive federalism”. Examine with reference to the GST Council.',
    code: 'MQ4X7Q',
  },
  {
    id: 'mq5',
    p: 'GS III',
    m: 10,
    w: 150,
    t: 'Why are wetlands described as the “kidneys of the landscape”? Discuss threats to Indian wetlands.',
    code: 'MQ5X7Q',
  },
  {
    id: 'mq6',
    p: 'GS IV',
    m: 20,
    w: 250,
    t: 'Case study: As a District Collector you discover that a close relative has bid for a public tender. What are your options?',
    code: 'MQ6X7Q',
  },
];

export interface AbMetaValue {
  readonly topic: string;
  readonly c: string;
}

/** The keys AB_META has in the HTML. */
export type AbMetaKey =
  | 'ey26ti'
  | 'mq1'
  | 'mq2'
  | 'mq3'
  | 'mq4'
  | 'mq5'
  | 'mq6';

// Source: PrepAssist.html L7769-L7777 (AB_META)
export const AB_META: Readonly<Record<string, AbMetaValue>> = {
  ey26ti: {
    topic: 'International relations — bilateral, regional and global groupings involving India',
    c: '#6C5DD3',
  },
  mq1: { topic: 'Polity — Fundamental Rights and judicial review', c: '#1667B0' },
  mq2: { topic: 'Economy — monetary policy and inflation', c: '#3B5BCC' },
  mq3: { topic: 'Modern history — the freedom struggle', c: '#E8890C' },
  mq4: { topic: 'Polity — federalism and the GST Council', c: '#1667B0' },
  mq5: { topic: 'Environment — conservation and wetlands', c: '#3E9A55' },
  mq6: { topic: 'Ethics — case studies and conflict of interest', c: '#C8622B' },
};

export interface PastevalsItem {
  readonly t: string;
  readonly p: string;
  readonly s: string;
  readonly of: number;
  readonly d: string;
}

// Source: PrepAssist.html L5375-L5380 (PASTEVALS)
export const PASTEVALS: readonly PastevalsItem[] = [
  { t: 'Article 32 — soul of the Constitution', p: 'GS II', s: '8.5', of: 15, d: '18 Oct' },
  { t: 'Cooperative federalism & the GST Council', p: 'GS II', s: '9', of: 15, d: '12 Oct' },
  { t: 'Monsoon variability and agriculture', p: 'GS I', s: '7', of: 15, d: '5 Oct' },
  { t: 'Conflict of interest — case study', p: 'GS IV', s: '12', of: 20, d: '29 Sep' },
];

export interface TestsItem {
  readonly d: string;
  readonly m: string;
  readonly t: string;
  readonly s: string;
  readonly st: string;
}

// Source: PrepAssist.html L5381-L5385 (TESTS)
export const TESTS: readonly TestsItem[] = [
  {
    d: '22',
    m: 'Oct',
    t: 'Prelims Test 12 · Polity Sectional',
    s: '50 questions · 60 min',
    st: 'Today, 6 PM',
  },
  { d: '25', m: 'Oct', t: 'Full-Length Mock 4 · GS Paper I', s: '100 questions · 120 min', st: 'Sunday' },
  { d: '27', m: 'Oct', t: 'CSAT Test 5', s: '80 questions · 120 min', st: 'Tuesday' },
];

export interface QbItem {
  readonly s: string;
  readonly n: string;
  readonly c: string;
}

// Source: PrepAssist.html L5386-L5389 (QB)
export const QB: readonly QbItem[] = [
  { s: 'polity', n: 'Polity', c: '2,840' },
  { s: 'history', n: 'History', c: '3,120' },
  { s: 'geo', n: 'Geography', c: '2,410' },
  { s: 'eco', n: 'Economy', c: '2,260' },
  { s: 'env', n: 'Environment', c: '1,580' },
  { s: 'snt', n: 'Science & Tech', c: '1,340' },
  { s: 'ir', n: 'Current Affairs', c: '4,100' },
  { s: 'ethics', n: 'CSAT', c: '1,900' },
];

export interface PqbItemHi {
  readonly q: string;
  readonly st: readonly string[];
  readonly ask: string;
  readonly o: readonly string[];
  readonly exs: readonly (readonly [string, string, number])[];
}

export interface PqbItem {
  readonly topic: string;
  readonly sub: string;
  readonly subj: string;
  readonly pyq: string;
  readonly q: string;
  readonly st: readonly string[];
  readonly ask: string;
  readonly o: readonly string[];
  readonly a: number;
  readonly exs?: readonly (readonly [string, string, number])[];
  readonly hi?: PqbItemHi;
  readonly ex?: string;
  readonly path?: readonly string[];
}

// Source: PrepAssist.html L7747-L7756 (PQB)
export const PQB: readonly PqbItem[] = [
  {
    topic: 'Health',
    sub: 'Antimicrobial Resistance',
    subj: 'Science & Tech',
    pyq: 'UPSC pattern',
    q: 'Consider the following statements regarding Antimicrobial Resistance (AMR) and surveillance networks like KARS-Net:',
    st: [
      'AMR is exclusively restricted to intensive care units (ICUs) and tertiary care hospitals in urban centres.',
      'Community-acquired bacteria such as Shigella showing resistance to common antibiotics indicate the spread of AMR beyond hospital settings.',
      'Pathogens such as E. coli and Klebsiella species form a significant percentage of drug-resistant clinical isolates.',
    ],
    ask: 'Which of the statements given above are correct?',
    o: ['1 and 2 only', '1, 2 and 3', '2 and 3 only', '1 and 3 only'],
    a: 2,
    exs: [
      [
        'Statement 1 is incorrect',
        'AMR is a global One Health crisis that occurs everywhere — community settings, livestock and agriculture — not only in ICUs or tertiary hospitals.',
        0,
      ],
      [
        'Statement 2 is correct',
        'Resistance in community-acquired pathogens such as Shigella shows that resistant genes have escaped hospital boundaries into the wider community.',
        1,
      ],
      [
        'Statement 3 is correct',
        'Gram-negative pathogens like E. coli and Klebsiella pneumoniae account for a large share of drug-resistant clinical isolates, in India and worldwide.',
        1,
      ],
    ],
    hi: {
      q: 'रोगाणुरोधी प्रतिरोध (AMR) और KARS-Net जैसे निगरानी नेटवर्क के संबंध में निम्नलिखित कथनों पर विचार कीजिए:',
      st: [
        'AMR केवल शहरी केंद्रों की गहन चिकित्सा इकाइयों (ICU) और तृतीयक देखभाल अस्पतालों तक सीमित है।',
        'शिगेला जैसे समुदाय-अर्जित जीवाणुओं में सामान्य एंटीबायोटिक के प्रति प्रतिरोध, अस्पतालों से बाहर AMR के प्रसार का संकेत है।',
        'ई. कोलाई और क्लेबसिएला जैसे रोगजनक दवा-प्रतिरोधी नैदानिक नमूनों का बड़ा हिस्सा बनाते हैं।',
      ],
      ask: 'उपर्युक्त कथनों में से कौन-से सही हैं?',
      o: ['केवल 1 और 2', '1, 2 और 3', 'केवल 2 और 3', 'केवल 1 और 3'],
      exs: [
        [
          'कथन 1 गलत है',
          'AMR एक वैश्विक “वन हेल्थ” संकट है जो समुदाय, पशुधन और कृषि सहित हर जगह पाया जाता है।',
          0,
        ],
        [
          'कथन 2 सही है',
          'समुदाय-अर्जित रोगजनकों में प्रतिरोध दिखाता है कि प्रतिरोधी जीन अस्पतालों से बाहर फैल चुके हैं।',
          1,
        ],
        [
          'कथन 3 सही है',
          'ई. कोलाई और क्लेबसिएला न्यूमोनिया दवा-प्रतिरोधी नैदानिक नमूनों का बड़ा हिस्सा हैं।',
          1,
        ],
      ],
    },
  },
  {
    topic: 'Constitutional Remedies',
    sub: 'Article 32',
    pyq: 'UPSC pattern',
    q: 'Consider the following statements regarding the right to constitutional remedies:',
    st: [
      'The enforcement of this right can be suspended during a National Emergency by a Presidential order under Article 359.',
      'The right to move the Supreme Court under Article 32 is itself a Fundamental Right.',
      'The writ jurisdiction of High Courts under Article 226 is narrower than that of the Supreme Court under Article 32.',
    ],
    ask: 'Which of the statements given above are correct?',
    o: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
    a: 1,
    ex: 'Statements 1 and 2 are correct. Under Article 359, the President can suspend the right to move courts for enforcement of Fundamental Rights during a National Emergency (except Articles 20 and 21, after the 44th Amendment). Statement 3 is wrong: Article 226 is wider — High Courts can issue writs for Fundamental Rights and “for any other purpose”, whereas Article 32 is limited to Fundamental Rights.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 32'],
    subj: 'Polity',
  },
  {
    topic: 'Writs',
    sub: 'Quo Warranto',
    pyq: 'UPSC pattern',
    q: 'With reference to the writ of Quo Warranto, consider the following statements:',
    st: [
      'It can be sought by any interested person, not necessarily the aggrieved person.',
      'It can be issued in respect of a ministerial office or a private office.',
      'The office in question must be a substantive public office created by a statute or the Constitution.',
    ],
    ask: 'Which of the statements given above are correct?',
    o: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
    a: 2,
    ex: 'Quo Warranto (“by what authority”) inquires into the legality of a person’s claim to a public office. Any interested person can seek it. It cannot be issued for a ministerial office or a private office — so statement 2 is wrong.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Writs'],
    subj: 'Polity',
  },
  {
    topic: 'Writs',
    sub: 'Mandamus',
    pyq: 'PYQ 2017 theme',
    q: 'The writ of Mandamus cannot be issued against which of the following?',
    st: [
      'The President of India or a State Governor',
      'A private individual or body',
      'The Chief Justice of a High Court acting in a judicial capacity',
    ],
    ask: 'Select the correct answer using the code given below:',
    o: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
    a: 3,
    ex: 'Mandamus (“we command”) directs a public official or body to perform a public duty. It does not lie against a private individual or body, the President or Governors, or a Chief Justice acting judicially.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Writs'],
    subj: 'Polity',
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Right to Property',
    pyq: 'PYQ classic',
    q: 'The Right to Property was removed from the list of Fundamental Rights by which Constitutional Amendment Act?',
    st: [],
    ask: '',
    o: [
      '42nd Amendment Act, 1976',
      '44th Amendment Act, 1978',
      '52nd Amendment Act, 1985',
      '61st Amendment Act, 1989',
    ],
    a: 1,
    ex: 'The 44th Amendment Act, 1978 deleted Article 19(1)(f) and Article 31 and made property a legal right under Article 300A in Part XII.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Amendments'],
    subj: 'Polity',
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Article 21A',
    pyq: 'UPSC pattern',
    q: 'Consider the following statements about Article 21A:',
    st: [
      'It was inserted by the 86th Constitutional Amendment Act, 2002.',
      'It provides free and compulsory education to all children aged 3 to 14 years.',
    ],
    ask: 'Which of the statements given above is/are correct?',
    o: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    a: 0,
    ex: 'Article 21A was inserted by the 86th Amendment Act, 2002 and covers children aged 6 to 14 years — not 3 to 14. Early childhood care for children below six is addressed under Article 45 (DPSP).',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 21A'],
    subj: 'Polity',
  },
  {
    topic: 'Judiciary',
    sub: 'Basic Structure',
    pyq: 'PYQ classic',
    q: 'The doctrine of the “basic structure” of the Constitution was first propounded in which case?',
    st: [],
    ask: '',
    o: [
      'Golaknath v. State of Punjab (1967)',
      'Kesavananda Bharati v. State of Kerala (1973)',
      'Indira Gandhi v. Raj Narain (1975)',
      'Minerva Mills v. Union of India (1980)',
    ],
    a: 1,
    ex: 'A 13-judge Bench in Kesavananda Bharati (1973) held that Parliament can amend any part of the Constitution but cannot alter its basic structure.',
    path: ['GS II', 'Indian Constitution', 'Amendment', 'Basic Structure'],
    subj: 'Polity',
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Article 17',
    pyq: 'UPSC pattern',
    q: 'With reference to Article 17 of the Constitution, consider the following statements:',
    st: [
      'The term “untouchability” is defined in the Constitution.',
      'The right under Article 17 is available against private individuals as well.',
    ],
    ask: 'Which of the statements given above is/are correct?',
    o: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
    a: 1,
    ex: 'Neither the Constitution nor the Protection of Civil Rights Act, 1955 defines “untouchability”. Article 17 is enforceable against private individuals too, and the State is obliged to protect this right.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 17'],
    subj: 'Polity',
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Citizens only',
    pyq: 'PYQ 2019 theme',
    q: 'Which of the following Fundamental Rights are available only to citizens of India?',
    st: ['Article 15', 'Article 19', 'Article 21', 'Article 29'],
    ask: 'Select the correct answer using the code given below:',
    o: ['1 and 2 only', '1, 2 and 4 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
    a: 1,
    ex: 'Articles 15, 16, 19, 29 and 30 are available only to citizens. Article 21 (life and personal liberty) is available to all persons, including foreigners.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Citizens vs persons'],
    subj: 'Polity',
  },
  {
    topic: 'Writs',
    sub: 'Habeas Corpus',
    pyq: 'UPSC pattern',
    q: 'The writ of Habeas Corpus can be issued against:',
    st: [],
    ask: '',
    o: [
      'Only public authorities',
      'Only private individuals',
      'Both public authorities and private individuals',
      'Neither — it applies only to courts',
    ],
    a: 2,
    ex: 'Habeas Corpus (“to have the body”) can be issued against both public authorities and private individuals who unlawfully detain a person.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Writs'],
    subj: 'Polity',
  },
  {
    topic: 'Fundamental Rights',
    sub: 'Right to Privacy',
    pyq: 'PYQ 2017 theme',
    q: 'The Right to Privacy was declared a Fundamental Right by a nine-judge Bench of the Supreme Court in:',
    st: [],
    ask: '',
    o: [
      'Maneka Gandhi v. Union of India (1978)',
      'Justice K.S. Puttaswamy v. Union of India (2017)',
      'Navtej Singh Johar v. Union of India (2018)',
      'Shreya Singhal v. Union of India (2015)',
    ],
    a: 1,
    ex: 'In Puttaswamy (2017), the Court held privacy to be intrinsic to life and liberty under Article 21 and the freedoms in Part III.',
    path: ['GS II', 'Indian Constitution', 'Fundamental Rights', 'Art. 21'],
    subj: 'Polity',
  },
];

// Source: PrepAssist.html L6694-L6701 (MODEL)
export const MODEL: string = '<p><b>Introduction.</b> Article 32 guarantees the right to move the Supreme Court for the enforcement of Fundamental Rights. Dr B.R. Ambedkar called it the “very soul of the Constitution and the very heart of it”, because rights without remedies are hollow promises.</p>\n<p><b>How interpretation expanded its scope.</b></p>\n<p>1. <i>Liberalised locus standi and PIL</i> — in S.P. Gupta (1981) the Court allowed public-spirited persons to approach it on behalf of those unable to do so; even letters were treated as writ petitions (Sunil Batra, 1980).</p>\n<p>2. <i>New remedies</i> — compensation for violation of Article 21 was recognised in Rudul Sah (1983) and Nilabati Behera (1993); “continuing mandamus” let the Court supervise investigations (Vineet Narain, 1997).</p>\n<p>3. <i>Expanding the rights it protects</i> — after Maneka Gandhi (1978) required procedure to be just, fair and reasonable, Article 21 grew to include privacy (Puttaswamy, 2017), a clean environment (M.C. Mehta) and speedy trial — all enforceable through Article 32.</p>\n<p>4. <i>Protected as basic structure</i> — L. Chandra Kumar (1997) held judicial review under Articles 32 and 226 to be part of the basic structure.</p>\n<p><b>Concerns.</b> Docket pressure, uneven access, and the risk of judicial overreach; the Court has at times asked petitioners to first approach High Courts under Article 226.</p>\n<p><b>Conclusion.</b> Article 32 has grown from a procedural guarantee into a dynamic instrument of constitutional justice. Strengthening High Courts and tribunals while preserving direct access will keep its promise meaningful.</p>';
