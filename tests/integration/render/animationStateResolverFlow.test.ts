import { describe, expect, test } from "vitest";
import { resolveHeroVisualTemplate, resolveMovementObjectVisualTemplate, resolveUnitVisualTemplate } from "../../../src/render/sprites/visualTemplateResolver";

describe("animation state resolver flow", () => {
  test("resolves hero state and direction through the shared resolver seam", () => {
    const resolved = resolveHeroVisualTemplate({ name: "Aren" }, { stateName: "walk", direction: "right" });

    expect(resolved.requestedStateName).toBe("walk");
    expect(resolved.resolvedStateName).toBe("walk");
    expect(resolved.stateDirection).toBe("right");
  });

  test("resolves battle unit action states through the shared resolver seam", () => {
    const resolved = resolveUnitVisualTemplate({ name: "Archer" }, "battle", "shoot");

    expect(resolved.requestedStateName).toBe("shoot");
    expect(resolved.resolvedStateName).toBe("shoot");
  });

  test("falls back to an idle object state when an unsupported object state is requested", () => {
    const resolved = resolveMovementObjectVisualTemplate("bridge", "claimed");

    expect(resolved.requestedStateName).toBe("claimed");
    expect(resolved.resolvedStateName).toBe("idle");
  });
});
