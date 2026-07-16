import type { ScenarioDefinition } from "../../engine/scenario/types";

export const submapExpeditionScenario: ScenarioDefinition = {
  id: "submap-expedition-scenario",
  name: "Cavern Circuit",
  description: "A compact scenario built around cave entry, teleport travel, and returning from linked submaps.",
  worldMaps: [
    {
      id: "surface-camp",
      name: "Surface Camp",
      kind: "main",
      map: {
        width: 8,
        height: 8,
        defaultTerrainType: "plains"
      },
      terrainRegions: [
        { id: "camp-road", terrainType: "road", priority: 20, coverage: { kind: "rect", x: 1, y: 3, width: 5, height: 1 } },
        { id: "camp-grass", terrainType: "grass", priority: 10, coverage: { kind: "rect", x: 0, y: 4, width: 4, height: 2 } }
      ],
      movementObjectRegions: [
        { id: "camp-cave", objectType: "cave", priority: 20, coverage: { kind: "rect", x: 3, y: 3, width: 1, height: 1 } },
        { id: "camp-teleport", objectType: "teleport", priority: 20, coverage: { kind: "rect", x: 5, y: 3, width: 1, height: 1 } }
      ]
    },
    {
      id: "echo-cavern",
      name: "Echo Cavern",
      kind: "submap",
      map: {
        width: 6,
        height: 6,
        defaultTerrainType: "plains"
      },
      terrainRegions: [
        { id: "cavern-path", terrainType: "road", priority: 20, coverage: { kind: "rect", x: 1, y: 4, width: 4, height: 1 } },
        { id: "cavern-water", terrainType: "lakes", priority: 30, coverage: { kind: "rect", x: 4, y: 1, width: 1, height: 2 } }
      ],
      movementObjectRegions: [
        { id: "cavern-exit", objectType: "exit", priority: 20, coverage: { kind: "rect", x: 3, y: 1, width: 1, height: 1 } }
      ]
    }
  ],
  map: {
    width: 8,
    height: 8,
    defaultTerrainType: "plains"
  },
  terrainRegions: [
    { id: "camp-road", terrainType: "road", priority: 20, coverage: { kind: "rect", x: 1, y: 3, width: 5, height: 1 } },
    { id: "camp-grass", terrainType: "grass", priority: 10, coverage: { kind: "rect", x: 0, y: 4, width: 4, height: 2 } }
  ],
  movementObjectRegions: [
    { id: "camp-cave", objectType: "cave", priority: 20, coverage: { kind: "rect", x: 3, y: 3, width: 1, height: 1 } },
    { id: "camp-teleport", objectType: "teleport", priority: 20, coverage: { kind: "rect", x: 5, y: 3, width: 1, height: 1 } }
  ],
  mapLinks: [
    {
      id: "camp-cave-entry",
      sourceMapId: "surface-camp",
      sourcePosition: { x: 3, y: 3 },
      triggerKind: "cave",
      destinationMapId: "echo-cavern",
      destinationPosition: { x: 1, y: 4 }
    },
    {
      id: "camp-teleport-entry",
      sourceMapId: "surface-camp",
      sourcePosition: { x: 5, y: 3 },
      triggerKind: "teleport",
      destinationMapId: "echo-cavern",
      destinationPosition: { x: 0, y: 4 }
    },
    {
      id: "cavern-surface-exit",
      sourceMapId: "echo-cavern",
      sourcePosition: { x: 3, y: 1 },
      triggerKind: "exit",
      destinationMapId: "surface-camp",
      destinationPosition: { x: 6, y: 5 }
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
      name: "Deep Wardens",
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
      mapId: "surface-camp",
      mapPosition: { x: 1, y: 3 },
      movementPerTurn: 5,
      remainingMovement: 5,
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
      name: "Cavern Sentry",
      ownerSideId: "neutral-guards",
      agility: 6,
      maxHealth: 9,
      currentHealth: 9,
      attackValue: 3,
      attackCategory: "melee",
      actionState: "ready",
      defeatState: false
    }
  ],
  resourcePickups: [
    {
      id: "pickup-1",
      mapId: "echo-cavern",
      mapPosition: { x: 3, y: 4 },
      resourceType: "gold",
      amount: 15,
      collectedState: false
    }
  ],
  guardedLocations: [
    {
      id: "guarded-location-1",
      name: "Crystal Cache",
      mapId: "echo-cavern",
      mapPosition: { x: 5, y: 4 },
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
