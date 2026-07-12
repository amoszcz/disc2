import { expect, test } from "@playwright/test";

test("player can zoom the advanced terrain map toward the cursor", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas box was not available.");
  }

  await page.mouse.move(box.x + 220, box.y + 180);
  await page.mouse.wheel(0, -200);

  await expect(page.getByTestId("map-zoom")).toHaveText("2.25x");

  const zoomed = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    return store?.getState().mapViewState.viewport;
  });

  expect(zoomed.zoomLevel).toBe(2.25);
  expect(zoomed.panOffsetX).toBeGreaterThanOrEqual(0);
  expect(zoomed.panOffsetY).toBeGreaterThanOrEqual(0);
});
