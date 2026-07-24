import { describe, expect, test } from "vitest";
import { loadScenario } from "../../../src/engine/scenario/loadScenario";
import { getWorldMapById } from "../../../src/engine/scenario/types";
import { adaptScenarioWorldMap } from "../../../src/engine/campaign-map/adaptScenarioWorldMap";
import { resolveCampaignTraversal } from "../../../src/engine/campaign-map/resolveCampaignTraversal";
describe("campaign traversal adapter", () => { test("preserves road, bridge and blocked river decisions", () => { const scenario = loadScenario("advanced-terrain-scenario"); const map = adaptScenarioWorldMap(scenario, getWorldMapById(scenario, "surface")!); expect(resolveCampaignTraversal(map, { x: 5, y: 10 }).walkable).toBe(true); expect(resolveCampaignTraversal(map, { x: 20, y: 30 })).toMatchObject({ walkable: true, crossing: "bridge" }); expect(resolveCampaignTraversal(map, { x: 20, y: 10 }).walkable).toBe(false); }); });
