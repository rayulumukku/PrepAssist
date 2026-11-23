// Source: PrepAssist.html L7437-L7440 (buyItem), L10756-L10757 (planMagic sparks)
import { PACKS, PLANS } from '../../data/plans';

export interface BuyItem {
  id: string;
  n: string;
  kind: string;
  p: number;
  credits: number;
  ic: string;
}

/** buyItem(kind, id): a PLANS entry, or a credit pack built from PACKS[+id]. */
export function buyItem(kind: string, id: string): BuyItem | undefined {
  if (kind === 'plan') return PLANS.find(p => p.id === id);
  const k = PACKS[Number(id)];
  if (!k) return undefined;
  return {
    id: 'pack',
    n: k.c + ' AI credits',
    kind: 'One-time credit pack',
    p: k.p,
    credits: k.c,
    ic: 'bolt',
  };
}

/** The 22 sparks of .pm-ov: angle, distance, size and delay, drawn with Math.random() like L10756-L10757. */
export function planMagicSparks(): {
  tx: number;
  ty: number;
  s: number;
  d: number;
}[] {
  return Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
    const r = 120 + Math.random() * 120;
    return {
      tx: Number((Math.cos(a) * r).toFixed(0)),
      ty: Number((Math.sin(a) * r).toFixed(0)),
      s: (6 + Math.random() * 10) | 0,
      d: Number((0.35 + Math.random() * 0.35).toFixed(2)),
    };
  });
}
