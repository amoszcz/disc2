import { expect, test } from "@playwright/test";
import { tapElement } from "./mobileTestUtils";

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

  await page.goto("/");
  await tapElement(page.getByTestId("scenario-start-advanced-terrain-scenario"));
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("remaining-movement")).toContainText("8");

  await page.goto("/");
  await tapElement(page.getByTestId("scenario-start-submap-expedition-scenario"));
  await expect(page.getByTestId("map-hud")).toBeVisible();
  await expect(page.getByTestId("active-map-name")).toContainText("Surface Camp");
});
