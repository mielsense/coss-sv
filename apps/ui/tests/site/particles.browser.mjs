import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

let baseUrl = process.env.COSS_TEST_BASE_URL;
const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
let preview;

const manifest = JSON.parse(
  await readFile(
    new URL("../../.svelte-kit/output/client/.vite/manifest.json", import.meta.url),
    "utf8",
  ),
);
const sourceChunk = Object.entries(manifest).find(
  ([key]) => key.includes("coss-sv:particle-source:") && key.endsWith("p-button-41.svelte.js"),
)?.[1]?.file;
assert.equal(
  typeof sourceChunk,
  "string",
  "the p-button-41 source chunk must exist in the manifest",
);
const sourceChunkPath = `/${sourceChunk}`;

async function availablePort() {
  const probe = createServer();
  const port = await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        reject(new Error("could not allocate a particles test port"));
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
  throw new Error(`Particles test server did not become ready at ${baseUrl}`);
}

async function selectTab(tab, name) {
  await tab.waitFor();
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if ((await tab.getAttribute("aria-selected")) === "true") return;
    await tab.click();
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.equal(
    await tab.getAttribute("aria-selected"),
    "true",
    `${name} tab did not become active`,
  );
}

if (!baseUrl) {
  const port = await availablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  preview = spawn(
    process.execPath,
    [viteExecutable, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: appDirectory, env: process.env, stdio: "inherit" },
  );
  const exited = new Promise((_, reject) => {
    preview.once("exit", (code, signal) => {
      reject(
        new Error(
          `Particles test server exited before readiness (code ${code ?? "none"}, signal ${signal ?? "none"})`,
        ),
      );
    });
  });
  await Promise.race([waitForPreview(), exited]);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  colorScheme: "light",
  permissions: ["clipboard-read", "clipboard-write"],
  viewport: { height: 900, width: 1280 },
});
await mockOpenAnalytics(context);
const page = await context.newPage();
const diagnostics = [];
const requestedPaths = [];
page.on("pageerror", (error) => diagnostics.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") diagnostics.push(message.text());
});
page.on("request", (request) => requestedPaths.push(new URL(request.url()).pathname));

try {
  await page.goto(`${baseUrl}/particles`);
  await page.locator("h1", { hasText: "Browse Particles" }).waitFor();
  assert.equal(
    await page.getByText(/Discover 508 ready-to-use particles/).count(),
    1,
    "the description must reflect the currently published inventory",
  );
  assert.equal(await page.locator("[data-particle-card]").count(), 0);
  assert.equal(
    await page.getByRole("combobox", { name: "Search components" }).getAttribute("aria-expanded"),
    "true",
  );

  const search = page.getByRole("combobox", { name: "Search components" });
  await search.fill("spi");
  assert.equal(await page.getByRole("option", { name: "Spinner", exact: true }).count(), 1);
  assert.equal(await page.getByRole("option", { name: "Accordion", exact: true }).count(), 0);
  await search.fill("");

  await page.getByRole("option", { name: "Button", exact: true }).click();
  await page.waitForURL(/tags=button$/);
  assert.equal(await page.locator("[data-particle-card]").count(), 90);
  assert.equal(
    await page.locator("[data-particle-card]").first().getAttribute("data-particle-card"),
    "p-button-1",
  );
  assert.equal(
    (await page.locator('[data-particle-card="p-button-1"] svg[stroke-width="2"]').count()) > 0,
    true,
  );

  await page.getByRole("combobox", { name: "Search components" }).click();
  await page.getByRole("option", { name: "Loading", exact: true }).click();
  await page.waitForURL(/tags=button%2Cloading$/);
  assert.deepEqual(
    await page.locator("[data-particle-card]").evaluateAll((cards) =>
      cards.map((card) => ({
        description: card.querySelector("[data-slot=card-frame-footer] p")?.textContent?.trim(),
        name: card.getAttribute("data-particle-card"),
      })),
    ),
    [
      { description: "Button using the built-in loading prop", name: "p-button-41" },
      { description: "Custom loading button with manual Spinner", name: "p-button-18" },
    ],
  );

  const firstViewCode = page.getByRole("button", { name: "View code", exact: true }).first();
  assert.equal(
    requestedPaths.includes(sourceChunkPath),
    false,
    "visibility-loading a preview must not download its source chunk",
  );
  await firstViewCode.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  const installTabs = dialog.getByRole("tablist", { name: "Package manager" });
  assert.equal(await installTabs.getByRole("tab").count(), 4);
  assert.deepEqual(await installTabs.getByRole("tab").allTextContents(), [
    "bun",
    "npm",
    "pnpm",
    "yarn",
  ]);
  assert.equal(
    await installTabs.getByRole("tab", { name: "pnpm", exact: true }).getAttribute("aria-selected"),
    "true",
  );
  assert.equal(
    await dialog.locator('[data-install-command="pnpm"] code').textContent(),
    "pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/p-button-41.json",
  );
  await selectTab(installTabs.getByRole("tab", { name: "bun", exact: true }), "bun");
  assert.equal(
    await dialog.locator('[data-install-command="bun"] code').textContent(),
    "bunx --bun shadcn-svelte@latest add https://coss-sv.vercel.app/r/p-button-41.json",
  );
  const openInV0 = dialog.getByRole("link", { name: "Open in v0", exact: true });
  assert.equal(
    await openInV0.getAttribute("href"),
    "https://v0.dev/chat/api/open?url=https%3A%2F%2Fcoss-sv.vercel.app%2Fr%2Fp-button-41.json",
  );
  const drawerSource = dialog.locator("[data-preview-source] pre");
  assert.equal(await drawerSource.count(), 1);
  assert.equal(await dialog.locator("[data-source-loading]").count(), 0);
  assert.equal(requestedPaths.includes(sourceChunkPath), true);
  assert.ok((await drawerSource.locator("[data-line]").count()) > 1);
  const drawerSourceText = (await drawerSource.textContent()) ?? "";
  assert.match(drawerSourceText, /\$lib\/components\/ui\/button\/index\.js/);
  assert.doesNotMatch(drawerSourceText, /defineParticleMeta|id:\s*["']p-button-41/);
  assert.equal(
    requestedPaths.some((path) => path === "/r/p-button-41.json"),
    false,
  );
  assert.equal(
    requestedPaths.some((path) => path.startsWith("/api/particle-source/")),
    false,
  );
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert.equal(await firstViewCode.evaluate((element) => element === document.activeElement), true);

  await page.goto(`${baseUrl}/docs/components/skeleton`);
  const skeletonExample = page.locator('[data-particle="p-skeleton-1"]');
  await selectTab(skeletonExample.getByRole("tab", { name: "Code" }), "Code");
  assert.equal(await skeletonExample.locator("[data-source-loading]").count(), 0);
  const skeletonSource = skeletonExample.locator("[data-source-panel] pre");
  await skeletonSource.waitFor();
  const skeletonSourceText = (await skeletonSource.textContent()) ?? "";
  assert.match(skeletonSourceText, /\$lib\/components\/ui\/skeleton\/index\.js/);
  assert.match(skeletonSourceText, /<Avatar\.Root/);
  assert.equal(await skeletonExample.locator("[data-source-load-error]").count(), 0);
  assert.equal(
    requestedPaths.some((path) => path.startsWith("/api/particle-source/")),
    false,
  );

  const docsPackageManagers = page.getByRole("tablist", { name: "Package manager" });
  assert.deepEqual(await docsPackageManagers.getByRole("tab").allTextContents(), [
    "bun",
    "npm",
    "pnpm",
    "yarn",
  ]);
  await selectTab(docsPackageManagers.getByRole("tab", { name: "npm", exact: true }), "npm");
  assert.equal(
    await page.locator('[data-install-command="npm"] code').textContent(),
    "npx shadcn-svelte@latest add https://coss-sv.vercel.app/r/skeleton.json",
  );
  await page.goto(`${baseUrl}/docs/components/accordion`);
  await selectTab(
    page
      .getByRole("tablist", { name: "Installation method" })
      .getByRole("tab", { name: "Manual", exact: true }),
    "Manual",
  );
  const manualInstallation = page.getByRole("tabpanel", { name: "Manual" });
  const dependencyPackageManagers = manualInstallation.getByRole("tablist", {
    name: "Package manager",
  });
  assert.deepEqual(await dependencyPackageManagers.getByRole("tab").allTextContents(), [
    "bun",
    "npm",
    "pnpm",
    "yarn",
  ]);
  await selectTab(
    dependencyPackageManagers.getByRole("tab", { name: "yarn", exact: true }),
    "yarn",
  );
  assert.match(
    (await manualInstallation.locator('[data-install-command="yarn"] code').textContent()) ?? "",
    /^yarn add /,
  );

  await page.goto(`${baseUrl}/particles?tags=not-real`);
  assert.equal(
    await page.getByText("No particles found for the selected filters", { exact: true }).count(),
    1,
  );
  assert.equal(await page.locator("[data-particle-card]").count(), 0);

  const mobile = await context.newPage();
  await mobile.setViewportSize({ height: 844, width: 390 });
  await mobile.goto(`${baseUrl}/particles?tags=button%2Cloading`);
  await mobile.locator("[data-particle-grid]").waitFor();
  const mobileLayout = await mobile.locator("[data-particle-grid]").evaluate((grid) => ({
    columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  assert.deepEqual(mobileLayout, { columns: 1, overflow: false });
  await mobile.close();

  assert.deepEqual(diagnostics, []);
  console.log("Particles search, URL state, cards, source drawer, and responsive layout passed.");
} finally {
  await browser.close();
  if (preview) {
    preview.kill("SIGTERM");
    await new Promise((resolve) => preview.once("exit", resolve));
  }
}
