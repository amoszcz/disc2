import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { visualTemplateCatalog } from "../../../src/render/sprites/visualTemplateCatalog";
import { getVisualTemplateDiagnostics } from "../../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "./renderTestContext";

const originalHeroTemplate = visualTemplateCatalog.heroTemplates.Aren;

describe("animation state fallback flow", () => {
  test("keeps a readable fallback when a hero state resolves without a dedicated template", () => {
    delete visualTemplateCatalog.heroTemplates.Aren;
    const state = createInitialState("core-map-loop");
    renderMapScene(createMockCanvasContext(), state);

    expect(
      getVisualTemplateDiagnostics().map.find((entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren")
    ).toMatchObject({
      assetKind: "fallback",
      isFallback: true
    });

    visualTemplateCatalog.heroTemplates.Aren = originalHeroTemplate;
  });
});
