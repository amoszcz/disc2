import type { GameState } from "../../engine/scenario/types";
import { palette } from "../sprites/placeholders";
import { renderGuardedLocations } from "./renderGuardedLocations";

const TILE_SIZE = 96;

export function getTileSize(): number {
  return TILE_SIZE;
}

export function renderMapScene(context: CanvasRenderingContext2D, state: GameState): void {
  const { map } = state.scenario;

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "#f6ecd0";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      context.fillStyle = palette.tile;
      context.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
      context.strokeStyle = palette.tileBorder;
      context.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  for (const pickup of state.scenario.resourcePickups.filter((entry) => !entry.collectedState)) {
    context.fillStyle = palette.pickup;
    context.beginPath();
    context.arc(pickup.mapPosition.x * TILE_SIZE + TILE_SIZE / 2, pickup.mapPosition.y * TILE_SIZE + TILE_SIZE / 2, 16, 0, Math.PI * 2);
    context.fill();
  }

  renderGuardedLocations(context, TILE_SIZE, state.scenario.guardedLocations);

  for (const hero of state.scenario.heroes.filter((entry) => entry.availabilityState !== "defeated")) {
    context.fillStyle = palette.hero;
    context.beginPath();
    context.arc(hero.mapPosition.x * TILE_SIZE + TILE_SIZE / 2, hero.mapPosition.y * TILE_SIZE + TILE_SIZE / 2, 22, 0, Math.PI * 2);
    context.fill();

    if (state.selectedHeroId === hero.id) {
      context.strokeStyle = "#fff";
      context.lineWidth = 4;
      context.strokeRect(hero.mapPosition.x * TILE_SIZE + 12, hero.mapPosition.y * TILE_SIZE + 12, TILE_SIZE - 24, TILE_SIZE - 24);
      context.lineWidth = 1;
    }
  }
}
