import { expect, test } from "@playwright/test";

test("player can still select and move after zooming or panning, and the view is restored after scene changes", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas box was not available.");
  }

  await page.mouse.move(box.x + 220, box.y + 180);
  await page.mouse.wheel(0, -200);

  const heroClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (state.scenario.heroes[0].mapPosition.x - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (state.scenario.heroes[0].mapPosition.y - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });

  await canvas.click({ position: heroClick });
  await expect(page.getByTestId("map-hud")).toContainText("Aren");

  const roadClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any; update: (mutator: (state: any) => void) => void } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (6 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (10 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });

  await canvas.click({ position: roadClick });
  await expect(page.getByTestId("remaining-movement")).toHaveText("7");

  const preserved = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any; update: (mutator: (state: any) => void) => void } }).__gameStore;
    const before = { ...store!.getState().mapViewState.viewport };
    store!.update((state) => {
      state.sceneMode = "battle";
    });
    store!.update((state) => {
      state.sceneMode = "map";
    });
    return {
      before,
      after: store!.getState().mapViewState.viewport
    };
  });

  expect(preserved.after.zoomLevel).toBe(preserved.before.zoomLevel);
  expect(preserved.after.panOffsetX).toBe(preserved.before.panOffsetX);
  expect(preserved.after.panOffsetY).toBe(preserved.before.panOffsetY);
});
