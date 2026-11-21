// Source: PrepAssist.html L5687-L5734 (paper sounds, synthesised: SFX, actx, rustle, sfx)
// Ported one to one onto react-native-audio-api, which implements the Web Audio graph (AudioContext,
// AudioBuffer, AudioBufferSourceNode, BiquadFilterNode, GainNode, OscillatorNode, AudioParam automation).
// No audio files, as in the HTML. `SFX.on` lives in the store (A.sound and A.meTog toggle it); the
// context and the noise buffer are runtime objects and live here.
import { AudioContext } from 'react-native-audio-api';
import type { AudioBuffer } from 'react-native-audio-api';
import { getS } from '../../store';

let ctx: AudioContext | null = null;
let buf: AudioBuffer | null = null;

/** actx() L5689-L5701 */
function actx(): AudioContext | null {
  if (!getS().SFX.on) return null;
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    return null;
  }
  if (!buf) {
    const c = ctx;
    const n = Math.floor(c.sampleRate * 1.2);
    const b = c.createBuffer(1, n, c.sampleRate);
    const d = b.getChannelData(0);
    let br = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      br = (br + 0.03 * w) / 1.03;
      d[i] = w * 0.55 + br * 2.2;
    }
    buf = b;
  }
  return ctx;
}

/** rustle() L5702-L5717 */
function rustle(c: AudioContext, t: number, dur: number, f0: number, f1: number, vol: number): void {
  const src = c.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = 0.9 + Math.random() * 0.25;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 0.7;
  bp.frequency.setValueAtTime(f0, t);
  bp.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.55);
  bp.frequency.exponentialRampToValueAtTime(f0 * 0.8, t + dur);
  const hp = c.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 380;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  // paper crackle: a few quick swells inside the main envelope
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const env = Math.sin(Math.PI * Math.min(1, k * 1.15)) ** 1.4;
    const crack = 0.55 + 0.45 * Math.random();
    g.gain.linearRampToValueAtTime(vol * env * crack, t + dur * k);
  }
  g.gain.linearRampToValueAtTime(0, t + dur + 0.02);
  src.connect(bp).connect(hp).connect(g).connect(c.destination);
  src.start(t, Math.random() * 0.3, dur + 0.05);
}

/** sfx(kind) L5718-L5733 */
export function sfx(kind: string): void {
  const c = actx();
  if (!c) return;
  const t = c.currentTime + 0.01;
  if (kind === 'page') {
    rustle(c, t, 0.42, 1400, 4200, 0.55); // the sheet lifting and sliding
    rustle(c, t + 0.5, 0.16, 900, 2200, 0.35); // landing flap
  } else if (kind === 'cover') {
    rustle(c, t, 0.5, 700, 2400, 0.35);
    const o = c.createOscillator();
    const og = c.createGain();
    const lp = c.createBiquadFilter();
    o.type = 'sine';
    o.frequency.setValueAtTime(110, t + 0.62);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.85);
    og.gain.setValueAtTime(0, t + 0.6);
    og.gain.linearRampToValueAtTime(0.55, t + 0.63);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.95);
    lp.type = 'lowpass';
    lp.frequency.value = 400;
    o.connect(lp).connect(og).connect(c.destination);
    o.start(t + 0.6);
    o.stop(t + 1);
    rustle(c, t + 0.6, 0.12, 500, 900, 0.3); // board meeting the desk
  }
}
