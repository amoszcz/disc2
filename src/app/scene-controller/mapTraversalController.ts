import { advanceRoutePreviewStep } from "../../engine/map/heroActions";
import { startGuardEncounter } from "../../engine/map/startGuardEncounter";
import { appendMessage, setBattleState, type GameStore } from "../state/gameState";

const STEP_INTERVAL_MS = 1000;

export interface MapTraversalController {
  start(): boolean;
  stop(): void;
  isActive(): boolean;
}

export function canAnimateTraversalStep(remainingMovement: number, stepMovementCost: number): boolean {
  return stepMovementCost <= remainingMovement;
}

export function createMapTraversalController(store: GameStore): MapTraversalController {
  let timer: number | null = null;
  let animationFrame: number | null = null;
  let segmentStartedAt = 0;

  const stop = (): void => {
    if (timer !== null) window.clearInterval(timer);
    if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    timer = null;
    animationFrame = null;
    store.update((state) => { state.activeTraversal = null; });
  };

  const drawSegment = (timestamp: number): void => {
    store.update((state) => {
      if (!state.activeTraversal) return;
      state.activeTraversal.progress = Math.min(1, Math.max(0, (timestamp - segmentStartedAt) / STEP_INTERVAL_MS));
    });
    if (store.getState().activeTraversal) animationFrame = window.requestAnimationFrame(drawSegment);
    else animationFrame = null;
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
      else {
        const nextStep = state.activeRoutePreview.steps[0];
        const hero = state.scenario.heroes.find((entry) => entry.id === traversal.heroId);
        if (!nextStep || !hero || !canAnimateTraversalStep(hero.remainingMovement, nextStep.movementCost)) {
          shouldStop = true;
          return;
        }
        traversal.fromPosition = { ...progress.finalPosition };
        traversal.toPosition = { ...nextStep.position };
        traversal.progress = 0;
        segmentStartedAt = performance.now();
      }
    });
    if (shouldStop) stop();
  };

  return {
    start() {
      const state = store.getState();
      const route = state.activeRoutePreview;
      if (timer !== null || !route || !state.selectedHeroId || route.heroId !== state.selectedHeroId) return false;
      const hero = state.scenario.heroes.find((entry) => entry.id === route.heroId);
      const firstStep = route.steps[0];
      if (!hero || !firstStep || !canAnimateTraversalStep(hero.remainingMovement, firstStep.movementCost)) return false;
      segmentStartedAt = performance.now();
      store.update((current) => {
        current.activeTraversal = {
          heroId: route.heroId,
          destinationPosition: { ...route.destinationPosition },
          status: "active",
          fromPosition: { ...hero.mapPosition },
          toPosition: { ...firstStep.position },
          progress: 0
        };
        appendMessage(current, "Hero traversal started: one tile per second.");
      });
      timer = window.setInterval(tick, STEP_INTERVAL_MS);
      animationFrame = window.requestAnimationFrame(drawSegment);
      return true;
    },
    stop,
    isActive: () => timer !== null
  };
}
