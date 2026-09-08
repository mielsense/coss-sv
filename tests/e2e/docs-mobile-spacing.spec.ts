import { expect, test } from "@playwright/test";

test("mobile documentation preserves article and example gutters", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/frame");
  const article = page.locator(".docs-content");
  await expect(article).toBeVisible();
  const preview = page.locator('[data-particle="p-frame-1"]');
  await preview.scrollIntoViewIfNeeded();
  const inner = preview.locator("[data-preview-inner]");
  const frame = inner.locator('[data-slot="frame"]').first();
  await expect(frame).toBeVisible();
  await expect(article).toHaveCSS("padding-left", "16px");
  await expect(article).toHaveCSS("padding-right", "16px");
  await expect(article).toHaveCSS("padding-top", "24px");
  await expect(inner).toHaveCSS("padding-left", "24px");
  await expect(inner).toHaveCSS("padding-right", "24px");
  await expect(inner).toHaveCSS("padding-top", "40px");
  await expect.poll(async () => (await frame.boundingBox())?.width).toBe(308);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});
