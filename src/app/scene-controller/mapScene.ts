import type { GameStore } from "../state/gameState";
import { appendMessage, setBattleState, setScenario } from "../state/gameState";
import { renderMapScene } from "../../render/canvas/renderMapScene";
import { renderMapHud } from "../../ui/hud/mapHud";
import { renderEndTurnPanel } from "../../ui/panels/endTurnPanel";
import { renderGuardStatusOverlay } from "../../ui/overlays/guardStatusOverlay";
import { renderErrorOverlay } from "../../ui/overlays/errorOverlay";
import { advanceTurn, autoAdvanceActiveRouteBeforeTurnEnd, carryRoutePreviewAcrossTurn, resetMovementForActivePlayer } from "../../engine/turn/turnEngine";
import { startGuardEncounter } from "../../engine/map/startGuardEncounter";
import { zoomViewportAtPoint } from "../../engine/map/viewportMath";
import { checkScenarioEnd } from "./checkScenarioEnd";
import { hasMovementObjectRegions } from "../../engine/map/movementObjectLookup";
import { hasTerrainRegions } from "../../engine/map/terrainLookup";

export function renderMapSidebar(store: GameStore, container: HTMLElement): void {
  const state = store.getState();
  const logMessage = state.messageLog[state.messageLog.length - 1] ?? "Explore the map.";
  const terrainMode = hasTerrainRegions(state.scenario) || hasMovementObjectRegions(state.scenario);
  const isMobile = state.mobileLayoutState.layoutMode === "mobile";
  const navigationMessage = state.mapViewState.panGesture?.isActive
    ? isMobile
      ? "Dragging map view..."
      : "Panning map view..."
    : state.mapViewState.isDefaultView
      ? isMobile
        ? "Tap heroes or tiles. Drag the map to pan. Use the zoom buttons when needed."
        : "Use mouse wheel to zoom and middle mouse button to pan."
      : `Map view preserved at ${state.mapViewState.viewport.zoomLevel.toFixed(2)}x.`;
  container.innerHTML = `
    ${renderMapHud(state)}
    ${renderEndTurnPanel(state)}
    ${renderGuardStatusOverlay(
      terrainMode ? "Route Preview" : "Guarded Objective",
      terrainMode
        ? state.routeFeedback?.blockedReason ??
            (state.routeFeedback
              ? `${state.routeFeedback.terrainLabel}: ${state.routeFeedback.movementImpact}.`
              : state.activeRoutePreview
                ? "Click the plotted destination again to confirm or continue movement."
                : "Select a nearby tile to inspect movement cost.")
        : "Blocked sites open only after their guards fall.",
      terrainMode
        ? state.routeFeedback?.passabilityExplanation ??
            state.routeFeedback?.movementDeltaExplanation ??
            state.routeFeedback?.stackExplanation ??
            state.routeFeedback?.previewMessage ??
            (state.activeRoutePreview
              ? `Route to (${state.activeRoutePreview.destinationPosition.x + 1}, ${state.activeRoutePreview.destinationPosition.y + 1}) is ready.`
              : null) ??
            (state.routeFeedback?.objectLabels.length ? `Objects here: ${state.routeFeedback.objectLabels.join(", ")}.` : null)
        : null
    )}
    ${renderErrorOverlay(logMessage, state.routeFeedback?.blockedReason ?? navigationMessage)}
  `;

  const button = container.querySelector<HTMLButtonElement>("#end-turn-button");
  const zoomInButton = container.querySelector<HTMLButtonElement>("#map-zoom-in-button");
  const zoomOutButton = container.querySelector<HTMLButtonElement>("#map-zoom-out-button");
  const applyZoom = (direction: "in" | "out"): void => {
    store.update((currentState) => {
      if (currentState.sceneMode !== "map") {
        return;
      }

      currentState.mapViewState.viewport = zoomViewportAtPoint(
        currentState.mapViewState.viewport,
        direction === "in" ? -100 : 100,
        {
          x: currentState.responsiveCanvasView.pixelWidth / 2,
          y: currentState.responsiveCanvasView.pixelHeight / 2
        },
        currentState.scenario.map,
        currentState.responsiveCanvasView.pixelWidth,
        currentState.responsiveCanvasView.pixelHeight
      );
      currentState.mapViewState.isDefaultView = false;
      currentState.lastTouchInteraction = {
        interactionType: direction === "in" ? "zoom-in" : "zoom-out",
        screenPosition: {
          x: currentState.responsiveCanvasView.pixelWidth / 2,
          y: currentState.responsiveCanvasView.pixelHeight / 2
        },
        targetKind: "none",
        targetId: null,
        gesturePhase: "end"
      };
    });
  };

  if (zoomInButton) {
    zoomInButton.onclick = () => applyZoom("in");
  }

  if (zoomOutButton) {
    zoomOutButton.onclick = () => applyZoom("out");
  }

  if (!button) {
    return;
  }

  button.onclick = () => {
    store.update((currentState) => {
      const turnEndRouteResult = autoAdvanceActiveRouteBeforeTurnEnd(currentState);
      const routeOwnerId = currentState.activeRoutePreview?.heroId ?? currentState.selectedHeroId;
      const routeOwner = routeOwnerId
        ? currentState.scenario.heroes.find((hero) => hero.id === routeOwnerId)
        : null;

      if (turnEndRouteResult?.ok && routeOwnerId) {
        const encounter = startGuardEncounter(currentState, routeOwnerId);
        if (encounter.ok) {
          currentState.activeRoutePreview = null;
          currentState.routeFeedback = null;
          setBattleState(currentState, encounter.battle);
          appendMessage(currentState, `The guards of ${encounter.location.name} attack.`);
          return;
        }
      }

      const nextPlayerId = advanceTurn(currentState.scenario, currentState.activePlayerId);
      resetMovementForActivePlayer(currentState.scenario, nextPlayerId);
      currentState.activePlayerId = nextPlayerId;
      currentState.selectedHeroId =
        currentState.scenario.heroes.find((hero) => hero.ownerPlayerId === nextPlayerId && hero.availabilityState !== "defeated")?.id ??
        null;
      currentState.routeFeedback = null;
      currentState.activeRoutePreview = carryRoutePreviewAcrossTurn(
        currentState.activeRoutePreview,
        currentState.scenario.heroes.find((hero) => hero.id === currentState.activeRoutePreview?.heroId)?.mapPosition ?? null
      );
      setScenario(currentState, currentState.scenario);
      if (turnEndRouteResult?.ok && turnEndRouteResult.routeProgress) {
        const progress = turnEndRouteResult.routeProgress;
        const ownerName = routeOwner?.name ?? "The hero";
        const destination = `(${progress.finalPosition.x + 1}, ${progress.finalPosition.y + 1})`;
        appendMessage(
          currentState,
          progress.completionState === "completed"
            ? `${ownerName} auto-advanced to ${destination} before the turn ended and completed the route.`
            : `${ownerName} auto-advanced to ${destination} before the turn ended and awaits continuation.`
        );
      } else {
        appendMessage(currentState, "The next side takes its turn.");
      }
      checkScenarioEnd(currentState);
    });
  };
}

export function drawMapScene(store: GameStore, context: CanvasRenderingContext2D): void {
  renderMapScene(context, store.getState());
}
