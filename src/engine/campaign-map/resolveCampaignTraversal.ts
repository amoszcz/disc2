import type { Position } from "../scenario/types";
import type { CampaignTraversal, GeneratedCampaignMap } from "./types";
import { campaignCellAt } from "./adaptScenarioWorldMap";
export function resolveCampaignTraversal(map: GeneratedCampaignMap, position: Position): CampaignTraversal { const cell = campaignCellAt(map, position.x, position.y) ?? null; if (!cell) return { walkable: false, movementCost: Infinity, crossing: null, explanation: "That destination is outside the map.", cell }; if (!cell.walkable) return { walkable: false, movementCost: Infinity, crossing: cell.crossing, explanation: `${cell.biome} cannot be traversed.`, cell }; return { walkable: true, movementCost: cell.movementCost, crossing: cell.crossing, explanation: null, cell }; }
