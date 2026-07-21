import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { renderMapHud } from "../../src/ui/hud/mapHud";

describe("map HUD contract", () => {
  test("shows active side, hero, movement, and gold", () => {
    const state = createInitialState();
    const html = renderMapHud(state);

    expect(html).toContain("Adventure Map");
    expect(html).toContain("The Empire");
    expect(html).toContain("Aren");
    expect(html).toContain('data-testid="remaining-movement">2<');
    expect(html).toContain('data-testid="resource-gold">0<');
    expect(html).toContain('data-testid="end-turn-consequence">Ending the turn passes control to the next side.<');
  });
});
