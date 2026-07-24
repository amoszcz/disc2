import { describe, expect, test } from "vitest";
import { generateCampaignMap } from "../../src/engine/campaign-map/generateCampaignMap";
import { createCampaignMapDiagnostics, toggleCampaignMapOverlay } from "../../src/developer/campaign-map/campaignMapDiagnostics";
describe("campaign map diagnostics", () => { test("keeps diagnostics opt-in and exposes the map seed", () => { const state = createCampaignMapDiagnostics(generateCampaignMap("m", { seed: 9, width: 16, height: 16 })); expect(state.enabled.size).toBe(0); expect(toggleCampaignMapOverlay(state, "connections").enabled.has("connections")).toBe(true); expect(state.seed).toBe(9); }); });
