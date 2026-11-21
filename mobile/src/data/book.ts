// GENERATED from PrepAssist.html by tools/reference/extract. Do not edit by hand.
// Book opening: camera poses and the paper-sound engine state.
// Regenerate: `node extract/extract.mjs` in tools/reference. Check: `node extract/verify.mjs`.

export interface CamClosed {
  readonly gx: number;
  readonly gy: number;
  readonly rx: number;
  readonly s: number;
  readonly h: number;
}

// Source: PrepAssist.html L5756 (CAM_CLOSED)
export const CAM_CLOSED: CamClosed = { gx: 62, gy: 410, rx: 28, s: 0.8, h: 486 };

export type CamSpread = CamClosed;

// Source: PrepAssist.html L5757 (CAM_SPREAD)
export const CAM_SPREAD: CamSpread = { gx: 195, gy: 418, rx: 24, s: 0.54, h: 486 };

export type CamFinal = CamClosed;

// Source: PrepAssist.html L5758 (CAM_FINAL)
export const CAM_FINAL: CamFinal = { gx: 0, gy: 422, rx: 0, s: 1.182, h: 724 };

export interface Sfx {
  readonly ctx: null;
  readonly on: boolean;
  readonly buf: null;
}

// Source: PrepAssist.html L5688 (SFX)
//   Handlers change it while the app runs (L5692 assignment, L5698 assignment, L6984 assignment, L7622 assignment, L8511 assignment): treat it as the seed of app state, not as a fixed table.
export const SFX: Sfx = { ctx: null, on: true, buf: null };
