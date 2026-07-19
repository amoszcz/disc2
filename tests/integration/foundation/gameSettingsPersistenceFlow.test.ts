import { describe, expect, test } from "vitest";
import { createMenuState, selectMovementBehavior, selectVisualTemplate, startScenarioSession } from "../../../src/app/state/gameState";

describe("game settings state flow", () => {
  test("preserves selected behavior and template across scenario starts", () => {
    const state = createMenuState();
    selectMovementBehavior(state, "immediate");
    selectVisualTemplate(state, "wip-template");
    startScenarioSession(state, "core-map-loop");

    expect(state.gameSettings.movementBehavior).toBe("immediate");
    expect(state.activeVisualTemplateId).toBe("wip-template");
  });
});
