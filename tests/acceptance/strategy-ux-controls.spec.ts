import { expect, test } from "@playwright/test";

test("map controls and turn consequences remain visible without hover", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  const endTurn = page.getByTestId("end-turn-button");
  await expect(endTurn).toHaveAttribute("aria-label", "End Turn");
  await endTurn.focus();
  await expect.poll(() => endTurn.evaluate((element) => getComputedStyle(element).outlineWidth)).toBe("3px");
  await expect(page.getByTestId("end-turn-consequence")).toContainText("passes control to the next side");
});

test("primary map controls remain named and visible on a touch viewport", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/?scenario=core-map-loop");

  await expect(page.getByTestId("map-action-bar")).toBeVisible();
  await expect(page.getByTestId("map-zoom-in-button")).toHaveAttribute("aria-label", "Zoom In");
  await expect(page.getByTestId("end-turn-consequence")).toBeVisible();
  await context.close();
});
