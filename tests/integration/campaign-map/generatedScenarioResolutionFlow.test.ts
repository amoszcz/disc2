import { describe, expect, test } from "vitest";
import { loadScenario, resolveCampaignMap } from "../../../src/engine/scenario/loadScenario";
describe("generated scenario resolution", () => { test("keeps authored landmarks when a main map opts into generation", () => { const scenario = loadScenario("advanced-terrain-scenario"); const map = resolveCampaignMap(scenario, "surface"); expect(map.metadata.source).toBe("generated"); expect(map.locations.map((location) => location.id)).toEqual(expect.arrayContaining(["hero-hero-1", "pickup-1", "guarded-location-1"])); }); });
