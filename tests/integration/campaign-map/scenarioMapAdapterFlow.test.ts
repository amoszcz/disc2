import { describe, expect, test } from "vitest";
import { loadScenario } from "../../../src/engine/scenario/loadScenario";
import { adaptScenarioWorldMap } from "../../../src/engine/campaign-map/adaptScenarioWorldMap";
import { getScenarioWorldMaps } from "../../../src/engine/scenario/types";
describe("scenario campaign map adapter", () => { test.each(["core-map-loop", "advanced-terrain-scenario", "submap-expedition-scenario"] as const)("keeps every %s world map deterministic", (id) => { const scenario = loadScenario(id); for (const worldMap of getScenarioWorldMaps(scenario)) { const first = adaptScenarioWorldMap(scenario, worldMap); const second = adaptScenarioWorldMap(scenario, worldMap); expect(second).toEqual(first); expect(first.cells).toHaveLength(worldMap.map.width * worldMap.map.height); } }); });
