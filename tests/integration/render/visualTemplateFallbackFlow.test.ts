import { afterEach, describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { visualTemplateCatalog } from "../../../src/render/sprites/visualTemplateCatalog";
import { getVisualTemplateDiagnostics } from "../../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "./renderTestContext";

const originalHeroTemplate = visualTemplateCatalog.heroTemplates.Aren;

describe("visual template fallback flow", () => {
  afterEach(() => {
    visualTemplateCatalog.heroTemplates.Aren = originalHeroTemplate;
  });

  test("falls back cleanly in a real scene when a dedicated hero template is unavailable", () => {
    delete visualTemplateCatalog.heroTemplates.Aren;
    const state = createInitialState();

    renderMapScene(createMockCanvasContext(), state);

    const heroDiagnostic = getVisualTemplateDiagnostics().map.find(
      (entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren"
    );

    expect(heroDiagnostic).toMatchObject({
      assetKind: "fallback",
      isFallback: true
    });
  });
});
