import { expect, test } from "@playwright/test";
import { monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("keeps populated parent controls stable across built-preview updates", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Checkbox Group has no motion-specific state.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "checkbox-group", theme, "desktop");
  const particle = ready.locator('[data-particle="p-checkbox-group-3"]');
  const parent = particle.getByRole("checkbox", { name: "Frameworks", exact: true });
  const controlledIds = (await parent.getAttribute("aria-controls"))?.split(" ") ?? [];

  expect(controlledIds).toHaveLength(3);
  for (const id of controlledIds) {
    const input = page.locator(`[id="${id}"]`);
    await expect(input).toHaveAttribute("type", "checkbox");
  }
  await expect(parent).toHaveAttribute("aria-checked", "false");

  await parent.click();
  await expect(parent).toHaveAttribute("aria-checked", "true");
  await expect(parent).toHaveAttribute("aria-controls", controlledIds.join(" "));

  await particle.getByRole("checkbox", { name: "Astro", exact: true }).click();
  await expect(parent).toHaveAttribute("aria-checked", "mixed");
  await expect(parent).toHaveAttribute("aria-controls", controlledIds.join(" "));
  guard.assertNoErrors();
});

test("submits the exact Checkbox Group selection captured before loading", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Checkbox Group has no motion-specific state.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "checkbox-group", theme, "desktop");
  const particle = ready.locator('[data-particle="p-checkbox-group-5"]');
  const submit = particle.getByRole("button", { name: "Submit" });
  const fieldset = particle.locator("fieldset");
  const legend = fieldset.locator(':scope > [data-slot="fieldset-legend"]');
  const group = particle.locator('[role="group"]');
  const legendId = await legend.getAttribute("id");

  expect(legendId).toBeTruthy();
  await expect(fieldset).toHaveCount(1);
  await expect(particle.locator('[data-slot="fieldset"]')).toHaveCount(0);
  await expect(fieldset).toHaveAttribute("aria-labelledby", legendId ?? "");
  await expect(group).toHaveAttribute("aria-labelledby", legendId ?? "");
  await expect(particle.locator(`[aria-labelledby="${legendId}"]`)).toHaveCount(2);

  await particle.getByRole("checkbox", { name: "Vite", exact: true }).check();
  const dialogPromise = page.waitForEvent("dialog");
  await submit.click();
  await expect(submit).toHaveAttribute("data-loading", "");
  await particle.getByRole("checkbox", { name: "Astro", exact: true }).check();

  const flushPromise = page.evaluate(() => window.__COSS_PREVIEW_RUNTIME__.flushTimers());
  const alert = await dialogPromise;
  expect(alert.message()).toBe("Selected: next, vite");
  await alert.dismiss();
  expect(await flushPromise).toBeGreaterThan(0);
  await expect(submit).not.toHaveAttribute("data-loading", "");
  guard.assertNoErrors();
});
