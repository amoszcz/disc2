import type { RouteAttempt, RouteFeedback } from "../scenario/types";
import { terrainLabel } from "./terrainLookup";

export function createRouteFeedback(routeAttempt: RouteAttempt): RouteFeedback {
  const label = terrainLabel(routeAttempt.resolvedTerrain.terrainType);
  return {
    destinationPosition: routeAttempt.toPosition,
    terrainLabel: label,
    movementImpact: routeAttempt.isLegal
      ? `${routeAttempt.movementCost} movement`
      : routeAttempt.resolvedTerrain.isTraversable
        ? `${routeAttempt.movementCost} movement required`
        : "Blocked terrain",
    blockedReason: routeAttempt.failureReason
  };
}
