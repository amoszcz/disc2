import { describe, expect, test } from "vitest";
import { createInitialState, setActiveWorldMap } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";
import { getFogTileState, refreshFogOfWar } from "../../../src/engine/map/fogOfWar";

describe("fog of war memory flow", () => {
  test("retains previously visible tiles as visited after the hero moves away", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.gameSettings.fogVisibilityRadius = 1;
    expect(moveSelectedHero(state, { x: 6, y: 10 }).ok).toBe(true);
    expect(moveSelectedHero(state, { x: 7, y: 10 }).ok).toBe(true);
    expect(getFogTileState(state, { x: 5, y: 10 })).toBe("visited");
  });

  test("keeps surface exploration memory when travelling to another map and returning", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.gameSettings.fogVisibilityRadius = 1;
    expect(moveSelectedHero(state, { x: 6, y: 10 }).ok).toBe(true);
    expect(moveSelectedHero(state, { x: 7, y: 10 }).ok).toBe(true);

    setActiveWorldMap(state, "cavern-depths", null, null);
    setActiveWorldMap(state, "surface", null, null);

    expect(getFogTileState(state, { x: 5, y: 10 })).toBe("visited");
  });

  test("uses the combined current vision of multiple active heroes", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.gameSettings.fogVisibilityRadius = 1;
    state.scenario.heroes.push({ ...state.scenario.heroes[0], id: "hero-scout", mapPosition: { x: 20, y: 20 } });
    refreshFogOfWar(state);

    expect(getFogTileState(state, { x: 19, y: 20 })).toBe("visible");
  });
});
