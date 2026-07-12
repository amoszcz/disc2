import { expect, test } from "@playwright/test";

test("blocked river tiles reject movement without spending points", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      state.scenario.heroes[0].mapPosition = { x: 19, y: 10 };
      state.scenario.heroes[0].remainingMovement = 8;
      state.selectedHeroId = "hero-1";
      state.routeFeedback = null;
      state.messageLog.push("Aren approaches the riverbank.");
    });
  });

  const canvas = page.getByLabel("game canvas");
  await canvas.click({ position: { x: 205, y: 105 } });

  await expect(page.getByTestId("remaining-movement")).toHaveText("8");
  await expect(page.getByTestId("route-terrain")).toHaveText("Rivers");
  await expect(page.getByTestId("route-impact")).toHaveText("Blocked terrain");
  await expect(page.getByTestId("error-detail")).toHaveText("rivers cannot be traversed.");
});
