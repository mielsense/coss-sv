import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import { createServer } from "node:net";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

let baseUrl = process.env.COSS_TEST_BASE_URL;
const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const docsRoutesDirectory = fileURLToPath(new URL("../../src/routes/(site)/docs", import.meta.url));
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
let preview;

async function collectRoutes(directory) {
  const routes = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const child = join(directory, entry.name);
    const route = relative(docsRoutesDirectory, child);
    if (route.split("/").some((segment) => segment.startsWith("_") || segment.includes("["))) {
      continue;
    }
    const files = await readdir(child);
    if (files.includes("+page.svelte")) routes.push(`/docs/${route}`);
    routes.push(...(await collectRoutes(child)));
  }
  return routes;
}

const routes = ["/docs", ...(await collectRoutes(docsRoutesDirectory))].sort();

async function availablePort() {
  const probe = createServer();
  const port = await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        reject(new Error("could not allocate a documentation audit port"));
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
  throw new Error(`documentation audit server did not become ready at ${baseUrl}`);
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
const context = await browser.newContext({ colorScheme: "light" });
await mockOpenAnalytics(context);
let activeRoute = "/docs";
const diagnostics = [];
function observe(pageToObserve) {
  pageToObserve.on("pageerror", (error) => diagnostics.push(`${activeRoute}: ${error.message}`));
  pageToObserve.on("console", (message) => {
    if (
      (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) ||
      (message.type() === "warning" && message.text().includes("[svelte]"))
    ) {
      diagnostics.push(`${activeRoute}: ${message.text()}`);
    }
  });
  return pageToObserve;
}

async function waitForParticlePreview(pageToCheck, card, routeLabel) {
  await card.scrollIntoViewIfNeeded();
  const particle = await card.getAttribute("data-particle");
  assert.ok(particle, `${routeLabel} preview has a particle name`);
  try {
    await pageToCheck.waitForFunction(
      (particleName) =>
        document
          .querySelector(`[data-particle="${particleName}"]`)
          ?.getAttribute("data-preview-requested") === "true",
      particle,
      { timeout: 15_000 },
    );
    await card.locator('[data-preview-loading="true"]').waitFor({
      state: "detached",
      timeout: 60_000,
    });
  } catch (error) {
    throw new Error(`${routeLabel} did not load the ${particle} example`, { cause: error });
  }
}

let page = observe(await context.newPage());

try {
  assert.equal(routes.length, 65, "all documentation HTML routes are included");

  for (const viewport of [
    { height: 900, name: "desktop", width: 1440 },
    { height: 844, name: "mobile", width: 390 },
  ]) {
    for (const [index, route] of routes.entries()) {
      if (index % 8 === 0 && (index > 0 || viewport.name === "mobile")) {
        await page.close();
        page = observe(await context.newPage());
      }
      await page.setViewportSize(viewport);
      activeRoute = `${route} (${viewport.name})`;
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      assert.equal(response?.status(), 200, `${activeRoute} route status`);
      const pageHeading = page.locator("[data-docs-header] h1");
      await pageHeading.waitFor({ state: "attached", timeout: 15_000 });
      const previewCards = page.locator("[data-particle]");
      const previewCount = await previewCards.count();
      if (previewCount > 0) {
        await waitForParticlePreview(page, previewCards.first(), activeRoute);
        if (previewCount > 1) {
          await waitForParticlePreview(page, previewCards.last(), activeRoute);
        }
      }
      assert.equal(await pageHeading.count(), 1, `${activeRoute} has one page heading`);
      assert.equal(
        await page.locator(".docs-content h1").count(),
        1,
        `${activeRoute} has no duplicate content heading`,
      );
      assert.equal(
        await page.locator('[data-preview-panel="true"] [data-preview-load-error="true"]').count(),
        0,
        `${activeRoute} examples load successfully`,
      );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      assert.equal(overflow, false, `${activeRoute} has no document-level horizontal overflow`);
      if ((index + 1) % 16 === 0) {
        console.log(
          `Validated ${index + 1}/${routes.length} ${viewport.name} documentation routes.`,
        );
      }
    }
  }

  assert.deepEqual(diagnostics, [], "documentation routes must not emit runtime errors");
  console.log(`Validated ${routes.length} documentation routes at desktop and mobile widths.`);
} finally {
  await context.close();
  await browser.close();
  if (preview) {
    preview.kill("SIGTERM");
    await new Promise((resolve) => preview.once("exit", resolve));
  }
}
