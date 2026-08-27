import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("renders the exact p-empty-1 particle at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Empty has no component motion.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "empty", theme, width);
    const root = ready.locator('[data-anchor="p-empty-1"]');
    await expect(ready.locator('[data-slot="empty"]')).toHaveCount(1);
    await expect(root.locator('[data-slot="empty-title"]')).toHaveText("No upcoming meetings");
    await expect(root.locator('[data-slot="empty-description"]')).toHaveText(
      "Create a meeting to get started.",
    );
    const media = root.locator('[data-slot="empty-media"]');
    await expect(media).toHaveAttribute("data-variant", "icon");
    await expect(media.locator(':scope > [aria-hidden="true"]')).toHaveCount(2);

    const create = root.getByRole("button", { name: "Create meeting" });
    const docs = root.getByRole("button", { name: "View docs" });
    await expect(create).toHaveAttribute("data-slot", "button");
    await expect(docs).toHaveAttribute("data-slot", "button");
    await expect(create).toHaveClass(/border-primary/);
    await expect(create).toHaveClass(/bg-primary/);
    await expect(docs).toHaveClass(/border-input/);
    await expect(docs).toHaveClass(/bg-popover/);
    await expect(root.locator('[data-slot="empty-content"] > div')).toHaveClass("flex gap-2");

    const measurements = await root.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const buttons = [...element.querySelectorAll("button")].map((button) => {
        const style = getComputedStyle(button);
        const buttonRect = button.getBoundingClientRect();
        return {
          height: buttonRect.height,
          paddingInline: style.paddingInline,
          radius: style.borderRadius,
          weight: style.fontWeight,
          width: buttonRect.width,
        };
      });
      return { buttons, height: rect.height, width: rect.width };
    });
    expect(measurements.width).toBeCloseTo(width === "desktop" ? 287.25 : 311.609_375, 3);
    expect(measurements.height).toBe(width === "desktop" ? 324 : 264);
    expect(measurements.buttons.map(({ height }) => height)).toEqual(
      width === "desktop" ? [28, 28] : [32, 32],
    );
    expect(measurements.buttons.map(({ radius }) => radius)).toEqual(["10px", "10px"]);
    expect(measurements.buttons.map(({ paddingInline }) => paddingInline)).toEqual(["9px", "9px"]);
    expect(measurements.buttons.map(({ weight }) => weight)).toEqual(["500", "500"]);
    const expectedButtonWidths =
      width === "desktop" ? [124.546_875, 106.703_125] : [138.031_25, 117.578_125];
    for (const [index, expectedWidth] of expectedButtonWidths.entries()) {
      expect(measurements.buttons[index]?.width).toBeCloseTo(expectedWidth, 3);
    }

    await page.keyboard.press("Tab");
    await expect(create).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(docs).toBeFocused();
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
