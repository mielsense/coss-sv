import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

async function assertFrameAxe(page: Page, theme: "dark" | "light") {
  if (theme === "light") {
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    return;
  }
  const results = await new AxeBuilder({ page })
    .include('[data-preview-ready="true"]')
    .disableRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
}

test("renders Frame with the COSS geometry and semantics", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Frame has no component motion.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "frame", theme, width);
    const frame = ready.locator('[data-slot="frame"]');
    const panel = ready.locator('[data-slot="frame-panel"]');
    await expect(frame).toHaveCount(1);
    await expect(frame).toHaveClass(
      "relative flex flex-col rounded-2xl bg-muted/72 p-1 *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1 w-full",
    );
    await expect(ready.locator('header[data-slot="frame-panel-header"]')).toHaveCount(1);
    await expect(ready.locator('footer[data-slot="frame-panel-footer"]')).toHaveCount(1);
    await expect(ready.locator('[data-slot="frame-panel-title"]')).toHaveText("Section header");
    await expect(ready.locator('[data-slot="frame-panel-description"]')).toHaveText(
      "Brief description about the section",
    );
    await expect(panel.locator("h2")).toHaveText("Section title");
    await expect(panel.locator("p")).toHaveText("Section description");
    await expect(ready.locator('footer[data-slot="frame-panel-footer"] p')).toHaveText("Footer");

    const metrics = await frame.evaluate((element) => {
      const frameStyle = getComputedStyle(element);
      const panel = element.querySelector('[data-slot="frame-panel"]') as HTMLElement;
      const panelStyle = getComputedStyle(panel);
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Unable to create a color-normalization context.");
      context.fillStyle = panelStyle.borderColor;
      context.fillRect(0, 0, 1, 1);
      return {
        framePadding: frameStyle.padding,
        frameRadius: frameStyle.borderRadius,
        frameHeight: element.getBoundingClientRect().height,
        frameWidth: element.getBoundingClientRect().width,
        panelBorderRgba: Array.from(context.getImageData(0, 0, 1, 1).data),
        panelBorder: panelStyle.borderWidth,
        panelPadding: panelStyle.padding,
        panelRadius: panelStyle.borderRadius,
        panelWidth: panel.getBoundingClientRect().width,
      };
    });
    expect(metrics).toEqual({
      framePadding: "4px",
      frameRadius: "16px",
      frameHeight: 214,
      frameWidth: width === "desktop" ? 686 : 308,
      panelBorderRgba: theme === "dark" ? [255, 255, 255, 15] : [0, 0, 0, 20],
      panelBorder: "1px",
      panelPadding: "20px",
      panelRadius: "14px",
      panelWidth: width === "desktop" ? 678 : 300,
    });
    await expect(panel).toBeVisible();
    const mutedColorRgba = await ready
      .locator('[data-slot="frame-panel-description"]')
      .evaluate((element) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Unable to create a color-normalization context.");
        context.fillStyle = getComputedStyle(element).color;
        context.fillRect(0, 0, 1, 1);
        return Array.from(context.getImageData(0, 0, 1, 1).data);
      });
    expect(mutedColorRgba).toEqual(theme === "dark" ? [129, 129, 129, 255] : [104, 104, 104, 255]);
    await assertFrameAxe(page, theme);
    guard.assertNoErrors();
  }
});
