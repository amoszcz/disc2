import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { getCurrentVisibleTileKeys } from "../../../src/engine/map/fogOfWar";

describe("fog of war state flow", () => {
  test("merges visibility from active-player heroes and clamps it to map bounds", () => {
    const state = createInitialState("core-map-loop");
    const visible = getCurrentVisibleTileKeys(state);
    expect(visible).toHaveLength(16);
    expect(visible.has("3,2")).toBe(true);
    expect(visible.has("4,4")).toBe(false);
  });
});
