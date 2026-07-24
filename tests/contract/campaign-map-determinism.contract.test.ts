import { describe, expect, test } from "vitest";
import { createSeedStreams } from "../../src/engine/campaign-map/seedStreams";
import { generateCampaignMap } from "../../src/engine/campaign-map/generateCampaignMap";
describe("campaign map determinism", () => { test("uses independent stable named streams and map output", () => { expect(createSeedStreams(7).terrain.next()).toBe(createSeedStreams(7).terrain.next()); expect(generateCampaignMap("m", { seed: 7, width: 20, height: 16 })).toEqual(generateCampaignMap("m", { seed: 7, width: 20, height: 16 })); }); });
