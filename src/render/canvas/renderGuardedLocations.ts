import type { GuardedLocation, MapDefinition, MapViewport } from "../../engine/scenario/types";
import { palette } from "../sprites/placeholders";
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
    context.fillStyle = location.accessState === "blocked" ? palette.guardBlocked : palette.guardOpen;
    context.fillRect(point.x + tileSize * 0.2, point.y + tileSize * 0.2, tileSize * 0.6, tileSize * 0.6);
    context.fillStyle = "#fff";
    context.font = "12px Georgia";
    context.fillText(location.accessState === "blocked" ? "G" : "O", point.x + tileSize * 0.2, point.y + tileSize * 0.35);
  }
}
