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
const page = await context.newPage();
const diagnostics = [];
page.on("pageerror", (error) => diagnostics.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") diagnostics.push(message.text());
});

try {
  await page.goto(`${baseUrl}/particles`);
  await page.locator("h1", { hasText: "Browse Particles" }).waitFor();
  assert.equal(
    await page.getByText(/Discover 320 ready-to-use particles/).count(),
    1,
    "the description must reflect the currently published inventory",
  );
  assert.equal(await page.locator("[data-particle-card]").count(), 0);
  assert.equal(
    await page.getByRole("combobox", { name: "Search components" }).getAttribute("aria-expanded"),
    "true",
  );

  await page.getByRole("option", { name: "Button", exact: true }).click();
  await page.waitForURL(/tags=button$/);
  assert.equal(await page.locator("[data-particle-card]").count(), 60);
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
  await firstViewCode.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  assert.equal(
    await dialog.locator("code").first().textContent(),
    "pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/p-button-41.json",
  );
  await dialog.getByText('id: "p-button-41"', { exact: false }).waitFor();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert.equal(await firstViewCode.evaluate((element) => element === document.activeElement), true);

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
