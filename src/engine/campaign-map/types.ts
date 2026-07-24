import type { Position } from "../scenario/types";

export type CampaignBiome = "plains" | "forest" | "deadForest" | "swamp" | "corruptedSwamp" | "wasteland" | "deadland" | "hills" | "mountains" | "snowPeaks" | "water" | "road";
export type CampaignLocationType = "start" | "castle" | "town" | "shrine" | "ruin" | "vault" | "resource-site" | "pass" | "objective" | "exit";
export type CampaignRoadType = "primary" | "secondary" | "trail";

export interface CampaignCell extends Position {
  elevation: number; moisture: number; corruption: number; temperature: number;
  biome: CampaignBiome; regionId: string; movementCost: number; walkable: boolean;
  roadType: CampaignRoadType | null; riverFlow: number; crossing: "bridge" | "pass" | null; tags: string[];
}
export interface CampaignRegion { id: string; name: string; biome: CampaignBiome; danger: number; corruption: number; factionId?: string; cells: Position[]; }
export interface CampaignLocation { id: string; name: string; type: CampaignLocationType; position: Position; importance: number; factionId?: string; tags: string[]; }
export interface CampaignConnection { id: string; fromLocationId: string; toLocationId: string; path: Position[]; travelCost: number; roadType: CampaignRoadType; }
export interface CampaignBarrier { id: string; path: Position[]; width: number; passLocations: Position[]; }
export interface MapValidationResult { valid: boolean; score: number; errors: string[]; warnings: string[]; metrics: Record<string, number>; }
export interface CampaignMapMetadata { generatorVersion: string; revision: string; source: "adapter" | "generated"; seed: number; configFingerprint: string; }
export interface GeneratedCampaignMap { schemaVersion: 1; mapId: string; width: number; height: number; cells: CampaignCell[]; regions: CampaignRegion[]; locations: CampaignLocation[]; connections: CampaignConnection[]; rivers: CampaignBarrier[]; mountainRanges: CampaignBarrier[]; metadata: CampaignMapMetadata; validation: MapValidationResult; }
export interface CampaignMapGenerationConfig { seed: number; width: number; height: number; requiredLocationTypes?: CampaignLocationType[]; }
export interface CampaignTraversal { walkable: boolean; movementCost: number; crossing: CampaignCell["crossing"]; explanation: string | null; cell: CampaignCell | null; }

export const BIOME_MOVEMENT_COST: Record<CampaignBiome, number> = { plains: 1, road: 1, hills: 2, forest: 2, deadForest: 3, swamp: 6, corruptedSwamp: 8, wasteland: 3, deadland: 4, mountains: 25, snowPeaks: 35, water: Number.POSITIVE_INFINITY };
