import { describe, expect, test } from "vitest";
import { createSpriteMappingState } from "../../../src/developer/sprite-mapping/spriteMappingState";

describe("sprite mapping alignment flow", () => {
  test("starts with reversible mapping and view state", () => {
    const state = createSpriteMappingState();
    expect(state.changes.bulkOffset).toEqual({ x: 0, y: 0 }); expect(state.zoom).toBe(1);
  });
});
