import type { ScenarioDefinition } from "./types";
import { cloneScenario } from "./types";
import { coreMapLoopScenario } from "../../content/scenarios/core-map-loop";
import { advancedTerrainScenario } from "../../content/scenarios/advanced-terrain-scenario";
import { isWithinBounds } from "../map/mapRules";
import { normalizeMovementObjectRegions } from "../map/movementObjectRegions";
import { normalizeTerrainRegions } from "../map/terrainRegions";
import { resolveTerrainTile } from "../map/terrainLookup";

export type ScenarioId = "core-map-loop" | "advanced-terrain-scenario";

const SCENARIOS: Record<ScenarioId, ScenarioDefinition> = {
  "core-map-loop": coreMapLoopScenario,
  "advanced-terrain-scenario": advancedTerrainScenario
};

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateScenario(scenario: ScenarioDefinition): void {
  assert(scenario.heroes.length > 0, "Scenario must include at least one hero.");
  assert(scenario.players.some((player) => player.kind === "player"), "Scenario must include a player side.");
  assert(scenario.guardForces.length > 0, "Scenario must include at least one opposing or blocking force.");

  const playerIds = new Set(scenario.players.map((player) => player.id));
  const locationIds = new Set(scenario.guardedLocations.map((location) => location.id));
  const unitIds = new Set(scenario.units.map((unit) => unit.id));

  for (const hero of scenario.heroes) {
    assert(playerIds.has(hero.ownerPlayerId), `Hero ${hero.id} references a missing player.`);
    assert(isWithinBounds(scenario.map, hero.mapPosition), `Hero ${hero.id} is out of bounds.`);
    for (const unitId of hero.unitIds) {
      assert(unitIds.has(unitId), `Hero ${hero.id} references missing unit ${unitId}.`);
    }
  }

  for (const pickup of scenario.resourcePickups) {
    assert(isWithinBounds(scenario.map, pickup.mapPosition), `Pickup ${pickup.id} is out of bounds.`);
    assert(pickup.amount > 0, `Pickup ${pickup.id} must have a positive amount.`);
  }

  for (const location of scenario.guardedLocations) {
    assert(locationIds.has(location.id), `Guarded location ${location.id} is missing.`);
    assert(isWithinBounds(scenario.map, location.mapPosition), `Guarded location ${location.id} is out of bounds.`);
  }

  for (const force of scenario.guardForces) {
    assert(locationIds.has(force.guardedLocationId), `Guard force ${force.id} references missing location.`);
    assert(force.unitIds.length > 0, `Guard force ${force.id} must contain units.`);
    for (const unitId of force.unitIds) {
      assert(unitIds.has(unitId), `Guard force ${force.id} references missing unit ${unitId}.`);
    }
  }

  if (scenario.terrainRegions && scenario.terrainRegions.length > 0) {
    const normalizedRegions = normalizeTerrainRegions(scenario.terrainRegions);
    for (const region of normalizedRegions) {
      assert(region.coverage.kind === "rect", `Terrain region ${region.id} must use rectangular coverage.`);
      assert(region.coverage.width > 0 && region.coverage.height > 0, `Terrain region ${region.id} must cover at least one tile.`);
      assert(
        isWithinBounds(scenario.map, { x: region.coverage.x, y: region.coverage.y }) &&
          isWithinBounds(scenario.map, {
            x: region.coverage.x + region.coverage.width - 1,
            y: region.coverage.y + region.coverage.height - 1
          }),
        `Terrain region ${region.id} is out of bounds.`
      );
    }
  }

  if (scenario.movementObjectRegions && scenario.movementObjectRegions.length > 0) {
    const normalizedRegions = normalizeMovementObjectRegions(scenario.movementObjectRegions);
    for (const region of normalizedRegions) {
      assert(region.coverage.kind === "rect", `Movement object region ${region.id} must use rectangular coverage.`);
      assert(
        region.coverage.width > 0 && region.coverage.height > 0,
        `Movement object region ${region.id} must cover at least one tile.`
      );
      assert(
        isWithinBounds(scenario.map, { x: region.coverage.x, y: region.coverage.y }) &&
          isWithinBounds(scenario.map, {
            x: region.coverage.x + region.coverage.width - 1,
            y: region.coverage.y + region.coverage.height - 1
          }),
        `Movement object region ${region.id} is out of bounds.`
      );

      if (region.objectType === "bridge") {
        for (let y = region.coverage.y; y < region.coverage.y + region.coverage.height; y += 1) {
          for (let x = region.coverage.x; x < region.coverage.x + region.coverage.width; x += 1) {
            const terrainTile = resolveTerrainTile(scenario, { x, y });
            assert(
              terrainTile.terrainType === "rivers",
              `Bridge region ${region.id} can only cover river tiles.`
            );
          }
        }
      }
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
