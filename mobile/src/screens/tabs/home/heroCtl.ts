// Source: PrepAssist.html L6183-L6189 (window.heroSetDot, heroGo)
// The live carousel registers its heroGo here so that the `heroGo` verb (actions/tabs.ts) can reach it,
// as the HTML reaches #heroTrack through the DOM.
export const heroCtl: { go?: (i: number) => void } = {};

// Source: PrepAssist.html L6119 (#fcRate), L6158-L6164 (setFc)
// The flashcard deck registers its swipe reset so fcRate can run the same way from the buttons and the swipe.
export const deckCtl: { scrollToFcs?: () => void } = {};
