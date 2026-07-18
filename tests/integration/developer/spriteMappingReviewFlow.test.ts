import { describe, expect, test } from "vitest";
import { parseAtlasDocument } from "../../../src/developer/sprite-mapping/atlasMapping";

describe("sprite mapping review flow", () => {
  test("creates stable entries for gallery review", () => {
    const atlas = parseAtlasDocument({ sheet: "atlas.png", sheet_width: 10, sheet_height: 10, sprites: [{ subject_id: "a", display_name: "A", x: 0, y: 0, width: 2, height: 2 }] });
    expect(atlas.entries[0].entryId).toContain("a");
  });
});
