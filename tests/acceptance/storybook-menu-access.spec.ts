import { expect, test } from "@playwright/test";

test("main menu can open and close the asset storybook", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("main-menu-panel")).toBeVisible();
  await expect(page.getByTestId("storybook-open-button")).toBeVisible();

  await page.getByTestId("storybook-open-button").click();
  await expect(page.getByTestId("storybook-panel")).toBeVisible();
  await expect(page.getByTestId("storybook-entry-list")).toBeVisible();

  await page.getByTestId("storybook-return-button").click();
  await expect(page.getByTestId("main-menu-panel")).toBeVisible();
});
