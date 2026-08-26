import { expect, test } from "@playwright/test";
import {
  assertNoAxeViolations,
  attachPreviewEvidence,
  monitorConsole,
  openReadyPreview,
  runKeyboardTrace,
} from "./helpers/preview.js";

const referenceBaseUrl = "http://127.0.0.1:4000/ui";
// biome-ignore lint/suspicious/noUndeclaredEnvVars: this matches the optional Playwright reference-server hook.
const referenceCommandConfigured = Boolean(process.env.COSS_REFERENCE_COMMAND);

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
    );
    const fixture = ready.locator('[data-preview-fixture="true"]');
    const serverHydrationId = /data-hydration-id="([^"]+)"/.exec(serverHtml)?.[1];

    expect(serverHydrationId).toBeTruthy();
    await expect(fixture).toHaveAttribute("data-hydration-id", serverHydrationId ?? "");

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
    );

    await expect(ready).toHaveAttribute("data-preview-missing", "true");
    await expect(page.getByRole("heading", { name: "Preview not found" })).toBeVisible();
    await expect(page.getByText("does-not-exist", { exact: true })).toBeVisible();
    guard.assertNoErrors();
  });

  test("turns console errors and axe findings into test failures", async ({ page }, testInfo) => {
    const guard = monitorConsole(page);
    await openReadyPreview(page, "_fixture", projectTheme(testInfo.project.name));

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
  });

  test("starts the configured React reference server", async ({ page }) => {
    test.skip(!referenceCommandConfigured, "COSS_REFERENCE_COMMAND is not configured.");

    const response = await page.goto(referenceBaseUrl, { waitUntil: "domcontentloaded" });
    expect(response?.ok()).toBe(true);
  });
});
