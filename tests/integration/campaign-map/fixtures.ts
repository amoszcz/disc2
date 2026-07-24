import { generateCampaignMap } from "../../../src/engine/campaign-map/generateCampaignMap";
export const campaignMapFixture = () => generateCampaignMap("fixture-map", { seed: 42, width: 24, height: 18 });
