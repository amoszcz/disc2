import type { GeneratedCampaignMap } from "../../../engine/campaign-map/types";
import type { ViewportRenderMetrics } from "../viewportRender";
import { campaignCellAt } from "../../../engine/campaign-map/adaptScenarioWorldMap";
import { worldTileToCanvasPoint } from "../viewportRender";

const colors: Record<string, string> = { plains: "#6a7040", road: "#66523a", forest: "#293d2e", deadForest: "#3e3b34", swamp: "#425142", corruptedSwamp: "#3c3b50", wasteland: "#74624a", deadland: "#51414a", hills: "#736947", mountains: "#544d4a", snowPeaks: "#d1d3cf", water: "#304c62" };
export function renderTerrainLayers(context: CanvasRenderingContext2D, map: GeneratedCampaignMap, metrics: ViewportRenderMetrics): void {
  for (let y = metrics.startTileY; y < metrics.endTileY; y += 1) for (let x = metrics.startTileX; x < metrics.endTileX; x += 1) { const cell = campaignCellAt(map, x, y); if (!cell) continue; const point = worldTileToCanvasPoint(cell, metrics.viewport, context.canvas, map); context.fillStyle = colors[cell.biome] ?? "#6a7040"; context.fillRect(point.x, point.y, metrics.scaledTileSize + 1, metrics.scaledTileSize + 1); context.fillStyle = `rgba(20, 16, 12, ${0.06 + cell.corruption * 0.12})`; context.fillRect(point.x + metrics.scaledTileSize * .15, point.y + metrics.scaledTileSize * .2, Math.max(1, metrics.scaledTileSize * .18), Math.max(1, metrics.scaledTileSize * .12)); }
}
