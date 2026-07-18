import { describe, expect, test } from "vitest";
import { applyMappingChanges, emptyChangeSet, parseAtlasDocument, resolveEntryCoordinates, validateAtlas } from "../../src/developer/sprite-mapping/atlasMapping";

const atlas = parseAtlasDocument({ sheet: "atlas.png", sheet_width: 10, sheet_height: 20, sprites: [{ subject_kind: "unit", subject_id: "unit-a", display_name: "Unit A", x: 1, y: 2, width: 3, height: 4, anchor_x: 2 }] });

describe("sprite mapping contract", () => {
  test("reports declared and actual image dimension mismatches", () => {
    expect(validateAtlas(atlas, 20, 10, emptyChangeSet()).some((issue) => issue.entryId === null)).toBe(true);
  });
  test("applies one offset while preserving non-coordinate metadata", () => {
    const saved = applyMappingChanges(atlas, { bulkOffset: { x: 5, y: -1 }, entryOverrides: {} }) as { sprites: Array<Record<string, unknown>> };
    expect(saved.sprites[0]).toMatchObject({ x: 6, y: 1, width: 3, anchor_x: 2 });
  });
  test("flags adjusted crops outside the actual image", () => {
    expect(validateAtlas(atlas, 10, 20, { bulkOffset: { x: 8, y: 0 }, entryOverrides: {} }).some((issue) => issue.entryId === atlas.entries[0].entryId)).toBe(true);
  });
  test("gives an explicit entry edit precedence over bulk alignment", () => {
    const changes = { bulkOffset: { x: 5, y: 5 }, entryOverrides: { [atlas.entries[0].entryId]: { x: 2, y: 3 } } };
    expect(resolveEntryCoordinates(atlas.entries[0], changes)).toMatchObject({ x: 2, y: 3, width: 3, height: 4 });
  });
});
