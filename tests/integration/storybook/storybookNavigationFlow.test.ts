import { describe, expect, test } from "vitest";
import { createMenuState, openStorybook, returnToMainMenu } from "../../../src/app/state/gameState";

describe("storybook navigation flow", () => {
  test("opening the storybook from the menu creates a review session without starting a scenario", () => {
    const state = createMenuState();

    openStorybook(state);

    expect(state.sceneMode).toBe("storybook");
    expect(state.activeScenarioId).toBeNull();
    expect(state.storybookState?.subjects.length).toBeGreaterThan(0);
    expect(state.storybookState?.selectedSubjectId).not.toBeNull();
  });

  test("returning to the menu from the storybook clears review state safely", () => {
    const state = createMenuState();
    openStorybook(state);

    returnToMainMenu(state);

    expect(state.sceneMode).toBe("menu");
    expect(state.storybookState).toBeNull();
    expect(state.activeScenarioId).toBeNull();
  });
});
