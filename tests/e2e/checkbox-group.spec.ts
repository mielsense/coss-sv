import { expect, test } from "@playwright/test";
import { monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("keeps populated parent controls stable from Checkbox Group SSR through hydration", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Checkbox Group has no motion-specific state.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready, serverHtml } = await openReadyPreview(page, "checkbox-group", theme, "desktop");
  const particle = ready.locator('[data-particle="p-checkbox-group-3"]');
  const parent = particle.getByRole("checkbox", { name: "Frameworks", exact: true });
  const controlledIds = (await parent.getAttribute("aria-controls"))?.split(" ") ?? [];

  expect(controlledIds).toHaveLength(3);
  expect(serverHtml).toContain(`aria-controls="${controlledIds.join(" ")}"`);
  expect(controlledIds.every((id) => serverHtml.includes(`id="${id}"`))).toBe(true);
  for (const id of controlledIds) {
    const input = page.locator(`[id="${id}"]`);
    await expect(input).toHaveAttribute("type", "checkbox");
  }
  await expect(parent).toHaveAttribute("aria-checked", "false");
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
  const dialog = page.waitForEvent("dialog");
  await submit.click();
  await expect(submit).toHaveAttribute("data-loading", "");
  await particle.getByRole("checkbox", { name: "Astro", exact: true }).check();

  const alert = await dialog;
  expect(alert.message()).toBe("Selected: next, vite");
  await alert.dismiss();
  guard.assertNoErrors();
});
