import type { GameStore } from "../state/gameState";
import { advanceBattleQueue, canBattleContinue, performAttack } from "../../engine/battle/battleTurnEngine";
import { resolveBattleOutcome } from "../../engine/battle/resolveBattleOutcome";
import { applyBattleOutcome } from "../state/applyBattleOutcome";
import { checkScenarioEnd } from "./checkScenarioEnd";

export function bindBattleInput(button: HTMLButtonElement, store: GameStore): void {
  button.addEventListener("click", () => {
    store.update((state) => {
      if (state.sceneMode !== "battle" || !state.battle) {
        return;
      }

      const message = performAttack(state, state.battle);
      state.messageLog.push(message);

      if (!canBattleContinue(state, state.battle)) {
        resolveBattleOutcome(state, state.battle);
        applyBattleOutcome(state);
        state.battle = null;
        state.sceneMode = "map";
        checkScenarioEnd(state);
        return;
      }

      advanceBattleQueue(state, state.battle);
    });
  });
}
