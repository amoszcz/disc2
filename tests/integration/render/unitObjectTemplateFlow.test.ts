import { describe, expect, test } from "vitest";
import { createInitialState } from "../../../src/app/state/gameState";
import { createBattle } from "../../../src/engine/battle/createBattle";
import { createCenteredViewport } from "../../../src/engine/map/viewportMath";
import { renderBattleScene } from "../../../src/render/canvas/renderBattleScene";
import { renderMapScene } from "../../../src/render/canvas/renderMapScene";
import { getVisualTemplateDiagnostics } from "../../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "./renderTestContext";

describe("unit and object template flow", () => {
  test("records dedicated map diagnostics for heroes, guarded locations, and movement objects", () => {
    const state = createInitialState("advanced-terrain-scenario");
    state.gameSettings.fogOfWarEnabled = false;
    state.mapViewState.viewport = createCenteredViewport(state.scenario.map, { x: 20, y: 30 });

    renderMapScene(createMockCanvasContext(), state);

    const diagnostics = getVisualTemplateDiagnostics().map;
    expect(diagnostics.some((entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren" && !entry.isFallback)).toBe(true);
    expect(
      diagnostics.some((entry) => entry.subjectKind === "movement-object" && entry.subjectType === "bridge" && !entry.isFallback)
    ).toBe(true);
    expect(
      diagnostics.some((entry) => entry.subjectKind === "guarded-location" && entry.subjectType === "resource-site:blocked" && !entry.isFallback)
    ).toBe(true);
  });

  test("records dedicated battle diagnostics for all current battle unit types", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    state.sceneMode = "battle";

    renderBattleScene(createMockCanvasContext(), state);

    const battleDiagnostics = getVisualTemplateDiagnostics().battle;
    expect(battleDiagnostics.some((entry) => entry.subjectType === "Militia" && !entry.isFallback)).toBe(true);
    expect(battleDiagnostics.some((entry) => entry.subjectType === "Archer" && !entry.isFallback)).toBe(true);
    expect(battleDiagnostics.some((entry) => entry.subjectType === "Mage" && !entry.isFallback)).toBe(true);
    expect(battleDiagnostics.some((entry) => entry.subjectType === "Skeleton" && !entry.isFallback)).toBe(true);
    expect(battleDiagnostics.some((entry) => entry.subjectType === "Skeleton Archer" && !entry.isFallback)).toBe(true);
  });
});
