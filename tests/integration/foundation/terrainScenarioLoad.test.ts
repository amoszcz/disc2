import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { loadScenario } from "../../../src/engine/scenario/loadScenario";
import { resolveTerrainTile } from "../../../src/engine/map/terrainLookup";

describe("advanced terrain scenario loading", () => {
  test("loads the 64x64 terrain scenario with deterministic region precedence", () => {
    const scenario = loadScenario("advanced-terrain-scenario");

    expect(scenario.map.width).toBe(64);
    expect(scenario.map.height).toBe(64);
    expect(resolveTerrainTile(scenario, { x: 5, y: 10 }).terrainType).toBe("road");
    expect(resolveTerrainTile(scenario, { x: 20, y: 10 }).terrainType).toBe("rivers");
    expect(resolveTerrainTile(scenario, { x: 14, y: 18 }).terrainType).toBe("mud");
  });

  test("can bootstrap the advanced terrain scenario directly", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(state.scenario.id).toBe("advanced-terrain-scenario");
    expect(state.routeFeedback).toBeNull();
    expect(state.selectedHeroId).toBe("hero-1");
  });
});
