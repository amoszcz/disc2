import { describe, expect, test } from "vitest";
import { buildRouteAttempt } from "../../../src/engine/map/routeRules";
import { loadScenario } from "../../../src/engine/scenario/loadScenario";
import { createRouteFeedback } from "../../../src/engine/map/terrainFeedback";

describe("terrain route feedback", () => {
  test("describes legal movement cost using the destination terrain", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    const attempt = buildRouteAttempt(scenario, "hero-1", { x: 5, y: 10 }, { x: 6, y: 10 }, 8);
    const feedback = createRouteFeedback(attempt);

    expect(feedback.terrainLabel).toBe("Road");
    expect(feedback.movementImpact).toBe("1 movement");
    expect(feedback.blockedReason).toBeNull();
  });

  test("describes blocked terrain with an explicit reason", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    const attempt = buildRouteAttempt(scenario, "hero-1", { x: 19, y: 10 }, { x: 20, y: 10 }, 8);
    const feedback = createRouteFeedback(attempt);

    expect(feedback.terrainLabel).toBe("Rivers");
    expect(feedback.movementImpact).toBe("Blocked terrain");
    expect(feedback.blockedReason).toBe("rivers cannot be traversed.");
  });
});
