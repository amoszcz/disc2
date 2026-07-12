import type { GameState, Position } from "../scenario/types";
import { isValidMove, movementCost } from "./mapRules";
import { collectPickupIfPresent } from "./pickupResolution";
import { buildRouteAttempt } from "./routeRules";
import { createRouteFeedback } from "./terrainFeedback";
import { hasTerrainRegions } from "./terrainLookup";

export interface HeroActionResult {
  ok: boolean;
  reason?: string;
}

export function selectHero(state: GameState, heroId: string): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === heroId);
  if (!hero) {
    return { ok: false, reason: "Hero not found." };
  }
  if (hero.ownerPlayerId !== state.activePlayerId) {
    return { ok: false, reason: "Only the active player's hero can be selected." };
  }
  if (hero.availabilityState === "defeated") {
    return { ok: false, reason: "That hero has been defeated." };
  }
  state.selectedHeroId = heroId;
  state.routeFeedback = null;
  return { ok: true };
}

export function moveSelectedHero(state: GameState, position: Position): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  if (!hero) {
    return { ok: false, reason: "Select a hero first." };
  }

  if (hasTerrainRegions(state.scenario)) {
    const routeAttempt = buildRouteAttempt(state.scenario, hero.id, hero.mapPosition, position, hero.remainingMovement);
    state.routeFeedback = createRouteFeedback(routeAttempt);
    if (!routeAttempt.isLegal) {
      return { ok: false, reason: routeAttempt.failureReason ?? "That move is not allowed." };
    }

    hero.mapPosition = { ...position };
    hero.remainingMovement -= routeAttempt.movementCost;
    state.messageLog.push(
      `${hero.name} moved onto ${state.routeFeedback.terrainLabel.toLowerCase()} at (${position.x + 1}, ${position.y + 1}).`
    );
    collectPickupIfPresent(state, hero.id);
    return { ok: true };
  }

  if (!isValidMove(state.scenario.map, hero.mapPosition, position, hero.remainingMovement)) {
    return { ok: false, reason: "That move is outside the hero's remaining movement." };
  }

  const cost = movementCost(hero.mapPosition, position);
  hero.mapPosition = { ...position };
  hero.remainingMovement -= cost;
  state.routeFeedback = null;
  state.messageLog.push(`${hero.name} moved to (${position.x + 1}, ${position.y + 1}).`);
  collectPickupIfPresent(state, hero.id);
  return { ok: true };
}
