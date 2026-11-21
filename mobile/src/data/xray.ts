// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// X-Ray reader. XSC / X4SUB / TABS / NCOL / RIC are the final v4 reader; XR, XRB_META, XRP and XR_LAB belong to the earlier readers (v1, v2) that v4 replaces at runtime.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface XscItemInsItemMcq {
  readonly q: string;
  readonly st: readonly string[];
  readonly o: readonly string[];
  readonly a: number;
  readonly ex: string;
}

export interface XscItemInsItem {
  readonly ctx: string;
  readonly pts: readonly string[];
  readonly st: string;
  readonly links: readonly string[];
  readonly mcq: XscItemInsItemMcq;
  readonly ca: readonly (readonly string[])[];
  readonly refs: readonly (readonly string[])[];
}

export interface XscItem {
  readonly id: string;
  readonly s: string;
  readonly t: string;
  readonly src: string;
  readonly d: string;
  readonly min: number;
  readonly by?: readonly string[];
  readonly paras: readonly string[];
  readonly terms: Readonly<Record<string, readonly string[]>>;
  readonly ins: readonly XscItemInsItem[];
}

// Source: PrepAssist.html L9732-L9852 (XSC)
//   Assigned as window.XSC inside the IIFE of <script id="xray4js">.
//   Handlers change it while the app runs (L10032 .unshift()): treat it as the seed of app state, not as a fixed table.
export const XSC: readonly XscItem[] = [
  {
    id: 'arb',
    s: 'polity',
    t: 'Using trade treaty policy to strengthen arbitration',
    src: 'The Hindu · Opinion',
    d: '25 Sep 2026',
    min: 5,
    by: ['Arun Chawla', 'Director General, Indian Council of Arbitration'],
    paras: [
      '[[0|India’s long-standing negotiations to sign new bilateral investment treaties ({{BITs}}) and free trade agreements ({{FTAs}}) with its prominent economic partners are bearing fruit.]] It has signed BITs with the United Arab Emirates (2024), Israel (2025) and Uzbekistan (2024), and FTAs with New Zealand (April 2026), the United Kingdom (July 2025), the European Free Trade Association (March 2024) and Oman (December 2025).',
      'While much of the conversation has understandably focused on the economic benefits of these agreements — attracting capital and opening export markets — properly designed, they can help India strengthen something every international business needs: [[1|a dispute-resolution system that is predictable, enforceable and trusted.]]',
      'India already has the basic statutory architecture. [[2|The {{Arbitration and Conciliation Act, 1996}} covers domestic arbitration, international commercial arbitration and the enforcement of foreign arbitral awards.]] The question now is how India’s treaty policy can reinforce that architecture. The answers vary.',
      'In the first instance, [[3|India’s recent FTAs have generally omitted an investor-state dispute settlement ({{ISDS}}) mechanism.]] Given that a sizeable share of investment in India is made through contracts between foreign investors and Indian state agencies, future FTAs could better explain the rationale for this policy.',
      'India’s expanding treaty network can help build a stronger arbitration ecosystem — one where {{institutional arbitration}} becomes the default rather than the exception.',
    ],
    terms: {
      BITs: [
        'Bilateral Investment Treaties',
        'Agreements between two countries that protect investments made by investors of one country in the other — covering fair treatment, protection from expropriation and dispute settlement.',
        'India issued a new Model BIT in 2016 and terminated most of its older BITs from 2017.',
      ],
      FTAs: [
        'Free Trade Agreements',
        'Pacts between two or more countries to reduce barriers to imports and exports among them, such as tariffs and quotas.',
        'Recent Indian FTAs are often named CEPAs or TEPAs — e.g. the India–EFTA TEPA (2024).',
      ],
      'Arbitration and Conciliation Act, 1996': [
        'Central law on arbitration',
        'Consolidates the law on domestic arbitration, international commercial arbitration and the enforcement of foreign arbitral awards. It is based on the UNCITRAL Model Law, 1985.',
        'Amended in 2015, 2019 and 2021; the 2019 amendment provided for an Arbitration Council of India.',
      ],
      ISDS: [
        'Investor–State Dispute Settlement',
        'A mechanism that lets a foreign investor bring a claim directly against the host state before an international arbitral tribunal.',
        'India’s 2016 Model BIT requires investors to first pursue local remedies for five years.',
      ],
      'institutional arbitration': [
        'Arbitration run by an institution',
        'Arbitration administered by a permanent body with its own rules, panels and fee schedules — as opposed to ad hoc arbitration managed by the parties themselves.',
        'The India International Arbitration Centre (IIAC) is India’s flagship arbitral institution.',
      ],
    },
    ins: [
      {
        ctx: 'The statement highlights India’s proactive economic diplomacy through new Bilateral Investment Treaties and Free Trade Agreements. The strategy aims to attract foreign capital, widen market access for exports and integrate India further into the global economy. Beyond immediate economic gains, these agreements are increasingly seen as tools to strengthen India’s commercial arbitration framework — improving ease of doing business and investor confidence.',
        pts: [
          'Treaties now cover services, investment and intellectual property — not just goods.',
          'They aim to attract capital and open export markets.',
          'They are increasingly seen as levers for credible dispute resolution.',
        ],
        st: 'India’s approach to BITs changed significantly after the 2016 Model BIT, which balanced investor protection with the state’s right to regulate, following several investor-state dispute cases. Treaty-making is an executive function of the Union (Article 73), and Parliament can legislate to implement treaties under Article 253.',
        links: ['Model BIT, 2016', 'Art. 73 — Union executive power', 'Art. 253 — implementing treaties'],
        mcq: {
          q: 'Which of the following statements regarding India’s recent trade and investment agreements is/are correct?',
          st: [
            'India has signed a Bilateral Investment Treaty (BIT) with Israel in 2025.',
            'India has signed a Free Trade Agreement with the United Kingdom in July 2025.',
            'The India–EFTA trade agreement was signed in March 2024.',
          ],
          o: ['1 only', '2 and 3 only', '1, 2 and 3', '1 and 3 only'],
          a: 2,
          ex: 'As per the article, India signed a BIT with Israel (2025), an FTA with the United Kingdom (July 2025) and the agreement with the European Free Trade Association (March 2024). All three statements are correct.',
        },
        ca: [
          [
            'Feb 2024',
            'PIB',
            'India and the UAE sign a Bilateral Investment Treaty, the first under the new treaty approach.',
          ],
          [
            'Mar 2024',
            'Daily News',
            'India–EFTA Trade and Economic Partnership Agreement signed with a $100 billion investment commitment.',
          ],
          [
            'Jul 2025',
            'Editorial',
            'India–UK Comprehensive Economic and Trade Agreement: what it means for services.',
          ],
          ['Dec 2025', 'PIB', 'India–Oman CEPA signed, deepening Gulf economic ties.'],
        ],
        refs: [
          ['Report', 'Economic Survey', 'Ministry of Finance · various issues'],
          ['Report', 'Reports on trade and investment policy', 'NITI Aayog'],
          [
            'Portal',
            'Model Text for the Indian Bilateral Investment Treaty, 2016',
            'Department of Economic Affairs',
          ],
        ],
      },
      {
        ctx: 'A dispute-resolution system that is predictable, enforceable and trusted is the backbone of investor confidence. Slow courts and uncertain enforcement raise the cost of doing business, so treaties that push for credible arbitration directly improve India’s investment climate.',
        pts: [
          'Contract enforcement has long been India’s weakest ease-of-doing-business indicator.',
          'Arbitration offers speed, expertise and confidentiality.',
          'Trust depends on courts limiting interference with awards.',
        ],
        st: 'Article 51(d), a Directive Principle, directs the State to “encourage settlement of international disputes by arbitration”. Read with Article 253, it gives a constitutional basis for a pro-arbitration treaty framework — though Directive Principles are not enforceable in courts (Article 37).',
        links: ['Art. 51(d) — DPSP', 'Art. 37 — non-justiciability', 'Art. 253'],
        mcq: {
          q: 'Consider the following statements about Article 51 of the Constitution of India:',
          st: [
            'It is a part of the Directive Principles of State Policy.',
            'It directs the State to encourage settlement of international disputes by arbitration.',
            'A citizen can move the Supreme Court to enforce it.',
          ],
          o: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
          a: 1,
          ex: 'Article 51 is in Part IV (DPSP) and clause (d) mentions arbitration. Directive Principles are not enforceable by any court under Article 37, so statement 3 is wrong.',
        },
        ca: [
          [
            '2022',
            'Daily News',
            'New Delhi International Arbitration Centre renamed the India International Arbitration Centre (IIAC).',
          ],
          [
            'Oct 2024',
            'PIB',
            'Draft Arbitration and Conciliation (Amendment) Bill, 2024 released for public consultation.',
          ],
          [
            'Nov 2024',
            'Editorial',
            'Constitution Bench: one party cannot unilaterally appoint the sole arbitrator in public-private contracts.',
          ],
        ],
        refs: [
          [
            'Report',
            'Law Commission of India — 246th Report (2014)',
            'Amendments to the Arbitration and Conciliation Act',
          ],
          [
            'Report',
            'High-Level Committee on Institutionalisation of Arbitration (2017)',
            'Chaired by Justice B.N. Srikrishna',
          ],
          ['Act', 'India International Arbitration Centre Act, 2019', 'Ministry of Law & Justice'],
        ],
      },
      {
        ctx: 'The 1996 Act is the core of India’s arbitration architecture. Part I governs arbitrations seated in India — domestic and international commercial — while Part II deals with enforcing foreign awards under the New York and Geneva Conventions.',
        pts: [
          'Modelled on the UNCITRAL Model Law, 1985.',
          'Part I: arbitration seated in India; Part II: foreign awards.',
          'Courts can set aside awards only on narrow grounds (Section 34).',
        ],
        st: 'Arbitration is on the Concurrent List (Entry 13, List III). The Supreme Court’s BALCO judgment (2012) held that Part I does not apply to arbitrations seated outside India — a landmark for “seat-centric” arbitration.',
        links: ['Entry 13, List III', 'BALCO judgment, 2012', 'Section 34 — setting aside'],
        mcq: {
          q: 'The Arbitration and Conciliation Act, 1996 is based on which of the following?',
          st: [],
          o: [
            'New York Convention, 1958',
            'UNCITRAL Model Law, 1985',
            'Geneva Protocol, 1923',
            'Hague Convention, 1907',
          ],
          a: 1,
          ex: 'The Act is modelled on the UNCITRAL Model Law on International Commercial Arbitration, 1985. The New York Convention governs the enforcement of foreign awards under Part II.',
        },
        ca: [
          [
            '2019',
            'PIB',
            'Amendment provides for an Arbitration Council of India to grade arbitral institutions.',
          ],
          [
            '2021',
            'Daily News',
            'Amendment allows an unconditional stay of awards induced by fraud or corruption.',
          ],
          ['Oct 2024', 'PIB', 'Draft bill proposes emergency arbitrators and appellate arbitral tribunals.'],
        ],
        refs: [
          ['Act', 'Arbitration and Conciliation Act, 1996', 'Bare Act · India Code'],
          ['Judgment', 'Bharat Aluminium Co. v. Kaiser Aluminium (BALCO), 2012', 'Supreme Court of India'],
          ['Report', 'UNCITRAL Model Law on International Commercial Arbitration', 'United Nations, 1985'],
        ],
      },
      {
        ctx: 'Unlike BITs, most of India’s recent FTAs leave out ISDS, so foreign investors cannot directly sue India before international tribunals under them. It reflects caution after costly treaty claims, but places more weight on domestic courts and contract-based arbitration.',
        pts: [
          'ISDS lets investors sue host states directly.',
          'India faced claims such as White Industries (2011) and the Vodafone and Cairn tax disputes.',
          'Omitting ISDS protects regulatory space but may worry investors.',
        ],
        st: 'After adverse awards, India’s 2016 Model BIT narrowed investor protection: it excludes taxation measures and requires investors to exhaust local remedies for five years before arbitration. India then terminated most of its older BITs from 2017.',
        links: ['Model BIT, 2016', 'Exhaustion of local remedies', 'Taxation Laws (Amendment) Act, 2021'],
        mcq: {
          q: 'Consider the following statements regarding India’s Model Bilateral Investment Treaty, 2016:',
          st: [
            'It requires investors to exhaust local remedies before initiating arbitration.',
            'It brings taxation measures within the scope of investor protection.',
            'After its adoption, India terminated a large number of its older BITs.',
          ],
          o: ['1 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
          a: 1,
          ex: 'The 2016 Model BIT requires exhausting local remedies for five years and expressly excludes taxation measures, so statement 2 is wrong. India terminated most older BITs from 2017.',
        },
        ca: [
          [
            'Aug 2021',
            'PIB',
            'Taxation Laws (Amendment) Act scraps retrospective tax demands, ending the Vodafone and Cairn disputes.',
          ],
          ['Feb 2024', 'Daily News', 'India–UAE BIT shortens the local-remedies window to three years.'],
          ['Sep 2025', 'Editorial', 'Should India’s FTAs restore a narrow ISDS clause?'],
        ],
        refs: [
          ['Portal', 'UNCTAD Investment Policy Hub — India', 'International investment agreements navigator'],
          ['Judgment', 'White Industries Australia v. Republic of India (2011)', 'UNCITRAL tribunal award'],
          ['Portal', 'Model Text for the Indian BIT, 2016', 'Department of Economic Affairs'],
        ],
      },
    ],
  },
  {
    id: 'celeb',
    s: 'polity',
    t: 'How celebrities become intimates, enter our lives',
    src: 'The Indian Express · Opinion',
    d: '13 Sep 2026',
    min: 4,
    paras: [
      'Celebrities no longer live at a distance. [[0|Social media has turned admiration into a {{parasocial relationship}} — a one-sided bond in which fans feel they personally know a public figure.]] Daily stories, live sessions and replies to comments make that feeling stronger.',
      'That intimacy is commercially valuable, and the law has begun to notice. [[1|Under the {{Consumer Protection Act, 2019}}, the {{CCPA}} has issued guidelines requiring celebrities and influencers to clearly disclose paid endorsements.]] Brands, regulators and audiences are still working out where trust ends and advertising begins.',
    ],
    terms: {
      'parasocial relationship': [
        'A term from psychology',
        'A one-sided emotional bond in which a person feels close to a media figure who does not know them.',
        'Useful in GS IV and Essay answers on social media and values.',
      ],
      'Consumer Protection Act, 2019': [
        'Replaced the 1986 Act',
        'Strengthens consumer rights, covers e-commerce and misleading advertisements, and sets up the Central Consumer Protection Authority.',
        'Endorsers of misleading ads can face penalties of up to ₹10 lakh.',
      ],
      CCPA: [
        'Central Consumer Protection Authority',
        'A regulator under the 2019 Act that can investigate unfair trade practices and act against false or misleading advertisements.',
        'Set up in July 2020.',
      ],
    },
    ins: [
      {
        ctx: 'Social media collapses the distance between public figures and audiences. Repeated, seemingly personal content makes followers feel a real relationship — shaping opinions, purchases and even political choices.',
        pts: [
          'Parasocial bonds are one-sided but feel reciprocal.',
          'They give influencers outsized persuasive power.',
          'They raise questions of accountability and media literacy.',
        ],
        st: 'Free speech under Article 19(1)(a) protects celebrity expression, but Article 19(2) allows reasonable restrictions — for instance on defamation, decency and public order. Influence without accountability is a recurring governance concern.',
        links: ['Art. 19(1)(a)', 'Art. 19(2)', 'IT Rules, 2021'],
        mcq: {
          q: 'Which of the following are grounds for reasonable restrictions on freedom of speech listed in Article 19(2)?',
          st: ['Public order', 'Defamation', 'Decency or morality', 'Economic interest of the State'],
          o: ['1 and 2 only', '1, 2 and 3 only', '2, 3 and 4 only', '1, 2, 3 and 4'],
          a: 1,
          ex: 'Article 19(2) lists sovereignty and integrity of India, security of the State, friendly relations with foreign states, public order, decency or morality, contempt of court, defamation and incitement to an offence. “Economic interest of the State” is not a ground.',
        },
        ca: [
          [
            'Jan 2023',
            'PIB',
            'Department of Consumer Affairs releases the “Endorsement Know-hows!” guide for influencers.',
          ],
          ['2024', 'Daily News', 'CCPA advisory warns against promoting betting and gambling platforms.'],
          ['Sep 2026', 'Editorial', 'The case for media literacy as a school subject.'],
        ],
        refs: [
          ['Act', 'IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021', 'MeitY'],
          ['Book', 'Indian Polity — M. Laxmikanth', 'Ch. 7 · Fundamental Rights'],
          [
            'Report',
            'Guidelines for Influencer Advertising in Digital Media (2021)',
            'Advertising Standards Council of India',
          ],
        ],
      },
      {
        ctx: 'When endorsements look like personal advice, consumers can be misled. Mandatory disclosure restores the line between opinion and advertisement and makes endorsers share responsibility for false claims.',
        pts: [
          'Disclosures such as “ad” or “sponsored” must be prominent.',
          'Endorsers should have used or verified the product.',
          'Penalties apply to endorsers of misleading ads.',
        ],
        st: 'The 2019 Act created a three-tier redressal structure — District, State and National Commissions — and an executive regulator, the CCPA. Consumer protection also draws on Article 47 (public health) among the Directive Principles.',
        links: ['Consumer Protection Act, 2019', 'Three-tier Consumer Commissions', 'Art. 47 — public health'],
        mcq: {
          q: 'With reference to the Central Consumer Protection Authority (CCPA), consider the following statements:',
          st: [
            'It was established under the Consumer Protection Act, 2019.',
            'It can impose penalties on endorsers of false or misleading advertisements.',
            'It is a constitutional body.',
          ],
          o: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
          a: 1,
          ex: 'The CCPA is a statutory body set up in 2020 under the 2019 Act, with powers to penalise manufacturers and endorsers of misleading ads. It is not a constitutional body.',
        },
        ca: [
          ['Jun 2022', 'PIB', 'CCPA notifies guidelines on misleading advertisements and endorsements.'],
          ['Jan 2023', 'PIB', 'Influencer endorsement guidelines released.'],
          ['2024', 'Daily News', 'CCPA advisory against promoting betting platforms.'],
        ],
        refs: [
          ['Act', 'Consumer Protection Act, 2019', 'Bare Act · India Code'],
          [
            'Report',
            'Guidelines for Prevention of Misleading Advertisements, 2022',
            'Central Consumer Protection Authority',
          ],
          ['Report', 'ASCI Influencer Guidelines (2021)', 'Advertising Standards Council of India'],
        ],
      },
    ],
  },
  {
    id: 'rbi',
    s: 'eco',
    t: 'Why the RBI chose to wait',
    src: 'Business Standard · Explainer',
    d: '2 Oct 2026',
    min: 3,
    paras: [
      'The Reserve Bank’s October review offered no surprises. [[0|The six-member {{MPC}} kept the {{repo rate}} unchanged and retained a neutral stance, citing inflation within the target band.]] Analysts now expect any easing to depend on food prices in the coming quarter.',
    ],
    terms: {
      MPC: [
        'Monetary Policy Committee',
        'A six-member committee — three from the RBI and three appointed by the Centre — that sets the policy repo rate to meet the inflation target.',
        'The Governor has a casting vote in case of a tie.',
      ],
      'repo rate': [
        'The policy rate',
        'The rate at which the RBI lends short-term funds to banks against government securities.',
        'Raising it tightens liquidity; cutting it lowers borrowing costs.',
      ],
    },
    ins: [
      {
        ctx: 'Holding rates while staying “neutral” signals that the RBI sees inflation under control but wants room to respond either way. It balances support for growth against the risk of food-price shocks.',
        pts: [
          'A neutral stance keeps both cuts and hikes possible.',
          'The CPI inflation target is 4% with a ±2% band.',
          'Food prices remain the main risk.',
        ],
        st: 'The MPC got statutory backing through the 2016 amendment to the RBI Act, 1934 (Section 45ZB). The inflation target is set by the Centre in consultation with the RBI every five years — an example of rule-based economic governance.',
        links: ['RBI Act, 1934 — Sec. 45ZB', 'Flexible inflation targeting', 'Urjit Patel Committee, 2014'],
        mcq: {
          q: 'Consider the following statements about the Monetary Policy Committee (MPC):',
          st: [
            'It has six members, including three external members.',
            'It decides the Cash Reserve Ratio (CRR).',
            'The RBI Governor has a casting vote.',
          ],
          o: ['1 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
          a: 1,
          ex: 'The MPC sets only the repo rate. CRR and SLR are decided by the RBI, so statement 2 is wrong.',
        },
        ca: [
          ['Oct 2026', 'PIB', 'MPC keeps the repo rate unchanged; stance stays neutral.'],
          ['Mar 2026', 'Daily News', 'Inflation target of 4% (±2%) retained for the next five years.'],
          ['Sep 2026', 'Editorial', 'Should the RBI target core inflation instead of headline?'],
        ],
        refs: [
          ['Act', 'Reserve Bank of India Act, 1934', 'Section 45ZB'],
          ['Report', 'Urjit Patel Committee Report (2014)', 'Revising the monetary policy framework'],
          ['Report', 'Monetary Policy Report', 'RBI · half-yearly'],
        ],
      },
    ],
  },
  {
    id: 'harappa',
    s: 'history',
    t: 'What Harappan cities can teach our smart cities',
    src: 'The Hindu · Magazine',
    d: '8 Sep 2026',
    min: 4,
    paras: [
      'Four and a half thousand years ago, urban planning in the subcontinent was already remarkably disciplined. [[0|Harappan cities followed a grid pattern, with a raised {{citadel}} to the west and a larger lower town to the east, served by covered drains.]] Modern planners still struggle to match that attention to drainage.',
    ],
    terms: {
      citadel: [
        'Raised, fortified area',
        'The elevated western part of a Harappan city, usually housing large public structures such as the Great Bath and granaries.',
        'Dholavira had a three-part division — citadel, middle town and lower town.',
      ],
    },
    ins: [
      {
        ctx: 'Harappan planning points to a strong civic authority: standardised bricks, straight streets crossing at right angles and a city-wide drainage network. It is often cited as one of the earliest examples of planned urbanism.',
        pts: [
          'Grid plan with streets at right angles.',
          'Standardised burnt bricks in a 1:2:4 ratio.',
          'Covered drains connected to every house.',
        ],
        st: 'Key sites: Mohenjodaro (Great Bath), Harappa (granaries), Lothal (dockyard) and Dholavira (water reservoirs; a UNESCO World Heritage Site since 2021).',
        links: ['Mohenjodaro — Great Bath', 'Lothal — dockyard', 'Dholavira — UNESCO 2021'],
        mcq: {
          q: 'Which Harappan site is known for its dockyard?',
          st: [],
          o: ['Kalibangan', 'Lothal', 'Banawali', 'Rakhigarhi'],
          a: 1,
          ex: 'Lothal in Gujarat had a dockyard linked to a river channel. Kalibangan is known for ploughed fields and fire altars.',
        },
        ca: [
          ['Jul 2021', 'PIB', 'Dholavira inscribed as India’s 40th World Heritage Site.'],
          ['2025', 'Daily News', 'National Maritime Heritage Complex coming up at Lothal.'],
          ['Sep 2026', 'Editorial', 'Ancient water management lessons for climate-resilient cities.'],
        ],
        refs: [
          ['Book', 'Themes in Indian History, Part I — NCERT Class XII', 'Ch. 1 · Bricks, Beads and Bones'],
          ['Report', 'Excavation reports', 'Archaeological Survey of India'],
          ['Book', 'India’s Ancient Past — R.S. Sharma', 'Harappan culture'],
        ],
      },
    ],
  },
  {
    id: 'monsoon',
    s: 'geo',
    t: 'A monsoon that came early and stayed late',
    src: 'Down To Earth',
    d: '30 Sep 2026',
    min: 5,
    paras: [
      'This year’s south-west monsoon defied several forecasts. [[0|A positive {{Indian Ocean Dipole}} helped offset the drying effect of a developing {{El Niño}}, keeping rainfall close to normal.]] Farmers in central India nonetheless faced long dry spells in August.',
    ],
    terms: {
      'Indian Ocean Dipole': [
        'IOD — the “Indian Niño”',
        'The difference in sea-surface temperature between the western and eastern Indian Ocean. A positive phase usually boosts Indian monsoon rainfall.',
        'Often discussed together with ENSO in monsoon forecasts.',
      ],
      'El Niño': [
        'Warm phase of ENSO',
        'Unusual warming of the central and eastern Pacific that tends to weaken the Indian monsoon.',
        'Its cool counterpart, La Niña, usually strengthens the monsoon.',
      ],
    },
    ins: [
      {
        ctx: 'The monsoon is shaped by more than one ocean. A positive IOD can partly cancel an El Niño year, which is why forecasts look at both systems together.',
        pts: [
          'El Niño tends to weaken the monsoon.',
          'A positive IOD tends to strengthen it.',
          'Rainfall distribution matters as much as the seasonal total.',
        ],
        st: 'Related static concepts: the northward shift of the ITCZ, heating of the Tibetan plateau and the Tropical Easterly Jet. The 1997 monsoon was near-normal despite a strong El Niño — a classic case of the IOD offsetting ENSO.',
        links: ['ITCZ', 'Tropical Easterly Jet', 'ENSO'],
        mcq: {
          q: 'Consider the following statements:',
          st: [
            'A positive Indian Ocean Dipole generally favours good monsoon rainfall in India.',
            'El Niño is associated with warming of the eastern Pacific Ocean.',
            'La Niña usually weakens the Indian monsoon.',
          ],
          o: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
          a: 1,
          ex: 'La Niña generally strengthens the Indian monsoon, so statement 3 is wrong.',
        },
        ca: [
          ['Sep 2026', 'PIB', 'IMD: season ends close to the long-period average.'],
          ['Aug 2026', 'Daily News', 'Dry spell hits kharif sowing in central India.'],
          ['Jun 2026', 'Editorial', 'Why monsoon forecasts must look beyond El Niño.'],
        ],
        refs: [
          ['Book', 'Fundamentals of Physical Geography — NCERT Class XI', 'Atmospheric circulation'],
          ['Portal', 'Seasonal forecasts', 'India Meteorological Department'],
          ['Book', 'Certificate Physical and Human Geography — G.C. Leong', 'Climate'],
        ],
      },
    ],
  },
  {
    id: 'grap',
    s: 'env',
    t: 'GRAP is back — but is it enough?',
    src: 'The Hindu',
    d: '24 Oct 2026',
    min: 5,
    paras: [
      'Delhi’s skies have turned grey again. [[0|The {{CAQM}} invoked Stage 1 of the {{GRAP}} as the AQI slipped into the ‘poor’ category.]] Experts say emergency curbs alone cannot fix a problem rooted in year-round emissions.',
    ],
    terms: {
      CAQM: [
        'Commission for Air Quality Management',
        'A statutory body for Delhi-NCR and adjoining areas that coordinates action on air pollution and enforces GRAP.',
        'Constituted under the CAQM Act, 2021, replacing EPCA.',
      ],
      GRAP: [
        'Graded Response Action Plan',
        'A set of emergency measures that tighten in four stages as Delhi-NCR’s air quality worsens.',
        'Stage 1 applies at AQI 201–300; Stage 4 above 450.',
      ],
    },
    ins: [
      {
        ctx: 'GRAP is reactive: it kicks in only after air quality deteriorates. Without sustained action on vehicles, dust, industry and stubble burning, the curbs recur every winter with little lasting improvement.',
        pts: [
          'Four stages tied to AQI bands.',
          'Implemented by CAQM — earlier by EPCA.',
          'Studies show no consistent winter improvement.',
        ],
        st: 'Static anchors: Article 21 (right to a clean environment, M.C. Mehta cases) and Article 48A (Directive Principle on protecting the environment). The Air (Prevention and Control of Pollution) Act, 1981 underpins air-quality regulation.',
        links: ['Art. 21 & Art. 48A', 'Air Act, 1981', 'CAQM Act, 2021'],
        mcq: {
          q: 'With reference to the Graded Response Action Plan (GRAP), consider the following statements:',
          st: [
            'It was first notified in 2017 following Supreme Court directions.',
            'It is implemented by the Central Pollution Control Board.',
            'Its measures become stricter as air quality worsens.',
          ],
          o: ['1 and 2 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
          a: 1,
          ex: 'GRAP is implemented by the CAQM (earlier EPCA), not the CPCB, so statement 2 is wrong.',
        },
        ca: [
          ['Oct 2026', 'PIB', 'CAQM invokes GRAP Stage 1 across NCR.'],
          ['Oct 2026', 'Daily News', 'Stubble-fire counts lower than last year in Punjab.'],
          ['Oct 2026', 'Editorial', 'Why reactive pollution control keeps failing.'],
        ],
        refs: [
          ['Act', 'Commission for Air Quality Management Act, 2021', 'MoEFCC'],
          ['Report', 'Analysis of Delhi’s winter air quality', 'Centre for Research on Energy and Clean Air'],
          ['Act', 'Air (Prevention and Control of Pollution) Act, 1981', 'Bare Act'],
        ],
      },
    ],
  },
];

// Source: PrepAssist.html L9725 (X4SUB)
//   Local to the IIFE at L9724-L10072 (<script id="xray4js">); not reachable from outside it in the HTML.
export const X4SUB: readonly (readonly string[])[] = [
  ['polity', 'Polity'],
  ['history', 'History'],
  ['eco', 'Economy'],
  ['geo', 'Geography'],
  ['env', 'Environment'],
];

// Source: PrepAssist.html L9728 (TABS)
//   Local to the IIFE at L9724-L10072 (<script id="xray4js">); not reachable from outside it in the HTML.
export const TABS: readonly (readonly string[])[] = [
  ['layers', 'Context', 'Context depth', 'Cross-source analytical breakdown', '#1B8AD3'],
  ['learn', 'Static', '', 'Static foundations & authorities', '#C8622B'],
  ['target', 'MCQ', 'Prelims MCQ', 'Statement-based active recall', '#6C5DD3'],
  ['globe', 'News', 'Current affairs', 'Daily news, PIB & editorials', '#0A97B8'],
  ['doc', 'Sources', 'References', 'Authoritative citations & reports', '#2F8A4A'],
];

/** The keys NCOL has in the HTML. */
export type NcolKey =
  | 'PIB'
  | 'Daily News'
  | 'Editorial';

// Source: PrepAssist.html L9729 (NCOL)
//   Local to the IIFE at L9724-L10072 (<script id="xray4js">); not reachable from outside it in the HTML.
export const NCOL: Readonly<Record<string, string>> = { PIB: '#E8890C', 'Daily News': '#1B8AD3', Editorial: '#6C5DD3' };

export interface Ric {
  readonly Report: string;
  readonly Act: string;
  readonly Book: string;
  readonly Judgment: string;
  readonly Portal: string;
}

// Source: PrepAssist.html L9730 (RIC)
//   Local to the IIFE at L9724-L10072 (<script id="xray4js">); not reachable from outside it in the HTML.
export const RIC: Ric = { Report: 'doc', Act: 'scale', Book: 'learn', Judgment: 'hash', Portal: 'globe' };

// Source: PrepAssist.html L6686-L6692 (XR)
export const XR: readonly (readonly string[])[] = [
  [
    'Asked in UPSC 2019 & 2023',
    'Statements on whether Art 32 can be suspended and whether it is itself a Fundamental Right appeared in two recent Prelims papers.',
  ],
  [
    'Syllabus keyword · GS II',
    '“Fundamental rights — enforcement”. Link this line to Art 226 and Art 359 in your notes.',
  ],
  ['Your highlight · 18 Oct', 'You highlighted this while reading. Use it as your Mains introduction quote.'],
  [
    'Asked in UPSC 2021 (Mains)',
    'Basic structure + Art 32: cite L. Chandra Kumar (1997). Appears in GS II answers on judicial review.',
  ],
  [
    'Syllabus keyword · GS II',
    'Know the meaning, scope and limits of each writ — a staple of Prelims statement questions.',
  ],
];

export interface XrbMetaValue {
  readonly t: string;
  readonly a: string;
  readonly sh: string;
  readonly c: string;
  readonly pages: number;
  readonly at: number;
  readonly ch?: string;
}

/** The keys XRB_META has in the HTML. */
export type XrbMetaKey =
  | '0'
  | '1'
  | '2'
  | '4';

// Source: PrepAssist.html L8379-L8384 (XRB_META)
export const XRB_META: Readonly<Record<string, XrbMetaValue>> = {
  '0': {
    t: 'Indian Polity',
    a: 'M. Laxmikanth · Ch. 7–8',
    sh: 'Polity',
    c: '#1667B0',
    pages: 412,
    at: 214,
    ch: 'Ch. 7 · Fundamental Rights',
  },
  '1': {
    t: 'Economic Survey 2025-26',
    a: 'Vol. 1 · Ministry of Finance',
    sh: 'Survey',
    c: '#3B5BCC',
    pages: 388,
    at: 0,
  },
  '2': { t: 'PYQ Polity 2013–2025', a: 'Compiled question paper', sh: 'PYQs', c: '#6C5DD3', pages: 96, at: 0 },
  '4': { t: 'Monsoon notes', a: 'Scanned handwritten notes', sh: 'Notes', c: '#0E9A8A', pages: 24, at: 0 },
};

export interface XrpItemRunsItemItem2 {
  readonly y?: string;
  readonly paper?: string;
  readonly q?: string;
  readonly tag?: string;
  readonly n?: number;
  readonly note?: string;
}

export interface XrpItem {
  readonly no: string;
  readonly h: string;
  readonly runs: readonly (readonly [string, string, XrpItemRunsItemItem2?])[];
}

// Source: PrepAssist.html L8387-L8414 (XRP)
export const XRP: readonly XrpItem[] = [
  {
    no: '7.14',
    h: 'Right to Constitutional Remedies',
    runs: [
      [
        '',
        'A mere declaration of fundamental rights is meaningless without an effective machinery for their enforcement. Hence, ',
      ],
      [
        'pyq',
        'Article 32 confers the right to remedies for the enforcement of the fundamental rights',
        {
          y: '2019',
          paper: 'Prelims · GS I',
          q: 'Which Article of the Constitution makes the right to constitutional remedies itself a Fundamental Right?',
        },
      ],
      ['', ' of an aggrieved citizen. In other words, the '],
      ['kw', 'right to get the fundamental rights protected', { tag: 'GS II · Fundamental Rights', n: 214 }],
      ['', ' is in itself a fundamental right. '],
      [
        'hl',
        'Dr B.R. Ambedkar called Article 32 the most important article of the Constitution',
        { note: 'Use this quote to open Mains answers on Art. 32.' },
      ],
      [
        '',
        ' — “the very soul of the Constitution and the very heart of it”.\n\nThe Supreme Court has ruled that Article 32 is a ',
      ],
      [
        'pyq',
        'basic feature of the Constitution',
        {
          y: '2023',
          paper: 'Mains · GS II',
          q: '“Article 32 is the very soul of the Constitution.” Discuss how judicial interpretation has expanded the scope of the right to constitutional remedies.',
        },
      ],
      [
        '',
        '; hence it cannot be abridged or taken away even by an amendment. The Supreme Court can issue writs of ',
      ],
      [
        'kw',
        'habeas corpus, mandamus, prohibition, certiorari and quo warranto',
        { tag: 'GS II · Writs', n: 168 },
      ],
      ['', ' for the enforcement of these rights.'],
    ],
  },
  {
    no: '7.15',
    h: 'Writs — Types and Scope',
    runs: [
      ['', 'Each writ has a distinct purpose and reach. '],
      [
        'pyq',
        'Habeas corpus can be issued against both public authorities and private individuals',
        {
          y: '2014',
          paper: 'Prelims · GS I',
          q: 'With reference to the writ of habeas corpus, which of the following statements is/are correct?',
        },
      ],
      ['', ', whereas '],
      [
        'pyq',
        'mandamus cannot be issued against the President or the state governors',
        {
          y: '2017',
          paper: 'Prelims · GS I',
          q: 'Against which of the following can the writ of mandamus NOT be issued?',
        },
      ],
      ['', '. '],
      ['kw', 'Certiorari is both preventive and curative', { tag: 'GS II · Writs', n: 168 }],
      ['', ', while prohibition is only preventive.\n\nThe writ jurisdiction of the High Courts under '],
      [
        'pyq',
        'Article 226 is wider than that of the Supreme Court under Article 32',
        {
          y: '2023',
          paper: 'Prelims · GS I',
          q: 'Consider the following statements regarding the writ jurisdiction of the High Courts…',
        },
      ],
      ['', ', since it extends to the enforcement of ordinary legal rights as well. '],
      [
        'hl',
        'Parliament can empower any other court to issue writs',
        { note: 'Art. 32(3) — check the 2021 PYQ pattern again.' },
      ],
      ['', ', but this has not been done so far.'],
    ],
  },
];

export interface XrLab {
  readonly pyq: string;
  readonly kw: string;
  readonly hl: string;
}

// Source: PrepAssist.html L8416 (XR_LAB)
export const XR_LAB: XrLab = { pyq: 'Asked in PYQ', kw: 'Syllabus keyword', hl: 'Your highlight' };
