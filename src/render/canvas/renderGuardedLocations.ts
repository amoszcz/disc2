import type { GuardedLocation, MapDefinition, MapViewport } from "../../engine/scenario/types";
import {
  drawResolvedVisualTemplate,
  recordVisualTemplateDiagnostic,
  resolveGuardedLocationVisualTemplate
} from "../sprites/visualTemplateResolver";
import { worldTileToCanvasPoint } from "./viewportRender";

export function renderGuardedLocations(
  context: CanvasRenderingContext2D,
  tileSize: number,
  locations: GuardedLocation[],
  viewport: MapViewport,
  map: MapDefinition
): void {
  for (const location of locations) {
    const point = worldTileToCanvasPoint(location.mapPosition, viewport, context.canvas, map);
    const resolvedTemplate = resolveGuardedLocationVisualTemplate(location, location.accessState === "blocked" ? "blocked" : "open");
    recordVisualTemplateDiagnostic(
      { subjectKind: "guarded-location", subjectType: `${location.locationType}:${location.accessState}`, sceneContext: "map" },
      resolvedTemplate
    );
    drawResolvedVisualTemplate(context, resolvedTemplate, {
      x: point.x + tileSize * 0.15,
      y: point.y + tileSize * 0.15,
      width: tileSize * 0.7,
      height: tileSize * 0.7
    });
  }
}
