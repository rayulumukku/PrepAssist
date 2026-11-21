// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Marker types used inside the generated data, and the list of values that depend on the environment.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export type EnvKind = 'clock' | 'timezone' | 'clock+timezone';

/**
 * A value the HTML computes from the current time and/or the device timezone. `sample` is what the
 * reference capture saw (ENV_SAMPLE) and must not be used as content: compute the real value the way
 * `source` in ENV_DERIVED says.
 */
export interface EnvDerived<T> {
  readonly $env: EnvKind;
  readonly sample: T;
}

/** A Date, as its ISO string. */
export interface DateValue {
  readonly $date: string;
}

/**
 * A function found inside data. `code` is its exact source text. `returns` is present only for
 * zero-argument template functions and is the string the function returns.
 */
export interface FnMarker<R = never> {
  readonly $fn: {
    readonly name: string;
    readonly params: number;
    readonly source: string;
    readonly code: string;
    readonly returns?: R;
  };
}

export interface RegExpValue {
  readonly $regexp: { readonly source: string; readonly flags: string };
}

/** A DOM node that was stored inside a value (described as tag#id.class). */
export interface DomRef {
  readonly $dom: string;
}

/** An instance of a browser class that was stored inside a value. */
export interface InstanceRef {
  readonly $instance: string;
}

/** A reference back to an ancestor object. */
export interface CycleRef {
  readonly $cycle: string;
}

/** The environment of the reference capture. */
export const ENV_SAMPLE = { clock: '2026-01-15T04:30:00.000Z', timezoneId: 'Asia/Kolkata', locale: 'en-IN' } as const;

export interface EnvDerivedEntry {
  readonly constant: string;
  readonly path: string;
  readonly kind: EnvKind;
  /** How the HTML computes the value. */
  readonly source: string;
}

/** Every value in the generated data that depends on the clock or the timezone. */
export const ENV_DERIVED: readonly EnvDerivedEntry[] = [
  {
    constant: 'S',
    path: 'S.ca.date',
    kind: 'clock+timezone',
    source: 'L7104: isoD(TODAY), the local date as YYYY-MM-DD',
  },
  {
    constant: 'PRELIMS_AT',
    path: 'PRELIMS_AT',
    kind: 'clock',
    source: 'L5930: Date.now() + ((126 * 24 + 9) * 60 + 14) * 60000 + 32000, taken once at load',
  },
  {
    constant: 'TODAY',
    path: 'TODAY',
    kind: 'clock+timezone',
    source: 'L7092: local midnight of the current day (new Date(); setHours(0,0,0,0))',
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[0].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[1].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[2].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[3].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[4].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[5].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[6].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[7].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[8].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[9].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[10].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[11].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[12].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[13].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.polity[14].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.history[0].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.history[1].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.history[2].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.history[3].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.geo[0].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.geo[1].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.geo[2].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.geo[3].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.geo[4].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.geo[5].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[0].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[1].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[2].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[3].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[4].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[5].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[6].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[7].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.eco[8].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.env[0].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.env[1].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.env[2].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.env[3].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.env[4].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.env[5].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.art[0].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.snt[0].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.snt[1].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.snt[2].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.snt[3].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.snt[4].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
  {
    constant: 'NT@#notes2js',
    path: 'NT@#notes2js.snt[5].ts',
    kind: 'timezone',
    source: "L10430: ts(d) = Date.parse(d + ' 2026') in local time (Date.now() when d is not a date); used only to sort notes",
  },
];

export interface FunctionInDataEntry {
  readonly path: string;
  readonly name: string;
  readonly params: number;
  readonly source: string;
  readonly returnsRecorded: boolean;
}

/** Every function found inside an exported constant. */
export const FUNCTIONS_IN_DATA: readonly FunctionInDataEntry[] = [
  { path: 'ART.plan', name: 'plan', params: 0, source: 'PrepAssist.html L5520-L5529', returnsRecorded: true },
  {
    path: 'ART.notice',
    name: 'notice',
    params: 0,
    source: 'PrepAssist.html L5530-L5540',
    returnsRecorded: true,
  },
  { path: 'ART.xray', name: 'xray', params: 0, source: 'PrepAssist.html L5541-L5548', returnsRecorded: true },
  { path: 'ART.live', name: 'live', params: 0, source: 'PrepAssist.html L5549-L5558', returnsRecorded: true },
];
