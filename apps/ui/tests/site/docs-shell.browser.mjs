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
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const browserDiagnostics = [];

page.on("console", (message) => {
  if (/Failed to load resource: the server responded with a status of 404/.test(message.text())) {
    return;
  }
  if (message.type() === "warning" || message.type() === "error") {
    browserDiagnostics.push(`${message.type()}: ${message.text()}`);
  }
});
page.on("pageerror", (error) => {
  browserDiagnostics.push(`pageerror: ${error.message}`);
});

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
    "/preview/p-button-1?theme=light&width=desktop&reducedMotion=no-preference&timers=real",
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
    "/preview/p-button-1?theme=dark&width=desktop&reducedMotion=no-preference&timers=real",
  );

  await page.goto(`${baseUrl}/docs/preview/preview-card`);
  const interactivePreview = page.getByTitle("preview-card preview");
  await interactivePreview.waitFor();
  assert.equal(
    await interactivePreview.getAttribute("src"),
    "/preview/preview-card?theme=dark&width=desktop&reducedMotion=no-preference&timers=real",
  );
  const interactiveFrame = interactivePreview.contentFrame();
  await interactiveFrame.getByRole("button", { name: "coss.com/ui" }).hover();
  await interactiveFrame.getByText("Beautifully designed components").waitFor({ state: "visible" });

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
      sidebarContent: metrics(".docs-sidebar nav"),
      sidebarGroup: metrics(".docs-sidebar section"),
      sidebarLink: metrics(".docs-sidebar section a"),
      headingFontSize: getComputedStyle(document.querySelector(".docs-content h1")).fontSize,
      headingLineHeight: getComputedStyle(document.querySelector(".docs-content h1")).lineHeight,
      sidebarGroupPaddingLeft: getComputedStyle(document.querySelector(".docs-sidebar section"))
        .paddingLeft,
    };
  });

  assert.ok(
    geometry.frame &&
      geometry.heading &&
      geometry.sidebar &&
      geometry.sidebarContent &&
      geometry.sidebarGroup &&
      geometry.sidebarLink,
  );
  assertNear(geometry.frame.x, 256, "desktop docs frame x");
  assertNear(geometry.frame.y, 96, "desktop docs frame y");
  assertNear(geometry.frame.width, 720, "desktop docs frame width");
  assertNear(geometry.heading.x, 289, "desktop docs heading x");
  assertNear(geometry.heading.y, 129, "desktop docs heading y");
  assert.equal(geometry.headingFontSize, "36px");
  assert.equal(geometry.headingLineHeight, "40px");
  assertNear(geometry.sidebar.x, 0, "desktop sidebar x");
  assertNear(geometry.sidebar.width, 256, "desktop sidebar width");
  assertNear(geometry.sidebarContent.x, 0, "desktop sidebar content x");
  assertNear(geometry.sidebarContent.width, 256, "desktop sidebar content width");
  assertNear(geometry.sidebarGroup.x, 16, "desktop sidebar group x");
  assertNear(geometry.sidebarGroup.width, 224, "desktop sidebar group width");
  assert.equal(geometry.sidebarGroupPaddingLeft, "8px");
  assertNear(geometry.sidebarLink.x, 24, "desktop sidebar link x");
  assertNear(geometry.sidebarLink.width, 208, "desktop sidebar link width");

  const introduction = page.getByRole("link", { name: "Introduction", exact: true });
  assert.equal(await introduction.getAttribute("aria-current"), "page");
  await page.getByRole("link", { name: "Miel", exact: true }).waitFor();
  assert.equal(
    await page.getByRole("link", { name: "Credits and licenses" }).getAttribute("href"),
    "/credits",
  );

  await page.goto(`${baseUrl}/definitely-missing`);
  assert.equal(await page.title(), "Page Not Found");
  assert.equal(await page.getByRole("heading", { name: "Page Not Found" }).isVisible(), true);
  const backHome = page.getByRole("link", { name: /Back to Home/ });
  assert.equal(await backHome.getAttribute("href"), "/");
  assert.equal(await page.locator("footer").count(), 0);
  assert.equal(await page.locator(".error-code").count(), 0);
  assert.doesNotMatch(await page.locator("body").innerText(), /(^|\s)404(\s|$)/);

  const desktopError = await page.evaluate(() => {
    const metrics = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight,
      };
    };
    return {
      heading: metrics(".error-page h1"),
      description: metrics(".error-page > p"),
      action: metrics(".error-page .site-button"),
    };
  });
  assert.ok(desktopError.heading && desktopError.description && desktopError.action);
  assertNear(desktopError.heading.x, 466.977, "desktop 404 heading x");
  assertNear(desktopError.heading.y, 128, "desktop 404 heading y");
  assertNear(desktopError.heading.width, 346.039, "desktop 404 heading width");
  assertNear(desktopError.heading.height, 48, "desktop 404 heading height");
  assert.equal(desktopError.heading.fontSize, "48px");
  assert.equal(desktopError.heading.lineHeight, "48px");
  assert.equal(desktopError.heading.fontWeight, "700");
  assertNear(desktopError.description.x, 369.086, "desktop 404 description x");
  assertNear(desktopError.description.y, 192, "desktop 404 description y");
  assertNear(desktopError.description.width, 541.82, "desktop 404 description width");
  assertNear(desktopError.description.height, 28, "desktop 404 description height");
  assert.equal(desktopError.description.fontSize, "18px");
  assert.equal(desktopError.description.lineHeight, "28px");
  assertNear(desktopError.action.x, 569.719, "desktop 404 action x");
  assertNear(desktopError.action.y, 252, "desktop 404 action y");
  assertNear(desktopError.action.width, 140.555, "desktop 404 action width");
  assertNear(desktopError.action.height, 36, "desktop 404 action height");
  assert.equal(desktopError.action.fontSize, "14px");
  assert.equal(desktopError.action.lineHeight, "20px");
  const arrowTransition = await backHome.locator("svg").evaluate((element) => {
    const style = getComputedStyle(element);
    return { property: style.transitionProperty, transform: style.transform };
  });
  assert.equal(arrowTransition.property, "transform");
  assert.equal(arrowTransition.transform, "none");
  await backHome.hover();
  await page.waitForTimeout(200);
  assert.equal(
    await backHome.locator("svg").evaluate((element) => getComputedStyle(element).transform),
    "matrix(1, 0, 0, 1, -2, 0)",
  );

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
  const mobileHeading = await page.locator(".docs-content h1").evaluate((element) => {
    const style = getComputedStyle(element);
    return { fontSize: style.fontSize, lineHeight: style.lineHeight };
  });
  assert.deepEqual(mobileHeading, { fontSize: "30px", lineHeight: "36px" });

  const menuTrigger = page.locator(".mobile-menu-trigger");
  await page.waitForTimeout(250);
  await menuTrigger.click();
  const menuDialog = page.locator(".mobile-menu-dialog");
  await menuDialog.waitFor();
  assert.equal(await menuTrigger.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  await menuDialog.waitFor({ state: "hidden" });
  assert.equal(await menuTrigger.evaluate((element) => element === document.activeElement), true);

  await page.goto(`${baseUrl}/definitely-missing`);
  const mobileError = await page.evaluate(() => {
    const metrics = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      };
    };
    return {
      heading: metrics(".error-page h1"),
      description: metrics(".error-page > p"),
      action: metrics(".error-page .site-button"),
    };
  });
  assert.ok(mobileError.heading && mobileError.description && mobileError.action);
  assertNear(mobileError.heading.x, 65.234, "mobile 404 heading x");
  assertNear(mobileError.heading.y, 96, "mobile 404 heading y");
  assertNear(mobileError.heading.width, 259.531, "mobile 404 heading width");
  assertNear(mobileError.heading.height, 40, "mobile 404 heading height");
  assert.equal(mobileError.heading.fontSize, "36px");
  assert.equal(mobileError.heading.lineHeight, "40px");
  assertNear(mobileError.description.x, 16, "mobile 404 description x");
  assertNear(mobileError.description.y, 144, "mobile 404 description y");
  assertNear(mobileError.description.width, 358, "mobile 404 description width");
  assertNear(mobileError.description.height, 48, "mobile 404 description height");
  assert.equal(mobileError.description.fontSize, "16px");
  assert.equal(mobileError.description.lineHeight, "24px");
  assertNear(mobileError.action.x, 117.633, "mobile 404 action x");
  assertNear(mobileError.action.y, 216, "mobile 404 action y");
  assertNear(mobileError.action.width, 154.727, "mobile 404 action width");
  assertNear(mobileError.action.height, 40, "mobile 404 action height");
  assert.equal(mobileError.action.fontSize, "16px");
  assert.equal(mobileError.action.lineHeight, "24px");
  assert.equal(await page.locator("footer").count(), 0);
  assert.equal(await page.locator(".error-code").count(), 0);
  assert.doesNotMatch(await page.locator("body").innerText(), /(^|\s)404(\s|$)/);
  assert.deepEqual(browserDiagnostics, []);
} finally {
  await browser.close();
  preview?.kill("SIGTERM");
}
