import { describe, expect, test } from "vitest";
import { createSpriteMappingState } from "../../../src/developer/sprite-mapping/spriteMappingState";
describe("sprite mapping zoom flow", () => test("zoom state does not modify mapping changes", () => { const state = createSpriteMappingState(); state.zoom = 2; state.viewPan = { x: 20, y: -10 }; expect(state.changes.entryOverrides).toEqual({}); expect(state.changes.bulkOffset).toEqual({ x: 0, y: 0 }); }));
