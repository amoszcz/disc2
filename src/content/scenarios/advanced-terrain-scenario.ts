import type { ScenarioDefinition } from "../../engine/scenario/types";

export const advancedTerrainScenario: ScenarioDefinition = {
  id: "advanced-terrain-scenario",
  name: "Broken Causeway",
  description: "A larger terrain-heavy scenario focused on roads, rivers, and movement-object interactions.",
  worldMaps: [
    {
      id: "surface",
      name: "Broken Causeway",
      kind: "main",
      campaignGeneration: { seed: 24024, enabled: true },
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
        { id: "cave-mouth", objectType: "cave", priority: 20, coverage: { kind: "rect", x: 8, y: 10, width: 1, height: 1 } },
        { id: "teleport-gate", objectType: "teleport", priority: 20, coverage: { kind: "rect", x: 12, y: 10, width: 1, height: 1 } },
        { id: "rubble-bog", objectType: "rubble", priority: 20, coverage: { kind: "rect", x: 15, y: 18, width: 1, height: 1 } },
        { id: "rubble-bridge", objectType: "rubble", priority: 25, coverage: { kind: "rect", x: 20, y: 30, width: 1, height: 1 } }
      ]
    },
    {
      id: "cavern-depths",
      name: "Cavern Depths",
      kind: "submap",
      map: {
        width: 6,
        height: 6,
        defaultTerrainType: "woods"
      },
      terrainRegions: [
        { id: "cavern-road", terrainType: "road", priority: 30, coverage: { kind: "rect", x: 1, y: 4, width: 3, height: 1 } },
        { id: "cavern-water", terrainType: "lakes", priority: 40, coverage: { kind: "rect", x: 4, y: 3, width: 1, height: 2 } },
        { id: "cavern-plains", terrainType: "plains", priority: 20, coverage: { kind: "rect", x: 0, y: 0, width: 6, height: 6 } }
      ],
      movementObjectRegions: [
        { id: "cavern-exit-marker", objectType: "exit", priority: 30, coverage: { kind: "rect", x: 4, y: 1, width: 1, height: 1 } },
        { id: "cavern-return-gate", objectType: "exit", priority: 25, coverage: { kind: "rect", x: 0, y: 4, width: 1, height: 1 } }
      ]
    }
  ],
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
    { id: "cave-mouth", objectType: "cave", priority: 20, coverage: { kind: "rect", x: 8, y: 10, width: 1, height: 1 } },
    { id: "teleport-gate", objectType: "teleport", priority: 20, coverage: { kind: "rect", x: 12, y: 10, width: 1, height: 1 } },
    { id: "rubble-bog", objectType: "rubble", priority: 20, coverage: { kind: "rect", x: 15, y: 18, width: 1, height: 1 } },
    { id: "rubble-bridge", objectType: "rubble", priority: 25, coverage: { kind: "rect", x: 20, y: 30, width: 1, height: 1 } }
  ],
  mapLinks: [
    {
      id: "cave-entry-link",
      sourceMapId: "surface",
      sourcePosition: { x: 8, y: 10 },
      triggerKind: "cave",
      destinationMapId: "cavern-depths",
      destinationPosition: { x: 1, y: 4 }
    },
    {
      id: "teleport-entry-link",
      sourceMapId: "surface",
      sourcePosition: { x: 12, y: 10 },
      triggerKind: "teleport",
      destinationMapId: "cavern-depths",
      destinationPosition: { x: 0, y: 4 }
    },
    {
      id: "cavern-exit-link",
      sourceMapId: "cavern-depths",
      sourcePosition: { x: 4, y: 1 },
      triggerKind: "exit",
      destinationMapId: "surface",
      destinationPosition: { x: 21, y: 30 }
    },
    {
      id: "cavern-shortcut-exit",
      sourceMapId: "cavern-depths",
      sourcePosition: { x: 0, y: 4 },
      triggerKind: "exit",
      destinationMapId: "surface",
      destinationPosition: { x: 12, y: 10 }
    }
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
      mapId: "surface",
      mapPosition: { x: 5, y: 10 },
      movementPerTurn: 8,
      remainingMovement: 8,
      unitIds: ["hero-unit-1", "hero-unit-2", "hero-unit-3"],
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
      attackCategory: "melee",
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
      attackCategory: "ranged",
      actionState: "ready",
      defeatState: false
    },
    {
      id: "hero-unit-3",
      name: "Mage",
      ownerSideId: "player-1",
      agility: 8,
      maxHealth: 7,
      currentHealth: 7,
      attackValue: 3,
      attackCategory: "area",
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
      attackCategory: "melee",
      actionState: "ready",
      defeatState: false
    }
  ],
  resourcePickups: [
    {
      id: "pickup-1",
      mapId: "surface",
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
      mapId: "surface",
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
