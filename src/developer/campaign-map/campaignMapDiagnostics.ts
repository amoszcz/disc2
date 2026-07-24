import type { GeneratedCampaignMap } from "../../engine/campaign-map/types";
export type CampaignMapOverlay = "cells" | "regions" | "connections" | "validation" | "cache";
export interface CampaignMapDiagnostics { enabled: Set<CampaignMapOverlay>; seed: number; validationErrors: string[]; }
export function createCampaignMapDiagnostics(map: GeneratedCampaignMap): CampaignMapDiagnostics { return { enabled: new Set(), seed: map.metadata.seed, validationErrors: [...map.validation.errors] }; }
export function toggleCampaignMapOverlay(state: CampaignMapDiagnostics, overlay: CampaignMapOverlay): CampaignMapDiagnostics { const enabled = new Set(state.enabled); enabled.has(overlay) ? enabled.delete(overlay) : enabled.add(overlay); return { ...state, enabled }; }
