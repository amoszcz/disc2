import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { plotRoutePreview, selectHero } from "../../../src/engine/map/heroActions";
import { createPanGesture, createZoomGesture, panViewport, zoomViewportWithTouchGesture } from "../../../src/engine/map/viewportMath";
import { createMobileLayoutState, createResponsiveCanvasView } from "../../../src/render/canvas/viewportRender";

describe("mobile map touch flow", () => {
  test("supports route plotting and pan updates on a mobile-sized canvas", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);

    const selectResult = selectHero(state, "hero-1");
    const routeResult = plotRoutePreview(state, { x: 8, y: 10 });
    state.mapViewState.panGesture = createPanGesture({ x: 240, y: 220 }, state.mapViewState.viewport);
    state.mapViewState.viewport = panViewport(
      state.mapViewState.viewport,
      state.mapViewState.panGesture,
      { x: 120, y: 180 },
      state.scenario.map,
      state.responsiveCanvasView.pixelWidth,
      state.responsiveCanvasView.pixelHeight
    );

    expect(selectResult.ok).toBe(true);
    expect(routeResult.ok).toBe(true);
    expect(state.activeRoutePreview?.destinationPosition).toEqual({ x: 8, y: 10 });
    expect(state.mapViewState.viewport.panOffsetX).toBeGreaterThanOrEqual(0);
  });

  test("supports two-finger zoom updates on a mobile-sized canvas", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);
    const startingZoom = state.mapViewState.viewport.zoomLevel;

    const zoomGesture = createZoomGesture(1, 2, { x: 120, y: 180 }, { x: 220, y: 180 });
    const zoomResult = zoomViewportWithTouchGesture(
      state.mapViewState.viewport,
      zoomGesture,
      { x: 90, y: 180 },
      { x: 270, y: 180 },
      state.scenario.map,
      state.responsiveCanvasView.pixelWidth,
      state.responsiveCanvasView.pixelHeight
    );

    state.mapViewState.zoomGesture = zoomResult.zoomGesture;
    state.mapViewState.viewport = zoomResult.viewport;

    expect(zoomResult.interactionType).toBe("zoom-in");
    expect(state.mapViewState.zoomGesture).not.toBeNull();
    expect(state.mapViewState.viewport.zoomLevel).toBeGreaterThan(startingZoom);
  });
});
