import type { GameState } from "../../engine/scenario/types";

export function renderMapHud(state: GameState): string {
  const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
  const player = state.scenario.players.find((entry) => entry.id === state.activePlayerId);

  return `
    <div class="overlay-box" data-testid="map-hud">
      <div class="hud-row"><strong>Scene</strong><span>Adventure Map</span></div>
      <div class="hud-row"><strong>Active Side</strong><span>${player?.name ?? "Unknown"}</span></div>
      <div class="hud-row"><strong>Hero</strong><span>${hero?.name ?? "None"}</span></div>
      <div class="hud-row"><strong>Movement</strong><span data-testid="remaining-movement">${hero?.remainingMovement ?? 0}</span></div>
      <div class="hud-row"><strong>Gold</strong><span data-testid="resource-gold">${player?.resourceStockpile.gold ?? 0}</span></div>
    </div>
  `;
}
