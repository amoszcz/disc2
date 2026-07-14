import { expect, test } from "@playwright/test";

test("player can move, collect a pickup, and end the turn", async ({ page }) => {
  await page.goto("/");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });

  await expect(page.getByTestId("resource-gold")).toHaveText("10");
  await expect(page.getByTestId("remaining-movement")).toHaveText("1");

  await page.getByTestId("end-turn-button").click();
  await expect(page.getByTestId("remaining-movement")).toHaveText("2");
});
