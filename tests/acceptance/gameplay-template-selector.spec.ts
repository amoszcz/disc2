import { expect, test } from "@playwright/test";

test("gameplay template selection is managed in Settings without resetting the session", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("scenario-start-core-map-loop").click();
  await expect(page.getByTestId("map-template-selector")).toHaveCount(0);
  await page.getByTestId("map-settings-open-button").click();
  const selector = page.getByTestId("settings-template-selector");
  await expect(selector).toHaveValue("default-template");
  await selector.selectOption("wip-template");
  await expect(selector).toHaveValue("wip-template");
  await page.getByTestId("settings-return-button").click();
  await expect(page.getByTestId("remaining-movement")).toContainText("2");
});
