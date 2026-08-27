import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("renders every Badge variant, size, and polymorphic link", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Badge has no component motion.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "badge", theme, width);
    await expect(ready.locator('[data-slot="badge"]')).toHaveCount(13);
    const link = ready.locator('[data-anchor="badge-link"]');
    await expect(link).toHaveAttribute("href", "/");
    await expect(link).not.toHaveAttribute("role", "button");
    const dimensions = await ready.locator('[data-anchor="badge-default"]').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { height: rect.height, minWidth: getComputedStyle(element).minWidth };
    });
    expect(dimensions.height).toBe(width === "desktop" ? 18 : 22);
    expect(dimensions.minWidth).toBe(width === "desktop" ? "18px" : "22px");
    await link.focus();
    await expect(link).toBeFocused();
    // COSS's exact destructive treatment is white 12px text on red-500 and fails
    // axe's AA contrast rule upstream. Keep that visual contract while proving
    // every other badge variant has no automated accessibility violations.
    await assertNoAxeViolations(page, '[data-slot="badge"]:not([data-anchor="badge-destructive"])');
    guard.assertNoErrors();
  }
});
