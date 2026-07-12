import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { moveSelectedHero } from "../../src/engine/map/heroActions";
import { renderErrorOverlay } from "../../src/ui/overlays/errorOverlay";

describe("blocked terrain feedback contract", () => {
  test("reports blocked terrain reasons separately from the main message", () => {
    const state = createInitialState("advanced-terrain-scenario");
    const hero = state.scenario.heroes[0];

    hero.mapPosition = { x: 19, y: 10 };
    hero.remainingMovement = 8;

    const result = moveSelectedHero(state, { x: 20, y: 10 });
    const html = renderErrorOverlay(result.reason ?? "That move is not allowed.", state.routeFeedback?.blockedReason);

    expect(result.ok).toBe(false);
    expect(html).toContain('data-testid="error-detail">rivers cannot be traversed.<');
  });
});
