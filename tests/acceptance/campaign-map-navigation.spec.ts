import { expect, test } from "@playwright/test";
import { getViewportState, pinchCanvas, touchCanvasPoint, getTileClientPoint } from "./mobileTestUtils";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test("campaign map keeps zoom, labels, selection, and touch feedback aligned", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const hero = await getTileClientPoint(page, 5, 10);
  await touchCanvasPoint(page, hero);
  const before = await getViewportState(page);
  await pinchCanvas(page, { x: hero.x - 24, y: hero.y }, { x: hero.x - 55, y: hero.y }, { x: hero.x + 24, y: hero.y }, { x: hero.x + 55, y: hero.y });
  const after = await getViewportState(page);
  expect(after.zoom).toBeGreaterThan(before.zoom);
  await expect(page.getByTestId("map-control-tip")).toContainText("Tap to select");
  await expect(page.getByTestId("campaign-map-presentation")).toBeVisible();
});
