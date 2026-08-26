import { expect, test } from "@playwright/test";
import {
  assertNoAxeViolations,
  attachPreviewEvidence,
  fixedClockTime,
  monitorConsole,
  openReadyPreview,
  prepareDeterministicPage,
  runKeyboardTrace,
} from "./helpers/preview.js";

const referenceBaseUrl = "http://127.0.0.1:4000/ui";

function projectTheme(projectName: string): "dark" | "light" {
  return projectName === "dark" ? "dark" : "light";
}

test.describe("preview harness", () => {
  test("captures deterministic visual, style, DOM, accessibility, and keyboard evidence", async ({
    page,
  }, testInfo) => {
    const guard = monitorConsole(page);
    const { ready, serverHtml } = await openReadyPreview(
      page,
      "_fixture",
      projectTheme(testInfo.project.name),
      "desktop",
    );
    const fixture = ready.locator('[data-preview-fixture="true"]');
    const serverHydrationId = /data-hydration-id="([^"]+)"/.exec(serverHtml)?.[1];

    expect(serverHydrationId).toBeTruthy();
    await expect(fixture).toHaveAttribute("data-hydration-id", serverHydrationId ?? "");
    const expectedTheme = projectTheme(testInfo.project.name);
    const frame = page.locator("[data-preview-theme]");
    await expect(frame).toHaveAttribute("data-preview-theme", expectedTheme);
    expect(await frame.evaluate((element) => getComputedStyle(element).colorScheme)).toBe(
      expectedTheme,
    );
    await expect(ready).toHaveAttribute("data-preview-width", "desktop");
    await expect(ready).toHaveAttribute("data-preview-width-px", "1200");
    expect((await ready.boundingBox())?.width).toBe(1200);
    expect(await page.evaluate(() => Date.now())).toBe(Date.parse(fixedClockTime));

    const button = page.getByRole("button", { name: "Advance count" });
    await button.focus();
    const keyboardTrace = await runKeyboardTrace(page, testInfo, ["Enter"]);
    expect(keyboardTrace[0]?.before.tagName).toBe("button");
    expect(keyboardTrace[0]?.after.tagName).toBe("button");
    await expect(page.getByRole("status")).toHaveText("Count: 1");

    const styles = await attachPreviewEvidence(fixture, testInfo, [
      "background-color",
      "border-radius",
      "color",
      "font-family",
      "padding",
    ]);
    expect(styles.boundingBox?.width).toBeGreaterThan(200);
    expect(styles.properties["border-radius"]).toBe("12px");
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  });

  test("shows a ready, visible error for an unknown preview name", async ({ page }, testInfo) => {
    const guard = monitorConsole(page);
    const { ready } = await openReadyPreview(
      page,
      "does-not-exist",
      projectTheme(testInfo.project.name),
      "mobile",
    );

    await expect(ready).toHaveAttribute("data-preview-missing", "true");
    await expect(ready).toHaveAttribute("data-preview-width-px", "390");
    expect((await ready.boundingBox())?.width).toBe(390);
    await expect(page.getByRole("heading", { name: "Preview not found" })).toBeVisible();
    await expect(page.getByText("does-not-exist", { exact: true })).toBeVisible();
    guard.assertNoErrors();
  });

  test("turns console errors and axe findings into test failures", async ({ page }, testInfo) => {
    const guard = monitorConsole(page);
    const { externalRequests } = await openReadyPreview(
      page,
      "_fixture",
      projectTheme(testInfo.project.name),
      "desktop",
    );

    await page.evaluate(() => console.error("intentional harness proof"));
    expect(() => guard.assertNoErrors()).toThrow(/intentional harness proof/);
    guard.clear();

    await page.evaluate(() => {
      const invalid = document.createElement("button");
      invalid.dataset.intentionalAxeFinding = "true";
      document.body.append(invalid);
    });
    await expect(assertNoAxeViolations(page)).rejects.toThrow(/button-name/);
    await page
      .locator('[data-intentional-axe-finding="true"]')
      .evaluate((element) => element.remove());
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();

    await expect(
      page.evaluate(() => fetch("https://example.com/remote-font.woff2")),
    ).rejects.toThrow();
    expect(() => externalRequests.assertNoExternalRequests()).toThrow(/example\.com/);
    externalRequests.clear();
    externalRequests.assertNoExternalRequests();
  });

  test("starts the pnpm React reference server by default", async ({ page }) => {
    const externalRequests = await prepareDeterministicPage(page);
    const response = await page.goto(referenceBaseUrl, { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBe(true);
    externalRequests.assertNoExternalRequests();
  });

  test("rejects invalid preview theme and width parameters visibly", async ({ page }) => {
    const externalRequests = await prepareDeterministicPage(page);
    const response = await page.goto("/preview/_fixture?theme=sepia&width=wide");

    expect(response?.ok()).toBe(true);
    const invalid = page.locator('[data-preview-invalid="true"]');
    await expect(invalid).toBeVisible();
    await expect(invalid).toContainText("theme must be light or dark");
    await expect(invalid).toContainText("width must be mobile, tablet, or desktop");
    externalRequests.assertNoExternalRequests();
  });
});
