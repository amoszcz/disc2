import { describe, expect, test } from "vitest";
import { createInitialState, createMenuState } from "../../src/app/state/gameState";
import { renderMainMenu } from "../../src/ui/overlays/mainMenu";
import { renderMapHud } from "../../src/ui/hud/mapHud";
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
    expect(html).toContain('data-testid="map-zoom-in-button"');
  });
});
