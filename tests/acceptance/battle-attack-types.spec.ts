import { expect, test } from "@playwright/test";

test("area attack hits every living enemy during the mage turn", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });

  await canvas.click({ position: { x: 508, y: 266 } });
  await page.getByTestId("battle-attack-button").click();
  await expect(page.getByTestId("battle-active-unit")).toContainText("Mage");
  await expect(page.getByTestId("battle-target-message")).toContainText("Area strike will hit 2 living enemies");

  await page.getByTestId("battle-attack-button").click();

  const hitPoints = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    return {
      skeleton: state?.scenario.units.find((unit: { id: string }) => unit.id === "guard-unit-1")?.currentHealth,
      skeletonArcher: state?.scenario.units.find((unit: { id: string }) => unit.id === "guard-unit-2")?.currentHealth
    };
  });

  expect(hitPoints).toEqual({ skeleton: 4, skeletonArcher: 0 });
});
