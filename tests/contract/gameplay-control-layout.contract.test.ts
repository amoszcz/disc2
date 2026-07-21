import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { renderBattleTurnQueue } from "../../src/ui/panels/battleTurnQueue";
import { renderMapActionBar } from "../../src/ui/panels/mapActionBar";

describe("gameplay control layout contract", () => {
  test("renders compact named map action icons exactly once", () => {
    const html = renderMapActionBar();

    expect(html).toContain('data-testid="map-action-bar"');
    expect(html).toContain('data-testid="map-zoom-out-button"');
    expect(html).toContain('data-testid="map-zoom-in-button"');
    expect(html).toContain('data-testid="end-turn-button"');
    expect(html).toContain('title="Zoom Out"');
    expect(html).toContain('title="Zoom In"');
    expect(html).toContain('title="End Turn"');
    expect(html).toContain('class="ui-button ui-button--icon ui-button--default map-action-icon"');
    expect(html).toContain("map-action-icon--end-turn");
    expect(html).not.toContain(">Zoom Out<");
    expect(html).not.toContain(">End Turn<");
  });

  test("renders a horizontal template-backed battle queue from current turn order", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    const html = renderBattleTurnQueue(state);

    expect(html).toContain('data-testid="battle-queue"');
    expect(html).toContain('data-testid="battle-turn-queue"');
    expect(html).toContain('data-template-id="unit-archer"');
    expect(html).toContain('title="Archer"');
    expect(html.indexOf('data-unit-id="hero-unit-2"')).toBeLessThan(html.indexOf('data-unit-id="hero-unit-3"'));
    expect(html).toContain('battle-queue-item active');
  });
});
