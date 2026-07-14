import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";

describe("bridge crossing flow", () => {
  test("allows crossing a bridged river tile", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 19, y: 31 };
    hero.remainingMovement = 8;

    const result = moveSelectedHero(state, { x: 20, y: 31 });

    expect(result.ok).toBe(true);
    expect(hero.mapPosition).toEqual({ x: 20, y: 31 });
    expect(hero.remainingMovement).toBe(7);
    expect(state.routeFeedback?.objectLabels).toEqual(["Bridge"]);
    expect(state.routeFeedback?.passabilityExplanation).toBe("Bridge turns this river tile into a legal crossing.");
  });

  test("keeps unbridged river tiles blocked", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 19, y: 10 };
    hero.remainingMovement = 8;

    const result = moveSelectedHero(state, { x: 20, y: 10 });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("rivers cannot be traversed.");
    expect(hero.mapPosition).toEqual({ x: 19, y: 10 });
    expect(state.routeFeedback?.objectLabels).toEqual([]);
  });
});
