import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

let baseUrl = process.env.COSS_TEST_BASE_URL;
const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
let preview;

async function findAvailablePort() {
  const probe = createServer();
  const port = await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        reject(new Error("could not allocate a documentation preview port"));
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
      // Vite is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`documentation preview did not become ready at ${baseUrl}`);
}

if (!baseUrl) {
  const port = await findAvailablePort();
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
          `documentation preview exited before readiness (code ${code ?? "none"}, signal ${signal ?? "none"})`,
        ),
      );
    });
  });
  await Promise.race([waitForPreview(), previewExited]);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

function assertNear(actual, expected, label, tolerance = 0.75) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}px, received ${actual}px`,
  );
}

try {
  await page.goto(`${baseUrl}/docs`);
  await page.locator(".docs-frame").waitFor();

  const geometry = await page.evaluate(() => {
    const metrics = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    return {
      frame: metrics(".docs-frame"),
      heading: metrics(".docs-content h1"),
      sidebar: metrics(".docs-sidebar"),
    };
  });

  assert.ok(geometry.frame && geometry.heading && geometry.sidebar);
  assertNear(geometry.frame.x, 256, "desktop docs frame x");
  assertNear(geometry.frame.y, 96, "desktop docs frame y");
  assertNear(geometry.frame.width, 720, "desktop docs frame width");
  assertNear(geometry.heading.x, 289, "desktop docs heading x");
  assertNear(geometry.heading.y, 129, "desktop docs heading y");
  assertNear(geometry.sidebar.width, 240, "desktop sidebar width");

  const introduction = page.getByRole("link", { name: "Introduction", exact: true });
  assert.equal(await introduction.getAttribute("aria-current"), "page");
  await page.getByRole("link", { name: "Miel", exact: true }).waitFor();
  assert.equal(
    await page.getByRole("link", { name: "Credits and licenses" }).getAttribute("href"),
    "/credits",
  );

  await page.goto(`${baseUrl}/definitely-missing`);
  assert.equal(await page.getByRole("heading", { name: "Page Not Found" }).isVisible(), true);
  assert.equal(await page.getByRole("link", { name: /Back to Home/ }).getAttribute("href"), "/");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/docs`);
  assert.equal(await page.locator(".docs-sidebar").isVisible(), false);
  assert.equal(await page.locator(".docs-toc").count(), 0);
  const mobileColumn = await page.locator(".docs-column").boundingBox();
  assert.ok(mobileColumn);
  assertNear(mobileColumn.x, 0, "mobile docs column x");

  const menuTrigger = page.locator(".mobile-menu-trigger");
  await page.waitForTimeout(250);
  await menuTrigger.click();
  const menuDialog = page.locator(".mobile-menu-dialog");
  await menuDialog.waitFor();
  assert.equal(await menuTrigger.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  await menuDialog.waitFor({ state: "hidden" });
  assert.equal(await menuTrigger.evaluate((element) => element === document.activeElement), true);
} finally {
  await browser.close();
  preview?.kill("SIGTERM");
}
