import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { plotRoutePreview } from "../../src/engine/map/heroActions";
import { renderMapScene } from "../../src/render/canvas/renderMapScene";
import { createMockCanvasContext } from "../integration/render/renderTestContext";

describe("campaign map presentation contract", () => {
  test("renders semantic layers without per-cell grid borders and keeps route feedback above fog", () => {
    const state = createInitialState("advanced-terrain-scenario");
    expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true);
    const calls: string[] = [];
    const context = createMockCanvasContext() as CanvasRenderingContext2D & {
      strokeRect: (...args: number[]) => void;
      fillRect: (...args: number[]) => void;
      stroke: () => void;
    };
    const fillRect = context.fillRect.bind(context);
    context.fillRect = (...args: number[]) => {
      calls.push("fill");
      fillRect(...args);
    };
    context.strokeRect = () => calls.push("strokeRect");
    context.stroke = () => calls.push("stroke");

    renderMapScene(context, state);

    // The only rectangle outline is the selected hero; terrain is composed from layers.
    expect(calls.filter((call) => call === "strokeRect").length).toBeLessThan(8);
    expect(calls.filter((call) => call === "fill").length).toBeGreaterThan(0);
    expect(calls.lastIndexOf("stroke")).toBeGreaterThan(calls.lastIndexOf("fill"));
  });
});
