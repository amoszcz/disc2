import type { Position, RouteAttempt, RouteStep, ScenarioDefinition } from "../scenario/types";
import { hasMovementObjectRegions } from "./movementObjectLookup";
import { isWithinBounds, movementCost as legacyMovementCost, positionsEqual } from "./mapRules";
import { buildRouteAttempt } from "./routeRules";
import { hasTerrainRegions } from "./terrainLookup";
import { terrainLabel } from "./terrainLookup";

interface PathNode {
  position: Position;
  cost: number;
}

export interface RoutePathResult {
  ok: boolean;
  steps: RouteStep[];
  totalMovementCost: number;
  reason?: string;
}

const DIRECTIONS_8: Position[] = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 }
];

const DIRECTIONS_4: Position[] = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 }
];

function keyFor(position: Position): string {
  return `${position.x},${position.y}`;
}

function buildLegacyStepAttempt(
  scenario: ScenarioDefinition,
  heroId: string,
  fromPosition: Position,
  toPosition: Position
): RouteAttempt {
  const movementCost = legacyMovementCost(fromPosition, toPosition);
  const isLegal = isWithinBounds(scenario.map, toPosition);
  return {
    heroId,
    fromPosition,
    toPosition,
    direction: fromPosition.x !== toPosition.x && fromPosition.y !== toPosition.y ? "diagonal" : "orthogonal",
    resolvedTerrain: {
      position: { ...toPosition },
      terrainType: scenario.map.defaultTerrainType ?? "plains",
      baseTerrainType: scenario.map.defaultTerrainType ?? "plains",
      isTraversable: isLegal,
      movementCost,
      movementObjects: {
        position: { ...toPosition },
        effects: [],
        objectTypes: [],
        passabilityOverride: null,
        movementDeltaTotal: 0,
        resolutionOrder: []
      }
    },
    movementCost,
    isLegal,
    failureReason: isLegal ? null : "That destination is outside the map."
  };
}

export function createRouteStep(routeAttempt: RouteAttempt): RouteStep {
  return {
    position: { ...routeAttempt.toPosition },
    movementCost: routeAttempt.movementCost,
    terrainLabel: terrainLabel(routeAttempt.resolvedTerrain.terrainType),
    objectLabels: routeAttempt.resolvedTerrain.movementObjects.objectTypes.map((objectType) =>
      objectType[0].toUpperCase() + objectType.slice(1)
    )
  };
}

function getRouteAttemptForStep(
  scenario: ScenarioDefinition,
  heroId: string,
  fromPosition: Position,
  toPosition: Position
): RouteAttempt {
  if (hasTerrainRegions(scenario) || hasMovementObjectRegions(scenario)) {
    return buildRouteAttempt(scenario, heroId, fromPosition, toPosition, Number.POSITIVE_INFINITY);
  }

  return buildLegacyStepAttempt(scenario, heroId, fromPosition, toPosition);
}

function getNeighborPositions(scenario: ScenarioDefinition, position: Position): Position[] {
  const directions = hasTerrainRegions(scenario) || hasMovementObjectRegions(scenario) ? DIRECTIONS_8 : DIRECTIONS_4;
  return directions
    .map((direction) => ({ x: position.x + direction.x, y: position.y + direction.y }))
    .filter((candidate) => isWithinBounds(scenario.map, candidate));
}

export function findShortestRoute(
  scenario: ScenarioDefinition,
  heroId: string,
  fromPosition: Position,
  destinationPosition: Position
): RoutePathResult {
  if (positionsEqual(fromPosition, destinationPosition)) {
    return { ok: false, steps: [], totalMovementCost: 0, reason: "That destination is already occupied by the hero." };
  }

  const frontier: PathNode[] = [{ position: { ...fromPosition }, cost: 0 }];
  const costs = new Map<string, number>([[keyFor(fromPosition), 0]]);
  const previous = new Map<string, Position>();
  const attempts = new Map<string, RouteAttempt>();

  while (frontier.length > 0) {
    frontier.sort((left, right) => left.cost - right.cost);
    const current = frontier.shift();
    if (!current) {
      break;
    }

    if (positionsEqual(current.position, destinationPosition)) {
      break;
    }

    for (const neighbor of getNeighborPositions(scenario, current.position)) {
      const routeAttempt = getRouteAttemptForStep(scenario, heroId, current.position, neighbor);
      if (!routeAttempt.isLegal) {
        continue;
      }

      const nextCost = current.cost + routeAttempt.movementCost;
      const neighborKey = keyFor(neighbor);
      const knownCost = costs.get(neighborKey);
      if (knownCost !== undefined && nextCost >= knownCost) {
        continue;
      }

      costs.set(neighborKey, nextCost);
      previous.set(neighborKey, { ...current.position });
      attempts.set(neighborKey, routeAttempt);
      frontier.push({ position: { ...neighbor }, cost: nextCost });
    }
  }

  const destinationKey = keyFor(destinationPosition);
  if (!costs.has(destinationKey) || !attempts.has(destinationKey)) {
    return { ok: false, steps: [], totalMovementCost: 0, reason: "No legal route could be plotted to that destination." };
  }

  const orderedAttempts: RouteAttempt[] = [];
  let cursorKey = destinationKey;
  while (cursorKey !== keyFor(fromPosition)) {
    const routeAttempt = attempts.get(cursorKey);
    const previousPosition = previous.get(cursorKey);
    if (!routeAttempt || !previousPosition) {
      break;
    }

    orderedAttempts.unshift(routeAttempt);
    cursorKey = keyFor(previousPosition);
  }

  const steps = orderedAttempts.map((routeAttempt) => createRouteStep(routeAttempt));
  return {
    ok: steps.length > 0,
    steps,
    totalMovementCost: steps.reduce((total, step) => total + step.movementCost, 0),
    reason: steps.length > 0 ? undefined : "No legal route could be plotted to that destination."
  };
}
