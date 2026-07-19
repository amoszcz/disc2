import { describe, expect, test } from "vitest";
import { createInitialState, GameStore } from "../../../src/app/state/gameState";
import { advanceRoutePreviewStep, plotRoutePreview } from "../../../src/engine/map/heroActions";
import { isImmediateMovementBehavior } from "../../../src/app/state/gameSettings";
import { canAnimateTraversalStep } from "../../../src/app/scene-controller/mapTraversalController";
import { endMapTurn } from "../../../src/ui/panels/mapActionBar";

describe("route traversal flow", () => {
  test("reaches a route destination over separate one-step advances", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });
    advanceRoutePreviewStep(state);
    const final = advanceRoutePreviewStep(state);

    expect(final.routeProgress?.completionState).toBe("completed");
    expect(state.scenario.heroes[0].mapPosition).toEqual({ x: 7, y: 11 });
    expect(state.activeRoutePreview).toBeNull();
  });

  test("keeps a non-immediate compatibility setting on the traversal path", () => {
    const compatibilitySetting = "future-non-immediate-setting";

    expect(isImmediateMovementBehavior(compatibilitySetting)).toBe(false);
  });

  test("does not start a visual segment for an unaffordable route step", () => {
    expect(canAnimateTraversalStep(1, 1)).toBe(true);
    expect(canAnimateTraversalStep(1, 2)).toBe(false);
  });

  test("does not end the turn while a route traversal is active", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.activeTraversal = {
      heroId: "hero-1",
      destinationPosition: { x: 6, y: 10 },
      status: "active",
      fromPosition: { x: 5, y: 10 },
      toPosition: { x: 6, y: 10 },
      progress: 0.5
    };
    const store = new GameStore(state);

    endMapTurn(store);

    expect(store.getState().activePlayerId).toBe("player-1");
    expect(store.getState().activeTraversal).not.toBeNull();
  });
});
