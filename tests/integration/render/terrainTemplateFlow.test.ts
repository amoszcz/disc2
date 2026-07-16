import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { getVisualTemplateDiagnostics } from "../../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "./renderTestContext";

describe("terrain template flow", () => {
  test("records dedicated terrain coverage for all current terrain types in the advanced scenario", () => {
    const state = createInitialState("advanced-terrain-scenario");

    renderMapScene(createMockCanvasContext(), state);

    const terrainTypes = new Set(
      getVisualTemplateDiagnostics()
        .map.filter((entry) => entry.subjectKind === "terrain")
        .map((entry) => entry.subjectType)
    );

    expect(terrainTypes).toEqual(new Set(["road", "grass", "plains", "mud", "woods", "mountains", "lakes", "rivers"]));
  });
});
