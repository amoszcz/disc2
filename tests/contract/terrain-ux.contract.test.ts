import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { moveSelectedHero } from "../../src/engine/map/heroActions";
import { renderMapHud } from "../../src/ui/hud/mapHud";
import { renderGuardStatusOverlay } from "../../src/ui/overlays/guardStatusOverlay";

describe("terrain UX contract", () => {
  test("includes a terrain legend and route explanation for planning", () => {
    const state = createInitialState("advanced-terrain-scenario");
    moveSelectedHero(state, { x: 6, y: 10 });

    const hudHtml = renderMapHud(state);
    const overlayHtml = renderGuardStatusOverlay("Route Preview", `${state.routeFeedback?.terrainLabel}: ${state.routeFeedback?.movementImpact}.`);

    expect(hudHtml).toContain('data-testid="terrain-legend"');
    expect(hudHtml).toContain("Road");
    expect(hudHtml).toContain("blocked");
    expect(overlayHtml).toContain("Route Preview");
    expect(overlayHtml).toContain("Road: 1 movement.");
  });
});
