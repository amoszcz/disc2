import { describe, expect, test } from "vitest";
import { createInitialState, createMenuState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { renderMapHud } from "../../src/ui/hud/mapHud";
import { renderBattleHud } from "../../src/ui/overlays/battleHud";
import { renderMainMenu } from "../../src/ui/overlays/mainMenu";
import { renderSettingsPanel } from "../../src/ui/overlays/settingsPanel";
import { renderStorybookPanel } from "../../src/ui/overlays/storybookPanel";
import { renderVictoryMenu } from "../../src/ui/overlays/victoryMenu";
import { renderEndTurnPanel } from "../../src/ui/panels/endTurnPanel";
import { renderMapActionBar } from "../../src/ui/panels/mapActionBar";

function expectEveryButtonToUseSharedPresentation(html: string): void {
  const buttons = [...html.matchAll(/<button\b[^>]*>/g)].map(([button]) => button);
  expect(buttons.length).toBeGreaterThan(0);
  buttons.forEach((button) => expect(button).toContain("ui-button"));
}

describe("button migration contract", () => {
  test("all player-facing rendered surfaces use the shared button presentation", () => {
    const menu = createMenuState();
    const game = createInitialState();

    [
      renderMainMenu(menu),
      renderMapHud(game),
      renderMapActionBar(),
      renderEndTurnPanel(game),
      renderSettingsPanel(game),
      renderVictoryMenu(game),
      renderStorybookPanel(game)
    ].forEach(expectEveryButtonToUseSharedPresentation);
  });

  test("battle actions remain shared buttons when battle state is active", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");

    expectEveryButtonToUseSharedPresentation(renderBattleHud(state));
  });
});
