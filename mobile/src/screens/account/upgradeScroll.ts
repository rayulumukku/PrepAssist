// Source: PrepAssist.html L7608 (A.topup), L7536 (VIEWS.upgrade mount)
// The upgrade page's own scroller (.ug-scroll: upgrade is a focus view, so the scroller is ours).
// `sc.scrollTo({ top: #upPacks.offsetTop - 20, behavior: 'smooth' })`.
interface Entry {
  scrollTo: (o: { y: number; animated: boolean }) => void;
  packsY: number | null;
}
const pages = new Map<number, Entry>();

export function registerUpgrade(key: number, e: Entry | null): void {
  if (e) pages.set(key, e);
  else pages.delete(key);
}
export function setUpgradePacksY(key: number, y: number): void {
  const e = pages.get(key);
  if (e) e.packsY = y;
}
export function scrollUpgradeToPacks(key: number): void {
  const e = pages.get(key);
  if (e && e.packsY !== null) e.scrollTo({ y: e.packsY - 20, animated: true });
}
