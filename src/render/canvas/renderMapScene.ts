import type { GameState } from "../../engine/scenario/types";
import type { MapDefinition } from "../../engine/scenario/types";
import { resolveTerrainTile } from "../../engine/map/terrainLookup";
import { getBaseTileSize } from "../../engine/map/viewportMath";
import { palette } from "../sprites/placeholders";
import { terrainPalette } from "../sprites/placeholders";
import { renderGuardedLocations } from "./renderGuardedLocations";
import { getViewportRenderMetrics, worldTileToCanvasPoint } from "./viewportRender";

export function getTileSize(map: MapDefinition, canvas?: HTMLCanvasElement): number {
  return getBaseTileSize(map, canvas?.width, canvas?.height);
}

export function renderMapScene(context: CanvasRenderingContext2D, state: GameState): void {
  const { map } = state.scenario;
  const metrics = getViewportRenderMetrics(state, context.canvas);
  const tileSize = metrics.scaledTileSize;

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f6ecd0";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  for (let y = metrics.startTileY; y < metrics.endTileY; y += 1) {
    for (let x = metrics.startTileX; x < metrics.endTileX; x += 1) {
      const terrainTile = state.scenario.terrainRegions?.length ? resolveTerrainTile(state.scenario, { x, y }) : null;
      const point = worldTileToCanvasPoint({ x, y }, metrics.viewport, context.canvas, map);
      context.fillStyle = terrainTile ? terrainPalette[terrainTile.terrainType] : palette.tile;
      context.fillRect(point.x, point.y, tileSize - 1, tileSize - 1);
      context.strokeStyle = palette.tileBorder;
      context.strokeRect(point.x, point.y, tileSize, tileSize);
    }
  }

  for (const pickup of state.scenario.resourcePickups.filter((entry) => !entry.collectedState)) {
    const point = worldTileToCanvasPoint(pickup.mapPosition, metrics.viewport, context.canvas, map);
    context.fillStyle = palette.pickup;
    context.beginPath();
    context.arc(
      point.x + tileSize / 2,
      point.y + tileSize / 2,
      Math.max(4, Math.floor(tileSize / 6)),
      0,
      Math.PI * 2
    );
    context.fill();
  }

  renderGuardedLocations(context, tileSize, state.scenario.guardedLocations, metrics.viewport, map);

  for (const hero of state.scenario.heroes.filter((entry) => entry.availabilityState !== "defeated")) {
    const point = worldTileToCanvasPoint(hero.mapPosition, metrics.viewport, context.canvas, map);
    context.fillStyle = palette.hero;
    context.beginPath();
    context.arc(
      point.x + tileSize / 2,
      point.y + tileSize / 2,
      Math.max(4, Math.floor(tileSize / 4)),
      0,
      Math.PI * 2
    );
    context.fill();

    if (state.selectedHeroId === hero.id) {
      context.strokeStyle = "#fff";
      context.lineWidth = Math.max(1, Math.floor(tileSize / 20));
      context.strokeRect(
        point.x + Math.max(2, Math.floor(tileSize / 8)),
        point.y + Math.max(2, Math.floor(tileSize / 8)),
        tileSize - Math.max(4, Math.floor(tileSize / 4)),
        tileSize - Math.max(4, Math.floor(tileSize / 4))
      );
      context.lineWidth = 1;
    }
  }
}
