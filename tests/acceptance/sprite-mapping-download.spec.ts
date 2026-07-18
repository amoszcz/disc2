import { expect, test } from "@playwright/test";

test("developer can download the current edited mapping JSON", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("sprite-mapping-open-button").click();
  await expect(page.getByTestId("atlas-dimensions")).toBeVisible();
  await page.getByTestId("sprite-mapping-coordinate-x").fill("1");
  await page.getByTestId("sprite-mapping-coordinate-y").fill("1");
  await page.getByTestId("sprite-mapping-coordinate-width").fill("100");
  await page.getByTestId("sprite-mapping-coordinate-height").fill("100");
  await page.getByTestId("sprite-mapping-apply-entry").click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("sprite-mapping-download").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("sprite-mapping.json");
  const stream = await download.createReadStream();
  let text = "";
  for await (const chunk of stream ?? []) text += chunk.toString();
  expect((JSON.parse(text) as { sprites: Array<Record<string, unknown>> }).sprites[0]).toMatchObject({ width: 100, height: 100 });
  await expect(page.getByTestId("sprite-mapping-message")).toHaveText("Resolved mapping JSON downloaded.");
  await expect(page.getByTestId("sprite-mapping-entry-edited")).toBeVisible();
});
