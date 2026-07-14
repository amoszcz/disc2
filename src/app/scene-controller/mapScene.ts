import type { GameStore } from "../state/gameState";
import { appendMessage, setScenario } from "../state/gameState";
import { renderMapScene } from "../../render/canvas/renderMapScene";
import { renderMapHud } from "../../ui/hud/mapHud";
import { renderEndTurnPanel } from "../../ui/panels/endTurnPanel";
import { renderGuardStatusOverlay } from "../../ui/overlays/guardStatusOverlay";
import { renderErrorOverlay } from "../../ui/overlays/errorOverlay";
import { advanceTurn, carryRoutePreviewAcrossTurn, resetMovementForActivePlayer } from "../../engine/turn/turnEngine";
import { checkScenarioEnd } from "./checkScenarioEnd";
import { hasMovementObjectRegions } from "../../engine/map/movementObjectLookup";
import { hasTerrainRegions } from "../../engine/map/terrainLookup";

export function renderMapSidebar(store: GameStore, container: HTMLElement): void {
  const state = store.getState();
  const logMessage = state.messageLog[state.messageLog.length - 1] ?? "Explore the map.";
  const terrainMode = hasTerrainRegions(state.scenario) || hasMovementObjectRegions(state.scenario);
  const navigationMessage = state.mapViewState.panGesture?.isActive
    ? "Panning map view..."
    : state.mapViewState.isDefaultView
      ? "Use mouse wheel to zoom and middle mouse button to pan."
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
  if (!button) {
    return;
  }

  button.onclick = () => {
    store.update((currentState) => {
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
      appendMessage(currentState, "The next side takes its turn.");
      checkScenarioEnd(currentState);
    });
  };
}

export function drawMapScene(store: GameStore, context: CanvasRenderingContext2D): void {
  renderMapScene(context, store.getState());
}
