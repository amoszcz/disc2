import { expect, test } from "@playwright/test";

async function enterBattle(page: import("@playwright/test").Page): Promise<void> {
  await page.goto("/?scenario=core-map-loop");
  const canvas = page.getByLabel("game canvas");
  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });
  await expect(page.getByTestId("battle-hud")).toBeVisible();
}

test("battle queue is horizontal, template-backed, and below the canvas", async ({ page }) => {
  await enterBattle(page);

  const canvas = page.getByLabel("game canvas");
  const queue = page.getByTestId("battle-turn-queue");
  await expect(queue).toBeVisible();
  expect((await queue.boundingBox())?.y).toBeGreaterThanOrEqual(((await canvas.boundingBox())?.y ?? 0) + ((await canvas.boundingBox())?.height ?? 0));

  const firstUnit = page.getByTestId("battle-queue-item").first();
  await expect(firstUnit.getByTestId("queue-unit-template")).toBeVisible();
  await firstUnit.hover();
  await expect(firstUnit).toHaveAttribute("title", /.+/);
});
