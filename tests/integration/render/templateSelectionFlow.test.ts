import { describe, expect, test } from "vitest";
import { createInitialState, selectVisualTemplate, startScenarioSession } from "../../../src/app/state/gameState";
import { getActiveVisualTemplateId, resolveHeroVisualTemplate, resolveStorybookPreviewTemplate, resolveUnitVisualTemplate, setActiveVisualTemplateId } from "../../../src/render/sprites/visualTemplateResolver";
import { getStorybookPreviewSubjects } from "../../../src/render/sprites/visualTemplateCatalog";

describe("template selection flow", () => {
  test("initializes from configuration and preserves gameplay state when the active source changes", () => {
    const state = createInitialState();
    const heroPosition = { ...state.scenario.heroes[0].mapPosition };
    expect(state.activeVisualTemplateId).toBe("default-template");

    selectVisualTemplate(state, "wip-template");
    setActiveVisualTemplateId(state.activeVisualTemplateId);
    expect(getActiveVisualTemplateId()).toBe("wip-template");
    expect(resolveUnitVisualTemplate({ name: "Militia" }, "battle").assetSource).toContain("wip-template");
    expect(resolveHeroVisualTemplate({ name: "Aren" }, { stateName: "idle", direction: "down" }).spriteFrame).toMatchObject({ sourceX: 128, sourceY: 10, sourceWidth: 71, sourceHeight: 94 });
    const aren = getStorybookPreviewSubjects().find((subject) => subject.subjectId === "hero-aren")!;
    expect(resolveStorybookPreviewTemplate(aren, { stateName: "idle", direction: "up" }).assetSource).toContain("wip-template");
    expect(state.scenario.heroes[0].mapPosition).toEqual(heroPosition);

    startScenarioSession(state, "core-map-loop");
    expect(state.activeVisualTemplateId).toBe("wip-template");
  });
});
