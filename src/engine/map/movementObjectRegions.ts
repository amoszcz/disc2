import type { MovementObjectRegion, Position, TerrainRegionCoverageRect } from "../scenario/types";

export function normalizeMovementObjectRegions(regions: MovementObjectRegion[]): MovementObjectRegion[] {
  return [...regions].sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id));
}

export function rectContainsMovementObjectPosition(rect: TerrainRegionCoverageRect, position: Position): boolean {
  return (
    position.x >= rect.x &&
    position.y >= rect.y &&
    position.x < rect.x + rect.width &&
    position.y < rect.y + rect.height
  );
}

export function findMatchingMovementObjectRegions(
  regions: MovementObjectRegion[],
  position: Position
): MovementObjectRegion[] {
  return normalizeMovementObjectRegions(regions).filter((region) =>
    rectContainsMovementObjectPosition(region.coverage, position)
  );
}
