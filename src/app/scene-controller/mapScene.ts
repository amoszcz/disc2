import type { GameStore } from "../state/gameState";
import { renderMapScene } from "../../render/canvas/renderMapScene";
import { renderMapHud } from "../../ui/hud/mapHud";
import { bindMapActionBar, renderMapActionBar } from "../../ui/panels/mapActionBar";
import { renderGuardStatusOverlay } from "../../ui/overlays/guardStatusOverlay";
import { renderErrorOverlay } from "../../ui/overlays/errorOverlay";
import { hasMovementObjectRegions } from "../../engine/map/movementObjectLookup";
import { hasTerrainRegions } from "../../engine/map/terrainLookup";
import { openSettings } from "../state/gameState";
import { clearOwnedRoutePreview } from "../../engine/map/heroActions";

export function renderMapSidebar(store: GameStore, container: HTMLElement, actionContainer: HTMLElement): void {
  const state = store.getState();
  const logMessage = state.messageLog[state.messageLog.length - 1] ?? "Explore the map.";
  const travelMessage = state.mapTravelState.transitionMessage;
  const overlayTitle = travelMessage ? "Travel" : state.routeFeedback?.blockedReason ? "Route" : "Message";
  const terrainMode = hasTerrainRegions(state.scenario) || hasMovementObjectRegions(state.scenario);
  const isMobile = state.mobileLayoutState.layoutMode === "mobile";
  const navigationMessage = state.mapViewState.panGesture?.isActive
    ? isMobile
      ? "Dragging map view..."
      : "Panning map view..."
    : state.mapViewState.isDefaultView
      ? isMobile
        ? "Tap heroes or tiles. Drag with one finger to pan. Use two fingers or the zoom buttons when needed."
        : "Use mouse wheel to zoom and middle mouse button to pan."
      : `Map view preserved at ${state.mapViewState.viewport.zoomLevel.toFixed(2)}x.`;
  container.innerHTML = `
    ${renderMapHud(state)}
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
    ${renderErrorOverlay(logMessage, travelMessage ?? state.routeFeedback?.blockedReason ?? navigationMessage, overlayTitle)}
  `;
  container.querySelector<HTMLButtonElement>('[data-settings-action="open"]')?.addEventListener("click", () => {
    store.update((current) => { openSettings(current); });
  });
  container.querySelector<HTMLButtonElement>('[data-route-action="cancel"]')?.addEventListener("click", () => {
    store.update((current) => {
      if (!current.selectedHeroId) return;
      const result = clearOwnedRoutePreview(current, current.selectedHeroId);
      current.messageLog.push(result.ok ? "Route preview cancelled without spending movement." : result.reason ?? "No route preview is available to cancel.");
    });
  });

  actionContainer.innerHTML = renderMapActionBar(state.activeTraversal !== null);
  bindMapActionBar(actionContainer, store);
}

export function drawMapScene(store: GameStore, context: CanvasRenderingContext2D): void {
  renderMapScene(context, store.getState());
}
