import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

let baseUrl = process.env.COSS_TEST_BASE_URL;
const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const expectedSource = await readFile(
  new URL("../../src/routes/(site)/docs/_preview-contract/source.txt", import.meta.url),
  "utf8",
);
const clientManifest = JSON.parse(
  await readFile(new URL("../../.svelte-kit/output/client/.vite/manifest.json", import.meta.url)),
);
const globalPreviewRegistry = Object.values(clientManifest).find(
  (entry) => entry.name === "particle-previews",
);
assert.ok(
  globalPreviewRegistry?.file,
  "the production manifest includes the gallery registry chunk",
);
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
let preview;

async function availablePort() {
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
      if ((await fetch(`${baseUrl}/preview/_health`)).ok) return;
    } catch {
      // The production preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`PreviewCard contract server did not become ready at ${baseUrl}`);
}

if (!baseUrl) {
  const port = await availablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  preview = spawn(
    process.execPath,
    [viteExecutable, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: appDirectory, env: process.env, stdio: "inherit" },
  );
  await Promise.race([
    waitForPreview(),
    new Promise((_, reject) => {
      preview.once("exit", (code, signal) => {
        reject(new Error(`preview exited early (${code ?? "none"}/${signal ?? "none"})`));
      });
    }),
  ]);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  colorScheme: "light",
  permissions: ["clipboard-read", "clipboard-write"],
  viewport: { height: 900, width: 1280 },
});
const page = await context.newPage();
const diagnostics = [];
const requestedPaths = new Set();
page.on("pageerror", (error) => diagnostics.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") diagnostics.push(message.text());
});
page.on("request", (request) => requestedPaths.add(new URL(request.url()).pathname));

try {
  await page.goto(`${baseUrl}/docs/_preview-contract`, { waitUntil: "networkidle" });
  assert.equal(
    requestedPaths.has(`/${globalPreviewRegistry.file}`),
    false,
    "a documentation page does not load the global particle registry",
  );

  const card = page.locator('[data-preview-contract="interactive"]');
  const presentation = card.locator("[data-preview-panel]");
  const previewTab = card.getByRole("tab", { name: "Preview" });
  const codeTab = card.getByRole("tab", { name: "Code" });
  await presentation.waitFor();

  assert.equal(await card.locator("iframe").count(), 0, "docs examples render directly");
  assert.equal(await card.getByText("Preview fixture", { exact: true }).count(), 1);
  const previewMetrics = await presentation.evaluate((element) => {
    const inner = element.querySelector("[data-preview-inner]");
    if (!(inner instanceof HTMLElement)) return null;
    return {
      alignItems: getComputedStyle(inner).alignItems,
      elementHeight: element.getBoundingClientRect().height,
      innerWidth: inner.getBoundingClientRect().width,
      overflowY: getComputedStyle(element).overflowY,
      padding: getComputedStyle(inner).padding,
    };
  });
  assert.deepEqual(previewMetrics, {
    alignItems: "flex-start",
    elementHeight: 450,
    innerWidth: 390,
    overflowY: "auto",
    padding: "40px 24px",
  });

  const sourcePanel = card.locator("[data-source-panel]");
  const copyButton = card.getByRole("button", { name: "Copy to clipboard" });
  assert.equal(await previewTab.getAttribute("aria-selected"), "true");
  assert.equal(await codeTab.getAttribute("aria-selected"), "false");

  await previewTab.focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(await codeTab.evaluate((element) => element === document.activeElement), true);
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "preview");
  await page.keyboard.press("Space");
  assert.equal(await codeTab.getAttribute("aria-selected"), "true");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "code");
  assert.equal(await sourcePanel.getAttribute("hidden"), null);

  const sourceMetrics = await sourcePanel.evaluate((element) => {
    const pre = element.querySelector("pre");
    const lines = element.querySelectorAll("[data-line]");
    const firstLine = lines[0];
    const secondLine = lines[1];
    if (
      !(pre instanceof HTMLElement) ||
      !(firstLine instanceof HTMLElement) ||
      !(secondLine instanceof HTMLElement)
    )
      return null;
    return {
      firstLineHeight: firstLine.getBoundingClientRect().height,
      height: pre.getBoundingClientRect().height,
      lineGap: secondLine.getBoundingClientRect().top - firstLine.getBoundingClientRect().top,
      lineNumberWidth: getComputedStyle(firstLine, "::before").width,
      overflow: getComputedStyle(pre).overflow,
      scrollHeight: pre.scrollHeight,
    };
  });
  assert.equal(sourceMetrics?.height, 450);
  assert.equal(sourceMetrics?.lineGap, sourceMetrics?.firstLineHeight);
  assert.equal(sourceMetrics?.lineNumberWidth, "64px");
  assert.equal(sourceMetrics?.overflow, "auto");
  assert.ok((sourceMetrics?.scrollHeight ?? 0) > 450);

  await copyButton.click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expectedSource);

  await codeTab.focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal(await previewTab.evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press("Enter");
  assert.equal(await previewTab.getAttribute("aria-selected"), "true");
  assert.equal(await card.locator("[data-tab]").getAttribute("data-tab"), "preview");

  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.locator("html.dark").waitFor();
  assert.equal(await card.getByText("Preview fixture", { exact: true }).count(), 1);

  const hiddenCode = page.locator('[data-preview-contract="hidden-code"]');
  assert.equal(await hiddenCode.getByRole("tablist").count(), 0);
  assert.equal(await hiddenCode.getByRole("tab").count(), 0);
  assert.equal(await hiddenCode.locator("iframe").count(), 0);
  assert.equal(await hiddenCode.getByText("Preview fixture", { exact: true }).count(), 1);

  assert.deepEqual(diagnostics, []);
  console.log("PreviewCard direct rendering, tabs, source, clipboard, and theming passed.");
} finally {
  await context.close();
  await browser.close();
  if (preview) {
    preview.kill("SIGTERM");
    await new Promise((resolve) => preview.once("exit", resolve));
  }
}
