import { expect, test } from "@playwright/test";

test("game opens on the main menu and each scenario can be started", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("main-menu-panel")).toBeVisible();
  await expect(page.getByTestId("scenario-start-core-map-loop")).toBeVisible();
  await expect(page.getByTestId("scenario-start-advanced-terrain-scenario")).toBeVisible();

  await page.getByTestId("scenario-start-core-map-loop").click();
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("remaining-movement")).toContainText("2");

  await page.goto("/");
  await page.getByTestId("scenario-start-advanced-terrain-scenario").click();
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("remaining-movement")).toContainText("8");
});
