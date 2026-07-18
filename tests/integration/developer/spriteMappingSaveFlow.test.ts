import { describe, expect, test } from "vitest";
import { applyMappingChanges, parseAtlasDocument } from "../../../src/developer/sprite-mapping/atlasMapping";

describe("sprite mapping save flow", () => {
  test("builds a persisted map with a shared offset", () => {
    const atlas = parseAtlasDocument({ sheet: "atlas.png", sheet_width: 10, sheet_height: 10, sprites: [{ subject_id: "a", x: 1, y: 1, width: 2, height: 2 }] });
    expect((applyMappingChanges(atlas, { bulkOffset: { x: 2, y: 3 }, entryOverrides: {} }) as { sprites: Array<{ x: number; y: number }> }).sprites[0]).toEqual(expect.objectContaining({ x: 3, y: 4 }));
  });
});
