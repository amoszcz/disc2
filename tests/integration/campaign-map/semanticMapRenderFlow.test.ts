import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { createCampaignMapCanvasContext } from "./renderTestContext";
describe("semantic campaign map rendering", () => { test("renders the adapter-backed map while retaining template diagnostics", () => { const state = createInitialState("advanced-terrain-scenario"); expect(() => renderMapScene(createCampaignMapCanvasContext(), state)).not.toThrow(); }); });
