import type { GameState } from "../../engine/scenario/types";
import { renderTerrainLegend } from "../../render/canvas/renderTerrainLegend";

export function renderMapHud(state: GameState): string {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  const player = state.scenario.players.find((entry) => entry.id === state.activePlayerId);
  const routeFeedback = state.routeFeedback;
  const routePreview = state.activeRoutePreview;

  return `
    <div class="overlay-box" data-testid="map-hud">
      <div class="hud-row"><strong>Scene</strong><span>Adventure Map</span></div>
      <div class="hud-row"><strong>Active Side</strong><span>${player?.name ?? "Unknown"}</span></div>
      <div class="hud-row"><strong>Hero</strong><span>${hero?.name ?? "None"}</span></div>
      <div class="hud-row"><strong>Zoom</strong><span data-testid="map-zoom">${state.mapViewState.viewport.zoomLevel.toFixed(2)}x</span></div>
      <div class="hud-row"><strong>Movement</strong><span data-testid="remaining-movement">${hero?.remainingMovement ?? 0}</span></div>
      <div class="hud-row"><strong>Gold</strong><span data-testid="resource-gold">${player?.resourceStockpile.gold ?? 0}</span></div>
      ${
        routePreview
          ? `<div class="hud-row"><strong>Path</strong><span data-testid="route-preview-status">${routePreview.status}</span></div>
      <div class="hud-row"><strong>Target</strong><span data-testid="route-preview-destination">(${routePreview.destinationPosition.x + 1}, ${routePreview.destinationPosition.y + 1})</span></div>
      <div class="hud-row"><strong>Steps</strong><span data-testid="route-preview-steps">${routePreview.steps.length}</span></div>
      <div class="hud-row"><strong>Total Cost</strong><span data-testid="route-preview-cost">${routePreview.totalMovementCost}</span></div>`
          : ""
      }
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
