import type { GeneratedCampaignMap } from "../../../engine/campaign-map/types";
import type { ViewportRenderMetrics } from "../viewportRender";
import { renderTerrainLayers } from "./renderTerrainLayers";
import { renderStrategicLayers } from "./renderStrategicLayers";
import { renderCampaignStamps } from "./stamps";
import { layoutCampaignLabels } from "./labelLayout";
import { worldTileToCanvasPoint } from "../viewportRender";
import { getCampaignMapRenderCache } from "./renderCache";
export function renderCampaignMap(context: CanvasRenderingContext2D, map: GeneratedCampaignMap, metrics: ViewportRenderMetrics): void { getCampaignMapRenderCache(`${map.metadata.revision}:${Math.round(metrics.viewport.zoomLevel * 4)}:${context.canvas.width}`); renderTerrainLayers(context, map, metrics); renderCampaignStamps(context, map, metrics); renderStrategicLayers(context, map, metrics); context.font = `${Math.max(11, Math.floor(metrics.scaledTileSize * .25))}px Georgia`; context.textAlign = "left"; context.textBaseline = "bottom"; for (const label of layoutCampaignLabels(map.locations, metrics.viewport.zoomLevel)) { const point = worldTileToCanvasPoint(label.position, metrics.viewport, context.canvas, map); context.fillStyle = "rgba(13, 11, 9, .75)"; context.fillText(label.location.name, point.x + 3, point.y - 2); context.fillStyle = "#eadbb8"; context.fillText(label.location.name, point.x + 2, point.y - 3); } }
