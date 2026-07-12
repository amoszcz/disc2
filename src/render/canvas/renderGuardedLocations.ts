import type { GuardedLocation } from "../../engine/scenario/types";
import { palette } from "../sprites/placeholders";

export function renderGuardedLocations(
  context: CanvasRenderingContext2D,
  tileSize: number,
  locations: GuardedLocation[]
): void {
  for (const location of locations) {
    context.fillStyle = location.accessState === "blocked" ? palette.guardBlocked : palette.guardOpen;
    context.fillRect(
      location.mapPosition.x * tileSize + tileSize * 0.2,
      location.mapPosition.y * tileSize + tileSize * 0.2,
      tileSize * 0.6,
      tileSize * 0.6
    );
    context.fillStyle = "#fff";
    context.font = "12px Georgia";
    context.fillText(location.accessState === "blocked" ? "G" : "O", location.mapPosition.x * tileSize + 20, location.mapPosition.y * tileSize + 34);
  }
}
