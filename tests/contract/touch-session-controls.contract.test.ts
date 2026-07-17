import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { getScaledTileSize, getZoomScaleBaseline } from "../../src/engine/map/viewportMath";
import { renderMapHud } from "../../src/ui/hud/mapHud";
import { renderBattleHud } from "../../src/ui/overlays/battleHud";
import { createMobileLayoutState } from "../../src/render/canvas/viewportRender";

describe("touch session controls contract", () => {
  test("presents touch-oriented map controls in mobile layout", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    const html = renderMapHud(state);

    expect(state.mobileLayoutState.layoutMode).toBe("mobile");
    expect(html).toContain("Use two fingers or the zoom buttons to zoom");
    expect(html).toContain('data-testid="map-zoom-in-button"');
  });

  test("presents touch-oriented battle targeting guidance", () => {
    const state = createInitialState();
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    state.sceneMode = "battle";

    const html = renderBattleHud(state);

    expect(html).toContain("Tap an enemy card to target it");
    expect(html).toContain('data-testid="battle-attack-button"');
  });

  test("uses Border Watch tile-size endpoints for touch zoom across scenarios", () => {
    const baseline = getZoomScaleBaseline();
    const borderWatchState = createInitialState("core-map-loop");
    const largeScenarioState = createInitialState("advanced-terrain-scenario");

    expect(getScaledTileSize(borderWatchState.mapViewState.viewport, borderWatchState.scenario.map)).toBe(
      baseline.minTileRenderSize
    );
    expect(getScaledTileSize(largeScenarioState.mapViewState.viewport, largeScenarioState.scenario.map)).toBe(
      baseline.minTileRenderSize
    );
    expect(
      getScaledTileSize(
        { ...borderWatchState.mapViewState.viewport, zoomLevel: borderWatchState.mapViewState.viewport.maxZoom },
        borderWatchState.scenario.map
      )
    ).toBe(baseline.maxTileRenderSize);
    expect(
      getScaledTileSize(
        { ...largeScenarioState.mapViewState.viewport, zoomLevel: largeScenarioState.mapViewState.viewport.maxZoom },
        largeScenarioState.scenario.map
      )
    ).toBe(baseline.maxTileRenderSize);
  });
});
