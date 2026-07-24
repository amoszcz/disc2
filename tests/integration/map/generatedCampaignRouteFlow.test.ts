import { describe, expect, test } from "vitest";
import { generateCampaignMap } from "../../../src/engine/campaign-map/generateCampaignMap";
import { resolveCampaignTraversal } from "../../../src/engine/campaign-map/resolveCampaignTraversal";

describe("generated campaign route flow", () => {
  test("carves deterministic strategic roads and makes bridge or pass crossings traversable", () => {
    const map = generateCampaignMap("generated-route", { seed: 42, width: 24, height: 18 });
    const road = map.cells.find((cell) => cell.roadType === "primary");
    expect(road).toBeDefined();
    expect(resolveCampaignTraversal(map, road!)).toMatchObject({ walkable: true, movementCost: 1 });

    const crossing = map.cells.find((cell) => cell.crossing === "bridge" || cell.crossing === "pass");
    if (crossing) {
      expect(resolveCampaignTraversal(map, crossing).walkable).toBe(true);
    }
    expect(map.connections.some((connection) => connection.path.length > 2)).toBe(true);
  });
});
