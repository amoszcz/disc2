import { expect, test } from "@playwright/test";

test("dedicated templates resolve for current map subjects and battle units", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  const mapDiagnostics = await page.evaluate(() => {
    const diagnostics = (window as Window & { __visualTemplateDiagnostics?: { map: any[] } }).__visualTemplateDiagnostics;
    return diagnostics?.map ?? [];
  });

  expect(mapDiagnostics.some((entry: { subjectKind: string; subjectType: string; isFallback: boolean }) => entry.subjectKind === "hero" && entry.subjectType === "Aren" && !entry.isFallback)).toBe(true);
  expect(
    mapDiagnostics.some(
      (entry: { subjectKind: string; subjectType: string; isFallback: boolean }) =>
        entry.subjectKind === "movement-object" && entry.subjectType === "bridge" && !entry.isFallback
    )
  ).toBe(true);

  await page.goto("/?scenario=core-map-loop");
  const canvas = page.getByLabel("game canvas");
  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });

  const battleDiagnostics = await page.evaluate(() => {
    const diagnostics = (window as Window & { __visualTemplateDiagnostics?: { battle: any[] } }).__visualTemplateDiagnostics;
    return diagnostics?.battle ?? [];
  });

  expect(
    battleDiagnostics.some(
      (entry: { subjectType: string; assetKind: string; isFallback: boolean }) =>
        entry.subjectType === "Militia" && entry.assetKind === "dedicated" && !entry.isFallback
    )
  ).toBe(true);
  expect(
    battleDiagnostics.some(
      (entry: { subjectType: string; assetKind: string; isFallback: boolean }) =>
        entry.subjectType === "Skeleton Archer" && entry.assetKind === "dedicated" && !entry.isFallback
    )
  ).toBe(true);
});
