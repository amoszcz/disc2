import { GameStore, createInitialState, createMenuState, returnToMainMenu, startScenarioSession } from "../state/gameState";
import { createSceneController } from "../scene-controller/sceneController";
import { bindMapInput } from "../scene-controller/mapInputController";
import { bindBattleCanvasInput } from "../scene-controller/battleInputController";
import { drawBattleScene, renderBattleSidebar } from "../scene-controller/battleScene";
import { drawMapScene, renderMapSidebar } from "../scene-controller/mapScene";
import { isScenarioId, type ScenarioId } from "../../engine/scenario/loadScenario";
import { renderMainMenu } from "../../ui/overlays/mainMenu";
import { renderVictoryMenu } from "../../ui/overlays/victoryMenu";

function resolveScenarioId(): ScenarioId | null {
  const params = new URLSearchParams(window.location.search);
  const scenarioParam = params.get("scenario");
  return isScenarioId(scenarioParam) ? scenarioParam : null;
}

function drawMenuScene(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f7ecd6";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#23170d";
  context.font = "52px Georgia";
  context.fillText("disc2", 338, 180);
  context.font = "24px Georgia";
  context.fillText("Select a scenario to begin", 272, 236);
  context.font = "16px Georgia";
  context.fillText("Use the menu on the right to launch a fresh session.", 246, 286);
}

export function startGame(root: HTMLElement | null): void {
  if (!root) {
    throw new Error("Missing application root.");
  }

  const requestedScenarioId = resolveScenarioId();
  const store = new GameStore(requestedScenarioId ? createInitialState(requestedScenarioId) : createMenuState());
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
  bindBattleCanvasInput(canvas, store);

  store.subscribe((state) => {
    sceneController.setMode(state.sceneMode);
    sidebar.dataset.scene = sceneController.getMode();
    if (sceneController.getMode() === "menu") {
      drawMenuScene(context, canvas);
      sidebar.innerHTML = renderMainMenu(state);
      for (const option of state.availableScenarioOptions) {
        const button = sidebar.querySelector<HTMLButtonElement>(`[data-scenario-id="${option.id}"]`);
        if (!button) {
          continue;
        }

        button.onclick = () => {
          store.update((currentState) => {
            startScenarioSession(currentState, option.id as ScenarioId);
            currentState.messageLog.push(`${option.label} begins.`);
          });
        };
      }
      return;
    }

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
      sidebar.innerHTML = renderVictoryMenu(state);
      const returnButton = sidebar.querySelector<HTMLButtonElement>("#return-to-menu-button");
      if (returnButton) {
        returnButton.onclick = () => {
          window.history.replaceState({}, "", "/");
          store.update((currentState) => {
            returnToMainMenu(currentState);
          });
        };
      }
      return;
    }

    drawMapScene(store, context);
    renderMapSidebar(store, sidebar);
  });
}
