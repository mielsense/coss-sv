import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

const variants = [
  ["p-button-1", "border-primary bg-primary"],
  ["p-button-2", "border-input bg-popover"],
  ["p-button-3", "bg-secondary text-secondary-foreground"],
  ["p-button-4", "border-destructive bg-destructive"],
  ["p-button-5", "text-destructive-foreground"],
  ["p-button-6", "border-transparent text-foreground"],
  ["p-button-7", "underline-offset-4"],
] as const;

const sizeHeights = {
  desktop: { default: 32, icon: 32, iconLg: 36, iconSm: 28, lg: 36, sm: 28, xl: 40, xs: 24 },
  mobile: { default: 36, icon: 36, iconLg: 40, iconSm: 32, lg: 40, sm: 32, xl: 44, xs: 28 },
} as const;

test("matches the exact COSS Button variants, sizes, links, loading, and keyboard contract", async ({
  page,
}, testInfo) => {
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "button", theme, width);
    const button = ready.locator('[data-particle="p-button-1"] [data-slot="button"]');

    await expect(button).toHaveRole("button");
    await expect(button).toHaveAccessibleName("Button");
    await expect(button).toHaveAttribute("type", "button");
    await expect(button).toContainText("Button");
    expect(
      await button.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          animationName: style.animationName,
          borderRadius: style.borderRadius,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          height: rect.height,
          transition: style.transitionProperty,
        };
      }),
    ).toEqual({
      animationName: "none",
      borderRadius: "10px",
      fontSize: width === "mobile" ? "16px" : "14px",
      fontWeight: "500",
      height: sizeHeights[width].default,
      transition: "box-shadow",
    });

    for (const [particleName, classFragment] of variants) {
      await expect(
        ready.locator(`[data-particle="${particleName}"] [data-slot="button"]`),
      ).toHaveClass(new RegExp(classFragment.replaceAll(" ", ".*")));
    }

    const sizeCases = [
      ["p-button-8", sizeHeights[width].xs],
      ["p-button-9", sizeHeights[width].sm],
      ["p-button-10", sizeHeights[width].lg],
      ["p-button-11", sizeHeights[width].xl],
      ["p-button-13", sizeHeights[width].icon],
      ["p-button-14", sizeHeights[width].iconSm],
      ["p-button-15", sizeHeights[width].iconLg],
    ] as const;
    for (const [particleName, expectedHeight] of sizeCases) {
      const current = ready.locator(`[data-particle="${particleName}"] [data-slot="button"]`);
      const box = await current.boundingBox();
      expect(box?.height).toBe(expectedHeight);
      if (["p-button-13", "p-button-14", "p-button-15"].includes(particleName)) {
        expect(box?.width).toBe(expectedHeight);
      }
    }

    const disabled = ready.locator('[data-particle="p-button-12"] button');
    await expect(disabled).toBeDisabled();
    const link = ready.locator('[data-particle="p-button-17"] a');
    await expect(link).toHaveAttribute("href", "/");
    await expect(link).not.toHaveAttribute("role", "button");
    await expect(link).toHaveAccessibleName("Link");

    const polymorphic = ready.locator('[data-testid="button-polymorphic"]');
    await expect(polymorphic).toHaveAttribute("role", "button");
    await expect(polymorphic).toHaveAttribute("tabindex", "0");

    const loading = ready.locator('[data-particle="p-button-41"] button');
    await loading.click();
    await expect(loading).toHaveAttribute("data-loading", "");
    await expect(loading).toHaveAttribute("aria-disabled", "true");
    await expect(loading).toBeDisabled();
    await expect(loading.locator('[data-slot="button-loading-indicator"]')).toBeVisible();
    await expect(loading).toContainText("Submit");

    await button.focus();
    expect(await button.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
      "none",
    );
    await assertNoAxeViolations(page, '[data-particle="p-button-1"]');
    guard.assertNoErrors();
  }
});
