import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { advanceBattleQueue } from "../../../src/engine/battle/battleTurnEngine";
import { renderBattleTurnQueue } from "../../../src/ui/panels/battleTurnQueue";

describe("battle queue presentation flow", () => {
  test("follows current queue order and active unit after battle advancement", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");

    advanceBattleQueue(state, state.battle);
    const html = renderBattleTurnQueue(state);

    expect(html).toContain('battle-queue-item active" data-testid="battle-queue-item" data-unit-id="hero-unit-3"');
  });

  test("omits a defeated unit from the presented queue", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    const defeated = state.scenario.units.find((unit) => unit.id === "guard-unit-1");
    if (!defeated) throw new Error("Expected guard unit.");
    defeated.currentHealth = 0;
    defeated.defeatState = true;

    expect(renderBattleTurnQueue(state)).not.toContain('data-unit-id="guard-unit-1"');
  });
});
