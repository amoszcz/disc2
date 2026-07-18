import { describe, expect, test } from "vitest";
import { createMockCanvasContext } from "./renderTestContext";
import {
  drawResolvedVisualTemplate,
  getVisualTemplateDiagnostics,
  recordVisualTemplateDiagnostic,
  resetVisualTemplateDiagnostics,
  resolveTerrainVisualTemplate
} from "../../../src/render/sprites/visualTemplateResolver";

describe("visual template resolver flow", () => {
  test("records render diagnostics through the shared resolver seam", () => {
    resetVisualTemplateDiagnostics("map");
    const resolved = resolveTerrainVisualTemplate("road");

    recordVisualTemplateDiagnostic({ subjectKind: "terrain", subjectType: "road", sceneContext: "map" }, resolved);

    expect(getVisualTemplateDiagnostics().map).toContainEqual(expect.objectContaining({
      subjectKind: "terrain",
      subjectType: "road",
      sceneContext: "map",
      templateId: "terrain-road",
      assetKind: "dedicated",
      isFallback: false
    }));
  });

  test("draws a fallback representation when a dedicated image is not yet loaded", () => {
    const resolved = resolveTerrainVisualTemplate("plains");

    expect(() =>
      drawResolvedVisualTemplate(createMockCanvasContext(), resolved, {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      })
    ).not.toThrow();
  });
});
