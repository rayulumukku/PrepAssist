// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Study tools registry.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface ToolsItem {
  readonly id: string;
  readonly n: string;
  readonly ic: string;
  readonly g: string;
  readonly d: string;
  readonly ai?: number;
}

// Source: PrepAssist.html L5185-L5198 (TOOLS)
export const TOOLS: readonly ToolsItem[] = [
  { id: 'courses', n: 'Courses & Lectures', ic: 'lecture', g: 'learn', d: 'Video lectures by subject' },
  { id: 'xray', n: 'X-Ray Reader', ic: 'xray', g: 'learn', ai: 1, d: 'Read PDFs with PYQ highlights' },
  { id: 'mindmap', n: 'AI Mindmaps', ic: 'mindmap', g: 'learn', ai: 1, d: 'Visual maps of any topic' },
  { id: 'notes', n: 'Notes', ic: 'notes', g: 'learn', d: 'Your notebooks, synced' },
  { id: 'engine', n: 'AI Prelims Engine', ic: 'bolt', g: 'practice', ai: 1, d: 'Generate a custom test' },
  { id: 'tests', n: 'Test Series', ic: 'test', g: 'practice', d: 'Scheduled tests → quiz' },
  {
    id: 'mains',
    n: 'AI Mains Evaluation',
    ic: 'scale',
    g: 'practice',
    ai: 1,
    d: 'Evaluate handwritten answers',
  },
  { id: 'answerbank', n: 'Mains Answer Bank', ic: 'bank', g: 'practice', d: 'Questions with model answers' },
  { id: 'calendar', n: 'Study Calendar', ic: 'calendar', g: 'organise', d: 'Your schedule & exam dates' },
  { id: 'cloud', n: 'Cloud Documents', ic: 'cloud', g: 'organise', d: 'Your Cloud Data Vault' },
  { id: 'querydb', n: 'Query Database', ic: 'db', g: 'organise', ai: 1, d: 'Ask questions of your notes' },
  { id: 'mentor', n: 'AI Mentor', ic: 'spark', g: 'organise', ai: 1, d: 'Ask PrepAssist anything' },
];
