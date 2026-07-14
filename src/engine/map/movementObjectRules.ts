import type { Position, ResolvedMovementTile, ScenarioDefinition } from "../scenario/types";
import { resolveTerrainTile } from "./terrainLookup";
import { resolveMovementObjectStack } from "./movementObjectLookup";

export function resolveMovementTile(scenario: ScenarioDefinition, position: Position): ResolvedMovementTile {
  const terrainTile = resolveTerrainTile(scenario, position);
  const movementObjects = resolveMovementObjectStack(scenario, position);

  const isBridgeCrossing = terrainTile.terrainType === "rivers" && movementObjects.passabilityOverride === "traversable";
  const isTraversable = terrainTile.isTraversable || isBridgeCrossing;
  const baseMovementCost = isBridgeCrossing ? 1 : terrainTile.movementCost;
  const adjustedMovementCost = Number.isFinite(baseMovementCost)
    ? Math.max(1, baseMovementCost + movementObjects.movementDeltaTotal)
    : baseMovementCost;

  return {
    ...terrainTile,
    baseTerrainType: terrainTile.terrainType,
    isTraversable,
    movementCost: adjustedMovementCost,
    movementObjects
  };
}
