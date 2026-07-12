import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero } from "../../../src/engine/map/heroActions";
import { advanceTurn, resetMovementForActivePlayer } from "../../../src/engine/turn/turnEngine";

describe("map turn flow", () => {
  test("hero movement consumes allowance and pickup collection updates gold", () => {
    const state = createInitialState();
    const moved = moveSelectedHero(state, { x: 1, y: 2 });

    expect(moved.ok).toBe(true);
    expect(state.scenario.heroes[0].remainingMovement).toBe(1);
    expect(state.scenario.players[0].resourceStockpile.gold).toBe(10);
    expect(state.scenario.resourcePickups[0].collectedState).toBe(true);
  });

  test("ending a turn preserves state and refreshes movement for the next active turn", () => {
    const state = createInitialState();
    moveSelectedHero(state, { x: 1, y: 2 });
    const nextPlayerId = advanceTurn(state.scenario, state.activePlayerId);
    resetMovementForActivePlayer(state.scenario, nextPlayerId);
    state.activePlayerId = nextPlayerId;

    expect(state.scenario.players[0].resourceStockpile.gold).toBe(10);
    expect(state.scenario.heroes[0].remainingMovement).toBe(2);
  });
});
