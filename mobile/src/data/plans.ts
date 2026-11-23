// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Plans, credit packs and the plan themes.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface PlanN {
  readonly free: string;
  readonly pro: string;
  readonly ultimate: string;
}

// Source: PrepAssist.html L7118 (PLAN_N)
export const PLAN_N: PlanN = { free: 'Free tier', pro: 'UPSC Pro', ultimate: 'Ultimate' };

export interface PlanCap {
  readonly free: number;
  readonly pro: number;
  readonly ultimate: number;
}

// Source: PrepAssist.html L7119 (PLAN_CAP)
export const PLAN_CAP: PlanCap = { free: 30, pro: 100, ultimate: 200 };

export interface PlansItem {
  readonly id: string;
  readonly n: string;
  readonly kind: string;
  readonly p: number;
  readonly credits: number;
  readonly ic: string;
  readonly desc: string;
  readonly f: readonly string[];
}

// Source: PrepAssist.html L7120-L7127 (PLANS)
export const PLANS: readonly PlansItem[] = [
  {
    id: 'pro',
    n: 'UPSC Pro',
    kind: 'Monthly plan',
    p: 399,
    credits: 100,
    ic: 'spark',
    desc: 'Everything for daily preparation, with AI that reads your answers the way an examiner does.',
    f: [
      '100 AI credits every month',
      '1 GB AI storage for your notes',
      'Recorded courses (selected library)',
      'Vision AI Mains evaluator',
    ],
  },
  {
    id: 'ultimate',
    n: 'Ultimate',
    kind: 'Monthly plan',
    p: 699,
    credits: 200,
    ic: 'crown',
    desc: 'The most compute for the most intensive phase of your preparation.',
    f: [
      '200 AI credits every month',
      '2 GB AI storage for your notes',
      'Unlimited recorded courses',
      'Early access to the future library',
    ],
  },
  {
    id: 'vault',
    n: 'Cloud Vault',
    kind: 'Storage add-on · monthly',
    p: 149,
    credits: 0,
    ic: 'cloud',
    desc: 'Lift the free-tier limit and keep an extra 1 GB of encrypted PDFs and answer scans.',
    f: [
      '+1 GB storage per unlock',
      'Files are kept permanently',
      'No automatic archiving',
      'Storage usage insights',
    ],
  },
];

export interface PacksItem {
  readonly c: number;
  readonly p: number;
}

// Source: PrepAssist.html L7128 (PACKS)
export const PACKS: readonly PacksItem[] = [{ c: 80, p: 99 }, { c: 170, p: 199 }, { c: 280, p: 299 }, { c: 399, p: 399 }];

export interface ThValue {
  readonly n: string;
  readonly t: string;
  readonly ic: string;
  readonly sw: readonly string[];
}

/** The keys TH has in the HTML. */
export type ThKey =
  | 'free'
  | 'pro'
  | 'ultimate';

// Source: PrepAssist.html L10746-L10750 (TH)
//   Local to the IIFE at L10745-L10777 (<script id="planthemesjs">); not reachable from outside it in the HTML.
export const TH: Readonly<Record<string, ThValue>> = {
  free: { n: 'Free tier', t: 'Classic Blue', ic: 'shield', sw: ['#0F5E99', '#1B8AD3', '#5DB6EE', '#F5A01F'] },
  pro: { n: 'UPSC Pro', t: 'Indigo Aurora', ic: 'spark', sw: ['#25146B', '#5631D1', '#8B69FF', '#EC6BB4'] },
  ultimate: { n: 'Ultimate', t: 'Midnight Gold', ic: 'crown', sw: ['#0A0907', '#3D2C0E', '#C8961E', '#F7DE8E'] },
};
