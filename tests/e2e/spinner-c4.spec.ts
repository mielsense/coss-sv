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
    await expect(spinner.locator("path")).toHaveAttribute(
      "d",
      "M18.001 20C16.3295 21.2558 14.2516 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.8634 21.8906 13.7011 21.6849 14.5003C21.4617 15.3673 20.5145 15.77 19.6699 15.4728C18.9519 15.2201 18.6221 14.3997 18.802 13.66C18.9314 13.1279 19 12.572 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C13.3197 19 14.554 18.6348 15.6076 18",
    );
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
