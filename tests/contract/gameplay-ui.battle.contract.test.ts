import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { renderBattleHud } from "../../src/ui/overlays/battleHud";
import { renderBattleTurnQueue } from "../../src/ui/panels/battleTurnQueue";

describe("battle HUD contract", () => {
  test("shows the queue, active unit, target state, and both battle actions", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    const html = renderBattleHud(state);

    expect(renderBattleTurnQueue(state)).toContain('data-testid="battle-queue"');
    expect(html).toContain('data-testid="battle-active-unit"');
    expect(html).toContain('data-testid="battle-selected-target"');
    expect(html).toContain('data-testid="battle-target-message"');
    expect(html).toContain("Archer");
    expect(html).toContain("Strike");
    expect(html).toContain("Defend");
  });

  test("locks battle actions while a state template is being displayed", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    state.battle.isTransitioning = true;

    const html = renderBattleHud(state);

    expect(html).toMatch(/data-testid="battle-attack-button" disabled/);
    expect(html).toMatch(/data-testid="battle-defend-button" disabled/);
  });
});
