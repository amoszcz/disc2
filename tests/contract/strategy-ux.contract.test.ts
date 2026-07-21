import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { trySelectBattleTarget } from "../../src/engine/battle/battleTurnEngine";
import { plotRoutePreview } from "../../src/engine/map/heroActions";
import { renderMapHud } from "../../src/ui/hud/mapHud";
import { renderBattleHud } from "../../src/ui/overlays/battleHud";

describe("strategy UX contract", () => {
  test("shows route recovery and its known end-turn consequence before commitment", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });
    const html = renderMapHud(state);

    expect(html).toContain('data-testid="route-cancel-button"');
    expect(html).toContain('data-testid="route-preview-guidance"');
    expect(html).toContain("Ending the turn will advance the plotted route");
  });

  test("explains unavailable battle actions and exposes target recovery", () => {
    const state = createInitialState();
    const battle = createBattle(state, "hero-1", "guard-force-1");
    state.battle = battle;
    expect(trySelectBattleTarget(state, battle, "guard-unit-1")).toBe(true);
    expect(renderBattleHud(state)).toContain('data-testid="battle-clear-target-button"');

    battle.isTransitioning = true;
    const html = renderBattleHud(state);
    expect(html).toContain('data-testid="battle-strike-unavailable-reason"');
    expect(html).toContain("Wait for the current battle action to finish.");
  });
});
