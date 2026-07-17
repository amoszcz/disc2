import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { confirmRoutePreview, moveSelectedHero, plotRoutePreview } from "../../../src/engine/map/heroActions";

describe("route commit flow", () => {
  test("follows a plotted route to completion when movement is sufficient", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 7, y: 11 });
    expect(state.scenario.heroes[0].remainingMovement).toBe(5);
    expect(result.routeProgress?.traversedSteps).toHaveLength(2);
  });

  test("stops on the last affordable step and keeps continuation state", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 20, y: 31 });

    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(result.routeProgress?.completionState).toBe("partial");
    expect(state.activeRoutePreview?.status).toBe("continuation");
    expect(state.activeRoutePreview?.steps.length).toBeGreaterThan(0);
    expect(state.scenario.heroes[0].mapPosition).not.toEqual({ x: 20, y: 31 });
  });

  test("taking a defined submap exit returns the hero to the linked surface destination", () => {
    const state = createInitialState("advanced-terrain-scenario");

    moveSelectedHero(state, { x: 6, y: 10 });
    moveSelectedHero(state, { x: 7, y: 10 });
    moveSelectedHero(state, { x: 8, y: 10 });
    state.scenario.heroes[0].remainingMovement = 12;
    plotRoutePreview(state, { x: 4, y: 1 });
    const result = confirmRoutePreview(state);

    expect(result.ok).toBe(true);
    expect(state.scenario.heroes[0].mapId).toBe("surface");
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 21, y: 30 });
    expect(state.mapTravelState.activeMapId).toBe("surface");
    expect(state.mapTravelState.lastMapId).toBe("cavern-depths");
    expect(state.mapTravelState.lastTravelLinkId).toBe("cavern-exit-link");
    expect(state.mapTravelState.transitionMessage).toContain("returned");
  });
});
