import { expect, test } from "@playwright/test";

test("developer can drag only the selected sprite crop", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("sprite-mapping-open-button").click();
  await expect(page.getByTestId("atlas-dimensions")).toBeVisible();
  const canvas = page.getByLabel("game canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Canvas unavailable");
  const coordinates = await page.getByTestId("sprite-mapping-crop-size").textContent();
  await page.mouse.move(box.x + 100, box.y + 100); await page.mouse.down(); await page.mouse.move(box.x + 130, box.y + 120); await page.mouse.up();
  await expect(page.getByTestId("sprite-mapping-crop-size")).not.toHaveText(coordinates ?? "");
});
