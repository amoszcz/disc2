import { expect, test } from "@playwright/test";

test("battle queue is shown and combat can end in victory", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });
  await expect(page.getByTestId("battle-hud")).toBeVisible();

  await expect(page.getByTestId("battle-active-unit")).toContainText("Archer");
  await expect(page.getByTestId("battle-queue")).toContainText("Archer");
  await expect(page.getByTestId("battle-target-message")).toContainText("Click a highlighted enemy");

  await canvas.click({ position: { x: 508, y: 266 } });
  await expect(page.getByTestId("battle-selected-target")).toContainText("Skeleton Archer");
  await page.getByTestId("battle-attack-button").click();
  await expect(page.getByTestId("battle-active-unit")).toContainText("Mage");

  await page.getByTestId("battle-attack-button").click();
  await expect(page.getByTestId("battle-active-unit")).toContainText("Militia");

  await canvas.click({ position: { x: 508, y: 116 } });
  await page.getByTestId("battle-attack-button").click();

  await expect(page.getByTestId("victory-panel")).toBeVisible();
});
