import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";

describe("movement object cost flow", () => {
  test("milestone reduces final movement cost to a minimum of one", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 6, y: 10 };
    hero.remainingMovement = 8;

    expect(moveSelectedHero(state, { x: 7, y: 11 }).ok).toBe(true);
    expect(hero.remainingMovement).toBe(7);
    expect(state.routeFeedback?.objectLabels).toEqual(["Milestone"]);
  });

  test("rubble increases the final movement cost", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 14, y: 18 };
    hero.remainingMovement = 8;

    expect(moveSelectedHero(state, { x: 15, y: 18 }).ok).toBe(true);
    expect(hero.remainingMovement).toBe(4);
    expect(state.routeFeedback?.movementImpact).toBe("4 movement");
    expect(state.routeFeedback?.objectLabels).toEqual(["Rubble"]);
  });

  test("stacked bridge and rubble effects resolve deterministically", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 19, y: 30 };
    hero.remainingMovement = 8;

    expect(moveSelectedHero(state, { x: 20, y: 30 }).ok).toBe(true);
    expect(hero.remainingMovement).toBe(6);
    expect(state.routeFeedback?.movementImpact).toBe("2 movement");
    expect(state.routeFeedback?.objectLabels).toEqual(["Bridge", "Rubble"]);
  });
});
