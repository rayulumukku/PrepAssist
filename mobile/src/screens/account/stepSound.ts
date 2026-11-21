// Source: PrepAssist.html L8509-L8541 (STS, stCtx, stNoise, stStop, stPlay)
// "One more step" sound design, Web Audio graph for graph, with react-native-audio-api (the Web Audio
// API for React Native). Same oscillators, filters, envelopes and times as stPlay.
// Differences, each forced by the library, none audible by design:
//   - the HTML shares SFX.ctx (the book's page-turn context); here the context is this module's own.
//   - the shimmer's echo is a DelayNode in a feedback loop (dl -> fb -> dl, delay .28 s, gain .38).
//     react-native-audio-api 1.0.1 rejects every graph cycle (HostGraph::addEdge returns
//     CYCLE_DETECTED, delay or not), so the loop is unrolled into a chain of ECHO_TAPS delays, each
//     .28 s with gain .38 before the next: the same impulse response, cut off after 12 echoes
//     (.38^12 ≈ 9e-6, -101 dB).
import { AudioContext } from 'react-native-audio-api';
import type {
  AudioBuffer,
  AudioNode,
  AudioParam,
  BaseAudioContext,
} from 'react-native-audio-api';
import { getS } from '../../store';

const ECHO_TAPS = 12;

interface Stoppable {
  gain?: AudioParam;
  stop?: (when?: number) => void;
}

let ctx: AudioContext | null = null;
let nodes: Stoppable[] = [];
let timers: ReturnType<typeof setTimeout>[] = [];

/** stCtx (L8511) */
function stCtx(): AudioContext | null {
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** stNoise (L8512): brown-ish noise, sec seconds, mono. */
function stNoise(c: BaseAudioContext, sec: number): AudioBuffer {
  const b = c.createBuffer(1, Math.floor(c.sampleRate * sec), c.sampleRate);
  const d = b.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }
  b.copyToChannel(d, 0);
  return b;
}

/** stStop (L8513) */
export function stStop(): void {
  timers.forEach(clearTimeout);
  timers = [];
  const c = ctx;
  if (!c) {
    nodes = [];
    return;
  }
  nodes.forEach(n => {
    try {
      if (n.gain) {
        n.gain.cancelScheduledValues(c.currentTime);
        n.gain.setTargetAtTime(0, c.currentTime, 0.15);
      }
      if (n.stop) n.stop(c.currentTime + 0.6);
    } catch {
      // the HTML swallows the same errors (a node already stopped)
    }
  });
  nodes = [];
}

const keep = (...n: object[]): void => {
  for (const x of n) nodes.push(x as Stoppable);
};
function chain(...n: AudioNode[]): void {
  for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]);
}

/** stPlay (L8514-L8541) */
export function stPlay(): void {
  stStop();
  if (!getS().STS.on) return;
  const c = stCtx();
  if (!c) return;
  const t = c.currentTime + 0.05;
  const out = c.createGain();
  out.gain.value = 0.9;
  out.connect(c.destination);
  keep(out);
  // 1 · ambient pad (D minor-ish → resolves)
  const pad = c.createGain();
  pad.gain.setValueAtTime(0, t);
  pad.gain.linearRampToValueAtTime(0.07, t + 2.2);
  pad.gain.linearRampToValueAtTime(0.11, t + 3.4);
  pad.gain.linearRampToValueAtTime(0.08, t + 9);
  pad.gain.linearRampToValueAtTime(0, t + 14);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(600, t);
  lp.frequency.linearRampToValueAtTime(2200, t + 3.6);
  chain(pad, lp, out);
  keep(pad);
  (
    [
      [146.8, 0],
      [220, 0],
      [174.6, 0],
      [293.7, 3.2],
      [440, 3.2],
      [370, 3.2],
    ] as const
  ).forEach(([f, at]) => {
    (['sine', 'triangle'] as const).forEach((ty, k) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = ty;
      o.frequency.value = f * (k ? 1.003 : 1);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(k ? 0.25 : 0.5, t + at + 1.2);
      chain(o, g, pad);
      o.start(t);
      o.stop(t + 14.5);
      keep(o, g);
    });
  });
  // 2 · crowd murmur that fades when the step is taken
  const src = c.createBufferSource();
  src.buffer = stNoise(c, 4);
  src.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 520;
  bp.Q.value = 0.8;
  const cg = c.createGain();
  cg.gain.setValueAtTime(0, t);
  cg.gain.linearRampToValueAtTime(0.32, t + 1);
  cg.gain.setValueAtTime(0.32, t + 2.6);
  cg.gain.linearRampToValueAtTime(0.03, t + 3.6);
  cg.gain.linearRampToValueAtTime(0, t + 6);
  const lfo = c.createOscillator();
  const lg = c.createGain();
  lfo.frequency.value = 3.1;
  lg.gain.value = 0.1;
  lfo.connect(lg);
  lg.connect(cg.gain);
  lfo.start(t);
  lfo.stop(t + 6.5);
  chain(src, bp, cg, out);
  src.start(t);
  src.stop(t + 6.5);
  keep(src, cg, lfo);
  // 3 · the footstep (2.9 s)
  const ft = t + 2.9;
  const o = c.createOscillator();
  const og = c.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(120, ft);
  o.frequency.exponentialRampToValueAtTime(42, ft + 0.22);
  og.gain.setValueAtTime(0, ft);
  og.gain.linearRampToValueAtTime(0.9, ft + 0.01);
  og.gain.exponentialRampToValueAtTime(0.001, ft + 0.45);
  chain(o, og, out);
  o.start(ft);
  o.stop(ft + 0.5);
  keep(o, og);
  const n = c.createBufferSource();
  n.buffer = stNoise(c, 0.2);
  const nh = c.createBiquadFilter();
  nh.type = 'highpass';
  nh.frequency.value = 900;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.5, ft);
  ng.gain.exponentialRampToValueAtTime(0.001, ft + 0.12);
  chain(n, nh, ng, out);
  n.start(ft);
  keep(n, ng);
  // 4 · shimmer as India lights up (3.1 s →): dl -> fb -> dl, dl -> wet(.5) -> out, unrolled
  const dl = c.createDelay();
  dl.delayTime.value = 0.28;
  const wet = c.createGain();
  wet.gain.value = 0.5;
  chain(dl, wet, out);
  let prev: AudioNode = dl;
  for (let k = 1; k < ECHO_TAPS; k++) {
    const fb = c.createGain();
    fb.gain.value = 0.38;
    const d2 = c.createDelay();
    d2.delayTime.value = 0.28;
    chain(prev, fb, d2, wet);
    prev = d2;
    keep(fb);
  }
  keep(wet);
  [587.3, 740, 880, 1174.7, 1480, 1760].forEach((f, i) => {
    const st = t + 3.1 + i * 0.16;
    const b = c.createOscillator();
    const bg = c.createGain();
    b.type = 'sine';
    b.frequency.value = f;
    bg.gain.setValueAtTime(0, st);
    bg.gain.linearRampToValueAtTime(0.12, st + 0.015);
    bg.gain.exponentialRampToValueAtTime(0.0008, st + 1.8);
    b.connect(bg);
    bg.connect(out);
    bg.connect(dl);
    b.start(st);
    b.stop(st + 2);
    keep(b, bg);
  });
  // 5 · final swell under the message (6.3 s)
  const sw = t + 6.2;
  [293.7, 440, 587.3, 740].forEach(f => {
    const s2 = c.createOscillator();
    const sg = c.createGain();
    s2.type = 'sine';
    s2.frequency.value = f;
    sg.gain.setValueAtTime(0, sw);
    sg.gain.linearRampToValueAtTime(0.05, sw + 1.4);
    sg.gain.linearRampToValueAtTime(0, sw + 7);
    chain(s2, sg, out);
    s2.start(sw);
    s2.stop(sw + 7.2);
    keep(s2, sg);
  });
}
