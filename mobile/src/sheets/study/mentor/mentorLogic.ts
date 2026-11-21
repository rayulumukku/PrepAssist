// Source: PrepAssist.html L6834-L6845 (ctx), L6882-L6906 (reply)
// Pure logic of the AI mentor: the context the mentor sees (ctx) and the canned answers (reply).
// reply() returns the prototype's answer markup VERBATIM: its body below is L6883-L6905 copied
// character for character (only the type annotation on `c` is added). mentorMarkup.ts parses that
// markup into blocks for MentorAnswer.tsx. reply.test.ts runs the HTML's own reply() against this one.
import { ARTICLES, QUIZ } from '../../../data';
import type { ArticlesItem } from '../../../data';

/** What ctx() returns (L6837-L6844), stored as S.mctx. */
export interface MentorCtx {
  k: string;
  label: string;
  p: readonly string[];
  /** The article on screen (k === 'article'). */
  a?: ArticlesItem;
}

/** The parts of S that ctx() and reply() read. */
export interface MentorState {
  stack: readonly { id: string; arg?: string }[];
  tab: string;
  quiz: { i: number; showRes?: boolean } | null;
  mctx?: MentorCtx;
}

/** ctx() (L6834-L6845) */
export function ctx(S: MentorState): MentorCtx {
  const top = S.stack[S.stack.length - 1];
  const base = ['Explain Article 32 simply.', 'How should I revise Polity in 15 days?', 'Why was my Mains answer weak?'];
  if (top) {
    if (top.id === 'quiz' && S.quiz) { const q = QUIZ[S.quiz.i]; return { k: 'quiz', label: S.quiz.showRes ? 'Your quiz results · Writs' : `Question ${S.quiz.i + 1} · ${q.sub}`, p: S.quiz.i === 0 ? ['Why is statement 3 wrong?', 'Explain Article 32 simply.', 'Give me 3 similar questions'] : ['Explain this question simply', 'Give me 3 similar questions', 'Explain Article 32 simply.'] }; }
    if (top.id === 'article') { const a = ARTICLES.find(x => x.id === top.arg) as ArticlesItem; return { k: 'article', a, label: 'Article · ' + a.t.split(' ').slice(0, 4).join(' ') + '…', p: ['Summarise this for Prelims', 'What’s the Mains angle?', 'Explain Article 32 simply.'] }; }
    if (top.id === 'mainsResult' || top.id === 'mains') return { k: 'mains', label: 'Your evaluation · Article 32 answer', p: ['Why was my Mains answer weak?', 'Rewrite my introduction', 'How should I revise Polity in 15 days?'] };
    if (top.id === 'lesson' || top.id === 'mindmap' || top.id === 'xray') return { k: 'lesson', label: 'Lecture 4 · Constitutional Remedies', p: base };
  }
  const tabs: Record<string, string> = { home: 'Today’s plan · Fundamental Rights', learn: 'Your library', practice: 'Practice · Polity weak areas', current: 'Today’s current affairs', menu: 'Your toolkit', profile: 'Your progress' };
  return { k: S.tab, label: tabs[S.tab] || 'PrepAssist', p: base };
}

/** reply(q) (L6882-L6906): the answer markup for question q. */
export function reply(q: string, S: MentorState): string {
  const s = q.toLowerCase(); const c: { a?: ArticlesItem } = S.mctx || {};
  if (/statement 3|explain this question/.test(s) && S.quiz) {
    const qq = QUIZ[S.quiz.i];
    return `<h5>${/statement 3/.test(s) ? 'Statement 3 flips the real relationship' : 'Here’s the question, unpacked'}</h5><p>${qq.ex}</p><p><b>The trap:</b> UPSC often swaps “wider” and “narrower”. Remember it as <i>“226 is the bigger number — and the bigger power.”</i></p><div class="acts"><button class="chip" data-act="mentorAsk:Give me 3 similar questions">3 similar questions</button><button class="chip" data-act="push:mindmap">Open mindmap</button></div>`;
  }
  if (/article 32|art\.? ?32/.test(s)) return `<h5>Article 32, in one line</h5><p>If the State violates one of your Fundamental Rights, you can go <b>straight to the Supreme Court</b> — and that right to go is itself a Fundamental Right.</p>
    <p>Think of Fundamental Rights as a lock, and Article 32 as the key the Constitution hands every citizen. Without the key, the lock means little — which is why Dr Ambedkar called it the “heart and soul” of the Constitution.</p>
    <table><tr><th>Writ</th><th>Means</th><th>Used when</th></tr><tr><td>Habeas corpus</td><td>“Have the body”</td><td>Someone is detained unlawfully</td></tr><tr><td>Mandamus</td><td>“We command”</td><td>An official isn’t doing a public duty</td></tr><tr><td>Prohibition</td><td>“To forbid”</td><td>Stop a lower court before it oversteps</td></tr><tr><td>Certiorari</td><td>“To be certified”</td><td>Quash an order already passed</td></tr><tr><td>Quo warranto</td><td>“By what authority”</td><td>Someone holds a public office illegally</td></tr></table>
    <p><b>For Prelims, remember:</b> Art. 226 (High Courts) is <i>wider</i>; enforcement can be suspended under Art. 359 in an Emergency, except Arts. 20 and 21.</p>
    <div class="acts"><button class="chip" data-act="quiz">Practise 10 questions</button><button class="chip" data-act="push:mindmap">Open the mindmap</button></div>`;
  if (/15 days|revise polity/.test(s)) return `<h5>A 15-day Polity revision, built around your gaps</h5><p>Your Polity coverage is <b>58%</b> and accuracy is lowest in Writs (48%) and Emergency provisions (52%), so those get extra time.</p>
    <table><tr><th>Days</th><th>Focus</th></tr><tr><td>1–2</td><td>Making of the Constitution, Preamble, Union & territory, Citizenship</td></tr><tr><td>3–5</td><td>Fundamental Rights (+1 day on writs), DPSP, Fundamental Duties</td></tr><tr><td>6–8</td><td>Parliament & State legislature — bills, committees, privileges</td></tr><tr><td>9–10</td><td>President, PM & Council of Ministers, Governor</td></tr><tr><td>11–12</td><td>Judiciary — SC, HCs, PIL, tribunals</td></tr><tr><td>13</td><td>Federalism, Emergency provisions, Amendment & basic structure</td></tr><tr><td>14</td><td>Constitutional & statutory bodies</td></tr><tr><td>15</td><td>Full-length Polity mock + PYQ review (2013–2025)</td></tr></table>
    <ul><li>Each day: 2 h reading, 50 PYQs, and 10 minutes of flashcards before bed.</li><li>Every third day: write one GS II answer and run it through Mains Evaluation.</li></ul>
    <div class="acts"><button class="chip" data-act="toast:15-day plan added to your Study Calendar">Add to Study Calendar</button><button class="chip" data-act="push:calendar">See calendar</button></div>`;
  if (/weak|why was my|mains answer/.test(s)) return `<h5>Why your Article 32 answer scored 8.5 / 15</h5><p>It wasn’t knowledge — you know the writs well. It was <b>what the question asked for</b>.</p>
    <ol><li><b>You answered “what is Art. 32”, not “how has it expanded”.</b> The directive is <i>discuss judicial interpretation</i> — examiners look for cases showing evolution.</li><li><b>Only one case cited.</b> Add S.P. Gupta (PIL), Rudul Sah (compensation), Vineet Narain (continuing mandamus) and L. Chandra Kumar (basic structure).</li><li><b>60 words over the limit</b>, mostly spent defining writs. One compact line or table would do.</li><li><b>The conclusion didn’t conclude.</b> End with a way forward — e.g. strengthening High Courts while protecting direct access.</li></ol>
    <p>Fix points 1 and 2 and this answer moves to roughly 10.5–11.</p>
    <div class="acts"><button class="chip" data-act="mentorAsk:Rewrite my introduction">Rewrite my intro</button><button class="chip" data-act="mainsWith:mq1">Re-attempt</button></div>`;
  if (/introduction|intro/.test(s)) return `<h5>A sharper introduction (34 words)</h5><p style="font-family:var(--serif);font-size:16.5px;border-left:2px solid var(--rule-2);padding-left:12px">“Article 32 makes the enforcement of Fundamental Rights itself a Fundamental Right. Dr Ambedkar called it the Constitution’s ‘heart and soul’ — and the Supreme Court has steadily widened what that heart protects.”</p><p>Notice the last clause: it <b>sets up your argument</b> about expansion, so the examiner knows the answer is on track from line one.</p>`;
  if (/similar/.test(s)) return `<h5>Three questions on the same idea</h5><ol><li>Which writ can be issued against a private individual? <i>(Habeas corpus)</i></li><li>Under which Article can enforcement of FRs be suspended during an Emergency? <i>(Art. 359)</i></li><li>True or false: Parliament can empower any other court to issue writs. <i>(True — Art. 32(3))</i></li></ol><div class="acts"><button class="chip" data-act="quiz">Add to practice set</button></div>`;
  if (/summar/.test(s) && c.a) return `<h5>${c.a.t}</h5><ul>${c.a.pts.map(p => `<li>${p}</li>`).join('')}</ul><p><b>Remember for Prelims:</b> ${c.a.pts[0]}</p>`;
  if (/mains angle/.test(s) && c.a) return `<h5>The Mains angle</h5><p>${c.a.why}</p><p style="font-family:var(--serif);font-style:italic">Practice question: ${c.a.mq}</p><div class="acts"><button class="chip" data-act="push:mains">Write & evaluate</button></div>`;
  return `<h5>Let’s break that down</h5><p>Here’s how I’d approach “${q.replace(/</g, '&lt;')}” for UPSC:</p><ul><li><b>Anchor it in the syllabus</b> — find the GS paper and sub-topic it maps to.</li><li><b>Get the static base right</b> — one standard source, read once properly, then revised.</li><li><b>Link to current affairs</b> — the last 12 months of news give you examples.</li><li><b>Test it</b> — 10 PYQs, or one Mains answer through evaluation.</li></ul><p class="src">In the full product, this answer is generated live by PrepAssist AI.</p>`;
}
