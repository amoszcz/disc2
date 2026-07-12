import type { GameStore } from "../state/gameState";
import { appendMessage, setScenario } from "../state/gameState";
import { renderMapScene } from "../../render/canvas/renderMapScene";
import { renderMapHud } from "../../ui/hud/mapHud";
import { renderEndTurnPanel } from "../../ui/panels/endTurnPanel";
import { renderGuardStatusOverlay } from "../../ui/overlays/guardStatusOverlay";
import { renderErrorOverlay } from "../../ui/overlays/errorOverlay";
import { advanceTurn, resetMovementForActivePlayer } from "../../engine/turn/turnEngine";
import { checkScenarioEnd } from "./checkScenarioEnd";

export function renderMapSidebar(store: GameStore, container: HTMLElement): void {
  const state = store.getState();
  const logMessage = state.messageLog[state.messageLog.length - 1] ?? "Explore the map.";
  container.innerHTML = `
    ${renderMapHud(state)}
    ${renderEndTurnPanel(state)}
    ${renderGuardStatusOverlay("Blocked sites open only after their guards fall.")}
    ${renderErrorOverlay(logMessage)}
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
      setScenario(currentState, currentState.scenario);
      appendMessage(currentState, "The next side takes its turn.");
      checkScenarioEnd(currentState);
    });
  };
}

export function drawMapScene(store: GameStore, context: CanvasRenderingContext2D): void {
  renderMapScene(context, store.getState());
}
