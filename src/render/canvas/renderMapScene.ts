import type { GameState } from "../../engine/scenario/types";
import type { MapDefinition } from "../../engine/scenario/types";
import { resolveTerrainTile } from "../../engine/map/terrainLookup";
import { palette } from "../sprites/placeholders";
import { terrainPalette } from "../sprites/placeholders";
import { renderGuardedLocations } from "./renderGuardedLocations";

const DEFAULT_TILE_SIZE = 96;
const MIN_TILE_SIZE = 10;

export function getTileSize(map: MapDefinition, canvas?: HTMLCanvasElement): number {
  if (map.width <= 8 && map.height <= 8) {
    return DEFAULT_TILE_SIZE;
  }

  const surfaceWidth = canvas?.width ?? 896;
  const surfaceHeight = canvas?.height ?? 640;
  return Math.max(MIN_TILE_SIZE, Math.floor(Math.min(surfaceWidth / map.width, surfaceHeight / map.height)));
}

export function renderMapScene(context: CanvasRenderingContext2D, state: GameState): void {
  const { map } = state.scenario;
  const tileSize = getTileSize(map, context.canvas);

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f6ecd0";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      const terrainTile = state.scenario.terrainRegions?.length ? resolveTerrainTile(state.scenario, { x, y }) : null;
      context.fillStyle = terrainTile ? terrainPalette[terrainTile.terrainType] : palette.tile;
      context.fillRect(x * tileSize, y * tileSize, tileSize - 1, tileSize - 1);
      context.strokeStyle = palette.tileBorder;
      context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  for (const pickup of state.scenario.resourcePickups.filter((entry) => !entry.collectedState)) {
    context.fillStyle = palette.pickup;
    context.beginPath();
    context.arc(
      pickup.mapPosition.x * tileSize + tileSize / 2,
      pickup.mapPosition.y * tileSize + tileSize / 2,
      Math.max(4, Math.floor(tileSize / 6)),
      0,
      Math.PI * 2
    );
    context.fill();
  }

  renderGuardedLocations(context, tileSize, state.scenario.guardedLocations);

  for (const hero of state.scenario.heroes.filter((entry) => entry.availabilityState !== "defeated")) {
    context.fillStyle = palette.hero;
    context.beginPath();
    context.arc(
      hero.mapPosition.x * tileSize + tileSize / 2,
      hero.mapPosition.y * tileSize + tileSize / 2,
      Math.max(4, Math.floor(tileSize / 4)),
      0,
      Math.PI * 2
    );
    context.fill();

    if (state.selectedHeroId === hero.id) {
      context.strokeStyle = "#fff";
      context.lineWidth = Math.max(1, Math.floor(tileSize / 20));
      context.strokeRect(
        hero.mapPosition.x * tileSize + Math.max(2, Math.floor(tileSize / 8)),
        hero.mapPosition.y * tileSize + Math.max(2, Math.floor(tileSize / 8)),
        tileSize - Math.max(4, Math.floor(tileSize / 4)),
        tileSize - Math.max(4, Math.floor(tileSize / 4))
      );
      context.lineWidth = 1;
    }
  }
}
