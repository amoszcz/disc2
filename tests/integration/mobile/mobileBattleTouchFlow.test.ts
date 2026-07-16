import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { canBattleStrike, trySelectBattleTarget } from "../../../src/engine/battle/battleTurnEngine";
import { createMobileLayoutState, createResponsiveCanvasView } from "../../../src/render/canvas/viewportRender";

describe("mobile battle touch flow", () => {
  test("supports target selection and striking in a mobile battle session", () => {
    const state = createInitialState();
    state.mobileLayoutState = createMobileLayoutState(390, 844, 358, 420);
    state.responsiveCanvasView = createResponsiveCanvasView(358, 420, 2);
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    state.sceneMode = "battle";

    const selected = trySelectBattleTarget(state, state.battle, "guard-unit-1");

    expect(selected).toBe(true);
    expect(canBattleStrike(state, state.battle)).toBe(true);
  });
});
