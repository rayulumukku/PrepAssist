// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// App-chrome strings in English and Hindi, exactly as in the HTML.
// Lookup in the HTML (PrepAssist.html L5140): const t = k => (I18N[S.lang] && I18N[S.lang][k]) || I18N.en[k] || k;
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export type Lang = 'en' | 'hi';

export type I18nKey =
  | 'home'
  | 'learn'
  | 'practice'
  | 'current'
  | 'menu'
  | 'profile'
  | 'greet_morning'
  | 'greet_afternoon'
  | 'greet_evening'
  | 'today'
  | 'brief'
  | 'flash'
  | 'progress'
  | 'tools'
  | 'days'
  | 'name';

export const LANGS: readonly Lang[] = ['en', 'hi'];

export const I18N_KEYS: readonly I18nKey[] = [
  'home',
  'learn',
  'practice',
  'current',
  'menu',
  'profile',
  'greet_morning',
  'greet_afternoon',
  'greet_evening',
  'today',
  'brief',
  'flash',
  'progress',
  'tools',
  'days',
  'name',
];

// Source: PrepAssist.html L5136-L5139 (I18N)
export const I18N: Readonly<Record<Lang, Readonly<Record<I18nKey, string>>>> = {
  en: {
    home: 'Home',
    learn: 'Learn',
    practice: 'Practice',
    current: 'Current',
    menu: 'Menu',
    profile: 'Profile',
    greet_morning: 'Good morning',
    greet_afternoon: 'Good afternoon',
    greet_evening: 'Good evening',
    today: 'Today',
    brief: "Today's Briefing",
    flash: 'Daily flashcards',
    progress: 'Study progress',
    tools: 'Study tools',
    days: 'days to Prelims',
    name: 'Divya',
  },
  hi: {
    home: 'होम',
    learn: 'सीखें',
    practice: 'अभ्यास',
    current: 'समसामयिकी',
    menu: 'मेनू',
    profile: 'प्रोफ़ाइल',
    greet_morning: 'सुप्रभात',
    greet_afternoon: 'नमस्कार',
    greet_evening: 'शुभ संध्या',
    today: 'आज',
    brief: 'आज की ख़बरें',
    flash: 'दैनिक फ़्लैशकार्ड',
    progress: 'अध्ययन प्रगति',
    tools: 'अध्ययन उपकरण',
    days: 'दिन प्रारंभिक परीक्षा तक',
    name: 'दिव्या',
  },
};
