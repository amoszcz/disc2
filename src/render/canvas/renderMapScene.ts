import type { GameState } from "../../engine/scenario/types";
import type { MapDefinition } from "../../engine/scenario/types";
import { resolveMovementObjectStack } from "../../engine/map/movementObjectLookup";
import { resolveTerrainTile } from "../../engine/map/terrainLookup";
import { getBaseTileSize } from "../../engine/map/viewportMath";
import { movementObjectGlyph } from "../sprites/placeholders";
import { movementObjectPalette } from "../sprites/placeholders";
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

      const movementObjects = resolveMovementObjectStack(state.scenario, { x, y });
      if (movementObjects.effects.length > 0) {
        const primaryObject = movementObjects.effects[0];
        context.fillStyle = movementObjectPalette[primaryObject.objectType];
        context.fillRect(
          point.x + Math.max(2, Math.floor(tileSize / 8)),
          point.y + Math.max(2, Math.floor(tileSize / 8)),
          tileSize - Math.max(4, Math.floor(tileSize / 4)),
          Math.max(8, Math.floor(tileSize / 4))
        );
        context.fillStyle = primaryObject.objectType === "bridge" ? palette.text : "#fff";
        context.font = `${Math.max(8, Math.floor(tileSize / 3))}px sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(
          movementObjectGlyph[primaryObject.objectType],
          point.x + tileSize / 2,
          point.y + Math.max(6, Math.floor(tileSize / 4))
        );

        if (movementObjects.effects.length > 1) {
          context.fillStyle = movementObjectPalette[movementObjects.effects[1].objectType];
          context.beginPath();
          context.arc(
            point.x + tileSize - Math.max(6, Math.floor(tileSize / 5)),
            point.y + tileSize - Math.max(6, Math.floor(tileSize / 5)),
            Math.max(4, Math.floor(tileSize / 8)),
            0,
            Math.PI * 2
          );
          context.fill();
        }
      }
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
