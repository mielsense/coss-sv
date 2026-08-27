import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { monitorConsole, openReadyPreview, runKeyboardTrace } from "./helpers/preview.js";

async function assertBreadcrumbAxe(page: Page) {
  const results = await new AxeBuilder({ page })
    .include('[data-preview-ready="true"]')
    .disableRules(["button-name"])
    .analyze();
  expect(results.violations).toEqual([]);
}

test("renders the complete Breadcrumb contract at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Breadcrumb has no component motion.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "breadcrumb", theme, width);
    const breadcrumb = ready.locator('[data-slot="breadcrumb"]');
    await expect(breadcrumb).toHaveAttribute("aria-label", "breadcrumb");
    await expect(ready.locator('[data-slot="breadcrumb-list"]')).toHaveCount(1);
    await expect(ready.locator('[data-slot="breadcrumb-item"]')).toHaveCount(4);
    await expect(ready.locator('[data-slot="breadcrumb-separator"]')).toHaveCount(3);
    await expect(ready.locator('[data-slot="breadcrumb-link"]')).toHaveCount(2);
    await expect(ready.locator('[data-slot="breadcrumb-link"]').first()).toHaveText("Home");
    await expect(ready.locator('[data-slot="breadcrumb-link"]').nth(1)).toHaveText("Components");
    const menuTrigger = ready.locator('[data-slot="menu-trigger"]');
    await expect(menuTrigger).toHaveCount(1);
    await expect(menuTrigger).toHaveRole("button");
    await expect(menuTrigger).toHaveAccessibleName("");
    await expect(menuTrigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(menuTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(menuTrigger).toHaveClass(
      /\*:data-\[slot=button-loading-indicator\]:text-foreground/,
    );
    await expect(ready.locator('[data-slot="breadcrumb-ellipsis"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(ready.locator('[data-slot="breadcrumb-page"]')).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(ready.locator('[data-slot="breadcrumb-page"]')).toHaveText("Breadcrumb");

    const listStyle = await ready.locator('[data-slot="breadcrumb-list"]').evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        display: style.display,
        fontSize: style.fontSize,
        gap: style.gap,
        height: rect.height,
        width: rect.width,
      };
    });
    expect(listStyle.display).toBe("flex");
    expect(listStyle.fontSize).toBe("14px");
    expect(listStyle.gap).toBe(width === "mobile" ? "6px" : "10px");
    expect(listStyle.height).toBe(width === "mobile" ? 46 : 20);
    expect(listStyle.width).toBeCloseTo(width === "mobile" ? 308 : 332.05, 1);

    const triggerBox = await menuTrigger.boundingBox();
    expect(triggerBox).toMatchObject({
      height: width === "mobile" ? 32 : 28,
      width: width === "mobile" ? 32 : 28,
    });

    await runKeyboardTrace(page, testInfo, ["Tab"]);
    await expect(ready.locator('[data-slot="breadcrumb-link"]').first()).toBeFocused();
    await runKeyboardTrace(page, testInfo, ["Tab"]);
    await expect(menuTrigger).toBeFocused();
    await page.keyboard.press("ArrowDown");
    const menu = page.locator('[data-slot="menu-popup"]');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveClass(/not-\[class\*='w-'\]:min-w-32/);
    await expect(menuTrigger).toHaveAttribute("aria-expanded", "true");
    const firstMenuItem = page.locator('[data-slot="menu-item"]').first();
    await expect(page.locator('[data-slot="menu-item"]')).toHaveText(["Docs", "Particles"]);
    await expect(firstMenuItem).toHaveClass(/data-inset:ps-8/);
    await expect(firstMenuItem).toHaveClass(
      /data-\[variant=destructive\]:text-destructive-foreground/,
    );
    await expect(firstMenuItem).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(menuTrigger).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(ready.locator('[data-slot="breadcrumb-link"]').nth(1)).toBeFocused();
    await assertBreadcrumbAxe(page);
    guard.assertNoErrors();
  }
});
