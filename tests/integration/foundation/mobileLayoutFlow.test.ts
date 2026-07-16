import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import {
  createMobileLayoutState,
  createResponsiveCanvasView,
  normalizeViewportForState,
  resolveLayoutMode,
  resolveSidebarPlacement
} from "../../../src/render/canvas/viewportRender";

describe("mobile layout foundation flow", () => {
  test("switches to stacked mobile layout on narrow viewports", () => {
    expect(resolveLayoutMode(390)).toBe("mobile");
    expect(resolveSidebarPlacement("mobile")).toBe("bottom");
  });

  test("tracks responsive canvas metrics for a mobile-sized viewport", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);

    expect(state.mobileLayoutState.layoutMode).toBe("mobile");
    expect(state.mobileLayoutState.sidebarPlacement).toBe("bottom");
    expect(state.responsiveCanvasView.pixelWidth).toBe(716);
    expect(state.responsiveCanvasView.pixelHeight).toBe(840);
  });

  test("normalizes a persisted map viewport against live mobile canvas size", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.responsiveCanvasView = createResponsiveCanvasView(320, 400, 2);
    state.mapViewState.viewport.panOffsetX = 500;
    state.mapViewState.viewport.panOffsetY = 500;

    const normalized = normalizeViewportForState(state);

    expect(normalized.panOffsetX).toBeLessThan(state.scenario.map.width);
    expect(normalized.panOffsetY).toBeLessThan(state.scenario.map.height);
  });
});
