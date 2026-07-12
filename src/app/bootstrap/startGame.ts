import { GameStore, createInitialState } from "../state/gameState";
import { createSceneController } from "../scene-controller/sceneController";
import { bindMapInput } from "../scene-controller/mapInputController";
import { drawBattleScene, renderBattleSidebar } from "../scene-controller/battleScene";
import { drawMapScene, renderMapSidebar } from "../scene-controller/mapScene";
import type { ScenarioId } from "../../engine/scenario/loadScenario";

function resolveScenarioId(): ScenarioId {
  const params = new URLSearchParams(window.location.search);
  return params.get("scenario") === "advanced-terrain-scenario" ? "advanced-terrain-scenario" : "core-map-loop";
}

export function startGame(root: HTMLElement | null): void {
  if (!root) {
    throw new Error("Missing application root.");
  }

  const store = new GameStore(createInitialState(resolveScenarioId()));
  const sceneController = createSceneController(store.getState().sceneMode);
  (window as Window & { __gameStore?: GameStore }).__gameStore = store;

  root.innerHTML = `
    <section class="panel">
      <canvas id="game-canvas" width="896" height="640" aria-label="game canvas"></canvas>
    </section>
    <aside class="panel sidebar" id="sidebar"></aside>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>("#game-canvas");
  const sidebar = root.querySelector<HTMLElement>("#sidebar");

  if (!canvas || !sidebar) {
    throw new Error("Failed to initialize game shell.");
  }

  canvas.style.userSelect = "none";
  canvas.style.touchAction = "none";

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  bindMapInput(canvas, store);

  store.subscribe((state) => {
    sceneController.setMode(state.sceneMode);
    sidebar.dataset.scene = sceneController.getMode();
    if (sceneController.getMode() === "battle") {
      drawBattleScene(store, context);
      renderBattleSidebar(store, sidebar);
      return;
    }

    if (sceneController.getMode() === "victory") {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f7ecd6";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#23170d";
      context.font = "48px Georgia";
      context.fillText("Victory", 300, 220);
      sidebar.innerHTML = `<div class="overlay-box" data-testid="victory-panel"><strong>Victory</strong><p>The guards have been defeated and the scenario is complete.</p></div>`;
      return;
    }

    drawMapScene(store, context);
    renderMapSidebar(store, sidebar);
  });
}
