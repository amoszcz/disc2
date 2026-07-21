import { expect, test } from "@playwright/test";

async function stylesFor(page: import("@playwright/test").Page, testId: string): Promise<{ backgroundColor: string; transform: string; outlineWidth: string; opacity: string }> {
  return page.getByTestId(testId).evaluate((element) => {
    const style = getComputedStyle(element);
    return { backgroundColor: style.backgroundColor, transform: style.transform, outlineWidth: style.outlineWidth, opacity: style.opacity };
  });
}

test("shared buttons provide hover, pressed, focus, and disabled feedback", async ({ page }) => {
  await page.goto("/");
  const button = page.getByTestId("settings-open-button");
  const rest = await stylesFor(page, "settings-open-button");

  await button.hover();
  await page.waitForTimeout(150);
  const hovered = await stylesFor(page, "settings-open-button");
  expect(hovered.backgroundColor).not.toBe(rest.backgroundColor);

  await page.mouse.down();
  await page.waitForTimeout(150);
  const pressed = await stylesFor(page, "settings-open-button");
  expect(pressed.transform).not.toBe(rest.transform);
  await page.mouse.up();

  await button.focus();
  await expect.poll(() => stylesFor(page, "settings-open-button").then((style) => style.outlineWidth)).toBe("3px");

  await page.getByTestId("sprite-mapping-open-button").click();
  const disabled = page.getByTestId("sprite-mapping-save");
  await expect(disabled).toBeDisabled();
  expect((await stylesFor(page, "sprite-mapping-save")).opacity).toBe("0.45");
});

test("shared buttons retain usable press feedback in a mobile layout", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/");
  const button = page.getByTestId("settings-open-button");
  await button.tap();
  await expect(page.getByTestId("settings-panel")).toBeVisible();
  await context.close();
});
