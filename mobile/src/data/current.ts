// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Current affairs: articles, source and GS-paper colours, calendar labels and the clock-derived dates.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.
import type { DateValue, EnvDerived } from './markers';

export interface ArticlesItem {
  readonly id: string;
  readonly src: string;
  readonly s: string;
  readonly gs: string;
  readonly topic: string;
  readonly min: number;
  readonly art: string;
  readonly tags?: readonly string[];
  readonly t: string;
  readonly ctx?: string;
  readonly dek: string;
  readonly body: readonly string[];
  readonly why: string;
  readonly pts: readonly string[];
  readonly mq: string;
}

// Source: PrepAssist.html L5229-L5293 (ARTICLES)
//   Changed after its declaration at L7131-L7172 (.unshift()); this is the final value once every script has run.
export const ARTICLES: readonly ArticlesItem[] = [
  {
    id: 'c1',
    src: 'The Hindu',
    s: 'eco',
    gs: 'GS III',
    topic: 'Economy',
    min: 5,
    art: 'mineral',
    tags: ['gs3', 'economy', 'infrastructure'],
    t: 'Mineral Exchanges and Price Transparency in India’s Mining Sector',
    ctx: 'The article discusses India’s plan to establish mineral exchanges, so that minerals are priced through open, competitive trading rather than administered benchmarks.',
    dek: 'A trading platform for minerals could bring transparent price discovery to a sector long priced through published averages.',
    body: [
      'The article discusses India’s ambitious plan to establish mineral exchanges — electronic platforms where minerals and metal ores can be bought and sold through transparent, competitive bidding. At present, royalty and auction values for many minerals are linked to average sale prices published by the Indian Bureau of Mines, a system that industry participants say is slow to reflect market conditions.',
      'An exchange-based model is expected to improve price discovery, reduce information gaps between large miners and small end-users such as MSMEs, and create a reliable reference price for royalty calculations. It would also complement the auction regime introduced through amendments to the Mines and Minerals (Development and Regulation) Act.',
      'Experts note that success will depend on standardised grading of ores, warehousing and assaying infrastructure, and strong regulatory oversight to prevent manipulation. Critical minerals such as lithium and rare earths may need separate treatment because of thin domestic markets and strategic concerns.',
    ],
    why: 'GS III: mobilisation of resources, infrastructure (mines) and investment models. Links to critical-mineral security and the MMDR Act reforms.',
    pts: [
      'MMDR Act, 1957 governs mining; amendments introduced auction-based allocation of mineral blocks.',
      'Indian Bureau of Mines publishes monthly average sale prices of minerals.',
      'Mineral exchanges aim at transparent price discovery and a reliable royalty benchmark.',
    ],
    mq: 'How can mineral exchanges improve transparency and efficiency in India’s mining sector? Discuss the challenges in their implementation. (150 words, 10 marks)',
  },
  {
    id: 'c2',
    src: 'The Hindu',
    s: 'ir',
    gs: 'GS II',
    topic: 'International Relations',
    min: 6,
    art: 'trade',
    tags: ['gs2', 'gs3', 'international relations'],
    t: 'India–Japan Connectivity and Northeast India Development',
    ctx: 'The news highlights how Japanese-supported connectivity projects could link Northeast India to the Bay of Bengal through neighbouring Bangladesh.',
    dek: 'Japan’s investments in roads, bridges and ports are reshaping the Northeast’s access to the sea.',
    body: [
      'The news highlights growing momentum behind connectivity projects that would link India’s landlocked Northeast to the Bay of Bengal, with Japan emerging as a key development partner. Japanese assistance through JICA has supported highways, bridges and urban infrastructure across the region, while Japan’s Bay of Bengal Industrial Growth Belt (BIG-B) initiative backs port development in Bangladesh.',
      'Linking the Northeast to deep-sea ports would sharply cut transport distances that currently run through the narrow Siliguri Corridor. The India–Japan Act East Forum, set up in 2017, coordinates these efforts and aligns them with India’s Act East Policy.',
      'Analysts caution that the projects depend on stable relations with neighbouring countries, land acquisition in hilly terrain, and the security situation in some border districts.',
    ],
    why: 'GS II: bilateral relations and India’s neighbourhood. GS III: infrastructure and regional development. Expect questions on the Act East Policy and the Siliguri Corridor.',
    pts: [
      'India–Japan Act East Forum: set up in 2017 to coordinate projects in the Northeast.',
      'BIG-B: Japan’s Bay of Bengal Industrial Growth Belt initiative.',
      'Siliguri Corridor (“Chicken’s Neck”) links the Northeast with the rest of India.',
    ],
    mq: 'Discuss the role of Japan in India’s Act East Policy with special reference to the development of the Northeast. (250 words, 15 marks)',
  },
  {
    id: 'c3',
    src: 'The Hindu',
    s: 'ir',
    gs: 'GS II',
    topic: 'International Relations',
    min: 5,
    art: 'orbit',
    tags: ['gs2', 'international relations', 'security'],
    t: 'India–US Defence Partnership and Cross-border Terrorism',
    ctx: 'The meeting between Defence Minister Rajnath Singh and his US counterpart reviewed defence cooperation and the shared concern over cross-border terrorism.',
    dek: 'Both sides reviewed co-production, technology transfer and counter-terror cooperation.',
    body: [
      'The meeting between Defence Minister Rajnath Singh and his US counterpart reviewed the progress of the bilateral defence partnership, including co-development and co-production of military platforms, technology transfer and joint exercises. Both sides also discussed regional security and reiterated their concern over cross-border terrorism.',
      'India was designated a Major Defence Partner of the United States in 2016. The two countries have since signed the four “foundational agreements” — GSOMIA, LEMOA (2016), COMCASA (2018) and BECA (2020) — that enable logistics support, secure communications and the sharing of geospatial intelligence.',
      'Observers note that while defence ties have deepened, India continues to pursue strategic autonomy, balancing partnerships with multiple countries and prioritising domestic defence manufacturing.',
    ],
    why: 'GS II: effect of policies of developed countries on India’s interests; GS III: security challenges and defence technology. Foundational agreements are a frequent Prelims theme.',
    pts: [
      'Major Defence Partner status: 2016.',
      'Foundational agreements: GSOMIA, LEMOA (2016), COMCASA (2018), BECA (2020).',
      'iCET: initiative on critical and emerging technologies.',
    ],
    mq: 'India–US defence ties have moved from buyer–seller to co-development. Examine, in the context of India’s strategic autonomy. (250 words, 15 marks)',
  },
  {
    id: 'c4',
    src: 'The Hindu',
    s: 'env',
    gs: 'GS III',
    topic: 'Environment',
    min: 7,
    art: 'leaf',
    tags: ['gs3', 'environment', 'pollution', 'governance'],
    t: 'Graded Response Action Plan (GRAP) and Air Pollution Management in Delhi-NCR',
    ctx: 'The article discusses the imposition of Stage 1 of the Graded Response Action Plan in Delhi-NCR as air quality worsened to the ‘poor’ category.',
    dek: 'Stage 1 restrictions return as winter smog sets in — but the data shows little consistent improvement.',
    body: [
      'The article discusses the imposition of Stage 1 of the Graded Response Action Plan (GRAP) in Delhi and the National Capital Region (NCR) as air quality worsened to the ‘poor’ category. Every winter, Delhi-NCR faces a severe air pollution crisis, exacerbated by meteorological factors like low wind speeds and temperature drops, combined with emissions from vehicles, dust, industrial activities, and seasonal stubble burning and firecrackers.',
      'GRAP, first notified by the Ministry of Environment, Forest and Climate Change in January 2017 following Supreme Court directions, is a set of graded measures that intensify with worsening air quality levels. It was initially implemented by the Environmental Pollution (Prevention and Control) Authority (EPCA) and is now overseen by the Commission for Air Quality Management in NCR and adjoining areas (CAQM).',
      'Despite the implementation of GRAP, an analysis by the Centre for Research on Energy and Clean Air (CREA) indicates ‘no consistent’ improvement in Delhi’s winter air quality over the past four years, with mean and median AQI levels fluctuating and sometimes worsening. This highlights the persistent challenge of air pollution, and the limits of reactive, emergency-style measures without sustained action on sources.',
    ],
    why: 'GS III: environmental pollution and degradation, and the institutions that govern it. Prelims: GRAP stages, CAQM and AQI categories. Mains: why reactive plans fall short.',
    pts: [
      'GRAP notified in January 2017 by MoEFCC following Supreme Court directions.',
      'Now implemented by CAQM (Commission for Air Quality Management in NCR and adjoining areas).',
      'Four stages: Poor (201–300), Very Poor (301–400), Severe (401–450), Severe+ (>450).',
    ],
    mq: 'Despite GRAP, Delhi-NCR’s winter air quality shows no consistent improvement. Critically analyse the reasons and suggest a long-term strategy. (250 words, 15 marks)',
  },
  {
    id: 'a1',
    src: 'The Hindu',
    s: 'ir',
    gs: 'GS II',
    topic: 'International Relations',
    min: 5,
    art: 'trade',
    t: 'India–EU Trade Negotiations Enter Final Stage',
    dek: 'Negotiators narrow gaps on tariffs, rules of origin and sustainability chapters as both sides aim to close the deal before the next summit.',
    body: [
      'Negotiators from India and the European Union concluded another round of talks in New Delhi this week, with officials on both sides indicating that the Free Trade Agreement has entered its final stage. The remaining differences are understood to centre on tariff schedules for automobiles and wines, rules of origin, and the treatment of the EU’s Carbon Border Adjustment Mechanism (CBAM).',
      'The talks, relaunched in 2022 after a nine-year pause, run alongside separate negotiations on an investment protection agreement and an agreement on geographical indications. Officials said chapters on customs facilitation, digital trade and small enterprises have largely been closed.',
      'For India, the agreement is expected to improve market access for labour-intensive sectors such as textiles, leather and gems, while the EU seeks lower duties on machinery and spirits. Experts caution that CBAM, which will impose a carbon cost on imports of steel and aluminium, could blunt some of the gains unless both sides agree on a transition mechanism.',
    ],
    why: 'Links to GS II (bilateral groupings and agreements affecting India’s interests) and GS III (effects of liberalisation, trade policy). Expect questions on FTAs, CBAM and India’s trade strategy with developed economies.',
    pts: [
      'India–EU talks relaunched in June 2022 after being suspended in 2013.',
      'Three parallel tracks: FTA, Investment Protection Agreement, Geographical Indications.',
      'CBAM: EU carbon levy on imports of carbon-intensive goods such as steel, aluminium and cement.',
      'The EU is among India’s largest trading partners in goods.',
    ],
    mq: 'Examine the opportunities and challenges for India in concluding a comprehensive trade agreement with the European Union. (150 words, 10 marks)',
  },
  {
    id: 'a2',
    src: 'Times of India',
    s: 'eco',
    gs: 'GS III',
    topic: 'Economy',
    min: 4,
    art: 'econ',
    t: 'RBI Keeps Repo Rate Unchanged, Signals Room for Easing',
    dek: 'The Monetary Policy Committee voted to hold rates while noting that inflation has stayed within the target band for a third straight quarter.',
    body: [
      'The Reserve Bank of India’s Monetary Policy Committee kept the policy repo rate unchanged at its October meeting, while retaining a “neutral” stance. The Governor noted that headline retail inflation remains within the 2–6 per cent tolerance band and that growth momentum is broadly intact.',
      'The Committee also flagged risks from volatile food prices and global commodity markets. Analysts read the statement as leaving the door open for a cut in the coming months if the inflation trajectory holds.',
      'The MPC, constituted under the amended RBI Act, 1934, has six members — three from the RBI and three external members appointed by the Centre — and is mandated to target CPI inflation of 4 per cent with a band of ±2 per cent.',
    ],
    why: 'Core GS III content: monetary policy, inflation targeting, and the institutional design of the MPC. Prelims frequently tests the composition and mandate of the MPC.',
    pts: [
      'MPC: 6 members; Governor has a casting vote.',
      'Flexible inflation targeting: 4% CPI, ±2% band, reviewed every five years.',
      'Repo rate: rate at which RBI lends to banks; SDF is the floor of the corridor.',
    ],
    mq: 'Discuss the effectiveness of the flexible inflation targeting framework in India. (250 words, 15 marks)',
  },
  {
    id: 'a3',
    src: 'The Hindu',
    s: 'polity',
    gs: 'GS II',
    topic: 'Polity',
    min: 6,
    art: 'court',
    t: 'Supreme Court Constitution Bench to Hear Pleas on Governors’ Assent Timelines',
    dek: 'A five-judge Bench will examine whether courts can prescribe time limits for Governors and the President to act on State Bills.',
    body: [
      'The Supreme Court has listed a batch of petitions before a five-judge Constitution Bench to examine the powers of Governors under Article 200 and of the President under Article 201 when acting on Bills passed by State legislatures.',
      'At the heart of the reference is whether constitutional authorities can keep Bills pending indefinitely, and whether courts may prescribe timelines. States have argued that prolonged inaction defeats the will of the elected legislature and strains cooperative federalism.',
      'Under Article 145(3), any case involving a substantial question of law as to the interpretation of the Constitution must be heard by a Bench of at least five judges.',
    ],
    why: 'High-yield for GS II: Governor’s role, Centre–State relations, and the Supreme Court’s advisory and constitutional jurisdiction. Likely Mains angle on federalism.',
    pts: [
      'Art. 200: Governor may assent, withhold, return (non-Money) Bills, or reserve for the President.',
      'Art. 201: President’s options on reserved Bills.',
      'Art. 145(3): minimum five judges for substantial questions of constitutional interpretation.',
    ],
    mq: 'The discretionary powers of the Governor have often been a source of Centre–State friction. Critically examine. (250 words, 15 marks)',
  },
  {
    id: 'a4',
    src: 'PIB',
    s: 'eco',
    gs: 'GS III',
    topic: 'Economy',
    min: 3,
    art: 'mineral',
    t: 'Cabinet Approves Incentives Under National Critical Mineral Mission',
    dek: 'The scheme supports recycling and processing of critical minerals such as lithium, cobalt and rare earths.',
    body: [
      'The Union Cabinet approved an incentive scheme to strengthen domestic recycling capacity for critical minerals under the National Critical Mineral Mission.',
      'The Mission aims to secure supply chains for minerals vital to clean energy, electronics and defence, through exploration, overseas acquisition, processing and recycling.',
      'India has identified 30 critical minerals, and the Ministry of Mines has been auctioning critical mineral blocks since 2023.',
    ],
    why: 'GS III: resource security, energy transition and industrial policy. Prelims: list of critical minerals and the agencies involved.',
    pts: [
      '30 critical minerals identified by the Ministry of Mines (2023).',
      'KABIL: joint venture to acquire overseas mineral assets.',
    ],
    mq: 'Why are critical minerals central to India’s energy transition? Suggest a strategy for supply-chain resilience. (150 words, 10 marks)',
  },
  {
    id: 'a5',
    src: 'The Hindu',
    s: 'env',
    gs: 'GS III',
    topic: 'Environment',
    min: 5,
    art: 'leaf',
    t: 'India Prepares Updated Climate Targets Ahead of COP31',
    dek: 'The new Nationally Determined Contribution is expected to extend emission-intensity targets beyond 2030.',
    body: [
      'India is finalising its updated Nationally Determined Contribution (NDC) under the Paris Agreement ahead of the next UN climate conference.',
      'The 2022 update committed India to reducing the emissions intensity of GDP by 45 per cent from 2005 levels by 2030 and to achieving about 50 per cent of installed electric capacity from non-fossil sources by 2030.',
      'India has also announced a net-zero target for 2070.',
    ],
    why: 'GS III environment and international agreements. Expect Prelims questions on NDC numbers and Mains on climate finance and equity.',
    pts: [
      'NDC 2022: 45% emissions-intensity reduction (vs 2005) by 2030.',
      '50% non-fossil installed capacity by 2030.',
      'Net zero: 2070.',
    ],
    mq: 'Evaluate India’s climate commitments in light of the principle of common but differentiated responsibilities. (250 words, 15 marks)',
  },
  {
    id: 'a6',
    src: 'PIB',
    s: 'snt',
    gs: 'GS III',
    topic: 'Science & Tech',
    min: 4,
    art: 'orbit',
    t: 'ISRO Readies Next Uncrewed Gaganyaan Test Flight',
    dek: 'The mission will validate crew-module systems and recovery operations before India’s first human spaceflight.',
    body: [
      'The Indian Space Research Organisation is preparing the next uncrewed orbital test flight under the Gaganyaan programme.',
      'The mission will carry the humanoid robot Vyommitra to test life-support and crew-module systems, followed by sea recovery of the module.',
      'Gaganyaan aims to demonstrate India’s capability to send humans to low Earth orbit at around 400 km.',
    ],
    why: 'GS III science & technology: indigenisation of technology and space. Prelims-relevant facts on mission profile.',
    pts: ['Target orbit: about 400 km (low Earth orbit).', 'Vyommitra: half-humanoid robot for uncrewed flights.'],
    mq: 'Discuss the strategic and economic significance of India’s human spaceflight programme. (150 words, 10 marks)',
  },
  {
    id: 'a7',
    src: 'Times of India',
    s: 'env',
    gs: 'GS III',
    topic: 'Environment',
    min: 3,
    art: 'leaf',
    t: 'More Indian Wetlands Added to the Ramsar List',
    dek: 'The additions take India’s tally of Wetlands of International Importance to a new high.',
    body: [
      'India has added more wetlands to the list of Wetlands of International Importance under the Ramsar Convention.',
      'Tamil Nadu continues to have the largest number of Ramsar sites in the country.',
      'The Ramsar Convention was signed in 1971 in Ramsar, Iran; India became a party in 1982.',
    ],
    why: 'Frequent Prelims topic. Know the convention, the Montreux Record and state-wise distribution.',
    pts: ['Ramsar Convention: 1971, Iran. India joined in 1982.', 'Montreux Record: Ramsar sites under threat.'],
    mq: 'Wetlands are among the most threatened ecosystems. Discuss measures for their conservation in India. (150 words, 10 marks)',
  },
];

export interface SrcValue {
  readonly m: string;
  readonly c: string;
}

/** The keys SRC has in the HTML. */
export type SrcKey =
  | 'The Hindu'
  | 'Times of India'
  | 'PIB';

// Source: PrepAssist.html L7173 (SRC)
export const SRC: Readonly<Record<string, SrcValue>> = {
  'The Hindu': { m: 'TH', c: '#B42318' },
  'Times of India': { m: 'TOI', c: '#1E293B' },
  PIB: { m: 'PIB', c: '#0E7490' },
};

export interface Gsc {
  readonly gs1: string;
  readonly gs2: string;
  readonly gs3: string;
  readonly gs4: string;
}

// Source: PrepAssist.html L7174 (GSC)
export const GSC: Gsc = { gs1: '#E8890C', gs2: '#1B8AD3', gs3: '#2F8A4A', gs4: '#6C5DD3' };

// Source: PrepAssist.html L7092 (TODAY)
//   Holds 1 value(s) the HTML computes from the clock+timezone; each is an EnvDerived marker with the value seen in the reference capture.
//     clock+timezone: L7092: local midnight of the current day (new Date(); setHours(0,0,0,0))
export const TODAY: EnvDerived<DateValue> = { $env: 'clock+timezone', sample: { $date: '2026-01-14T18:30:00.000Z' } };

// Source: PrepAssist.html L7096 (MONS)
export const MONS: readonly string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Source: PrepAssist.html L7097 (MONL)
export const MONL: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Source: PrepAssist.html L7098 (DOWS)
export const DOWS: readonly string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
