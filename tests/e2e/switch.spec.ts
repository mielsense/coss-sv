import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("matches the COSS Switch examples and behavior", async ({ page }, testInfo) => {
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "switch", theme, width);
    const particle = ready.locator('[data-particle="p-switch-1"]');
    const control = particle.locator('[data-slot="switch"]');
    const thumb = control.locator('[data-slot="switch-thumb"]');

    await expect(particle).toContainText("Marketing emails");
    await expect(control).toHaveAttribute("role", "switch");
    await expect(control).toHaveAttribute("aria-checked", "false");
    await expect(control).toHaveAttribute("data-unchecked", "");
    await expect(control).toHaveAccessibleName("Marketing emails");
    await expect(thumb).toHaveAttribute("data-unchecked", "");
    const rootMetrics = await control.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        duration: style.transitionDuration,
        height: rect.height,
        outline: style.outlineStyle,
        radius: Number.parseFloat(style.borderRadius),
        width: rect.width,
      };
    });
    expect(rootMetrics).toMatchObject({
      duration: "0.2s",
      height: width === "mobile" ? 22 : 18,
      outline: "none",
      width: width === "mobile" ? 38 : 30,
    });
    expect(rootMetrics.radius).toBeGreaterThan(rootMetrics.height);

    const before = await thumb.boundingBox();
    await control.click();
    await expect(control).toHaveAttribute("aria-checked", "true");
    await expect(control).toHaveAttribute("data-checked", "");
    await expect(thumb).toHaveAttribute("data-checked", "");
    await page.waitForTimeout(200);
    const after = await thumb.boundingBox();
    expect(before).not.toBeNull();
    expect(after).not.toBeNull();
    expect((after?.x ?? 0) - (before?.x ?? 0)).toBe(width === "mobile" ? 16 : 12);

    await control.evaluate((element) => (element as HTMLElement).blur());
    await page.keyboard.press("Tab");
    await control.focus();
    await expect(control).toBeFocused();
    expect(
      await control.evaluate((element) => {
        const style = getComputedStyle(element);
        return { outline: style.outlineStyle, shadow: style.boxShadow };
      }),
    ).toMatchObject({ outline: "none" });
    expect(await control.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
      "none",
    );

    const disabled = ready.locator('[data-testid="switch-disabled"]');
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await disabled.click({ force: true });
    await expect(disabled).toHaveAttribute("aria-checked", "false");

    const formSwitch = ready.locator('[data-testid="switch-form"]');
    await formSwitch.press("Space");
    await ready.getByRole("button", { name: "Submit switch form" }).click();
    await expect(ready.locator('[data-testid="switch-form-output"]')).toHaveText("true:on");
    await formSwitch.press("Enter");
    await expect(formSwitch).toHaveAttribute("aria-checked", "false");

    const custom = ready.locator('[data-particle="p-switch-6"] [data-slot="switch"]');
    expect(await custom.evaluate((element) => element.getBoundingClientRect().height)).toBe(
      width === "mobile" ? 18 : 14,
    );

    await assertNoAxeViolations(page, '[data-particle="p-switch-1"]');
    guard.assertNoErrors();
  }
});
