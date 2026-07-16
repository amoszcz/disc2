import { expect, test } from "@playwright/test";

test("battle diagnostics expose action-oriented unit states", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  const canvas = page.getByLabel("game canvas");
  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });

  await expect(page.getByTestId("battle-hud")).toBeVisible();
  await canvas.click({ position: { x: 508, y: 266 } });
  await expect(page.getByTestId("battle-attack-button")).toBeEnabled();
  await page.getByTestId("battle-attack-button").click();

  const diagnostics = await page.evaluate(() => {
    const entries = (window as Window & { __visualTemplateDiagnostics?: { battle: any[] } }).__visualTemplateDiagnostics?.battle ?? [];
    return {
      attacker: entries.find((entry) => entry.subjectType === "Archer"),
      defender: entries.find((entry) => entry.subjectType === "Skeleton Archer")
    };
  });

  expect(diagnostics.attacker).toMatchObject({
    requestedStateName: "shoot"
  });
  expect(diagnostics.defender).toMatchObject({
    requestedStateName: "hit"
  });
});
