import type { Position, RoutePreview, RouteStep } from "../scenario/types";
import { positionsEqual } from "./mapRules";

export function createRoutePreview(
  heroId: string,
  fromPosition: Position,
  destinationPosition: Position,
  steps: RouteStep[],
  status: RoutePreview["status"] = "previewed"
): RoutePreview {
  return {
    heroId,
    destinationPosition: { ...destinationPosition },
    steps: steps.map((step) => ({
      ...step,
      position: { ...step.position },
      objectLabels: [...step.objectLabels]
    })),
    totalMovementCost: steps.reduce((total, step) => total + step.movementCost, 0),
    status,
    lastValidatedFromPosition: { ...fromPosition },
    isAwaitingConfirmation: true
  };
}

export function clearRoutePreview(): null {
  return null;
}

export function isRoutePreviewOwnedByHero(routePreview: RoutePreview | null, heroId: string | null): boolean {
  return Boolean(routePreview && heroId && routePreview.heroId === heroId);
}

export function isSameRouteDestination(routePreview: RoutePreview | null, destinationPosition: Position): boolean {
  return Boolean(routePreview && positionsEqual(routePreview.destinationPosition, destinationPosition));
}

export function markRoutePreviewForContinuation(
  routePreview: RoutePreview,
  fromPosition: Position,
  remainingSteps: RouteStep[]
): RoutePreview {
  return {
    ...routePreview,
    steps: remainingSteps.map((step) => ({
      ...step,
      position: { ...step.position },
      objectLabels: [...step.objectLabels]
    })),
    totalMovementCost: remainingSteps.reduce((total, step) => total + step.movementCost, 0),
    status: "continuation",
    lastValidatedFromPosition: { ...fromPosition },
    isAwaitingConfirmation: true
  };
}

export function markRoutePreviewCompleted(routePreview: RoutePreview): RoutePreview {
  return {
    ...routePreview,
    steps: [],
    totalMovementCost: 0,
    status: "previewed",
    isAwaitingConfirmation: false
  };
}
