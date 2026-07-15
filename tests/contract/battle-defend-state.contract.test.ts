import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { advanceBattleQueue, performAutomaticBattleAction, performDefendAction, refreshBattleTargetingState } from "../../src/engine/battle/battleTurnEngine";

describe("battle defend state contract", () => {
  test("defend halves incoming damage until the unit's next turn begins", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    battle.activeUnitId = "hero-unit-1";
    battle.turnQueue = ["hero-unit-1", "guard-unit-1"];
    refreshBattleTargetingState(state, battle);

    expect(performDefendAction(state, battle)).toContain("defends");
    expect(battle.defendStates[0]).toMatchObject({ unitId: "hero-unit-1", isActive: true, damageMultiplier: 0.5 });

    advanceBattleQueue(state, battle);
    expect(battle.activeUnitId).toBe("guard-unit-1");

    performAutomaticBattleAction(state, battle);
    expect(state.scenario.units.find((unit) => unit.id === "hero-unit-1")?.currentHealth).toBe(8);

    advanceBattleQueue(state, battle);
    expect(battle.activeUnitId).toBe("hero-unit-1");
    expect(battle.defendStates[0]?.isActive).toBe(false);
  });
});
