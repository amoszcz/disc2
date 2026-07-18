import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createCenteredViewport } from "../../../src/engine/map/viewportMath";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { getVisualTemplateDiagnostics } from "../../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "./renderTestContext";

describe("terrain template flow", () => {
  test("records dedicated terrain coverage for all current terrain types in the advanced scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");

    const terrainTypes = new Set<string>();
    for (const position of [
      { x: 5, y: 10 },
      { x: 5, y: 12 },
      { x: 14, y: 18 },
      { x: 8, y: 24 },
      { x: 34, y: 6 },
      { x: 26, y: 26 },
      { x: 20, y: 40 }
    ]) {
      state.mapViewState.viewport = createCenteredViewport(state.scenario.map, position);
      renderMapScene(createMockCanvasContext(), state);
      for (const entry of getVisualTemplateDiagnostics().map.filter((diagnostic) => diagnostic.subjectKind === "terrain")) {
        terrainTypes.add(entry.subjectType);
      }
    }

    expect(terrainTypes).toEqual(new Set(["road", "grass", "plains", "mud", "woods", "mountains", "lakes", "rivers"]));
  });
});
