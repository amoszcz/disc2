import type { Position, RoutePreview, ScenarioDefinition } from "../scenario/types";
import { markRoutePreviewForContinuation } from "../map/routePreviewState";

export function resetMovementForActivePlayer(scenario: ScenarioDefinition, activePlayerId: string): ScenarioDefinition {
  for (const hero of scenario.heroes) {
    if (hero.ownerPlayerId === activePlayerId && hero.availabilityState !== "defeated") {
      hero.remainingMovement = hero.movementPerTurn;
    }
  }
  return scenario;
}

export function advanceTurn(scenario: ScenarioDefinition, activePlayerId: string): string {
  const activeOrder = scenario.players
    .filter((player) => !player.defeatState && player.kind === "player")
    .map((player) => player.id);
  const currentIndex = activeOrder.indexOf(activePlayerId);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % activeOrder.length : 0;
  return activeOrder[nextIndex];
}

export function carryRoutePreviewAcrossTurn(
  routePreview: RoutePreview | null,
  heroPosition: Position | null
): RoutePreview | null {
  if (!routePreview || routePreview.steps.length === 0 || !heroPosition) {
    return routePreview;
  }

  return markRoutePreviewForContinuation(routePreview, heroPosition, routePreview.steps);
}
