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
  assert.equal(await frame.getAttribute("src"), "/preview/_fixture?theme=light&width=mobile");
  assert.equal(await frame.getAttribute("data-preview-width"), "mobile");
  const alignment = await presentation.evaluate((element) => {
    const iframe = element.querySelector("iframe");
    const frameSurface = iframe?.parentElement;
    if (!(iframe instanceof HTMLElement) || !(frameSurface instanceof HTMLElement)) return null;
    const iframeRect = iframe.getBoundingClientRect();
    const frameRect = frameSurface.getBoundingClientRect();
    return {
      frameLeft: frameRect.left,
      iframeLeft: iframeRect.left,
      justifyContent: getComputedStyle(frameSurface).justifyContent,
      width: iframeRect.width,
    };
  });
  assert.ok(alignment);
  assert.equal(alignment.justifyContent, "flex-start");
  assert.ok(Math.abs(alignment.frameLeft - alignment.iframeLeft) <= 1);
  assert.equal(alignment.width, 390);

  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.locator("html.dark").waitFor();
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-preview-contract="interactive"] iframe')
        ?.getAttribute("src") === "/preview/_fixture?theme=dark&width=mobile",
  );

  await previewTab.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await codeTab.getAttribute("aria-selected"), "true");
  assert.equal(await codeTab.evaluate((element) => element === document.activeElement), true);

  const sourcePanel = card.locator("[data-source-panel]");
  const sourceMetrics = await sourcePanel.evaluate((element) => {
    const figure = element.querySelector("figure");
    const pre = element.querySelector("pre");
    const outer = element.parentElement;
    if (!(figure instanceof HTMLElement) || !(pre instanceof HTMLElement) || !outer) return null;
    const figureStyle = getComputedStyle(figure);
    const preStyle = getComputedStyle(pre);
    const outerStyle = getComputedStyle(outer);
    return {
      figureBorder: figureStyle.borderWidth,
      figureMargin: figureStyle.margin,
      figureRadius: figureStyle.borderRadius,
      outerBorder: outerStyle.borderWidth,
      panelHeight: element.getBoundingClientRect().height,
      preBorder: preStyle.borderWidth,
      preHeight: pre.getBoundingClientRect().height,
      preOverflow: preStyle.overflow,
      prePadding: preStyle.padding,
      preRadius: preStyle.borderRadius,
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
    preHeight: 450,
    preOverflow: "auto",
    prePadding: "0px",
    preRadius: "0px",
    scrollHeight: sourceMetrics?.scrollHeight,
  });
  assert.ok((sourceMetrics?.scrollHeight ?? 0) > 450);

  await card.getByRole("button", { name: "Copy to clipboard" }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expectedSource);

  await codeTab.focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await previewTab.getAttribute("aria-selected"), "true");
  assert.equal(await previewTab.evaluate((element) => element === document.activeElement), true);

  const hiddenCode = page.locator('[data-preview-contract="hidden-code"]');
  assert.equal(await hiddenCode.getByRole("tablist").count(), 0);
  assert.equal(await hiddenCode.getByRole("tab").count(), 0);
  assert.equal(
    await hiddenCode.getByTitle("Hidden code contract preview").getAttribute("src"),
    "/preview/_fixture?theme=light&width=tablet",
  );
} finally {
  await browser.close();
  preview?.kill("SIGTERM");
}
