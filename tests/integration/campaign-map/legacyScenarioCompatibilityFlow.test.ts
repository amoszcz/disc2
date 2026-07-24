import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { plotRoutePreview, clearOwnedRoutePreview } from "../../../src/engine/map/heroActions";
import { getFogTileState } from "../../../src/engine/map/fogOfWar";
import { resolveCampaignMap } from "../../../src/engine/scenario/loadScenario";

describe("legacy campaign-map compatibility", () => {
  test.each(["core-map-loop", "submap-expedition-scenario"] as const)("keeps %s routes and fog compatible through the adapter", (scenarioId) => {
    const state = createInitialState(scenarioId);
    const map = resolveCampaignMap(state.scenario, state.mapTravelState.activeMapId);
    expect(map.metadata.source).toBe("adapter");
    expect(map.cells).toHaveLength(state.scenario.map.width * state.scenario.map.height);
    expect(getFogTileState(state, state.scenario.heroes[0].mapPosition)).not.toBe("unexplored");
    expect(clearOwnedRoutePreview(state, state.scenario.heroes[0].id).ok).toBe(false);
  });

  test("keeps route preview persistence semantics on a generated campaign", () => {
    const state = createInitialState("advanced-terrain-scenario");
    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);
    expect(state.activeRoutePreview?.steps.length).toBeGreaterThan(0);
    expect(clearOwnedRoutePreview(state, "hero-1").ok).toBe(true);
  });
});
