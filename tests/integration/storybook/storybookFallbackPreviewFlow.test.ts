import { describe, expect, test } from "vitest";
import { createMenuState, openStorybook } from "../../../src/app/state/gameState";
import { renderStorybookScene, getStorybookPreviewDiagnostics } from "../../../src/render/canvas/renderStorybookScene";
import { visualTemplateCatalog } from "../../../src/render/sprites/visualTemplateCatalog";
import { createMockCanvasContext } from "../render/renderTestContext";

const originalHeroTemplate = visualTemplateCatalog.heroTemplates.Aren;

describe("storybook fallback preview flow", () => {
  test("storybook previews remain visible when a dedicated subject template is missing", () => {
    delete visualTemplateCatalog.heroTemplates.Aren;

    const state = createMenuState();
    openStorybook(state);
    renderStorybookScene(createMockCanvasContext(), state);

    expect(getStorybookPreviewDiagnostics().find((entry) => entry.subjectType === "Aren")).toMatchObject({
      isFallback: true,
      assetKind: "fallback"
    });

    visualTemplateCatalog.heroTemplates.Aren = originalHeroTemplate;
  });
});
