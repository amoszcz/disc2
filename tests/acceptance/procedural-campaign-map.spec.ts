import { expect, test } from "@playwright/test";
import { clickTile } from "./mobileTestUtils";

test("generated campaign presents strategic map information and a legal early route", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  await expect(page.getByTestId("campaign-map-presentation")).toHaveText("Generated campaign");
  await clickTile(page, 7, 11);
  await expect(page.getByTestId("route-preview-cost")).toBeVisible();
  await expect(page.getByTestId("route-preview-guidance")).toContainText("confirm");
});
