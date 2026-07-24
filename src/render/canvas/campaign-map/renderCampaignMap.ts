import type { GeneratedCampaignMap } from "../../../engine/campaign-map/types";
import type { ViewportRenderMetrics } from "../viewportRender";
import { renderTerrainLayers } from "./renderTerrainLayers";
import { renderStrategicLayers } from "./renderStrategicLayers";
import { renderCampaignStamps } from "./stamps";
import { layoutCampaignLabels } from "./labelLayout";
import { worldTileToCanvasPoint } from "../viewportRender";
import { getCampaignMapCacheKey, getCampaignMapRenderCache } from "./renderCache";
import { getCampaignMapDiagnostics } from "../../../developer/campaign-map/campaignMapDiagnostics";
import { renderCampaignMapDiagnostics } from "./renderDiagnostics";

export function renderCampaignMap(context: CanvasRenderingContext2D, map: GeneratedCampaignMap, metrics: ViewportRenderMetrics): void {
  getCampaignMapRenderCache(getCampaignMapCacheKey(map.metadata.revision, metrics.viewport.zoomLevel, context.canvas.width));
  renderTerrainLayers(context, map, metrics);
  // Decorative stamps and labels are intentionally simplified at distant zoom levels.
  if (metrics.scaledTileSize >= 5) renderCampaignStamps(context, map, metrics);
  renderStrategicLayers(context, map, metrics);
  context.font = `${Math.max(11, Math.floor(metrics.scaledTileSize * .25))}px Georgia`;
  context.textAlign = "left";
  context.textBaseline = "bottom";
  for (const label of layoutCampaignLabels(map.locations, metrics.viewport.zoomLevel)) {
    const { x, y } = label.position;
    if (x < metrics.startTileX - 1 || x > metrics.endTileX || y < metrics.startTileY - 1 || y > metrics.endTileY) continue;
    const point = worldTileToCanvasPoint(label.position, metrics.viewport, context.canvas, map);
    context.fillStyle = "rgba(13, 11, 9, .75)";
    context.fillText(label.location.name, point.x + 3, point.y - 2);
    context.fillStyle = "#eadbb8";
    context.fillText(label.location.name, point.x + 2, point.y - 3);
  }
  renderCampaignMapDiagnostics(context, map, metrics, getCampaignMapDiagnostics(map));
}
