import { describe, expect, test } from "vitest";
import { getStorybookPreviewSubjects } from "../../src/render/sprites/visualTemplateCatalog";

describe("storybook preview catalog contract", () => {
  test("catalog includes heroes, battle units, movement objects, and guarded locations", () => {
    const subjects = getStorybookPreviewSubjects();

    expect(subjects.find((subject) => subject.subjectType === "Aren")?.categoryLabel).toBe("Hero");
    expect(subjects.find((subject) => subject.subjectType === "Archer")?.categoryLabel).toBe("Battle Unit");
    expect(subjects.find((subject) => subject.subjectType === "teleport")?.categoryLabel).toBe("Map Object");
    expect(subjects.find((subject) => subject.subjectType === "resource-site:blocked")?.categoryLabel).toBe("Guarded Location");
  });

  test("catalog exposes subject-appropriate state options", () => {
    const subjects = getStorybookPreviewSubjects();

    expect(subjects.find((subject) => subject.subjectType === "Aren")?.stateOptions.map((option) => option.optionId)).toContain(
      "idle-down"
    );
    expect(subjects.find((subject) => subject.subjectType === "Archer")?.stateOptions.map((option) => option.optionId)).toContain(
      "shoot"
    );
    expect(
      subjects.find((subject) => subject.subjectType === "resource-site:open")?.stateOptions.map((option) => option.optionId)
    ).toContain("open");
  });
});
