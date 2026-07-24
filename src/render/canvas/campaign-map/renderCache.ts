export interface CampaignMapRenderCache { key: string; builds: number; scaleBucket: number; viewportSafe: true; }
const caches = new Map<string, CampaignMapRenderCache>();
export function getCampaignMapRenderCache(key: string): CampaignMapRenderCache { const existing = caches.get(key); if (existing) return existing; const cache = { key, builds: 1, scaleBucket: Number(key.split(":")[1]) || 0, viewportSafe: true as const }; caches.set(key, cache); return cache; }
export function getCampaignMapCacheKey(revision: string, zoomLevel: number, deviceScale: number): string {
  return `${revision}:${Math.round(zoomLevel * 4)}:${Math.max(1, Math.round(deviceScale))}`;
}
export function clearCampaignMapRenderCaches(): void { caches.clear(); }
