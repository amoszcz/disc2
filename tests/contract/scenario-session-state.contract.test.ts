import { describe, expect, test } from "vitest";
import { createInitialState, createMenuState, returnToMainMenu, startScenarioSession } from "../../src/app/state/gameState";

describe("scenario session state contract", () => {
  test("starting a scenario from the menu creates a fresh active session", () => {
    const state = createMenuState();

    startScenarioSession(state, "advanced-terrain-scenario");

    expect(state.sceneMode).toBe("map");
    expect(state.activeScenarioId).toBe("advanced-terrain-scenario");
    expect(state.scenario.id).toBe("advanced-terrain-scenario");
    expect(state.selectedHeroId).toBe("hero-1");
  });

  test("returning to the menu clears the active session identity", () => {
    const state = createInitialState();

    returnToMainMenu(state);

    expect(state.sceneMode).toBe("menu");
    expect(state.activeScenarioId).toBeNull();
    expect(state.selectedHeroId).toBeNull();
  });
});
