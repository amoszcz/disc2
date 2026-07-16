import type { ResourceType, TerrainTypeName, VisualTemplateDefinition } from "../../engine/scenario/types";
import { visualFallbackGlyph, visualFallbackPalette } from "./placeholders";
import bridgeUrl from "./assets/object-bridge.svg";
import caveUrl from "./assets/object-cave.svg";
import exitUrl from "./assets/object-exit.svg";
import guardedBlockedUrl from "./assets/object-guarded-blocked.svg";
import guardedOpenUrl from "./assets/object-guarded-open.svg";
import milestoneUrl from "./assets/object-milestone.svg";
import pickupGoldUrl from "./assets/object-pickup-gold.svg";
import rubbleUrl from "./assets/object-rubble.svg";
import teleportUrl from "./assets/object-teleport.svg";
import heroArenUrl from "./assets/unit-hero-aren.svg";
import archerUrl from "./assets/unit-archer.svg";
import mageUrl from "./assets/unit-mage.svg";
import militiaUrl from "./assets/unit-militia.svg";
import skeletonArcherUrl from "./assets/unit-skeleton-archer.svg";
import skeletonUrl from "./assets/unit-skeleton.svg";
import stoneWatcherUrl from "./assets/unit-stone-watcher.svg";
import grassUrl from "./assets/tile-grass.svg";
import lakesUrl from "./assets/tile-lakes.svg";
import mountainsUrl from "./assets/tile-mountains.svg";
import mudUrl from "./assets/tile-mud.svg";
import plainsUrl from "./assets/tile-plains.svg";
import riversUrl from "./assets/tile-rivers.svg";
import roadUrl from "./assets/tile-road.svg";
import woodsUrl from "./assets/tile-woods.svg";

interface VisualTemplateCatalog {
  unitTemplates: Record<string, VisualTemplateDefinition>;
  heroTemplates: Record<string, VisualTemplateDefinition>;
  movementObjectTemplates: Record<string, VisualTemplateDefinition>;
  guardedLocationTemplates: Record<string, VisualTemplateDefinition>;
  terrainTemplates: Record<TerrainTypeName, VisualTemplateDefinition>;
  resourcePickupTemplates: Record<ResourceType, VisualTemplateDefinition>;
  fallbackTemplates: Record<string, VisualTemplateDefinition>;
}

function createTemplate(
  templateId: string,
  visualCategory: VisualTemplateDefinition["visualCategory"],
  assetSource: string,
  readabilityLabel: string,
  fallbackStyle: VisualTemplateDefinition["fallbackStyle"],
  intendedContexts: VisualTemplateDefinition["intendedContexts"]
): VisualTemplateDefinition {
  return {
    templateId,
    visualCategory,
    assetKind: "dedicated",
    assetSource,
    fallbackStyle,
    readabilityLabel,
    intendedContexts
  };
}

function createFallbackTemplate(
  templateId: string,
  visualCategory: VisualTemplateDefinition["visualCategory"],
  readabilityLabel: string,
  fallbackStyle: VisualTemplateDefinition["fallbackStyle"],
  intendedContexts: VisualTemplateDefinition["intendedContexts"]
): VisualTemplateDefinition {
  return {
    templateId,
    visualCategory,
    assetKind: "fallback",
    assetSource: null,
    fallbackStyle,
    readabilityLabel,
    intendedContexts
  };
}

export const visualTemplateCatalog: VisualTemplateCatalog = {
  unitTemplates: {
    Militia: createTemplate(
      "unit-militia",
      "unit",
      militiaUrl,
      "Militia",
      { fillColor: "#3466af", accentColor: "#f1d48b", borderColor: "#ffffff", textColor: "#ffffff", glyph: "M", shape: "slot" },
      ["battle"]
    ),
    Archer: createTemplate(
      "unit-archer",
      "unit",
      archerUrl,
      "Archer",
      { fillColor: "#5376cc", accentColor: "#d8e7ff", borderColor: "#ffffff", textColor: "#ffffff", glyph: "A", shape: "slot" },
      ["battle"]
    ),
    Mage: createTemplate(
      "unit-mage",
      "unit",
      mageUrl,
      "Mage",
      { fillColor: "#7d5bb6", accentColor: "#f3d2ff", borderColor: "#ffffff", textColor: "#ffffff", glyph: "Mg", shape: "slot" },
      ["battle"]
    ),
    Skeleton: createTemplate(
      "unit-skeleton",
      "unit",
      skeletonUrl,
      "Skeleton",
      { fillColor: "#7f7a77", accentColor: "#ebe2d2", borderColor: "#ffffff", textColor: "#ffffff", glyph: "S", shape: "slot" },
      ["battle"]
    ),
    "Skeleton Archer": createTemplate(
      "unit-skeleton-archer",
      "unit",
      skeletonArcherUrl,
      "Skeleton Archer",
      { fillColor: "#8b6d5a", accentColor: "#f2e5c6", borderColor: "#ffffff", textColor: "#ffffff", glyph: "SA", shape: "slot" },
      ["battle"]
    ),
    "Stone Watcher": createTemplate(
      "unit-stone-watcher",
      "unit",
      stoneWatcherUrl,
      "Stone Watcher",
      { fillColor: "#5e625e", accentColor: "#dbe7d6", borderColor: "#ffffff", textColor: "#ffffff", glyph: "SW", shape: "slot" },
      ["battle"]
    )
  },
  heroTemplates: {
    Aren: createTemplate(
      "hero-aren",
      "hero",
      heroArenUrl,
      "Aren",
      { fillColor: "#3466af", accentColor: "#f7ecd6", borderColor: "#ffffff", textColor: "#ffffff", glyph: "A", shape: "circle" },
      ["map"]
    )
  },
  movementObjectTemplates: {
    bridge: createTemplate(
      "object-bridge",
      "movement-object",
      bridgeUrl,
      "Bridge",
      { fillColor: "#f5f1dd", accentColor: "#8d6b48", borderColor: "#6f5e42", textColor: "#23170d", glyph: "=", shape: "rect" },
      ["map"]
    ),
    milestone: createTemplate(
      "object-milestone",
      "movement-object",
      milestoneUrl,
      "Milestone",
      { fillColor: "#fff4bf", accentColor: "#8a6b3f", borderColor: "#6f5e42", textColor: "#23170d", glyph: "+", shape: "diamond" },
      ["map"]
    ),
    rubble: createTemplate(
      "object-rubble",
      "movement-object",
      rubbleUrl,
      "Rubble",
      { fillColor: "#6a4f3b", accentColor: "#d8b59a", borderColor: "#4c3628", textColor: "#ffffff", glyph: "x", shape: "rect" },
      ["map"]
    ),
    cave: createTemplate(
      "object-cave",
      "movement-object",
      caveUrl,
      "Cave",
      { fillColor: "#70543b", accentColor: "#d0baa6", borderColor: "#4f3828", textColor: "#ffffff", glyph: "C", shape: "rect" },
      ["map"]
    ),
    teleport: createTemplate(
      "object-teleport",
      "movement-object",
      teleportUrl,
      "Teleport",
      { fillColor: "#7ec8e3", accentColor: "#eef8ff", borderColor: "#3b7e99", textColor: "#23170d", glyph: "T", shape: "diamond" },
      ["map"]
    ),
    exit: createTemplate(
      "object-exit",
      "movement-object",
      exitUrl,
      "Exit",
      { fillColor: "#d6f0c0", accentColor: "#4d7c37", borderColor: "#567b42", textColor: "#23170d", glyph: "E", shape: "diamond" },
      ["map"]
    )
  },
  guardedLocationTemplates: {
    "resource-site:blocked": createTemplate(
      "guarded-location-blocked",
      "guarded-location",
      guardedBlockedUrl,
      "Blocked guarded site",
      { fillColor: "#7a2d2d", accentColor: "#f3d0d0", borderColor: "#ffffff", textColor: "#ffffff", glyph: "G", shape: "rect" },
      ["map"]
    ),
    "resource-site:open": createTemplate(
      "guarded-location-open",
      "guarded-location",
      guardedOpenUrl,
      "Open guarded site",
      { fillColor: "#447748", accentColor: "#d7f1d9", borderColor: "#ffffff", textColor: "#ffffff", glyph: "O", shape: "rect" },
      ["map"]
    )
  },
  terrainTemplates: {
    road: createTemplate(
      "terrain-road",
      "terrain",
      roadUrl,
      "Road",
      { fillColor: "#c8b27a", accentColor: "#f2e3bf", borderColor: "#8a6b3f", textColor: "#23170d", shape: "tile" },
      ["map"]
    ),
    grass: createTemplate(
      "terrain-grass",
      "terrain",
      grassUrl,
      "Grass",
      { fillColor: "#a7c47f", accentColor: "#e3f2cd", borderColor: "#567b42", textColor: "#23170d", shape: "tile" },
      ["map"]
    ),
    plains: createTemplate(
      "terrain-plains",
      "terrain",
      plainsUrl,
      "Plains",
      { fillColor: "#d7c98b", accentColor: "#f6efcf", borderColor: "#8a6b3f", textColor: "#23170d", shape: "tile" },
      ["map"]
    ),
    mud: createTemplate(
      "terrain-mud",
      "terrain",
      mudUrl,
      "Mud",
      { fillColor: "#8f6a46", accentColor: "#c8ab8c", borderColor: "#5b432d", textColor: "#ffffff", shape: "tile" },
      ["map"]
    ),
    woods: createTemplate(
      "terrain-woods",
      "terrain",
      woodsUrl,
      "Woods",
      { fillColor: "#5e7b49", accentColor: "#d7e8c8", borderColor: "#3f5432", textColor: "#ffffff", shape: "tile" },
      ["map"]
    ),
    mountains: createTemplate(
      "terrain-mountains",
      "terrain",
      mountainsUrl,
      "Mountains",
      { fillColor: "#7b7b87", accentColor: "#e5e7ec", borderColor: "#555664", textColor: "#ffffff", shape: "tile" },
      ["map"]
    ),
    lakes: createTemplate(
      "terrain-lakes",
      "terrain",
      lakesUrl,
      "Lakes",
      { fillColor: "#6ca8d9", accentColor: "#d8efff", borderColor: "#3b6d99", textColor: "#23170d", shape: "tile" },
      ["map"]
    ),
    rivers: createTemplate(
      "terrain-rivers",
      "terrain",
      riversUrl,
      "Rivers",
      { fillColor: "#4f7db6", accentColor: "#d5e9ff", borderColor: "#2f5178", textColor: "#ffffff", shape: "tile" },
      ["map"]
    )
  },
  resourcePickupTemplates: {
    gold: createTemplate(
      "pickup-gold",
      "resource-pickup",
      pickupGoldUrl,
      "Gold pickup",
      { fillColor: "#d7a31d", accentColor: "#fff2b8", borderColor: "#8a6b3f", textColor: "#23170d", glyph: "$", shape: "circle" },
      ["map"]
    )
  },
  fallbackTemplates: {
    unit: createFallbackTemplate(
      "fallback-unit",
      "unit",
      "Fallback unit",
      { ...visualFallbackPalette.unit, glyph: visualFallbackGlyph.unit },
      ["battle"]
    ),
    hero: createFallbackTemplate(
      "fallback-hero",
      "hero",
      "Fallback hero",
      { ...visualFallbackPalette.hero, glyph: visualFallbackGlyph.hero },
      ["map"]
    ),
    "movement-object": createFallbackTemplate(
      "fallback-object",
      "movement-object",
      "Fallback map object",
      { ...visualFallbackPalette["movement-object"], glyph: visualFallbackGlyph["movement-object"] },
      ["map"]
    ),
    "guarded-location": createFallbackTemplate(
      "fallback-guarded-location",
      "guarded-location",
      "Fallback guarded location",
      { ...visualFallbackPalette["guarded-location"], glyph: visualFallbackGlyph["guarded-location"] },
      ["map"]
    ),
    terrain: createFallbackTemplate(
      "fallback-terrain",
      "terrain",
      "Fallback terrain",
      { ...visualFallbackPalette.terrain },
      ["map"]
    ),
    "resource-pickup": createFallbackTemplate(
      "fallback-resource-pickup",
      "resource-pickup",
      "Fallback resource pickup",
      { ...visualFallbackPalette["resource-pickup"], glyph: visualFallbackGlyph["resource-pickup"] },
      ["map"]
    )
  }
};

export type { VisualTemplateCatalog };
