import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { moveSelectedHero } from "../../src/engine/map/heroActions";
import { renderMapHud } from "../../src/ui/hud/mapHud";
import { renderGuardStatusOverlay } from "../../src/ui/overlays/guardStatusOverlay";

describe("movement object UX contract", () => {
  test("route preview surfaces object labels and explanations", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.scenario.heroes[0].mapPosition = { x: 19, y: 30 };
    state.scenario.heroes[0].remainingMovement = 8;
    moveSelectedHero(state, { x: 20, y: 30 });

    const hudHtml = renderMapHud(state);
    const overlayHtml = renderGuardStatusOverlay(
      "Route Preview",
      `${state.routeFeedback?.terrainLabel}: ${state.routeFeedback?.movementImpact}.`,
      state.routeFeedback?.stackExplanation
    );

    expect(hudHtml).toContain('data-testid="route-objects"');
    expect(hudHtml).toContain("Bridge, Rubble");
    expect(hudHtml).toContain("Bridge + Rubble combine for a final cost of 2.");
    expect(overlayHtml).toContain('data-testid="guard-status-detail"');
    expect(overlayHtml).toContain("Bridge + Rubble combine for a final cost of 2.");
  });
});
