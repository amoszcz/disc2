import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { advanceBattleQueue, performAutomaticBattleAction, performDefendAction, refreshBattleTargetingState } from "../../../src/engine/battle/battleTurnEngine";

describe("battle defend flow", () => {
  test("defend spends the turn and reduces the next incoming hit", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    battle.activeUnitId = "hero-unit-1";
    battle.turnQueue = ["hero-unit-1", "guard-unit-1"];
    refreshBattleTargetingState(state, battle);

    const defendMessage = performDefendAction(state, battle);
    expect(defendMessage).toContain("braces");
    expect(state.scenario.units.find((unit) => unit.id === "hero-unit-1")?.actionState).toBe("spent");

    advanceBattleQueue(state, battle);
    const attackMessage = performAutomaticBattleAction(state, battle);

    expect(attackMessage).toContain("Militia for 2");
    expect(state.scenario.units.find((unit) => unit.id === "hero-unit-1")?.currentHealth).toBe(8);
  });
});
