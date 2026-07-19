import {
  GameStore,
  createDefaultMapViewState,
  createInitialState,
  createMenuState,
  openStorybook,
  openSettings,
  returnToMainMenu,
  returnFromSettings,
  selectMovementBehavior,
  startScenarioSession
} from "../state/gameState";
import { createSceneController } from "../scene-controller/sceneController";
import { bindMapInput } from "../scene-controller/mapInputController";
import { bindBattleCanvasInput } from "../scene-controller/battleInputController";
import { drawBattleScene, renderBattleSidebar } from "../scene-controller/battleScene";
import { drawMapScene, renderMapSidebar } from "../scene-controller/mapScene";
import { drawStorybookScene, renderStorybookSidebar } from "../scene-controller/storybookScene";
import { isScenarioId, type ScenarioId } from "../../engine/scenario/loadScenario";
import { createViewport } from "../../engine/map/viewportMath";
import { measureGameShellLayout, normalizeViewportForState } from "../../render/canvas/viewportRender";
import { renderMainMenu } from "../../ui/overlays/mainMenu";
import { renderVictoryMenu } from "../../ui/overlays/victoryMenu";
import { visualTemplateCatalog } from "../../render/sprites/visualTemplateCatalog";
import { setActiveVisualTemplateId } from "../../render/sprites/visualTemplateResolver";
import { VISUAL_TEMPLATE_INVALIDATE_EVENT } from "../../render/sprites/visualTemplateResolver";
import { renderBattleTurnQueue } from "../../ui/panels/battleTurnQueue";
import { openSpriteMapping, renderSpriteMapping } from "../scene-controller/spriteMappingScene";
import { createMapTraversalController } from "../scene-controller/mapTraversalController";
import { renderSettingsPanel } from "../../ui/overlays/settingsPanel";
import { bindVisualTemplateSelector } from "../../ui/visualTemplateSelector";

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
  context.textAlign = "center";
  context.font = `700 ${Math.max(34, Math.floor(canvas.width / 14))}px Georgia`;
  context.fillText("disc2", canvas.width / 2, Math.max(120, Math.floor(canvas.height * 0.28)));
  context.font = `${Math.max(18, Math.floor(canvas.width / 34))}px Georgia`;
  context.fillText("Choose a scenario or storybook", canvas.width / 2, Math.max(176, Math.floor(canvas.height * 0.38)));
  context.font = `${Math.max(14, Math.floor(canvas.width / 52))}px Georgia`;
  context.fillText(
    "Use the action panel to launch a run or inspect current asset states.",
    canvas.width / 2,
    Math.max(218, Math.floor(canvas.height * 0.47))
  );
  context.textAlign = "start";
}

export function startGame(root: HTMLElement | null): void {
  if (!root) {
    throw new Error("Missing application root.");
  }

  const requestedScenarioId = resolveScenarioId();
  const store = new GameStore(requestedScenarioId ? createInitialState(requestedScenarioId) : createMenuState());
  const sceneController = createSceneController(store.getState().sceneMode);
  (
    window as Window & {
      __gameStore?: GameStore;
      __visualTemplateCatalog?: typeof visualTemplateCatalog;
      __visualStateTracker?: GameStore["getState"] extends () => infer T ? T extends { visualStates: infer V } ? V : never : never;
    }
  ).__gameStore = store;
  (
    window as Window & {
      __gameStore?: GameStore;
      __visualTemplateCatalog?: typeof visualTemplateCatalog;
      __visualStateTracker?: GameStore["getState"] extends () => infer T ? T extends { visualStates: infer V } ? V : never : never;
    }
  ).__visualTemplateCatalog = visualTemplateCatalog;
  (
    window as Window & {
      __gameStore?: GameStore;
      __visualTemplateCatalog?: typeof visualTemplateCatalog;
      __visualStateTracker?: GameStore["getState"] extends () => infer T ? T extends { visualStates: infer V } ? V : never : never;
    }
  ).__visualStateTracker = store.getState().visualStates;

  root.innerHTML = `
    <section class="panel game-surface-panel" id="game-surface-panel">
      <div class="game-canvas-row" id="game-canvas-row">
        <canvas id="game-canvas" width="896" height="640" aria-label="game canvas"></canvas>
        <aside class="scene-action-mount" id="map-action-mount"></aside>
      </div>
      <section class="scene-below-canvas-mount" id="battle-queue-mount"></section>
    </section>
    <aside class="panel sidebar" id="sidebar"></aside>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>("#game-canvas");
  const sidebar = root.querySelector<HTMLElement>("#sidebar");
  const canvasPanel = root.querySelector<HTMLElement>("#game-surface-panel");
  const canvasRow = root.querySelector<HTMLElement>("#game-canvas-row");
  const mapActionMount = root.querySelector<HTMLElement>("#map-action-mount");
  const battleQueueMount = root.querySelector<HTMLElement>("#battle-queue-mount");

  if (!canvas || !sidebar || !canvasPanel || !canvasRow || !mapActionMount || !battleQueueMount) {
    throw new Error("Failed to initialize game shell.");
  }

  canvas.style.userSelect = "none";
  canvas.style.touchAction = "none";

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  const traversalController = createMapTraversalController(store);
  bindMapInput(canvas, store, traversalController);
  bindBattleCanvasInput(canvas, store);

  let lastLayoutSignature = "";
  const syncResponsiveLayout = (): void => {
    const nextLayout = measureGameShellLayout(root, canvasRow, canvas);
    const layoutSignature = JSON.stringify(nextLayout);
    if (layoutSignature === lastLayoutSignature) {
      return;
    }

    lastLayoutSignature = layoutSignature;
    store.update((state) => {
      state.mobileLayoutState = nextLayout.mobileLayoutState;
      state.responsiveCanvasView = nextLayout.responsiveCanvasView;
      if (state.sceneMode === "menu") {
        state.mapViewState.viewport = createViewport(
          state.scenario.map,
          nextLayout.responsiveCanvasView.pixelWidth,
          nextLayout.responsiveCanvasView.pixelHeight
        );
        state.mapViewState.isDefaultView = true;
      } else {
        state.mapViewState.viewport = state.mapViewState.isDefaultView
          ? createDefaultMapViewState(
              state.scenario,
              state.selectedHeroId,
              nextLayout.responsiveCanvasView.pixelWidth,
              nextLayout.responsiveCanvasView.pixelHeight
            ).viewport
          : normalizeViewportForState(state);
      }
    });
  };

  window.addEventListener("resize", syncResponsiveLayout);
  window.addEventListener(VISUAL_TEMPLATE_INVALIDATE_EVENT, () => {
    store.update(() => {
      // Re-render when an asynchronously loaded dedicated visual becomes available.
    });
  });
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      syncResponsiveLayout();
    });
    observer.observe(root);
    observer.observe(canvasPanel);
    observer.observe(canvasRow);
  }

  store.subscribe((state) => {
    setActiveVisualTemplateId(state.activeVisualTemplateId);
    (
      window as Window & {
        __visualStateTracker?: GameStore["getState"] extends () => infer T ? T extends { visualStates: infer V } ? V : never : never;
      }
    ).__visualStateTracker = state.visualStates;
    sceneController.setMode(state.sceneMode);
    sidebar.dataset.scene = sceneController.getMode();
    mapActionMount.dataset.scene = sceneController.getMode();
    battleQueueMount.dataset.scene = sceneController.getMode();
    root.dataset.layoutMode = state.mobileLayoutState.layoutMode;
    root.dataset.sidebarPlacement = state.mobileLayoutState.sidebarPlacement;
    if (sceneController.getMode() === "menu") {
      mapActionMount.innerHTML = "";
      battleQueueMount.innerHTML = "";
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
      const storybookButton = sidebar.querySelector<HTMLButtonElement>('[data-menu-action="open-storybook"]');
      if (storybookButton) {
        storybookButton.onclick = () => {
          store.update((currentState) => {
            openStorybook(currentState);
          });
        };
      }
      const spriteMappingButton = sidebar.querySelector<HTMLButtonElement>('[data-menu-action="open-sprite-mapping"]');
      if (spriteMappingButton) {
        spriteMappingButton.onclick = () => {
          store.update((currentState) => { currentState.sceneMode = "sprite-mapping"; openSpriteMapping(store); });
        };
      }
      const settingsButton = sidebar.querySelector<HTMLButtonElement>('[data-menu-action="open-settings"]');
      if (settingsButton) settingsButton.onclick = () => store.update((currentState) => { openSettings(currentState); });
      return;
    }

    if (sceneController.getMode() === "settings") {
      mapActionMount.innerHTML = "";
      battleQueueMount.innerHTML = "";
      drawMenuScene(context, canvas);
      sidebar.innerHTML = renderSettingsPanel(state);
      sidebar.querySelector<HTMLSelectElement>('[data-testid="movement-behavior-selector"]')?.addEventListener("change", (event) => {
        store.update((current) => { selectMovementBehavior(current, (event.currentTarget as HTMLSelectElement).value as "animated" | "immediate"); });
      });
      bindVisualTemplateSelector(sidebar, store);
      sidebar.querySelector<HTMLButtonElement>('[data-settings-action="return"]')?.addEventListener("click", () => {
        store.update((current) => { returnFromSettings(current); });
      });
      return;
    }

    if (sceneController.getMode() === "sprite-mapping") {
      mapActionMount.innerHTML = "";
      battleQueueMount.innerHTML = "";
      renderSpriteMapping(store, sidebar, canvas, context);
      return;
    }

    if (sceneController.getMode() === "battle") {
      mapActionMount.innerHTML = "";
      battleQueueMount.innerHTML = renderBattleTurnQueue(state);
      drawBattleScene(store, context);
      renderBattleSidebar(store, sidebar);
      return;
    }

    if (sceneController.getMode() === "storybook") {
      mapActionMount.innerHTML = "";
      battleQueueMount.innerHTML = "";
      drawStorybookScene(store, context);
      renderStorybookSidebar(store, sidebar);
      return;
    }

    if (sceneController.getMode() === "victory") {
      mapActionMount.innerHTML = "";
      battleQueueMount.innerHTML = "";
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

    battleQueueMount.innerHTML = "";
    drawMapScene(store, context);
    renderMapSidebar(store, sidebar, mapActionMount);
  });

  syncResponsiveLayout();
}
