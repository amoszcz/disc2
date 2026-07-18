import { describe, expect, test } from "vitest";
import { createInitialState, createMenuState } from "../../src/app/state/gameState";
import { getVisibleWorldSize } from "../../src/engine/map/viewportMath";
import { renderMainMenu } from "../../src/ui/overlays/mainMenu";
import { renderMapHud } from "../../src/ui/hud/mapHud";
import { renderMapActionBar } from "../../src/ui/panels/mapActionBar";
import { createMobileLayoutState, createResponsiveCanvasView } from "../../src/render/canvas/viewportRender";

describe("mobile layout UX contract", () => {
  test("shows a tappable menu message for narrow mobile layout", () => {
    const state = createMenuState();
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);

    const html = renderMainMenu(state);

    expect(html).toContain("tap to begin");
    expect(html).toContain('data-testid="scenario-start-core-map-loop"');
  });

  test("shows mobile layout state and control guidance during active play", () => {
    const state = createInitialState();
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);

    const html = renderMapHud(state);

    expect(html).toContain('data-testid="layout-mode">mobile<');
    expect(html).toContain("Tap to select or confirm");
    expect(renderMapActionBar()).toContain('data-testid="map-zoom-in-button"');
  });

  test("starts scenarios with the selected hero centered in the initial map view when bounds allow", () => {
    const state = createInitialState("advanced-terrain-scenario");
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
    const expectedPanOffsetX = hero.mapPosition.x + 0.5 - visibleWorld.width / 2;
    const expectedPanOffsetY = hero.mapPosition.y + 0.5 - visibleWorld.height / 2;

    expect(state.mapViewState.viewport.panOffsetX).toBeCloseTo(expectedPanOffsetX, 3);
    expect(state.mapViewState.viewport.panOffsetY).toBeCloseTo(expectedPanOffsetY, 3);
  });
});
