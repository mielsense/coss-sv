import { expect, test } from "@playwright/test";
import {
  assertNoAxeViolations,
  monitorConsole,
  openReadyPreview,
  prepareDeterministicPage,
} from "./helpers/preview.js";

const referenceImage =
  "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=128&h=128&dpr=2&q=80";

test("matches the COSS Avatar particle and image lifecycle", async ({ page }, testInfo) => {
  const guard = monitorConsole(page);
  await prepareDeterministicPage(page);
  await page.route(referenceImage, (route) =>
    route.fulfill({
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="red"/></svg>`,
      contentType: "image/svg+xml",
    }),
  );
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "avatar-c4", theme, width, "real");
    const root = ready.locator('[data-particle="p-avatar-1"] [data-slot="avatar"]');
    const image = ready.locator('[data-testid="avatar-image"]');
    await expect(root).toHaveClass(/size-8/);
    await expect(image).toHaveAttribute("alt", "Luke Tracy");
    await expect(image).toBeVisible();
    await expect(ready.locator('[data-testid="avatar-fallback"]')).toHaveCount(0);
    expect(
      await root.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { borderRadius: style.borderRadius, height: rect.height, width: rect.width };
      }),
    ).toEqual({ borderRadius: "3.35544e+07px", height: 32, width: 32 });
    await expect(ready.locator('[data-testid="avatar-error-fallback"]')).toHaveText("ER");
    await expect(ready.locator('[data-testid="avatar-statuses"]')).toContainText("loaded");
    await ready.locator('[data-testid="show-delayed-avatar"]').press("Enter");
    await expect(ready.locator('[data-testid="avatar-delayed-fallback"]')).toHaveCount(0);
    await page.waitForTimeout(120);
    await expect(ready.locator('[data-testid="avatar-delayed-fallback"]')).toHaveText("DL");
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
