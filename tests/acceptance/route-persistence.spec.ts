import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { clickTile, mutateTravelLink } from "./mobileTestUtils";

async function resetSelectedHeroMovement(page: Page, remainingMovement: number): Promise<void> {
  await page.evaluate((nextMovement: number) => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const hero = state?.scenario.heroes.find((entry: { id: string }) => entry.id === state.selectedHeroId);
    if (!hero) {
      throw new Error("Selected hero was not available.");
    }

    hero.remainingMovement = nextMovement;
  }, remainingMovement);
}

test("unfinished routes remain visible after end turn and can continue on the next click", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");
  const canvas = page.getByLabel("game canvas");

  const farDestinationClick = await page.evaluate(() => {
    const store = (window as Window & { __gameStore?: { getState: () => any } }).__gameStore;
    const state = store?.getState();
    const viewport = state.mapViewState.viewport;
    const scaledTileSize = 10 * viewport.zoomLevel;
    return {
      x: (20 - viewport.panOffsetX + 0.5) * scaledTileSize,
      y: (31 - viewport.panOffsetY + 0.5) * scaledTileSize
    };
  });

  await canvas.click({ position: farDestinationClick });

  await expect(page.getByTestId("route-preview-status")).toHaveText("previewed");
  const beforeTurn = await page.getByTestId("route-preview-destination").textContent();
  const stepsBeforeTurn = await page.getByTestId("route-preview-steps").textContent();

  await page.getByTestId("end-turn-button").click();

  await expect(page.getByTestId("route-preview-status")).toHaveText("continuation");
  await expect(page.getByTestId("route-preview-destination")).toHaveText(beforeTurn ?? "");
  await expect(page.getByTestId("route-preview-steps")).not.toHaveText(stepsBeforeTurn ?? "");

  await canvas.click({ position: farDestinationClick });

  await expect(page.getByTestId("route-preview-status")).toHaveText("continuation");
});

test("repeated linked-map travel keeps the session stable and invalid links fail safely", async ({ page }) => {
  await page.goto("/?scenario=advanced-terrain-scenario");

  await clickTile(page, 5, 10);
  await clickTile(page, 8, 10);
  await clickTile(page, 8, 10);
  await clickTile(page, 0, 4);
  await clickTile(page, 0, 4);
  await expect(page.getByTestId("active-map-name")).toHaveText("Broken Causeway");

  await mutateTravelLink(page, "cave-entry-link", "missing-map");
  await resetSelectedHeroMovement(page, 8);
  await clickTile(page, 8, 10);
  await clickTile(page, 8, 10);

  await expect(page.getByTestId("active-map-name")).toHaveText("Broken Causeway");
  await expect(page.getByTestId("error-detail")).toHaveText("That linked passage is unavailable.");
});
