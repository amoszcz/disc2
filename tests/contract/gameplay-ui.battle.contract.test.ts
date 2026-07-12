import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { renderBattleHud } from "../../src/ui/overlays/battleHud";

describe("battle HUD contract", () => {
  test("shows a visible queue and active unit", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    const html = renderBattleHud(state);

    expect(html).toContain('data-testid="battle-queue"');
    expect(html).toContain('data-testid="battle-active-unit"');
    expect(html).toContain("Archer");
  });
});
