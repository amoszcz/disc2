import type {
  ResourceType,
  TerrainTypeName,
  VisualSpriteFrame,
  VisualTemplateDefinition
} from "../../engine/scenario/types";
import { visualFallbackGlyph, visualFallbackPalette } from "./placeholders";
import guardedOpenUrl from "./assets/object-guarded-open.svg";
import pickupGoldUrl from "./assets/object-pickup-gold.svg";
import generatedAssetSheetUrl from "./assets/generated-asset-sheet.png";

interface VisualTemplateCatalog {
  unitTemplates: Record<string, VisualTemplateDefinition>;
  heroTemplates: Record<string, VisualTemplateDefinition>;
  movementObjectTemplates: Record<string, VisualTemplateDefinition>;
  guardedLocationTemplates: Record<string, VisualTemplateDefinition>;
  terrainTemplates: Record<TerrainTypeName, VisualTemplateDefinition>;
  resourcePickupTemplates: Record<ResourceType, VisualTemplateDefinition>;
  fallbackTemplates: Record<string, VisualTemplateDefinition>;
}

function spriteFrame(sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number): VisualSpriteFrame {
  return {
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight
  };
}

const UNIT_FRAMES = {
  militia: spriteFrame(194, 80, 154, 188),
  archer: spriteFrame(357, 98, 151, 170),
  mage: spriteFrame(515, 94, 152, 174),
  skeleton: spriteFrame(673, 99, 137, 169),
  skeletonArcher: spriteFrame(815, 99, 139, 169),
  stoneWatcher: spriteFrame(956, 89, 173, 180),
  aren: spriteFrame(1125, 88, 174, 181)
} as const;

const OBJECT_FRAMES = {
  bridge: spriteFrame(174, 332, 231, 100),
  milestone: spriteFrame(417, 299, 80, 132),
  rubble: spriteFrame(503, 286, 166, 146),
  cave: spriteFrame(663, 303, 151, 129),
  teleport: spriteFrame(813, 293, 153, 140),
  guardedBlocked: spriteFrame(973, 300, 170, 134),
  exit: spriteFrame(1143, 291, 143, 143)
} as const;

const TERRAIN_FRAMES = {
  road: spriteFrame(237, 475, 148, 130),
  grass: spriteFrame(406, 475, 148, 130),
  plains: spriteFrame(573, 475, 148, 130),
  mud: spriteFrame(908, 475, 150, 130),
  woods: spriteFrame(237, 641, 148, 128),
  mountains: spriteFrame(405, 641, 150, 128),
  lakes: spriteFrame(740, 641, 150, 128),
  rivers: spriteFrame(1078, 641, 151, 128)
} as const;

function createTemplate(
  templateId: string,
  visualCategory: VisualTemplateDefinition["visualCategory"],
  assetSource: string,
  readabilityLabel: string,
  fallbackStyle: VisualTemplateDefinition["fallbackStyle"],
  intendedContexts: VisualTemplateDefinition["intendedContexts"],
  frame?: VisualSpriteFrame
): VisualTemplateDefinition {
  return {
    templateId,
    visualCategory,
    assetKind: "dedicated",
    assetSource,
    spriteFrame: frame ?? null,
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
    spriteFrame: null,
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
      generatedAssetSheetUrl,
      "Militia",
      { fillColor: "#3466af", accentColor: "#f1d48b", borderColor: "#ffffff", textColor: "#ffffff", glyph: "M", shape: "slot" },
      ["battle"],
      UNIT_FRAMES.militia
    ),
    Archer: createTemplate(
      "unit-archer",
      "unit",
      generatedAssetSheetUrl,
      "Archer",
      { fillColor: "#5376cc", accentColor: "#d8e7ff", borderColor: "#ffffff", textColor: "#ffffff", glyph: "A", shape: "slot" },
      ["battle"],
      UNIT_FRAMES.archer
    ),
    Mage: createTemplate(
      "unit-mage",
      "unit",
      generatedAssetSheetUrl,
      "Mage",
      { fillColor: "#7d5bb6", accentColor: "#f3d2ff", borderColor: "#ffffff", textColor: "#ffffff", glyph: "Mg", shape: "slot" },
      ["battle"],
      UNIT_FRAMES.mage
    ),
    Skeleton: createTemplate(
      "unit-skeleton",
      "unit",
      generatedAssetSheetUrl,
      "Skeleton",
      { fillColor: "#7f7a77", accentColor: "#ebe2d2", borderColor: "#ffffff", textColor: "#ffffff", glyph: "S", shape: "slot" },
      ["battle"],
      UNIT_FRAMES.skeleton
    ),
    "Skeleton Archer": createTemplate(
      "unit-skeleton-archer",
      "unit",
      generatedAssetSheetUrl,
      "Skeleton Archer",
      { fillColor: "#8b6d5a", accentColor: "#f2e5c6", borderColor: "#ffffff", textColor: "#ffffff", glyph: "SA", shape: "slot" },
      ["battle"],
      UNIT_FRAMES.skeletonArcher
    ),
    "Stone Watcher": createTemplate(
      "unit-stone-watcher",
      "unit",
      generatedAssetSheetUrl,
      "Stone Watcher",
      { fillColor: "#5e625e", accentColor: "#dbe7d6", borderColor: "#ffffff", textColor: "#ffffff", glyph: "SW", shape: "slot" },
      ["battle"],
      UNIT_FRAMES.stoneWatcher
    )
  },
  heroTemplates: {
    Aren: createTemplate(
      "hero-aren",
      "hero",
      generatedAssetSheetUrl,
      "Aren",
      { fillColor: "#3466af", accentColor: "#f7ecd6", borderColor: "#ffffff", textColor: "#ffffff", glyph: "A", shape: "circle" },
      ["map"],
      UNIT_FRAMES.aren
    )
  },
  movementObjectTemplates: {
    bridge: createTemplate(
      "object-bridge",
      "movement-object",
      generatedAssetSheetUrl,
      "Bridge",
      { fillColor: "#f5f1dd", accentColor: "#8d6b48", borderColor: "#6f5e42", textColor: "#23170d", glyph: "=", shape: "rect" },
      ["map"],
      OBJECT_FRAMES.bridge
    ),
    milestone: createTemplate(
      "object-milestone",
      "movement-object",
      generatedAssetSheetUrl,
      "Milestone",
      { fillColor: "#fff4bf", accentColor: "#8a6b3f", borderColor: "#6f5e42", textColor: "#23170d", glyph: "+", shape: "diamond" },
      ["map"],
      OBJECT_FRAMES.milestone
    ),
    rubble: createTemplate(
      "object-rubble",
      "movement-object",
      generatedAssetSheetUrl,
      "Rubble",
      { fillColor: "#6a4f3b", accentColor: "#d8b59a", borderColor: "#4c3628", textColor: "#ffffff", glyph: "x", shape: "rect" },
      ["map"],
      OBJECT_FRAMES.rubble
    ),
    cave: createTemplate(
      "object-cave",
      "movement-object",
      generatedAssetSheetUrl,
      "Cave",
      { fillColor: "#70543b", accentColor: "#d0baa6", borderColor: "#4f3828", textColor: "#ffffff", glyph: "C", shape: "rect" },
      ["map"],
      OBJECT_FRAMES.cave
    ),
    teleport: createTemplate(
      "object-teleport",
      "movement-object",
      generatedAssetSheetUrl,
      "Teleport",
      { fillColor: "#7ec8e3", accentColor: "#eef8ff", borderColor: "#3b7e99", textColor: "#23170d", glyph: "T", shape: "diamond" },
      ["map"],
      OBJECT_FRAMES.teleport
    ),
    exit: createTemplate(
      "object-exit",
      "movement-object",
      generatedAssetSheetUrl,
      "Exit",
      { fillColor: "#d6f0c0", accentColor: "#4d7c37", borderColor: "#567b42", textColor: "#23170d", glyph: "E", shape: "diamond" },
      ["map"],
      OBJECT_FRAMES.exit
    )
  },
  guardedLocationTemplates: {
    "resource-site:blocked": createTemplate(
      "guarded-location-blocked",
      "guarded-location",
      generatedAssetSheetUrl,
      "Blocked guarded site",
      { fillColor: "#7a2d2d", accentColor: "#f3d0d0", borderColor: "#ffffff", textColor: "#ffffff", glyph: "G", shape: "rect" },
      ["map"],
      OBJECT_FRAMES.guardedBlocked
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
      generatedAssetSheetUrl,
      "Road",
      { fillColor: "#c8b27a", accentColor: "#f2e3bf", borderColor: "#8a6b3f", textColor: "#23170d", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.road
    ),
    grass: createTemplate(
      "terrain-grass",
      "terrain",
      generatedAssetSheetUrl,
      "Grass",
      { fillColor: "#a7c47f", accentColor: "#e3f2cd", borderColor: "#567b42", textColor: "#23170d", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.grass
    ),
    plains: createTemplate(
      "terrain-plains",
      "terrain",
      generatedAssetSheetUrl,
      "Plains",
      { fillColor: "#d7c98b", accentColor: "#f6efcf", borderColor: "#8a6b3f", textColor: "#23170d", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.plains
    ),
    mud: createTemplate(
      "terrain-mud",
      "terrain",
      generatedAssetSheetUrl,
      "Mud",
      { fillColor: "#8f6a46", accentColor: "#c8ab8c", borderColor: "#5b432d", textColor: "#ffffff", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.mud
    ),
    woods: createTemplate(
      "terrain-woods",
      "terrain",
      generatedAssetSheetUrl,
      "Woods",
      { fillColor: "#5e7b49", accentColor: "#d7e8c8", borderColor: "#3f5432", textColor: "#ffffff", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.woods
    ),
    mountains: createTemplate(
      "terrain-mountains",
      "terrain",
      generatedAssetSheetUrl,
      "Mountains",
      { fillColor: "#7b7b87", accentColor: "#e5e7ec", borderColor: "#555664", textColor: "#ffffff", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.mountains
    ),
    lakes: createTemplate(
      "terrain-lakes",
      "terrain",
      generatedAssetSheetUrl,
      "Lakes",
      { fillColor: "#6ca8d9", accentColor: "#d8efff", borderColor: "#3b6d99", textColor: "#23170d", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.lakes
    ),
    rivers: createTemplate(
      "terrain-rivers",
      "terrain",
      generatedAssetSheetUrl,
      "Rivers",
      { fillColor: "#4f7db6", accentColor: "#d5e9ff", borderColor: "#2f5178", textColor: "#ffffff", shape: "tile" },
      ["map"],
      TERRAIN_FRAMES.rivers
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
