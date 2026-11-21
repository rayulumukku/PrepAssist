#!/usr/bin/env node
// Writes the `owner` of every verb in actions.map.json (base or one of the six workstreams).
// The assignment was made by reading each handler (handlerSource in the map). The extractor keeps
// owner / native / test across regeneration, so this only needs re-running when a verb is added.
//   node scripts/set-action-owners.mjs          write
//   node scripts/set-action-owners.mjs --check  fail if a verb has no owner or the file is out of date
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'actions.map.json');

const OWNERS = {
  // shell: navigation and the generic element togglers (see src/actions/base.ts)
  base: 'jump tab push back tool sheet closeSheet toast chipToggle chipOne',
  // book, intro, auth, verify
  arrival: 'bookExit bookNext bookReplay sound introGo introNext introPrev introSkip authTab signin signup eye forgot forgotSend social resend verified changeEmail emailSave target',
  // the six tab panes, reels viewer, flashcards, Current filters, Learn spotlight
  tabs: 'learnF reel reelStep reelJump reelClose reelSave reelAsk heroGo flip fcNav fcLang fcRate toolGroup allTools revisions revDo revAll caDay caTopic caSrc caGs caFilter caDate caReset pxGo engN lxScanNote lxUp lxPyq',
  // quiz, question banks, test series, mains evaluation, answer bank
  practice: 'quiz quizClose opt qSubmit qNext qPrev qResults qGo mPick mStep mAdd mSubmit modelOpen engineGo testStart qbank pqPick pqNav pqLang pqReset pqHist pqGo tqTab tqLang tqPick tqClear tqGo tqStart abLang abP abOpen mainsWith mvMode mvLim mvCtx mvAdd mvDel mvRun mForce',
  // article reader, saved, mentor, search, edition calendar, mindmaps, plan, calendar
  study: 'article cmdk mentor mentorAsk mentorSend ctxToggle save mm planGo calDay caCal caPick caMon caRecent caDone arSize arNext svAdd svSave svRm svRmL mmTry mmGo mmOpen',
  // notes, tracker, X-Ray, syllabus, upload, vault, query
  library: 'upload uploaded xr qdb qdbAsk nrJump nrSave nrDl nrTest nrBackSync nrNext syOpen syP sySt syReset syTopic syDrill syMains syFilter upPick upClear upFolder upTagRm upGo vlTab vlSort vlWarn vlDel vlDelGo nsSplit nsSplitGo ntAdd ntCol ntAddGo ntOpt ntOptSet ntOptCus qdSubj qdAdd qdRm qdAsk qdGo nsSubj nhTab nhS xrScan xr2Toggle xr2Lens xr2Tap xr2Close xr2Pg xr2Practise xr2Syl xr2Unhl x4Sub x4Up x4Lens x4Ins x4Open x4Nav x4Step x4Tab x4Mcq x4McqReset x4Save x4Ask x4Quiz x4Term x4Flash x4Coach x4Aa ntSort ntStar ntUps ntMore ntIgn ntIgnAll ntMerge ntView ntInbox ntNew ntMode ntSubj ntImg ntCap ntPick ntFileX ntSave',
  // account, wallet, payments, plans, settings, status, legal, one more step, profile sheets
  account: 'logout setLang saved tog credits ledger topup pack buy byPay byReceipt restore wlSave acEdit acCancel acSave delAsk delGo meTog ssRerun lgGo legalSwap stepGo stepReplay stepSnd planFree',
};

const ownerOf = {};
for (const [owner, verbs] of Object.entries(OWNERS)) {
  for (const v of verbs.split(' ')) {
    if (ownerOf[v]) throw new Error(`verb "${v}" is listed under both ${ownerOf[v]} and ${owner}`);
    ownerOf[v] = owner;
  }
}

const text = fs.readFileSync(file, 'utf8');
const map = JSON.parse(text);
const missing = map.verbs.filter(v => !ownerOf[v.verb]).map(v => v.verb);
const unknown = Object.keys(ownerOf).filter(v => !map.verbs.some(x => x.verb === v));
if (missing.length || unknown.length) {
  console.error(`set-action-owners: no owner for [${missing.join(', ')}]; not in the map: [${unknown.join(', ')}]`);
  process.exit(1);
}
for (const v of map.verbs) v.owner = ownerOf[v.verb];
const indent = /^\{\n( +)"/.exec(text)?.[1].length ?? 2;
const out = JSON.stringify(map, null, indent) + (text.endsWith('\n') ? '\n' : '');
if (process.argv.includes('--check')) {
  if (out !== text) {
    console.error('set-action-owners: actions.map.json owners are out of date (run without --check)');
    process.exit(1);
  }
  console.log(`set-action-owners: ${map.verbs.length} verbs, all owned`);
} else {
  fs.writeFileSync(file, out);
  const counts = {};
  for (const v of map.verbs) counts[v.owner] = (counts[v.owner] || 0) + 1;
  console.log(`set-action-owners: ${map.verbs.length} verbs`, counts);
}
