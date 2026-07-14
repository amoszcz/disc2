import { expect, test } from "@playwright/test";

test("movement-object tiles change final movement costs", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      state.scenario.heroes[0].mapPosition = { x: 6, y: 10 };
      state.scenario.heroes[0].remainingMovement = 8;
      state.selectedHeroId = "hero-1";
      state.routeFeedback = null;
    });
  });

  const milestoneClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (7 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (11 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });
  await canvas.click({ position: milestoneClick });
  await canvas.click({ position: milestoneClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("7");
  await expect(page.getByTestId("route-impact")).toHaveText("1 movement");
  await expect(page.getByTestId("route-objects")).toHaveText("Milestone");

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      state.scenario.heroes[0].mapPosition = { x: 14, y: 18 };
      state.scenario.heroes[0].remainingMovement = 8;
      state.selectedHeroId = "hero-1";
      state.routeFeedback = null;
    });
  });

  const rubbleClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (15 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (18 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });
  await canvas.click({ position: rubbleClick });
  await canvas.click({ position: rubbleClick });

  await expect(page.getByTestId("remaining-movement")).toHaveText("4");
  await expect(page.getByTestId("route-impact")).toHaveText("4 movement");
  await expect(page.getByTestId("route-objects")).toHaveText("Rubble");
});
