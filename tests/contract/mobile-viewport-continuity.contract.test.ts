import { describe, expect, test } from "vitest";
import { createInitialState, returnToMainMenu, startScenarioSession } from "../../src/app/state/gameState";
import { createMobileLayoutState, createResponsiveCanvasView, normalizeViewportForState } from "../../src/render/canvas/viewportRender";

describe("mobile viewport continuity contract", () => {
  test("preserves the active scenario while re-normalizing viewport state", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);
    state.mapViewState.viewport.panOffsetX = 12;
    state.mapViewState.viewport.panOffsetY = 9;

    state.mobileLayoutState = createMobileLayoutState(844, 390, 640, 320);
    state.responsiveCanvasView = createResponsiveCanvasView(640, 320, 2);
    state.mapViewState.viewport = normalizeViewportForState(state);

    expect(state.activeScenarioId).toBe("advanced-terrain-scenario");
    expect(state.mapViewState.viewport.panOffsetX).toBeGreaterThanOrEqual(0);
    expect(state.mapViewState.viewport.panOffsetY).toBeGreaterThanOrEqual(0);
  });

  test("allows return to menu and replay after a mobile session", () => {
    const state = createInitialState();

    returnToMainMenu(state);
    startScenarioSession(state, "core-map-loop");

    expect(state.sceneMode).toBe("map");
    expect(state.activeScenarioId).toBe("core-map-loop");
  });
});
