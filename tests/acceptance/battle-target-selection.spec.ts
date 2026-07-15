import { expect, test } from "@playwright/test";

test("player selects a legal battle target before striking", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });

  await expect(page.getByTestId("battle-attack-button")).toBeDisabled();
  await canvas.click({ position: { x: 508, y: 266 } });
  await expect(page.getByTestId("battle-selected-target")).toContainText("Skeleton Archer");
  await expect(page.getByTestId("battle-attack-button")).toBeEnabled();

  await page.getByTestId("battle-attack-button").click();

  const skeletonArcherHealth = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    return store?.getState().scenario.units.find((unit: { id: string }) => unit.id === "guard-unit-2")?.currentHealth;
  });

  expect(skeletonArcherHealth).toBe(2);
});
