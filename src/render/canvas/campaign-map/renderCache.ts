export interface CampaignMapRenderCache { key: string; builds: number; }
const caches = new Map<string, CampaignMapRenderCache>();
export function getCampaignMapRenderCache(key: string): CampaignMapRenderCache { const existing = caches.get(key); if (existing) return existing; const cache = { key, builds: 1 }; caches.set(key, cache); return cache; }
export function clearCampaignMapRenderCaches(): void { caches.clear(); }
