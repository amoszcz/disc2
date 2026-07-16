import { expect, test } from "@playwright/test";

test("hero movement diagnostics expose directional map animation states", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  const canvas = page.getByLabel("game canvas");
  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });

  const diagnostics = await page.evaluate(() => {
    const entries = (window as Window & { __visualTemplateDiagnostics?: { map: any[] } }).__visualTemplateDiagnostics?.map ?? [];
    return entries.find((entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren");
  });

  expect(diagnostics).toMatchObject({
    requestedStateName: "stop-move",
    stateDirection: "right"
  });
});
