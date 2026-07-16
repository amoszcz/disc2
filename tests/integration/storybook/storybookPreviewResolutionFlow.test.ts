import { describe, expect, test } from "vitest";
import { createMenuState, openStorybook, updateStorybookSubjectSelection } from "../../../src/app/state/gameState";
import { renderStorybookScene, getStorybookPreviewDiagnostics } from "../../../src/render/canvas/renderStorybookScene";
import { createMockCanvasContext } from "../render/renderTestContext";

describe("storybook preview resolution flow", () => {
  test("selected storybook subjects resolve through the shared preview seam", () => {
    const state = createMenuState();
    openStorybook(state);

    const archerSubject = state.storybookState?.subjects.find((subject) => subject.subjectType === "Archer");
    if (!archerSubject) {
      throw new Error("Archer storybook subject was not available.");
    }

    updateStorybookSubjectSelection(state, archerSubject.subjectId, "shoot");
    renderStorybookScene(createMockCanvasContext(), state);

    expect(getStorybookPreviewDiagnostics().find((entry) => entry.subjectType === "Archer")).toMatchObject({
      requestedStateName: "shoot",
      resolvedStateName: "shoot",
      isFallback: false
    });
  });

  test("hero directional selections preserve their requested facing direction", () => {
    const state = createMenuState();
    openStorybook(state);

    const heroSubject = state.storybookState?.subjects.find((subject) => subject.subjectType === "Aren");
    if (!heroSubject) {
      throw new Error("Aren storybook subject was not available.");
    }

    updateStorybookSubjectSelection(state, heroSubject.subjectId, "start-move-right");
    renderStorybookScene(createMockCanvasContext(), state);

    expect(getStorybookPreviewDiagnostics().find((entry) => entry.subjectType === "Aren")).toMatchObject({
      requestedStateName: "start-move",
      resolvedStateName: "start-move",
      stateDirection: "right"
    });
  });
});
