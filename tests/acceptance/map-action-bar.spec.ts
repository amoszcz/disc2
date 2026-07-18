import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test("map actions stay beside the canvas and can be used without document scrolling", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  const bar = page.getByTestId("map-action-bar");
  const canvas = page.getByLabel("game canvas");
  await expect(bar).toBeVisible();
  expect((await bar.boundingBox())?.x).toBeGreaterThan((await canvas.boundingBox())?.x ?? 0);

  const beforeZoom = await page.evaluate(() => (window as Window & { __gameStore?: { getState: () => any } }).__gameStore?.getState().mapViewState.viewport.zoomLevel);
  await page.getByTestId("map-zoom-in-button").click();
  await expect.poll(() => page.evaluate(() => (window as Window & { __gameStore?: { getState: () => any } }).__gameStore?.getState().mapViewState.viewport.zoomLevel)).toBeGreaterThan(beforeZoom ?? 0);

  await page.getByTestId("end-turn-button").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("map icon controls expose their action names on hover-capable browsers", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  for (const [testId, name] of [["map-zoom-out-button", "Zoom Out"], ["map-zoom-in-button", "Zoom In"], ["end-turn-button", "End Turn"]] as const) {
    const control = page.getByTestId(testId);
    await control.hover();
    await expect(control).toHaveAttribute("title", name);
    await expect(control).toHaveAttribute("aria-label", name);
  }
});
