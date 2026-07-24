import { describe, expect, test } from "vitest";
import { clearCampaignMapRenderCaches, getCampaignMapRenderCache } from "../../../src/render/canvas/campaign-map/renderCache";
describe("campaign map render cache", () => { test("reuses a static cache for the same revision key", () => { clearCampaignMapRenderCaches(); expect(getCampaignMapRenderCache("map:1")).toBe(getCampaignMapRenderCache("map:1")); }); });
