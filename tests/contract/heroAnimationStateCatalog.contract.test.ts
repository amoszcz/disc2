import { describe, expect, test } from "vitest";
import { visualTemplateCatalog } from "../../src/render/sprites/visualTemplateCatalog";
import { resolveHeroVisualTemplate } from "../../src/render/sprites/visualTemplateResolver";

describe("hero animation state catalog", () => {
  test("defines the required directional and event states for the current hero", () => {
    expect(visualTemplateCatalog.heroStateProfiles.Aren.requiredStateNames).toEqual(
      expect.arrayContaining(["idle", "start-move", "walk", "stop-move", "interact", "victory", "hurt", "perish"])
    );
  });

  test("resolves a directional hero state with the requested facing direction", () => {
    const resolved = resolveHeroVisualTemplate({ name: "Aren" }, { stateName: "start-move", direction: "up" });

    expect(resolved.resolvedStateName).toBe("start-move");
    expect(resolved.stateDirection).toBe("up");
  });
});
