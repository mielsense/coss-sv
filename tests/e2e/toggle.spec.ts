import { expect, test } from "@playwright/test";
import {
  assertNoAxeViolations,
  monitorConsole,
  openReadyPreview,
  prepareDeterministicPage,
} from "./helpers/preview.js";

const desktopMetrics = [
  { height: 32, width: 62.046875 },
  { height: 32, width: 113.1328125 },
  { height: 32, width: 32 },
  { height: 28, width: 49.046875 },
  { height: 36, width: 58.4375 },
  { height: 32, width: 75.390625 },
] as const;

const mobileMetrics = [
  { height: 36, width: 68.0078125 },
  { height: 36, width: 125.578125 },
  { height: 36, width: 36 },
  { height: 32, width: 53.7578125 },
  { height: 40, width: 63.359375 },
  { height: 36, width: 82.9765625 },
] as const;

test("matches the seven COSS Toggle particles at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Toggle has no motion-specific state.");
  const guard = monitorConsole(page);
  await prepareDeterministicPage(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "toggle", theme, width);
    const particles = ready.locator("[data-particle]");
    await expect(particles).toHaveCount(7);

    const expected = width === "desktop" ? desktopMetrics : mobileMetrics;
    for (let index = 0; index < expected.length; index += 1) {
      const toggle = particles.nth(index).locator('[data-slot="toggle"]');
      const metric = await toggle.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          borderRadius: style.borderRadius,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          height: rect.height,
          paddingInline: style.paddingInline,
          width: rect.width,
        };
      });
      const { width: renderedWidth, ...renderedStyles } = metric;
      expect(renderedStyles).toEqual({
        borderRadius: "10px",
        fontSize: width === "desktop" ? "14px" : "16px",
        fontWeight: "500",
        height: expected[index].height,
        paddingInline: `${[7, 7, 7, 5, 9, 7][index]}px`,
      });
      expect(renderedWidth).toBeCloseTo(expected[index].width, 1);
    }

    await expect(particles.nth(0).getByRole("button", { name: "Toggle" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await expect(particles.nth(1).getByRole("button", { name: "Outline Toggle" })).toBeEnabled();
    await expect(particles.nth(2).getByRole("button", { name: "Toggle bold" })).toHaveCount(1);
    await expect(particles.nth(5).getByRole("button", { name: "Disabled" })).toBeDisabled();
    await expect(particles.nth(6).locator('[data-slot="toggle"]')).toHaveCount(3);

    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});

test("preserves Toggle pointer, keyboard, controlled state, and focus-visible behavior", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "motion",
    "The static projects cover the interaction states.",
  );
  const guard = monitorConsole(page);
  await prepareDeterministicPage(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "toggle", theme, "desktop");

  const standalone = ready.locator('[data-particle="p-toggle-1"] [data-slot="toggle"]');
  await standalone.click();
  await expect(standalone).toHaveAttribute("aria-pressed", "true");
  await expect(standalone).toHaveAttribute("data-pressed", "");
  await standalone.press("Space");
  await expect(standalone).toHaveAttribute("aria-pressed", "false");
  await standalone.press("Enter");
  await expect(standalone).toHaveAttribute("aria-pressed", "true");

  await page.keyboard.press("Tab");
  const focused = ready.locator('[data-particle="p-toggle-2"] [data-slot="toggle"]');
  await expect(focused).toBeFocused();
  await page.waitForTimeout(200);
  expect(
    await focused.evaluate((element) => ({
      boxShadow: getComputedStyle(element).boxShadow,
      zIndex: getComputedStyle(element).zIndex,
    })),
  ).toMatchObject({ zIndex: "auto" });

  const bookmark = ready.getByTestId("controlled-bookmark");
  await bookmark.click();
  await expect(bookmark).toHaveAttribute("aria-label", "Remove bookmark");
  await expect(bookmark).toHaveAttribute("aria-pressed", "true");
  await expect(ready.getByTestId("bookmark-state")).toHaveText("bookmarked");
  guard.assertNoErrors();
});
