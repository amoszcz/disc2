import { expect, test } from "@playwright/test";

test("storybook previews update when a subject state is changed", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("storybook-open-button").click();

  await page.getByTestId("storybook-state-unit-archer").selectOption("shoot");
  await expect(page.getByTestId("storybook-selected-subject")).toContainText("Archer");

  const diagnostics = await page.evaluate(() => {
    return (window as Window & { __storybookPreviewDiagnostics?: any[] }).__storybookPreviewDiagnostics ?? [];
  });

  expect(diagnostics.find((entry: { subjectType: string }) => entry.subjectType === "Archer")).toMatchObject({
    requestedStateName: "shoot",
    resolvedStateName: "shoot",
    isFallback: false
  });
});
