import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

let baseUrl = process.env.COSS_TEST_BASE_URL;
const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const expectedSource = await readFile(
  new URL("../../src/routes/docs/_preview-contract/source.txt", import.meta.url),
  "utf8",
);
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
let preview;

async function findAvailablePreviewPort() {
  const probe = createServer();
  const port = await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        reject(new Error("could not allocate a PreviewCard contract port"));
        return;
      }
      resolve(address.port);
    });
  });
  await new Promise((resolve, reject) => {
    probe.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/preview/_health`);
      if (response.ok) return;
    } catch {
      // The production preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`PreviewCard contract server did not become ready at ${baseUrl}`);
}

if (!baseUrl) {
  const port = await findAvailablePreviewPort();
  baseUrl = `http://127.0.0.1:${port}`;
  preview = spawn(
    process.execPath,
    [viteExecutable, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: appDirectory, env: process.env, stdio: "inherit" },
  );
  const previewExited = new Promise((_, reject) => {
    preview.once("exit", (code, signal) => {
      reject(
        new Error(
          `PreviewCard contract server exited before readiness (code ${code ?? "none"}, signal ${signal ?? "none"})`,
        ),
      );
    });
  });
  await Promise.race([waitForPreview(), previewExited]);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  colorScheme: "light",
  permissions: ["clipboard-read", "clipboard-write"],
  viewport: { height: 900, width: 1280 },
});
const page = await context.newPage();

try {
  await page.goto(`${baseUrl}/docs/_preview-contract`);

  const card = page.locator('[data-preview-contract="interactive"]');
  const frame = card.getByTitle("Interactive contract preview");
  const presentation = card.locator("[data-preview-presentation]");
  const previewTab = card.getByRole("tab", { name: "Preview" });
  const codeTab = card.getByRole("tab", { name: "Code" });

  await frame.waitFor();
  assert.equal(
    await frame.getAttribute("src"),
    "/preview/_fixture?theme=light&width=mobile&align=start&reducedMotion=no-preference&timers=real",
  );
  assert.equal(await frame.getAttribute("data-preview-width"), "mobile");
  const alignment = await presentation.evaluate((element) => {
    const iframe = element.querySelector("iframe");
    const frameSurface = iframe?.parentElement;
    if (!(iframe instanceof HTMLElement) || !(frameSurface instanceof HTMLElement)) return null;
    const iframeRect = iframe.getBoundingClientRect();
    const frameRect = frameSurface.getBoundingClientRect();
    return {
      frameLeft: frameRect.left,
      frameWidth: frameRect.width,
      iframeLeft: iframeRect.left,
      iframeWidth: iframeRect.width,
      justifyContent: getComputedStyle(frameSurface).justifyContent,
    };
  });
  assert.ok(alignment);
  assert.equal(alignment.justifyContent, "center");
  assert.ok(
    Math.abs(
      alignment.frameLeft +
        alignment.frameWidth / 2 -
        (alignment.iframeLeft + alignment.iframeWidth / 2),
    ) <= 1,
  );
  assert.equal(alignment.iframeWidth, 390);

  const previewRuntime = frame.contentFrame().locator('[data-preview-frame="true"]');
  const previewSurface = frame.contentFrame().locator("[data-preview-ready]");
  await previewRuntime.waitFor();
  const runtimeAlignment = await previewRuntime.evaluate((element) => {
    const surface = element.querySelector("[data-preview-ready]");
    if (!(surface instanceof HTMLElement)) return null;
    const frameRect = element.getBoundingClientRect();
    const surfaceRect = surface.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      alignItems: style.alignItems,
      frameHeight: frameRect.height,
      justifyContent: style.justifyContent,
      overflowY: style.overflowY,
      padding: style.padding,
      surfaceCenter: surfaceRect.left + surfaceRect.width / 2,
      surfaceTop: surfaceRect.top,
      usableCenter: frameRect.left + frameRect.width / 2,
    };
  });
  assert.deepEqual(runtimeAlignment, {
    alignItems: "flex-start",
    frameHeight: 450,
    justifyContent: "center",
    overflowY: "auto",
    padding: "40px 24px",
    surfaceCenter: runtimeAlignment?.surfaceCenter,
    surfaceTop: 40,
    usableCenter: runtimeAlignment?.usableCenter,
  });
  assert.ok(
    Math.abs((runtimeAlignment?.surfaceCenter ?? 0) - (runtimeAlignment?.usableCenter ?? 0)) <= 1,
  );
  assert.equal(await previewSurface.getAttribute("data-preview-align"), "start");

  const alignmentPage = await context.newPage();
  await alignmentPage.setViewportSize({ height: 450, width: 1200 });
  for (const align of ["start", "center", "end"]) {
    await alignmentPage.goto(
      `${baseUrl}/preview/_fixture?theme=light&width=desktop&align=${align}&timers=real`,
    );
    const metrics = await alignmentPage
      .locator('[data-preview-frame="true"]')
      .evaluate((element) => {
        const surface = element.querySelector("[data-preview-ready]");
        if (!(surface instanceof HTMLElement)) return null;
        const frameRect = element.getBoundingClientRect();
        const surfaceRect = surface.getBoundingClientRect();
        return {
          alignItems: getComputedStyle(element).alignItems,
          frameCenterX: frameRect.left + frameRect.width / 2,
          frameHeight: frameRect.height,
          surfaceBottom: surfaceRect.bottom,
          surfaceCenterX: surfaceRect.left + surfaceRect.width / 2,
          surfaceCenterY: surfaceRect.top + surfaceRect.height / 2,
          surfaceTop: surfaceRect.top,
        };
      });
    assert.ok(metrics);
    assert.equal(
      metrics.alignItems,
      align === "center" ? "center" : align === "start" ? "flex-start" : "flex-end",
    );
    assert.equal(metrics.frameHeight, 450);
    assert.ok(Math.abs(metrics.frameCenterX - metrics.surfaceCenterX) <= 1);
    if (align === "start") assert.equal(metrics.surfaceTop, 40);
    if (align === "center") assert.ok(Math.abs(metrics.surfaceCenterY - 225) <= 1);
    if (align === "end") assert.equal(metrics.surfaceBottom, 410);
  }
  await alignmentPage.close();

  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.locator("html.dark").waitFor();
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-preview-contract="interactive"] iframe')
        ?.getAttribute("src") ===
      "/preview/_fixture?theme=dark&width=mobile&align=start&reducedMotion=no-preference&timers=real",
  );

  const sourcePanel = card.locator("[data-source-panel]");
  const copyButton = card.getByRole("button", { name: "Copy to clipboard" });
  assert.equal(await previewTab.getAttribute("aria-selected"), "true");
  assert.equal(await codeTab.getAttribute("aria-selected"), "false");
  assert.equal(await previewTab.getAttribute("tabindex"), "0");
  assert.equal(await codeTab.getAttribute("tabindex"), "-1");

  await previewTab.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await codeTab.evaluate((element) => element === document.activeElement), true);
  assert.equal(await previewTab.getAttribute("aria-selected"), "true");
  assert.equal(await codeTab.getAttribute("aria-selected"), "false");
  assert.equal(await previewTab.getAttribute("tabindex"), "-1");
  assert.equal(await codeTab.getAttribute("tabindex"), "0");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "preview");
  assert.equal(await sourcePanel.getAttribute("hidden"), "");

  await page.keyboard.press("Space");
  assert.equal(await previewTab.getAttribute("aria-selected"), "false");
  assert.equal(await codeTab.getAttribute("aria-selected"), "true");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "code");
  assert.equal(await sourcePanel.getAttribute("hidden"), null);

  const sourceMetrics = await sourcePanel.evaluate((element) => {
    const figure = element.querySelector("figure");
    const pre = element.querySelector("pre");
    const firstLine = element.querySelector("[data-line]");
    const outer = element.parentElement;
    if (
      !(figure instanceof HTMLElement) ||
      !(pre instanceof HTMLElement) ||
      !(firstLine instanceof HTMLElement) ||
      !outer
    )
      return null;
    const figureStyle = getComputedStyle(figure);
    const lineStyle = getComputedStyle(firstLine);
    const lineNumberStyle = getComputedStyle(firstLine, "::before");
    const preStyle = getComputedStyle(pre);
    const outerStyle = getComputedStyle(outer);
    return {
      figureBorder: figureStyle.borderWidth,
      figureMargin: figureStyle.margin,
      figureRadius: figureStyle.borderRadius,
      outerBorder: outerStyle.borderWidth,
      panelHeight: element.getBoundingClientRect().height,
      preBorder: preStyle.borderWidth,
      preFontSize: preStyle.fontSize,
      preHeight: pre.getBoundingClientRect().height,
      preLineHeight: preStyle.lineHeight,
      preOverflow: preStyle.overflow,
      prePadding: preStyle.padding,
      preRadius: preStyle.borderRadius,
      rowDisplay: lineStyle.display,
      rowPadding: lineStyle.padding,
      lineNumberPaddingRight: lineNumberStyle.paddingRight,
      lineNumberTextAlign: lineNumberStyle.textAlign,
      lineNumberWidth: lineNumberStyle.width,
      scrollHeight: pre.scrollHeight,
    };
  });
  assert.deepEqual(sourceMetrics, {
    figureBorder: "0px",
    figureMargin: "0px",
    figureRadius: "0px",
    outerBorder: "1px",
    panelHeight: 450,
    preBorder: "0px",
    preFontSize: "13px",
    preHeight: 450,
    preLineHeight: "19.5px",
    preOverflow: "auto",
    prePadding: "14px 16px 14px 0px",
    preRadius: "0px",
    rowDisplay: "block",
    rowPadding: "2px 0px",
    lineNumberPaddingRight: "24px",
    lineNumberTextAlign: "right",
    lineNumberWidth: "64px",
    scrollHeight: sourceMetrics?.scrollHeight,
  });
  assert.ok((sourceMetrics?.scrollHeight ?? 0) > 450);

  await copyButton.click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expectedSource);

  await previewTab.click();
  assert.equal(await previewTab.getAttribute("aria-selected"), "true");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "preview");
  await codeTab.click();
  assert.equal(await codeTab.getAttribute("aria-selected"), "true");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "code");

  await codeTab.focus();
  await page.keyboard.press("Tab");
  assert.equal(await copyButton.evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Shift+Tab");
  assert.equal(await codeTab.evaluate((element) => element === document.activeElement), true);

  await page.keyboard.press("ArrowLeft");
  assert.equal(await previewTab.evaluate((element) => element === document.activeElement), true);
  assert.equal(await previewTab.getAttribute("aria-selected"), "false");
  assert.equal(await codeTab.getAttribute("aria-selected"), "true");
  assert.equal(await previewTab.getAttribute("tabindex"), "0");
  assert.equal(await codeTab.getAttribute("tabindex"), "-1");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "code");

  await page.keyboard.press("Enter");
  assert.equal(await previewTab.getAttribute("aria-selected"), "true");
  assert.equal(await codeTab.getAttribute("aria-selected"), "false");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "preview");

  await page.keyboard.press("Tab");
  assert.equal(await frame.evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Shift+Tab");
  assert.equal(await previewTab.evaluate((element) => element === document.activeElement), true);

  const hiddenCode = page.locator('[data-preview-contract="hidden-code"]');
  assert.equal(await hiddenCode.getByRole("tablist").count(), 0);
  assert.equal(await hiddenCode.getByRole("tab").count(), 0);
  assert.equal(
    await hiddenCode.getByTitle("Hidden code contract preview").getAttribute("src"),
    "/preview/_fixture?theme=light&width=tablet&align=center&reducedMotion=no-preference&timers=real",
  );
} finally {
  await browser.close();
  preview?.kill("SIGTERM");
}
