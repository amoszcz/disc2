import { expect, test } from "@playwright/test";

test("storybook surfaces fallback rendering when a dedicated subject mapping is removed", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("storybook-open-button").click();

  const diagnostic = await page.evaluate(() => {
    const appWindow = window as Window & {
      __gameStore?: { update: (mutator: (state: any) => void) => void };
      __visualTemplateCatalog?: { heroTemplates: Record<string, unknown> };
      __storybookPreviewDiagnostics?: any[];
    };

    delete appWindow.__visualTemplateCatalog?.heroTemplates["Aren"];
    appWindow.__gameStore?.update(() => {
      // Force a render after removing the dedicated storybook subject mapping.
    });

    return appWindow.__storybookPreviewDiagnostics?.find((entry) => entry.subjectType === "Aren");
  });

  expect(diagnostic).toMatchObject({
    isFallback: true,
    assetKind: "fallback"
  });
});
