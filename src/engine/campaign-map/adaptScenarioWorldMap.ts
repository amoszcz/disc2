import type { ScenarioDefinition, ScenarioWorldMap, TerrainTypeName } from "../scenario/types";
import { resolveMovementTile } from "../map/movementObjectRules";
import type { CampaignBiome, CampaignCell, CampaignLocation, GeneratedCampaignMap } from "./types";

const terrainBiome: Record<TerrainTypeName, CampaignBiome> = { road: "road", grass: "plains", plains: "plains", mud: "swamp", woods: "forest", mountains: "mountains", lakes: "water", rivers: "water" };
export function adaptScenarioWorldMap(scenario: ScenarioDefinition, worldMap: ScenarioWorldMap): GeneratedCampaignMap {
  const mapScenario = { ...scenario, map: worldMap.map, terrainRegions: worldMap.terrainRegions, movementObjectRegions: worldMap.movementObjectRegions };
  const cells: CampaignCell[] = [];
  for (let y = 0; y < worldMap.map.height; y += 1) for (let x = 0; x < worldMap.map.width; x += 1) {
    const movement = resolveMovementTile(mapScenario, { x, y }); const biome = terrainBiome[movement.baseTerrainType];
    cells.push({ x, y, elevation: biome === "mountains" ? .8 : biome === "water" ? .1 : .45, moisture: biome === "swamp" || biome === "water" ? .8 : .4, corruption: 0, temperature: .5, biome, regionId: `region-${biome}`, movementCost: movement.movementCost, walkable: movement.isTraversable, roadType: biome === "road" ? "secondary" : null, riverFlow: movement.baseTerrainType === "rivers" ? 1 : 0, crossing: movement.movementObjects.objectTypes.includes("bridge") ? "bridge" : null, tags: movement.movementObjects.objectTypes });
  }
  const locations: CampaignLocation[] = [
    ...scenario.heroes.filter((hero) => hero.mapId === worldMap.id).map((hero) => ({ id: `hero-${hero.id}`, name: hero.name, type: "start" as const, position: hero.mapPosition, importance: 10, tags: ["hero"] })),
    ...scenario.guardedLocations.filter((location) => location.mapId === worldMap.id).map((location) => ({ id: location.id, name: location.name, type: "objective" as const, position: location.mapPosition, importance: 9, tags: [location.locationType] })),
    ...scenario.resourcePickups.filter((pickup) => pickup.mapId === worldMap.id).map((pickup) => ({ id: pickup.id, name: "Resource site", type: "resource-site" as const, position: pickup.mapPosition, importance: 4, tags: [pickup.resourceType] }))
  ];
  const regions = [...new Set(cells.map((cell) => cell.biome))].map((biome) => ({ id: `region-${biome}`, name: biome === "road" ? "Old Roads" : `${biome[0].toUpperCase()}${biome.slice(1)} Reach`, biome, danger: biome === "mountains" ? 3 : 1, corruption: 0, cells: cells.filter((cell) => cell.biome === biome).map(({ x, y }) => ({ x, y })) }));
  return { schemaVersion: 1, mapId: worldMap.id, width: worldMap.map.width, height: worldMap.map.height, cells, regions, locations, connections: [], rivers: [], mountainRanges: [], metadata: { generatorVersion: "adapter-1", revision: `${worldMap.id}:${worldMap.map.width}x${worldMap.map.height}`, source: "adapter", seed: 0, configFingerprint: worldMap.id }, validation: { valid: true, score: 1, errors: [], warnings: [], metrics: { cells: cells.length, locations: locations.length } } };
}
export function campaignCellAt(map: GeneratedCampaignMap, x: number, y: number): CampaignCell | undefined { return map.cells[y * map.width + x]; }
