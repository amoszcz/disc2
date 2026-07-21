import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { plotRoutePreview } from "../../src/engine/map/heroActions";
import { renderMapHud } from "../../src/ui/hud/mapHud";

describe("strategy UX contract", () => {
  test("shows route recovery and its known end-turn consequence before commitment", () => {
    const state = createInitialState("advanced-terrain-scenario");
    plotRoutePreview(state, { x: 7, y: 11 });
    const html = renderMapHud(state);

    expect(html).toContain('data-testid="route-cancel-button"');
    expect(html).toContain('data-testid="route-preview-guidance"');
    expect(html).toContain("Ending the turn will advance the plotted route");
  });
});
