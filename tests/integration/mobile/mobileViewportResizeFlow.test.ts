import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createMobileLayoutState, createResponsiveCanvasView, normalizeViewportForState } from "../../../src/render/canvas/viewportRender";

describe("mobile viewport resize flow", () => {
  test("keeps the map session playable across orientation-style viewport changes", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);
    state.mapViewState.viewport.panOffsetX = 8;
    state.mapViewState.viewport.panOffsetY = 6;
    state.mapViewState.isDefaultView = false;

    state.mobileLayoutState = createMobileLayoutState(844, 390, 640, 320);
    state.responsiveCanvasView = createResponsiveCanvasView(640, 320, 2);
    state.mapViewState.viewport = normalizeViewportForState(state);

    expect(state.sceneMode).toBe("map");
    expect(state.mapViewState.isDefaultView).toBe(false);
    expect(state.mapViewState.viewport.zoomLevel).toBeGreaterThanOrEqual(1);
  });
});
