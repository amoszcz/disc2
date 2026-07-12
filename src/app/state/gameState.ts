import { loadScenario, type ScenarioId } from "../../engine/scenario/loadScenario";
import type { Battle, GameState, MapViewState, ScenarioDefinition, SceneMode } from "../../engine/scenario/types";
import { createViewport } from "../../engine/map/viewportMath";
import { evaluateDefaultVictory } from "../../engine/victory/checkVictory";

export function createDefaultMapViewState(scenario: ScenarioDefinition): MapViewState {
  return {
    viewport: createViewport(scenario.map),
    panGesture: null,
    lastSceneMode: "map",
    isDefaultView: true
  };
}

export function createInitialState(scenarioId: ScenarioId = "core-map-loop"): GameState {
  const scenario = loadScenario(scenarioId);
  const activePlayerId = scenario.players.find((player) => player.kind === "player")?.id ?? scenario.players[0].id;
  const selectedHeroId = scenario.heroes.find((hero) => hero.ownerPlayerId === activePlayerId)?.id ?? null;

  return {
    scenario,
    activePlayerId,
    selectedHeroId,
    sceneMode: "map",
    battle: null,
    messageLog: ["Aren arrives at the borderlands."],
    winnerPlayerId: null,
    routeFeedback: null,
    mapViewState: createDefaultMapViewState(scenario)
  };
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
