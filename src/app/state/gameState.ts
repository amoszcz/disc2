import { getDefaultScenarioId, getScenarioOptions, loadScenario, type ScenarioId } from "../../engine/scenario/loadScenario";
import {
  applyScenarioWorldMap,
  type BattleUnitVisualStateRuntime,
  type FacingDirection,
  getMainWorldMapId,
  type Battle,
  type GameState,
  type HeroVisualStateRuntime,
  type MapTravelState,
  type MapViewState,
  type ScenarioDefinition,
  type SceneMode,
  type VisualStateTracker
} from "../../engine/scenario/types";
import { createViewport } from "../../engine/map/viewportMath";
import { evaluateDefaultVictory } from "../../engine/victory/checkVictory";
import { getDefaultMobileLayoutState, getDefaultResponsiveCanvasView } from "../../render/canvas/viewportRender";

export function createDefaultMapViewState(scenario: ScenarioDefinition): MapViewState {
  return {
    viewport: createViewport(
      scenario.map,
      getDefaultResponsiveCanvasView().pixelWidth,
      getDefaultResponsiveCanvasView().pixelHeight
    ),
    panGesture: null,
    zoomGesture: null,
    lastSceneMode: "map",
    isDefaultView: true
  };
}

function createInitialMapTravelState(scenario: ScenarioDefinition): MapTravelState {
  return {
    activeMapId: getMainWorldMapId(scenario),
    lastMapId: null,
    lastTravelLinkId: null,
    transitionMessage: null,
    travelHistory: []
  };
}

function createInitialHeroVisualState(direction: FacingDirection = "down"): HeroVisualStateRuntime {
  return { stateName: "idle", direction };
}

function createInitialUnitVisualState(): BattleUnitVisualStateRuntime {
  return { stateName: "idle" };
}

function createInitialVisualStates(scenario: ScenarioDefinition): VisualStateTracker {
  return {
    heroStates: Object.fromEntries(scenario.heroes.map((hero) => [hero.id, createInitialHeroVisualState()])),
    unitStates: Object.fromEntries(scenario.units.map((unit) => [unit.id, createInitialUnitVisualState()])),
    objectStates: {}
  };
}

function createSessionState(scenarioId: ScenarioId, sceneMode: SceneMode): GameState {
  const scenario = loadScenario(scenarioId);
  const activePlayerId = scenario.players.find((player) => player.kind === "player")?.id ?? scenario.players[0].id;
  const selectedHeroId = scenario.heroes.find((hero) => hero.ownerPlayerId === activePlayerId)?.id ?? null;

  return {
    scenario,
    activeScenarioId: scenarioId,
    availableScenarioOptions: getScenarioOptions(),
    activePlayerId,
    selectedHeroId,
    sceneMode,
    battle: null,
    messageLog: ["Aren arrives at the borderlands."],
    winnerPlayerId: null,
    routeFeedback: null,
    activeRoutePreview: null,
    mapViewState: createDefaultMapViewState(scenario),
    mapTravelState: createInitialMapTravelState(scenario),
    visualStates: createInitialVisualStates(scenario),
    mobileLayoutState: getDefaultMobileLayoutState(),
    responsiveCanvasView: getDefaultResponsiveCanvasView(),
    lastTouchInteraction: null
  };
}

export function createInitialState(scenarioId: ScenarioId = getDefaultScenarioId()): GameState {
  return createSessionState(scenarioId, "map");
}

export function createMenuState(): GameState {
  const defaultScenarioId = getDefaultScenarioId();
  const menuState = createSessionState(defaultScenarioId, "menu");
  menuState.activeScenarioId = null;
  menuState.selectedHeroId = null;
  menuState.messageLog = ["Choose a scenario to begin."];
  return menuState;
}

export function appendMessage(state: GameState, message: string): GameState {
  state.messageLog = [...state.messageLog.slice(-7), message];
  return state;
}

export function setBattleState(state: GameState, battle: Battle | null): GameState {
  state.mapViewState.lastSceneMode = state.sceneMode;
  state.battle = battle;
  state.sceneMode = battle ? "battle" : "map";
  return state;
}

export function setScenario(state: GameState, scenario: ScenarioDefinition): GameState {
  const previousSceneMode: SceneMode = state.sceneMode;
  state.scenario = scenario;
  state.mapViewState.lastSceneMode = previousSceneMode;
  const winnerPlayerId = evaluateDefaultVictory(scenario);
  if (winnerPlayerId) {
    state.winnerPlayerId = winnerPlayerId;
    state.sceneMode = "victory";
  }
  return state;
}

export function setActiveWorldMap(
  state: GameState,
  nextMapId: string,
  transitionMessage: string | null,
  travelLinkId: string | null
): GameState {
  const previousMapId = state.mapTravelState.activeMapId;
  applyScenarioWorldMap(state.scenario, nextMapId);
  state.mapTravelState.activeMapId = nextMapId;
  state.mapTravelState.lastMapId = previousMapId;
  state.mapTravelState.lastTravelLinkId = travelLinkId;
  state.mapTravelState.transitionMessage = transitionMessage;
  if (travelLinkId) {
    state.mapTravelState.travelHistory.push(travelLinkId);
  }
  state.activeRoutePreview = null;
  state.routeFeedback = null;
  state.mapViewState = {
    ...state.mapViewState,
    viewport: createViewport(
      state.scenario.map,
      state.responsiveCanvasView.pixelWidth,
      state.responsiveCanvasView.pixelHeight
    ),
    panGesture: null,
    zoomGesture: null,
    isDefaultView: true
  };
  return state;
}

export function startScenarioSession(state: GameState, scenarioId: ScenarioId): GameState {
  const preservedLayoutState = state.mobileLayoutState;
  const preservedCanvasView = state.responsiveCanvasView;
  const nextState = createInitialState(scenarioId);
  state.scenario = nextState.scenario;
  state.activeScenarioId = nextState.activeScenarioId;
  state.availableScenarioOptions = nextState.availableScenarioOptions;
  state.activePlayerId = nextState.activePlayerId;
  state.selectedHeroId = nextState.selectedHeroId;
  state.sceneMode = nextState.sceneMode;
  state.battle = nextState.battle;
  state.messageLog = nextState.messageLog;
  state.winnerPlayerId = nextState.winnerPlayerId;
  state.routeFeedback = nextState.routeFeedback;
  state.activeRoutePreview = nextState.activeRoutePreview;
  state.mapViewState = nextState.mapViewState;
  state.mapTravelState = nextState.mapTravelState;
  state.visualStates = nextState.visualStates;
  state.mobileLayoutState = preservedLayoutState;
  state.responsiveCanvasView = preservedCanvasView;
  state.lastTouchInteraction = nextState.lastTouchInteraction;
  return state;
}

export function returnToMainMenu(state: GameState): GameState {
  const preservedLayoutState = state.mobileLayoutState;
  const preservedCanvasView = state.responsiveCanvasView;
  const nextState = createMenuState();
  state.scenario = nextState.scenario;
  state.activeScenarioId = nextState.activeScenarioId;
  state.availableScenarioOptions = nextState.availableScenarioOptions;
  state.activePlayerId = nextState.activePlayerId;
  state.selectedHeroId = nextState.selectedHeroId;
  state.sceneMode = nextState.sceneMode;
  state.battle = nextState.battle;
  state.messageLog = nextState.messageLog;
  state.winnerPlayerId = nextState.winnerPlayerId;
  state.routeFeedback = nextState.routeFeedback;
  state.activeRoutePreview = nextState.activeRoutePreview;
  state.mapViewState = nextState.mapViewState;
  state.mapTravelState = nextState.mapTravelState;
  state.visualStates = nextState.visualStates;
  state.mobileLayoutState = preservedLayoutState;
  state.responsiveCanvasView = preservedCanvasView;
  state.lastTouchInteraction = nextState.lastTouchInteraction;
  return state;
}

export type GameListener = (state: GameState) => void;

export class GameStore {
  private state: GameState;

  private listeners = new Set<GameListener>();

  constructor(initialState: GameState = createInitialState()) {
    this.state = initialState;
  }

  getState(): GameState {
    return this.state;
  }

  update(mutator: (state: GameState) => void): void {
    mutator(this.state);
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  subscribe(listener: GameListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
