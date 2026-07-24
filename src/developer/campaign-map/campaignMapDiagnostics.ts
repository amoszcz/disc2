import type { GeneratedCampaignMap } from "../../engine/campaign-map/types";
export type CampaignMapOverlay = "cells" | "regions" | "connections" | "route-search" | "placement" | "validation" | "cache";
export interface CampaignMapDiagnostics { enabled: Set<CampaignMapOverlay>; seed: number; validationErrors: string[]; }
export function createCampaignMapDiagnostics(map: GeneratedCampaignMap): CampaignMapDiagnostics { return { enabled: new Set(), seed: map.metadata.seed, validationErrors: [...map.validation.errors] }; }
export function toggleCampaignMapOverlay(state: CampaignMapDiagnostics, overlay: CampaignMapOverlay): CampaignMapDiagnostics { const enabled = new Set(state.enabled); enabled.has(overlay) ? enabled.delete(overlay) : enabled.add(overlay); return { ...state, enabled }; }

// Diagnostics deliberately live outside player session state.  They are a development-only
// rendering aid and therefore cannot be saved, replayed, or exposed by normal game UI.
const diagnosticsByMap = new Map<string, CampaignMapDiagnostics>();
export function getCampaignMapDiagnostics(map: GeneratedCampaignMap): CampaignMapDiagnostics {
  const current = diagnosticsByMap.get(map.mapId);
  if (current && current.seed === map.metadata.seed) return current;
  const created = createCampaignMapDiagnostics(map);
  diagnosticsByMap.set(map.mapId, created);
  return created;
}
export function setCampaignMapDiagnostics(mapId: string, diagnostics: CampaignMapDiagnostics): void {
  diagnosticsByMap.set(mapId, diagnostics);
}
