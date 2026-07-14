import type { ScenarioDefinition } from "../../engine/scenario/types";

export const advancedTerrainScenario: ScenarioDefinition = {
  id: "advanced-terrain-scenario",
  name: "Broken Causeway",
  map: {
    width: 64,
    height: 64,
    defaultTerrainType: "plains"
  },
  terrainRegions: [
    { id: "road-west", terrainType: "road", priority: 20, coverage: { kind: "rect", x: 4, y: 10, width: 16, height: 1 } },
    { id: "road-east", terrainType: "road", priority: 20, coverage: { kind: "rect", x: 21, y: 10, width: 12, height: 1 } },
    { id: "grass-meadow", terrainType: "grass", priority: 5, coverage: { kind: "rect", x: 4, y: 12, width: 10, height: 6 } },
    { id: "mud-patch", terrainType: "mud", priority: 10, coverage: { kind: "rect", x: 14, y: 18, width: 6, height: 5 } },
    { id: "woods-cluster", terrainType: "woods", priority: 10, coverage: { kind: "rect", x: 8, y: 24, width: 8, height: 8 } },
    { id: "mountain-wall", terrainType: "mountains", priority: 30, coverage: { kind: "rect", x: 34, y: 6, width: 6, height: 16 } },
    { id: "lake-basin", terrainType: "lakes", priority: 30, coverage: { kind: "rect", x: 26, y: 26, width: 10, height: 8 } },
    { id: "river-cross", terrainType: "rivers", priority: 40, coverage: { kind: "rect", x: 20, y: 0, width: 1, height: 64 } }
  ],
  movementObjectRegions: [
    { id: "bridge-causeway", objectType: "bridge", priority: 30, coverage: { kind: "rect", x: 20, y: 30, width: 1, height: 2 } },
    { id: "milestone-detour", objectType: "milestone", priority: 20, coverage: { kind: "rect", x: 7, y: 11, width: 1, height: 1 } },
    { id: "rubble-bog", objectType: "rubble", priority: 20, coverage: { kind: "rect", x: 15, y: 18, width: 1, height: 1 } },
    { id: "rubble-bridge", objectType: "rubble", priority: 25, coverage: { kind: "rect", x: 20, y: 30, width: 1, height: 1 } }
  ],
  players: [
    {
      id: "player-1",
      name: "The Empire",
      kind: "player",
      isHumanControlled: true,
      resourceStockpile: { gold: 0 },
      heroIds: ["hero-1"],
      defeatState: false
    },
    {
      id: "neutral-guards",
      name: "Outland Sentinels",
      kind: "neutral",
      isHumanControlled: false,
      resourceStockpile: { gold: 0 },
      heroIds: [],
      defeatState: false
    }
  ],
  heroes: [
    {
      id: "hero-1",
      name: "Aren",
      ownerPlayerId: "player-1",
      mapPosition: { x: 5, y: 10 },
      movementPerTurn: 8,
      remainingMovement: 8,
      unitIds: ["hero-unit-1", "hero-unit-2"],
      experience: 0,
      availabilityState: "ready"
    }
  ],
  units: [
    {
      id: "hero-unit-1",
      name: "Militia",
      ownerSideId: "player-1",
      agility: 7,
      maxHealth: 10,
      currentHealth: 10,
      attackValue: 4,
      actionState: "ready",
      defeatState: false
    },
    {
      id: "hero-unit-2",
      name: "Archer",
      ownerSideId: "player-1",
      agility: 9,
      maxHealth: 8,
      currentHealth: 8,
      attackValue: 4,
      actionState: "ready",
      defeatState: false
    },
    {
      id: "guard-unit-1",
      name: "Stone Watcher",
      ownerSideId: "neutral-guards",
      agility: 6,
      maxHealth: 10,
      currentHealth: 10,
      attackValue: 3,
      actionState: "ready",
      defeatState: false
    }
  ],
  resourcePickups: [
    {
      id: "pickup-1",
      mapPosition: { x: 9, y: 10 },
      resourceType: "gold",
      amount: 10,
      collectedState: false
    }
  ],
  guardedLocations: [
    {
      id: "guarded-location-1",
      name: "River Watchtower",
      mapPosition: { x: 50, y: 50 },
      guardForceId: "guard-force-1",
      locationType: "resource-site",
      accessState: "blocked",
      ownerPlayerId: null
    }
  ],
  guardForces: [
    {
      id: "guard-force-1",
      unitIds: ["guard-unit-1"],
      guardedLocationId: "guarded-location-1",
      defeatState: false
    }
  ],
  victoryCondition: {
    type: "eliminate-all-enemies",
    targetSideIds: ["neutral-guards"],
    evaluationMoments: ["after-battle", "end-turn"]
  }
};
