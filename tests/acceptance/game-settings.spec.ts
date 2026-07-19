import { expect, test } from "@playwright/test";
import { clickTile } from "./mobileTestUtils";

test("settings changes movement behavior and persists it across reload", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("settings-open-button").click();
  await page.getByTestId("movement-behavior-selector").selectOption("immediate");
  await page.getByTestId("settings-return-button").click();
  await page.reload();
  await page.getByTestId("settings-open-button").click();
  await expect(page.getByTestId("movement-behavior-selector")).toHaveValue("immediate");
});

test("a non-immediate compatibility setting starts route traversal", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  await page.evaluate(() => {
    (window as any).__gameStore.getState().gameSettings.movementBehavior = "future-non-immediate-setting";
  });

  await clickTile(page, 7, 11);
  await clickTile(page, 7, 11);

  await expect(page.getByTestId("route-traversal-status")).toBeVisible();
});
