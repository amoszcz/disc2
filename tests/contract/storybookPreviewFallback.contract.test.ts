import { describe, expect, test } from "vitest";
import { getStorybookPreviewSubjects, visualTemplateCatalog, type VisualTemplateCatalog } from "../../src/render/sprites/visualTemplateCatalog";
import { resolveStorybookPreviewTemplate } from "../../src/render/sprites/visualTemplateResolver";

describe("storybook preview fallback contract", () => {
  test("preview resolution falls back cleanly when a dedicated hero template is unavailable", () => {
    const catalog = structuredClone(visualTemplateCatalog) as VisualTemplateCatalog;
    delete catalog.heroTemplates.Aren;

    const subject = getStorybookPreviewSubjects(catalog).find((entry) => entry.subjectType === "Aren");
    if (!subject) {
      throw new Error("Aren storybook subject was not available.");
    }

    const resolved = resolveStorybookPreviewTemplate(
      subject,
      {
        stateName: "walk",
        direction: "right"
      },
      catalog
    );

    expect(resolved.isFallback).toBe(true);
    expect(resolved.assetKind).toBe("fallback");
    expect(resolved.requestedStateName).toBe("walk");
    expect(resolved.resolvedStateName).toBe("walk");
  });
});
