import { expect, test } from "@playwright/test";

test("settings changes movement behavior and persists it across reload", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("settings-open-button").click();
  await page.getByTestId("movement-behavior-selector").selectOption("immediate");
  await page.getByTestId("settings-return-button").click();
  await page.reload();
  await page.getByTestId("settings-open-button").click();
  await expect(page.getByTestId("movement-behavior-selector")).toHaveValue("immediate");
});
