import { describe, expect, test } from "vitest";
import { createInitialState, createMenuState, returnToMainMenu, startScenarioSession } from "../../src/app/state/gameState";
import { validateScenario } from "../../src/engine/scenario/loadScenario";

describe("scenario session state contract", () => {
  test("starting a scenario from the menu creates a fresh active session", () => {
    const state = createMenuState();

    startScenarioSession(state, "advanced-terrain-scenario");

    expect(state.sceneMode).toBe("map");
    expect(state.activeScenarioId).toBe("advanced-terrain-scenario");
    expect(state.scenario.id).toBe("advanced-terrain-scenario");
    expect(state.selectedHeroId).toBe("hero-1");
    expect(state.mapTravelState.activeMapId).toBe("surface");
    expect(state.scenario.worldMaps?.map((worldMap) => worldMap.id)).toEqual(["surface", "cavern-depths"]);
    expect(state.scenario.mapLinks?.map((link) => link.id)).toEqual([
      "cave-entry-link",
      "teleport-entry-link",
      "cavern-exit-link",
      "cavern-shortcut-exit"
    ]);
  });

  test("linked-map exit definitions preserve distinct return destinations", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const exitLinks = state.scenario.mapLinks?.filter((link) => link.triggerKind === "exit") ?? [];

    expect(exitLinks).toHaveLength(2);
    expect(exitLinks.map((link) => link.destinationMapId)).toEqual(["surface", "surface"]);
    expect(exitLinks.map((link) => link.destinationPosition)).toEqual([
      { x: 21, y: 30 },
      { x: 12, y: 10 }
    ]);
  });

  test("linked-map travel state starts on the main map and tracks history within one session", () => {
    const state = createInitialState("advanced-terrain-scenario");

    state.mapTravelState.travelHistory.push("cave-entry-link", "cavern-exit-link");

    expect(state.mapTravelState.activeMapId).toBe("surface");
    expect(state.mapTravelState.lastMapId).toBeNull();
    expect(state.mapTravelState.lastTravelLinkId).toBeNull();
    expect(state.mapTravelState.travelHistory).toEqual(["cave-entry-link", "cavern-exit-link"]);
  });

  test("exit links must start on traversable tiles", () => {
    const state = createInitialState("submap-expedition-scenario");
    const cavernMap = state.scenario.worldMaps?.find((worldMap) => worldMap.id === "echo-cavern");
    const exitLink = state.scenario.mapLinks?.find((link) => link.id === "cavern-surface-exit");
    if (!cavernMap || !exitLink) {
      throw new Error("Submap expedition exit setup was not available.");
    }

    cavernMap.terrainRegions = [
      ...(cavernMap.terrainRegions ?? []),
      { id: "forced-water", terrainType: "lakes", priority: 50, coverage: { kind: "rect", x: 3, y: 1, width: 1, height: 1 } }
    ];
    state.scenario.terrainRegions = cavernMap.terrainRegions;

    expect(() => validateScenario(state.scenario)).toThrow("Exit link cavern-surface-exit must start on a traversable tile.");
  });

  test("returning to the menu clears the active session identity", () => {
    const state = createInitialState();

    returnToMainMenu(state);

    expect(state.sceneMode).toBe("menu");
    expect(state.activeScenarioId).toBeNull();
    expect(state.selectedHeroId).toBeNull();
    expect(state.mapTravelState.activeMapId).toBe("main-map");
  });
});
