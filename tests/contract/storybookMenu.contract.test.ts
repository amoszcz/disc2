import { describe, expect, test } from "vitest";
import { createMenuState } from "../../src/app/state/gameState";
import { renderMainMenu } from "../../src/ui/overlays/mainMenu";

describe("storybook menu contract", () => {
  test("main menu exposes a dedicated storybook action alongside scenario starts", () => {
    const state = createMenuState();
    const html = renderMainMenu(state);

    expect(html).toContain('data-testid="main-menu-panel"');
    expect(html).toContain('data-testid="storybook-open-button"');
    expect(html).toContain("Asset Storybook");
    expect(html).toContain('data-testid="scenario-option-list"');
  });
});
