import { describe, expect, test } from "vitest";
import { createMenuState, startScenarioSession } from "../../../src/app/state/gameState";

describe("menu scenario selection flow", () => {
  test("starting the core scenario leaves the menu and opens the selected session", () => {
    const state = createMenuState();

    startScenarioSession(state, "core-map-loop");

    expect(state.sceneMode).toBe("map");
    expect(state.activeScenarioId).toBe("core-map-loop");
    expect(state.scenario.id).toBe("core-map-loop");
    expect(state.messageLog).toContain("Aren arrives at the borderlands.");
  });

  test("starting the advanced scenario loads its distinct map and movement budget", () => {
    const state = createMenuState();

    startScenarioSession(state, "advanced-terrain-scenario");

    expect(state.sceneMode).toBe("map");
    expect(state.scenario.id).toBe("advanced-terrain-scenario");
    expect(state.scenario.map.width).toBe(64);
    expect(state.scenario.heroes[0].remainingMovement).toBe(8);
  });

  test("starting the submap scenario loads its linked-map setup from the main menu", () => {
    const state = createMenuState();

    startScenarioSession(state, "submap-expedition-scenario");

    expect(state.sceneMode).toBe("map");
    expect(state.scenario.id).toBe("submap-expedition-scenario");
    expect(state.scenario.worldMaps?.map((worldMap) => worldMap.id)).toEqual(["surface-camp", "echo-cavern"]);
    expect(state.mapTravelState.activeMapId).toBe("surface-camp");
    expect(state.scenario.heroes[0].remainingMovement).toBe(5);
  });
});
