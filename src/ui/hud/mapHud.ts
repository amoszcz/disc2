import type { GameState } from "../../engine/scenario/types";
import { renderTerrainLegend } from "../../render/canvas/renderTerrainLegend";
import { renderButton } from "../components/button";

export function renderMapHud(state: GameState): string {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  const player = state.scenario.players.find((entry) => entry.id === state.activePlayerId);
  const activeMap = state.scenario.worldMaps?.find((worldMap) => worldMap.id === state.mapTravelState.activeMapId);
  const routeFeedback = state.routeFeedback;
  const routePreview = state.activeRoutePreview;
  const isMobile = state.mobileLayoutState.layoutMode === "mobile";
  const controlsMessage = isMobile
    ? "Tap to select or confirm. Drag with one finger to pan. Use two fingers or the zoom buttons to zoom."
    : "Click to select or confirm. Use the mouse wheel to zoom and middle mouse drag to pan.";

  return `
    <div class="overlay-box" data-testid="map-hud">
      <div class="hud-row"><strong>Scene</strong><span>Adventure Map</span></div>
      <div class="hud-row"><strong>Map</strong><span data-testid="active-map-name">${activeMap?.name ?? state.scenario.name}</span></div>
      <div class="hud-row"><strong>Active Side</strong><span>${player?.name ?? "Unknown"}</span></div>
      <div class="hud-row"><strong>Hero</strong><span>${hero?.name ?? "None"}</span></div>
      <div class="hud-row"><strong>Layout</strong><span data-testid="layout-mode">${state.mobileLayoutState.layoutMode}</span></div>
      <div class="hud-row"><strong>Zoom</strong><span data-testid="map-zoom">${state.mapViewState.viewport.zoomLevel.toFixed(2)}x</span></div>
      ${renderButton({ children: "Settings", className: "menu-option", testId: "map-settings-open-button", variant: "secondary", data: { "settings-action": "open" } })}
      <div class="hud-row"><strong>Movement</strong><span data-testid="remaining-movement">${hero?.remainingMovement ?? 0}</span></div>
      <div class="hud-row"><strong>Gold</strong><span data-testid="resource-gold">${player?.resourceStockpile.gold ?? 0}</span></div>
      <div class="hud-row"><strong>Fog</strong><span data-testid="fog-of-war-status">${state.gameSettings.fogOfWarEnabled ? `Enabled (${state.gameSettings.fogVisibilityRadius} tiles)` : "Disabled"}</span></div>
      ${
        state.mapTravelState.transitionMessage
          ? `<div class="hud-row"><strong>Travel</strong><span data-testid="travel-message">${state.mapTravelState.transitionMessage}</span></div>`
          : ""
      }
      <p class="control-tip" data-testid="map-control-tip">${controlsMessage}</p>
      ${
        routePreview
          ? `<div class="hud-row"><strong>Path</strong><span data-testid="route-preview-status">${routePreview.status}</span></div>
      <div class="hud-row"><strong>Target</strong><span data-testid="route-preview-destination">(${routePreview.destinationPosition.x + 1}, ${routePreview.destinationPosition.y + 1})</span></div>
      <div class="hud-row"><strong>Steps</strong><span data-testid="route-preview-steps">${routePreview.steps.length}</span></div>
      <div class="hud-row"><strong>Total Cost</strong><span data-testid="route-preview-cost">${routePreview.totalMovementCost}</span></div>
      <p data-testid="route-preview-guidance">Review the route details, then select the destination again to confirm. You can replace it by selecting another tile.</p>
      ${renderButton({ children: "Cancel route", testId: "route-cancel-button", variant: "secondary", data: { "route-action": "cancel" } })}`
          : ""
      }
      ${state.activeTraversal ? `<div class="hud-row"><strong>Traversal</strong><span data-testid="route-traversal-status">Moving 1 tile/second</span></div>` : ""}
      ${
        routeFeedback
          ? `<div class="hud-row"><strong>Terrain</strong><span data-testid="route-terrain">${routeFeedback.terrainLabel}</span></div>
      <div class="hud-row"><strong>Route</strong><span data-testid="route-impact">${routeFeedback.movementImpact}</span></div>
      <div class="hud-row"><strong>Objects</strong><span data-testid="route-objects">${routeFeedback.objectLabels.join(", ") || "None"}</span></div>
      ${
        routeFeedback.stackExplanation
          ? `<div class="hud-row"><strong>Effects</strong><span data-testid="route-effects">${routeFeedback.stackExplanation}</span></div>`
          : ""
      }`
          : ""
      }
    </div>
    ${renderTerrainLegend(state)}
  `;
}
