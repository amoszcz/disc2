import { expect, test } from "@playwright/test";

test("clearing a guarded location returns the player to an open site", async ({ page }) => {
  await page.goto("/");
  const canvas = page.getByLabel("game canvas");

  await canvas.click({ position: { x: 48, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await canvas.click({ position: { x: 144, y: 240 } });
  await page.getByTestId("end-turn-button").click();
  await canvas.click({ position: { x: 336, y: 240 } });
  await canvas.click({ position: { x: 336, y: 240 } });

  await expect(page.getByTestId("battle-hud")).toBeVisible();

  for (let index = 0; index < 5; index += 1) {
    await page.getByTestId("battle-attack-button").click();
  }

  await expect(page.getByTestId("victory-panel")).toBeVisible();
});

test("end-turn auto-advance into a guarded site starts battle immediately", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { update: (mutator: (state: any) => void) => void } }).__gameStore;
    store?.update((state) => {
      const hero = state.scenario.heroes.find((entry: { id: string }) => entry.id === "hero-1");
      if (!hero) {
        return;
      }

      hero.mapPosition = { x: 2, y: 2 };
      hero.remainingMovement = 1;
      state.selectedHeroId = "hero-1";
      state.activeRoutePreview = {
        heroId: "hero-1",
        destinationPosition: { x: 3, y: 2 },
        steps: [{ position: { x: 3, y: 2 }, movementCost: 1, terrainLabel: "Plains", objectLabels: [] }],
        totalMovementCost: 1,
        status: "previewed",
        lastValidatedFromPosition: { x: 2, y: 2 },
        isAwaitingConfirmation: true
      };
      state.routeFeedback = null;
      state.battle = null;
      state.sceneMode = "map";
    });
  });

  await page.getByTestId("end-turn-button").click();

  await expect(page.getByTestId("battle-hud")).toBeVisible();
});
