import type { Position, ResolvedMovementTile, ScenarioDefinition } from "../scenario/types";
import { resolveTerrainTile } from "./terrainLookup";
import { resolveMovementObjectStack } from "./movementObjectLookup";
import { adaptScenarioWorldMap } from "../campaign-map/adaptScenarioWorldMap";
import { resolveCampaignTraversal } from "../campaign-map/resolveCampaignTraversal";
import { getScenarioWorldMaps } from "../scenario/types";

export function resolveMovementTile(scenario: ScenarioDefinition, position: Position): ResolvedMovementTile {
  const terrainTile = resolveTerrainTile(scenario, position);
  const movementObjects = resolveMovementObjectStack(scenario, position);
  const activeWorldMap = getScenarioWorldMaps(scenario).find((worldMap) => worldMap.map === scenario.map) ?? getScenarioWorldMaps(scenario)[0];
  const semanticTraversal = activeWorldMap ? resolveCampaignTraversal(adaptScenarioWorldMap(scenario, activeWorldMap), position) : null;

  const isBridgeCrossing = terrainTile.terrainType === "rivers" && movementObjects.passabilityOverride === "traversable";
  const isTraversable = semanticTraversal?.walkable ?? (terrainTile.isTraversable || isBridgeCrossing);
  const baseMovementCost = semanticTraversal?.movementCost ?? (isBridgeCrossing ? 1 : terrainTile.movementCost);
  const adjustedMovementCost = Number.isFinite(baseMovementCost)
    ? Math.max(1, baseMovementCost + movementObjects.movementDeltaTotal)
    : baseMovementCost;

  return {
    ...terrainTile,
    baseTerrainType: terrainTile.terrainType,
    isTraversable,
    movementCost: semanticTraversal ? baseMovementCost : adjustedMovementCost,
    movementObjects
  };
}
