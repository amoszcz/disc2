import { expect, test } from "@playwright/test";

test("player can move across road and plains on the advanced terrain scenario", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 55, y: 105 } });
  await canvas.click({ position: { x: 65, y: 105 } });

  await expect(page.getByTestId("remaining-movement")).toHaveText("7");
  await expect(page.getByTestId("route-terrain")).toHaveText("Road");
  await expect(page.getByTestId("route-impact")).toHaveText("1 movement");

  await canvas.click({ position: { x: 65, y: 115 } });

  await expect(page.getByTestId("remaining-movement")).toHaveText("5");
  await expect(page.getByTestId("route-terrain")).toHaveText("Plains");
  await expect(page.getByTestId("route-impact")).toHaveText("2 movement");
});
