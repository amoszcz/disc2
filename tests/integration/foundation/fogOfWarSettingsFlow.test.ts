import { describe, expect, test } from "vitest";
import { createInitialState, selectFogOfWarEnabled, selectFogVisibilityRadius } from "../../../src/app/state/gameState";
import { getFogTileState } from "../../../src/engine/map/fogOfWar";

describe("fog of war settings flow", () => {
  test("changes fog preferences without resetting the active scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const scenario = state.scenario;
    selectFogVisibilityRadius(state, 2);
    selectFogOfWarEnabled(state, false);
    expect(state.scenario).toBe(scenario);
    expect(state.gameSettings).toMatchObject({ fogVisibilityRadius: 2, fogOfWarEnabled: false });
    expect(getFogTileState(state, { x: 30, y: 30 })).toBe("visible");
  });
});
