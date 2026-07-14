import { describe, expect, test } from "vitest";
import { loadScenario, validateScenario } from "../../src/engine/scenario/loadScenario";

describe("movement object format contract", () => {
  test("advanced terrain scenarios can author bridge, milestone, and rubble regions", () => {
    const scenario = loadScenario("advanced-terrain-scenario");

    expect(scenario.movementObjectRegions?.map((region) => region.objectType)).toEqual([
      "bridge",
      "milestone",
      "rubble",
      "rubble"
    ]);
  });

  test("bridge regions on non-river terrain fail validation", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    scenario.movementObjectRegions = [
      {
        id: "bad-bridge",
        objectType: "bridge",
        priority: 1,
        coverage: { kind: "rect", x: 5, y: 10, width: 1, height: 1 }
      }
    ];

    expect(() => validateScenario(scenario)).toThrow("Bridge region bad-bridge can only cover river tiles.");
  });
});
