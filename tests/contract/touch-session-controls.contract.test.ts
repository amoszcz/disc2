import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { renderBattleHud } from "../../src/ui/overlays/battleHud";
import { createMobileLayoutState } from "../../src/render/canvas/viewportRender";

describe("touch session controls contract", () => {
  test("presents touch-oriented map controls in mobile layout", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);

    expect(state.mobileLayoutState.layoutMode).toBe("mobile");
  });

  test("presents touch-oriented battle targeting guidance", () => {
    const state = createInitialState();
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    state.sceneMode = "battle";

    const html = renderBattleHud(state);

    expect(html).toContain("Tap an enemy card to target it");
    expect(html).toContain('data-testid="battle-attack-button"');
  });
});
