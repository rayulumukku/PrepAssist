// Source: PrepAssist.html L6939-L6949 (cmdk: draw)
// The search sheet's matching, as pure logic: what draw() puts in #cmdRes for the input value.
import { ARTICLES, INLINE_draw_L6943, TOOLS } from '../../../data';
import type { ArticlesItem, ToolsItem } from '../../../data';

export interface SearchResult {
  tools: ToolsItem[];
  /** [title, subtitle, data-act] */
  topics: (readonly string[])[];
  arts: ArticlesItem[];
  /** `v` as draw() computed it (lower-cased, trimmed), for the "Nothing found" line. */
  v: string;
}

export function search(value: string): SearchResult {
  const v = value.toLowerCase().trim();
  const m = (x: string): boolean => !v || x.toLowerCase().includes(v);
  const tools = TOOLS.filter(x => m(x.n + ' ' + x.d));
  const topics = INLINE_draw_L6943.filter(x => m(x[0] + x[1]));
  const arts = ARTICLES.filter(a => m(a.t + a.topic)).slice(0, 3);
  return { tools, topics, arts, v };
}

export const isEmpty = (r: SearchResult): boolean => !r.tools.length && !r.topics.length && !r.arts.length;
