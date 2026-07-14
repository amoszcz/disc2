import { expect, test } from "@playwright/test";

test("stacked movement objects explain the final route result", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      state.scenario.heroes[0].mapPosition = { x: 19, y: 30 };
      state.scenario.heroes[0].remainingMovement = 8;
      state.selectedHeroId = "hero-1";
      state.routeFeedback = null;
    });
  });

  const canvas = page.getByLabel("game canvas");
  const stackedClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (20 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (30 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });
  await canvas.click({ position: stackedClick });

  await expect(page.getByTestId("route-objects")).toHaveText("Bridge, Rubble");
  await expect(page.getByTestId("route-effects")).toHaveText("Bridge + Rubble combine for a final cost of 2.");
  await expect(page.getByTestId("guard-status-detail")).toHaveText("Bridge turns this river tile into a legal crossing.");
});
