import { expect, test } from "@playwright/test";

test("developer can open the sprite mapping review page", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("sprite-mapping-open-button").click();
  await expect(page.getByTestId("sprite-mapping-panel")).toBeVisible();
  await expect(page.getByTestId("atlas-dimensions")).toContainText("Map:");
  await expect(page.getByTestId("atlas-dimensions")).toContainText("1024×1536");
  const entries = page.getByTestId("sprite-mapping-entry");
  await expect(entries).toHaveCount(97);
  await expect(entries.first().locator("[data-sprite-preview-id]")).toBeVisible();
  await expect(entries.first().getByTestId("sprite-mapping-entry-state")).toContainText("Direction: up");
  await entries.nth(1).click();
  await expect(page.getByTestId("sprite-mapping-selected")).toContainText("(128, 0)");
  await expect(page.getByTestId("sprite-mapping-selected")).toContainText("Direction: down");
});
