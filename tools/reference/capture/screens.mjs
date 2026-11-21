// The definitive list of captured screens/states of PrepAssist.html.
//
// A scenario is one fresh page load driven through a list of steps; every
// { capture } step writes one reference/<viewport>/<id>/ folder. Steps:
//   { goto: 'home' }            load PrepAssist.html#home ('' = no hash = the book)
//   { call: "A.push('quiz')" }  evaluate an expression in the page's global scope
//   { act: 'opt:1' }            click the visible [data-act="opt:1"] in the top-most layer
//   { click: '#ask' }           click the first visible element matching a selector
//   { fill: ['#cmdIn', 'art'] } set an input's value and fire input + change
//   { run: 1500 }               advance the fake clock, then wait for animations to finish
//   { reveal: '#hero' }         centre the element in its nearest scroll container (sets scrollTop)
//   { until: 3000 }             wait until 3000 ms of real time have passed since the last action
// Every goto/call/act/click is followed by run 600 unless it carries its own `run`.
// Capture fields: id, kind, title, root (CSS selector; views default to the top
// page, sheets to #sheet), view/sheet (registry key), arg, defs (global function
// names whose source line ranges go into index.json), markup (static line
// ranges), notes, timeDependent, expect (page expression that must be true),
// expectToast, scroller (null = no scroll captures), timeline, settleMaxMs.

const cap = (id, kind, title, extra = {}) => ({ capture: { id, kind, title, ...extra } });
const scn = (id, steps, extra = {}) => ({ id, ...extra, steps });
const one = (id, kind, title, steps, extra = {}) => scn(id, [...steps, cap(id, kind, title, extra)], extra.time ? { time: extra.time } : {});
const push = (v, arg) => ({ call: `A.push(${JSON.stringify(arg ? `${v}:${arg}` : v)})` });
/** one view pushed over a tab through the dispatcher's own push action */
const view = (id, title, tab, v, arg, extra = {}) => one(id, 'view', title, [{ goto: tab }, push(v, arg)], { view: v, arg: arg ?? null, ...extra });
const TOAST_GONE = { run: 3000 }; // toasts hide after 2400 ms

const T_CLOCK = 'Clock-dependent: fixed at Sat 24 Oct 2026 09:41 IST.';
const STAGE_MARKUP = {
  book: { what: 'static markup #s-book (incl. page <template>s)', lines: [4757, 4864] },
  intro: { what: 'static markup #s-intro', lines: [4867, 4937] },
  auth: { what: 'static markup #s-auth', lines: [4940, 5015] },
  verify: { what: 'static markup #s-verify', lines: [5018, 5073] },
  shell: { what: 'static app shell #s-app, #layer, #ask, #scrim, #sheet, #toast', lines: [5076, 5102] },
};
const tabX = (name, fn) => ({ root: `#t-${name}`, defs: [fn], markup: [STAGE_MARKUP.shell] });

// ------------------------------------------------------------------ stages
const BOOK = { root: '#s-book', scroller: null, markup: [STAGE_MARKUP.book], defs: ['runBook', 'buildBook', 'makeLeaf3', 'setCtl', 'openBook', 'turnPage', 'camTo', 'startDust'],
  domPrune: '.lv .st .st > .fc > .clip',
  timeDependent: 'Dust motes on <canvas id="dust"> are positioned with Math.random(), so the canvas pixels differ run to run. The remote Unsplash photo on the plate page needs the network (onerror swaps in an inline illustration). The 3 s auto-advance ring (.auto) is a CSS animation: it is captured at its end state.' };
const stages = [
  scn('book', [
    { goto: '', run: 300 },
    cap('stage-book-0-closed', 'stage', 'Book opening: closed cover on the desk', { ...BOOK, expect: 'S.stage === "book" && BK.step === 0 && !BK.busy', notes: 'Rest frame before the cover opens by itself at 1400 ms (runBook). Captured at 300 ms of fake time.' }),
    { run: 3300 },
    cap('stage-book-1-page1', 'stage', 'Book opening: cover open, page 1 (dot 1)', { ...BOOK, expect: 'BK.step === 1 && !BK.busy', notes: 'openBook() ran by itself at 1400 ms: cover swing 1500 ms + camera move 2000 ms. The book then auto-advances every 3000 ms unless touched.' }),
    { act: 'bookNext', run: 1400 },
    cap('stage-book-2-page2', 'stage', 'Book opening: page 2 (dot 2)', { ...BOOK, expect: 'BK.step === 2 && !BK.busy', notes: 'turnPage(): leaf turn 1100 ms.' }),
    { act: 'bookNext', run: 1400 },
    cap('stage-book-3-page3', 'stage', 'Book opening: page 3 (dot 3)', { ...BOOK, expect: 'BK.step === 3 && !BK.busy' }),
    { act: 'bookNext', run: 1400 },
    cap('stage-book-4-final', 'stage', 'Book opening: final page, "Start preparing"', { ...BOOK, expect: 'BK.step === 4 && !BK.busy', notes: 'Final state: #bkCtl.last and #s-book.p3; the next button reads "Start preparing". bookNext / bookExit:skip then runs bookExit(): 520 ms fade, go("auth").' }),
  ]),
  scn('intro', [
    { goto: 'intro' },
    cap('stage-intro-1', 'stage', 'Intro step 1 of 4', { root: '#s-intro', markup: [STAGE_MARKUP.intro], defs: ['setIntro', 'introNext'], expect: 'S.intro === 0', notes: 'Reached by hash #intro (A.jump). In the normal flow the book exits straight to auth; intro is reachable only by jump.' }),
    { act: 'introNext' },
    cap('stage-intro-2', 'stage', 'Intro step 2 of 4', { root: '#s-intro', markup: [STAGE_MARKUP.intro], defs: ['setIntro'], expect: 'S.intro === 1' }),
    { act: 'introNext' },
    cap('stage-intro-3', 'stage', 'Intro step 3 of 4', { root: '#s-intro', markup: [STAGE_MARKUP.intro], defs: ['setIntro'], expect: 'S.intro === 2' }),
    { act: 'introNext' },
    cap('stage-intro-4', 'stage', 'Intro step 4 of 4 ("Get Started")', { root: '#s-intro', markup: [STAGE_MARKUP.intro], defs: ['setIntro'], expect: 'S.intro === 3' }),
  ]),
  scn('auth-signin', [
    { goto: 'auth' },
    cap('stage-auth-signin', 'stage', 'Auth: sign-in mode', { root: '#s-auth', markup: [STAGE_MARKUP.auth], defs: ['authTab', 'submitAuth', 'startCountdown'], expect: 'S.authMode === "in"' }),
    { act: 'eye:inPw' },
    cap('stage-auth-signin-password-shown', 'stage', 'Auth: sign-in, password revealed (eye toggled)', { root: '#s-auth', markup: [STAGE_MARKUP.auth], scroller: null }),
    { act: 'eye:inPw' },
    { act: 'forgot' },
    cap('sheet-forgot', 'sheet', 'Sheet: Reset your password (from sign-in)', { sheet: 'forgot', notes: 'The email field is prefilled from #inEmail.' }),
    { act: 'closeSheet' },
    { fill: ['#inEmail', ''] }, { fill: ['#inPw', ''] },
    { act: 'signin' },
    cap('stage-auth-signin-empty-error', 'stage', 'Auth: sign-in with empty fields (error highlight + toast)', { root: '#s-auth', markup: [STAGE_MARKUP.auth], defs: ['submitAuth'], expectToast: true, scroller: null, notes: 'First tap with empty fields marks them .err and shows a toast; a second tap continues with demo details.' }),
  ]),
  scn('auth-signup', [
    { goto: 'auth' },
    { act: 'authTab:up' },
    cap('stage-auth-signup', 'stage', 'Auth: create-account mode', { root: '#s-auth', markup: [STAGE_MARKUP.auth], defs: ['authTab', 'pwStrength'], expect: 'S.authMode === "up"', notes: '#upName receives focus 400 ms after switching.' }),
    { fill: ['#upPw', 'Abcdefg1!'] },
    cap('stage-auth-signup-password-typed', 'stage', 'Auth: create account with a password typed (strength meter is hidden)', { root: '#s-auth', markup: [STAGE_MARKUP.auth], defs: ['pwStrength'], scroller: null, expect: 'document.querySelector("#pwS span").textContent === "Strong" && getComputedStyle(document.querySelector("#pwS")).display === "none"', notes: 'pwStrength() still runs on input and fills #pwS (Too short / Weak / Fair / Good / Strong), but the final CSS has #s-auth #pwS{display:none!important} (L1146), so no password-strength state is ever visible. This capture proves it: the meter says "Strong" and is not rendered.' }),
    { fill: ['#upPw', ''] },
    { act: 'signup' },
    cap('stage-auth-signup-empty-error', 'stage', 'Auth: create account with empty fields (error highlight + toast)', { root: '#s-auth', markup: [STAGE_MARKUP.auth], defs: ['submitAuth'], expectToast: true }),
    TOAST_GONE,
    { fill: ['#upName', 'Divya Sharma'] }, { fill: ['#upPhone', '98765 43210'] }, { fill: ['#upEmail', 'divya.sharma@gmail.com'] }, { fill: ['#upPw', 'Abcdefg1!'] }, { fill: ['#upPw2', 'Abcdefg1'] },
    { act: 'signup' },
    cap('stage-auth-signup-mismatch', 'stage', 'Auth: create account, passwords do not match (toast)', { root: '#s-auth', markup: [STAGE_MARKUP.auth], defs: ['submitAuth'], expectToast: true }),
  ]),
  scn('verify', [
    { goto: 'verify' },
    cap('stage-verify', 'stage', 'Verify email: initial', { root: '#s-verify', markup: [STAGE_MARKUP.verify], defs: ['go', 'verified', 'resend'] }),
    { act: 'changeEmail' },
    cap('sheet-changeEmail', 'sheet', 'Sheet: Change email (from verify)', { sheet: 'changeEmail' }),
    { act: 'closeSheet' },
    { act: 'resend' },
    cap('stage-verify-resent', 'stage', 'Verify email: after "Resend link" (toast, 30 s cooldown)', { root: '#s-verify', markup: [STAGE_MARKUP.verify], defs: ['resend'], expectToast: true, timeDependent: 'The resend button counts down once a second ("Resend in 30s" at capture).' }),
    TOAST_GONE,
    { act: 'verified' },
    cap('stage-verify-verified', 'stage', 'Verify email: verified state', { root: '#s-verify', markup: [STAGE_MARKUP.verify], defs: ['verified'], expect: 'document.querySelector("#vf").classList.contains("done")', notes: 'Shown for 1100 ms, then go("app"). Captured 600 ms after the tap.' }),
  ]),
];

// ------------------------------------------------------------------ tabs
const HOME_T = `${T_CLOCK} Greeting by hour (<12 morning, <17 afternoon, else evening); sky phase by hour (night <5 or >=20, morning <11, day <17, evening); the date line and Daily Briefing date come from new Date(); the day-plan arc marks the current time. The announcements carousel auto-advances every 6000 ms.`;
const tabs = [
  scn('tab-home', [
    { goto: 'home' },
    cap('tab-home', 'tab', 'Home tab: English, morning (Ask button full)', { ...tabX('home', 'renderHome'), timeDependent: HOME_T, expect: 'S.tab === "home" && !document.querySelector("#ask").classList.contains("mini")', notes: 'Hash start #home. Captured 600 ms after load, before the Ask button collapses (3500 ms).' }),
    cap('overlay-ask-full', 'overlay', 'Ask PrepAssist button: full (label visible)', { root: '#ask', scroller: null, markup: [{ what: 'static markup #ask', lines: [5095, 5098] }], defs: ['syncChrome', 'renderAll'], notes: 'Same moment as tab-home; dom.json root is the button. It collapses to mini 3500 ms after the app first renders, when the tab is scrolled down past 120 px, and whenever a page is pushed.' }),
    { run: 3200 },
    cap('overlay-ask-mini', 'overlay', 'Ask PrepAssist button: mini (collapsed after 3500 ms)', { root: '#ask', scroller: null, markup: [{ what: 'static markup #ask', lines: [5095, 5098] }], defs: ['syncChrome', 'renderAll'], expect: 'document.querySelector("#ask").classList.contains("mini")' }),
  ]),
  scn('tab-home-toast', [
    { goto: 'home' },
    { call: "A.toast('Seat reserved — we’ll remind you on Saturday')" },
    cap('overlay-toast', 'overlay', 'Toast visible (over Home)', { root: '#toast', scroller: null, defs: ['toast'], markup: [{ what: 'static markup #toast', lines: [5102, 5102] }], expectToast: true, notes: 'The message is the one on the 4th announcement card (data-act="toast:Seat reserved…"). A toast stays 2400 ms. Other captures with a toast on screen say so in their viewport entry (toast field).' }),
  ]),
  one('tab-home-day', 'tab', 'Home tab at 14:10 (afternoon greeting, "day" sky)', [{ goto: 'home' }], { ...tabX('home', 'renderHome'), time: '2026-10-24T14:10:00+05:30', timeDependent: HOME_T }),
  one('tab-home-evening', 'tab', 'Home tab at 18:20 (evening greeting, "evening" sky)', [{ goto: 'home' }], { ...tabX('home', 'renderHome'), time: '2026-10-24T18:20:00+05:30', timeDependent: HOME_T }),
  one('tab-home-night', 'tab', 'Home tab at 21:30 (evening greeting, "night" sky)', [{ goto: 'home' }], { ...tabX('home', 'renderHome'), time: '2026-10-24T21:30:00+05:30', timeDependent: HOME_T }),
  scn('tab-home-hero', [
    { goto: 'home' }, { reveal: '#hero' },
    cap('tab-home-hero-1', 'state', 'Home: announcements carousel, card 1 of 4', { ...tabX('home', 'renderHome'), defs: ['renderHome', 'bannerHTML', 'initHero', 'heroGo'], scroller: null, expect: 'S.hero === 0' }),
    { act: 'heroGo:1', run: 300 }, { run: 200 },
    cap('tab-home-hero-2', 'state', 'Home: announcements carousel, card 2 of 4', { ...tabX('home', 'renderHome'), defs: ['bannerHTML', 'heroGo'], scroller: null, expect: 'S.hero === 1' }),
    { act: 'heroGo:2', run: 300 }, { run: 200 },
    cap('tab-home-hero-3', 'state', 'Home: announcements carousel, card 3 of 4', { ...tabX('home', 'renderHome'), defs: ['bannerHTML', 'heroGo'], scroller: null, expect: 'S.hero === 2' }),
    { act: 'heroGo:3', run: 300 }, { run: 200 },
    cap('tab-home-hero-4', 'state', 'Home: announcements carousel, card 4 of 4', { ...tabX('home', 'renderHome'), defs: ['bannerHTML', 'heroGo'], scroller: null, expect: 'S.hero === 3' }),
  ]),
  scn('tab-home-flashcards', [
    { goto: 'home' }, { reveal: '#fcSwipe' },
    cap('tab-home-flashcard-front', 'state', 'Home: daily flashcard, question side', { ...tabX('home', 'renderHome'), defs: ['fcFaces', 'setFc', 'initDeck'], scroller: null }),
    { call: 'A.flip()' },
    cap('tab-home-flashcard-flipped', 'state', 'Home: daily flashcard flipped (answer + rating buttons)', { ...tabX('home', 'renderHome'), defs: ['fcFaces', 'initDeck'], scroller: null, expect: 'document.querySelector("#fc").classList.contains("flip")', notes: 'A tap on the card calls A.flip() from the pointerup handler in initDeck(); the capture calls A.flip() directly.' }),
    { act: 'fcLang:hi' },
    cap('tab-home-flashcard-hindi', 'state', 'Home: daily flashcard in Hindi (fcLang:hi)', { ...tabX('home', 'renderHome'), defs: ['fcFaces'], scroller: null }),
    { act: 'fcLang:en' }, { call: 'A.flip()' },
    { act: 'fcRate:got' },
    cap('tab-home-flashcard-rated', 'state', 'Home: flashcard rated "Got it" (toast, next card)', { ...tabX('home', 'renderHome'), defs: ['setFc'], scroller: null, expectToast: true, expect: 'S.fc === 1' }),
  ]),
  scn('lang-hindi', [
    { goto: 'profile' },
    { act: 'sheet:language' },
    cap('sheet-language', 'sheet', 'Sheet: Language (English selected)', { sheet: 'language' }),
    { act: 'setLang:hi' },
    cap('tab-profile-hi-toast', 'state', 'Profile right after switching to Hindi (toast "भाषा: हिन्दी")', { ...tabX('profile', 'renderProfile'), defs: ['relabel', 'renderProfile'], expectToast: true, scroller: null }),
    TOAST_GONE,
    cap('tab-profile-hi', 'tab', 'Profile tab with Hindi selected', { ...tabX('profile', 'renderProfile'), defs: ['relabel', 'renderProfile'], expect: 'S.lang === "hi"', notes: 'Only the nav labels, the Home tab chrome strings (I18N) and the Language row value change; the rest of Profile stays English.' }),
    { act: 'tab:home' },
    cap('tab-home-hi', 'tab', 'Home tab in Hindi', { ...tabX('home', 'renderHome'), defs: ['relabel', 'renderHome', 't'], expect: 'S.lang === "hi" && S.tab === "home"', timeDependent: HOME_T, notes: 'Reached through Profile > Language > हिन्दी, then the Home nav button.' }),
    { act: 'tab:profile' }, { act: 'sheet:language' },
    cap('sheet-language-hi', 'sheet', 'Sheet: Language (Hindi selected)', { sheet: 'language' }),
  ]),
  one('tab-learn', 'tab', 'Learn tab', [{ goto: 'learn' }], { ...tabX('learn', 'renderLearn'), defs: ['renderLearn', 'ntPeek', 'bookCover'], notes: 'renderLearn is wrapped twice (Learn spotlight L8250, X-Ray v4 L10064); the last definition is what runs.' }),
  scn('tab-practice', [
    { goto: 'practice' },
    cap('tab-practice', 'tab', 'Practice tab: Prelims section', { ...tabX('practice', 'renderPractice'), expect: 'S.px !== "mains"' }),
    { act: 'pxGo:mains' },
    cap('tab-practice-mains', 'tab', 'Practice tab: Mains section', { ...tabX('practice', 'renderPractice'), expect: 'S.px === "mains"' }),
  ]),
  scn('tab-current', [
    { goto: 'current' },
    cap('tab-current', 'tab', "Current tab: today's edition, all sources", { ...tabX('current', 'renderCurrent'), defs: ['renderCurrent', 'caPool', 'cxLead', 'cxCard'], timeDependent: `${T_CLOCK} The edition date, issue number and the calendar are derived from TODAY (L7092).` }),
    { act: 'caSrc:The Hindu' },
    cap('tab-current-source-hindu', 'tab', 'Current tab: source filter "The Hindu"', { ...tabX('current', 'renderCurrent'), expect: 'S.ca.src === "The Hindu"' }),
    { act: 'caSrc:All' },
    { act: 'caFilter' },
    cap('sheet-current-filter', 'sheet', 'Sheet: Filter by paper (Current)', { fns: ['A.caFilter'], notes: 'Built inline by A.caFilter (L7595); not in SHEETS. Papers with no story for the current source are disabled.' }),
    { act: 'caGs:gs3' },
    cap('tab-current-gs3', 'tab', 'Current tab: paper filter GS III applied', { ...tabX('current', 'renderCurrent'), expect: 'S.ca.gs === "gs3"' }),
    { act: 'caSrc:PIB' },
    cap('tab-current-pib-gs3', 'tab', 'Current tab: PIB + GS III (two filters combined)', { ...tabX('current', 'renderCurrent') }),
    { act: 'caSrc:All' }, { act: 'caFilter' }, { act: 'caGs:gs2' }, { act: 'caSrc:PIB' },
    cap('tab-current-empty', 'tab', 'Current tab: no story matches (PIB + GS II), "Nothing in this edition"', { ...tabX('current', 'renderCurrent'), expect: '!!document.querySelector("#currentScroll [data-act=caReset]")' }),
    { act: 'caReset' },
    { act: 'caCal' },
    cap('sheet-edition-calendar', 'sheet', 'Sheet: edition calendar (current month)', { defs: ['caCalHTML', 'calRefresh'], timeDependent: 'Month grid is built around the fixed date; future days are disabled.' }),
    { act: 'caMon:-1' },
    cap('sheet-edition-calendar-prev-month', 'sheet', 'Sheet: edition calendar, previous month', { defs: ['caCalHTML', 'calRefresh'] }),
    { act: 'caMon:1' },
    { act: 'caPick:2026-10-21' },
    cap('sheet-edition-calendar-picked', 'sheet', 'Sheet: edition calendar with 21 Oct picked', { defs: ['caCalHTML', 'calRefresh'] }),
    { act: 'caDone' },
    cap('tab-current-past-edition', 'tab', 'Current tab: a past edition (21 Oct 2026)', { ...tabX('current', 'renderCurrent'), expect: 'S.ca.date === "2026-10-21"' }),
  ]),
  scn('tab-current-read', [
    { goto: 'current' }, { act: 'article:c1' }, { act: 'back' },
    cap('tab-current-one-read', 'tab', 'Current tab after reading the lead story (read state)', { ...tabX('current', 'renderCurrent'), expect: 'S.ca.read.has("c1")' }),
  ]),
  scn('tab-menu', [
    { goto: 'menu' },
    cap('tab-menu', 'tab', 'Menu tab: all tool groups', { ...tabX('menu', 'renderMenu'), defs: ['renderMenu', 'menuBody'] }),
    { fill: ['#menuQ', 'ma'] },
    cap('tab-menu-search', 'tab', 'Menu tab: tool search "ma"', { ...tabX('menu', 'renderMenu'), defs: ['menuBody', 'menuFilter'] }),
    { fill: ['#menuQ', 'zzzz'] },
    cap('tab-menu-search-empty', 'tab', 'Menu tab: tool search with no match', { ...tabX('menu', 'renderMenu'), defs: ['menuBody', 'menuFilter'] }),
  ]),
  one('tab-profile', 'tab', 'Profile tab (Free tier)', [{ goto: 'profile' }], { ...tabX('profile', 'renderProfile'), defs: ['renderProfile', 'meRow'] }),
];

// ------------------------------------------------------------------ views (one per registry key, default state)
const baseViews = [
  view('view-lesson', 'Lesson: Indian Polity, Lecture 4', 'learn', 'lesson'),
  view('view-course', 'Course detail (Modern Indian History, c2)', 'learn', 'course', 'c2', { notes: 'Valid args: c2..c5 (COURSES ids). c1 is routed to the lesson view by the Learn tab.' }),
  view('view-courses', 'Courses & Lectures', 'learn', 'courses'),
  view('view-note', 'Note editor (n1)', 'learn', 'note', 'n1', { notes: 'Valid args: n1..n4 (NOTES ids). "push:note:new" does not open this view any more: A.push is wrapped (L10630) and opens the New Note sheet instead (see sheet-note-new-*).' }),
  view('view-mindmap', 'AI Mindmap: Fundamental Rights (saved map)', 'learn', 'mindmap', null, { notes: 'No arg, "fr" or a title matching /fundamental rights/ gives the hand-built map (the original VIEWS.mindmap, L6551, kept as _mmView).' }),
  view('view-mindmap-topic', 'AI Mindmap: generated map for any other topic', 'learn', 'mindmap', 'Monetary policy', { notes: 'VIEWS.mindmap(t) for a free-text topic (L8011).' }),
  view('view-querydb', 'Query your Database', 'menu', 'querydb'),
  view('view-calendar', 'Study Calendar', 'home', 'calendar'),
  view('view-cloud', 'Cloud Data Vault', 'menu', 'cloud'),
  view('view-tracker', 'Notes Tracker', 'learn', 'tracker'),
  view('view-engine', 'AI Prelims Engine', 'practice', 'engine'),
  view('view-tests', 'Test Series', 'practice', 'tests'),
  view('view-history', 'Quiz history', 'practice', 'history'),
  view('view-answerbank', 'Mains Answer Bank', 'menu', 'answerbank'),
  view('view-answer', 'Answer Bank question (mq1)', 'menu', 'answer', 'mq1', { notes: 'Valid args: ANSWERBANK ids ey26ti, mq1..mq6. Linked from the Practice tab, Mains section (push:answer:<id>); the Answer Bank view itself expands rows in place.' }),
  view('view-pastevals', 'Past evaluations', 'practice', 'pastevals'),
  view('view-qbank', 'Question bank: Polity', 'practice', 'qbank', 'polity', { notes: 'Arg is a SUBJ key (polity, history, geo, eco, env, ir, snt, ethics). Opened by the qbank:<subject> action.' }),
  view('view-plan', 'Prelims 2027: 90-day plan (before generating)', 'home', 'plan'),
  view('view-article', 'Article reader (c4, GRAP)', 'current', 'article', 'c4', { defs: ['articleHTML', 'articleMount'], notes: 'Valid args: ARTICLES ids c1..c4 (today), a1..a7. The top bar turns solid after 160 px of scroll and a progress bar tracks scroll (articleMount).' }),
  view('view-account', 'Account details', 'profile', 'account'),
  view('view-wallet', 'Credits & plan', 'profile', 'wallet'),
  view('view-payments', 'Payments (no receipts yet)', 'profile', 'payments'),
  view('view-upgrade', 'Plans & upgrade: Free tier theme', 'profile', 'upgrade', null, { notes: 'VIEWS.upgrade is wrapped at L10770 to add the "Every plan has its own look" strip.' }),
  view('view-settings', 'App settings', 'profile', 'settings', null, { notes: 'The "Reduce motion" toggle adds class "calm" to <html>; that variant is not captured.' }),
  view('view-status', 'System status', 'profile', 'status', null, { timeDependent: 'Latency sparkline and the latency number are seeded with Math.random() and update on an interval; "checked just now" text. Pixel values differ run to run.' }),
  view('view-legal-terms', 'Terms & Conditions', 'profile', 'legal', 'terms'),
  view('view-legal-privacy', 'Privacy Policy', 'profile', 'legal', 'privacy'),
  view('view-pqb', 'Prelims Question Bank: question 1 unanswered', 'menu', 'pqb', null, { defs: ['pqbHTML', 'pqRedraw'] }),
  view('view-testquiz', 'Test Series to Quiz: upload tab', 'menu', 'testquiz'),
  view('view-syllabus', 'Syllabus Matrix', 'menu', 'syllabus'),
  view('view-saved', 'Saved Articles (one saved)', 'menu', 'saved'),
  view('view-upload', 'Upload to Cloud', 'menu', 'upload'),
  view('view-folder', 'Notes Tracker folder: Polity', 'learn', 'folder', 'Polity', { defs: ['folderList', 'nCard'], notes: 'Arg is a FOLDERS name: Polity, History, Geography, Economy, Environment, Art & Culture, Science & Tech (plus any folder/optional added at runtime).' }),
  view('view-mindmaps', 'AI Mindmaps', 'menu', 'mindmaps'),
  view('view-notesys', 'Notes System (faculty compendiums)', 'learn', 'notesys'),
  view('view-note2', 'Compendium reader (ns1)', 'learn', 'note2', 'ns1', { defs: ['nrHTML', 'nrMount'], notes: 'Valid args: NOTESYS ids ns1..ns5.' }),
  view('view-noteshub', 'Notes hub', 'learn', 'noteshub', null, { notes: 'No data-act in the final UI pushes "noteshub" (Learn now links to Notes System and Notes Tracker); captured because it is in VIEWS.' }),
  view('view-ntNote', 'Notes Tracker note with pending updates (nt1)', 'learn', 'ntNote', 'nt1', { notes: 'Valid args: Notes Tracker note ids nt1…' }),
  view('view-ntNote-no-updates', 'Notes Tracker note without updates (nt8)', 'learn', 'ntNote', 'nt8'),
];

// ------------------------------------------------------------------ view flows
const flows = [
  scn('quiz-flow', [
    { goto: 'quiz' },
    cap('view-quiz', 'view', 'Quiz: question 1, unanswered', { view: 'quiz', defs: ['startQuiz', 'renderQuiz'], timeDependent: 'Elapsed timer (#qzTime) ticks once a second from Date.now(); it reads the fake clock.', notes: 'Hash start #quiz = setTab("practice") + startQuiz(true).' }),
    { call: 'A.opt(String(QUIZ[S.quiz.i].a))', run: 200 },
    cap('view-quiz-selected', 'view', 'Quiz: question 1, option selected (Submit enabled)', { view: 'quiz', defs: ['renderQuiz'] }),
    { act: 'qSubmit' },
    cap('view-quiz-answered-correct', 'view', 'Quiz: question 1 answered correctly (feedback)', { view: 'quiz', defs: ['renderQuiz'], notes: 'After Submit the feedback block (.fb) is scrolled into view (smooth) 80 ms later; scroll captures step from the top.' }),
    { act: 'qNext', run: 200 },
    { call: 'A.opt(String((QUIZ[S.quiz.i].a + 1) % 4))', run: 200 },
    { act: 'qSubmit' },
    cap('view-quiz-answered-wrong', 'view', 'Quiz: question 2 answered wrongly (feedback)', { view: 'quiz', defs: ['renderQuiz'] }),
    ...[3, 4, 5, 6, 7, 8, 9, 10].flatMap(n => [{ act: 'qNext', run: 150 }, { call: `A.opt(String(${n % 3 === 0 ? '(QUIZ[S.quiz.i].a + 2) % 4' : 'QUIZ[S.quiz.i].a'}))`, run: 150 }, { act: 'qSubmit', run: 300 }]),
    cap('view-quiz-last-answered', 'view', 'Quiz: question 10 answered ("See results")', { view: 'quiz', defs: ['renderQuiz'], expect: 'S.quiz.i === 9' }),
    { act: 'qResults' },
    cap('view-quiz-results', 'view', 'Quiz: results (6 of 10 correct)', { view: 'quiz', defs: ['renderResults'], expect: 'S.quiz.showRes === true', timeDependent: 'Shows the elapsed time on the fake clock.' }),
  ]),
  scn('mains-flow', [
    { goto: 'mains' },
    cap('view-mains', 'view', 'AI Mains Evaluation: handwritten mode, before adding pages', { view: 'mains', notes: 'Hash start #mains. VIEWS.mains is redefined at L7865 (state S.mv); the older S.mains flow (mPick/mStep/mAdd/mSubmit, renderMains) is dead code in the final UI.' }),
    { act: 'mvRun' },
    cap('view-mains-need-page-toast', 'view', 'AI Mains Evaluation: tapped Evaluate with no pages (toast)', { view: 'mains', expectToast: true, scroller: null }),
    TOAST_GONE,
    { act: 'mvAdd' }, { act: 'mvAdd' }, { reveal: '#mvRun' },
    cap('view-mains-pages-added', 'view', 'AI Mains Evaluation: two answer pages added', { view: 'mains', expect: 'S.mv.pages === 2' }),
    { act: 'mvRun' },
    cap('sheet-lowCredits', 'sheet', 'Sheet: Not enough credits (Free tier has 10, evaluation needs 20)', { sheet: 'lowCredits' }),
    { act: 'mForce', run: 1300 }, { reveal: '#mvRun' },
    cap('view-mains-evaluating', 'view', 'AI Mains Evaluation: evaluating (2 of 5 steps ticked)', { view: 'mains', defs: ['mvProcess'], scroller: null, notes: '"Run a demo evaluation anyway" (mForce) starts mvProcess(): five rows tick at 560 ms intervals, then +350 ms the page becomes mainsResult. Captured 1500 ms in.' }),
    { run: 2400 }, TOAST_GONE,
    cap('view-mainsResult', 'view', 'Evaluation report (after a real evaluation run)', { view: 'mainsResult', defs: ['mainsResultHTML', 'animateRubric', 'mvProcess'], expect: 'S.stack[S.stack.length - 1].id === "mainsResult"', notes: 'Reached through the evaluation flow, which swaps the mains page in place and calls animateRubric() (rubric bars grow to their widths). A plain push:mainsResult does not animate the bars: see view-mainsResult-pushed.' }),
    { act: 'modelOpen:evModel' }, { reveal: '#evModel' },
    cap('view-mainsResult-model-open', 'view', 'Evaluation report: model answer expanded', { view: 'mainsResult', defs: ['mainsResultHTML'] }),
  ]),
  scn('mains-typed', [
    { goto: 'mains' }, { act: 'mvMode:type' },
    cap('view-mains-typed', 'view', 'AI Mains Evaluation: typed mode, empty', { view: 'mains', expect: 'S.mv.mode === "type"' }),
    { fill: ['#mvT', 'Article 32 makes the enforcement of Fundamental Rights itself a Fundamental Right. Dr Ambedkar called it the heart and soul of the Constitution, and the Supreme Court has steadily widened what that heart protects through public interest litigation.'] },
    { act: 'mvLim:300' },
    cap('view-mains-typed-filled', 'view', 'AI Mains Evaluation: typed mode with text, 300-word limit', { view: 'mains', expect: 'S.mv.limit === 300' }),
  ]),
  scn('mainsResult-pushed', [
    { goto: 'practice' }, push('pastevals'), { act: 'push:mainsResult' },
    cap('view-mainsResult-pushed', 'view', 'Evaluation report opened from Past evaluations (rubric bars not animated)', { view: 'mainsResult', defs: ['mainsResultHTML'], notes: 'push:mainsResult never calls animateRubric(), so the rubric bars stay at width 0. This is what the prototype shows on this path.' }),
  ]),
  scn('answerbank-flow', [
    { goto: 'menu' }, push('answerbank'),
    { act: 'abP:GS II' },
    cap('view-answerbank-gs2', 'view', 'Mains Answer Bank: paper filter GS II', { view: 'answerbank' }),
    { act: 'abP:All' }, { act: 'abLang:hi' },
    cap('view-answerbank-hindi', 'view', 'Mains Answer Bank: Hindi', { view: 'answerbank' }),
    { act: 'abLang:en' }, { act: 'abOpen:mq1' }, { reveal: '[data-act="abOpen:mq1"]' },
    cap('view-answerbank-row-open', 'view', 'Mains Answer Bank: a question expanded (model answer)', { view: 'answerbank', expect: 'S.ab.open.mq1 === true' }),
    { act: 'mainsWith:mq1' },
    cap('view-mains-from-answerbank', 'view', 'AI Mains Evaluation opened from the Answer Bank (question preset)', { view: 'mains' }),
  ]),
  scn('answer-model', [
    { goto: 'menu' }, push('answer', 'mq1'), { act: 'modelOpen:abModel' },
    cap('view-answer-model-open', 'view', 'Answer Bank question: full model answer open', { view: 'answer', arg: 'mq1' }),
  ]),
  scn('article-flow', [
    { goto: 'current' }, { act: 'article:c1' },
    cap('view-article-lead', 'view', "Article reader: today's lead story (c1)", { view: 'article', arg: 'c1', defs: ['articleHTML', 'articleMount'] }),
    { act: 'arSize' }, TOAST_GONE,
    cap('view-article-text-larger', 'view', 'Article reader: larger text (ar-body s2)', { view: 'article', arg: 'c1', defs: ['articleHTML'], expect: 'S.arSize === 2' }),
    { act: 'arSize' }, TOAST_GONE,
    cap('view-article-text-largest', 'view', 'Article reader: largest text (ar-body s3)', { view: 'article', arg: 'c1', defs: ['articleHTML'], expect: 'S.arSize === 3' }),
    { act: 'arSize' }, TOAST_GONE,
    { act: 'save:c1' },
    cap('view-article-saved-toast', 'view', 'Article reader: story saved (bookmark on, toast)', { view: 'article', arg: 'c1', defs: ['toggleSave'], expectToast: true, scroller: null }),
    TOAST_GONE,
    { act: 'mentor' },
    cap('sheet-mentor-article', 'sheet', 'Ask PrepAssist opened from an article (article context, its own suggestions)', { defs: ['openMentor', 'mentorIntro', 'ctx'] }),
  ]),
  one('view-article-older', 'view', 'Article reader: an older story (a1)', [{ goto: 'home' }, { call: "A.article('a1')" }], { view: 'article', arg: 'a1', defs: ['articleHTML'] }),
  scn('pqb-flow', [
    { goto: 'menu' }, push('pqb'),
    { call: 'A.pqPick(String(PQB[S.pqb.i].a))' },
    cap('view-pqb-correct', 'view', 'Prelims Question Bank: answered correctly (explanation)', { view: 'pqb', defs: ['pqbHTML', 'pqRedraw'], notes: 'The explanation (.pq-ex) is scrolled into view 60 ms after picking.' }),
    { act: 'pqNav:1' },
    cap('view-pqb-q2', 'view', 'Prelims Question Bank: question 2 unanswered', { view: 'pqb', defs: ['pqbHTML'], expect: 'S.pqb.i === 1' }),
    { call: 'A.pqPick(String((PQB[S.pqb.i].a + 1) % 4))' },
    cap('view-pqb-wrong', 'view', 'Prelims Question Bank: answered wrongly (explanation)', { view: 'pqb', defs: ['pqbHTML'] }),
    { act: 'pqLang:hi' },
    cap('view-pqb-hindi', 'view', 'Prelims Question Bank: Hindi', { view: 'pqb', defs: ['pqbHTML'], expect: 'S.pqb.lang === "hi"' }),
    { act: 'pqLang:en' }, { act: 'pqHist' },
    cap('sheet-pqb-attempts', 'sheet', 'Sheet: Your attempts (Prelims Question Bank, 2 attempts)', { fns: ['A.pqHist'], notes: 'Built inline by A.pqHist (L8139); not in SHEETS.' }),
  ]),
  scn('pqb-attempts-empty', [
    { goto: 'menu' }, push('pqb'), { act: 'pqHist' },
    cap('sheet-pqb-attempts-empty', 'sheet', 'Sheet: Your attempts, empty', { fns: ['A.pqHist'] }),
  ]),
  scn('testquiz-flow', [
    { goto: 'menu' }, push('testquiz'),
    { act: 'tqLang:hi' }, { act: 'tqLang:en' },
    { act: 'tqPick' }, TOAST_GONE,
    cap('view-testquiz-file-picked', 'view', 'Test Series to Quiz: PDF selected', { view: 'testquiz', expect: '!!S.tq.file' }),
    { act: 'tqGo', run: 1300 }, { reveal: '#tqBusy' },
    cap('view-testquiz-building', 'view', 'Test Series to Quiz: building the mock (2 of 4 steps ticked)', { view: 'testquiz', scroller: null, notes: 'Four steps tick at 650 ms intervals, +400 ms, then the Library tab opens with a toast.' }),
    { run: 1800 }, TOAST_GONE,
    cap('view-testquiz-library-new', 'view', 'Test Series to Quiz: library after a new mock was built', { view: 'testquiz', expect: 'S.tq.tab === "lib" && S.tq.lib.length === 3' }),
  ]),
  scn('testquiz-library', [
    { goto: 'menu' }, push('testquiz'), { act: 'tqTab:lib' },
    cap('view-testquiz-library', 'view', 'Test Series to Quiz: "My test series" tab', { view: 'testquiz' }),
  ]),
  scn('syllabus-flow', [
    { goto: 'menu' }, push('syllabus'),
    { act: 'syOpen:1' }, { reveal: '[data-act="syOpen:1"]' },
    cap('view-syllabus-two-groups-open', 'view', 'Syllabus Matrix: second group expanded as well', { view: 'syllabus' }),
    { act: 'syOpen:1' },
    { act: 'sySt:pen' },
    cap('view-syllabus-in-progress', 'view', 'Syllabus Matrix: status filter "In progress"', { view: 'syllabus', expect: 'S.syl.st === "pen"' }),
    { act: 'sySt:cov' },
    cap('view-syllabus-covered-empty', 'view', 'Syllabus Matrix: status filter "Covered" (0 topics)', { view: 'syllabus', expect: 'S.syl.st === "cov"' }),
    { act: 'sySt:All' },
    { fill: ['#syQ', 'basic structure'] },
    cap('view-syllabus-search', 'view', 'Syllabus Matrix: search "basic structure"', { view: 'syllabus', defs: ['sySearch'] }),
    { fill: ['#syQ', ''] },
    { act: 'syFilter' },
    cap('sheet-syllabus-filter', 'sheet', 'Sheet: Filter by paper (Syllabus)', { fns: ['A.syFilter'], notes: 'Built inline by A.syFilter; not in SHEETS.' }),
    { act: 'syP:gs2' },
    cap('view-syllabus-gs2', 'view', 'Syllabus Matrix: paper filter GS II', { view: 'syllabus', expect: 'S.syl.p === "gs2"' }),
    { act: 'syFilter' }, { act: 'syP:All' },
    { act: 'syTopic:Great Bath of Mohenjodaro' },
    cap('sheet-syllabus-topic', 'sheet', 'Sheet: syllabus topic (Great Bath of Mohenjodaro)', { defs: ['syTopicHTML'] }),
  ]),
  scn('saved-flow', [
    { goto: 'menu' }, push('saved'),
    { act: 'svAdd' },
    cap('sheet-saved-add-link', 'sheet', 'Sheet: Save a link', { fns: ['A.svAdd', 'A.svSave'], notes: 'Built inline by A.svAdd; not in SHEETS.' }),
    { fill: ['#svUrl', 'https://www.thehindu.com/opinion/editorial/federalism'] }, { fill: ['#svT', 'Editorial on federalism'] },
    { act: 'svSave' }, TOAST_GONE,
    cap('view-saved-with-link', 'view', 'Saved Articles: one story and one saved web link', { view: 'saved', expect: 'S.savedLinks.length === 1', timeDependent: 'The saved link shows the fixed date.' }),
    { act: 'svRmL:0' }, { act: 'svRm:a3' }, TOAST_GONE,
    cap('view-saved-empty', 'view', 'Saved Articles: empty', { view: 'saved', expect: 'S.saved.size === 0 && S.savedLinks.length === 0' }),
  ]),
  scn('upload-flow', [
    { goto: 'menu' }, push('upload'),
    { act: 'upPick:pdf' },
    cap('view-upload-staged-pdf', 'view', 'Upload to Cloud: PDF staged', { view: 'upload', expect: 'S.up.file.k === "PDF"' }),
    { act: 'upClear' }, { act: 'upPick:img' },
    cap('view-upload-staged-image', 'view', 'Upload to Cloud: image staged', { view: 'upload', expect: 'S.up.file.k === "JPG"' }),
    { act: 'upGo', run: 400 }, { reveal: '[data-act=upGo]' },
    cap('view-upload-progress', 'view', 'Upload to Cloud: uploading (progress bar mid-way)', { view: 'upload', scroller: null, notes: 'Progress steps 0→100 in 20% steps every 260 ms. Captured 600 ms in.' }),
    { run: 1000 },
    cap('view-upload-done-toast', 'view', 'Upload to Cloud: finished (toast; staged file still shown for 500 ms)', { view: 'upload', expectToast: true, scroller: null }),
    TOAST_GONE,
    cap('view-upload-after', 'view', 'Upload to Cloud: after an upload (new file first under "Recently uploaded")', { view: 'upload', expect: 'S.up.file === null' }),
  ]),
  scn('cloud-flow', [
    { goto: 'menu' }, push('cloud'),
    { act: 'vlTab:up' },
    cap('view-cloud-uploads', 'view', 'Cloud Data Vault: Uploads tab', { view: 'cloud' }),
    { act: 'vlTab:notes' },
    cap('view-cloud-notes', 'view', 'Cloud Data Vault: Notes tab', { view: 'cloud' }),
    { act: 'vlTab:all' }, { act: 'vlWarn' },
    cap('view-cloud-warning-dismissed', 'view', 'Cloud Data Vault: delete warning dismissed', { view: 'cloud', expect: 'S.vlt.warn === false' }),
    { fill: ['#vlQ', 'polity'] },
    cap('view-cloud-search', 'view', 'Cloud Data Vault: search "polity"', { view: 'cloud', defs: ['vlSearch'] }),
    { fill: ['#vlQ', 'zzzz'] },
    cap('view-cloud-search-empty', 'view', 'Cloud Data Vault: search with no match', { view: 'cloud', defs: ['vlSearch'] }),
    { fill: ['#vlQ', ''] },
    { act: 'vlDel:doc:0' },
    cap('sheet-cloud-delete', 'sheet', 'Sheet: Delete this file? (Cloud Data Vault)', { fns: ['A.vlDel'], notes: 'Built inline by A.vlDel; not in SHEETS.' }),
  ]),
  scn('querydb-flow', [
    { goto: 'menu' }, push('querydb'),
    { fill: ['#qdKb', 'Article 32 allows a citizen to move the Supreme Court directly for enforcement of Fundamental Rights.'] },
    { act: 'qdAdd' }, TOAST_GONE,
    cap('view-querydb-knowledge-added', 'view', 'Query your Database: custom knowledge item added', { view: 'querydb', expect: 'S.qdb2.items.length === 1' }),
    { act: 'qdAsk:Basic structure doctrine in one page', run: 500 },
    cap('view-querydb-generating', 'view', 'Query your Database: generating (reading sources)', { view: 'querydb', scroller: null, notes: 'Costs 4 credits; the answer arrives after 1300 ms.' }),
    { run: 1200 },
    cap('view-querydb-answer', 'view', 'Query your Database: generated notes', { view: 'querydb', expect: '!!S.qdb2.out' }),
  ]),
  scn('mindmaps-flow', [
    { goto: 'menu' }, push('mindmaps'),
    { act: 'mmTry:Federalism', run: 600 },
    cap('view-mindmaps-generating', 'view', 'AI Mindmaps: mapping a topic (busy state)', { view: 'mindmaps', scroller: null, notes: 'Costs 3 credits; after 1600 ms the map is saved and the mindmap view is pushed.' }),
    { run: 1400 },
    cap('view-mindmap-generated', 'view', 'AI Mindmap: just generated (Federalism)', { view: 'mindmap', arg: 'Federalism' }),
    { act: 'back' },
    cap('view-mindmaps-two-maps', 'view', 'AI Mindmaps: list with the new map', { view: 'mindmaps', expect: 'S.maps.length === 2', timeDependent: 'New map is dated with the fixed date.' }),
  ]),
  scn('mindmap-node', [
    { goto: 'learn' }, push('mindmap'), { call: 'A.mm(1)' },
    cap('view-mindmap-branch', 'view', 'AI Mindmap: a branch tapped (note panel)', { view: 'mindmap', notes: 'Branches are SVG nodes with data-act="mm:<i>"; the capture calls A.mm(1).' }),
  ]),
  scn('plan-flow', [
    { goto: 'home' }, push('plan'),
    { act: 'planGo', run: 600 },
    cap('view-plan-analysing', 'view', '90-day plan: analysing (button spinner)', { view: 'plan', scroller: null }),
    { run: 1200 },
    cap('view-plan-result', 'view', '90-day plan: generated plan', { view: 'plan', defs: ['planResult'] }),
  ]),
  scn('engine-flow', [
    { goto: 'practice' }, push('engine'),
    { act: 'engineGo', run: 600 },
    cap('view-engine-building', 'view', 'AI Prelims Engine: building the test (button spinner)', { view: 'engine', scroller: null, notes: 'After 1300 ms the page pops and a fresh quiz starts with a toast.' }),
  ]),
  scn('calendar-day', [
    { goto: 'home' }, push('calendar'), { act: 'calDay', nth: 4 },
    cap('view-calendar-other-day', 'view', 'Study Calendar: another day selected', { view: 'calendar' }),
  ]),
  scn('account-flow', [
    { goto: 'profile' }, push('account'),
    { act: 'acEdit' },
    cap('view-account-edit', 'view', 'Account details: editing personal details', { view: 'account', defs: ['acPersonal'], expect: 'S.me.edit === true' }),
    { act: 'acCancel' },
    { act: 'delAsk' },
    cap('sheet-delAsk', 'sheet', 'Sheet: Delete account? (confirm disabled)', { sheet: 'delAsk' }),
    { fill: ['#delIn', 'DELETE'] },
    cap('sheet-delAsk-confirmed', 'sheet', 'Sheet: Delete account? with DELETE typed (confirm enabled)', { sheet: 'delAsk', expect: 'document.querySelector("#delGo").disabled === false' }),
  ]),
  scn('wallet-flow', [
    { goto: 'profile' }, push('wallet'),
    { act: 'ledger' },
    cap('sheet-ledger', 'sheet', 'Sheet: Credit ledger', { sheet: 'ledger' }),
  ]),
  scn('upgrade-topup', [
    { goto: 'profile' }, { act: 'topup' },
    cap('view-upgrade-topup', 'view', 'Plans & upgrade opened by "Top up" (arg topup)', { view: 'upgrade', arg: 'topup' }),
    { act: 'pack:2' },
    cap('view-upgrade-pack-selected', 'view', 'Plans & upgrade: third credit pack selected', { view: 'upgrade', arg: 'topup', expect: 'S.me.pack === 2' }),
  ]),
  scn('legal-swap', [
    { goto: 'auth' }, { act: 'push:legal:terms' },
    cap('view-legal-terms-from-auth', 'view', 'Terms & Conditions opened from the auth screen', { view: 'legal', arg: 'terms', notes: 'Pages can be pushed while a pre-app stage is showing: #layer sits above the stages.' }),
  ]),
  scn('notesys-flow', [
    { goto: 'learn' }, push('notesys'),
    { act: 'nsSubj:Economy' },
    cap('view-notesys-subject', 'view', 'Notes System: subject filter "Economy"', { view: 'notesys' }),
    { act: 'nsSubj:All' },
    { fill: ['.page:last-child input[oninput^="nsSearch"]', 'zzzz'] },
    cap('view-notesys-search-empty', 'view', 'Notes System: search with no match', { view: 'notesys', defs: ['nsSearch'] }),
  ]),
  scn('note2-flow', [
    { goto: 'learn' }, push('note2', 'ns1'), { act: 'nrSave:ns1' }, TOAST_GONE,
    cap('view-note2-saved', 'view', 'Compendium reader: saved to library', { view: 'note2', arg: 'ns1', defs: ['nrHTML'], expect: 'S.nsSaved.has("ns1")' }),
  ]),
  scn('noteshub-flow', [
    { goto: 'learn' }, push('noteshub'), { act: 'nhTab:fac' },
    cap('view-noteshub-faculty', 'view', 'Notes hub: Faculty notes tab', { view: 'noteshub' }),
  ]),
  scn('lesson-practice-context', [
    { goto: 'practice' }, { act: 'qbank:eco' },
    cap('view-qbank-economy', 'view', 'Question bank: Economy', { view: 'qbank', arg: 'eco' }),
  ]),
];

// ------------------------------------------------------------------ X-Ray v4
const XR_CLIP = 'X-Ray reader does NOT scroll in the prototype: x4Reader() wraps the scroller as .page > .x4r > .scroll.x4-scroll, but the sizing rule is `.page > .x4-scroll{position:absolute;inset:0}` (L9483), which no longer matches. The .scroll box grows to its content, nothing is scrollable, and everything below the first viewport is clipped by #app (see clippedOverflow). x4Nav / x4Step call scrollTo on it with no effect. dom.json and html.txt hold the whole article.';
const XR = { defs: ['x4Reader', 'x4Mount', 'x4SyncReader'] };
const XS = { defs: ['x4Sheet', 'x4TabBody', 'x4OpenSheet'], notes: 'Insight sheet built by x4Sheet(); not in SHEETS. Tabs are also swipeable (x4Bind).' };
const xray = [
  scn('xray-reader', [
    { goto: 'learn' }, { act: 'push:xray:arb' },
    cap('view-xray', 'view', 'X-Ray reader: lens "All", coach tip showing', { view: 'xray', arg: 'arb', ...XR, notes: 'Valid args: XSC ids arb, celeb, rbi, harappa, monsoon, grap. VIEWS.xray is redefined three times (L6542, L8356, L8479); L10021 (X-Ray v4) is effective. ' + XR_CLIP }),
    { act: 'x4Lens:ins' },
    cap('view-xray-lens-insights', 'view', 'X-Ray reader: lens "Insights"', { view: 'xray', arg: 'arb', ...XR, expect: 'S.x4.lens === "ins"' }),
    { act: 'x4Lens:term' },
    cap('view-xray-lens-terms', 'view', 'X-Ray reader: lens "Terms"', { view: 'xray', arg: 'arb', ...XR, expect: 'S.x4.lens === "term"' }),
    { act: 'x4Lens:all' }, { act: 'x4Coach' },
    cap('view-xray-coach-dismissed', 'view', 'X-Ray reader: coach tip dismissed', { view: 'xray', arg: 'arb', ...XR, expect: 'S.x4.coach === false' }),
    { act: 'x4Aa' }, TOAST_GONE,
    cap('view-xray-text-larger', 'view', 'X-Ray reader: larger text (f1)', { view: 'xray', arg: 'arb', ...XR, expect: 'S.x4.fs === 1' }),
    { act: 'x4Aa' }, TOAST_GONE,
    cap('view-xray-text-largest', 'view', 'X-Ray reader: largest text (f2)', { view: 'xray', arg: 'arb', ...XR, expect: 'S.x4.fs === 2' }),
    { act: 'x4Aa' }, TOAST_GONE,
    { act: 'x4Nav:1' },
    cap('view-xray-insight-2-focused', 'view', 'X-Ray reader: pager moved to insight 2', { view: 'xray', arg: 'arb', ...XR, scroller: null, expect: 'S.x4.cur === 1', notes: 'x4Nav moves the pager and calls scrollTo on the article, which has no effect: ' + XR_CLIP }),
  ]),
  scn('xray-insight-sheet', [
    { goto: 'learn' }, { act: 'push:xray:arb' }, { act: 'x4Ins:0' },
    cap('sheet-xray-insight-tab1', 'sheet', 'X-Ray insight sheet: tab 1 (context)', { ...XS, expect: 'S.x4.tab === 0' }),
    { act: 'x4Tab:1' },
    cap('sheet-xray-insight-tab2', 'sheet', 'X-Ray insight sheet: tab 2 (static linkage)', { ...XS, expect: 'S.x4.tab === 1' }),
    { act: 'x4Tab:2' },
    cap('sheet-xray-insight-tab3-mcq', 'sheet', 'X-Ray insight sheet: tab 3 (MCQ, unanswered)', { ...XS, expect: 'S.x4.tab === 2' }),
    { call: 'A.x4Mcq(String(XSC.find(x => x.id === S.x4.scan).ins[S.x4.cur].mcq.a))' },
    { reveal: '#x4sBody .pq-v' },
    cap('sheet-xray-insight-mcq-correct', 'sheet', 'X-Ray insight sheet: MCQ answered correctly', { ...XS }),
    { act: 'x4McqReset' },
    { call: 'A.x4Mcq(String((XSC.find(x => x.id === S.x4.scan).ins[S.x4.cur].mcq.a + 1) % 4))' },
    { reveal: '#x4sBody .pq-v' },
    cap('sheet-xray-insight-mcq-wrong', 'sheet', 'X-Ray insight sheet: MCQ answered wrongly', { ...XS }),
    { act: 'x4McqReset' }, { act: 'x4Mcq:r' }, { reveal: '#x4sBody .pq-v' },
    cap('sheet-xray-insight-mcq-revealed', 'sheet', 'X-Ray insight sheet: MCQ answer revealed', { ...XS }),
    { act: 'x4Tab:3' },
    cap('sheet-xray-insight-tab4', 'sheet', 'X-Ray insight sheet: tab 4 (current affairs)', { ...XS, expect: 'S.x4.tab === 3' }),
    { act: 'x4Tab:4' },
    cap('sheet-xray-insight-tab5', 'sheet', 'X-Ray insight sheet: tab 5 (references)', { ...XS, expect: 'S.x4.tab === 4' }),
    { act: 'x4Step:1' },
    cap('sheet-xray-insight-next', 'sheet', 'X-Ray insight sheet: insight 2 of 4 (after Next)', { ...XS, expect: 'S.x4.cur === 1 && S.x4.tab === 0' }),
    { act: 'closeSheet' }, { act: 'x4Term:BITs' },
    cap('sheet-xray-term', 'sheet', 'X-Ray dictionary sheet for a term (BITs)', { defs: ['x4TermSheet'], notes: 'Built by x4TermSheet(); not in SHEETS.' }),
  ]),
  scn('xrayhome-flow', [
    { goto: 'learn' }, push('xrayhome'),
    cap('view-xrayhome', 'view', 'X-Ray Reading library: Polity', { view: 'xrayhome', defs: ['x4Home'] }),
    { act: 'x4Sub:env' },
    cap('view-xrayhome-environment', 'view', 'X-Ray Reading library: Environment', { view: 'xrayhome', defs: ['x4Home'], expect: 'S.x4.sub === "env"' }),
    { act: 'x4Sub:polity' },
    { act: 'x4Up:pdf', run: 1500 },
    cap('view-xrayhome-processing', 'view', 'X-Ray Reading library: processing an upload', { view: 'xrayhome', defs: ['x4Home'], scroller: null, notes: 'Rows tick at 650 ms intervals, +300 ms, then the new scan is pushed in the reader with a toast.' }),
    { run: 2600 }, TOAST_GONE,
    cap('view-xray-new-scan', 'view', 'X-Ray reader on a newly processed scan', { view: 'xray', ...XR, timeDependent: 'The new scan id is "n" + Date.now() and it is dated with the fixed date.' }),
    { act: 'back' },
    cap('view-xrayhome-after-upload', 'view', 'X-Ray Reading library after an upload (new scan listed)', { view: 'xrayhome', defs: ['x4Home'] }),
  ]),
];

// ------------------------------------------------------------------ Notes Tracker v2
const notes = [
  scn('tracker-flow', [
    { goto: 'learn' }, push('tracker'),
    { act: 'ntInbox' },
    cap('sheet-tracker-inbox', 'sheet', 'Sheet: Updates waiting (Notes Tracker inbox)', { fns: ['A.ntInbox'], notes: 'Built inline by A.ntInbox; not in SHEETS.' }),
    { act: 'closeSheet' }, { act: 'nsSplit' },
    cap('sheet-tracker-split-pdf', 'sheet', 'Sheet: Split a PDF', { fns: ['A.nsSplit'], notes: 'Built inline by A.nsSplit; not in SHEETS.' }),
    { act: 'closeSheet' }, { act: 'ntAdd' },
    cap('sheet-tracker-new-folder', 'sheet', 'Sheet: New folder', { fns: ['A.ntAdd', 'A.ntAddGo'], notes: 'Built inline by A.ntAdd; not in SHEETS.' }),
    { fill: ['#ntN', 'Internal Security'] }, { act: 'ntAddGo' }, TOAST_GONE,
    cap('view-tracker-folder-added', 'view', 'Notes Tracker after adding a custom folder', { view: 'tracker', defs: ['trackerHTML'] }),
    { act: 'ntOpt' },
    cap('sheet-tracker-optional', 'sheet', 'Sheet: Optional Subject', { defs: ['optSheet'] }),
    { act: 'ntOptSet:Sociology' }, TOAST_GONE,
    cap('view-tracker-optional-set', 'view', 'Notes Tracker with an optional subject set (Sociology)', { view: 'tracker', defs: ['trackerHTML'], expect: 'S.optional === "Sociology"' }),
    { fill: ['.page:last-child input[oninput^="ntSearch"]', 'coop'] },
    cap('view-tracker-search', 'view', 'Notes Tracker: search "coop"', { view: 'tracker', defs: ['ntSearch'] }),
    { fill: ['.page:last-child input[oninput^="ntSearch"]', 'zzzz'] },
    cap('view-tracker-search-empty', 'view', 'Notes Tracker: search with no match', { view: 'tracker', defs: ['ntSearch'] }),
  ]),
  scn('note-new-type', [
    { goto: 'learn' }, push('tracker'), { act: 'ntNew' },
    cap('sheet-note-new-type', 'sheet', 'New Note sheet: Type mode, empty (Save disabled)', { defs: ['nnSheet'], notes: 'Also what data-act="push:note:new" opens (A.push wrapper, L10630).' }),
    { fill: ['#nnT', 'Federalism: Centre-State relations'] }, { fill: ['#nnB', 'Article 246 and the Seventh Schedule divide legislative powers.\nArticle 356 and the S.R. Bommai guidelines.'] }, { fill: ['#nnG', 'federalism, article 356'] },
    { act: 'ntImg' }, TOAST_GONE,
    cap('sheet-note-new-type-filled', 'sheet', 'New Note sheet: Type mode filled, one image attached', { defs: ['nnSheet'], expect: 'S.nn.img === 1' }),
  ]),
  scn('note-new-camera', [
    { goto: 'learn' }, push('tracker'), { act: 'ntNew' }, { act: 'ntMode:cam' },
    cap('sheet-note-new-camera', 'sheet', 'New Note sheet: Camera mode, before taking a photo', { defs: ['nnSheet'], expect: 'S.nn.mode === "cam" && !S.nn.b' }),
    { act: 'ntCap', run: 500 },
    cap('sheet-note-new-camera-reading', 'sheet', 'New Note sheet: Camera mode, reading the page', { defs: ['nnSheet'], scroller: null, expect: 'S.nn.busy === true', notes: 'Lasts 1300 ms.' }),
    { run: 1000 }, TOAST_GONE,
    cap('sheet-note-new-camera-captured', 'sheet', 'New Note sheet: Camera mode, page captured and text extracted', { defs: ['nnSheet'], expect: 'S.nn.busy === false && !!S.nn.b' }),
  ]),
  scn('note-new-pdf', [
    { goto: 'learn' }, { act: 'ntNew' }, { act: 'ntMode:pdf' },
    cap('sheet-note-new-pdf', 'sheet', 'New Note sheet: PDF / Doc mode', { defs: ['nnSheet'] }),
    { act: 'ntPick', run: 1500 },
    cap('sheet-note-new-pdf-picked', 'sheet', 'New Note sheet: PDF chosen, text extracted', { defs: ['nnSheet'], expect: '!!S.nn.file' }),
    { act: 'ntSave' },
    cap('tab-learn-note-saved-toast', 'state', 'Learn tab right after saving a new note (toast)', { ...tabX('learn', 'renderLearn'), expectToast: true, scroller: null }),
  ]),
  scn('folder-flow', [
    { goto: 'learn' }, { act: 'push:folder:Polity' },
    { act: 'ntSort:az' },
    cap('view-folder-sort-az', 'view', 'Notes Tracker folder: sorted A–Z', { view: 'folder', arg: 'Polity', defs: ['folderList'], expect: 'S.ntSort === "az"' }),
    { act: 'ntSort:star' },
    cap('view-folder-sort-starred', 'view', 'Notes Tracker folder: Starred', { view: 'folder', arg: 'Polity', defs: ['folderList'], expect: 'S.ntSort === "star"' }),
  ]),
  scn('note-updates-flow', [
    { goto: 'learn' }, { act: 'push:ntNote:nt1' }, { act: 'ntUps:nt1' },
    cap('sheet-note-updates', 'sheet', 'Note Updates sheet (pending updates for a note)', { defs: ['upsSheet', 'upCard'] }),
    { act: 'ntMore' },
    cap('sheet-note-updates-expanded', 'sheet', 'Note Updates sheet: first update expanded ("Show less")', { defs: ['upsSheet', 'upCard'] }),
    { act: 'ntMerge:nt1', run: 700 },
    cap('sheet-note-updates-merging', 'sheet', 'Note Updates sheet: AI merge in progress', { defs: ['upsSheet'], scroller: null, notes: 'The merge result replaces this after 2100 ms.' }),
    { run: 1700 },
    cap('sheet-note-updates-merged', 'sheet', 'Note Updates sheet: merged result', { defs: ['upsSheet'] }),
    { act: 'ntView:nt1' },
    cap('view-ntNote-merged', 'view', 'Notes Tracker note after merging updates', { view: 'ntNote', arg: 'nt1', timeDependent: 'Shows "today" / "just now" strings set at merge time.' }),
  ]),
];

// ------------------------------------------------------------------ sheets, mentor, search, reels
const SHEET_FROM = {
  credits: ['home', { call: "A.sheet('credits')" }, null],
  revisions: ['home', { act: 'revisions' }, 'Home "Revisions" tile'],
  allTools: ['home', { act: 'allTools' }, 'Home "All tools"'],
  prefs: ['profile', { act: 'sheet:prefs' }, 'Profile > Study preferences'],
  account: ['profile', { call: "A.sheet('account')" }, null],
  subscription: ['profile', { call: "A.sheet('subscription')" }, null],
  payments: ['profile', { call: "A.sheet('payments')" }, null],
  settings: ['profile', { call: "A.sheet('settings')" }, null],
  privacy: ['profile', { call: "A.sheet('privacy')" }, null],
  coverage: ['profile', { call: "A.sheet('coverage')" }, null],
  upload: ['learn', { call: 'A.upload()' }, null],
};
const SHEET_TITLE = { credits: 'AI credits', revisions: 'Due for revision', allTools: 'All study tools', prefs: 'Study preferences', account: 'Account (old profile sheet)', subscription: 'Subscription (old profile sheet)', payments: 'Payments (old profile sheet)', settings: 'Settings (old profile sheet)', privacy: 'Privacy (old profile sheet)', coverage: 'Syllabus progress', upload: 'Add to your vault' };
const sheets = [
  ...Object.entries(SHEET_FROM).map(([k, [tab, step, via]]) => one(`sheet-${k}`, 'sheet', `Sheet: ${SHEET_TITLE[k]}`, [{ goto: tab }, step], { sheet: k, notes: via ? `Opened from ${via}.` : `No element in the final UI opens SHEETS.${k}; opened by calling the dispatcher/registry directly (${step.call}). Captured because it is in SHEETS.` })),
  scn('revisions-done', [
    { goto: 'home' }, { act: 'revisions' }, { act: 'revDo:r1' },
    cap('sheet-revisions-one-done', 'sheet', 'Sheet: Due for revision, first item done (toast)', { sheet: 'revisions', expectToast: true }),
  ]),
  scn('mentor', [
    { goto: 'home' }, { click: '#ask' },
    cap('sheet-mentor-intro', 'sheet', 'Ask PrepAssist: intro state (Home context)', { defs: ['openMentor', 'mentorIntro', 'ctx'], notes: 'Opened with the Ask button (data-act="mentor"). Hash #mentor gives the same state.' }),
    { act: 'mentorAsk:Explain Article 32 simply.', run: 300 },
    cap('sheet-mentor-typing', 'sheet', 'Ask PrepAssist: question sent, typing indicator', { defs: ['mentorAsk'], scroller: null, timeDependent: 'The reply arrives after 900 ms + Math.random() * 500 ms.' }),
    { run: 1500 },
    cap('sheet-mentor-answer', 'sheet', 'Ask PrepAssist: after one suggested question is answered', { defs: ['mentorAsk', 'reply'], expect: 'S.mlog.length === 1', notes: 'The body is smooth-scrolled so the question sits at the top.' }),
    { act: 'ctxToggle' },
    cap('sheet-mentor-context-off', 'sheet', 'Ask PrepAssist: context switched off (toast)', { defs: ['openMentor'], expectToast: true, scroller: null }),
    { act: 'ctxToggle' }, TOAST_GONE,
    { act: 'closeSheet' }, { click: '#ask' },
    cap('sheet-mentor-reopened', 'sheet', 'Ask PrepAssist: reopened with history (suggestion chips row)', { defs: ['openMentor'] }),
    { act: 'mentorAsk:How should I revise Polity in 15 days?', run: 1600 },
    cap('sheet-mentor-answer-plan', 'sheet', 'Ask PrepAssist: second answer (15-day plan with table)', { defs: ['reply'], expect: 'S.mlog.length === 2' }),
  ]),
  scn('search', [
    { goto: 'home' }, { act: 'cmdk' },
    cap('sheet-search-empty-query', 'sheet', 'Search sheet: empty query (everything listed)', { defs: ['cmdk'] }),
    { fill: ['#cmdIn', 'art'] },
    cap('sheet-search-results', 'sheet', 'Search sheet: query "art"', { defs: ['cmdk'] }),
    { fill: ['#cmdIn', 'zzzz'] },
    cap('sheet-search-no-result', 'sheet', 'Search sheet: no-result query', { defs: ['cmdk'], expect: '!!document.querySelector("#cmdRes .empty")' }),
  ]),
  scn('reels', [
    { goto: 'home' }, { act: 'reel:0' },
    cap('overlay-reel', 'overlay', 'Reels viewer: reel 1, slide 1', { root: '#reelV', scroller: null, defs: ['reelOpen', 'reelPaint', 'reelStep', 'reelClose'], notes: 'Slides auto-advance every 4500 ms (the bar animation). Captured 600 ms in.' }),
    { act: 'reelStep:1' },
    cap('overlay-reel-slide-2', 'overlay', 'Reels viewer: reel 1, slide 2', { root: '#reelV', scroller: null, defs: ['reelPaint'], expect: 'RV.j === 1' }),
    { act: 'reelClose' }, { call: 'A.reel(5)' },
    cap('overlay-reel-last', 'overlay', 'Reels viewer: last reel ("You’re done for today")', { root: '#reelV', scroller: null, defs: ['reelPaint'], expect: 'RV.i === 5' }),
  ]),
];

// ------------------------------------------------------------------ purchase sheet + plan themes
const THEME_T = 'Plan theme is html[data-plan]; it changes --brand etc. (see runtime.json) plus many hard-coded hero, nav, Ask-button and pen-CTA rules in <style id="planthemes">.';
const themeTabs = (plan) => [
  ...['home', 'learn', 'practice', 'current', 'menu', 'profile'].flatMap(tb => [
    { act: `tab:${tb}` },
    cap(`tab-${tb}-${plan}`, 'tab', `${tb[0].toUpperCase() + tb.slice(1)} tab in the ${plan} plan theme`, { ...tabX(tb, 'render' + tb[0].toUpperCase() + tb.slice(1)), expect: `document.documentElement.dataset.plan === "${plan}" && S.tab === "${tb}"`, timeDependent: tb === 'home' ? HOME_T : undefined, notes: THEME_T }),
  ]),
];
const BUY = { defs: ['buyHTML', 'buyItem', 'applyBuy'], notes: 'Purchase sheet built by buyHTML(kind, id, step); not in SHEETS.' };
const purchase = [
  scn('theme-pro', [
    { goto: 'plans' },
    { act: 'buy:plan:pro' },
    cap('sheet-purchase-confirm-pro', 'sheet', 'Purchase sheet: confirm UPSC Pro', { ...BUY, timeDependent: 'Renewal date = fixed date + 30 days.' }),
    { act: 'byPay:plan:pro', run: 500 },
    cap('sheet-purchase-processing', 'sheet', 'Purchase sheet: processing payment', { ...BUY, scroller: null, notes: 'Shown for 1500 ms.' }),
    { run: 1300 },
    cap('sheet-purchase-done-pro', 'sheet', 'Purchase sheet: success for UPSC Pro', { ...BUY, expect: 'S.me.plan === "pro"', notes: 'The plan-change overlay (planMagic) starts 650 ms after this appears.' }),
    { run: 1500 },
    cap('overlay-plan-magic-pro', 'overlay', 'Plan-change overlay: "Welcome to UPSC Pro"', { root: '#app > .pm-ov', scroller: null, defs: ['planMagic'], timeDependent: '22 sparkle particles are placed with Math.random(). The overlay lasts 3250 ms: theme switches at 800 ms, fade-out starts at 2500 ms.', expect: 'document.documentElement.dataset.plan === "pro"' }),
    { run: 2400 },
    { act: 'closeSheet' },
    cap('view-upgrade-pro', 'view', 'Plans & upgrade: UPSC Pro theme (current plan Pro)', { view: 'upgrade', expect: 'document.documentElement.dataset.plan === "pro"', notes: THEME_T }),
    { act: 'back' },
    ...themeTabs('pro'),
    push('wallet'),
    cap('view-wallet-pro', 'view', 'Credits & plan on UPSC Pro (110 credits)', { view: 'wallet', notes: THEME_T }),
    { act: 'ledger' },
    cap('sheet-ledger-after-purchase', 'sheet', 'Sheet: Credit ledger after buying Pro', { sheet: 'ledger', timeDependent: 'New rows carry the fixed date.' }),
    { act: 'closeSheet' }, { act: 'back' },
    push('payments'),
    cap('view-payments-with-receipt', 'view', 'Payments with one receipt', { view: 'payments', timeDependent: 'Receipt date is the fixed date.' }),
    { act: 'back' },
    { click: '#ask' },
    cap('sheet-mentor-intro-pro', 'sheet', 'Ask PrepAssist intro in the Pro theme', { defs: ['openMentor'], notes: THEME_T }),
    { act: 'closeSheet' },
    push('upgrade'),
    { act: 'planFree', run: 1500 },
    cap('overlay-plan-magic-free', 'overlay', 'Plan-change overlay: "Back to Free tier" (demo downgrade)', { root: '#app > .pm-ov', scroller: null, defs: ['planMagic'], timeDependent: 'Random sparkle particles.' }),
  ]),
  scn('theme-ultimate', [
    { goto: 'plans' },
    { act: 'buy:plan:ultimate' },
    cap('sheet-purchase-confirm-ultimate', 'sheet', 'Purchase sheet: confirm Ultimate', { ...BUY }),
    { act: 'byPay:plan:ultimate', run: 1800 },
    cap('sheet-purchase-done-ultimate', 'sheet', 'Purchase sheet: success for Ultimate', { ...BUY, expect: 'S.me.plan === "ultimate"' }),
    { run: 1500 },
    cap('overlay-plan-magic-ultimate', 'overlay', 'Plan-change overlay: "Welcome to Ultimate"', { root: '#app > .pm-ov', scroller: null, defs: ['planMagic'], timeDependent: 'Random sparkle particles.', expect: 'document.documentElement.dataset.plan === "ultimate"' }),
    { run: 2400 },
    { act: 'closeSheet' },
    cap('view-upgrade-ultimate', 'view', 'Plans & upgrade: Ultimate theme (current plan Ultimate)', { view: 'upgrade', expect: 'document.documentElement.dataset.plan === "ultimate"', notes: THEME_T }),
    { act: 'back' },
    ...themeTabs('ultimate'),
    push('wallet'),
    cap('view-wallet-ultimate', 'view', 'Credits & plan on Ultimate (210 credits)', { view: 'wallet', notes: THEME_T }),
    { act: 'back' },
    { click: '#ask' },
    cap('sheet-mentor-intro-ultimate', 'sheet', 'Ask PrepAssist intro in the Ultimate theme', { defs: ['openMentor'], notes: THEME_T }),
  ]),
  scn('purchase-vault', [
    { goto: 'plans' },
    { act: 'buy:plan:vault' },
    cap('sheet-purchase-confirm-vault', 'sheet', 'Purchase sheet: confirm Cloud Vault add-on', { ...BUY }),
    { act: 'byPay:plan:vault', run: 1800 },
    cap('sheet-purchase-done-vault', 'sheet', 'Purchase sheet: success for Cloud Vault', { ...BUY, expect: 'S.me.vault === true' }),
    { act: 'closeSheet' }, { act: 'back' }, push('cloud'),
    cap('view-cloud-vault-unlocked', 'view', 'Cloud Data Vault with the Vault add-on (1.5 GB cap)', { view: 'cloud' }),
  ]),
  scn('purchase-pack', [
    { goto: 'plans' },
    { act: 'buy:pack:0' },
    cap('sheet-purchase-confirm-pack', 'sheet', 'Purchase sheet: confirm a credit pack', { ...BUY }),
    { act: 'byPay:pack:0', run: 1800 },
    cap('sheet-purchase-done-pack', 'sheet', 'Purchase sheet: success for a credit pack', { ...BUY, expect: 'S.me.credits === 90' }),
  ]),
];

// ------------------------------------------------------------------ One more step
const STEP = { view: 'onestep', defs: ['stepHTML', 'stPlay'], scroller: null };
const STEP_FRAME = (ms, what) => scn(`onestep-t${ms}`, [
  { goto: 'profile' }, { act: 'push:onestep', idle: false }, { until: ms },
  cap(`view-onestep-t${ms}`, 'view', `One more step: ${(ms / 1000).toFixed(1)} s into the sequence (${what})`, { ...STEP, timeline: true, timelineTargetMs: ms, notes: 'Timeline frame, not a rest frame: one screenshot taken this many ms (real time) after the sequence starts; atRest.timelineOffsetMs is the measured offset. dom.json is read a moment after the screenshot.' }),
]);
const onestep = [
  STEP_FRAME(1500, 'first line fading in'),
  STEP_FRAME(3000, 'the step is taken'),
  STEP_FRAME(4600, 'the building rises'),
  STEP_FRAME(6500, 'second line'),
  scn('onestep', [
    { goto: 'profile' }, { act: 'push:onestep' },
    cap('view-onestep', 'view', 'One more step: final rest frame (all one-shot animations finished)', { ...STEP, settleMaxMs: 20000, timeDependent: 'Ambient loops keep running (stars, bokeh, haze, halo breath, rosette spin). "Day 239 · 126 days to Prelims" is static text.', notes: 'The sequence is pure CSS started by adding .go to .st-wrap 60 ms after mount; the longest one-shot animation is the 11 s camera push (s4Push). The view-onestep-t#### captures are timeline frames. VIEWS.onestep is defined twice (L8496, L8542 with sound); the second is effective.' }),
  ]),
];

export const SCENARIOS = [...stages, ...tabs, ...baseViews, ...flows, ...xray, ...notes, ...sheets, ...purchase, ...onestep];

export function allCaptures() {
  const out = [];
  for (const sc of SCENARIOS) {
    const before = [];
    for (const st of sc.steps) {
      if (st.capture) { out.push({ ...st.capture, scenario: sc.id, time: sc.time, plannedReach: [...before] }); before.push({ captured: st.capture.id }); }
      else before.push(st);
    }
  }
  return out;
}
