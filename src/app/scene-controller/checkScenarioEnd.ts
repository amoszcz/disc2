import type { GameState } from "../../engine/scenario/types";
import { evaluateDefaultVictory } from "../../engine/victory/checkVictory";

export function checkScenarioEnd(state: GameState): boolean {
  const winnerPlayerId = evaluateDefaultVictory(state.scenario);
  if (!winnerPlayerId) {
    return false;
  }

  state.winnerPlayerId = winnerPlayerId;
  state.sceneMode = "victory";
  state.messageLog.push("The borderlands are secure.");
  return true;
}
