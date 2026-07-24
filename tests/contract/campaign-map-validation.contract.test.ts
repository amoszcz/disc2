import { describe, expect, test } from "vitest";
import { generateCampaignMap } from "../../src/engine/campaign-map/generateCampaignMap";
import { validateCampaignMap } from "../../src/engine/campaign-map/validateCampaignMap";
describe("campaign map validation", () => { test("accepts generated maps and rejects maps without a start", () => { const map = generateCampaignMap("m", { seed: 3, width: 20, height: 16 }); expect(map.validation.valid).toBe(true); map.locations = map.locations.filter((location) => location.type !== "start"); expect(validateCampaignMap(map).errors).toContain("Map has no starting location."); }); });
