import type { GameState } from "../../engine/scenario/types";

export function renderEndTurnPanel(state: GameState): string {
  const disabled = state.sceneMode !== "map" ? "disabled" : "";
  return `
    <div class="overlay-box">
      <button type="button" id="end-turn-button" data-testid="end-turn-button" ${disabled}>${state.mobileLayoutState.layoutMode === "mobile" ? "End Turn" : "End Turn"}</button>
    </div>
  `;
}
