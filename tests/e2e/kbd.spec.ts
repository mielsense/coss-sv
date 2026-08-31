import { expect, type Page, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

async function assertKbdAxe(page: Page, theme: "dark" | "light") {
  if (theme === "light") {
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    return;
  }
  await assertNoAxeViolations(page, '[data-preview-ready="true"]', ["color-contrast"]);
}

test("renders the exact Kbd particle contract at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Kbd has no component motion.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "kbd", theme, width);
    const keys = ready.locator('[data-slot="kbd"]');
    const groups = ready.locator('[data-slot="kbd-group"]');
    await expect(keys).toHaveCount(12);
    await expect(groups).toHaveCount(3);
    await expect(keys).toHaveText([
      "K",
      "⌘",
      "⌃",
      "⇧",
      "⌘",
      "K",
      "⌘",
      "Shift",
      "P",
      "Ctrl",
      "Alt",
      "Delete",
    ]);

    const particleRoot = ready.locator(".kbd-review-shell > div");
    await expect(particleRoot).toHaveClass("flex flex-col gap-4");
    const particleBox = await particleRoot.boundingBox();
    const viewport = page.viewportSize();
    if (!viewport) throw new Error("Kbd parity page has no viewport.");
    expect(particleBox?.width).toBeCloseTo(251.695, 1);
    expect(particleBox?.height).toBe(112);
    expect((particleBox?.x ?? 0) + (particleBox?.width ?? 0) / 2).toBeCloseTo(
      viewport.width / 2,
      1,
    );
    expect((particleBox?.y ?? 0) + (particleBox?.height ?? 0) / 2).toBeCloseTo(
      viewport.height / 2,
      1,
    );

    const combinations = await groups.first().evaluate((element) => {
      const parent = element.parentElement;
      if (!parent) throw new Error("KbdGroup is missing its particle row.");
      return { className: parent.className, flexWrap: getComputedStyle(parent).flexWrap };
    });
    expect(combinations).toEqual({ className: "flex gap-2", flexWrap: "nowrap" });

    const keyMetrics = await keys.first().evaluate((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Unable to create a color-normalization context.");
      context.fillStyle = style.color;
      context.fillRect(0, 0, 1, 1);
      return {
        colorRgba: Array.from(context.getImageData(0, 0, 1, 1).data),
        display: style.display,
        fontSize: style.fontSize,
        height: rect.height,
        minWidth: style.minWidth,
        padding: style.padding,
        radius: style.borderRadius,
      };
    });
    expect(keyMetrics).toEqual({
      colorRgba: theme === "dark" ? [129, 129, 129, 255] : [104, 104, 104, 255],
      display: "flex",
      fontSize: "12px",
      height: 20,
      minWidth: "20px",
      padding: "0px 4px",
      radius: "4px",
    });
    const groupMetrics = await groups.first().evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        border: style.borderWidth,
        radius: style.borderRadius,
      };
    });
    expect(groupMetrics).toEqual({ background: "rgba(0, 0, 0, 0)", border: "0px", radius: "0px" });
    await assertKbdAxe(page, theme);
    guard.assertNoErrors();
  }
});
