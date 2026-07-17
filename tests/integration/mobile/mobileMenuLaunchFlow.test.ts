import { describe, expect, test } from "vitest";
import { createMenuState, startScenarioSession } from "../../../src/app/state/gameState";
import { getVisibleWorldSize } from "../../../src/engine/map/viewportMath";
import { createMobileLayoutState, createResponsiveCanvasView } from "../../../src/render/canvas/viewportRender";

describe("mobile menu launch flow", () => {
  test("starts a scenario from the menu while retaining mobile layout state", () => {
    const state = createMenuState();
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);

    startScenarioSession(state, "core-map-loop");

    expect(state.sceneMode).toBe("map");
    expect(state.activeScenarioId).toBe("core-map-loop");
    expect(state.mobileLayoutState.layoutMode).toBe("mobile");
    expect(state.responsiveCanvasView.pixelWidth).toBe(716);
  });

  test("centers the initial scenario viewport on the selected hero using the active mobile canvas size", () => {
    const state = createMenuState();
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);

    startScenarioSession(state, "advanced-terrain-scenario");

    const hero = state.scenario.heroes.find((entry) => entry.id === state.selectedHeroId);
    if (!hero) {
      throw new Error("Expected selected hero to exist.");
    }

    const visibleWorld = getVisibleWorldSize(
      state.mapViewState.viewport,
      state.scenario.map,
      state.responsiveCanvasView.pixelWidth,
      state.responsiveCanvasView.pixelHeight
    );

    expect(state.mapViewState.viewport.panOffsetX).toBeCloseTo(hero.mapPosition.x + 0.5 - visibleWorld.width / 2, 3);
    expect(state.mapViewState.viewport.panOffsetY).toBeCloseTo(hero.mapPosition.y + 0.5 - visibleWorld.height / 2, 3);
  });
});
