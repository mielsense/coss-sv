import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("matches COSS Progress geometry, labels, bounds, and indeterminate state", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "The transition contract has separate coverage.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "progress-c4", theme, width);
    const progress = ready.locator('[data-testid="parity-progress"]');
    await expect(progress).toHaveAttribute("role", "progressbar");
    const liveSnapshot = await progress.evaluate((root) => {
      const track = root.querySelector<HTMLElement>('[data-slot="progress-track"]');
      const indicator = root.querySelector<HTMLElement>('[data-slot="progress-indicator"]');
      if (!track || !indicator) throw new Error("Progress parts are missing.");
      const trackRect = track.getBoundingClientRect();
      return {
        ariaValueNow: Number(root.getAttribute("aria-valuenow")),
        complete: root.hasAttribute("data-complete"),
        indicator: {
          cssVariables: [...indicator.style].filter((name) => name.startsWith("--")),
          transition: getComputedStyle(indicator).transition,
          width: indicator.style.width,
        },
        progressing: root.hasAttribute("data-progressing"),
        track: { height: trackRect.height, width: trackRect.width },
      };
    });
    expect(liveSnapshot.ariaValueNow).toBeGreaterThanOrEqual(20);
    expect(liveSnapshot.ariaValueNow).toBeLessThanOrEqual(100);
    expect(liveSnapshot.progressing).toBe(liveSnapshot.ariaValueNow < 100);
    expect(liveSnapshot.complete).toBe(liveSnapshot.ariaValueNow === 100);
    expect(liveSnapshot.track).toEqual({ height: 6, width: 256 });
    expect(liveSnapshot.indicator).toEqual({
      cssVariables: [],
      transition: "0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      width: `${liveSnapshot.ariaValueNow}%`,
    });
    const probe = ready.locator('[data-testid="probe-progress"]');
    const label = ready.locator('[data-testid="probe-progress-label"]');
    await expect(probe).toHaveAttribute("aria-labelledby", await label.getAttribute("id"));
    await expect(ready.locator('[data-testid="probe-progress-value"]')).toHaveText("60%");
    await ready.locator('[data-testid="progress-complete"]').press("Enter");
    await expect(probe).toHaveAttribute("data-complete");
    await expect(probe).toHaveAttribute("aria-valuenow", "100");
    await ready.locator('[data-testid="progress-indeterminate"]').press("Enter");
    await expect(probe).toHaveAttribute("data-indeterminate");
    await expect(probe).not.toHaveAttribute("aria-valuenow");
    await expect(probe).toHaveAttribute("aria-valuetext", "indeterminate progress");
    expect(
      await ready
        .locator('[data-testid="probe-progress-indicator"]')
        .evaluate((element: HTMLElement) => element.style.width),
    ).toBe("");
    await assertNoAxeViolations(page, '[data-review-probes="progress"]');
    guard.assertNoErrors();
  }
});

test("keeps the exact COSS transition under reduced and full motion", async ({
  page,
}, testInfo) => {
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "progress-c4", theme, "desktop");
  await expect(ready.locator('[data-slot="progress-indicator"]').first()).toHaveCSS(
    "transition",
    "0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  );
});
