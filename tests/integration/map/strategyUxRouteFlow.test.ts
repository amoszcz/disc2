import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { clearOwnedRoutePreview, plotRoutePreview } from "../../../src/engine/map/heroActions";

describe("strategy UX route recovery", () => {
  test("replaces and cancels an uncommitted route without spending movement", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const movement = state.scenario.heroes[0].remainingMovement;
    expect(plotRoutePreview(state, { x: 6, y: 10 }).ok).toBe(true);
    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);
    expect(clearOwnedRoutePreview(state, "hero-1").ok).toBe(true);
    expect(state.activeRoutePreview).toBeNull();
    expect(state.scenario.heroes[0].remainingMovement).toBe(movement);
  });
});
