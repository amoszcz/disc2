import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { refreshBattleTargetingState, trySelectBattleTarget } from "../../src/engine/battle/battleTurnEngine";

describe("battle targeting state contract", () => {
  test("single-target units need a legal selected enemy before strike is ready", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    expect(battle.targetingState).toMatchObject({
      activeUnitId: "hero-unit-2",
      selectedTargetUnitId: null,
      legalTargetUnitIds: ["guard-unit-1", "guard-unit-2"],
      canStrike: false,
      canDefend: true
    });

    expect(trySelectBattleTarget(state, battle, "guard-unit-2")).toBe(true);
    expect(battle.targetingState?.selectedTargetUnitId).toBe("guard-unit-2");
    expect(battle.targetingState?.canStrike).toBe(true);
  });

  test("area units can strike without a single selected target", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    battle.activeUnitId = "hero-unit-3";
    battle.turnQueue = ["hero-unit-3", "hero-unit-1", "hero-unit-2", "guard-unit-1", "guard-unit-2"];
    refreshBattleTargetingState(state, battle);

    expect(battle.targetingState?.selectedTargetUnitId).toBeNull();
    expect(battle.targetingState?.legalTargetUnitIds).toEqual(["guard-unit-1", "guard-unit-2"]);
    expect(battle.targetingState?.canStrike).toBe(true);
  });
});
