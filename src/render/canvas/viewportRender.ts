import type { GameState, MapViewport, Position, ScreenPoint } from "../../engine/scenario/types";
import {
  getBaseTileSize,
  getScaledTileSize,
  getVisibleWorldSize,
  worldPointToScreenPoint
} from "../../engine/map/viewportMath";

export interface ViewportRenderMetrics {
  viewport: MapViewport;
  baseTileSize: number;
  scaledTileSize: number;
  visibleWorldWidth: number;
  visibleWorldHeight: number;
  startTileX: number;
  startTileY: number;
  endTileX: number;
  endTileY: number;
}

export function getViewportRenderMetrics(
  state: GameState,
  canvas: HTMLCanvasElement | { width: number; height: number }
): ViewportRenderMetrics {
  const baseTileSize = getBaseTileSize(state.scenario.map, canvas.width, canvas.height);
  const viewport = state.mapViewState.viewport;
  const scaledTileSize = getScaledTileSize(viewport, state.scenario.map, canvas.width, canvas.height);
  const visibleWorldSize = getVisibleWorldSize(viewport, state.scenario.map, canvas.width, canvas.height);

  return {
    viewport,
    baseTileSize,
    scaledTileSize,
    visibleWorldWidth: visibleWorldSize.width,
    visibleWorldHeight: visibleWorldSize.height,
    startTileX: Math.max(0, Math.floor(viewport.panOffsetX)),
    startTileY: Math.max(0, Math.floor(viewport.panOffsetY)),
    endTileX: Math.min(state.scenario.map.width, Math.ceil(viewport.panOffsetX + visibleWorldSize.width)),
    endTileY: Math.min(state.scenario.map.height, Math.ceil(viewport.panOffsetY + visibleWorldSize.height))
  };
}

export function worldTileToCanvasPoint(
  position: Position,
  viewport: MapViewport,
  canvas: HTMLCanvasElement | { width: number; height: number },
  map: { width: number; height: number }
): ScreenPoint {
  return worldPointToScreenPoint(position, viewport, map, canvas.width, canvas.height);
}
