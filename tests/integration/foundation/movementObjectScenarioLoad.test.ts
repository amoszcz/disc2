import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { resolveMovementObjectStack } from "../../../src/engine/map/movementObjectLookup";
import { resolveMovementTile } from "../../../src/engine/map/movementObjectRules";
import { loadScenario, validateScenario } from "../../../src/engine/scenario/loadScenario";

describe("movement object scenario loading", () => {
  test("loads bridge and movement-cost regions into the advanced terrain scenario", () => {
    const scenario = loadScenario("advanced-terrain-scenario");

    expect(scenario.movementObjectRegions).toHaveLength(6);
    expect(resolveMovementObjectStack(scenario, { x: 20, y: 30 }).objectTypes).toEqual(["bridge", "rubble"]);
    expect(resolveMovementObjectStack(scenario, { x: 8, y: 10 }).objectTypes).toEqual(["cave"]);
    expect(resolveMovementObjectStack(scenario, { x: 12, y: 10 }).objectTypes).toEqual(["teleport"]);
    expect(resolveMovementTile(scenario, { x: 20, y: 31 }).isTraversable).toBe(true);
  });

  test("fails validation when a bridge covers non-river terrain", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    const surfaceMap = scenario.worldMaps?.find((worldMap) => worldMap.id === "surface");
    surfaceMap?.movementObjectRegions?.push({
      id: "invalid-bridge",
      objectType: "bridge",
      priority: 10,
      coverage: { kind: "rect", x: 10, y: 10, width: 1, height: 1 }
    });
    scenario.movementObjectRegions = surfaceMap?.movementObjectRegions;

    expect(() => validateScenario(scenario)).toThrow("Bridge region invalid-bridge can only cover river tiles.");
  });

  test("bootstraps movement-object scenarios through the normal state factory", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(state.scenario.movementObjectRegions?.some((region) => region.objectType === "bridge")).toBe(true);
    expect(state.routeFeedback).toBeNull();
  });
});
