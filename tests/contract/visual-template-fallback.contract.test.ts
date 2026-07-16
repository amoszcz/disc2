import { describe, expect, test } from "vitest";
import type { VisualTemplateCatalog } from "../../src/render/sprites/visualTemplateCatalog";
import { resolveVisualTemplate } from "../../src/render/sprites/visualTemplateResolver";
import { visualTemplateCatalog } from "../../src/render/sprites/visualTemplateCatalog";

describe("visual template fallback contract", () => {
  test("reports fallback resolution when a dedicated template mapping is absent", () => {
    const catalog = structuredClone(visualTemplateCatalog) as VisualTemplateCatalog;
    delete catalog.heroTemplates.Aren;

    const resolved = resolveVisualTemplate({ subjectKind: "hero", subjectType: "Aren", sceneContext: "map" }, catalog);

    expect(resolved.assetKind).toBe("fallback");
    expect(resolved.isFallback).toBe(true);
    expect(resolved.templateId).toBe("fallback-hero");
  });
});
