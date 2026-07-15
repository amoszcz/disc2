import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { getLegalTargetUnitIds } from "../../src/engine/battle/battleTargeting";

describe("battle attack category contract", () => {
  test("melee units target the nearest occupied opposing column", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    expect(getLegalTargetUnitIds(state, battle, "hero-unit-1")).toEqual(["guard-unit-1", "guard-unit-2"]);

    const frontRowOne = battle.formation.defenderSlots.find((slot) => slot.unitId === "guard-unit-2");
    if (!frontRowOne) {
      throw new Error("Missing defender slot.");
    }

    frontRowOne.unitId = null;
    frontRowOne.isOccupied = false;
    const secondColumnSlot = battle.formation.defenderSlots.find((slot) => slot.columnIndex === 1 && slot.rowIndex === 0);
    if (!secondColumnSlot) {
      throw new Error("Missing second column slot.");
    }

    secondColumnSlot.unitId = "guard-unit-2";
    secondColumnSlot.isOccupied = true;
    expect(getLegalTargetUnitIds(state, battle, "hero-unit-1")).toEqual(["guard-unit-1"]);

    state.scenario.units.find((unit) => unit.id === "guard-unit-1")!.currentHealth = 0;
    state.scenario.units.find((unit) => unit.id === "guard-unit-1")!.defeatState = true;
    expect(getLegalTargetUnitIds(state, battle, "hero-unit-1")).toEqual(["guard-unit-2"]);
  });

  test("ranged and area units can target all living enemies", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    expect(getLegalTargetUnitIds(state, battle, "hero-unit-2")).toEqual(["guard-unit-1", "guard-unit-2"]);
    expect(getLegalTargetUnitIds(state, battle, "hero-unit-3")).toEqual(["guard-unit-1", "guard-unit-2"]);
  });
});
