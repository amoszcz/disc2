import { expect, test } from "@playwright/test";
import { getRenderedTileSize, tapElement } from "./mobileTestUtils";

async function expectSelectedHeroCentered(page: import("@playwright/test").Page): Promise<void> {
  const centering = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    if (!state) {
      throw new Error("Game store was not available.");
    }

    const hero = state.scenario.heroes.find((entry: { id: string }) => entry.id === state.selectedHeroId);
    if (!hero) {
      throw new Error("Selected hero was not available.");
    }

    const viewport = state.mapViewState.viewport;
    const scaledTileSize = (viewport.minTileRenderSize / viewport.minZoom) * viewport.zoomLevel;
    const visibleWorldWidth = state.responsiveCanvasView.pixelWidth / scaledTileSize;
    const visibleWorldHeight = state.responsiveCanvasView.pixelHeight / scaledTileSize;
    const expectedPanOffsetX = Math.max(0, Math.min(state.scenario.map.width - visibleWorldWidth, hero.mapPosition.x + 0.5 - visibleWorldWidth / 2));
    const expectedPanOffsetY = Math.max(
      0,
      Math.min(state.scenario.map.height - visibleWorldHeight, hero.mapPosition.y + 0.5 - visibleWorldHeight / 2)
    );

    return {
      actualX: viewport.panOffsetX,
      actualY: viewport.panOffsetY,
      expectedX: expectedPanOffsetX,
      expectedY: expectedPanOffsetY
    };
  });

  expect(centering.actualX).toBeCloseTo(centering.expectedX, 3);
  expect(centering.actualY).toBeCloseTo(centering.expectedY, 3);
}

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test("game opens on a mobile menu and can start each scenario without horizontal scrolling", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("main-menu-panel")).toBeVisible();
  await expect(page.getByTestId("main-menu-message")).toContainText("tap to begin");

  const scrollState = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth
  }));
  expect(scrollState.scrollWidth).toBeLessThanOrEqual(scrollState.viewportWidth);

  await tapElement(page.getByTestId("scenario-start-core-map-loop"));
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("layout-mode")).toHaveText("mobile");
  await expectSelectedHeroCentered(page);
  const borderWatchMinTileSize = await getRenderedTileSize(page);

  await page.goto("/");
  await tapElement(page.getByTestId("scenario-start-advanced-terrain-scenario"));
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("remaining-movement")).toContainText("8");
  await expectSelectedHeroCentered(page);
  const advancedTerrainMinTileSize = await getRenderedTileSize(page);
  expect(advancedTerrainMinTileSize).toBe(borderWatchMinTileSize);

  await page.goto("/");
  await tapElement(page.getByTestId("scenario-start-submap-expedition-scenario"));
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("active-map-name")).toContainText("Surface Camp");
  await expectSelectedHeroCentered(page);
});
