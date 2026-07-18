import { describe, expect, test } from "vitest";
import { parseAtlasDocument, validateAtlas } from "../../src/developer/sprite-mapping/atlasMapping";

describe("sprite mapping save contract", () => {
  test("requires every adjusted entry to remain in bounds before save", () => {
    const atlas = parseAtlasDocument({ sheet: "atlas.png", sheet_width: 10, sheet_height: 10, sprites: [{ subject_id: "a", x: 0, y: 0, width: 5, height: 5 }] });
    expect(validateAtlas(atlas, 10, 10, { bulkOffset: { x: 6, y: 0 }, entryOverrides: {} }).filter((issue) => issue.entryId).length).toBe(1);
  });
});
