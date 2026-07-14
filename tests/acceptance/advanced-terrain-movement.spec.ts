import { expect, test } from "@playwright/test";

test("player can move across road and plains on the advanced terrain scenario", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
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
  await canvas.click({ position: roadClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("7");
  await expect(page.getByTestId("route-terrain")).toHaveText("Road");
  await expect(page.getByTestId("route-impact")).toHaveText("1 movement");

  const plainsClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (6 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (11 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });

  await canvas.click({ position: plainsClick });
  await canvas.click({ position: plainsClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("5");
  await expect(page.getByTestId("route-terrain")).toHaveText("Plains");
  await expect(page.getByTestId("route-impact")).toHaveText("2 movement");
});
