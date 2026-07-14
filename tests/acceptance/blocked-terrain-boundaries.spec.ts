import { expect, test } from "@playwright/test";

test("blocked river tiles reject movement without spending points", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      state.scenario.heroes[0].mapPosition = { x: 19, y: 10 };
      state.scenario.heroes[0].remainingMovement = 8;
      state.selectedHeroId = "hero-1";
      state.routeFeedback = null;
      state.messageLog.push("Aren approaches the riverbank.");
    });
  });

  const canvas = page.getByLabel("game canvas");
  const riverClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (20 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (10 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });
  await canvas.click({ position: riverClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("8");
  await expect(page.getByTestId("route-terrain")).toHaveText("Route");
  await expect(page.getByTestId("route-impact")).toHaveText("Route unavailable");
  await expect(page.getByTestId("error-detail")).toHaveText("No legal route could be plotted to that destination.");
});
