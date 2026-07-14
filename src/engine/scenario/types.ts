export type ResourceType = "gold";
export type TerrainTypeName = "road" | "grass" | "plains" | "mud" | "woods" | "mountains" | "lakes" | "rivers";
export type MovementObjectType = "bridge" | "milestone" | "rubble";

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

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface MapDefinition {
  width: number;
  height: number;
  defaultTerrainType?: TerrainTypeName;
}

export interface TerrainRegionCoverageRect {
  kind: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TerrainRegion {
  id: string;
  terrainType: TerrainTypeName;
  coverage: TerrainRegionCoverageRect;
  priority: number;
}

export interface MovementObjectRegion {
  id: string;
  objectType: MovementObjectType;
  coverage: TerrainRegionCoverageRect;
  priority: number;
}

export interface ResolvedMovementObjectEffect {
  regionId: string;
  objectType: MovementObjectType;
  movementDelta: number;
  changesPassability: boolean;
}

export interface ResolvedMovementObjectStack {
  position: Position;
  effects: ResolvedMovementObjectEffect[];
  objectTypes: MovementObjectType[];
  passabilityOverride: "traversable" | null;
  movementDeltaTotal: number;
  resolutionOrder: string[];
}

export interface ResolvedTerrainTile {
  position: Position;
  terrainType: TerrainTypeName;
  isTraversable: boolean;
  movementCost: number;
}

export interface ResolvedMovementTile extends ResolvedTerrainTile {
  baseTerrainType: TerrainTypeName;
  movementObjects: ResolvedMovementObjectStack;
}

export interface RouteAttempt {
  heroId: string;
  fromPosition: Position;
  toPosition: Position;
  direction: "orthogonal" | "diagonal";
  resolvedTerrain: ResolvedMovementTile;
  movementCost: number;
  isLegal: boolean;
  failureReason: string | null;
}

export interface RouteFeedback {
  destinationPosition: Position;
  terrainLabel: string;
  movementImpact: string;
  blockedReason: string | null;
  objectLabels: string[];
  passabilityExplanation: string | null;
  movementDeltaExplanation: string | null;
  stackExplanation: string | null;
  routeMode?: "move" | "preview" | "continuation" | "blocked";
  routeStepCount?: number;
  routeTotalMovement?: number;
  previewMessage?: string | null;
}

export interface RouteStep {
  position: Position;
  movementCost: number;
  terrainLabel: string;
  objectLabels: string[];
}

export interface RoutePreview {
  heroId: string;
  destinationPosition: Position;
  steps: RouteStep[];
  totalMovementCost: number;
  status: "previewed" | "partial" | "continuation";
  lastValidatedFromPosition: Position;
  isAwaitingConfirmation: boolean;
}

export interface RouteProgressResult {
  traversedSteps: RouteStep[];
  finalPosition: Position;
  movementSpent: number;
  remainingSteps: RouteStep[];
  completionState: "completed" | "partial" | "blocked";
  failureReason: string | null;
  encounteredBlockedLocation: boolean;
  triggerSource: "manual" | "end-turn";
}

export interface MapViewport {
  zoomLevel: number;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  panOffsetX: number;
  panOffsetY: number;
}

export interface PanGestureState {
  originScreenX: number;
  originScreenY: number;
  startingPanOffsetX: number;
  startingPanOffsetY: number;
  isActive: boolean;
}

export interface MapViewState {
  viewport: MapViewport;
  panGesture: PanGestureState | null;
  lastSceneMode: SceneMode;
  isDefaultView: boolean;
}

export interface InteractionTarget {
  screenPosition: ScreenPoint;
  worldPosition: Position;
  targetKind: "hero" | "tile" | "none";
  targetId: string | null;
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
  terrainRegions?: TerrainRegion[];
  movementObjectRegions?: MovementObjectRegion[];
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
  routeFeedback: RouteFeedback | null;
  activeRoutePreview: RoutePreview | null;
  mapViewState: MapViewState;
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
