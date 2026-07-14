import { expect, test } from "@playwright/test";

test("unfinished routes remain visible after end turn and can continue on the next click", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");

  const farDestinationClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (20 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (31 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });

  await canvas.click({ position: farDestinationClick });

  await expect(page.getByTestId("route-preview-status")).toHaveText("previewed");
  const beforeTurn = await page.getByTestId("route-preview-destination").textContent();
  const stepsBeforeTurn = await page.getByTestId("route-preview-steps").textContent();

  await page.getByTestId("end-turn-button").click();

  await expect(page.getByTestId("route-preview-status")).toHaveText("continuation");
  await expect(page.getByTestId("route-preview-destination")).toHaveText(beforeTurn ?? "");
  await expect(page.getByTestId("route-preview-steps")).not.toHaveText(stepsBeforeTurn ?? "");

  await canvas.click({ position: farDestinationClick });

  await expect(page.getByTestId("route-preview-status")).toHaveText("continuation");
});
