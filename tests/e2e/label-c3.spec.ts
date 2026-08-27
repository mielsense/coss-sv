import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("renders an associated COSS label at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Static label coverage runs in both themes.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "label-c3", theme, width);
    const label = ready.locator('[data-slot="label"]');
    const input = ready.getByLabel("Email");
    const particleRoot = ready.locator('[data-particle="p-input-6"] > div');
    await expect(label).toHaveText("Email");
    await expect(label).toHaveAttribute("for", await input.getAttribute("id"));
    await label.click();
    await expect(input).toBeFocused();
    expect(
      await particleRoot.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          alignItems: style.alignItems,
          display: style.display,
          flexDirection: style.flexDirection,
          gap: style.gap,
          height: rect.height,
          width: rect.width,
        };
      }),
    ).toEqual({
      alignItems: "flex-start",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      height: width === "mobile" ? 62 : 56,
      width: 256,
    });
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
