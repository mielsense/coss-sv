import { expect, type Page, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

async function assertThemeGroupAxe(page: Page, theme: string) {
  if (theme === "light") {
    await assertNoAxeViolations(page, '[data-particle="p-radio-group-6"]');
    return;
  }

  await assertNoAxeViolations(page, '[data-particle="p-radio-group-6"]', ["color-contrast"]);
}

test("labels the COSS form and theme Radio Groups without browser errors", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Radio Group has no motion-specific state.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "radio-group", theme, "desktop");

  const frameworks = ready.locator('[data-particle="p-radio-group-5"]');
  const themes = ready.locator('[data-particle="p-radio-group-6"]');
  const frameworksGroup = frameworks.getByRole("radiogroup", { name: "Frameworks" });
  const themesGroup = themes.getByRole("radiogroup", { name: "Choose a theme" });
  await expect(frameworksGroup).toBeVisible();
  await expect(themesGroup).toBeVisible();
  for (const [particle, group] of [
    [frameworks, frameworksGroup],
    [themes, themesGroup],
  ] as const) {
    const fieldset = particle.locator("fieldset");
    const legend = fieldset.locator(':scope > [data-slot="fieldset-legend"]');
    const legendId = await legend.getAttribute("id");
    expect(legendId).toBeTruthy();
    await expect(fieldset).toHaveCount(1);
    await expect(particle.locator('[data-slot="fieldset"]')).toHaveCount(0);
    await expect(fieldset).toHaveAttribute("aria-labelledby", legendId ?? "");
    await expect(group).toHaveAttribute("aria-labelledby", legendId ?? "");
    await expect(particle.locator(`[aria-labelledby="${legendId}"]`)).toHaveCount(2);
  }
  for (const label of ["Light", "Dark"]) {
    await expect(themes.getByText(label, { exact: true })).toHaveClass(
      /not-peer-data-checked:text-muted-foreground\/70/,
    );
  }
  await assertNoAxeViolations(page, '[data-particle="p-radio-group-5"]');
  await assertThemeGroupAxe(page, theme);
  guard.assertNoErrors();
});

test("submits the p-radio-group-5 value captured before its loading delay", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "The static projects cover form submission.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "radio-group", theme, "desktop");
  const particle = ready.locator('[data-particle="p-radio-group-5"]');
  const submit = particle.getByRole("button", { name: "Submit" });

  const dialogPromise = page.waitForEvent("dialog", { timeout: 2_000 });
  await submit.click();
  await expect(submit).toHaveAttribute("data-loading", "");
  await particle.getByRole("radio", { name: "Vite" }).click();
  const flush = page.evaluate(() => window.__COSS_PREVIEW_RUNTIME__.flushTimers());
  const dialog = await dialogPromise;

  expect(dialog.message()).toBe("Selected: next");
  await dialog.dismiss();
  await flush;
  await expect(submit).not.toHaveAttribute("data-loading");
  guard.assertNoErrors();
});
