import type { ScenarioDefinition } from "./types";
import { cloneScenario } from "./types";
import { coreMapLoopScenario } from "../../content/scenarios/core-map-loop";
import { isWithinBounds } from "../map/mapRules";

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
}

export function loadScenario(): ScenarioDefinition {
  const scenario = cloneScenario(coreMapLoopScenario);
  validateScenario(scenario);
  return scenario;
}
