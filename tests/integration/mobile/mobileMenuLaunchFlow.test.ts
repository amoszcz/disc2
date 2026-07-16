import { describe, expect, test } from "vitest";
import { createMenuState, startScenarioSession } from "../../../src/app/state/gameState";
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
});
