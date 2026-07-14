import type { RouteAttempt, RouteFeedback } from "../scenario/types";
import { terrainLabel } from "./terrainLookup";

function movementObjectLabel(objectType: RouteFeedback["objectLabels"][number]): string {
  switch (objectType) {
    case "bridge":
      return "Bridge";
    case "milestone":
      return "Milestone";
    case "rubble":
      return "Rubble";
  }
}

export function createRouteFeedback(routeAttempt: RouteAttempt): RouteFeedback {
  const label = terrainLabel(routeAttempt.resolvedTerrain.terrainType);
  const objectLabels = routeAttempt.resolvedTerrain.movementObjects.objectTypes.map((objectType) => movementObjectLabel(objectType));
  const isBridgeCrossing =
    routeAttempt.resolvedTerrain.baseTerrainType === "rivers" &&
    routeAttempt.resolvedTerrain.movementObjects.passabilityOverride === "traversable";
  const movementDeltaTotal = routeAttempt.resolvedTerrain.movementObjects.movementDeltaTotal;

  return {
    destinationPosition: routeAttempt.toPosition,
    terrainLabel: label,
    movementImpact: routeAttempt.isLegal
      ? `${routeAttempt.movementCost} movement`
      : routeAttempt.resolvedTerrain.isTraversable
        ? `${routeAttempt.movementCost} movement required`
        : "Blocked terrain",
    blockedReason: routeAttempt.failureReason,
    objectLabels,
    passabilityExplanation: isBridgeCrossing ? "Bridge turns this river tile into a legal crossing." : null,
    movementDeltaExplanation:
      movementDeltaTotal < 0
        ? `Movement reduced by ${Math.abs(movementDeltaTotal)}.`
        : movementDeltaTotal > 0
          ? `Movement increased by ${movementDeltaTotal}.`
          : null,
    stackExplanation:
      objectLabels.length > 1
        ? `${objectLabels.join(" + ")} combine for a final cost of ${routeAttempt.movementCost}.`
        : objectLabels.length === 1
          ? `${objectLabels[0]} affects this tile.`
          : null
  };
}
