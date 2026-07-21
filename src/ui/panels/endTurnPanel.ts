import type { GameState } from "../../engine/scenario/types";
import { renderButton } from "../components/button";

export function renderEndTurnPanel(state: GameState): string {
  return `
    <div class="overlay-box">
      ${renderButton({ id: "end-turn-button", testId: "end-turn-button", disabled: state.sceneMode !== "map", children: "End Turn" })}
    </div>
  `;
}
