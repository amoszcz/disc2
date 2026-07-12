import type { GameStore } from "../state/gameState";
import { renderBattleScene } from "../../render/canvas/renderBattleScene";
import { renderBattleHud } from "../../ui/overlays/battleHud";
import { bindBattleInput } from "./battleInputController";

export function renderBattleSidebar(store: GameStore, container: HTMLElement): void {
  container.innerHTML = renderBattleHud(store.getState());
  const button = container.querySelector<HTMLButtonElement>("#battle-attack-button");
  if (button) {
    bindBattleInput(button, store);
  }
}

export function drawBattleScene(store: GameStore, context: CanvasRenderingContext2D): void {
  renderBattleScene(context, store.getState());
}
