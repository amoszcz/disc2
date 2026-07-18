export type ResourceType = "gold";
export type TerrainTypeName = "road" | "grass" | "plains" | "mud" | "woods" | "mountains" | "lakes" | "rivers";
export type MovementObjectType = "bridge" | "milestone" | "rubble" | "cave" | "teleport" | "exit";

export type SceneMode = "menu" | "map" | "battle" | "victory" | "storybook" | "sprite-mapping";
export type SideKind = "player" | "enemy" | "neutral";
export type LocationType = "resource-site";
export type AccessState = "blocked" | "open";
export type AvailabilityState = "ready" | "defeated";
export type ActionState = "ready" | "spent" | "defeated";
export type BattleState = "active" | "resolved";
export type BattleOutcomeWinner = "attacker" | "defender";
export type VictoryType = "eliminate-all-enemies";
export type BattleSide = "attacker" | "defender";
export type AttackCategory = "melee" | "ranged" | "area";
export type WorldMapKind = "main" | "submap";
export type MapTravelTriggerKind = "cave" | "teleport" | "exit";
export type VisualAssetKind = "dedicated" | "fallback";
export type VisualCategory = "unit" | "hero" | "movement-object" | "guarded-location" | "terrain" | "resource-pickup";
export type VisualSceneContext = "map" | "battle";
export type VisualSubjectKind = VisualCategory;
export type VisualFallbackShape = "rect" | "circle" | "diamond" | "tile" | "slot";
export type FacingDirection = "up" | "down" | "left" | "right";
export type HeroDirectionalStateName = "idle" | "start-move" | "walk" | "stop-move";
export type HeroEventStateName = "interact" | "victory" | "hurt" | "perish";
export type HeroAnimationStateName = HeroDirectionalStateName | HeroEventStateName;
export type BattleUnitAnimationStateName =
  | "idle"
  | "ready"
  | "attack"
  | "cast"
  | "shoot"
  | "hit"
  | "defend"
  | "wait"
  | "victory"
  | "perish";
export type ObjectAnimationStateName =
  | "idle"
  | "active"
  | "inactive"
  | "blocked"
  | "open"
  | "claimed"
  | "depleted"
  | "damaged"
  | "destroyed"
  | "highlighted"
  | "selected";
export type VisualStateName = HeroAnimationStateName | BattleUnitAnimationStateName | ObjectAnimationStateName;
export type StorybookPreviewSubjectKind = "hero" | "unit" | "movement-object" | "guarded-location";

export interface Position {
  x: number;
  y: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

export interface VisualFallbackStyle {
  fillColor: string;
  accentColor?: string;
  borderColor?: string;
  textColor?: string;
  glyph?: string;
  shape: VisualFallbackShape;
}

export interface VisualSpriteFrame {
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
}

export interface VisualTemplateDefinition {
  templateId: string;
  visualCategory: VisualCategory;
  assetKind: VisualAssetKind;
  assetSource: string | null;
  spriteFrame?: VisualSpriteFrame | null;
  supportedStateNames?: string[] | null;
  fallbackStyle: VisualFallbackStyle;
  readabilityLabel: string;
  intendedContexts: VisualSceneContext[];
}

export interface VisualTemplateResolverResult {
  templateId: string;
  resolvedFrom: string;
  assetKind: VisualAssetKind;
  assetSource: string | null;
  spriteFrame?: VisualSpriteFrame | null;
  requestedStateName?: string | null;
  resolvedStateName?: string | null;
  stateDirection?: FacingDirection | null;
  fallbackStyle: VisualFallbackStyle;
  readabilityLabel: string;
  intendedContexts: VisualSceneContext[];
  isFallback: boolean;
}

export interface VisualSubjectDescriptor {
  subjectKind: VisualSubjectKind;
  subjectType: string;
  sceneContext: VisualSceneContext;
}

export interface HeroAnimationStateProfile {
  directionalStateNames: HeroDirectionalStateName[];
  eventStateNames: HeroEventStateName[];
  fallbackStateName: HeroAnimationStateName;
  defaultDirection: FacingDirection;
  requiredStateNames: HeroAnimationStateName[];
  mvpStateNames: HeroAnimationStateName[];
}

export interface BattleUnitAnimationStateProfile {
  supportedStateNames: BattleUnitAnimationStateName[];
  fallbackStateName: BattleUnitAnimationStateName;
  requiredStateNames: BattleUnitAnimationStateName[];
  mvpStateNames: BattleUnitAnimationStateName[];
}

export interface ObjectAnimationStateProfile {
  supportedStateNames: ObjectAnimationStateName[];
  fallbackStateName: ObjectAnimationStateName;
  requiredStateNames: ObjectAnimationStateName[];
  optionalStateNames: ObjectAnimationStateName[];
}

export interface HeroVisualStateRuntime {
  stateName: HeroAnimationStateName;
  direction: FacingDirection;
}

export interface BattleUnitVisualStateRuntime {
  stateName: BattleUnitAnimationStateName;
}

export interface ObjectVisualStateRuntime {
  stateName: ObjectAnimationStateName;
}

export interface VisualStateTracker {
  heroStates: Record<string, HeroVisualStateRuntime>;
  unitStates: Record<string, BattleUnitVisualStateRuntime>;
  objectStates: Record<string, ObjectVisualStateRuntime>;
}

export interface StorybookStateOption {
  optionId: string;
  label: string;
  stateName: HeroAnimationStateName | BattleUnitAnimationStateName | ObjectAnimationStateName;
  direction: FacingDirection | null;
  isFallbackReviewable: boolean;
}

export interface StorybookPreviewTileStyle {
  tileWidth: number;
  tileHeight: number;
}

export interface StorybookPreviewSubject {
  subjectId: string;
  subjectKind: StorybookPreviewSubjectKind;
  subjectType: string;
  displayName: string;
  categoryLabel: string;
  sceneContext: VisualSceneContext;
  defaultStateName: HeroAnimationStateName | BattleUnitAnimationStateName | ObjectAnimationStateName;
  defaultDirection: FacingDirection | null;
  previewTileStyle: StorybookPreviewTileStyle;
  stateOptions: StorybookStateOption[];
}

export interface StorybookSubjectSelection {
  stateName: HeroAnimationStateName | BattleUnitAnimationStateName | ObjectAnimationStateName;
  direction: FacingDirection | null;
}

export interface StorybookTransitionRecord {
  subjectId: string;
  previousStateLabel: string;
  nextStateLabel: string;
}

export interface StorybookState {
  subjects: StorybookPreviewSubject[];
  selectedSubjectId: string | null;
  subjectSelections: Record<string, StorybookSubjectSelection>;
  lastChangedSubjectId: string | null;
  lastTransition: StorybookTransitionRecord | null;
}

export type LayoutMode = "desktop" | "mobile";
export type SidebarPlacement = "right" | "bottom";
export type InteractionType = "tap" | "drag" | "zoom-in" | "zoom-out";
export type GesturePhase = "start" | "move" | "end";

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
  minTileRenderSize: number;
  maxTileRenderSize: number;
  zoomStepTileSize: number;
  zoomReferenceScenarioId: string;
  panOffsetX: number;
  panOffsetY: number;
}

export interface PanGestureState {
  originScreenX: number;
  originScreenY: number;
  startingPanOffsetX: number;
  startingPanOffsetY: number;
  isActive: boolean;
  pointerId?: number;
  pointerType?: string;
  hasMoved?: boolean;
}

export interface ZoomGestureState {
  pointerIds: [number, number];
  anchorScreenPoint: ScreenPoint;
  initialDistance: number;
  lastDistance: number;
  isActive: boolean;
}

export interface MapViewState {
  viewport: MapViewport;
  panGesture: PanGestureState | null;
  zoomGesture: ZoomGestureState | null;
  lastSceneMode: SceneMode;
  isDefaultView: boolean;
}

export interface InteractionTarget {
  screenPosition: ScreenPoint;
  worldPosition: Position;
  targetKind: "hero" | "tile" | "none";
  targetId: string | null;
}

export interface TouchInteraction {
  interactionType: InteractionType;
  screenPosition: ScreenPoint;
  targetKind: InteractionTarget["targetKind"];
  targetId: string | null;
  gesturePhase: GesturePhase;
}

export interface MobileLayoutState {
  viewportWidth: number;
  viewportHeight: number;
  layoutMode: LayoutMode;
  sidebarPlacement: SidebarPlacement;
  canvasDisplayWidth: number;
  canvasDisplayHeight: number;
}

export interface ResponsiveCanvasView {
  pixelWidth: number;
  pixelHeight: number;
  displayWidth: number;
  displayHeight: number;
  deviceScaleFactor: number;
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
  mapId: string;
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
  attackCategory: AttackCategory;
  actionState: ActionState;
  defeatState: boolean;
}

export interface ResourcePickup {
  id: string;
  mapId: string;
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
  mapId: string;
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

export interface ScenarioWorldMap {
  id: string;
  name: string;
  kind: WorldMapKind;
  map: MapDefinition;
  terrainRegions?: TerrainRegion[];
  movementObjectRegions?: MovementObjectRegion[];
}

export interface LinkedMapTravelLink {
  id: string;
  sourceMapId: string;
  sourcePosition: Position;
  triggerKind: MapTravelTriggerKind;
  destinationMapId: string;
  destinationPosition: Position;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  map: MapDefinition;
  terrainRegions?: TerrainRegion[];
  movementObjectRegions?: MovementObjectRegion[];
  worldMaps?: ScenarioWorldMap[];
  mapLinks?: LinkedMapTravelLink[];
  players: ScenarioPlayer[];
  heroes: ScenarioHero[];
  units: ScenarioUnit[];
  resourcePickups: ResourcePickup[];
  guardedLocations: GuardedLocation[];
  guardForces: GuardForce[];
  victoryCondition: VictoryCondition;
}

export interface ScenarioOption {
  id: string;
  label: string;
  description: string;
}

export interface MapTravelState {
  activeMapId: string;
  lastMapId: string | null;
  lastTravelLinkId: string | null;
  transitionMessage: string | null;
  travelHistory: string[];
}

export interface BattleParticipant {
  unitId: string;
  side: BattleSide;
  orderKey: number;
}

export interface BattleFormationSlot {
  side: BattleSide;
  rowIndex: number;
  columnIndex: number;
  unitId: string | null;
  isOccupied: boolean;
}

export interface BattleFormation {
  rows: number;
  columns: number;
  attackerSlots: BattleFormationSlot[];
  defenderSlots: BattleFormationSlot[];
}

export interface BattleTargetingState {
  activeUnitId: string;
  selectedTargetUnitId: string | null;
  legalTargetUnitIds: string[];
  canStrike: boolean;
  canDefend: boolean;
}

export interface BattleDefendState {
  unitId: string;
  damageMultiplier: number;
  expiresOnUnitTurnId: string;
  isActive: boolean;
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
  formation: BattleFormation;
  turnQueue: string[];
  activeUnitId: string;
  targetingState: BattleTargetingState | null;
  defendStates: BattleDefendState[];
  battleState: BattleState;
  outcome: BattleOutcome | null;
}

export interface GameState {
  scenario: ScenarioDefinition;
  activeScenarioId: string | null;
  availableScenarioOptions: ScenarioOption[];
  activePlayerId: string;
  selectedHeroId: string | null;
  sceneMode: SceneMode;
  battle: Battle | null;
  messageLog: string[];
  winnerPlayerId: string | null;
  routeFeedback: RouteFeedback | null;
  activeRoutePreview: RoutePreview | null;
  storybookState: StorybookState | null;
  mapViewState: MapViewState;
  mapTravelState: MapTravelState;
  visualStates: VisualStateTracker;
  activeVisualTemplateId: string;
  mobileLayoutState: MobileLayoutState;
  responsiveCanvasView: ResponsiveCanvasView;
  lastTouchInteraction: TouchInteraction | null;
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

const DEFAULT_MAIN_MAP_ID = "main-map";

export function getScenarioWorldMaps(scenario: ScenarioDefinition): ScenarioWorldMap[] {
  if (scenario.worldMaps && scenario.worldMaps.length > 0) {
    return scenario.worldMaps;
  }

  return [
    {
      id: DEFAULT_MAIN_MAP_ID,
      name: scenario.name,
      kind: "main",
      map: scenario.map,
      terrainRegions: scenario.terrainRegions,
      movementObjectRegions: scenario.movementObjectRegions
    }
  ];
}

export function getMainWorldMapId(scenario: ScenarioDefinition): string {
  return getScenarioWorldMaps(scenario).find((worldMap) => worldMap.kind === "main")?.id ?? DEFAULT_MAIN_MAP_ID;
}

export function getWorldMapById(scenario: ScenarioDefinition, mapId: string): ScenarioWorldMap | undefined {
  return getScenarioWorldMaps(scenario).find((worldMap) => worldMap.id === mapId);
}

export function applyScenarioWorldMap(scenario: ScenarioDefinition, mapId: string): void {
  const worldMap = getWorldMapById(scenario, mapId);
  if (!worldMap) {
    throw new Error(`Unknown world map: ${mapId}`);
  }

  scenario.map = worldMap.map;
  scenario.terrainRegions = worldMap.terrainRegions;
  scenario.movementObjectRegions = worldMap.movementObjectRegions;
}

export function resolveTravelLinkAtPosition(
  scenario: ScenarioDefinition,
  mapId: string,
  position: Position
): LinkedMapTravelLink | undefined {
  return scenario.mapLinks?.find(
    (link) => link.sourceMapId === mapId && link.sourcePosition.x === position.x && link.sourcePosition.y === position.y
  );
}
