import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("matches the COSS Checkbox examples and behavior", async ({ page }, testInfo) => {
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "checkbox", theme, width);
    const particle = ready.locator('[data-particle="p-checkbox-1"]');
    const checkbox = particle.locator('[data-slot="checkbox"]');
    const indicator = checkbox.locator('[data-slot="checkbox-indicator"]');

    await expect(particle).toContainText("Accept terms and conditions");
    await expect(checkbox).toHaveAttribute("role", "checkbox");
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
    await expect(checkbox).toHaveAttribute("data-unchecked", "");
    await expect(checkbox).toHaveAccessibleName("Accept terms and conditions");
    await expect(indicator).toHaveAttribute("data-unchecked", "");
    await expect(indicator).toHaveClass(/data-unchecked:hidden/);
    expect(
      await checkbox.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          borderRadius: style.borderRadius,
          height: rect.height,
          outline: style.outlineStyle,
          width: rect.width,
        };
      }),
    ).toEqual({
      borderRadius: "4px",
      height: width === "mobile" ? 18 : 16,
      outline: "none",
      width: width === "mobile" ? 18 : 16,
    });

    await checkbox.click();
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    await expect(checkbox).toHaveAttribute("data-checked", "");
    const checkedIcon = indicator.locator("svg");
    await expect(checkedIcon).toHaveAttribute("aria-hidden", "true");
    await expect(checkedIcon).toHaveAttribute("viewBox", "0 0 24 24");
    await expect(checkedIcon).toHaveAttribute("stroke-width", "3");
    await expect(checkedIcon.locator(":scope > path")).toHaveCount(1);
    await checkbox.focus();
    const focused = await checkbox.evaluate((element) => {
      const style = getComputedStyle(element);
      return { outline: style.outlineStyle, shadow: style.boxShadow };
    });
    expect(focused.outline).toBe("none");
    expect(focused.shadow).not.toBe("none");

    const indeterminate = ready.locator('[data-testid="checkbox-indeterminate"]');
    await expect(indeterminate).toHaveAttribute("aria-checked", "mixed");
    const indeterminateIcon = indeterminate.locator("svg");
    await expect(indeterminateIcon).toHaveAttribute("aria-hidden", "true");
    await expect(indeterminateIcon).toHaveAttribute("viewBox", "0 0 24 24");
    await expect(indeterminateIcon).toHaveAttribute("stroke-width", "3");
    await expect(indeterminateIcon.locator(":scope > path")).toHaveCount(1);
    const disabled = ready.locator('[data-testid="checkbox-disabled"]');
    await expect(disabled).toHaveAttribute("aria-disabled", "true");
    await disabled.click({ force: true });
    await expect(disabled).toHaveAttribute("aria-checked", "false");

    const formCheckbox = ready.locator('[data-testid="checkbox-form"]');
    await formCheckbox.click();
    await ready.getByRole("button", { name: "Submit checkbox form" }).click();
    await expect(ready.locator('[data-testid="checkbox-form-output"]')).toHaveText("true:yes");
    await formCheckbox.press("Space");
    await ready.getByRole("button", { name: "Submit checkbox form" }).click();
    await expect(ready.locator('[data-testid="checkbox-form-output"]')).toHaveText("false:null");

    await assertNoAxeViolations(page, '[data-particle="p-checkbox-1"]');
    guard.assertNoErrors();
  }
});
