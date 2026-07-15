import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { performStrikeAction, trySelectBattleTarget } from "../../../src/engine/battle/battleTurnEngine";

describe("battle target selection flow", () => {
  test("changing the selected target changes which enemy is hit", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    expect(trySelectBattleTarget(state, battle, "guard-unit-1")).toBe(true);
    expect(trySelectBattleTarget(state, battle, "guard-unit-2")).toBe(true);

    const message = performStrikeAction(state, battle);

    expect(message).toContain("Skeleton Archer");
    expect(state.scenario.units.find((unit) => unit.id === "guard-unit-2")?.currentHealth).toBe(2);
    expect(state.scenario.units.find((unit) => unit.id === "guard-unit-1")?.currentHealth).toBe(7);
  });
});
