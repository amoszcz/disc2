import { describe, expect, test } from "vitest";
import { campaignMapFixture } from "./fixtures";
describe("procedural campaign map", () => { test("is deterministic and validates a playable strategic map", () => { const first = campaignMapFixture(); const second = campaignMapFixture(); expect(second).toEqual(first); expect(first.validation.valid).toBe(true); expect(first.locations.filter((location) => location.type === "start")).toHaveLength(1); expect(first.regions.length).toBeGreaterThan(1); }); });
