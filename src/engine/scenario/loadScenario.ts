import type { ScenarioDefinition, ScenarioOption } from "./types";
import type { GeneratedCampaignMap } from "../campaign-map/types";
import { adaptScenarioWorldMap } from "../campaign-map/adaptScenarioWorldMap";
import { generateCampaignMap } from "../campaign-map/generateCampaignMap";
import { applyScenarioWorldMap, cloneScenario, getMainWorldMapId, getScenarioWorldMaps, getWorldMapById } from "./types";
import { coreMapLoopScenario } from "../../content/scenarios/core-map-loop";
import { advancedTerrainScenario } from "../../content/scenarios/advanced-terrain-scenario";
import { submapExpeditionScenario } from "../../content/scenarios/submap-expedition-scenario";
import { isWithinBounds } from "../map/mapRules";
import { resolveMovementTile } from "../map/movementObjectRules";
import { normalizeMovementObjectRegions } from "../map/movementObjectRegions";
import { normalizeTerrainRegions } from "../map/terrainRegions";
import { resolveTerrainTile } from "../map/terrainLookup";

export type ScenarioId = "core-map-loop" | "advanced-terrain-scenario" | "submap-expedition-scenario";

const SCENARIOS: Record<ScenarioId, ScenarioDefinition> = {
  "core-map-loop": coreMapLoopScenario,
  "advanced-terrain-scenario": advancedTerrainScenario,
  "submap-expedition-scenario": submapExpeditionScenario
};

const SCENARIO_OPTIONS: ScenarioOption[] = [
  {
    id: "core-map-loop",
    label: coreMapLoopScenario.name,
    description: coreMapLoopScenario.description
  },
  {
    id: "advanced-terrain-scenario",
    label: advancedTerrainScenario.name,
    description: advancedTerrainScenario.description
  },
  {
    id: "submap-expedition-scenario",
    label: submapExpeditionScenario.name,
    description: submapExpeditionScenario.description
  }
];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function materializeScenarioMaps(scenario: ScenarioDefinition): void {
  if (!scenario.worldMaps || scenario.worldMaps.length === 0) {
    scenario.worldMaps = getScenarioWorldMaps(scenario);
  }

  if (!scenario.mapLinks) {
    scenario.mapLinks = [];
  }

  const mainMapId = getMainWorldMapId(scenario);
  for (const hero of scenario.heroes) {
    hero.mapId ||= mainMapId;
  }
  for (const pickup of scenario.resourcePickups) {
    pickup.mapId ||= mainMapId;
  }
  for (const location of scenario.guardedLocations) {
    location.mapId ||= mainMapId;
  }

  applyScenarioWorldMap(scenario, mainMapId);
}

export function validateScenario(scenario: ScenarioDefinition): void {
  materializeScenarioMaps(scenario);
  assert(scenario.heroes.length > 0, "Scenario must include at least one hero.");
  assert(scenario.players.some((player) => player.kind === "player"), "Scenario must include a player side.");
  assert(scenario.guardForces.length > 0, "Scenario must include at least one opposing or blocking force.");

  const playerIds = new Set(scenario.players.map((player) => player.id));
  const locationIds = new Set(scenario.guardedLocations.map((location) => location.id));
  const unitIds = new Set(scenario.units.map((unit) => unit.id));
  const worldMaps = getScenarioWorldMaps(scenario);
  const worldMapIds = new Set(worldMaps.map((worldMap) => worldMap.id));

  for (const worldMap of worldMaps) {
    assert(worldMap.map.width > 0 && worldMap.map.height > 0, `World map ${worldMap.id} must have positive dimensions.`);
  }

  for (const hero of scenario.heroes) {
    assert(playerIds.has(hero.ownerPlayerId), `Hero ${hero.id} references a missing player.`);
    const worldMap = getWorldMapById(scenario, hero.mapId);
    assert(Boolean(worldMap), `Hero ${hero.id} references missing map ${hero.mapId}.`);
    assert(isWithinBounds(worldMap!.map, hero.mapPosition), `Hero ${hero.id} is out of bounds.`);
    for (const unitId of hero.unitIds) {
      assert(unitIds.has(unitId), `Hero ${hero.id} references missing unit ${unitId}.`);
    }
  }

  for (const pickup of scenario.resourcePickups) {
    const worldMap = getWorldMapById(scenario, pickup.mapId);
    assert(Boolean(worldMap), `Pickup ${pickup.id} references missing map ${pickup.mapId}.`);
    assert(isWithinBounds(worldMap!.map, pickup.mapPosition), `Pickup ${pickup.id} is out of bounds.`);
    assert(pickup.amount > 0, `Pickup ${pickup.id} must have a positive amount.`);
  }

  for (const location of scenario.guardedLocations) {
    assert(locationIds.has(location.id), `Guarded location ${location.id} is missing.`);
    const worldMap = getWorldMapById(scenario, location.mapId);
    assert(Boolean(worldMap), `Guarded location ${location.id} references missing map ${location.mapId}.`);
    assert(isWithinBounds(worldMap!.map, location.mapPosition), `Guarded location ${location.id} is out of bounds.`);
  }

  for (const force of scenario.guardForces) {
    assert(locationIds.has(force.guardedLocationId), `Guard force ${force.id} references missing location.`);
    assert(force.unitIds.length > 0, `Guard force ${force.id} must contain units.`);
    for (const unitId of force.unitIds) {
      assert(unitIds.has(unitId), `Guard force ${force.id} references missing unit ${unitId}.`);
    }
  }

  for (const worldMap of worldMaps) {
    if (worldMap.terrainRegions && worldMap.terrainRegions.length > 0) {
      const normalizedRegions = normalizeTerrainRegions(worldMap.terrainRegions);
      for (const region of normalizedRegions) {
        assert(region.coverage.kind === "rect", `Terrain region ${region.id} must use rectangular coverage.`);
        assert(region.coverage.width > 0 && region.coverage.height > 0, `Terrain region ${region.id} must cover at least one tile.`);
        assert(
          isWithinBounds(worldMap.map, { x: region.coverage.x, y: region.coverage.y }) &&
            isWithinBounds(worldMap.map, {
              x: region.coverage.x + region.coverage.width - 1,
              y: region.coverage.y + region.coverage.height - 1
            }),
          `Terrain region ${region.id} is out of bounds.`
        );
      }
    }

    if (worldMap.movementObjectRegions && worldMap.movementObjectRegions.length > 0) {
      const normalizedRegions = normalizeMovementObjectRegions(worldMap.movementObjectRegions);
      for (const region of normalizedRegions) {
        assert(region.coverage.kind === "rect", `Movement object region ${region.id} must use rectangular coverage.`);
        assert(
          region.coverage.width > 0 && region.coverage.height > 0,
          `Movement object region ${region.id} must cover at least one tile.`
        );
        assert(
          isWithinBounds(worldMap.map, { x: region.coverage.x, y: region.coverage.y }) &&
            isWithinBounds(worldMap.map, {
              x: region.coverage.x + region.coverage.width - 1,
              y: region.coverage.y + region.coverage.height - 1
            }),
          `Movement object region ${region.id} is out of bounds.`
        );

        if (region.objectType === "bridge") {
          const worldScenario = { ...scenario, map: worldMap.map, terrainRegions: worldMap.terrainRegions, movementObjectRegions: worldMap.movementObjectRegions };
          for (let y = region.coverage.y; y < region.coverage.y + region.coverage.height; y += 1) {
            for (let x = region.coverage.x; x < region.coverage.x + region.coverage.width; x += 1) {
              const terrainTile = resolveTerrainTile(worldScenario, { x, y });
              assert(terrainTile.terrainType === "rivers", `Bridge region ${region.id} can only cover river tiles.`);
            }
          }
        }
      }
    }
  }

  for (const link of scenario.mapLinks ?? []) {
    assert(worldMapIds.has(link.sourceMapId), `Travel link ${link.id} references missing source map.`);
    assert(worldMapIds.has(link.destinationMapId), `Travel link ${link.id} references missing destination map.`);
    const sourceMap = getWorldMapById(scenario, link.sourceMapId)!;
    const destinationMap = getWorldMapById(scenario, link.destinationMapId)!;
    assert(isWithinBounds(sourceMap.map, link.sourcePosition), `Travel link ${link.id} source position is out of bounds.`);
    assert(
      isWithinBounds(destinationMap.map, link.destinationPosition),
      `Travel link ${link.id} destination position is out of bounds.`
    );

    if (link.triggerKind === "exit") {
      const sourceScenario = {
        ...scenario,
        map: sourceMap.map,
        terrainRegions: sourceMap.terrainRegions,
        movementObjectRegions: sourceMap.movementObjectRegions
      };
      const sourceTile = resolveMovementTile(sourceScenario, link.sourcePosition);
      assert(sourceTile.isTraversable, `Exit link ${link.id} must start on a traversable tile.`);
    }
  }
}

export function loadScenario(scenarioId: ScenarioId = "core-map-loop"): ScenarioDefinition {
  const source = SCENARIOS[scenarioId];
  if (!source) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  const scenario = cloneScenario(source);
  validateScenario(scenario);
  return scenario;
}

/** Resolves semantic map data without changing authored scenario gameplay state. */
export function resolveCampaignMap(scenario: ScenarioDefinition, mapId: string): GeneratedCampaignMap {
  const worldMap = getWorldMapById(scenario, mapId);
  if (!worldMap) throw new Error(`Unknown world map: ${mapId}`);
  if (worldMap.campaignGeneration?.enabled) {
    const generated = generateCampaignMap(worldMap.id, { seed: worldMap.campaignGeneration.seed, width: worldMap.map.width, height: worldMap.map.height });
    const authored = adaptScenarioWorldMap(scenario, worldMap);
    generated.locations = authored.locations;
    generated.metadata = { ...generated.metadata, revision: `${generated.metadata.revision}:authored-landmarks` };
    return generated;
  }
  return adaptScenarioWorldMap(scenario, worldMap);
}

export function getScenarioOptions(): ScenarioOption[] {
  return cloneScenario(SCENARIO_OPTIONS);
}

export function getDefaultScenarioId(): ScenarioId {
  return "core-map-loop";
}

export function isScenarioId(value: string | null): value is ScenarioId {
  return value === "core-map-loop" || value === "advanced-terrain-scenario" || value === "submap-expedition-scenario";
}
