import type { Position, RouteAttempt, ScenarioDefinition } from "../scenario/types";
import { movementCost as legacyMovementCost, isWithinBounds } from "./mapRules";
import { hasMovementObjectRegions } from "./movementObjectLookup";
import { resolveMovementTile } from "./movementObjectRules";
import { hasTerrainRegions } from "./terrainLookup";

export function isAdjacent8(from: Position, to: Position): boolean {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return dx <= 1 && dy <= 1 && (dx !== 0 || dy !== 0);
}

export function routeDirection(from: Position, to: Position): "orthogonal" | "diagonal" {
  return from.x !== to.x && from.y !== to.y ? "diagonal" : "orthogonal";
}

export function buildRouteAttempt(
  scenario: ScenarioDefinition,
  heroId: string,
  fromPosition: Position,
  toPosition: Position,
  remainingMovement: number
): RouteAttempt {
  const direction = routeDirection(fromPosition, toPosition);

  if (!isWithinBounds(scenario.map, toPosition)) {
    return {
      heroId,
      fromPosition,
      toPosition,
      direction,
      resolvedTerrain: {
        position: { ...toPosition },
        terrainType: scenario.map.defaultTerrainType ?? "plains",
        baseTerrainType: scenario.map.defaultTerrainType ?? "plains",
        isTraversable: false,
        movementCost: Number.POSITIVE_INFINITY,
        movementObjects: {
          position: { ...toPosition },
          effects: [],
          objectTypes: [],
          passabilityOverride: null,
          movementDeltaTotal: 0,
          resolutionOrder: []
        }
      },
      movementCost: Number.POSITIVE_INFINITY,
      isLegal: false,
      failureReason: "That destination is outside the map."
    };
  }

  const resolvedTerrain = resolveMovementTile(scenario, toPosition);
  const movementCost = resolvedTerrain.movementCost;

  if ((hasTerrainRegions(scenario) || hasMovementObjectRegions(scenario)) && !isAdjacent8(fromPosition, toPosition)) {
    return {
      heroId,
      fromPosition,
      toPosition,
      direction,
      resolvedTerrain,
      movementCost,
      isLegal: false,
      failureReason: "Terrain movement is limited to adjacent tiles."
    };
  }

  if (!resolvedTerrain.isTraversable) {
    return {
      heroId,
      fromPosition,
      toPosition,
      direction,
      resolvedTerrain,
      movementCost,
      isLegal: false,
      failureReason: `${resolvedTerrain.terrainType} cannot be traversed.`
    };
  }

  if (movementCost > remainingMovement) {
    return {
      heroId,
      fromPosition,
      toPosition,
      direction,
      resolvedTerrain,
      movementCost,
      isLegal: false,
      failureReason: `Not enough movement for ${resolvedTerrain.terrainType}.`
    };
  }

  return {
    heroId,
    fromPosition,
    toPosition,
    direction,
    resolvedTerrain,
    movementCost,
    isLegal: true,
    failureReason: null
  };
}

export function legacyMoveWithinAllowance(
  scenario: ScenarioDefinition,
  fromPosition: Position,
  toPosition: Position,
  remainingMovement: number
): boolean {
  const cost = legacyMovementCost(fromPosition, toPosition);
  return isWithinBounds(scenario.map, toPosition) && cost > 0 && cost <= remainingMovement;
}
