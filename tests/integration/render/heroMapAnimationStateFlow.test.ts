import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { moveSelectedHero, plotRoutePreview } from "../../../src/engine/map/heroActions";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { getVisualTemplateDiagnostics } from "../../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "./renderTestContext";

describe("hero map animation state flow", () => {
  test("renders start-move when a route preview is awaiting confirmation", () => {
    const state = createInitialState("core-map-loop");
    plotRoutePreview(state, { x: 1, y: 2 });

    renderMapScene(createMockCanvasContext(), state);

    expect(
      getVisualTemplateDiagnostics().map.find((entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren")
    ).toMatchObject({
      requestedStateName: "start-move",
      resolvedStateName: "start-move",
      stateDirection: "right"
    });
  });

  test("renders interact after the hero collects a pickup during movement", () => {
    const state = createInitialState("core-map-loop");
    moveSelectedHero(state, { x: 1, y: 2 });

    renderMapScene(createMockCanvasContext(), state);

    expect(
      getVisualTemplateDiagnostics().map.find((entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren")
    ).toMatchObject({
      requestedStateName: "interact",
      resolvedStateName: "interact",
      stateDirection: "right"
    });
  });
});
