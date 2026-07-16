import type { RouteAttempt, RouteFeedback, RoutePreview } from "../scenario/types";
import { terrainLabel } from "./terrainLookup";

function movementObjectLabel(objectType: RouteFeedback["objectLabels"][number]): string {
  switch (objectType) {
    case "bridge":
      return "Bridge";
    case "milestone":
      return "Milestone";
    case "rubble":
      return "Rubble";
    case "cave":
      return "Cave";
    case "teleport":
      return "Teleport";
    case "exit":
      return "Exit";
  }

  return objectType;
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
          : null,
    routeMode: routeAttempt.isLegal ? "move" : "blocked"
  };
}

export function createRoutePreviewFeedback(routePreview: RoutePreview): RouteFeedback {
  const destinationStep = routePreview.steps[routePreview.steps.length - 1];
  const movementImpact =
    routePreview.status === "continuation"
      ? `${routePreview.totalMovementCost} movement remaining`
      : `${routePreview.totalMovementCost} movement total`;

  return {
    destinationPosition: { ...routePreview.destinationPosition },
    terrainLabel: destinationStep?.terrainLabel ?? "Route",
    movementImpact,
    blockedReason: null,
    objectLabels: destinationStep?.objectLabels ?? [],
    passabilityExplanation:
      routePreview.status === "continuation"
        ? "Click the same destination again to continue this journey."
        : "Click the same destination again to confirm this route.",
    movementDeltaExplanation: null,
    stackExplanation:
      routePreview.steps.length > 0 ? `${routePreview.steps.length} step${routePreview.steps.length === 1 ? "" : "s"} plotted.` : null,
    routeMode: routePreview.status === "continuation" ? "continuation" : "preview",
    routeStepCount: routePreview.steps.length,
    routeTotalMovement: routePreview.totalMovementCost,
    previewMessage:
      routePreview.status === "continuation"
        ? "Route retained for later continuation."
        : "Route preview ready for confirmation."
  };
}
