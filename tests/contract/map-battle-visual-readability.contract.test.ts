import { describe, expect, test } from "vitest";
import { createInitialState } from "../../src/app/state/gameState";
import { createBattle } from "../../src/engine/battle/createBattle";
import { renderBattleScene } from "../../src/render/canvas/renderBattleScene";
import { renderMapScene } from "../../src/render/canvas/renderMapScene";
import { getVisualTemplateDiagnostics, resolveTerrainVisualTemplate } from "../../src/render/sprites/visualTemplateResolver";
import { createMockCanvasContext } from "../integration/render/renderTestContext";

describe("map and battle visual readability contract", () => {
  test("keeps current terrain types distinguishable through unique dedicated template ids", () => {
    const terrainTypes = ["road", "grass", "plains", "mud", "woods", "mountains", "lakes", "rivers"] as const;
    const templateIds = terrainTypes.map((terrainType) => resolveTerrainVisualTemplate(terrainType).templateId);

    expect(new Set(templateIds).size).toBe(terrainTypes.length);
  });

  test("renders dedicated unit diagnostics for a battle scene", () => {
    const state = createInitialState();
    state.battle = createBattle(state, "hero-1", "guard-force-1");
    state.sceneMode = "battle";

    renderBattleScene(createMockCanvasContext(), state);

    const diagnostics = getVisualTemplateDiagnostics().battle;
    expect(diagnostics.some((entry) => entry.subjectType === "Archer" && entry.assetKind === "dedicated")).toBe(true);
    expect(diagnostics.some((entry) => entry.subjectType === "Skeleton" && entry.assetKind === "dedicated")).toBe(true);
  });

  test("renders map diagnostics without losing hero visibility beside terrain templates", () => {
    const state = createInitialState("advanced-terrain-scenario");

    renderMapScene(createMockCanvasContext(), state);

    const diagnostics = getVisualTemplateDiagnostics().map;
    expect(diagnostics.some((entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren")).toBe(true);
    expect(diagnostics.some((entry) => entry.subjectKind === "terrain" && entry.subjectType === "road")).toBe(true);
  });
});
