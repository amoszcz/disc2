import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { renderBattleHud } from "../../src/ui/overlays/battleHud";

describe("battle HUD contract", () => {
  test("shows the queue, active unit, target state, and both battle actions", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    const html = renderBattleHud(state);

    expect(html).toContain('data-testid="battle-queue"');
    expect(html).toContain('data-testid="battle-active-unit"');
    expect(html).toContain('data-testid="battle-selected-target"');
    expect(html).toContain('data-testid="battle-target-message"');
    expect(html).toContain("Archer");
    expect(html).toContain("Strike");
    expect(html).toContain("Defend");
  });
});
