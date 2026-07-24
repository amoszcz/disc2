import type { CampaignMapGenerationConfig, GeneratedCampaignMap } from "./types";
import { generateTerrainCells } from "./generateTerrain";
import { generateRegions } from "./generateRegions";
import { placeLocations } from "./placeLocations";
import { generateBarriers } from "./generateBarriers";
import { routeStrategicConnections } from "./routeConnections";
import { validateCampaignMap } from "./validateCampaignMap";
export function generateCampaignMap(mapId: string, config: CampaignMapGenerationConfig): GeneratedCampaignMap { const cells = generateTerrainCells(config); const regions = generateRegions(cells); const locations = placeLocations(cells, config); const connections = routeStrategicConnections(locations, cells); const barriers = generateBarriers(cells, config.width, config.height); const map: GeneratedCampaignMap = { schemaVersion: 1, mapId, width: config.width, height: config.height, cells, regions, locations, connections, rivers: barriers.rivers, mountainRanges: barriers.mountainRanges, metadata: { generatorVersion: "campaign-1", revision: `${mapId}:${config.seed}`, source: "generated", seed: config.seed, configFingerprint: `${config.width}x${config.height}` }, validation: { valid: false, score: 0, errors: [], warnings: [], metrics: {} } }; map.validation = validateCampaignMap(map); return map; }
