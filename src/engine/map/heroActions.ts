import type { FacingDirection, GameState, HeroAnimationStateName, LinkedMapTravelLink, Position, RouteProgressResult, RouteStep } from "../scenario/types";
import { getWorldMapById, resolveTravelLinkAtPosition } from "../scenario/types";
import { findGuardedLocationAtHero, isLocationBlocked } from "./guardRules";
import { positionsEqual } from "./mapRules";
import { collectPickupIfPresent } from "./pickupResolution";
import { clearRoutePreview, createRoutePreview, isRoutePreviewOwnedByHero, markRoutePreviewForContinuation } from "./routePreviewState";
import { findShortestRoute } from "./routePathfinding";
import { buildRouteAttempt, validateTravelLink } from "./routeRules";
import { createRouteFeedback, createRoutePreviewFeedback } from "./terrainFeedback";
import { setActiveWorldMap } from "../../app/state/gameState";

export interface HeroActionResult {
  ok: boolean;
  reason?: string;
  routeProgress?: RouteProgressResult;
}

type RouteAdvanceTrigger = "manual" | "end-turn";

function setHeroVisualState(
  state: GameState,
  heroId: string,
  stateName: HeroAnimationStateName,
  direction?: FacingDirection
): void {
  const current = state.visualStates.heroStates[heroId] ?? { stateName: "idle" as const, direction: "down" as const };
  state.visualStates.heroStates[heroId] = {
    stateName,
    direction: direction ?? current.direction
  };
}

function getFacingDirection(from: Position, to: Position): FacingDirection {
  if (to.x > from.x) {
    return "right";
  }
  if (to.x < from.x) {
    return "left";
  }
  if (to.y > from.y) {
    return "down";
  }
  return "up";
}

function getRouteDirection(from: Position, step: RouteStep | undefined): FacingDirection {
  return step ? getFacingDirection(from, step.position) : "down";
}

function buildTravelMessage(state: GameState, heroName: string, link: LinkedMapTravelLink): string {
  const destinationMap = getWorldMapById(state.scenario, link.destinationMapId);
  const destinationName = destinationMap?.name ?? "the linked map";

  if (link.triggerKind === "exit") {
    return `${heroName} returned to ${destinationName}.`;
  }

  if (link.triggerKind === "teleport") {
    return `${heroName} used a teleport to reach ${destinationName}.`;
  }

  return `${heroName} entered ${destinationName} through a cave.`;
}

function resolveTravelAtHeroPosition(state: GameState, heroId: string): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === heroId);
  if (!hero) {
    return { ok: false, reason: "Hero not found." };
  }

  const link = resolveTravelLinkAtPosition(state.scenario, hero.mapId, hero.mapPosition);
  if (!link) {
    state.mapTravelState.transitionMessage = null;
    if (state.visualStates.heroStates[hero.id]?.stateName !== "interact") {
      setHeroVisualState(state, hero.id, "stop-move");
    }
    return { ok: true };
  }

  const travelValidation = validateTravelLink(state.scenario, link);
  if (!travelValidation.ok) {
    const reason = travelValidation.reason ?? "That linked passage is unavailable.";
    state.mapTravelState.transitionMessage = reason;
    state.messageLog.push(reason);
    setHeroVisualState(state, hero.id, "interact");
    return { ok: true, reason };
  }

  hero.mapId = link.destinationMapId;
  hero.mapPosition = { ...link.destinationPosition };
  const transitionMessage = buildTravelMessage(state, hero.name, link);
  setActiveWorldMap(state, link.destinationMapId, transitionMessage, link.id);
  state.messageLog.push(transitionMessage);
  setHeroVisualState(state, hero.id, "interact");
  return { ok: true };
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
  if (hero.mapId !== state.mapTravelState.activeMapId) {
    return { ok: false, reason: "That hero is not on the active map." };
  }
  state.selectedHeroId = heroId;
  state.routeFeedback = null;
  setHeroVisualState(state, heroId, "idle");
  return { ok: true };
}

export function clearOwnedRoutePreview(state: GameState, heroId: string): HeroActionResult {
  if (!isRoutePreviewOwnedByHero(state.activeRoutePreview, heroId)) {
    return { ok: false, reason: "That hero does not own an active route." };
  }

  state.activeRoutePreview = clearRoutePreview();
  state.routeFeedback = null;
  setHeroVisualState(state, heroId, "idle");
  return { ok: true };
}

export function plotRoutePreview(state: GameState, destination: Position): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  if (!hero) {
    return { ok: false, reason: "Select a hero first." };
  }
  if (hero.mapId !== state.mapTravelState.activeMapId) {
    return { ok: false, reason: "Select a hero on the active map first." };
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
  setHeroVisualState(state, hero.id, "start-move", getRouteDirection(hero.mapPosition, routeResult.steps[0]));
  return { ok: true };
}

function advanceRoutePreview(state: GameState, triggerSource: RouteAdvanceTrigger, maximumSteps = Number.POSITIVE_INFINITY): HeroActionResult {
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
    if (traversedSteps.length >= maximumSteps) {
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
    setHeroVisualState(state, hero.id, "stop-move");
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
    setHeroVisualState(state, hero.id, encounteredBlockedLocation ? "interact" : "stop-move");
  } else {
    state.activeRoutePreview = markRoutePreviewForContinuation(previewToExecute, hero.mapPosition, remainingSteps);
    state.routeFeedback = createRoutePreviewFeedback(state.activeRoutePreview);
    setHeroVisualState(state, hero.id, encounteredBlockedLocation ? "interact" : "walk");
  }

  return { ok: true, routeProgress };
}

export function confirmRoutePreview(state: GameState): HeroActionResult {
  return advanceRoutePreview(state, "manual");
}

/** Advances only one legal route tile, allowing the app layer to schedule visible traversal. */
export function advanceRoutePreviewStep(state: GameState): HeroActionResult {
  return advanceRoutePreview(state, "manual", 1);
}

export function autoAdvanceRoutePreview(state: GameState): HeroActionResult {
  return advanceRoutePreview(state, "end-turn");
}

export function moveSelectedHero(state: GameState, position: Position): HeroActionResult {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  if (!hero) {
    return { ok: false, reason: "Select a hero first." };
  }
  if (hero.mapId !== state.mapTravelState.activeMapId) {
    return { ok: false, reason: "That hero is not on the active map." };
  }

  const direction = getFacingDirection(hero.mapPosition, position);
  const routeAttempt = buildRouteAttempt(state.scenario, hero.id, hero.mapPosition, position, hero.remainingMovement);
  state.routeFeedback = createRouteFeedback(routeAttempt);
  if (!routeAttempt.isLegal) {
    return { ok: false, reason: routeAttempt.failureReason ?? "That move is not allowed." };
  }

  hero.mapPosition = { ...position };
  hero.remainingMovement -= routeAttempt.movementCost;
  setHeroVisualState(state, hero.id, "walk", direction);
  const movementObjectSummary = state.routeFeedback.objectLabels.length
    ? ` using ${state.routeFeedback.objectLabels.join(" + ").toLowerCase()}`
    : "";
  state.messageLog.push(
    `${hero.name} moved onto ${state.routeFeedback.terrainLabel.toLowerCase()}${movementObjectSummary} at (${position.x + 1}, ${position.y + 1}).`
  );
  const collectedPickup = collectPickupIfPresent(state, hero.id);
  if (collectedPickup) {
    setHeroVisualState(state, hero.id, "interact", direction);
  }
  return resolveTravelAtHeroPosition(state, hero.id);
}
