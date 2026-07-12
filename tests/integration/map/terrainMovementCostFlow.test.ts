import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";

describe("terrain movement costs", () => {
  test("spends 1 movement on road tiles", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(moveSelectedHero(state, { x: 6, y: 10 }).ok).toBe(true);
    expect(state.scenario.heroes[0].remainingMovement).toBe(7);
  });

  test("spends 2 movement on standard terrain including diagonal steps", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(moveSelectedHero(state, { x: 6, y: 11 }).ok).toBe(true);
    expect(state.scenario.heroes[0].remainingMovement).toBe(6);
    expect(state.routeFeedback?.terrainLabel).toBe("Plains");
  });

  test("spends 3 movement on difficult terrain", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 13, y: 18 };
    hero.remainingMovement = 8;

    expect(moveSelectedHero(state, { x: 14, y: 18 }).ok).toBe(true);
    expect(hero.remainingMovement).toBe(5);
    expect(state.routeFeedback?.terrainLabel).toBe("Mud");
  });
});
