import { expect, test } from "@playwright/test";

test("fog settings default to three tiles and can be disabled without resetting play", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  await page.getByTestId("map-settings-open-button").click();
  await expect(page.getByTestId("fog-of-war-enabled-control")).toBeChecked();
  await expect(page.getByTestId("fog-visibility-radius-control")).toHaveValue("3");
  await page.getByTestId("fog-visibility-radius-control").fill("2");
  await page.getByTestId("fog-visibility-radius-control").press("Enter");
  await page.getByTestId("fog-of-war-enabled-control").uncheck();
  await page.getByTestId("settings-return-button").click();
  await expect.poll(() => page.evaluate(() => (window as any).__gameStore.getState().gameSettings)).toMatchObject({ fogVisibilityRadius: 2, fogOfWarEnabled: false });
  await page.getByTestId("map-settings-open-button").click();
  await page.getByTestId("fog-of-war-enabled-control").check();
  await page.getByTestId("settings-return-button").click();
  await expect(page.getByTestId("fog-of-war-status")).toHaveText("Enabled (2 tiles)");
});
