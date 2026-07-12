import { expect, test } from "@playwright/test";

test("terrain legend and route preview stay visible on the advanced scenario", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  await expect(page.getByTestId("terrain-legend")).toContainText("Road");
  await expect(page.getByTestId("terrain-legend")).toContainText("blocked");
  await expect(page.getByTestId("guard-status")).toContainText("Select a nearby tile to inspect movement cost.");

  const canvas = page.getByLabel("game canvas");
  await canvas.click({ position: { x: 55, y: 105 } });
  await canvas.click({ position: { x: 65, y: 105 } });

  await expect(page.getByTestId("guard-status")).toContainText("Road: 1 movement.");
});
