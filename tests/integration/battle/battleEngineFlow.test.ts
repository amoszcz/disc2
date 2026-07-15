import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { advanceBattleQueue, performStrikeAction, refreshBattleTargetingState, trySelectBattleTarget } from "../../../src/engine/battle/battleTurnEngine";
import { resolveBattleOutcome } from "../../../src/engine/battle/resolveBattleOutcome";

describe("battle engine flow", () => {
  test("battle queue is ordered by agility and formation slots are assigned", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    expect(battle.turnQueue).toEqual(["hero-unit-2", "hero-unit-3", "hero-unit-1", "guard-unit-1", "guard-unit-2"]);
    expect(battle.formation.attackerSlots.slice(0, 3).map((slot) => slot.unitId)).toEqual(["hero-unit-1", "hero-unit-2", "hero-unit-3"]);
    expect(battle.formation.defenderSlots.slice(0, 2).map((slot) => slot.unitId)).toEqual(["guard-unit-1", "guard-unit-2"]);
  });

  test("player turns require selecting a legal target before striking", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    expect(battle.targetingState?.canStrike).toBe(false);
    expect(trySelectBattleTarget(state, battle, "guard-unit-2")).toBe(true);

    const message = performStrikeAction(state, battle);

    expect(message).toContain("Skeleton Archer");
    expect(state.scenario.units.find((unit) => unit.id === "guard-unit-2")?.currentHealth).toBe(2);

    advanceBattleQueue(state, battle);
    expect(battle.activeUnitId).toBe("hero-unit-3");
  });

  test("battle resolves when one side is defeated", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");

    battle.activeUnitId = "hero-unit-3";
    battle.turnQueue = ["hero-unit-3", "hero-unit-1", "hero-unit-2", "guard-unit-1", "guard-unit-2"];
    refreshBattleTargetingState(state, battle);

    performStrikeAction(state, battle);
    state.scenario.units.find((unit) => unit.id === "guard-unit-1")!.currentHealth = 0;
    state.scenario.units.find((unit) => unit.id === "guard-unit-1")!.defeatState = true;
    state.scenario.units.find((unit) => unit.id === "guard-unit-2")!.currentHealth = 0;
    state.scenario.units.find((unit) => unit.id === "guard-unit-2")!.defeatState = true;

    const outcome = resolveBattleOutcome(state, battle);
    expect(outcome.winner).toBe("attacker");
    expect(outcome.heroExperienceAwarded).toBe(5);
  });
});
