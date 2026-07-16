import { describe, expect, test } from "vitest";
import { visualTemplateCatalog } from "../../src/render/sprites/visualTemplateCatalog";
import { resolveGuardedLocationVisualTemplate, resolveMovementObjectVisualTemplate } from "../../src/render/sprites/visualTemplateResolver";

describe("object animation state catalog", () => {
  test("defines meaningful required states for current movement objects and guarded locations", () => {
    expect(visualTemplateCatalog.movementObjectStateProfiles.teleport.requiredStateNames).toEqual(expect.arrayContaining(["idle", "active"]));
    expect(visualTemplateCatalog.guardedLocationStateProfiles["resource-site:blocked"].requiredStateNames).toContain("blocked");
  });

  test("resolves guarded-location and movement-object states through the shared catalog", () => {
    const teleport = resolveMovementObjectVisualTemplate("teleport", "active");
    const guarded = resolveGuardedLocationVisualTemplate({ locationType: "resource-site", accessState: "blocked" }, "blocked");

    expect(teleport.resolvedStateName).toBe("active");
    expect(guarded.resolvedStateName).toBe("blocked");
  });
});
