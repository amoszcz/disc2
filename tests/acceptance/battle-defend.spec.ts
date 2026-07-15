import { expect, test } from "@playwright/test";

test("defend halves the next incoming hit before the unit acts again", async ({ page }) => {
  await page.goto("/");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      if (!state.battle) {
        return;
      }

      state.battle.activeUnitId = "hero-unit-1";
      state.battle.turnQueue = ["hero-unit-1", "guard-unit-1", "hero-unit-2"];
      state.battle.targetingState = {
        activeUnitId: "hero-unit-1",
        selectedTargetUnitId: null,
        legalTargetUnitIds: ["guard-unit-1", "guard-unit-2"],
        canStrike: false,
        canDefend: true
      };
    });
  });

  await expect(page.getByTestId("battle-active-unit")).toContainText("Militia");
  await page.getByTestId("battle-defend-button").click();

  const result = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    return {
      activeUnit: state?.battle?.activeUnitId,
      militiaHealth: state?.scenario.units.find((unit: { id: string }) => unit.id === "hero-unit-1")?.currentHealth
    };
  });

  expect(result).toEqual({ activeUnit: "hero-unit-2", militiaHealth: 8 });
});
