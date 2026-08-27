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
        reject(new Error("could not allocate a preview port"));
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
  throw new Error(`preview did not become ready at ${baseUrl}`);
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
const context = await browser.newContext({ viewport: { height: 900, width: 1440 } });
const page = await context.newPage();

try {
  const query = new URLSearchParams({
    direction: "rtl",
    locale: "ar-EG",
    network: "blocked",
    now: "2024-01-02T03:04:05.000Z",
    reducedMotion: "reduce",
    seed: "42",
    theme: "dark",
    timers: "manual",
    width: "desktop",
  });
  const response = await page.goto(`${baseUrl}/preview/_fixture?${query}`);
  assert.equal(response?.status(), 200);

  const surface = page.locator("[data-preview-ready='true']");
  await surface.waitFor();
  const environment = await surface.evaluate((element) => ({
    color: getComputedStyle(element).getPropertyValue("--primary").trim(),
    direction: element.getAttribute("dir"),
    documentDirection: document.documentElement.dir,
    documentLocale: document.documentElement.lang,
    locale: element.getAttribute("lang"),
    motion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    width: Math.round(element.getBoundingClientRect().width),
  }));
  assert.deepEqual(environment, {
    color: "oklch(97% 0 none)",
    direction: "rtl",
    documentDirection: "rtl",
    documentLocale: "ar-EG",
    locale: "ar-EG",
    motion: true,
    width: 1200,
  });
  assert.notEqual(environment.color, "rgb(255, 62, 0)", "site orange must not enter previews");

  const deterministic = await page.evaluate(async () => {
    let timerFired = false;
    setTimeout(() => {
      timerFired = true;
    }, 0);
    await Promise.resolve();
    const beforeFlush = timerFired;
    window.__COSS_PREVIEW_RUNTIME__.flushTimers();
    let blocked = false;
    try {
      await fetch("https://example.invalid/runtime-probe");
    } catch {
      blocked = true;
    }
    return {
      afterFlush: timerFired,
      beforeFlush,
      blocked,
      now: Date.now(),
      random: [Math.random(), Math.random()],
    };
  });
  assert.equal(deterministic.beforeFlush, false);
  assert.equal(deterministic.afterFlush, true);
  assert.equal(deterministic.blocked, true);
  assert.equal(deterministic.now, Date.parse("2024-01-02T03:04:05.000Z"));

  await page.reload();
  await page.locator("[data-preview-ready='true']").waitFor();
  const repeatedRandom = await page.evaluate(() => [Math.random(), Math.random()]);
  assert.deepEqual(repeatedRandom, deterministic.random);

  const missing = await page.goto(`${baseUrl}/preview/p-not-yet-ported?theme=light&width=desktop`);
  assert.equal(missing?.status(), 404);
  await page.getByRole("heading", { name: "Preview not found" }).waitFor();
} finally {
  await context.close();
  await browser.close();
  preview?.kill("SIGTERM");
}

console.log("preview runtime browser checks passed");
