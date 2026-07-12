import { expect, test } from "@playwright/test";

test("terrain legend and route preview stay visible on the advanced scenario", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  await expect(page.getByTestId("terrain-legend")).toContainText("Road");
  await expect(page.getByTestId("terrain-legend")).toContainText("blocked");
  await expect(page.getByTestId("guard-status")).toContainText("Select a nearby tile to inspect movement cost.");

  const canvas = page.getByLabel("game canvas");
  const heroClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (5 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (10 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });
  const roadClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (6 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (10 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });
  await canvas.click({ position: heroClick });
  await canvas.click({ position: roadClick });

  await expect(page.getByTestId("guard-status")).toContainText("Road: 1 movement.");
});
