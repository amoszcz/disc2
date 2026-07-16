import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { performDefendAction, performStrikeAction, trySelectBattleTarget } from "../../../src/engine/battle/battleTurnEngine";
import { renderBattleScene } from "../../../src/render/canvas/renderBattleScene";
import { getVisualTemplateDiagnostics } from "../../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "./renderTestContext";

describe("battle animation state flow", () => {
  test("renders defend for the active unit after a defend action", () => {
    const state = createInitialState("core-map-loop");
    state.battle = createBattle(state, "hero-1", "guard-force-1");

    performDefendAction(state, state.battle);
    renderBattleScene(createMockCanvasContext(), state);

    expect(
      getVisualTemplateDiagnostics().battle.find((entry) => entry.subjectKind === "unit" && entry.subjectType === "Archer")
    ).toMatchObject({
      requestedStateName: "defend",
      resolvedStateName: "defend"
    });
  });

  test("renders action and hit states after a strike", () => {
    const state = createInitialState("core-map-loop");
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    trySelectBattleTarget(state, state.battle, "guard-unit-1");

    performStrikeAction(state, state.battle);
    renderBattleScene(createMockCanvasContext(), state);

    expect(
      getVisualTemplateDiagnostics().battle.find((entry) => entry.subjectKind === "unit" && entry.subjectType === "Archer")
    ).toMatchObject({
      requestedStateName: "shoot",
      resolvedStateName: "shoot"
    });
    expect(
      getVisualTemplateDiagnostics().battle.find((entry) => entry.subjectKind === "unit" && entry.subjectType === "Skeleton")
    ).toMatchObject({
      requestedStateName: "hit",
      resolvedStateName: "hit"
    });
  });
});
