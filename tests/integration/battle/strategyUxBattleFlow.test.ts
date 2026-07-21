import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { trySelectBattleTarget } from "../../../src/engine/battle/battleTurnEngine";

describe("strategy UX battle recovery", () => {
  test("allows a selected target to be cleared before combat is committed", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");
    expect(trySelectBattleTarget(state, battle, "guard-unit-1")).toBe(true);
    battle.targetingState!.selectedTargetUnitId = null;
    expect(battle.targetingState?.selectedTargetUnitId).toBeNull();
    expect(state.scenario.units.find((unit) => unit.id === "guard-unit-1")?.currentHealth).toBe(7);
  });
});
