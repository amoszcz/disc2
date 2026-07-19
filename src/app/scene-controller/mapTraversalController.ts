import { advanceRoutePreviewStep } from "../../engine/map/heroActions";
import { startGuardEncounter } from "../../engine/map/startGuardEncounter";
import { appendMessage, setBattleState, type GameStore } from "../state/gameState";

const STEP_INTERVAL_MS = 1000;

export interface MapTraversalController {
  start(): boolean;
  stop(): void;
  isActive(): boolean;
}

export function createMapTraversalController(store: GameStore): MapTraversalController {
  let timer: number | null = null;

  const stop = (): void => {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    store.update((state) => { state.activeTraversal = null; });
  };

  const tick = (): void => {
    let shouldStop = false;
    store.update((state) => {
      const traversal = state.activeTraversal;
      if (!traversal || (state.sceneMode !== "map" && state.sceneMode !== "settings") || state.selectedHeroId !== traversal.heroId) {
        shouldStop = true;
        return;
      }
      const result = advanceRoutePreviewStep(state);
      if (!result.ok || !result.routeProgress) {
        appendMessage(state, result.reason ?? "Route traversal stopped.");
        shouldStop = true;
        return;
      }
      const progress = result.routeProgress;
      appendMessage(state, `${state.scenario.heroes.find((hero) => hero.id === traversal.heroId)?.name ?? "Hero"} moved to (${progress.finalPosition.x + 1}, ${progress.finalPosition.y + 1}).`);
      const encounter = startGuardEncounter(state, traversal.heroId);
      if (encounter.ok) {
        setBattleState(state, encounter.battle);
        appendMessage(state, `The guards of ${encounter.location.name} attack.`);
        shouldStop = true;
        return;
      }
      if (progress.remainingSteps.length === 0 || !state.activeRoutePreview) shouldStop = true;
    });
    if (shouldStop) stop();
  };

  return {
    start() {
      const state = store.getState();
      const route = state.activeRoutePreview;
      if (timer !== null || !route || !state.selectedHeroId || route.heroId !== state.selectedHeroId) return false;
      store.update((current) => {
        current.activeTraversal = {
          heroId: route.heroId,
          destinationPosition: { ...route.destinationPosition },
          status: "active"
        };
        appendMessage(current, "Hero traversal started: one tile per second.");
      });
      timer = window.setInterval(tick, STEP_INTERVAL_MS);
      return true;
    },
    stop,
    isActive: () => timer !== null
  };
}
