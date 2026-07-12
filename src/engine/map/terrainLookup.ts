import type { Position, ResolvedTerrainTile, ScenarioDefinition, TerrainTypeName } from "../scenario/types";
import { isWithinBounds } from "./mapRules";
import { findMatchingTerrainRegion } from "./terrainRegions";

const TERRAIN_RULES: Record<TerrainTypeName, { traversable: boolean; movementCost: number }> = {
  road: { traversable: true, movementCost: 1 },
  grass: { traversable: true, movementCost: 2 },
  plains: { traversable: true, movementCost: 2 },
  mud: { traversable: true, movementCost: 3 },
  woods: { traversable: true, movementCost: 3 },
  mountains: { traversable: false, movementCost: Number.POSITIVE_INFINITY },
  lakes: { traversable: false, movementCost: Number.POSITIVE_INFINITY },
  rivers: { traversable: false, movementCost: Number.POSITIVE_INFINITY }
};

export function hasTerrainRegions(scenario: ScenarioDefinition): boolean {
  return Boolean(scenario.terrainRegions && scenario.terrainRegions.length > 0);
}

export function resolveTerrainType(scenario: ScenarioDefinition, position: Position): TerrainTypeName {
  const defaultTerrainType = scenario.map.defaultTerrainType ?? "plains";
  const region = scenario.terrainRegions ? findMatchingTerrainRegion(scenario.terrainRegions, position) : undefined;
  return region?.terrainType ?? defaultTerrainType;
}

export function resolveTerrainTile(scenario: ScenarioDefinition, position: Position): ResolvedTerrainTile {
  if (!isWithinBounds(scenario.map, position)) {
    throw new Error(`Position (${position.x}, ${position.y}) is out of bounds.`);
  }

  const terrainType = resolveTerrainType(scenario, position);
  const rules = TERRAIN_RULES[terrainType];
  return {
    position: { ...position },
    terrainType,
    isTraversable: rules.traversable,
    movementCost: rules.movementCost
  };
}

export function terrainLabel(terrainType: TerrainTypeName): string {
  switch (terrainType) {
    case "road":
      return "Road";
    case "grass":
      return "Grass";
    case "plains":
      return "Plains";
    case "mud":
      return "Mud";
    case "woods":
      return "Woods";
    case "mountains":
      return "Mountains";
    case "lakes":
      return "Lakes";
    case "rivers":
      return "Rivers";
  }
}
