import { describe, expect, test } from "vitest";
import { resolveMovementObjectStack } from "../../src/engine/map/movementObjectLookup";
import { resolveMovementTile } from "../../src/engine/map/movementObjectRules";
import { loadScenario } from "../../src/engine/scenario/loadScenario";

describe("movement object stacking contract", () => {
  test("resolves overlapping movement objects in deterministic priority order", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    const stack = resolveMovementObjectStack(scenario, { x: 20, y: 30 });

    expect(stack.objectTypes).toEqual(["bridge", "rubble"]);
    expect(stack.resolutionOrder).toEqual(["bridge-causeway", "rubble-bridge"]);
  });

  test("clamps reduced movement cost to a minimum of one", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    const tile = resolveMovementTile(scenario, { x: 7, y: 11 });

    expect(tile.movementObjects.objectTypes).toEqual(["milestone"]);
    expect(tile.movementCost).toBe(1);
  });
});
