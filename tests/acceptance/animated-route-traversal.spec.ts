import { expect, test } from "@playwright/test";
import { clickTile } from "./mobileTestUtils";

test("a confirmed route advances one tile at a time at the animated cadence", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  await clickTile(page, 7, 11);
  await clickTile(page, 7, 11);

  await expect(page.getByTestId("route-traversal-status")).toBeVisible();
  await page.waitForTimeout(1100);
  await expect.poll(() => page.evaluate(() => (window as any).__gameStore.getState().scenario.heroes[0].mapPosition)).toEqual({ x: 6, y: 10 });
  await page.waitForTimeout(1100);
  await expect.poll(() => page.evaluate(() => (window as any).__gameStore.getState().scenario.heroes[0].mapPosition)).toEqual({ x: 7, y: 11 });
});
