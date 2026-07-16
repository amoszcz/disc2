import { expect, test } from "@playwright/test";

test("object state diagnostics remain readable when a dedicated guarded-location mapping is removed", async ({ page }) => {
  await page.goto("/?scenario=core-map-loop");

  const fallbackDiagnostic = await page.evaluate(() => {
    const appWindow = window as Window & {
      __gameStore?: { update: (mutator: (state: any) => void) => void };
      __visualTemplateCatalog?: { guardedLocationTemplates: Record<string, unknown> };
      __visualTemplateDiagnostics?: { map: any[] };
    };

    delete appWindow.__visualTemplateCatalog?.guardedLocationTemplates["resource-site:blocked"];
    appWindow.__gameStore?.update(() => {
      // Force a render after removing the dedicated guarded-location mapping.
    });

    return appWindow.__visualTemplateDiagnostics?.map.find(
      (entry) => entry.subjectKind === "guarded-location" && entry.subjectType === "resource-site:blocked"
    );
  });

  expect(fallbackDiagnostic).toMatchObject({
    assetKind: "fallback",
    isFallback: true
  });
});
