import type {
  BattleUnitAnimationStateName,
  FacingDirection,
  GuardedLocation,
  HeroAnimationStateName,
  HeroVisualStateRuntime,
  ObjectAnimationStateName,
  ResourcePickup,
  ResourceType,
  ScenarioHero,
  ScenarioUnit,
  StorybookPreviewSubject,
  StorybookSubjectSelection,
  TerrainTypeName,
  VisualFallbackStyle,
  VisualSceneContext,
  VisualSubjectDescriptor,
  VisualTemplateDefinition,
  VisualTemplateResolverResult
} from "../../engine/scenario/types";
import { getVisualTemplateCatalog, type VisualTemplateCatalog } from "./visualTemplateCatalog";
import { getDefaultVisualTemplateId } from "./visualTemplateConfig";
import { getTemplateFrame, getTemplateSheetDimensions } from "./visualTemplateRegistry";

let activeVisualTemplateId = getDefaultVisualTemplateId();
export function setActiveVisualTemplateId(templateId: string): void { activeVisualTemplateId = templateId; }
export function getActiveVisualTemplateId(): string { return activeVisualTemplateId; }
function activeCatalog(): VisualTemplateCatalog { return getVisualTemplateCatalog(activeVisualTemplateId); }

export const VISUAL_TEMPLATE_INVALIDATE_EVENT = "disc2:visual-template-invalidate";

interface TemplateBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

const QUEUE_THUMBNAIL_SIZE = 48;
const DEFAULT_SHEET_WIDTH = 1536;
const DEFAULT_SHEET_HEIGHT = 1024;

export function createVisualTemplateThumbnailMarkup(resolvedTemplate: VisualTemplateResolverResult, label: string): string {
  const frame = resolvedTemplate.spriteFrame;
  if (resolvedTemplate.assetKind === "dedicated" && resolvedTemplate.assetSource && frame) {
    const scale = QUEUE_THUMBNAIL_SIZE / Math.max(frame.sourceWidth, frame.sourceHeight);
    // Atlas sizes differ between selectable templates. Using the default-sheet
    // dimensions here misaligned the high-resolution queue portraits even
    // though their canvas rendering used the correct frame coordinates.
    const sheet = getTemplateSheetDimensions(activeVisualTemplateId);
    const backgroundWidth = Math.round((sheet?.width ?? DEFAULT_SHEET_WIDTH) * scale);
    const backgroundHeight = Math.round((sheet?.height ?? DEFAULT_SHEET_HEIGHT) * scale);
    const offsetX = Math.round(frame.sourceX * scale);
    const offsetY = Math.round(frame.sourceY * scale);
    return `<span class="visual-template-thumbnail dedicated" data-testid="queue-unit-template" aria-hidden="true" style="background-image:url('${resolvedTemplate.assetSource}');background-size:${backgroundWidth}px ${backgroundHeight}px;background-position:-${offsetX}px -${offsetY}px"></span>`;
  }

  const fallback = resolvedTemplate.fallbackStyle;
  return `<span class="visual-template-thumbnail fallback" data-testid="queue-unit-template" aria-hidden="true" style="--template-fill:${fallback.fillColor};--template-accent:${fallback.accentColor ?? fallback.fillColor};--template-border:${fallback.borderColor ?? fallback.accentColor ?? "#23170d"};--template-text:${fallback.textColor ?? "#23170d"}">${fallback.glyph ?? label.slice(0, 1)}</span>`;
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
  requestedStateName: string | null;
  resolvedStateName: string | null;
  stateDirection: FacingDirection | null;
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
    requestedStateName: null,
    resolvedStateName: null,
    stateDirection: null,
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
    const mappedFrame = getTemplateFrame(activeVisualTemplateId, template.templateId, null, null);
    return {
      templateId: template.templateId,
      resolvedFrom: `${subject.subjectKind}:${subject.subjectType}`,
      assetKind: template.assetKind,
      assetSource: template.assetSource,
      spriteFrame: mappedFrame ?? template.spriteFrame ?? null,
      requestedStateName: null,
      resolvedStateName: null,
      stateDirection: null,
      fallbackStyle: template.fallbackStyle,
      readabilityLabel: template.readabilityLabel,
      intendedContexts: template.intendedContexts,
      isFallback: template.assetKind === "fallback"
    };
  }

  return getFallbackTemplate(catalog, subject.subjectKind, subject.sceneContext);
}

function withResolvedState(
  resolvedTemplate: VisualTemplateResolverResult,
  requestedStateName: string,
  resolvedStateName: string,
  stateDirection: FacingDirection | null = null
): VisualTemplateResolverResult {
  const mappedFrame = getTemplateFrame(activeVisualTemplateId, resolvedTemplate.templateId, resolvedStateName, stateDirection);
  return {
    ...resolvedTemplate,
    requestedStateName,
    resolvedStateName,
    stateDirection,
    spriteFrame: mappedFrame ?? resolvedTemplate.spriteFrame
  };
}

function resolveHeroState(
  hero: Pick<ScenarioHero, "name">,
  visualState: HeroVisualStateRuntime | undefined,
  catalog: VisualTemplateCatalog
): { requestedStateName: HeroAnimationStateName; resolvedStateName: HeroAnimationStateName; stateDirection: FacingDirection } {
  const profile = catalog.heroStateProfiles[hero.name];
  const defaultDirection = profile?.defaultDirection ?? "down";
  const requestedStateName = visualState?.stateName ?? profile?.fallbackStateName ?? "idle";
  const resolvedStateName = profile
    ? [...profile.directionalStateNames, ...profile.eventStateNames].includes(requestedStateName)
      ? requestedStateName
      : profile.fallbackStateName
    : requestedStateName;
  return {
    requestedStateName,
    resolvedStateName,
    stateDirection: visualState?.direction ?? defaultDirection
  };
}

function resolveUnitState(
  unit: Pick<ScenarioUnit, "name">,
  stateName: BattleUnitAnimationStateName | undefined,
  catalog: VisualTemplateCatalog
): { requestedStateName: BattleUnitAnimationStateName; resolvedStateName: BattleUnitAnimationStateName } {
  const profile = catalog.unitStateProfiles[unit.name];
  const requestedStateName = stateName ?? profile?.fallbackStateName ?? "idle";
  const resolvedStateName = profile?.supportedStateNames.includes(requestedStateName) ? requestedStateName : profile?.fallbackStateName ?? "idle";
  return { requestedStateName, resolvedStateName };
}

function resolveObjectState(
  stateName: ObjectAnimationStateName | undefined,
  supportedStates: ObjectAnimationStateName[] | undefined,
  fallbackStateName: ObjectAnimationStateName | undefined
): { requestedStateName: ObjectAnimationStateName; resolvedStateName: ObjectAnimationStateName } {
  const requestedStateName = stateName ?? fallbackStateName ?? "idle";
  const resolvedStateName = supportedStates?.includes(requestedStateName) ? requestedStateName : fallbackStateName ?? "idle";
  return { requestedStateName, resolvedStateName };
}

export function resolveVisualTemplate(
  subject: VisualSubjectDescriptor,
  catalog: VisualTemplateCatalog = activeCatalog()
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
  stateName?: BattleUnitAnimationStateName,
  catalog: VisualTemplateCatalog = activeCatalog()
): VisualTemplateResolverResult {
  const resolvedTemplate = resolveVisualTemplate({ subjectKind: "unit", subjectType: unit.name, sceneContext }, catalog);
  const resolvedState = resolveUnitState(unit, stateName, catalog);
  return withResolvedState(resolvedTemplate, resolvedState.requestedStateName, resolvedState.resolvedStateName);
}

export function resolveHeroVisualTemplate(
  hero: Pick<ScenarioHero, "name">,
  visualState?: HeroVisualStateRuntime,
  catalog: VisualTemplateCatalog = activeCatalog()
): VisualTemplateResolverResult {
  const resolvedTemplate = resolveVisualTemplate({ subjectKind: "hero", subjectType: hero.name, sceneContext: "map" }, catalog);
  const resolvedState = resolveHeroState(hero, visualState, catalog);
  return withResolvedState(
    resolvedTemplate,
    resolvedState.requestedStateName,
    resolvedState.resolvedStateName,
    resolvedState.stateDirection
  );
}

export function resolveMovementObjectVisualTemplate(
  objectType: string,
  stateName?: ObjectAnimationStateName,
  catalog: VisualTemplateCatalog = activeCatalog()
): VisualTemplateResolverResult {
  const resolvedTemplate = resolveVisualTemplate({ subjectKind: "movement-object", subjectType: objectType, sceneContext: "map" }, catalog);
  const profile = catalog.movementObjectStateProfiles[objectType];
  const resolvedState = resolveObjectState(stateName, profile?.supportedStateNames, profile?.fallbackStateName);
  return withResolvedState(resolvedTemplate, resolvedState.requestedStateName, resolvedState.resolvedStateName);
}

export function resolveGuardedLocationVisualTemplate(
  location: Pick<GuardedLocation, "locationType" | "accessState">,
  stateName?: ObjectAnimationStateName,
  catalog: VisualTemplateCatalog = activeCatalog()
): VisualTemplateResolverResult {
  const subjectType = `${location.locationType}:${location.accessState}`;
  const resolvedTemplate = resolveVisualTemplate(
    { subjectKind: "guarded-location", subjectType: `${location.locationType}:${location.accessState}`, sceneContext: "map" },
    catalog
  );
  const profile = catalog.guardedLocationStateProfiles[subjectType];
  const resolvedState = resolveObjectState(stateName ?? (location.accessState === "blocked" ? "blocked" : "open"), profile?.supportedStateNames, profile?.fallbackStateName);
  return withResolvedState(resolvedTemplate, resolvedState.requestedStateName, resolvedState.resolvedStateName);
}

export function resolveTerrainVisualTemplate(
  terrainType: TerrainTypeName,
  catalog: VisualTemplateCatalog = activeCatalog()
): VisualTemplateResolverResult {
  return resolveVisualTemplate({ subjectKind: "terrain", subjectType: terrainType, sceneContext: "map" }, catalog);
}

export function resolveResourcePickupVisualTemplate(
  pickup: Pick<ResourcePickup, "resourceType">,
  catalog: VisualTemplateCatalog = activeCatalog()
): VisualTemplateResolverResult {
  return resolveVisualTemplate({ subjectKind: "resource-pickup", subjectType: pickup.resourceType, sceneContext: "map" }, catalog);
}

export function resolveStorybookPreviewTemplate(
  subject: StorybookPreviewSubject,
  selection: StorybookSubjectSelection,
  catalog: VisualTemplateCatalog = activeCatalog()
): VisualTemplateResolverResult {
  switch (subject.subjectKind) {
    case "hero":
      return resolveHeroVisualTemplate(
        { name: subject.subjectType },
        {
          stateName: selection.stateName as HeroAnimationStateName,
          direction: selection.direction ?? subject.defaultDirection ?? "down"
        },
        catalog
      );
    case "unit":
      return resolveUnitVisualTemplate(
        { name: subject.subjectType },
        subject.sceneContext,
        selection.stateName as BattleUnitAnimationStateName,
        catalog
      );
    case "movement-object":
      return resolveMovementObjectVisualTemplate(subject.subjectType, selection.stateName as ObjectAnimationStateName, catalog);
    case "guarded-location": {
      const [locationType, accessState] = subject.subjectType.split(":");
      return resolveGuardedLocationVisualTemplate(
        {
          locationType: locationType as GuardedLocation["locationType"],
          accessState: accessState as GuardedLocation["accessState"]
        },
        selection.stateName as ObjectAnimationStateName,
        catalog
      );
    }
    default:
      return getFallbackTemplate(catalog, "movement-object", "map");
  }
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
    requestedStateName: resolvedTemplate.requestedStateName ?? null,
    resolvedStateName: resolvedTemplate.resolvedStateName ?? null,
    stateDirection: resolvedTemplate.stateDirection ?? null,
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
