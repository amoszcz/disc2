import { expect, test } from "@playwright/test";

test("the scene falls back to placeholder visuals when a dedicated mapping is removed", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  const fallbackDiagnostic = await page.evaluate(() => {
    const appWindow = window as Window & {
      __gameStore?: { update: (mutator: (state: any) => void) => void };
      __visualTemplateCatalog?: { heroTemplates: Record<string, unknown> };
      __visualTemplateDiagnostics?: { map: any[] };
    };

    delete appWindow.__visualTemplateCatalog?.heroTemplates.Aren;
    appWindow.__gameStore?.update(() => {
      // Force a render after removing the dedicated template mapping.
    });

    return appWindow.__visualTemplateDiagnostics?.map.find(
      (entry) => entry.subjectKind === "hero" && entry.subjectType === "Aren"
    );
  });

  expect(fallbackDiagnostic).toMatchObject({
    assetKind: "fallback",
    isFallback: true
  });
});
