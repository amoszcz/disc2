import { expect, test } from "@playwright/test";

test("sprite mapper loads the selected catalog source", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("sprite-mapping-open-button").click();
  const selector = page.getByTestId("sprite-mapping-template-selector");
  await expect(selector).toHaveValue("default-template");
  await selector.selectOption("wip-template");
  await expect(selector).toHaveValue("wip-template");
  await expect(page.getByTestId("atlas-dimensions")).toBeVisible();
});
