import { expect, test } from "@playwright/test";

test("storybook shares and changes the active template", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("storybook-open-button").click();
  const selector = page.getByTestId("storybook-template-selector");
  await expect(selector).toHaveValue("default-template");
  await selector.selectOption("wip-template");
  await expect(selector).toHaveValue("wip-template");
  await expect(page.getByTestId("storybook-entry-list")).toBeVisible();
});
