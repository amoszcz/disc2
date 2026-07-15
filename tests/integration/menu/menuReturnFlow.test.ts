import { describe, expect, test } from "vitest";
import { createInitialState, returnToMainMenu, startScenarioSession } from "../../../src/app/state/gameState";
import { renderVictoryMenu } from "../../../src/ui/overlays/victoryMenu";

describe("menu return flow", () => {
  test("victory view exposes a return-to-menu action", () => {
    const state = createInitialState();
    state.winnerPlayerId = "player-1";
    state.sceneMode = "victory";

    const html = renderVictoryMenu(state);

    expect(html).toContain('data-testid="victory-panel"');
    expect(html).toContain('data-testid="return-to-menu-button"');
  });

  test("returning to the menu allows a fresh replay of the same scenario", () => {
    const state = createInitialState();
    state.sceneMode = "victory";
    state.winnerPlayerId = "player-1";
    state.scenario.heroes[0].remainingMovement = 0;

    returnToMainMenu(state);
    startScenarioSession(state, "core-map-loop");

    expect(state.sceneMode).toBe("map");
    expect(state.scenario.id).toBe("core-map-loop");
    expect(state.scenario.heroes[0].remainingMovement).toBe(2);
  });
});
