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
  await page.goto(`${baseUrl}/`);
  await page.locator(".category-grid").waitFor();

  const desktopHome = await page.evaluate(() => {
    const metrics = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    return {
      card: metrics(".category-card"),
      grid: metrics(".category-grid"),
      heading: metrics(".hero h1"),
      hero: metrics(".hero"),
      categoryNames: [...document.querySelectorAll(".category-card h2")].map((item) =>
        item.textContent?.trim(),
      ),
      headingText: document.querySelector(".hero h1")?.textContent?.trim(),
      heroCopy: document.querySelector(".hero-copy")?.textContent?.trim(),
      actions: [...document.querySelectorAll(".hero-actions a")].map((item) =>
        item.textContent?.trim(),
      ),
    };
  });

  assert.equal(
    desktopHome.headingText,
    "A new, modern UI component library built on top of Shards UI.",
  );
  assert.equal(desktopHome.heroCopy, "Built for developers and AI.");
  assert.deepEqual(desktopHome.actions, ["Get started", "Browse 508 particles"]);
  assert.equal(desktopHome.categoryNames.length, 55);
  assert.deepEqual(desktopHome.categoryNames.slice(0, 4), [
    "Accordion",
    "Alert",
    "Alert Dialog",
    "Autocomplete",
  ]);
  assert.ok(desktopHome.hero && desktopHome.heading && desktopHome.grid && desktopHome.card);
  assertNear(desktopHome.hero.x, 24, "desktop home hero x");
  assertNear(desktopHome.hero.y, 64, "desktop home hero y");
  assertNear(desktopHome.heading.width, 672, "desktop home heading width");
  assertNear(desktopHome.grid.x, 24, "desktop home category grid x");
  assertNear(desktopHome.grid.y, 392, "desktop home category grid y");
  assertNear(desktopHome.card.width, 284, "desktop home category card width");
  assertNear(desktopHome.card.height, 316, "desktop home category card height");

  await page.goto(`${baseUrl}/docs/preview/p-button-1`);
  const productionPreview = page.getByTitle("p-button-1 preview");
  await productionPreview.waitFor();
  assert.equal(
    await productionPreview.getAttribute("src"),
    "/preview/p-button-1?theme=light&width=desktop",
  );
  const selectedViewportBackground = await page
    .getByRole("button", { name: "Desktop preview" })
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  assert.notEqual(selectedViewportBackground, "rgba(0, 0, 0, 0)");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await page.waitForFunction(
    () =>
      document
        .querySelector('iframe[title="p-button-1 preview"]')
        ?.getAttribute("src")
        ?.includes("theme=dark") ?? false,
  );
  assert.equal(
    await productionPreview.getAttribute("src"),
    "/preview/p-button-1?theme=dark&width=desktop",
  );

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
  await page.goto(`${baseUrl}/`);
  await page.locator(".category-grid").waitFor();
  const mobileHome = await page.evaluate(() => {
    const metrics = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    return {
      actions: metrics(".hero-actions"),
      card: metrics(".category-card"),
      grid: metrics(".category-grid"),
      heading: metrics(".hero h1"),
      hero: metrics(".hero"),
    };
  });
  assert.ok(
    mobileHome.hero &&
      mobileHome.heading &&
      mobileHome.actions &&
      mobileHome.grid &&
      mobileHome.card,
  );
  assertNear(mobileHome.hero.x, 16, "mobile home hero x");
  assertNear(mobileHome.hero.y, 64, "mobile home hero y");
  assertNear(mobileHome.heading.width, 358, "mobile home heading width");
  assertNear(mobileHome.actions.width, 307.578, "mobile home actions width");
  assertNear(mobileHome.grid.x, 16, "mobile home category grid x");
  assertNear(mobileHome.card.width, 358, "mobile home category card width");

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
