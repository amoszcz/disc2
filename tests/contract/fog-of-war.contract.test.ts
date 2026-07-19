import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { getCurrentVisibleTileKeys, getFogTileState, refreshFogOfWar } from "../../src/engine/map/fogOfWar";
import { getDefaultGameSettings, normalizeGameSettings } from "../../src/app/state/gameSettings";

describe("fog of war contract", () => {
  test("defaults to enabled fog with a three-tile visibility radius", () => {
    expect(getDefaultGameSettings()).toMatchObject({ fogOfWarEnabled: true, fogVisibilityRadius: 3 });
  });

  test("shows hero-range tiles and keeps distant tiles unexplored", () => {
    const state = createInitialState("advanced-terrain-scenario");
    expect(getFogTileState(state, { x: 8, y: 10 })).toBe("visible");
    expect(getFogTileState(state, { x: 20, y: 20 })).toBe("unexplored");
  });

  test("uses a circular visibility radius", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.gameSettings.fogVisibilityRadius = 1;
    const visible = getCurrentVisibleTileKeys(state);
    expect(visible).toContain("6,10");
    expect(visible).not.toContain("6,11");
  });

  test("uses visited fog outside current visibility and reveals all tiles when disabled", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.gameSettings.fogVisibilityRadius = 1;
    state.scenario.heroes[0].mapPosition = { x: 7, y: 10 };
    refreshFogOfWar(state);
    expect(getFogTileState(state, { x: 5, y: 10 })).toBe("visited");
    state.gameSettings.fogOfWarEnabled = false;
    expect(getFogTileState(state, { x: 20, y: 20 })).toBe("visible");
  });

  test("normalizes invalid fog preferences to safe defaults", () => {
    expect(normalizeGameSettings({ fogOfWarEnabled: "yes" as never, fogVisibilityRadius: 0 })).toMatchObject({ fogOfWarEnabled: true, fogVisibilityRadius: 3 });
  });
});
