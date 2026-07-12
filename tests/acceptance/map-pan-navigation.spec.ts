import { expect, test } from "@playwright/test";

test("player can pan the advanced terrain map and stop at its boundaries", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas box was not available.");
  }

  await page.mouse.move(box.x + 300, box.y + 220);
  await page.mouse.down({ button: "middle" });
  await page.mouse.move(box.x + 120, box.y + 90);
  await page.mouse.up({ button: "middle" });

  const panned = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const viewport = store?.getState().mapViewState.viewport;
    return { x: viewport.panOffsetX, y: viewport.panOffsetY };
  });

  expect(panned.x).toBeGreaterThan(0);
  expect(panned.y).toBeGreaterThan(0);

  await page.mouse.move(box.x + 200, box.y + 200);
  await page.mouse.down({ button: "middle" });
  await page.mouse.move(box.x - 5000, box.y - 5000);
  await page.mouse.up({ button: "middle" });

  const bounded = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    return store?.getState().mapViewState.viewport;
  });

  expect(bounded.panOffsetX).toBeGreaterThan(0);
  expect(bounded.panOffsetY).toBeGreaterThan(0);
  await expect(page.getByTestId("map-zoom")).toHaveText("2.00x");
});
