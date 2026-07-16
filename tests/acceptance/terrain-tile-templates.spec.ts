import { expect, test } from "@playwright/test";

test("advanced terrain scenario exposes dedicated tile templates for current terrain types", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  const terrainTypes = await page.evaluate(() => {
    const diagnostics = (window as Window & { __visualTemplateDiagnostics?: { map: any[] } }).__visualTemplateDiagnostics;
    return Array.from(
      new Set((diagnostics?.map ?? []).filter((entry: { subjectKind: string }) => entry.subjectKind === "terrain").map((entry: { subjectType: string }) => entry.subjectType))
    );
  });

  expect(terrainTypes).toEqual(expect.arrayContaining(["road", "grass", "plains", "mud", "woods", "mountains", "lakes", "rivers"]));
});
