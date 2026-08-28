import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readdir } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

let baseUrl = process.env.COSS_TEST_BASE_URL;
const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
const particleDirectory = resolve(appDirectory, "registry/default/particles");
const registryDirectory = resolve(appDirectory, "static/r");
const particleIds = (await readdir(particleDirectory))
  .filter((name) => name.endsWith(".svelte"))
  .map((name) => name.slice(0, -".svelte".length))
  .sort();
for (const id of particleIds) await access(resolve(registryDirectory, `${id}.json`));
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
  const configurations = [
    {
      direction: "rtl",
      locale: "ar-EG",
      network: "blocked",
      now: "2024-01-02T03:04:05.000Z",
      reducedMotion: "reduce",
      seed: "42",
      theme: "dark",
      timers: "manual",
      width: "desktop",
      widthPixels: 1200,
    },
    {
      direction: "ltr",
      locale: "en-US",
      network: "live",
      now: "2025-06-07T08:09:10.000Z",
      reducedMotion: "no-preference",
      seed: "7",
      theme: "light",
      timers: "real",
      width: "mobile",
      widthPixels: 390,
    },
    {
      direction: "ltr",
      locale: "fr-FR",
      network: "blocked",
      now: "2026-08-26T12:00:00.000Z",
      reducedMotion: "reduce",
      seed: "20260826",
      theme: "light",
      timers: "manual",
      width: "tablet",
      widthPixels: 768,
    },
  ];
  const themeColors = new Map();

  for (const configuration of configurations) {
    const { widthPixels, ...parameters } = configuration;
    const query = new URLSearchParams(parameters);
    const response = await page.goto(`${baseUrl}/preview/_fixture?${query}`);
    assert.equal(response?.status(), 200);

    const surface = page.locator("[data-preview-ready='true']");
    await surface.waitFor();
    const environment = await surface.evaluate((element) => ({
      color: getComputedStyle(element).getPropertyValue("--primary").trim(),
      config: window.__COSS_PREVIEW_RUNTIME__.config,
      direction: element.getAttribute("dir"),
      documentDirection: document.documentElement.dir,
      documentLocale: document.documentElement.lang,
      locale: element.getAttribute("lang"),
      motion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      width: Math.round(element.getBoundingClientRect().width),
    }));
    assert.equal(environment.direction, configuration.direction);
    assert.equal(environment.documentDirection, configuration.direction);
    assert.equal(environment.locale, configuration.locale);
    assert.equal(environment.documentLocale, configuration.locale);
    assert.equal(environment.motion, configuration.reducedMotion === "reduce");
    assert.equal(environment.width, widthPixels);
    assert.deepEqual(environment.config, {
      ...parameters,
      ok: true,
      seed: Number(configuration.seed),
      widthPixels,
    });
    assert.notEqual(environment.color, "rgb(255, 62, 0)", "site orange must not enter previews");
    themeColors.set(configuration.theme, environment.color);

    const deterministic = await page.evaluate(async () => {
      let timerFired = false;
      setTimeout(() => {
        timerFired = true;
      }, 0);
      await Promise.resolve();
      const beforeFlush = timerFired;
      window.__COSS_PREVIEW_RUNTIME__.flushTimers();
      if (window.__COSS_PREVIEW_RUNTIME__.config.timers === "real") {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      let blocked = false;
      if (window.__COSS_PREVIEW_RUNTIME__.config.network === "blocked") {
        try {
          await fetch("https://example.invalid/runtime-probe");
        } catch {
          blocked = true;
        }
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
    assert.equal(deterministic.blocked, configuration.network === "blocked");
    assert.equal(deterministic.now, Date.parse(configuration.now));

    await page.reload();
    await page.locator("[data-preview-ready='true']").waitFor();
    const repeatedRandom = await page.evaluate(() => [Math.random(), Math.random()]);
    assert.deepEqual(repeatedRandom, deterministic.random);
  }

  assert.notEqual(themeColors.get("light"), themeColors.get("dark"));

  if (particleIds[0]) {
    const id = particleIds[0];
    const response = await page.goto(`${baseUrl}/preview/${id}?theme=light&width=desktop`);
    assert.equal(response?.status(), 200);
    const surface = page.locator("[data-preview-ready='true']");
    await surface.waitFor();
    const links = await surface.evaluate((element) => ({
      install: element.getAttribute("data-preview-install-command"),
      registry: element.getAttribute("data-preview-registry-href"),
      source: element.getAttribute("data-preview-source-href"),
    }));
    const registryHref = `/r/${id}.json`;
    assert.deepEqual(links, {
      install: `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app${registryHref}`,
      registry: registryHref,
      source: `https://github.com/mielsense/coss-sv/blob/main/apps/ui/registry/default/particles/${id}.svelte`,
    });
    assert.equal((await page.request.get(`${baseUrl}${registryHref}`)).status(), 200);
  }

  const missing = await page.goto(`${baseUrl}/preview/p-not-yet-ported?theme=light&width=desktop`);
  assert.equal(missing?.status(), 404);
  await page.getByRole("heading", { name: "Preview not found" }).waitFor();
} finally {
  await context.close();
  await browser.close();
  preview?.kill("SIGTERM");
}

console.log("preview runtime browser checks passed");
