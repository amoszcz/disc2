import type { Position, TerrainRegion, TerrainRegionCoverageRect } from "../scenario/types";

export function normalizeTerrainRegions(regions: TerrainRegion[]): TerrainRegion[] {
  return [...regions].sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id));
}

export function rectContainsPosition(rect: TerrainRegionCoverageRect, position: Position): boolean {
  return (
    position.x >= rect.x &&
    position.y >= rect.y &&
    position.x < rect.x + rect.width &&
    position.y < rect.y + rect.height
  );
}

export function findMatchingTerrainRegion(regions: TerrainRegion[], position: Position): TerrainRegion | undefined {
  return normalizeTerrainRegions(regions).find((region) => rectContainsPosition(region.coverage, position));
}
