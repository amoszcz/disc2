import { describe, expect, test } from "vitest";
import { emptyChangeSet, parseAtlasDocument, serializeMappingJson } from "../../../src/developer/sprite-mapping/atlasMapping";

describe("sprite mapping export flow", () => {
  test("exports the resolved document without clearing pending edits", () => {
    const atlas = parseAtlasDocument({ sheet: "atlas.png", sheet_width: 20, sheet_height: 20, sprites: [{ subject_id: "a", x: 1, y: 1, width: 2, height: 2 }] });
    const changes = emptyChangeSet();
    changes.entryOverrides[atlas.entries[0].entryId] = { x: 5, y: 6, width: 7, height: 8 };
    expect(JSON.parse(serializeMappingJson(atlas, changes))).toMatchObject({ sprites: [expect.objectContaining({ x: 5, y: 6, width: 7, height: 8 })] });
    expect(changes.entryOverrides[atlas.entries[0].entryId]).toEqual({ x: 5, y: 6, width: 7, height: 8 });
  });
});
