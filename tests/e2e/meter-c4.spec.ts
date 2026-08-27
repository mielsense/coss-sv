import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("matches COSS Meter geometry, labels, bounds, and inline progress", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "The transition contract has separate coverage.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "meter-c4", theme, width);
    const meter = ready.locator('[data-testid="parity-meter"]');
    const label = ready.locator('[data-testid="parity-meter-label"]');
    const track = ready.locator('[data-testid="parity-meter-track"]');
    const indicator = ready.locator('[data-testid="parity-meter-indicator"]');
    await expect(meter).toHaveAttribute("role", "meter");
    await expect(meter).toHaveAttribute("aria-valuenow", "75");
    await expect(meter).toHaveAttribute("aria-valuetext", "75%");
    await expect(meter).toHaveAttribute("aria-labelledby", await label.getAttribute("id"));
    await expect(ready.locator('[data-testid="parity-meter-value"]')).toHaveText("75%");
    expect(
      await track.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { height: rect.height, width: rect.width };
      }),
    ).toEqual({ height: 8, width: 256 });
    expect(
      await indicator.evaluate((element: HTMLElement) => ({
        cssVariables: [...element.style].filter((name) => name.startsWith("--")),
        transition: getComputedStyle(element).transition,
        width: element.style.width,
      })),
    ).toEqual({
      cssVariables: [],
      transition: "0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      width: "75%",
    });
    const probe = ready.locator('[data-testid="probe-meter"]');
    await ready.locator('[data-testid="meter-above-max"]').press("Enter");
    await expect(probe).toHaveAttribute("aria-valuenow", "100");
    await ready.locator('[data-testid="meter-below-min"]').press("Enter");
    await expect(probe).toHaveAttribute("aria-valuenow", "0");
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});

test("keeps the exact COSS transition under reduced and full motion", async ({
  page,
}, testInfo) => {
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "meter-c4", theme, "desktop");
  await expect(ready.locator('[data-testid="parity-meter-indicator"]')).toHaveCSS(
    "transition",
    "0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  );
});
