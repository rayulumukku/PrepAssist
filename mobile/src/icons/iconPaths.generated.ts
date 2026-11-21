// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
//
// Every <symbol> of the prototype as data for react-native-svg. No component here.
//   ICONS                 the icon sprite: static markup L4658-L4724, the `logo` symbol, and the two
//                         sprites that scripts inject at load. `<use href="#i-NAME">` in the HTML is ICONS[NAME].
//   ILLUSTRATION_SYMBOLS  <symbol>s that a view template builds (not icons, no viewBox).
// Attribute names are camelCased (stroke-width -> strokeWidth); values are the HTML strings, unchanged.
// A shape without its own fill/stroke attrs takes them from the element that uses the icon. For the
// icon helper ic() that is the rule at PrepAssist.html L37:
//   svg.ic{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;flex:none}
// Per-shape attrs (e.g. the fills of `logo`) override it.

export type IconShapeType = 'path' | 'rect' | 'circle' | 'ellipse' | 'line' | 'polyline' | 'polygon';

export interface IconShape {
  /** Element name. Always an IconShapeType for the icons in this file. */
  readonly type: IconShapeType;
  readonly attrs: Readonly<Record<string, string>>;
}

export interface IconDef {
  /** The id of the <symbol> in the HTML. */
  readonly id: string;
  readonly viewBox: string | null;
  /** Attributes of the <symbol> itself other than id and viewBox. */
  readonly attrs: Readonly<Record<string, string>>;
  /** Child shapes in document order (later shapes paint on top). */
  readonly shapes: readonly IconShape[];
  readonly source: string;
  readonly origin: 'static-markup' | 'injected-by-script' | 'view-template';
  /** For view-template symbols: the expression that builds the markup. */
  readonly builtBy?: string;
}

export type IconName =
  | 'home'
  | 'learn'
  | 'practice'
  | 'current'
  | 'profile'
  | 'search'
  | 'arrow'
  | 'back'
  | 'chev'
  | 'chevl'
  | 'chevd'
  | 'close'
  | 'bookmark'
  | 'star'
  | 'spark'
  | 'play'
  | 'upload'
  | 'camera'
  | 'file'
  | 'cloud'
  | 'calendar'
  | 'mindmap'
  | 'xray'
  | 'db'
  | 'notes'
  | 'pen'
  | 'mic'
  | 'check'
  | 'x'
  | 'clock'
  | 'settings'
  | 'lock'
  | 'globe'
  | 'card'
  | 'shield'
  | 'logout'
  | 'plus'
  | 'eye'
  | 'eyeoff'
  | 'mail'
  | 'bolt'
  | 'history'
  | 'layers'
  | 'chart'
  | 'send'
  | 'refresh'
  | 'bell'
  | 'list'
  | 'share'
  | 'flame'
  | 'target'
  | 'lecture'
  | 'bank'
  | 'test'
  | 'folder'
  | 'scale'
  | 'doc'
  | 'user'
  | 'sliders'
  | 'language'
  | 'receipt'
  | 'help'
  | 'filter'
  | 'hl'
  | 'logo'
  | 'pulse'
  | 'phone'
  | 'trash'
  | 'crown'
  | 'wifi'
  | 'volume'
  | 'download'
  | 'type'
  | 'motion'
  | 'device'
  | 'grid'
  | 'hash'
  | 'image'
  | 'scissors'
  | 'link'
  | 'flag'
  | 'sort'
  | 'warn'
  | 'type2';

export const ICON_NAMES: readonly IconName[] = [
  'home',
  'learn',
  'practice',
  'current',
  'profile',
  'search',
  'arrow',
  'back',
  'chev',
  'chevl',
  'chevd',
  'close',
  'bookmark',
  'star',
  'spark',
  'play',
  'upload',
  'camera',
  'file',
  'cloud',
  'calendar',
  'mindmap',
  'xray',
  'db',
  'notes',
  'pen',
  'mic',
  'check',
  'x',
  'clock',
  'settings',
  'lock',
  'globe',
  'card',
  'shield',
  'logout',
  'plus',
  'eye',
  'eyeoff',
  'mail',
  'bolt',
  'history',
  'layers',
  'chart',
  'send',
  'refresh',
  'bell',
  'list',
  'share',
  'flame',
  'target',
  'lecture',
  'bank',
  'test',
  'folder',
  'scale',
  'doc',
  'user',
  'sliders',
  'language',
  'receipt',
  'help',
  'filter',
  'hl',
  'logo',
  'pulse',
  'phone',
  'trash',
  'crown',
  'wifi',
  'volume',
  'download',
  'type',
  'motion',
  'device',
  'grid',
  'hash',
  'image',
  'scissors',
  'link',
  'flag',
  'sort',
  'warn',
  'type2',
];

export const ICONS: Readonly<Record<IconName, IconDef>> = {
  // Source: PrepAssist.html L4660 (<symbol id="i-home">, static-markup)
  home: {
    id: 'i-home',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M3.5 10.5 12 4l8.5 6.5' } },
      { type: 'path', attrs: { d: 'M5.5 9v10.5h4.5v-6h4v6h4.5V9' } },
    ],
    source: 'PrepAssist.html L4660',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4661 (<symbol id="i-learn">, static-markup)
  learn: {
    id: 'i-learn',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: { d: 'M12 6.5c-2-1.6-4.6-2-8-2v13c3.4 0 6 .4 8 2 2-1.6 4.6-2 8-2v-13c-3.4 0-6 .4-8 2Z' },
      },
      { type: 'path', attrs: { d: 'M12 6.5v13' } },
    ],
    source: 'PrepAssist.html L4661',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4662 (<symbol id="i-practice">, static-markup)
  practice: {
    id: 'i-practice',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '4.5', y: '3.5', width: '15', height: '17', rx: '2' } },
      { type: 'path', attrs: { d: 'm8 9 1.5 1.5L12 8' } },
      { type: 'path', attrs: { d: 'M14 9.5h2.5' } },
      { type: 'path', attrs: { d: 'm8 15 1.5 1.5L12 14' } },
      { type: 'path', attrs: { d: 'M14 15.5h2.5' } },
    ],
    source: 'PrepAssist.html L4662',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4663 (<symbol id="i-current">, static-markup)
  current: {
    id: 'i-current',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 5.5h13v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z' } },
      { type: 'path', attrs: { d: 'M17 9h3v9.5a2 2 0 0 1-2 2' } },
      { type: 'path', attrs: { d: 'M7 9h7M7 12.5h7M7 16h4' } },
    ],
    source: 'PrepAssist.html L4663',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4664 (<symbol id="i-profile">, static-markup)
  profile: {
    id: 'i-profile',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '8.5', r: '3.8' } },
      { type: 'path', attrs: { d: 'M4.5 20c.8-3.6 3.8-5.6 7.5-5.6s6.7 2 7.5 5.6' } },
    ],
    source: 'PrepAssist.html L4664',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4665 (<symbol id="i-search">, static-markup)
  search: {
    id: 'i-search',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '11', cy: '11', r: '6.5' } },
      { type: 'path', attrs: { d: 'm20 20-4.2-4.2' } },
    ],
    source: 'PrepAssist.html L4665',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4666 (<symbol id="i-arrow">, static-markup)
  arrow: {
    id: 'i-arrow',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M5 12h14M13 6l6 6-6 6' } }],
    source: 'PrepAssist.html L4666',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4667 (<symbol id="i-back">, static-markup)
  back: {
    id: 'i-back',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M19 12H5M11 6l-6 6 6 6' } }],
    source: 'PrepAssist.html L4667',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4668 (<symbol id="i-chev">, static-markup)
  chev: {
    id: 'i-chev',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'm9 6 6 6-6 6' } }],
    source: 'PrepAssist.html L4668',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4669 (<symbol id="i-chevl">, static-markup)
  chevl: {
    id: 'i-chevl',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'm15 6-6 6 6 6' } }],
    source: 'PrepAssist.html L4669',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4670 (<symbol id="i-chevd">, static-markup)
  chevd: {
    id: 'i-chevd',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'm6 9 6 6 6-6' } }],
    source: 'PrepAssist.html L4670',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4671 (<symbol id="i-close">, static-markup)
  close: {
    id: 'i-close',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M6 6l12 12M18 6 6 18' } }],
    source: 'PrepAssist.html L4671',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4672 (<symbol id="i-bookmark">, static-markup)
  bookmark: {
    id: 'i-bookmark',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M6.5 4h11v16.5L12 16.5l-5.5 4Z' } }],
    source: 'PrepAssist.html L4672',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4672 (<symbol id="i-star">, static-markup)
  star: {
    id: 'i-star',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'm12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8Z',
          strokeLinejoin: 'round',
        },
      },
    ],
    source: 'PrepAssist.html L4672',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4673 (<symbol id="i-spark">, static-markup)
  spark: {
    id: 'i-spark',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: { d: 'M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z' },
      },
      {
        type: 'path',
        attrs: {
          d: 'M19 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5Z',
        },
      },
    ],
    source: 'PrepAssist.html L4673',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4674 (<symbol id="i-play">, static-markup)
  play: {
    id: 'i-play',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M8 5.5v13l10.5-6.5Z' } }],
    source: 'PrepAssist.html L4674',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4675 (<symbol id="i-upload">, static-markup)
  upload: {
    id: 'i-upload',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M12 15V4M7.5 8.5 12 4l4.5 4.5' } },
      { type: 'path', attrs: { d: 'M4.5 14.5v4a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-4' } },
    ],
    source: 'PrepAssist.html L4675',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4676 (<symbol id="i-camera">, static-markup)
  camera: {
    id: 'i-camera',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5Z',
        },
      },
      { type: 'circle', attrs: { cx: '12', cy: '12.5', r: '3.5' } },
    ],
    source: 'PrepAssist.html L4676',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4677 (<symbol id="i-file">, static-markup)
  file: {
    id: 'i-file',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M6 3.5h8l4.5 4.5v12.5H6Z' } },
      { type: 'path', attrs: { d: 'M14 3.5V8h4.5M9 12.5h6M9 16h6' } },
    ],
    source: 'PrepAssist.html L4677',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4678 (<symbol id="i-cloud">, static-markup)
  cloud: {
    id: 'i-cloud',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M7 18.5a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.7-1.2A4.6 4.6 0 0 1 17 18.5Z' } }],
    source: 'PrepAssist.html L4678',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4679 (<symbol id="i-calendar">, static-markup)
  calendar: {
    id: 'i-calendar',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '3.5', y: '5', width: '17', height: '15.5', rx: '2' } },
      { type: 'path', attrs: { d: 'M3.5 9.5h17M8 3v4M16 3v4' } },
      { type: 'path', attrs: { d: 'M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2' } },
    ],
    source: 'PrepAssist.html L4679',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4680 (<symbol id="i-mindmap">, static-markup)
  mindmap: {
    id: 'i-mindmap',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '2.6' } },
      { type: 'circle', attrs: { cx: '4.5', cy: '6', r: '1.8' } },
      { type: 'circle', attrs: { cx: '19.5', cy: '6', r: '1.8' } },
      { type: 'circle', attrs: { cx: '4.5', cy: '18', r: '1.8' } },
      { type: 'circle', attrs: { cx: '19.5', cy: '18', r: '1.8' } },
      { type: 'path', attrs: { d: 'm6 7.2 3.9 3.2M18 7.2l-3.9 3.2M6 16.8l3.9-3.2M18 16.8l-3.9-3.2' } },
    ],
    source: 'PrepAssist.html L4680',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4681 (<symbol id="i-xray">, static-markup)
  xray: {
    id: 'i-xray',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16',
        },
      },
      { type: 'path', attrs: { d: 'M4 12h16' } },
      { type: 'path', attrs: { d: 'M8 8.5h8M8 15.5h5' } },
    ],
    source: 'PrepAssist.html L4681',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4682 (<symbol id="i-db">, static-markup)
  db: {
    id: 'i-db',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'ellipse', attrs: { cx: '12', cy: '6', rx: '7', ry: '2.6' } },
      { type: 'path', attrs: { d: 'M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6' } },
      { type: 'path', attrs: { d: 'M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6' } },
    ],
    source: 'PrepAssist.html L4682',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4683 (<symbol id="i-notes">, static-markup)
  notes: {
    id: 'i-notes',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M5 4.5h10.5L19 8v11.5H5Z' } },
      { type: 'path', attrs: { d: 'M8.5 10h7M8.5 13.5h7M8.5 17h4' } },
    ],
    source: 'PrepAssist.html L4683',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4684 (<symbol id="i-pen">, static-markup)
  pen: {
    id: 'i-pen',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'm14.5 5.5 4 4L9 19H5v-4Z' } },
      { type: 'path', attrs: { d: 'm12.5 7.5 4 4' } },
    ],
    source: 'PrepAssist.html L4684',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4685 (<symbol id="i-mic">, static-markup)
  mic: {
    id: 'i-mic',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '9', y: '3.5', width: '6', height: '11', rx: '3' } },
      { type: 'path', attrs: { d: 'M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3' } },
    ],
    source: 'PrepAssist.html L4685',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4686 (<symbol id="i-check">, static-markup)
  check: {
    id: 'i-check',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'm5 12.5 4.5 4.5L19 7.5' } }],
    source: 'PrepAssist.html L4686',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4687 (<symbol id="i-x">, static-markup)
  x: {
    id: 'i-x',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M7 7l10 10M17 7 7 17' } }],
    source: 'PrepAssist.html L4687',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4688 (<symbol id="i-clock">, static-markup)
  clock: {
    id: 'i-clock',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '8' } },
      { type: 'path', attrs: { d: 'M12 7.5V12l3 2' } },
    ],
    source: 'PrepAssist.html L4688',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4689 (<symbol id="i-settings">, static-markup)
  settings: {
    id: 'i-settings',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '3' } },
      {
        type: 'path',
        attrs: { d: 'M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6' },
      },
    ],
    source: 'PrepAssist.html L4689',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4690 (<symbol id="i-lock">, static-markup)
  lock: {
    id: 'i-lock',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '5', y: '10.5', width: '14', height: '10', rx: '2' } },
      { type: 'path', attrs: { d: 'M8 10.5V8a4 4 0 0 1 8 0v2.5' } },
    ],
    source: 'PrepAssist.html L4690',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4691 (<symbol id="i-globe">, static-markup)
  globe: {
    id: 'i-globe',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '8.5' } },
      {
        type: 'path',
        attrs: {
          d: 'M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5S14.3 18.1 12 20.5C9.7 18.1 8.5 15.3 8.5 12S9.7 5.9 12 3.5Z',
        },
      },
    ],
    source: 'PrepAssist.html L4691',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4692 (<symbol id="i-card">, static-markup)
  card: {
    id: 'i-card',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '3.5', y: '5.5', width: '17', height: '13', rx: '2' } },
      { type: 'path', attrs: { d: 'M3.5 10h17M7 15h4' } },
    ],
    source: 'PrepAssist.html L4692',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4693 (<symbol id="i-shield">, static-markup)
  shield: {
    id: 'i-shield',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M12 3.5 19 6v5.5c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6Z' } },
      { type: 'path', attrs: { d: 'm9 12 2 2 4-4' } },
    ],
    source: 'PrepAssist.html L4693',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4694 (<symbol id="i-logout">, static-markup)
  logout: {
    id: 'i-logout',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M14 4.5H6.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H14' } },
      { type: 'path', attrs: { d: 'M10 12h10M16.5 8.5 20 12l-3.5 3.5' } },
    ],
    source: 'PrepAssist.html L4694',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4695 (<symbol id="i-plus">, static-markup)
  plus: {
    id: 'i-plus',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M12 5v14M5 12h14' } }],
    source: 'PrepAssist.html L4695',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4696 (<symbol id="i-eye">, static-markup)
  eye: {
    id: 'i-eye',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z' } },
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '3' } },
    ],
    source: 'PrepAssist.html L4696',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4697 (<symbol id="i-eyeoff">, static-markup)
  eyeoff: {
    id: 'i-eyeoff',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 4l16 16' } },
      {
        type: 'path',
        attrs: {
          d: 'M9.9 6c.7-.3 1.4-.5 2.1-.5 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 7.6A16.6 16.6 0 0 0 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1.1',
        },
      },
    ],
    source: 'PrepAssist.html L4697',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4698 (<symbol id="i-mail">, static-markup)
  mail: {
    id: 'i-mail',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '3.5', y: '5.5', width: '17', height: '13', rx: '2' } },
      { type: 'path', attrs: { d: 'm4 7 8 6 8-6' } },
    ],
    source: 'PrepAssist.html L4698',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4699 (<symbol id="i-bolt">, static-markup)
  bolt: {
    id: 'i-bolt',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M13 3 5.5 13.5H12L11 21l7.5-10.5H12Z' } }],
    source: 'PrepAssist.html L4699',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4700 (<symbol id="i-history">, static-markup)
  history: {
    id: 'i-history',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 12a8 8 0 1 0 2.4-5.7' } },
      { type: 'path', attrs: { d: 'M4 4.5v4h4' } },
      { type: 'path', attrs: { d: 'M12 8v4.5l3 1.8' } },
    ],
    source: 'PrepAssist.html L4700',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4701 (<symbol id="i-layers">, static-markup)
  layers: {
    id: 'i-layers',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'm12 4 8.5 4.5L12 13 3.5 8.5Z' } },
      { type: 'path', attrs: { d: 'm3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5' } },
    ],
    source: 'PrepAssist.html L4701',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4702 (<symbol id="i-chart">, static-markup)
  chart: {
    id: 'i-chart',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 19.5h16' } },
      { type: 'path', attrs: { d: 'M7 16v-5M11.5 16V7M16 16v-3' } },
    ],
    source: 'PrepAssist.html L4702',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4703 (<symbol id="i-send">, static-markup)
  send: {
    id: 'i-send',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M12 19V5M6 11l6-6 6 6' } }],
    source: 'PrepAssist.html L4703',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4704 (<symbol id="i-refresh">, static-markup)
  refresh: {
    id: 'i-refresh',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9' } },
      { type: 'path', attrs: { d: 'M19.5 4.5V9H15' } },
    ],
    source: 'PrepAssist.html L4704',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4705 (<symbol id="i-bell">, static-markup)
  bell: {
    id: 'i-bell',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15Z' } },
      { type: 'path', attrs: { d: 'M10 20.5a2 2 0 0 0 4 0' } },
    ],
    source: 'PrepAssist.html L4705',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4706 (<symbol id="i-list">, static-markup)
  list: {
    id: 'i-list',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M9 6.5h11M9 12h11M9 17.5h11' } },
      { type: 'circle', attrs: { cx: '4.8', cy: '6.5', r: '.9' } },
      { type: 'circle', attrs: { cx: '4.8', cy: '12', r: '.9' } },
      { type: 'circle', attrs: { cx: '4.8', cy: '17.5', r: '.9' } },
    ],
    source: 'PrepAssist.html L4706',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4707 (<symbol id="i-share">, static-markup)
  share: {
    id: 'i-share',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M12 15V3.5M7.5 8 12 3.5 16.5 8' } },
      { type: 'path', attrs: { d: 'M5 12v7.5h14V12' } },
    ],
    source: 'PrepAssist.html L4707',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4708 (<symbol id="i-flame">, static-markup)
  flame: {
    id: 'i-flame',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M12 21c-3.6 0-6-2.4-6-5.6 0-3.8 3.5-5.3 3.5-9.4 2.6 1.2 4.5 3.6 4.5 6.1.8-.5 1.4-1.4 1.6-2.6 1.6 1.5 2.4 3.4 2.4 5.6 0 3.4-2.4 5.9-6 5.9Z',
        },
      },
    ],
    source: 'PrepAssist.html L4708',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4709 (<symbol id="i-target">, static-markup)
  target: {
    id: 'i-target',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '8' } },
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '4.5' } },
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '1' } },
    ],
    source: 'PrepAssist.html L4709',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4710 (<symbol id="i-lecture">, static-markup)
  lecture: {
    id: 'i-lecture',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '3.5', y: '4.5', width: '17', height: '12', rx: '1.5' } },
      { type: 'path', attrs: { d: 'm10.5 8 4 2.5-4 2.5Z' } },
      { type: 'path', attrs: { d: 'M8 20h8' } },
    ],
    source: 'PrepAssist.html L4710',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4711 (<symbol id="i-bank">, static-markup)
  bank: {
    id: 'i-bank',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M5 4.5h12.5A1.5 1.5 0 0 1 19 6v14H6.5A1.5 1.5 0 0 1 5 18.5Z' } },
      { type: 'path', attrs: { d: 'M5 18.5A1.5 1.5 0 0 1 6.5 17H19' } },
      { type: 'path', attrs: { d: 'M9 8.5h6M9 11.5h4' } },
    ],
    source: 'PrepAssist.html L4711',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4712 (<symbol id="i-test">, static-markup)
  test: {
    id: 'i-test',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M9 3.5h6v3H9Z' } },
      {
        type: 'path',
        attrs: {
          d: 'M15 5h2.5A1.5 1.5 0 0 1 19 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-13A1.5 1.5 0 0 1 6.5 5H9',
        },
      },
      { type: 'path', attrs: { d: 'm8.5 13 2 2 4-4' } },
    ],
    source: 'PrepAssist.html L4712',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4713 (<symbol id="i-folder">, static-markup)
  folder: {
    id: 'i-folder',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M3.5 7A1.5 1.5 0 0 1 5 5.5h4.5l2 2H19A1.5 1.5 0 0 1 20.5 9v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18Z',
        },
      },
    ],
    source: 'PrepAssist.html L4713',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4714 (<symbol id="i-scale">, static-markup)
  scale: {
    id: 'i-scale',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M12 4v16M7 20h10M5 7h14' } },
      { type: 'path', attrs: { d: 'm5 7-2.5 6a2.8 2.8 0 0 0 5 0Zm14 0-2.5 6a2.8 2.8 0 0 0 5 0Z' } },
    ],
    source: 'PrepAssist.html L4714',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4715 (<symbol id="i-doc">, static-markup)
  doc: {
    id: 'i-doc',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z',
        },
      },
      { type: 'path', attrs: { d: 'M9 8h6M9 11.5h6M9 15h3' } },
    ],
    source: 'PrepAssist.html L4715',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4716 (<symbol id="i-user">, static-markup)
  user: {
    id: 'i-user',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '8.5', r: '3.5' } },
      { type: 'path', attrs: { d: 'M5.5 19.5c.7-3.2 3.3-5 6.5-5s5.8 1.8 6.5 5' } },
    ],
    source: 'PrepAssist.html L4716',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4717 (<symbol id="i-sliders">, static-markup)
  sliders: {
    id: 'i-sliders',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 7h10M18 7h2M4 17h4M12 17h8' } },
      { type: 'circle', attrs: { cx: '16', cy: '7', r: '2' } },
      { type: 'circle', attrs: { cx: '10', cy: '17', r: '2' } },
    ],
    source: 'PrepAssist.html L4717',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4718 (<symbol id="i-language">, static-markup)
  language: {
    id: 'i-language',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 5.5h9M8.5 4v1.5c0 4-2 7-4.5 8.5M6 9.5c1 2 3 3.5 5.5 4.5' } },
      { type: 'path', attrs: { d: 'm12.5 20 3.5-8.5 3.5 8.5M13.7 17.2h4.6' } },
    ],
    source: 'PrepAssist.html L4718',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4719 (<symbol id="i-receipt">, static-markup)
  receipt: {
    id: 'i-receipt',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M6 3.5h12V21l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5Z' } },
      { type: 'path', attrs: { d: 'M9 8h6M9 11.5h6M9 15h3.5' } },
    ],
    source: 'PrepAssist.html L4719',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4720 (<symbol id="i-help">, static-markup)
  help: {
    id: 'i-help',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '12', cy: '12', r: '8.5' } },
      { type: 'path', attrs: { d: 'M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.7' } },
      { type: 'circle', attrs: { cx: '12', cy: '17', r: '.6' } },
    ],
    source: 'PrepAssist.html L4720',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4721 (<symbol id="i-filter">, static-markup)
  filter: {
    id: 'i-filter',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M4 5.5h16l-6 7.5v5.5l-4 2v-7.5Z' } }],
    source: 'PrepAssist.html L4721',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L4722 (<symbol id="i-hl">, static-markup)
  hl: {
    id: 'i-hl',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'm15 4 5 5-8.5 8.5H7v-4.5Z' } }, { type: 'path', attrs: { d: 'M4 20.5h8' } }],
    source: 'PrepAssist.html L4722',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L5105 (<symbol id="logo">, static-markup)
  logo: {
    id: 'logo',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      {
        type: 'path',
        attrs: { d: 'M12 1.6 3 6.8v10.4l3.6 2.1V8.9L12 5.8l2.4 1.4 3.6-2.1Z', fill: '#F5A01F' },
      },
      { type: 'path', attrs: { d: 'M21 6.8v10.4L12 22.4l-3.6-2.1 9-5.2V8.9Z', fill: '#1B8AD3' } },
      {
        type: 'path',
        attrs: {
          d: 'M9.4 18.6v-7.4L12 9.7l2.6 1.5v5.4',
          fill: 'none',
          stroke: '#1B8AD3',
          strokeWidth: '2.2',
          strokeLinejoin: 'round',
        },
      },
    ],
    source: 'PrepAssist.html L5105',
    origin: 'static-markup',
  },
  // Source: PrepAssist.html L7079 (<symbol id="i-pulse">, injected-by-script)
  pulse: {
    id: 'i-pulse',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M3 12h4l2.5-6 4.5 12 2.5-6H21' } }],
    source: 'PrepAssist.html L7079',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7080 (<symbol id="i-phone">, injected-by-script)
  phone: {
    id: 'i-phone',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '7', y: '3', width: '10', height: '18', rx: '2.5' } },
      { type: 'path', attrs: { d: 'M11 17.5h2' } },
    ],
    source: 'PrepAssist.html L7080',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7081 (<symbol id="i-trash">, injected-by-script)
  trash: {
    id: 'i-trash',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5' } }],
    source: 'PrepAssist.html L7081',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7082 (<symbol id="i-crown">, injected-by-script)
  crown: {
    id: 'i-crown',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 18 3 7.5l5 4L12 5l4 6.5 5-4L20 18Z' } },
      { type: 'path', attrs: { d: 'M5 21h14' } },
    ],
    source: 'PrepAssist.html L7082',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7083 (<symbol id="i-wifi">, injected-by-script)
  wifi: {
    id: 'i-wifi',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M3 9a13 13 0 0 1 18 0M6 12.5a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0' } },
      { type: 'circle', attrs: { cx: '12', cy: '19', r: '.8' } },
    ],
    source: 'PrepAssist.html L7083',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7084 (<symbol id="i-volume">, injected-by-script)
  volume: {
    id: 'i-volume',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M4 9.5h3.5L12 6v12l-4.5-3.5H4Z' } },
      { type: 'path', attrs: { d: 'M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11' } },
    ],
    source: 'PrepAssist.html L7084',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7085 (<symbol id="i-download">, injected-by-script)
  download: {
    id: 'i-download',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M12 4v11M7.5 10.5 12 15l4.5-4.5' } },
      { type: 'path', attrs: { d: 'M4.5 15.5v3A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-3' } },
    ],
    source: 'PrepAssist.html L7085',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7086 (<symbol id="i-type">, injected-by-script)
  type: {
    id: 'i-type',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M4 7V5h10v2M9 5v14M6.5 19h5M14 12v-1.5h7V12M17.5 10.5V19M16 19h3' } }],
    source: 'PrepAssist.html L7086',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7087 (<symbol id="i-motion">, injected-by-script)
  motion: {
    id: 'i-motion',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '15', cy: '12', r: '5' } },
      { type: 'path', attrs: { d: 'M3 9h5M2 12h4M3 15h5' } },
    ],
    source: 'PrepAssist.html L7087',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7088 (<symbol id="i-device">, injected-by-script)
  device: {
    id: 'i-device',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '3', y: '5', width: '13', height: '10', rx: '1.5' } },
      { type: 'rect', attrs: { x: '17', y: '8', width: '4.5', height: '10', rx: '1' } },
      { type: 'path', attrs: { d: 'M6 19h7' } },
    ],
    source: 'PrepAssist.html L7088',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7637 (<symbol id="i-grid">, injected-by-script)
  grid: {
    id: 'i-grid',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '4', y: '4', width: '6.5', height: '6.5', rx: '1.8' } },
      { type: 'rect', attrs: { x: '13.5', y: '4', width: '6.5', height: '6.5', rx: '1.8' } },
      { type: 'rect', attrs: { x: '4', y: '13.5', width: '6.5', height: '6.5', rx: '1.8' } },
      { type: 'rect', attrs: { x: '13.5', y: '13.5', width: '6.5', height: '6.5', rx: '3.25' } },
    ],
    source: 'PrepAssist.html L7637',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7638 (<symbol id="i-hash">, injected-by-script)
  hash: {
    id: 'i-hash',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M9.5 4 8 20M16 4l-1.5 16M4.5 9h15M4 15h15' } }],
    source: 'PrepAssist.html L7638',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7639 (<symbol id="i-image">, injected-by-script)
  image: {
    id: 'i-image',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '3.5', y: '4.5', width: '17', height: '15', rx: '2' } },
      { type: 'circle', attrs: { cx: '9', cy: '10', r: '1.8' } },
      { type: 'path', attrs: { d: 'm4 18 5.5-5.5 4 4 2.5-2.5 4 4' } },
    ],
    source: 'PrepAssist.html L7639',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7640 (<symbol id="i-scissors">, injected-by-script)
  scissors: {
    id: 'i-scissors',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'circle', attrs: { cx: '6.5', cy: '7', r: '2.5' } },
      { type: 'circle', attrs: { cx: '6.5', cy: '17', r: '2.5' } },
      { type: 'path', attrs: { d: 'M8.6 8.4 20 17M8.6 15.6 20 7' } },
    ],
    source: 'PrepAssist.html L7640',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7641 (<symbol id="i-link">, injected-by-script)
  link: {
    id: 'i-link',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2' } },
      { type: 'path', attrs: { d: 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2' } },
    ],
    source: 'PrepAssist.html L7641',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7642 (<symbol id="i-flag">, injected-by-script)
  flag: {
    id: 'i-flag',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M5 21V4' } }, { type: 'path', attrs: { d: 'M5 4h11l-2 4 2 4H5' } }],
    source: 'PrepAssist.html L7642',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7643 (<symbol id="i-sort">, injected-by-script)
  sort: {
    id: 'i-sort',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [{ type: 'path', attrs: { d: 'M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5' } }],
    source: 'PrepAssist.html L7643',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7644 (<symbol id="i-warn">, injected-by-script)
  warn: {
    id: 'i-warn',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'path', attrs: { d: 'M12 4 2.5 20h19Z' } },
      { type: 'path', attrs: { d: 'M12 10v4.5' } },
      { type: 'circle', attrs: { cx: '12', cy: '17.2', r: '.7' } },
    ],
    source: 'PrepAssist.html L7644',
    origin: 'injected-by-script',
  },
  // Source: PrepAssist.html L7645 (<symbol id="i-type2">, injected-by-script)
  type2: {
    id: 'i-type2',
    viewBox: '0 0 24 24',
    attrs: {},
    shapes: [
      { type: 'rect', attrs: { x: '3', y: '6', width: '18', height: '12', rx: '2' } },
      { type: 'path', attrs: { d: 'M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 14h10' } },
    ],
    source: 'PrepAssist.html L7645',
    origin: 'injected-by-script',
  },
};

export type IllustrationSymbolName = 's4A' | 's4B' | 's4C';

export const ILLUSTRATION_SYMBOLS: Readonly<Record<IllustrationSymbolName, IconDef>> = {
  // Source: PrepAssist.html L8560 (<symbol id="s4A">, built by stepHTML())
  s4A: {
    id: 's4A',
    viewBox: null,
    attrs: { overflow: 'visible' },
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M-3.4 -80 L-3.4 -76 C-11 -75.5 -16.4 -72 -17.4 -65 L-20.4 -42 C-20.9 -37.5 -17.4 -37 -16.9 -41 L-14.4 -58 L-13.4 -44 C-13.4 -36 -12.4 -29 -11.4 -23 L-9.4 -2 C-9.4 .5 -4.4 .5 -4.4 -2 L-1.8 -30 L1.8 -30 L4.6 -8 C4.8 -5.8 9.4 -5.8 9.4 -8 L11.4 -23 C12.4 -29 13.4 -36 13.4 -44 L14.4 -58 L16.9 -41 C17.4 -37 20.9 -37.5 20.4 -42 L17.4 -65 C16.4 -72 11 -75.5 3.4 -76 L3.4 -80 Z',
        },
      },
      { type: 'ellipse', attrs: { cx: '0', cy: '-89', rx: '7.6', ry: '9.2' } },
      { type: 'rect', attrs: { x: '-11.5', y: '-71', width: '23', height: '27', rx: '7' } },
    ],
    source: 'PrepAssist.html L8560',
    origin: 'view-template',
    builtBy: 'stepHTML()',
  },
  // Source: PrepAssist.html L8561 (<symbol id="s4B">, built by stepHTML())
  s4B: {
    id: 's4B',
    viewBox: null,
    attrs: { overflow: 'visible' },
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M-3.4 -80 L-3.4 -76 C-11 -75.5 -16.4 -72 -17.4 -65 L-20.4 -42 C-20.9 -37.5 -17.4 -37 -16.9 -41 L-14.4 -58 L-13.4 -44 C-13.4 -36 -12.4 -29 -11.4 -23 L-9.4 -2 C-9.4 .5 -4.4 .5 -4.4 -2 L-1.8 -30 L1.8 -30 L4.6 -8 C4.8 -5.8 9.4 -5.8 9.4 -8 L11.4 -23 C12.4 -29 13.4 -36 13.4 -44 L14.4 -58 L16.9 -41 C17.4 -37 20.9 -37.5 20.4 -42 L17.4 -65 C16.4 -72 11 -75.5 3.4 -76 L3.4 -80 Z',
        },
      },
      { type: 'ellipse', attrs: { cx: '0', cy: '-89', rx: '7.4', ry: '9' } },
      {
        type: 'path',
        attrs: { d: 'M-7.6 -92 C-8 -101 8 -101 7.6 -92 C8.6 -86 7 -78 3 -76 L-3 -76 C-7 -78 -8.6 -86 -7.6 -92Z' },
      },
      { type: 'circle', attrs: { cx: '0', cy: '-99', r: '4' } },
    ],
    source: 'PrepAssist.html L8561',
    origin: 'view-template',
    builtBy: 'stepHTML()',
  },
  // Source: PrepAssist.html L8562 (<symbol id="s4C">, built by stepHTML())
  s4C: {
    id: 's4C',
    viewBox: null,
    attrs: { overflow: 'visible' },
    shapes: [
      {
        type: 'path',
        attrs: {
          d: 'M-3.4 -80 L-3.4 -76 C-11 -75.5 -16.4 -72 -17.4 -65 L-20.4 -42 C-20.9 -37.5 -17.4 -37 -16.9 -41 L-14.4 -58 L-13.4 -44 C-13.4 -36 -12.4 -29 -11.4 -23 L-9.4 -2 C-9.4 .5 -4.4 .5 -4.4 -2 L-1.8 -30 L1.8 -30 L4.6 -8 C4.8 -5.8 9.4 -5.8 9.4 -8 L11.4 -23 C12.4 -29 13.4 -36 13.4 -44 L14.4 -58 L16.9 -41 C17.4 -37 20.9 -37.5 20.4 -42 L17.4 -65 C16.4 -72 11 -75.5 3.4 -76 L3.4 -80 Z',
        },
      },
      { type: 'ellipse', attrs: { cx: '0', cy: '-89', rx: '7.8', ry: '9.2' } },
      { type: 'path', attrs: { d: 'M-8 -90 C-8 -100 8 -100 8 -90 L8 -86 C6 -94 -6 -94 -8 -86Z' } },
    ],
    source: 'PrepAssist.html L8562',
    origin: 'view-template',
    builtBy: 'stepHTML()',
  },
};
