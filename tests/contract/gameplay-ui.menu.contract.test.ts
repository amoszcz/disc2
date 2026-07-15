import { describe, expect, test } from "vitest";
import { createMenuState } from "../../src/app/state/gameState";
import { renderMainMenu } from "../../src/ui/overlays/mainMenu";

describe("main menu contract", () => {
  test("shows the menu shell and one start option per available scenario", () => {
    const state = createMenuState();
    const html = renderMainMenu(state);

    expect(html).toContain('data-testid="main-menu-panel"');
    expect(html).toContain('data-testid="scenario-option-list"');
    expect(html).toContain("Border Watch");
    expect(html).toContain("Broken Causeway");
    expect(html).toContain('data-testid="scenario-start-core-map-loop"');
    expect(html).toContain('data-testid="scenario-start-advanced-terrain-scenario"');
  });
});
