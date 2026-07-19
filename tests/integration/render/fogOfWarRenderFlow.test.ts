import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { fogTileKey, getFogTileState } from "../../../src/engine/map/fogOfWar";
import { createCenteredViewport } from "../../../src/engine/map/viewportMath";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { createMockCanvasContext } from "./renderTestContext";

describe("fog-of-war render flow", () => {
  test("keeps unexplored terrain renderable, hides its map content, and aligns the fog to tile bounds", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.gameSettings.fogVisibilityRadius = 1;
    state.fogOfWar.visitedTilesByMapId = {};
    state.mapViewState.viewport = createCenteredViewport(state.scenario.map, { x: 5, y: 10 });

    const fillRects: Array<{ style: unknown; x: number; y: number; width: number; height: number }> = [];
    const context = createMockCanvasContext();
    context.fillRect = (x, y, width, height) => {
      fillRects.push({ style: context.fillStyle, x, y, width, height });
    };

    renderMapScene(context, state);

    expect(getFogTileState(state, { x: 5, y: 10 })).toBe("visible");
    expect(getFogTileState(state, { x: 10, y: 10 })).toBe("unexplored");
    expect(fillRects.some((entry) => entry.style === "rgba(16, 22, 32, 0.9)" && entry.width === entry.height)).toBe(true);

    state.fogOfWar.visitedTilesByMapId.surface = [fogTileKey({ x: 10, y: 10 })];
    fillRects.length = 0;
    renderMapScene(context, state);
    expect(fillRects.some((entry) => entry.style === "rgba(16, 22, 32, 0.5)" && entry.width === entry.height)).toBe(true);
  });
});
