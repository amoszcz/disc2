import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { moveSelectedHero } from "../../src/engine/map/heroActions";
import { renderMapHud } from "../../src/ui/hud/mapHud";

describe("terrain movement feedback contract", () => {
  test("shows terrain label and movement impact after a legal move", () => {
    const state = createInitialState("advanced-terrain-scenario");

    expect(moveSelectedHero(state, { x: 6, y: 10 }).ok).toBe(true);

    const html = renderMapHud(state);
    expect(html).toContain('data-testid="route-terrain">Road<');
    expect(html).toContain('data-testid="route-impact">1 movement<');
  });
});
