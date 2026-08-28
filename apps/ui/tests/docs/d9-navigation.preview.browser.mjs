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

const particleIds = [
  ...Array.from({ length: 7 }, (_, index) => `p-breadcrumb-${index + 1}`),
  ...Array.from({ length: 25 }, (_, index) => `p-calendar-${index + 1}`),
  ...Array.from({ length: 9 }, (_, index) => `p-date-picker-${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `p-pagination-${index + 1}`),
  ...Array.from({ length: 5 }, (_, index) => `p-scroll-area-${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `p-navigation-${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `p-radio-group-${index + 7}`),
  "p-tabs-1",
  ...Array.from({ length: 8 }, (_, index) => `p-table-${index + 1}`),
];

async function availablePort() {
  const probe = createServer();
  const port = await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") return reject(new Error("no preview port"));
      resolve(address.port);
    });
  });
  await new Promise((resolve, reject) =>
    probe.close((error) => (error ? reject(error) : resolve())),
  );
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
    new Promise((_, reject) =>
      preview.once("exit", (code, signal) =>
        reject(new Error(`preview exited early (${code ?? "none"}/${signal ?? "none"})`)),
      ),
    ),
  ]);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { height: 900, width: 1440 } });
const page = await context.newPage();
const query = "theme=light&width=desktop&timers=real";

async function openParticle(id) {
  const response = await page.goto(`${baseUrl}/preview/${id}?${query}`);
  assert.equal(response?.status(), 200, `${id} production preview should return 200`);
  await page.locator("[data-preview-ready='true']").waitFor();
}

async function chooseAugust28(id) {
  await openParticle(id);
  const trigger = page.locator('[data-slot="popover-trigger"]');
  assert.equal(await trigger.count(), 1, `${id} should expose one popover trigger`);
  assert.equal(await trigger.evaluate((element) => element.tagName), "BUTTON");
  await assertEventuallyText(trigger, "Pick a date");
  await trigger.click();
  await page.locator('[data-calendar-date="2026-08-28"]').click();
  await assertEventuallyText(trigger, "August 28th, 2026");
  return trigger;
}

async function assertEventuallyText(locator, expected) {
  await locator.filter({ hasText: expected }).waitFor();
  assert.equal((await locator.textContent())?.trim().includes(expected), true);
}

try {
  for (const id of particleIds) await openParticle(id);

  await openParticle("p-calendar-19");
  await page.getByText("Friday, 28", { exact: true }).waitFor();

  await openParticle("p-calendar-25");
  const time = page.getByRole("combobox", { name: "Enter time" });
  await time.focus();
  assert.deepEqual(
    await time.evaluate((input) => [input.selectionStart, input.selectionEnd]),
    [0, 5],
  );
  await time.fill("615");
  await page.waitForFunction(
    () => document.querySelector('[aria-label="Enter time"]')?.value === "6:15",
    undefined,
    { timeout: 2500 },
  );
  assert.equal(await time.inputValue(), "6:15");
  await time.press("ArrowDown");
  await page.getByRole("option", { name: "06:15", exact: true }).waitFor();
  await time.press("Tab");
  assert.equal(await time.inputValue(), "06:15");

  for (const id of ["p-date-picker-1", "p-date-picker-3", "p-date-picker-6", "p-date-picker-8"]) {
    const trigger = await chooseAugust28(id);
    if (id === "p-date-picker-8") {
      assert.equal(await trigger.getAttribute("data-slot"), "popover-trigger");
      assert.equal(
        await page.getByRole("button").filter({ hasText: "August 28th, 2026" }).count(),
        1,
      );
    }
    if (id === "p-date-picker-6") {
      assert.equal(
        await page.getByRole("dialog").count(),
        0,
        "close-on-select picker should close",
      );
    }
  }

  await openParticle("p-date-picker-4");
  await page.getByRole("button", { name: /August 28th, 2026/ }).waitFor();
} finally {
  await context.close();
  await browser.close();
  preview?.kill("SIGTERM");
}

console.log("D9 production-preview browser checks passed");
