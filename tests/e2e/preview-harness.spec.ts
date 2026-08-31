import { expect, test } from "@playwright/test";
import { previewWidths } from "../../apps/ui/src/lib/preview/contract.js";
import {
  assertNoAxeViolations,
  attachPreviewEvidence,
  cssColorsToRgba,
  monitorConsole,
  openReadyPreview,
  prepareDeterministicPage,
  previewViewportHeights,
  runKeyboardTrace,
} from "./helpers/preview.js";

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
    const fixtureId = await fixture.getAttribute("data-hydration-id");

    expect(serverHtml).toContain('data-preview-loading="true"');
    expect(serverHtml).not.toContain('data-preview-fixture="true"');
    expect(fixtureId).toBeTruthy();
    await expect(fixture).toHaveAttribute("aria-labelledby", `${fixtureId}-heading`);
    const expectedTheme = projectTheme(testInfo.project.name);
    const frame = page.locator("[data-preview-name][data-preview-theme]");
    await expect(frame).toHaveAttribute("data-preview-theme", expectedTheme);
    expect(await frame.evaluate((element) => getComputedStyle(element).colorScheme)).toBe(
      expectedTheme,
    );
    await expect(ready).toHaveAttribute("data-preview-width", "desktop");
    await expect(ready).toHaveAttribute("data-preview-width-px", "1200");
    expect((await ready.boundingBox())?.width).toBe(previewWidths.desktop - 80);
    const previewNow = await frame.getAttribute("data-preview-now");
    expect(previewNow).toBeTruthy();
    expect(await page.evaluate(() => Date.now())).toBe(Date.parse(previewNow ?? ""));

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
    expect(styles.properties["border-radius"]).toBe("14px");
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  });

  test("returns a visible 404 for an unknown preview name", async ({ page }, testInfo) => {
    const externalRequests = await prepareDeterministicPage(page);
    await page.setViewportSize({
      height: previewViewportHeights.mobile,
      width: previewWidths.mobile,
    });
    const response = await page.goto(
      `/preview/does-not-exist?theme=${projectTheme(testInfo.project.name)}&width=mobile`,
      { waitUntil: "networkidle" },
    );

    expect(response?.status()).toBe(404);
    expect(page.viewportSize()?.width).toBe(previewWidths.mobile);
    await expect(page.getByRole("heading", { name: "Preview not found" })).toBeVisible();
    await expect(
      page.getByText("Preview does-not-exist was not found.", { exact: true }),
    ).toBeVisible();
    externalRequests.assertNoExternalRequests();
  });

  test("lets the query theme override browser preference across the full viewport", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "motion", "The two static projects cover opposite themes.");
    const theme = testInfo.project.name === "dark" ? "light" : "dark";
    const { ready } = await openReadyPreview(page, "_fixture", theme, "desktop");
    const frame = page.locator("[data-preview-name][data-preview-theme]");
    const root = page.locator("html");
    const viewport = page.viewportSize();
    const box = await frame.boundingBox();

    await expect(root).toHaveAttribute("data-preview-theme", theme);
    await expect(root).toHaveClass(theme === "dark" ? /\bdark\b/ : /^(?!.*\bdark\b)/);

    expect(viewport).not.toBeNull();
    expect(box).toMatchObject({
      height: viewport?.height,
      width: viewport?.width,
      x: 0,
      y: 0,
    });
    const expectedBackground = theme === "dark" ? [20, 20, 20, 255] : [255, 255, 255, 255];
    const canvas = await page.evaluate(() => {
      const themeFrame = document.querySelector<HTMLElement>(
        "[data-preview-name][data-preview-theme]",
      );
      if (!themeFrame) throw new Error("Preview theme frame is missing.");
      const points = [
        [1, 1],
        [innerWidth - 2, 1],
        [1, innerHeight - 2],
        [innerWidth - 2, innerHeight - 2],
      ];
      return {
        background: getComputedStyle(themeFrame).backgroundColor,
        corners: points.map(([x, y]) => {
          const element = document.elementFromPoint(x ?? 0, y ?? 0);
          return {
            background: element ? getComputedStyle(element).backgroundColor : null,
            coveredByFrame: element ? themeFrame.contains(element) : false,
          };
        }),
      };
    });

    const canvasColors = await cssColorsToRgba(page, [
      canvas.background,
      ...canvas.corners.map((corner) => corner.background ?? "transparent"),
    ]);
    expect(canvasColors[0]).toEqual(expectedBackground);
    for (const [index, corner] of canvas.corners.entries()) {
      expect({
        background: canvasColors[index + 1],
        coveredByFrame: corner.coveredByFrame,
      }).toEqual({ background: expectedBackground, coveredByFrame: true });
    }
    const themeEvidence = await page.evaluate(() => {
      const themeFrame = document.querySelector<HTMLElement>(
        "[data-preview-name][data-preview-theme]",
      );
      const fixture = document.querySelector<HTMLElement>('[data-preview-fixture="true"]');
      const button = document.querySelector<HTMLElement>("button");
      if (!themeFrame || !fixture || !button) throw new Error("Theme fixtures are missing.");
      return {
        buttonBackground: getComputedStyle(button).backgroundColor,
        buttonForeground: getComputedStyle(button).color,
        framePrimary: getComputedStyle(themeFrame).getPropertyValue("--primary").trim(),
        rootPrimary: getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim(),
        surfaceBackground: getComputedStyle(fixture).backgroundColor,
      };
    });
    const normalizedThemeEvidence = await cssColorsToRgba(page, [
      themeEvidence.buttonBackground,
      themeEvidence.buttonForeground,
      themeEvidence.framePrimary,
      themeEvidence.rootPrimary,
      themeEvidence.surfaceBackground,
    ]);
    expect(normalizedThemeEvidence).toEqual(
      theme === "dark"
        ? [
            [245, 245, 245, 255],
            [38, 38, 38, 255],
            [245, 245, 245, 255],
            [245, 245, 245, 255],
            [25, 25, 25, 255],
          ]
        : [
            [38, 38, 38, 255],
            [250, 250, 250, 255],
            [38, 38, 38, 255],
            [38, 38, 38, 255],
            [255, 255, 255, 255],
          ],
    );
    await expect(ready).toBeVisible();
    const screenshot = await page.screenshot({ animations: "disabled" });
    expect(screenshot.byteLength).toBeGreaterThan(1_000);
    await testInfo.attach(`viewport-${theme}.png`, { body: screenshot, contentType: "image/png" });
  });

  test("uses the query width as the responsive browser viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "light", "One Chromium project covers viewport geometry.");
    const cases = [
      { media: "(max-width: 639px)", width: "mobile" },
      { media: "(min-width: 640px) and (max-width: 1023px)", width: "tablet" },
      { media: "(min-width: 1024px)", width: "desktop" },
    ] as const;

    for (const fixture of cases) {
      const { ready } = await openReadyPreview(page, "_fixture", "light", fixture.width);
      expect(page.viewportSize()?.width).toBe(previewWidths[fixture.width]);
      expect(await page.evaluate(() => innerWidth)).toBe(previewWidths[fixture.width]);
      expect(await page.evaluate((query) => matchMedia(query).matches, fixture.media)).toBe(true);
      await expect(ready).toHaveAttribute(
        "data-preview-width-px",
        `${previewWidths[fixture.width]}`,
      );
    }
  });

  test("proves the motion project runs without reduced-motion emulation", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "motion",
      "Only the motion project promises no-preference.",
    );
    await openReadyPreview(page, "_fixture", "light", "desktop");

    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
      false,
    );
    const motion = await page.locator('[data-motion-probe="true"]').evaluate((element) => {
      const animation = element.getAnimations()[0];
      return {
        animationName: getComputedStyle(element).animationName,
        currentTime: animation?.currentTime ?? null,
        playState: animation?.playState ?? null,
      };
    });
    expect(motion.animationName).toMatch(/preview-fixture-motion$/);
    expect(motion.currentTime).not.toBeNull();
    expect(motion.playState).toBe("running");
  });

  test("turns console, axe, and external request findings into test failures", async ({
    page,
  }, testInfo) => {
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

    await expect(page.evaluate(() => fetch("https://example.com/runtime-blocked"))).rejects.toThrow(
      /Preview network request blocked: https:\/\/example\.com/,
    );
    externalRequests.assertNoExternalRequests();

    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.alt = "";
          image.hidden = true;
          image.onload = image.onerror = () => {
            image.remove();
            resolve();
          };
          document.body.append(image);
          image.src = "https://example.com/harness-blocked.png";
        }),
    );
    await expect
      .poll(() => externalRequests.failures.join("\n"))
      .toContain("GET https://example.com/harness-blocked.png");
    expect(() => externalRequests.assertNoExternalRequests()).toThrow(/example\.com/);
    externalRequests.clear();
    externalRequests.assertNoExternalRequests();
  });

  test("blocks and reports external WebSocket handshakes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "light", "One project proves WebSocket isolation.");
    const { externalRequests } = await openReadyPreview(page, "_fixture", "light", "desktop");

    await page.evaluate(() => {
      new WebSocket("wss://example.com/parity-probe");
    });
    await expect
      .poll(() => externalRequests.failures.join("\n"))
      .toContain("WEBSOCKET wss://example.com/parity-probe");
    expect(() => externalRequests.assertNoExternalRequests()).toThrow(
      /WEBSOCKET wss:\/\/example\.com\/parity-probe/,
    );
    externalRequests.clear();
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
