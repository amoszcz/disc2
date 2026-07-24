import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { clearOwnedRoutePreview, plotRoutePreview } from "../../../src/engine/map/heroActions";
describe("campaign map route flow", () => { test("keeps preview replacement, cancellation, and blocked feedback through semantic traversal", () => { const state = createInitialState("advanced-terrain-scenario"); expect(plotRoutePreview(state, { x: 7, y: 11 }).ok).toBe(true); expect(plotRoutePreview(state, { x: 6, y: 10 }).ok).toBe(true); expect(clearOwnedRoutePreview(state, "hero-1").ok).toBe(true); expect(plotRoutePreview(state, { x: 20, y: 10 }).ok).toBe(false); expect(state.routeFeedback?.blockedReason).toBeTruthy(); }); });
