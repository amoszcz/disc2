import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { adaptScenarioWorldMap } from "../../src/engine/campaign-map/adaptScenarioWorldMap";
import { getScenarioWorldMaps } from "../../src/engine/scenario/types";
describe("campaign map data contract", () => { test("adapts existing maps into stable semantic cells and locations", () => { const state = createInitialState("advanced-terrain-scenario"); const map = adaptScenarioWorldMap(state.scenario, getScenarioWorldMaps(state.scenario)[0]); expect(map.schemaVersion).toBe(1); expect(map.cells).toHaveLength(4096); expect(map.mapId).toBe("surface"); expect(map.locations.map((location) => location.id)).toContain("guarded-location-1"); expect(map.validation.valid).toBe(true); }); });
