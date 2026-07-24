import { describe, expect, test } from "vitest";
import { layoutCampaignLabels } from "../../../src/render/canvas/campaign-map/labelLayout";
import { campaignMapFixture } from "./fixtures";
describe("campaign map geometry", () => { test("prioritizes major labels at distant zoom", () => { const map = campaignMapFixture(); expect(layoutCampaignLabels(map.locations, .5).every((label) => label.location.importance >= 8)).toBe(true); }); });
