import { expect, test } from "@playwright/test";
import { dragCanvas, getTileClientPoint, getViewportState, pinchCanvas, tapElement, touchCanvasPoint } from "./mobileTestUtils";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test("player can use touch-capable controls for map navigation and battle actions", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("map-control-tip")).toContainText("Tap to select");

  const heroPoint = await getTileClientPoint(page, 0, 2);
  await touchCanvasPoint(page, heroPoint);

  const routePoint = await getTileClientPoint(page, 3, 2);
  await touchCanvasPoint(page, routePoint);
  await expect(page.getByTestId("route-preview-status")).toContainText(/previewed|partial|continuation/);
  await touchCanvasPoint(page, routePoint);

  const beforePan = await getViewportState(page);
  await dragCanvas(
    page,
    { x: heroPoint.x + 80, y: heroPoint.y + 40 },
    { x: heroPoint.x + 10, y: heroPoint.y + 10 }
  );
  const afterPan = await getViewportState(page);
  expect(afterPan.x >= beforePan.x || afterPan.y >= beforePan.y).toBeTruthy();

  const beforeZoom = await getViewportState(page);
  const pageScaleBefore = await page.evaluate(() => window.visualViewport?.scale ?? 1);
  await pinchCanvas(
    page,
    { x: heroPoint.x - 30, y: heroPoint.y },
    { x: heroPoint.x - 70, y: heroPoint.y },
    { x: heroPoint.x + 30, y: heroPoint.y },
    { x: heroPoint.x + 70, y: heroPoint.y }
  );
  const afterZoom = await getViewportState(page);
  const pageScaleAfter = await page.evaluate(() => window.visualViewport?.scale ?? 1);
  expect(afterZoom.zoom).toBeGreaterThan(beforeZoom.zoom);
  expect(pageScaleAfter).toBe(pageScaleBefore);

  await tapElement(page.getByTestId("end-turn-button"));
  await expect(page.getByTestId("route-preview-status")).toContainText(/continuation|partial/);
  await tapElement(page.getByTestId("end-turn-button"));
  await expect(page.getByTestId("battle-hud")).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("battle-control-tip")).toContainText("Tap an enemy card");

  const canvas = page.getByLabel("game canvas");
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas box was not available.");
  }

  await touchCanvasPoint(page, { x: box.x + box.width * 0.76, y: box.y + box.height * 0.2 });
  await tapElement(page.getByTestId("battle-attack-button"));

  const logState = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    return store?.getState().messageLog.at(-1);
  });

  expect(typeof logState).toBe("string");
});
