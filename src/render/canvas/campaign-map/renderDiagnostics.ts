import type { GeneratedCampaignMap } from "../../../engine/campaign-map/types";
import type { ViewportRenderMetrics } from "../viewportRender";
import type { CampaignMapDiagnostics } from "../../../developer/campaign-map/campaignMapDiagnostics";
import { worldTileToCanvasPoint } from "../viewportRender";

/** Draws opt-in developer overlays after game content; none are requested in player UI. */
export function renderCampaignMapDiagnostics(
  context: CanvasRenderingContext2D,
  map: GeneratedCampaignMap,
  metrics: ViewportRenderMetrics,
  diagnostics: CampaignMapDiagnostics
): void {
  if (!diagnostics.enabled.size) return;
  const tile = metrics.scaledTileSize;
  context.save();
  context.font = "12px monospace";
  context.fillStyle = "#fff";
  context.fillText(`seed ${diagnostics.seed} | ${map.validation.valid ? "valid" : "invalid"}`, 8, 16);
  if (diagnostics.enabled.has("cells")) {
    context.strokeStyle = "rgba(255,255,255,.36)";
    for (let y = metrics.startTileY; y < metrics.endTileY; y += 1) for (let x = metrics.startTileX; x < metrics.endTileX; x += 1) {
      const p = worldTileToCanvasPoint({ x, y }, metrics.viewport, context.canvas, map);
      context.strokeRect(p.x, p.y, tile, tile);
    }
  }
  if (diagnostics.enabled.has("regions")) {
    context.fillStyle = "rgba(255, 214, 102, .7)";
    for (const region of map.regions) {
      const first = region.cells[0];
      if (!first) continue;
      const p = worldTileToCanvasPoint(first, metrics.viewport, context.canvas, map);
      context.fillText(region.name, p.x + 2, p.y + 14);
    }
  }
  if (diagnostics.enabled.has("connections") || diagnostics.enabled.has("route-search")) {
    context.fillStyle = diagnostics.enabled.has("route-search") ? "#ff75c8" : "#71ddff";
    for (const connection of map.connections) for (const position of connection.path) {
      const p = worldTileToCanvasPoint(position, metrics.viewport, context.canvas, map);
      context.fillRect(p.x + tile * .42, p.y + tile * .42, Math.max(2, tile * .16), Math.max(2, tile * .16));
    }
  }
  if (diagnostics.enabled.has("placement")) {
    context.strokeStyle = "#c5ff71";
    for (const location of map.locations) {
      const p = worldTileToCanvasPoint(location.position, metrics.viewport, context.canvas, map);
      context.strokeRect(p.x + 1, p.y + 1, tile - 2, tile - 2);
    }
  }
  if (diagnostics.enabled.has("validation")) {
    context.fillStyle = map.validation.valid ? "#8cff9b" : "#ff8585";
    context.fillText(map.validation.errors.join("; ") || `score ${map.validation.score}`, 8, 32);
  }
  if (diagnostics.enabled.has("cache")) {
    context.strokeStyle = "rgba(255, 157, 73, .85)";
    context.strokeRect(1, 1, context.canvas.width - 2, context.canvas.height - 2);
  }
  context.restore();
}
