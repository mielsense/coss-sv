import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("renders and operates the COSS textarea at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Static textarea coverage runs in both themes.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const expected =
    theme === "dark"
      ? {
          background: "oklab(0.999994 0.0000455678 0.0000200868 / 0.0256)",
          border: "oklab(0.999994 0.0000455678 0.0000200868 / 0.08)",
          focusBorder: "oklch(0.556 0 none)",
          ring: "color-mix(in oklab, oklch(55.6% 0 none) 24%, transparent)",
          ringShadow:
            "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.556 0 0 / 0.24) 0px 0px 0px 3px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
        }
      : {
          background: "rgb(255, 255, 255)",
          border: "oklab(0 0 0 / 0.1)",
          focusBorder: "oklch(0.708 0 none)",
          ring: "color-mix(in oklab, oklch(70.8% 0 none) 24%, transparent)",
          ringShadow:
            "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.708 0 0 / 0.24) 0px 0px 0px 3px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
        };

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "textarea-c3", theme, width);
    const control = ready.locator('[data-slot="textarea-control"]');
    const textarea = ready.locator('[data-testid="parity-textarea"]');
    await expect(control).toHaveAttribute("data-size", "default");
    await expect(textarea).toHaveAttribute("data-slot", "textarea");
    await expect(textarea).toHaveAttribute("placeholder", "Type your message here");
    const metrics = await textarea.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const control = element.closest<HTMLElement>('[data-slot="textarea-control"]');
      if (!control) throw new Error("Textarea control wrapper is missing.");
      const controlRect = control.getBoundingClientRect();
      const controlStyle = getComputedStyle(control);
      return {
        background: controlStyle.backgroundColor,
        border: controlStyle.borderColor,
        controlHeight: controlRect.height,
        controlWidth: controlRect.width,
        minHeight: style.minHeight,
        width: rect.width,
      };
    });
    expect(metrics).toEqual({
      background: expected.background,
      border: expected.border,
      controlHeight: width === "mobile" ? 84 : 72,
      controlWidth: 256,
      minHeight: width === "mobile" ? "82px" : "70px",
      width: 254,
    });
    await textarea.fill("Sent from Svelte");
    await expect(textarea).toHaveValue("Sent from Svelte");
    await textarea.focus();
    await page.waitForTimeout(250);
    const focused = await control.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        border: style.borderColor,
        ring: style.getPropertyValue("--tw-ring-color"),
        shadow: style.boxShadow,
      };
    });
    expect(focused).toEqual({
      background: expected.background,
      border: expected.focusBorder,
      ring: expected.ring,
      shadow: expected.ringShadow,
    });
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
