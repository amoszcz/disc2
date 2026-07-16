import { expect, test } from "@playwright/test";
import { clickTile } from "./mobileTestUtils";

test("second click confirms a plotted route and moves the hero along it", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");

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

  await canvas.click({ position: destinationClick });
  await canvas.click({ position: destinationClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("6");
  await expect(page.getByTestId("route-terrain")).toHaveText("Plains");
  await expect(page.getByTestId("route-objects")).toHaveText("Milestone");
  await expect(page.getByTestId("route-impact")).toHaveText("1 movement");
});

test("submap exit travel returns play to the configured surface destination", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  await clickTile(page, 5, 10);
  await clickTile(page, 8, 10);
  await clickTile(page, 8, 10);
  await clickTile(page, 4, 1);
  await clickTile(page, 4, 1);

  await expect(page.getByTestId("active-map-name")).toHaveText("Broken Causeway");
  await expect(page.getByTestId("travel-message")).toContainText("returned");
  await expect(page.getByTestId("error-detail")).toContainText("returned");
});
