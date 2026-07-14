import { expect, test } from "@playwright/test";

test("first click plots a route preview without moving the hero", async ({ page }) => {
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
  const destinationClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (7 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (11 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });

  await canvas.click({ position: heroClick });
  await canvas.click({ position: destinationClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("8");
  await expect(page.getByTestId("route-preview-status")).toHaveText("previewed");
  await expect(page.getByTestId("route-preview-steps")).toHaveText("2");
  await expect(page.getByTestId("route-preview-cost")).toHaveText("2");
  await expect(page.getByTestId("guard-status-detail")).toContainText("Click the same destination again");
});

test("clicking the route-owning hero clears the active route", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");

  const { heroClick, destinationClick } = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      heroClick: {
        x: (5 - viewport.panOffsetX + 0.5) * scaledTileSize,
        y: (10 - viewport.panOffsetY + 0.5) * scaledTileSize
      },
      destinationClick: {
        x: (7 - viewport.panOffsetX + 0.5) * scaledTileSize,
        y: (11 - viewport.panOffsetY + 0.5) * scaledTileSize
      }
    };
  });

  await canvas.click({ position: destinationClick });
  await expect(page.getByTestId("route-preview-status")).toHaveText("previewed");

  await canvas.click({ position: heroClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("8");
  await expect(page.getByTestId("route-preview-status")).toHaveCount(0);
  await expect(page.getByTestId("guard-status-detail")).toHaveCount(0);
});
