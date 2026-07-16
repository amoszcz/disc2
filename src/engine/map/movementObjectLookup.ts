import type {
  MovementObjectRegion,
  Position,
  ResolvedMovementObjectEffect,
  ResolvedMovementObjectStack,
  ScenarioDefinition
} from "../scenario/types";
import { findMatchingMovementObjectRegions, normalizeMovementObjectRegions } from "./movementObjectRegions";

const MOVEMENT_OBJECT_EFFECTS: Record<
  MovementObjectRegion["objectType"],
  Pick<ResolvedMovementObjectEffect, "movementDelta" | "changesPassability">
> = {
  bridge: { movementDelta: 0, changesPassability: true },
  milestone: { movementDelta: -1, changesPassability: false },
  rubble: { movementDelta: 1, changesPassability: false },
  cave: { movementDelta: 0, changesPassability: false },
  teleport: { movementDelta: 0, changesPassability: false },
  exit: { movementDelta: 0, changesPassability: false }
};

export function hasMovementObjectRegions(scenario: ScenarioDefinition): boolean {
  return Boolean(scenario.movementObjectRegions?.length);
}

export function resolveMovementObjectStack(scenario: ScenarioDefinition, position: Position): ResolvedMovementObjectStack {
  const regions = scenario.movementObjectRegions ? findMatchingMovementObjectRegions(scenario.movementObjectRegions, position) : [];
  const effects = regions.map<ResolvedMovementObjectEffect>((region) => ({
    regionId: region.id,
    objectType: region.objectType,
    movementDelta: MOVEMENT_OBJECT_EFFECTS[region.objectType].movementDelta,
    changesPassability: MOVEMENT_OBJECT_EFFECTS[region.objectType].changesPassability
  }));

  return {
    position: { ...position },
    effects,
    objectTypes: effects.map((effect) => effect.objectType),
    passabilityOverride: effects.some((effect) => effect.objectType === "bridge") ? "traversable" : null,
    movementDeltaTotal: effects.reduce((total, effect) => total + effect.movementDelta, 0),
    resolutionOrder: effects.map((effect) => effect.regionId)
  };
}

export function getNormalizedMovementObjectRegions(scenario: ScenarioDefinition): MovementObjectRegion[] {
  return scenario.movementObjectRegions ? normalizeMovementObjectRegions(scenario.movementObjectRegions) : [];
}
