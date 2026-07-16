import type {
  GuardedLocation,
  ResourcePickup,
  ResourceType,
  ScenarioHero,
  ScenarioUnit,
  TerrainTypeName,
  VisualFallbackStyle,
  VisualSceneContext,
  VisualSubjectDescriptor,
  VisualTemplateDefinition,
  VisualTemplateResolverResult
} from "../../engine/scenario/types";
import { visualTemplateCatalog, type VisualTemplateCatalog } from "./visualTemplateCatalog";

export const VISUAL_TEMPLATE_INVALIDATE_EVENT = "disc2:visual-template-invalidate";

interface TemplateBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getContainedBounds(
  bounds: TemplateBounds,
  sourceWidth: number,
  sourceHeight: number,
  verticalAlign: "center" | "bottom" = "center"
): TemplateBounds {
  const scale = Math.min(bounds.width / sourceWidth, bounds.height / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const x = bounds.x + (bounds.width - width) / 2;
  const y = verticalAlign === "bottom" ? bounds.y + bounds.height - height : bounds.y + (bounds.height - height) / 2;
  return { x, y, width, height };
}

interface RenderDiagnosticEntry {
  subjectKind: VisualSubjectDescriptor["subjectKind"];
  subjectType: string;
  sceneContext: VisualSceneContext;
  templateId: string;
  assetKind: VisualTemplateResolverResult["assetKind"];
  isFallback: boolean;
}

const imageCache = new Map<string, HTMLImageElement | null>();
const imageStatus = new Map<string, "loading" | "loaded" | "error">();
const diagnostics: Record<VisualSceneContext, RenderDiagnosticEntry[]> = {
  map: [],
  battle: []
};

function getFallbackTemplate(
  catalog: VisualTemplateCatalog,
  subjectKind: VisualSubjectDescriptor["subjectKind"],
  sceneContext: VisualSceneContext
): VisualTemplateResolverResult {
  const fallback = catalog.fallbackTemplates[subjectKind];
  return {
    templateId: fallback.templateId,
    resolvedFrom: `${subjectKind}:fallback`,
    assetKind: "fallback",
    assetSource: null,
    spriteFrame: null,
    fallbackStyle: fallback.fallbackStyle,
    readabilityLabel: fallback.readabilityLabel,
    intendedContexts: fallback.intendedContexts.includes(sceneContext) ? fallback.intendedContexts : [sceneContext],
    isFallback: true
  };
}

function toResolvedTemplate(
  subject: VisualSubjectDescriptor,
  template: VisualTemplateDefinition | undefined,
  catalog: VisualTemplateCatalog
): VisualTemplateResolverResult {
  if (!template) {
    return getFallbackTemplate(catalog, subject.subjectKind, subject.sceneContext);
  }

  if (template.intendedContexts.includes(subject.sceneContext)) {
    return {
      templateId: template.templateId,
      resolvedFrom: `${subject.subjectKind}:${subject.subjectType}`,
      assetKind: template.assetKind,
      assetSource: template.assetSource,
      spriteFrame: template.spriteFrame ?? null,
      fallbackStyle: template.fallbackStyle,
      readabilityLabel: template.readabilityLabel,
      intendedContexts: template.intendedContexts,
      isFallback: template.assetKind === "fallback"
    };
  }

  return getFallbackTemplate(catalog, subject.subjectKind, subject.sceneContext);
}

export function resolveVisualTemplate(
  subject: VisualSubjectDescriptor,
  catalog: VisualTemplateCatalog = visualTemplateCatalog
): VisualTemplateResolverResult {
  switch (subject.subjectKind) {
    case "unit":
      return toResolvedTemplate(subject, catalog.unitTemplates[subject.subjectType], catalog);
    case "hero":
      return toResolvedTemplate(subject, catalog.heroTemplates[subject.subjectType], catalog);
    case "movement-object":
      return toResolvedTemplate(subject, catalog.movementObjectTemplates[subject.subjectType], catalog);
    case "guarded-location":
      return toResolvedTemplate(subject, catalog.guardedLocationTemplates[subject.subjectType], catalog);
    case "terrain":
      return toResolvedTemplate(subject, catalog.terrainTemplates[subject.subjectType as TerrainTypeName], catalog);
    case "resource-pickup":
      return toResolvedTemplate(subject, catalog.resourcePickupTemplates[subject.subjectType as ResourceType], catalog);
    default:
      return getFallbackTemplate(catalog, "terrain", subject.sceneContext);
  }
}

export function resolveUnitVisualTemplate(
  unit: Pick<ScenarioUnit, "name">,
  sceneContext: VisualSceneContext,
  catalog: VisualTemplateCatalog = visualTemplateCatalog
): VisualTemplateResolverResult {
  return resolveVisualTemplate({ subjectKind: "unit", subjectType: unit.name, sceneContext }, catalog);
}

export function resolveHeroVisualTemplate(
  hero: Pick<ScenarioHero, "name">,
  catalog: VisualTemplateCatalog = visualTemplateCatalog
): VisualTemplateResolverResult {
  return resolveVisualTemplate({ subjectKind: "hero", subjectType: hero.name, sceneContext: "map" }, catalog);
}

export function resolveMovementObjectVisualTemplate(
  objectType: string,
  catalog: VisualTemplateCatalog = visualTemplateCatalog
): VisualTemplateResolverResult {
  return resolveVisualTemplate({ subjectKind: "movement-object", subjectType: objectType, sceneContext: "map" }, catalog);
}

export function resolveGuardedLocationVisualTemplate(
  location: Pick<GuardedLocation, "locationType" | "accessState">,
  catalog: VisualTemplateCatalog = visualTemplateCatalog
): VisualTemplateResolverResult {
  return resolveVisualTemplate(
    { subjectKind: "guarded-location", subjectType: `${location.locationType}:${location.accessState}`, sceneContext: "map" },
    catalog
  );
}

export function resolveTerrainVisualTemplate(
  terrainType: TerrainTypeName,
  catalog: VisualTemplateCatalog = visualTemplateCatalog
): VisualTemplateResolverResult {
  return resolveVisualTemplate({ subjectKind: "terrain", subjectType: terrainType, sceneContext: "map" }, catalog);
}

export function resolveResourcePickupVisualTemplate(
  pickup: Pick<ResourcePickup, "resourceType">,
  catalog: VisualTemplateCatalog = visualTemplateCatalog
): VisualTemplateResolverResult {
  return resolveVisualTemplate({ subjectKind: "resource-pickup", subjectType: pickup.resourceType, sceneContext: "map" }, catalog);
}

function syncDiagnosticsToWindow(): void {
  if (typeof window === "undefined") {
    return;
  }

  (window as Window & { __visualTemplateDiagnostics?: Record<VisualSceneContext, RenderDiagnosticEntry[]> }).__visualTemplateDiagnostics = {
    map: [...diagnostics.map],
    battle: [...diagnostics.battle]
  };
}

export function resetVisualTemplateDiagnostics(sceneContext: VisualSceneContext): void {
  diagnostics[sceneContext] = [];
  syncDiagnosticsToWindow();
}

export function recordVisualTemplateDiagnostic(
  subject: VisualSubjectDescriptor,
  resolvedTemplate: VisualTemplateResolverResult
): void {
  diagnostics[subject.sceneContext].push({
    subjectKind: subject.subjectKind,
    subjectType: subject.subjectType,
    sceneContext: subject.sceneContext,
    templateId: resolvedTemplate.templateId,
    assetKind: resolvedTemplate.assetKind,
    isFallback: resolvedTemplate.isFallback
  });
  syncDiagnosticsToWindow();
}

export function getVisualTemplateDiagnostics(): Record<VisualSceneContext, RenderDiagnosticEntry[]> {
  return {
    map: [...diagnostics.map],
    battle: [...diagnostics.battle]
  };
}

function dispatchInvalidateEvent(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(VISUAL_TEMPLATE_INVALIDATE_EVENT));
  }
}

function getTemplateImage(assetSource: string | null): HTMLImageElement | null {
  if (!assetSource || typeof Image === "undefined") {
    return null;
  }

  const cachedImage = imageCache.get(assetSource);
  const cachedStatus = imageStatus.get(assetSource);
  if (cachedImage && cachedStatus === "loaded") {
    return cachedImage;
  }

  if (!cachedImage && cachedStatus !== "loading") {
    const image = new Image();
    imageStatus.set(assetSource, "loading");
    image.onload = () => {
      imageStatus.set(assetSource, "loaded");
      imageCache.set(assetSource, image);
      dispatchInvalidateEvent();
    };
    image.onerror = () => {
      imageStatus.set(assetSource, "error");
      imageCache.set(assetSource, null);
      dispatchInvalidateEvent();
    };
    image.src = assetSource;
    imageCache.set(assetSource, image);
  }

  return null;
}

function drawFallbackGlyph(
  context: CanvasRenderingContext2D,
  fallbackStyle: VisualFallbackStyle,
  bounds: TemplateBounds
): void {
  if (!fallbackStyle.glyph) {
    return;
  }

  context.fillStyle = fallbackStyle.textColor ?? "#23170d";
  context.font = `bold ${Math.max(10, Math.floor(Math.min(bounds.width, bounds.height) * 0.28))}px Georgia`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(fallbackStyle.glyph, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  context.textAlign = "start";
  context.textBaseline = "alphabetic";
}

function drawFallbackShape(
  context: CanvasRenderingContext2D,
  fallbackStyle: VisualFallbackStyle,
  bounds: TemplateBounds
): void {
  context.save();
  context.fillStyle = fallbackStyle.fillColor;
  context.strokeStyle = fallbackStyle.borderColor ?? fallbackStyle.accentColor ?? "#23170d";
  context.lineWidth = Math.max(1, Math.floor(Math.min(bounds.width, bounds.height) * 0.05));

  switch (fallbackStyle.shape) {
    case "circle":
      context.beginPath();
      context.arc(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, Math.min(bounds.width, bounds.height) / 2, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      break;
    case "diamond":
      context.beginPath();
      context.moveTo(bounds.x + bounds.width / 2, bounds.y);
      context.lineTo(bounds.x + bounds.width, bounds.y + bounds.height / 2);
      context.lineTo(bounds.x + bounds.width / 2, bounds.y + bounds.height);
      context.lineTo(bounds.x, bounds.y + bounds.height / 2);
      context.closePath();
      context.fill();
      context.stroke();
      break;
    case "tile":
      context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      if (fallbackStyle.accentColor) {
        context.fillStyle = fallbackStyle.accentColor;
        context.fillRect(bounds.x, bounds.y, bounds.width, Math.max(2, Math.floor(bounds.height * 0.24)));
      }
      context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      break;
    case "slot":
      context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      if (fallbackStyle.accentColor) {
        context.fillStyle = fallbackStyle.accentColor;
        context.fillRect(bounds.x, bounds.y + bounds.height * 0.64, bounds.width, Math.max(3, Math.floor(bounds.height * 0.18)));
      }
      context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      break;
    case "rect":
    default:
      context.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      break;
  }

  drawFallbackGlyph(context, fallbackStyle, bounds);
  context.restore();
}

export function drawResolvedVisualTemplate(
  context: CanvasRenderingContext2D,
  resolvedTemplate: VisualTemplateResolverResult,
  bounds: TemplateBounds
): void {
  const image = resolvedTemplate.assetKind === "dedicated" ? getTemplateImage(resolvedTemplate.assetSource) : null;

  if (image) {
    if (resolvedTemplate.spriteFrame) {
      const destinationBounds =
        resolvedTemplate.fallbackStyle.shape === "tile"
          ? bounds
          : getContainedBounds(
              bounds,
              resolvedTemplate.spriteFrame.sourceWidth,
              resolvedTemplate.spriteFrame.sourceHeight,
              "bottom"
            );
      context.drawImage(
        image,
        resolvedTemplate.spriteFrame.sourceX,
        resolvedTemplate.spriteFrame.sourceY,
        resolvedTemplate.spriteFrame.sourceWidth,
        resolvedTemplate.spriteFrame.sourceHeight,
        destinationBounds.x,
        destinationBounds.y,
        destinationBounds.width,
        destinationBounds.height
      );
    } else {
      context.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height);
    }
    return;
  }

  drawFallbackShape(context, resolvedTemplate.fallbackStyle, bounds);
}
