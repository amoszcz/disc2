import { expect, test } from "@playwright/test";

test("gameplay starts with the configured template and can switch without resetting the session", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("scenario-start-core-map-loop").click();
  const selector = page.getByTestId("map-template-selector");
  await expect(selector).toHaveValue("default-template");
  await selector.selectOption("wip-template");
  await expect(selector).toHaveValue("wip-template");
  await expect(page.getByTestId("remaining-movement")).toContainText("2");
});
