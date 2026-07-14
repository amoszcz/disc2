import { describe, expect, test } from "vitest";
import { buildRouteAttempt } from "../../../src/engine/map/routeRules";
import { createRouteFeedback } from "../../../src/engine/map/terrainFeedback";
import { loadScenario } from "../../../src/engine/scenario/loadScenario";

describe("movement object feedback flow", () => {
  test("explains when a bridge makes river movement legal", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    const attempt = buildRouteAttempt(scenario, "hero-1", { x: 19, y: 31 }, { x: 20, y: 31 }, 8);
    const feedback = createRouteFeedback(attempt);

    expect(feedback.objectLabels).toEqual(["Bridge"]);
    expect(feedback.passabilityExplanation).toBe("Bridge turns this river tile into a legal crossing.");
    expect(feedback.blockedReason).toBeNull();
  });

  test("explains combined movement-object results on stacked tiles", () => {
    const scenario = loadScenario("advanced-terrain-scenario");
    const attempt = buildRouteAttempt(scenario, "hero-1", { x: 19, y: 30 }, { x: 20, y: 30 }, 8);
    const feedback = createRouteFeedback(attempt);

    expect(feedback.objectLabels).toEqual(["Bridge", "Rubble"]);
    expect(feedback.movementDeltaExplanation).toBe("Movement increased by 1.");
    expect(feedback.stackExplanation).toBe("Bridge + Rubble combine for a final cost of 2.");
  });
});
