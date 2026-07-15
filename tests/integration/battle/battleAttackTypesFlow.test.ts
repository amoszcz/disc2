import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { performStrikeAction, refreshBattleTargetingState, trySelectBattleTarget } from "../../../src/engine/battle/battleTurnEngine";

describe("battle attack type flow", () => {
  test("area strikes damage all living enemies in one action", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    battle.activeUnitId = "hero-unit-3";
    battle.turnQueue = ["hero-unit-3", "hero-unit-1", "hero-unit-2", "guard-unit-1", "guard-unit-2"];
    refreshBattleTargetingState(state, battle);

    const message = performStrikeAction(state, battle);

    expect(message).toContain("Skeleton for 3");
    expect(message).toContain("Skeleton Archer for 3");
    expect(state.scenario.units.find((unit) => unit.id === "guard-unit-1")?.currentHealth).toBe(4);
    expect(state.scenario.units.find((unit) => unit.id === "guard-unit-2")?.currentHealth).toBe(3);
  });

  test("melee strikes cannot hit beyond the nearest occupied enemy column", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    battle.activeUnitId = "hero-unit-1";
    battle.turnQueue = ["hero-unit-1", "guard-unit-1"];
    refreshBattleTargetingState(state, battle);

    const frontRowTarget = battle.formation.defenderSlots.find((slot) => slot.unitId === "guard-unit-2");
    if (!frontRowTarget) {
      throw new Error("Missing front-row defender.");
    }

    frontRowTarget.unitId = null;
    frontRowTarget.isOccupied = false;
    const deeperSlot = battle.formation.defenderSlots.find((slot) => slot.columnIndex === 1 && slot.rowIndex === 0);
    if (!deeperSlot) {
      throw new Error("Missing deeper defender slot.");
    }

    deeperSlot.unitId = "guard-unit-2";
    deeperSlot.isOccupied = true;
    refreshBattleTargetingState(state, battle);

    expect(trySelectBattleTarget(state, battle, "guard-unit-2")).toBe(false);
    expect(trySelectBattleTarget(state, battle, "guard-unit-1")).toBe(true);
    expect(performStrikeAction(state, battle)).toContain("Skeleton for 4");
  });
});
