import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

function projectTheme(projectName: string): "dark" | "light" {
  return projectName === "dark" ? "dark" : "light";
}

test("renders Separator with the COSS contract at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "The two static projects cover both themes.");
  const guard = monitorConsole(page);
  const theme = projectTheme(testInfo.project.name);

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "separator", theme, width);
    const separators = ready.locator('[data-slot="separator"]');
    await expect(separators).toHaveCount(4);

    const metrics = await separators.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          ariaOrientation: element.getAttribute("aria-orientation"),
          background: style.backgroundColor,
          dataOrientation: element.getAttribute("data-orientation"),
          flexShrink: style.flexShrink,
          height: rect.height,
          role: element.getAttribute("role"),
          tabIndex: (element as HTMLElement).tabIndex,
          width: rect.width,
        };
      }),
    );

    expect(metrics[0]).toEqual({
      ariaOrientation: "horizontal",
      background: theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)",
      dataOrientation: "horizontal",
      flexShrink: "0",
      height: 1,
      role: "separator",
      tabIndex: -1,
      width: 288,
    });
    for (const metric of metrics.slice(1)) {
      expect(metric).toEqual({
        ariaOrientation: "vertical",
        background: theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)",
        dataOrientation: "vertical",
        flexShrink: "0",
        height: 20,
        role: "separator",
        tabIndex: -1,
        width: 1,
      });
    }

    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
