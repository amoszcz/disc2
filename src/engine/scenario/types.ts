export type ResourceType = "gold";

export type SceneMode = "map" | "battle" | "victory";
export type SideKind = "player" | "enemy" | "neutral";
export type LocationType = "resource-site";
export type AccessState = "blocked" | "open";
export type AvailabilityState = "ready" | "defeated";
export type ActionState = "ready" | "spent" | "defeated";
export type BattleState = "active" | "resolved";
export type BattleOutcomeWinner = "attacker" | "defender";
export type VictoryType = "eliminate-all-enemies";

export interface Position {
  x: number;
  y: number;
}

export interface MapDefinition {
  width: number;
  height: number;
}

export interface ResourceStockpile {
  gold: number;
}

export interface ScenarioPlayer {
  id: string;
  name: string;
  kind: SideKind;
  isHumanControlled: boolean;
  resourceStockpile: ResourceStockpile;
  heroIds: string[];
  defeatState: boolean;
}

export interface ScenarioHero {
  id: string;
  name: string;
  ownerPlayerId: string;
  mapPosition: Position;
  movementPerTurn: number;
  remainingMovement: number;
  unitIds: string[];
  experience: number;
  availabilityState: AvailabilityState;
}

export interface ScenarioUnit {
  id: string;
  name: string;
  ownerSideId: string;
  agility: number;
  maxHealth: number;
  currentHealth: number;
  attackValue: number;
  actionState: ActionState;
  defeatState: boolean;
}

export interface ResourcePickup {
  id: string;
  mapPosition: Position;
  resourceType: ResourceType;
  amount: number;
  collectedState: boolean;
}

export interface GuardForce {
  id: string;
  unitIds: string[];
  guardedLocationId: string;
  defeatState: boolean;
}

export interface GuardedLocation {
  id: string;
  name: string;
  mapPosition: Position;
  guardForceId: string;
  locationType: LocationType;
  accessState: AccessState;
  ownerPlayerId: string | null;
}

export interface VictoryCondition {
  type: VictoryType;
  targetSideIds: string[];
  evaluationMoments: Array<"after-battle" | "end-turn">;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  map: MapDefinition;
  players: ScenarioPlayer[];
  heroes: ScenarioHero[];
  units: ScenarioUnit[];
  resourcePickups: ResourcePickup[];
  guardedLocations: GuardedLocation[];
  guardForces: GuardForce[];
  victoryCondition: VictoryCondition;
}

export interface BattleParticipant {
  unitId: string;
  side: "attacker" | "defender";
  orderKey: number;
}

export interface BattleOutcome {
  winner: BattleOutcomeWinner;
  defeatedUnitIds: string[];
  survivingAttackerUnitIds: string[];
  survivingDefenderUnitIds: string[];
  heroExperienceAwarded: number;
}

export interface Battle {
  id: string;
  attackingHeroId: string;
  defendingForceId: string;
  participants: BattleParticipant[];
  turnQueue: string[];
  activeUnitId: string;
  battleState: BattleState;
  outcome: BattleOutcome | null;
}

export interface GameState {
  scenario: ScenarioDefinition;
  activePlayerId: string;
  selectedHeroId: string | null;
  sceneMode: SceneMode;
  battle: Battle | null;
  messageLog: string[];
  winnerPlayerId: string | null;
}

export interface GameSnapshot {
  activePlayerId: string;
  selectedHeroId: string | null;
  sceneMode: SceneMode;
  winnerPlayerId: string | null;
  messageLog: string[];
}

export function cloneScenario<T>(value: T): T {
  return structuredClone(value);
}
