import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";
import { startGuardEncounter } from "../../../src/engine/map/startGuardEncounter";
import { resolveBattleOutcome } from "../../../src/engine/battle/resolveBattleOutcome";
import { applyBattleOutcome } from "../../../src/app/state/applyBattleOutcome";
import { resetMovementForActivePlayer } from "../../../src/engine/turn/turnEngine";

describe("guarded location flow", () => {
  test("entering a guarded site starts a battle and victory unlocks the location", () => {
    const state = createInitialState();
    moveSelectedHero(state, { x: 1, y: 2 });
    resetMovementForActivePlayer(state.scenario, state.activePlayerId);
    moveSelectedHero(state, { x: 3, y: 2 });
    const encounter = startGuardEncounter(state, "hero-1");

    expect(encounter.ok).toBe(true);
    if (!encounter.ok) {
      return;
    }

    state.battle = encounter.battle;
    for (const unit of state.scenario.units.filter((entry) => entry.ownerSideId === "neutral-guards")) {
      unit.currentHealth = 0;
      unit.defeatState = true;
    }

    resolveBattleOutcome(state, encounter.battle);
    applyBattleOutcome(state);

    expect(state.scenario.guardedLocations[0].accessState).toBe("open");
    expect(state.scenario.players.find((player) => player.id === "neutral-guards")?.defeatState).toBe(true);
  });
});
