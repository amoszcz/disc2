import type { ScenarioDefinition } from "../../engine/scenario/types";

export const coreMapLoopScenario: ScenarioDefinition = {
  id: "core-map-loop",
  name: "Border Watch",
  description: "A compact frontier skirmish with a guarded mine close to the starting hero.",
  worldMaps: [
    {
      id: "main-map",
      name: "Border Watch",
      kind: "main",
      map: {
        width: 5,
        height: 5,
        defaultTerrainType: "road"
      }
    }
  ],
  map: {
    width: 5,
    height: 5,
    defaultTerrainType: "road"
  },
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
      name: "Ruins Watch",
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
      mapId: "main-map",
      mapPosition: { x: 0, y: 2 },
      movementPerTurn: 2,
      remainingMovement: 2,
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
      name: "Skeleton",
      ownerSideId: "neutral-guards",
      agility: 6,
      maxHealth: 7,
      currentHealth: 7,
      attackValue: 3,
      attackCategory: "melee",
      actionState: "ready",
      defeatState: false
    },
    {
      id: "guard-unit-2",
      name: "Skeleton Archer",
      ownerSideId: "neutral-guards",
      agility: 5,
      maxHealth: 6,
      currentHealth: 6,
      attackValue: 2,
      attackCategory: "ranged",
      actionState: "ready",
      defeatState: false
    }
  ],
  resourcePickups: [
    {
      id: "pickup-1",
      mapId: "main-map",
      mapPosition: { x: 1, y: 2 },
      resourceType: "gold",
      amount: 10,
      collectedState: false
    }
  ],
  guardedLocations: [
    {
      id: "guarded-location-1",
      name: "Ancient Mine",
      mapId: "main-map",
      mapPosition: { x: 3, y: 2 },
      guardForceId: "guard-force-1",
      locationType: "resource-site",
      accessState: "blocked",
      ownerPlayerId: null
    }
  ],
  guardForces: [
    {
      id: "guard-force-1",
      unitIds: ["guard-unit-1", "guard-unit-2"],
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
