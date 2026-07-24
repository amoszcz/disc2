import { expect, test } from "@playwright/test";
import { clickTile } from "./mobileTestUtils";

test("campaign map keeps route preview, cancellation, and commit reachable", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  await expect(page.getByTestId("campaign-map-presentation")).toContainText("Generated");
  await clickTile(page, 7, 11);
  await expect(page.getByTestId("route-preview-status")).toBeVisible();
  await page.getByTestId("route-cancel-button").click();
  await expect(page.getByTestId("route-preview-status")).toHaveCount(0);
  await clickTile(page, 7, 11);
  await expect(page.getByTestId("route-preview-status")).toBeVisible();
  await clickTile(page, 7, 11);
  await expect(page.getByTestId("remaining-movement")).not.toHaveText("8");
});
