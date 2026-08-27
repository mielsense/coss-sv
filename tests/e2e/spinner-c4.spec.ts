import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("matches the exact COSS Spinner SVG and motion contract", async ({ page }, testInfo) => {
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "spinner-c4", theme, width);
    const spinner = ready.locator('[data-testid="parity-spinner"]');
    await expect(spinner).toHaveAttribute("role", "status");
    await expect(spinner).toHaveAccessibleName("Loading");
    await expect(spinner).toHaveAttribute("viewBox", "0 0 24 24");
    await expect(spinner.locator("path")).toHaveAttribute("d", "M21 12a9 9 0 1 1-6.219-8.56");
    expect(
      await spinner.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          animationDuration: style.animationDuration,
          animationIterationCount: style.animationIterationCount,
          animationName: style.animationName,
          computedHeight: style.height,
          computedWidth: style.width,
          transformedRectIsAtLeast24: rect.height >= 24 && rect.width >= 24,
        };
      }),
    ).toEqual({
      animationDuration: "1s",
      animationIterationCount: "infinite",
      animationName: "spin",
      computedHeight: "24px",
      computedWidth: "24px",
      transformedRectIsAtLeast24: true,
    });
    await page.keyboard.press("Tab");
    await expect(spinner).not.toBeFocused();
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
