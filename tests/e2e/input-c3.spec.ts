import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("renders and operates the COSS input at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Static input coverage runs in both themes.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const expected =
    theme === "dark"
      ? {
          background: "oklab(0.999994 0.0000455678 0.0000200868 / 0.0256)",
          border: "oklab(0.999994 0.0000455678 0.0000200868 / 0.08)",
          focusBorder: "oklch(0.556 0 none)",
          fileButtonColor: "oklch(0.97 0 none)",
          fileColor: "color(srgb 0.506311 0.50639 0.506398)",
          ring: "color-mix(in oklab, oklch(55.6% 0 none) 24%, transparent)",
          ringShadow:
            "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.556 0 0 / 0.24) 0px 0px 0px 3px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
        }
      : {
          background: "rgb(255, 255, 255)",
          border: "oklab(0 0 0 / 0.1)",
          focusBorder: "oklch(0.708 0 none)",
          fileButtonColor: "oklch(0.269 0 none)",
          fileColor: "color(srgb 0.406311 0.40639 0.406398)",
          ring: "color-mix(in oklab, oklch(70.8% 0 none) 24%, transparent)",
          ringShadow:
            "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0.708 0 0 / 0.24) 0px 0px 0px 3px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
        };

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "input-c3", theme, width);
    const control = ready.locator('[data-particle="p-input-1"] [data-slot="input-control"]');
    const input = ready.locator('[data-testid="parity-input"]');
    await expect(control).toHaveAttribute("data-size", "default");
    await expect(input).toHaveAttribute("data-slot", "input");
    await expect(input).toHaveAttribute("placeholder", "Enter text");

    const metrics = await input.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const control = element.closest<HTMLElement>('[data-slot="input-control"]');
      if (!control) throw new Error("Input control wrapper is missing.");
      const controlRect = control.getBoundingClientRect();
      const controlStyle = getComputedStyle(control);
      return {
        background: controlStyle.backgroundColor,
        border: controlStyle.borderColor,
        controlHeight: controlRect.height,
        controlWidth: controlRect.width,
        height: rect.height,
        outline: style.outlineStyle,
        width: rect.width,
      };
    });
    expect(metrics).toEqual({
      background: expected.background,
      border: expected.border,
      controlHeight: width === "mobile" ? 36 : 32,
      controlWidth: 256,
      height: width === "mobile" ? 34 : 30,
      outline: "none",
      width: 254,
    });

    await input.fill("Svelte");
    await expect(input).toHaveValue("Svelte");
    await input.focus();
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

    const fileControl = ready.locator('[data-particle="p-input-5"] [data-slot="input-control"]');
    const fileInput = ready.locator('[data-testid="parity-file-input"]');
    await expect(fileControl).toHaveAttribute("data-size", "default");
    await expect(fileInput).toHaveAttribute("aria-label", "File");
    await expect(fileInput).toHaveAccessibleName("File");
    await expect(fileInput).toHaveAttribute("type", "file");
    await expect(fileInput).toHaveClass(/file:me-3/);
    const fileMetrics = await fileInput.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const control = element.closest<HTMLElement>('[data-slot="input-control"]');
      if (!control) throw new Error("File input control wrapper is missing.");
      return {
        controlHeight: control.getBoundingClientRect().height,
        controlWidth: control.getBoundingClientRect().width,
        height: rect.height,
        width: rect.width,
      };
    });
    expect(fileMetrics).toEqual({
      controlHeight: width === "mobile" ? 36 : 32,
      controlWidth: 256,
      height: width === "mobile" ? 34 : 30,
      width: 254,
    });
    expect(
      await fileInput.evaluate((element) => ({
        buttonBackground: getComputedStyle(element, "::file-selector-button").backgroundColor,
        buttonColor: getComputedStyle(element, "::file-selector-button").color,
        buttonFontSize: getComputedStyle(element, "::file-selector-button").fontSize,
        buttonFontWeight: getComputedStyle(element, "::file-selector-button").fontWeight,
        color: getComputedStyle(element).color,
      })),
    ).toEqual({
      buttonBackground: "rgba(0, 0, 0, 0)",
      buttonColor: expected.fileButtonColor,
      buttonFontSize: "14px",
      buttonFontWeight: "500",
      color: expected.fileColor,
    });
    await fileInput.setInputFiles({
      buffer: Buffer.from("COSS"),
      mimeType: "text/plain",
      name: "parity.txt",
    });
    expect(await fileInput.evaluate((element: HTMLInputElement) => element.files?.[0]?.name)).toBe(
      "parity.txt",
    );
    await assertNoAxeViolations(page, '[data-particle="p-input-1"]');
    guard.assertNoErrors();
  }
});
