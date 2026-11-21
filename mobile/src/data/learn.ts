// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Learn tab: courses and the Learn spotlight cards.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface CoursesItem {
  readonly id: string;
  readonly s: string;
  readonly t: string;
  readonly l: number;
  readonly p: number;
  readonly last: string;
}

// Source: PrepAssist.html L5200-L5206 (COURSES)
export const COURSES: readonly CoursesItem[] = [
  { id: 'c1', s: 'polity', t: 'Indian Polity: Foundations', l: 24, p: 65, last: 'Lecture 16 · Art. 32' },
  { id: 'c2', s: 'history', t: 'Modern Indian History', l: 31, p: 40, last: 'Lecture 12 · Moderates' },
  {
    id: 'c3',
    s: 'eco',
    t: 'Indian Economy: Concepts to Current',
    l: 28,
    p: 22,
    last: 'Lecture 6 · Money supply',
  },
  { id: 'c4', s: 'geo', t: 'Physical Geography of India', l: 20, p: 50, last: 'Lecture 10 · Monsoon' },
  { id: 'c5', s: 'env', t: 'Environment & Ecology', l: 18, p: 30, last: 'Lecture 5 · Wetlands' },
];

export interface MoreCoursesItem {
  readonly s: string;
  readonly t: string;
  readonly m: string;
  readonly p: number;
}

// Source: PrepAssist.html L5207-L5212 (MORE_COURSES)
export const MORE_COURSES: readonly MoreCoursesItem[] = [
  { s: 'ir', t: 'Current Affairs Monthly — October 2026', m: '12 lectures · New', p: 0 },
  { s: 'snt', t: 'CSAT: Reasoning & Comprehension', m: '22 lectures', p: 8 },
  { s: 'ethics', t: 'Ethics, Integrity & Aptitude', m: '16 lectures', p: 10 },
  { s: 'history', t: 'Answer Writing Programme — GS I', m: '9 sessions · Weekly', p: 0 },
];

export interface LxItem {
  readonly k: string;
  readonly n: string;
  readonly tag: string;
  readonly ic: string;
  readonly c: string;
  readonly act: string;
  readonly art: string;
}

// Source: PrepAssist.html L8237-L8246 (LX)
export const LX: readonly LxItem[] = [
  {
    k: 'notes',
    n: 'Notes',
    tag: 'Verified faculty compendiums',
    ic: 'notes',
    c: '#6C5DD3',
    act: 'push:notesys',
    art: '<g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><rect x="22" y="10" width="54" height="68" rx="5" transform="rotate(8 49 44)"/><rect x="10" y="14" width="54" height="68" rx="5" fill="rgba(255,255,255,.14)"/><path d="M20 30h30M20 40c6-2 10 2 16 0s10-2 14 0M20 50c6-2 10 2 16 0M20 60h22"/></g>',
  },
  {
    k: 'tracker',
    n: 'Notes Tracker',
    tag: 'Folders that pull in new updates',
    ic: 'learn',
    c: '#2F8A4A',
    act: 'push:tracker',
    art: '<g fill="#fff"><rect x="6" y="8" width="11" height="11" rx="3" opacity="0.7"/><rect x="21" y="8" width="11" height="11" rx="3" opacity="0.4"/><rect x="36" y="8" width="11" height="11" rx="3" opacity="1"/><rect x="51" y="8" width="11" height="11" rx="3" opacity="0.18"/><rect x="66" y="8" width="11" height="11" rx="3" opacity="0.7"/><rect x="6" y="23" width="11" height="11" rx="3" opacity="1"/><rect x="21" y="23" width="11" height="11" rx="3" opacity="0.4"/><rect x="36" y="23" width="11" height="11" rx="3" opacity="0.7"/><rect x="51" y="23" width="11" height="11" rx="3" opacity="0.7"/><rect x="66" y="23" width="11" height="11" rx="3" opacity="0.18"/><rect x="6" y="38" width="11" height="11" rx="3" opacity="1"/><rect x="21" y="38" width="11" height="11" rx="3" opacity="1"/><rect x="36" y="38" width="11" height="11" rx="3" opacity="0.4"/><rect x="51" y="38" width="11" height="11" rx="3" opacity="0.7"/><rect x="66" y="38" width="11" height="11" rx="3" opacity="1"/><rect x="6" y="53" width="11" height="11" rx="3" opacity="0.7"/><rect x="21" y="53" width="11" height="11" rx="3" opacity="0.18"/><rect x="36" y="53" width="11" height="11" rx="3" opacity="0.4"/><rect x="51" y="53" width="11" height="11" rx="3" opacity="1"/><rect x="66" y="53" width="11" height="11" rx="3" opacity="0.7"/></g>',
  },
  {
    k: 'xray',
    n: 'X-Ray Reading',
    tag: 'Every PYQ line, highlighted',
    ic: 'xray',
    c: '#1B8AD3',
    act: 'push:xrayhome',
    art: '<g><rect x="8" y="8" width="58" height="74" rx="5" fill="rgba(255,255,255,.16)" stroke="#fff" stroke-width="1.4"/><rect x="16" y="20" width="40" height="4" rx="2" fill="#fff" opacity=".5"/><rect x="16" y="30" width="40" height="7" rx="2" fill="#FFE08A"/><rect x="16" y="43" width="34" height="4" rx="2" fill="#fff" opacity=".5"/><rect x="16" y="53" width="40" height="7" rx="2" fill="#FFE08A"/><circle cx="62" cy="60" r="15" fill="none" stroke="#fff" stroke-width="4"/><path d="M73 71l10 10" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>',
  },
  {
    k: 'cloud',
    n: 'Cloud Upload',
    tag: 'Your PDFs, searchable by AI',
    ic: 'cloud',
    c: '#E8890C',
    act: 'push:upload',
    art: '<g fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M24 62h-4a14 14 0 0 1-2-27.9A20 20 0 0 1 56 28a16 16 0 0 1 8 32h-6"/><path d="M41 74V44M30 54l11-11 11 11"/></g>',
  },
];
