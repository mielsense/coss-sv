import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

const baseUrl = process.env.COSS_TEST_BASE_URL;
assert.ok(baseUrl, "set COSS_TEST_BASE_URL to the app server");
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1600, 1024, 390]) {
    for (const dark of [false, true]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      await mockOpenAnalytics(context);
      const page = await context.newPage();
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
      const metrics = await page.evaluate(() => {
        const markers = document.querySelector(".frame-markers");
        const before = getComputedStyle(markers, "::before");
        const after = getComputedStyle(markers, "::after");
        const frame = document.querySelector("[data-category]");
        const inner = frame.querySelector('[data-slot="card"]');
        const panelStyle = getComputedStyle(frame.querySelector('[data-slot="card-panel"]'));
        const descriptionStyle = getComputedStyle(
          frame.querySelector('[data-slot="card-frame-description"]'),
        );
        return {
          panelPadding: panelStyle.padding,
          descriptionFontSize: descriptionStyle.fontSize,
          descriptionLineHeight: descriptionStyle.lineHeight,
          left: before.left,
          right: after.right,
          top: before.top,
          clip: before.backgroundClip,
          markerBorder: before.borderColor,
          rightMarkerBorder: after.borderColor,
          sameMarkerBackground: before.backgroundColor === after.backgroundColor,
          overlay: getComputedStyle(frame, "::before").backgroundColor,
          innerClip: inner && getComputedStyle(inner).clipPath,
          innerHeight: inner?.getBoundingClientRect().height,
          columns: getComputedStyle(
            document.querySelector("[data-category-grid]"),
          ).gridTemplateColumns.split(" ").length,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert.equal(metrics.panelPadding, "24px 32px");
      assert.equal(metrics.descriptionFontSize, "14px");
      assert.equal(metrics.descriptionLineHeight, "20px");
      assert.equal(metrics.left, "-15.5px");
      assert.equal(metrics.right, "-15.5px");
      assert.equal(metrics.top, "-3.5px");
      assert.equal(
        metrics.markerBorder,
        dark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.08)",
      );
      assert.equal(metrics.rightMarkerBorder, metrics.markerBorder);
      assert.equal(metrics.clip, dark ? "border-box" : "padding-box");
      assert.equal(metrics.sameMarkerBackground, !dark);
      assert.notEqual(metrics.overlay, "rgba(0, 0, 0, 0)");
      assert.match(metrics.innerClip, /^inset\(/);
      assert.ok(metrics.innerHeight >= 220);
      assert.equal(metrics.columns, width === 1600 ? 4 : width === 1024 ? 3 : 1);
      assert.equal(metrics.overflow, false);
      const thumbnail = page.locator('[data-thumbnail="accordion"]');
      assert.equal(await thumbnail.evaluate((el) => getComputedStyle(el).translate), "0px 2px");
      await page.locator('[data-category="accordion"] a').hover();
      await page.waitForTimeout(250);
      assert.equal(await thumbnail.evaluate((el) => getComputedStyle(el).translate), "0px");
      await context.close();
    }
  }
  console.log("Homepage marker, inset card, responsive grid and hover parity passed.");
} finally {
  await browser.close();
}
