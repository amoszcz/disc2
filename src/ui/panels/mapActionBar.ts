import type { GameStore } from "../../app/state/gameState";
import { appendMessage, setBattleState, setScenario } from "../../app/state/gameState";
import { startGuardEncounter } from "../../engine/map/startGuardEncounter";
import { zoomViewportAtPoint } from "../../engine/map/viewportMath";
import { advanceTurn, autoAdvanceActiveRouteBeforeTurnEnd, carryRoutePreviewAcrossTurn, resetMovementForActivePlayer } from "../../engine/turn/turnEngine";
import { checkScenarioEnd } from "../../app/scene-controller/checkScenarioEnd";

interface MapActionPresentation {
  id: "map-zoom-out" | "map-zoom-in" | "end-turn";
  name: string;
  icon: string;
  isAvailable: boolean;
}

function getMapActions(isTraversalActive = false): MapActionPresentation[] {
  return [
    { id: "map-zoom-out", name: "Zoom Out", icon: "−", isAvailable: true },
    { id: "map-zoom-in", name: "Zoom In", icon: "+", isAvailable: true },
    { id: "end-turn", name: "End Turn", icon: "⏭", isAvailable: !isTraversalActive }
  ];
}

export function renderMapActionBar(isTraversalActive = false): string {
  return `<div class="map-action-bar" data-testid="map-action-bar" aria-label="Map actions">${getMapActions(isTraversalActive)
    .map(
      (action) => `<button type="button" class="map-action-icon" id="${action.id}-button" data-testid="${action.id}-button" aria-label="${action.name}" title="${action.name}" ${
        action.isAvailable ? "" : "disabled"
      }><span aria-hidden="true">${action.icon}</span></button>`
    )
    .join("")}</div>`;
}

export function applyMapZoom(store: GameStore, direction: "in" | "out"): void {
  store.update((state) => {
    if (state.sceneMode !== "map") {
      return;
    }

    state.mapViewState.viewport = zoomViewportAtPoint(
      state.mapViewState.viewport,
      direction === "in" ? -100 : 100,
      { x: state.responsiveCanvasView.pixelWidth / 2, y: state.responsiveCanvasView.pixelHeight / 2 },
      state.scenario.map,
      state.responsiveCanvasView.pixelWidth,
      state.responsiveCanvasView.pixelHeight
    );
    state.mapViewState.isDefaultView = false;
    state.lastTouchInteraction = {
      interactionType: direction === "in" ? "zoom-in" : "zoom-out",
      screenPosition: { x: state.responsiveCanvasView.pixelWidth / 2, y: state.responsiveCanvasView.pixelHeight / 2 },
      targetKind: "none",
      targetId: null,
      gesturePhase: "end"
    };
  });
}

export function endMapTurn(store: GameStore): void {
  store.update((state) => {
    if (state.activeTraversal) {
      appendMessage(state, "Wait for the hero to finish traversing the route before ending the turn.");
      return;
    }
    const turnEndRouteResult = autoAdvanceActiveRouteBeforeTurnEnd(state);
    const routeOwnerId = state.activeRoutePreview?.heroId ?? state.selectedHeroId;
    const routeOwner = routeOwnerId ? state.scenario.heroes.find((hero) => hero.id === routeOwnerId) : null;

    if (turnEndRouteResult?.ok && routeOwnerId) {
      const encounter = startGuardEncounter(state, routeOwnerId);
      if (encounter.ok) {
        state.activeRoutePreview = null;
        state.routeFeedback = null;
        setBattleState(state, encounter.battle);
        appendMessage(state, `The guards of ${encounter.location.name} attack.`);
        return;
      }
    }

    const nextPlayerId = advanceTurn(state.scenario, state.activePlayerId);
    resetMovementForActivePlayer(state.scenario, nextPlayerId);
    state.activePlayerId = nextPlayerId;
    state.selectedHeroId = state.scenario.heroes.find((hero) => hero.ownerPlayerId === nextPlayerId && hero.availabilityState !== "defeated")?.id ?? null;
    state.routeFeedback = null;
    state.activeRoutePreview = carryRoutePreviewAcrossTurn(
      state.activeRoutePreview,
      state.scenario.heroes.find((hero) => hero.id === state.activeRoutePreview?.heroId)?.mapPosition ?? null
    );
    setScenario(state, state.scenario);
    if (turnEndRouteResult?.ok && turnEndRouteResult.routeProgress) {
      const progress = turnEndRouteResult.routeProgress;
      const ownerName = routeOwner?.name ?? "The hero";
      const destination = `(${progress.finalPosition.x + 1}, ${progress.finalPosition.y + 1})`;
      appendMessage(state, progress.completionState === "completed" ? `${ownerName} auto-advanced to ${destination} before the turn ended and completed the route.` : `${ownerName} auto-advanced to ${destination} before the turn ended and awaits continuation.`);
    } else {
      appendMessage(state, "The next side takes its turn.");
    }
    checkScenarioEnd(state);
  });
}

export function bindMapActionBar(container: HTMLElement, store: GameStore): void {
  container.querySelector<HTMLButtonElement>("#map-zoom-in-button")?.addEventListener("click", () => applyMapZoom(store, "in"));
  container.querySelector<HTMLButtonElement>("#map-zoom-out-button")?.addEventListener("click", () => applyMapZoom(store, "out"));
  container.querySelector<HTMLButtonElement>("#end-turn-button")?.addEventListener("click", () => endMapTurn(store));
}
