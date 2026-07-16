import { describe, expect, test } from "vitest";
import {
  resolveGuardedLocationVisualTemplate,
  resolveHeroVisualTemplate,
  resolveMovementObjectVisualTemplate,
  resolveResourcePickupVisualTemplate,
  resolveTerrainVisualTemplate,
  resolveUnitVisualTemplate,
  resolveVisualTemplate
} from "../../src/render/sprites/visualTemplateResolver";

describe("visual template mapping contract", () => {
  test("resolves dedicated templates for current supported subjects", () => {
    expect(resolveUnitVisualTemplate({ name: "Militia" }, "battle")).toMatchObject({
      templateId: "unit-militia",
      assetKind: "dedicated",
      isFallback: false
    });
    expect(resolveHeroVisualTemplate({ name: "Aren" })).toMatchObject({
      templateId: "hero-aren",
      assetKind: "dedicated"
    });
    expect(resolveMovementObjectVisualTemplate("bridge")).toMatchObject({
      templateId: "object-bridge",
      assetKind: "dedicated"
    });
    expect(resolveGuardedLocationVisualTemplate({ locationType: "resource-site", accessState: "blocked" })).toMatchObject({
      templateId: "guarded-location-blocked",
      assetKind: "dedicated"
    });
    expect(resolveTerrainVisualTemplate("road")).toMatchObject({
      templateId: "terrain-road",
      assetKind: "dedicated"
    });
    expect(resolveResourcePickupVisualTemplate({ resourceType: "gold" })).toMatchObject({
      templateId: "pickup-gold",
      assetKind: "dedicated"
    });
  });

  test("falls back when a supported mapping is unavailable", () => {
    const resolved = resolveVisualTemplate({ subjectKind: "unit", subjectType: "Unknown", sceneContext: "battle" });

    expect(resolved.assetKind).toBe("fallback");
    expect(resolved.isFallback).toBe(true);
    expect(resolved.templateId).toBe("fallback-unit");
  });
});
