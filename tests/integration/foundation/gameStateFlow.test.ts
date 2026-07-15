import { describe, expect, test } from "vitest";
import { createInitialState, createMenuState, returnToMainMenu, startScenarioSession } from "../../../src/app/state/gameState";
import { loadScenario } from "../../../src/engine/scenario/loadScenario";
import { advanceTurn, resetMovementForActivePlayer } from "../../../src/engine/turn/turnEngine";
import { evaluateDefaultVictory } from "../../../src/engine/victory/checkVictory";

describe("foundation flow", () => {
  test("menu state starts without an active scenario session and exposes available scenarios", () => {
    const state = createMenuState();

    expect(state.sceneMode).toBe("menu");
    expect(state.activeScenarioId).toBeNull();
    expect(state.availableScenarioOptions.map((option) => option.id)).toEqual([
      "core-map-loop",
      "advanced-terrain-scenario"
    ]);
  });

  test("loads the core scenario and preserves expected relationships", () => {
    const scenario = loadScenario();
    expect(scenario.players).toHaveLength(2);
    expect(scenario.heroes[0].ownerPlayerId).toBe("player-1");
    expect(scenario.guardForces[0].guardedLocationId).toBe("guarded-location-1");
  });

  test("resetting movement restores the active hero allowance", () => {
    const state = createInitialState();
    state.scenario.heroes[0].remainingMovement = 0;
    resetMovementForActivePlayer(state.scenario, state.activePlayerId);
    expect(state.scenario.heroes[0].remainingMovement).toBe(2);
  });

  test("default victory resolves when the neutral target side is defeated", () => {
    const state = createInitialState();
    state.scenario.players.find((player) => player.id === "neutral-guards")!.defeatState = true;
    expect(evaluateDefaultVictory(state.scenario)).toBe("player-1");
    expect(advanceTurn(state.scenario, state.activePlayerId)).toBe("player-1");
  });

  test("starting and returning from a scenario session resets state cleanly", () => {
    const state = createMenuState();

    startScenarioSession(state, "core-map-loop");
    state.scenario.heroes[0].remainingMovement = 0;
    returnToMainMenu(state);
    startScenarioSession(state, "core-map-loop");

    expect(state.sceneMode).toBe("map");
    expect(state.activeScenarioId).toBe("core-map-loop");
    expect(state.scenario.heroes[0].remainingMovement).toBe(2);
    expect(state.selectedHeroId).toBe("hero-1");
  });
});
