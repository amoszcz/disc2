import { describe, expect, test } from "vitest";
import { getDefaultGameSettings, isImmediateMovementBehavior, normalizeGameSettings } from "../../src/app/state/gameSettings";

describe("game settings contract", () => {
  test("defaults to one-tile-per-second animated movement and the configured template", () => {
    expect(getDefaultGameSettings()).toEqual({ movementBehavior: "animated", visualTemplateId: "default-template" });
  });

  test("rejects malformed movement values and unavailable templates", () => {
    expect(normalizeGameSettings({ movementBehavior: "fast" as never, visualTemplateId: "missing" })).toEqual(getDefaultGameSettings());
    expect(normalizeGameSettings({ movementBehavior: "immediate", visualTemplateId: "wip-template" })).toEqual({ movementBehavior: "immediate", visualTemplateId: "wip-template" });
  });

  test("treats immediate as the exclusive synchronous route setting", () => {
    expect(isImmediateMovementBehavior("immediate")).toBe(true);
    expect(isImmediateMovementBehavior("animated")).toBe(false);
    expect(isImmediateMovementBehavior("future-non-immediate-setting")).toBe(false);
  });
});
