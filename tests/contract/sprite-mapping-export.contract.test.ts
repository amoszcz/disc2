import { describe, expect, test } from "vitest";
import { emptyChangeSet, parseAtlasDocument, serializeMappingJson } from "../../src/developer/sprite-mapping/atlasMapping";

describe("sprite mapping export contract", () => {
  test("serializes pending crop overrides while preserving unchanged metadata", () => {
    const atlas = parseAtlasDocument({ sheet: "atlas.png", sheet_width: 20, sheet_height: 20, sprites: [{ subject_id: "a", x: 1, y: 2, width: 3, height: 4, anchor_x: 7 }, { subject_id: "b", x: 8, y: 9, width: 2, height: 3, label: "unchanged" }] });
    const changes = emptyChangeSet();
    changes.entryOverrides[atlas.entries[0].entryId] = { x: 4, y: 5, width: 6, height: 7 };
    const exported = JSON.parse(serializeMappingJson(atlas, changes)) as { sprites: Array<Record<string, unknown>> };
    expect(exported.sprites).toEqual([expect.objectContaining({ x: 4, y: 5, width: 6, height: 7, anchor_x: 7 }), expect.objectContaining({ x: 8, y: 9, width: 2, height: 3, label: "unchanged" })]);
    expect(atlas.entries[0]).toMatchObject({ x: 1, y: 2, width: 3, height: 4 });
  });

  test("serializes the loaded document when no edits are pending", () => {
    const atlas = parseAtlasDocument({ sheet: "atlas.png", sheet_width: 10, sheet_height: 10, sprites: [{ subject_id: "a", x: 1, y: 2, width: 3, height: 4 }] });
    expect(JSON.parse(serializeMappingJson(atlas, emptyChangeSet()))).toMatchObject({ sheet: "atlas.png", sprites: [expect.objectContaining({ x: 1, y: 2, width: 3, height: 4 })] });
  });
});
