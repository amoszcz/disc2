import { expect, test } from "@playwright/test";

test("completed scenario can return to the main menu and start a fresh replay", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("scenario-start-core-map-loop").click();

  const canvas = page.getByLabel("game canvas");
  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 508, y: 266 } });
  await page.getByTestId("battle-attack-button").click();
  await page.getByTestId("battle-attack-button").click();
  await canvas.click({ position: { x: 508, y: 116 } });
  await page.getByTestId("battle-attack-button").click();

  await expect(page.getByTestId("victory-panel")).toBeVisible();
  await page.getByTestId("return-to-menu-button").click();
  await expect(page.getByTestId("main-menu-panel")).toBeVisible();

  await page.getByTestId("scenario-start-core-map-loop").click();
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("remaining-movement")).toContainText("2");
});
