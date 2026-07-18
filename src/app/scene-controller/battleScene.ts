import type { GameStore } from "../state/gameState";
import { renderBattleScene } from "../../render/canvas/renderBattleScene";
import { renderBattleHud } from "../../ui/overlays/battleHud";
import { bindBattleActionInput } from "./battleInputController";
import { bindVisualTemplateSelector } from "../../ui/visualTemplateSelector";

export function renderBattleSidebar(store: GameStore, container: HTMLElement): void {
  container.innerHTML = renderBattleHud(store.getState());
  bindVisualTemplateSelector(container, store);
  bindBattleActionInput(container, store);
}

export function drawBattleScene(store: GameStore, context: CanvasRenderingContext2D): void {
  renderBattleScene(context, store.getState());
}
