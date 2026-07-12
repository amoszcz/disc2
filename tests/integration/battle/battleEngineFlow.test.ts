import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { advanceBattleQueue, performAttack } from "../../../src/engine/battle/battleTurnEngine";
import { resolveBattleOutcome } from "../../../src/engine/battle/resolveBattleOutcome";

describe("battle engine flow", () => {
  test("battle queue is ordered by agility", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");
    expect(battle.turnQueue).toEqual(["hero-unit-2", "hero-unit-1", "guard-unit-1", "guard-unit-2"]);
  });

  test("units perform one action per turn and queue advances", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");
    const message = performAttack(state, battle);

    expect(message).toContain("strikes");
    expect(state.scenario.units.find((unit) => unit.id === battle.activeUnitId)?.actionState).toBe("spent");

    advanceBattleQueue(state, battle);
    expect(battle.activeUnitId).toBe("hero-unit-1");
  });

  test("battle resolves when one side is defeated", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");
    for (const unit of state.scenario.units.filter((entry) => entry.ownerSideId === "neutral-guards")) {
      unit.currentHealth = 0;
      unit.defeatState = true;
    }

    const outcome = resolveBattleOutcome(state, battle);
    expect(outcome.winner).toBe("attacker");
    expect(outcome.heroExperienceAwarded).toBe(5);
  });
});
