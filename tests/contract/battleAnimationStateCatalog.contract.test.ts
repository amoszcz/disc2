import { describe, expect, test } from "vitest";
import { visualTemplateCatalog } from "../../src/render/sprites/visualTemplateCatalog";
import { resolveUnitVisualTemplate } from "../../src/render/sprites/visualTemplateResolver";

describe("battle animation state catalog", () => {
  test("maps current unit roles to supported battle state subsets", () => {
    expect(visualTemplateCatalog.unitStateProfiles.Militia.supportedStateNames).toContain("attack");
    expect(visualTemplateCatalog.unitStateProfiles.Archer.supportedStateNames).toContain("shoot");
    expect(visualTemplateCatalog.unitStateProfiles.Mage.supportedStateNames).toContain("cast");
  });

  test("falls back to idle when a unit requests an unsupported battle state", () => {
    const resolved = resolveUnitVisualTemplate({ name: "Militia" }, "battle", "shoot" as never);

    expect(resolved.requestedStateName).toBe("shoot");
    expect(resolved.resolvedStateName).toBe("idle");
  });
});
