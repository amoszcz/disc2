import type { GeneratedCampaignMap } from "../../../engine/campaign-map/types";
import type { ViewportRenderMetrics } from "../viewportRender";
import type { CampaignMapDiagnostics } from "../../../developer/campaign-map/campaignMapDiagnostics";
import { worldTileToCanvasPoint } from "../viewportRender";
export function renderCampaignMapDiagnostics(context: CanvasRenderingContext2D, map: GeneratedCampaignMap, metrics: ViewportRenderMetrics, diagnostics: CampaignMapDiagnostics): void { if (!diagnostics.enabled.size) return; context.font = "12px monospace"; context.fillStyle = "#fff"; context.fillText(`seed ${diagnostics.seed}`, 8, 16); if (diagnostics.enabled.has("connections")) for (const connection of map.connections) for (const position of connection.path) { const p = worldTileToCanvasPoint(position, metrics.viewport, context.canvas, map); context.fillRect(p.x + 2, p.y + 2, 3, 3); } }
