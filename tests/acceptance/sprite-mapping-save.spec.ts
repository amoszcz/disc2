import { expect, test } from "@playwright/test";

test("developer cannot save an invalid alignment and is warned before leaving unsaved work", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("sprite-mapping-open-button").click();
  await expect(page.getByTestId("atlas-dimensions")).toBeVisible();
  await page.getByTestId("sprite-mapping-coordinate-x").fill("-1");
  await page.getByTestId("sprite-mapping-apply-entry").click();
  await expect(page.getByTestId("sprite-mapping-save")).toBeDisabled();
  page.once("dialog", (dialog) => void dialog.dismiss());
  await page.getByTestId("sprite-mapping-return").click();
  await expect(page.getByTestId("sprite-mapping-panel")).toBeVisible();
  await page.getByTestId("sprite-mapping-reset").click();
  await page.getByTestId("sprite-mapping-return").click();
  await expect(page.getByTestId("main-menu-panel")).toBeVisible();
});
