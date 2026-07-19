import { describe, expect, test } from "vitest";
import { getDefaultVisualTemplateId } from "../../src/render/sprites/visualTemplateConfig";
import { getReadyVisualTemplateSources, getVisualTemplateSource } from "../../src/render/sprites/visualTemplateRegistry";

describe("visual template catalog contract", () => {
  test("provides each same-name PNG/JSON pair once and configures a ready default", () => {
    const sources = getReadyVisualTemplateSources();
    expect(sources.map((source) => source.templateId)).toEqual(["default-template", "wip-template", "highres-template"]);
    expect(new Set(sources.map((source) => source.templateId)).size).toBe(sources.length);
    expect(getVisualTemplateSource(getDefaultVisualTemplateId())).toBeDefined();
    for (const source of sources) {
      expect(source.imageUrl).toContain(source.templateId);
      expect(source.mapUrl).toContain(source.templateId);
    }
    expect(getVisualTemplateSource("missing-template")).toBeUndefined();
  });
});
