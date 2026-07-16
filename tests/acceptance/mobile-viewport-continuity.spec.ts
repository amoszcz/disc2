import { expect, test } from "@playwright/test";
import { dragCanvas, getViewportState, tapElement } from "./mobileTestUtils";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test("mobile session survives viewport changes and can return to menu for replay", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  const canvas = page.getByLabel("game canvas");
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas box was not available.");
  }

  await dragCanvas(
    page,
    { x: box.x + box.width * 0.7, y: box.y + box.height * 0.6 },
    { x: box.x + box.width * 0.35, y: box.y + box.height * 0.35 }
  );
  const beforeResize = await getViewportState(page);

  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.getByTestId("map-hud")).toBeVisible();
  const afterResize = await getViewportState(page);

  expect(afterResize.zoom).toBeGreaterThanOrEqual(1);
  expect(afterResize.x).toBeGreaterThanOrEqual(0);
  expect(afterResize.y).toBeGreaterThanOrEqual(0);
  expect(beforeResize.x + beforeResize.y).toBeGreaterThanOrEqual(0);

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any; update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      state.sceneMode = "victory";
      state.winnerPlayerId = state.activePlayerId;
    });
  });

  await expect(page.getByTestId("victory-panel")).toBeVisible();
  await tapElement(page.getByTestId("return-to-menu-button"));
  await expect(page.getByTestId("main-menu-panel")).toBeVisible();
  await tapElement(page.getByTestId("scenario-start-core-map-loop"));
  await expect(page.getByTestId("map-hud")).toBeVisible();
});
