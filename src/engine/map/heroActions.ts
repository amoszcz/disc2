import type { GameState, Position, RouteProgressResult, RouteStep } from "../scenario/types";
import { findGuardedLocationAtHero, isLocationBlocked } from "./guardRules";
import { isValidMove, movementCost, positionsEqual } from "./mapRules";
import { collectPickupIfPresent } from "./pickupResolution";
import { clearRoutePreview, createRoutePreview, isRoutePreviewOwnedByHero, markRoutePreviewForContinuation } from "./routePreviewState";
import { findShortestRoute } from "./routePathfinding";
import { hasMovementObjectRegions } from "./movementObjectLookup";
import { buildRouteAttempt } from "./routeRules";
import { createRouteFeedback, createRoutePreviewFeedback } from "./terrainFeedback";
import { hasTerrainRegions } from "./terrainLookup";

export interface HeroActionResult {
  ok: boolean;
  reason?: string;
  routeProgress?: RouteProgressResult;
}

type RouteAdvanceTrigger = "manual" | "end-turn";

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

export function clearOwnedRoutePreview(state: GameState, heroId: string): HeroActionResult {
  if (!isRoutePreviewOwnedByHero(state.activeRoutePreview, heroId)) {
    return { ok: false, reason: "That hero does not own an active route." };
  }

  state.activeRoutePreview = clearRoutePreview();
  state.routeFeedback = null;
  return { ok: true };
}

export function plotRoutePreview(state: GameState, destination: Position): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  if (!hero) {
    return { ok: false, reason: "Select a hero first." };
  }

  const routeResult = findShortestRoute(state.scenario, hero.id, hero.mapPosition, destination);
  if (!routeResult.ok) {
    state.routeFeedback = {
      destinationPosition: { ...destination },
      terrainLabel: "Route",
      movementImpact: "Route unavailable",
      blockedReason: routeResult.reason ?? "No legal route could be plotted to that destination.",
      objectLabels: [],
      passabilityExplanation: null,
      movementDeltaExplanation: null,
      stackExplanation: null,
      routeMode: "blocked",
      previewMessage: null
    };
    state.activeRoutePreview = null;
    return { ok: false, reason: routeResult.reason ?? "No legal route could be plotted to that destination." };
  }

  state.activeRoutePreview = createRoutePreview(hero.id, hero.mapPosition, destination, routeResult.steps);
  state.routeFeedback = createRoutePreviewFeedback(state.activeRoutePreview);
  return { ok: true };
}

function advanceRoutePreview(state: GameState, triggerSource: RouteAdvanceTrigger): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  const routePreview = state.activeRoutePreview;
  if (!hero || !routePreview) {
    return { ok: false, reason: "Plot a route first." };
  }

  if (!isRoutePreviewOwnedByHero(routePreview, hero.id)) {
    return { ok: false, reason: "That route belongs to a different hero." };
  }

  let previewToExecute = routePreview;
  if (routePreview.status === "continuation" || !positionsEqual(routePreview.lastValidatedFromPosition, hero.mapPosition)) {
    const refreshedRoute = findShortestRoute(state.scenario, hero.id, hero.mapPosition, routePreview.destinationPosition);
    if (!refreshedRoute.ok) {
      state.activeRoutePreview = null;
      state.routeFeedback = {
        destinationPosition: { ...routePreview.destinationPosition },
        terrainLabel: "Route",
        movementImpact: "Route unavailable",
        blockedReason: refreshedRoute.reason ?? "That route can no longer be continued.",
        objectLabels: [],
        passabilityExplanation: null,
        movementDeltaExplanation: null,
        stackExplanation: null,
        routeMode: "blocked",
        previewMessage: null
      };
      return { ok: false, reason: refreshedRoute.reason ?? "That route can no longer be continued." };
    }

    previewToExecute = createRoutePreview(hero.id, hero.mapPosition, routePreview.destinationPosition, refreshedRoute.steps, "continuation");
    state.activeRoutePreview = previewToExecute;
  }

  const traversedSteps: RouteStep[] = [];
  const remainingSteps: RouteStep[] = [];
  let movementSpent = 0;
  let encounteredBlockedLocation = false;

  for (const step of previewToExecute.steps) {
    if (step.movementCost > hero.remainingMovement) {
      remainingSteps.push(step, ...previewToExecute.steps.slice(previewToExecute.steps.indexOf(step) + 1));
      break;
    }

    const result = moveSelectedHero(state, step.position);
    if (!result.ok) {
      state.activeRoutePreview = null;
      return { ok: false, reason: result.reason ?? "That route could not be followed." };
    }

    traversedSteps.push(step);
    movementSpent += step.movementCost;

    const location = findGuardedLocationAtHero(state, hero.id);
    if (location && isLocationBlocked(state, location)) {
      encounteredBlockedLocation = true;
      remainingSteps.push(...previewToExecute.steps.slice(traversedSteps.length));
      break;
    }
  }

  if (traversedSteps.length === 0) {
    state.routeFeedback = {
      destinationPosition: { ...previewToExecute.destinationPosition },
      terrainLabel: previewToExecute.steps[0]?.terrainLabel ?? "Route",
      movementImpact: "Route waiting",
      blockedReason: "Not enough movement to advance along this route.",
      objectLabels: previewToExecute.steps[0]?.objectLabels ?? [],
      passabilityExplanation: "End the turn and click the same destination again to continue.",
      movementDeltaExplanation: null,
      stackExplanation: null,
      routeMode: "continuation",
      routeStepCount: previewToExecute.steps.length,
      routeTotalMovement: previewToExecute.totalMovementCost,
      previewMessage: "Route retained for later continuation."
    };
    return { ok: false, reason: "Not enough movement to advance along this route." };
  }

  const routeProgress: RouteProgressResult = {
    traversedSteps,
    finalPosition: { ...hero.mapPosition },
    movementSpent,
    remainingSteps,
    completionState: remainingSteps.length === 0 && !encounteredBlockedLocation ? "completed" : "partial",
    failureReason: null,
    encounteredBlockedLocation,
    triggerSource
  };

  if (routeProgress.completionState === "completed") {
    state.activeRoutePreview = null;
  } else {
    state.activeRoutePreview = markRoutePreviewForContinuation(previewToExecute, hero.mapPosition, remainingSteps);
    state.routeFeedback = createRoutePreviewFeedback(state.activeRoutePreview);
  }

  return { ok: true, routeProgress };
}

export function confirmRoutePreview(state: GameState): HeroActionResult {
  return advanceRoutePreview(state, "manual");
}

export function autoAdvanceRoutePreview(state: GameState): HeroActionResult {
  return advanceRoutePreview(state, "end-turn");
}

export function moveSelectedHero(state: GameState, position: Position): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  if (!hero) {
    return { ok: false, reason: "Select a hero first." };
  }

  if (hasTerrainRegions(state.scenario) || hasMovementObjectRegions(state.scenario)) {
    const routeAttempt = buildRouteAttempt(state.scenario, hero.id, hero.mapPosition, position, hero.remainingMovement);
    state.routeFeedback = createRouteFeedback(routeAttempt);
    if (!routeAttempt.isLegal) {
      return { ok: false, reason: routeAttempt.failureReason ?? "That move is not allowed." };
    }

    hero.mapPosition = { ...position };
    hero.remainingMovement -= routeAttempt.movementCost;
    const movementObjectSummary = state.routeFeedback.objectLabels.length
      ? ` using ${state.routeFeedback.objectLabels.join(" + ").toLowerCase()}`
      : "";
    state.messageLog.push(
      `${hero.name} moved onto ${state.routeFeedback.terrainLabel.toLowerCase()}${movementObjectSummary} at (${position.x + 1}, ${position.y + 1}).`
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
