import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";

describe("blocked terrain movement", () => {
  test("rejects river movement without changing position or spending movement", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 19, y: 10 };
    hero.remainingMovement = 8;

    const result = moveSelectedHero(state, { x: 20, y: 10 });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("rivers cannot be traversed.");
    expect(hero.mapPosition).toEqual({ x: 19, y: 10 });
    expect(hero.remainingMovement).toBe(8);
  });

  test("rejects non-adjacent terrain moves on the large scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    const result = moveSelectedHero(state, { x: 8, y: 10 });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("Terrain movement is limited to adjacent tiles.");
    expect(hero.mapPosition).toEqual({ x: 5, y: 10 });
  });

  test("rejects road-to-river movement even when a road borders the water", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 19, y: 10 };

    const result = moveSelectedHero(state, { x: 20, y: 10 });

    expect(result.ok).toBe(false);
    expect(state.routeFeedback?.movementImpact).toBe("Blocked terrain");
  });
});
