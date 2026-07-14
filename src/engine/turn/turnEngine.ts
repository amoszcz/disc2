import type { GameState, Position, RoutePreview, ScenarioDefinition } from "../scenario/types";
import type { HeroActionResult } from "../map/heroActions";
import { autoAdvanceRoutePreview } from "../map/heroActions";
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

export function autoAdvanceActiveRouteBeforeTurnEnd(state: GameState): HeroActionResult | null {
  const routePreview = state.activeRoutePreview;
  if (!routePreview || routePreview.steps.length === 0) {
    return null;
  }

  const hero = state.scenario.heroes.find((entry) => entry.id === routePreview.heroId);
  if (!hero || hero.availabilityState === "defeated" || hero.ownerPlayerId !== state.activePlayerId) {
    return null;
  }

  if (hero.remainingMovement <= 0) {
    return null;
  }

  const previousSelectedHeroId = state.selectedHeroId;
  state.selectedHeroId = hero.id;
  const result = autoAdvanceRoutePreview(state);
  state.selectedHeroId = previousSelectedHeroId;
  return result;
}
