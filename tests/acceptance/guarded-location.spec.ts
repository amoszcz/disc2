import { expect, test } from "@playwright/test";

test("clearing a guarded location returns the player to an open site", async ({ page }) => {
  await page.goto("/");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });

  await expect(page.getByTestId("battle-hud")).toBeVisible();

  for (let index = 0; index < 5; index += 1) {
    await page.getByTestId("battle-attack-button").click();
  }

  await expect(page.getByTestId("victory-panel")).toBeVisible();
});
