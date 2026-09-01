import assert from "node:assert/strict";
import { spawn } from "node:child_process";
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
await mockOpenAnalytics(context);
const page = await context.newPage();
const runtimeQuery = "theme=light&width=desktop&timers=real";
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

async function openParticle(id) {
  const response = await page.goto(`${baseUrl}/preview/${id}?${runtimeQuery}`);
  assert.equal(response?.status(), 200, `${id} preview should load`);
  await page.locator("[data-preview-ready='true']").waitFor();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(50);
  assert.equal(
    await page.locator("[data-preview-found='true']").getAttribute("data-preview-kind"),
    "particle",
    `${id} should resolve to its production particle module`,
  );
}

const allParticles = [
  ...Array.from({ length: 16 }, (_, index) => `p-autocomplete-${index + 1}`),
  ...Array.from({ length: 20 }, (_, index) => `p-combobox-${index + 1}`),
  ...Array.from({ length: 23 }, (_, index) => `p-select-${index + 1}`),
  ...Array.from({ length: 2 }, (_, index) => `p-command-${index + 1}`),
  ...Array.from({ length: 9 }, (_, index) => `p-menu-${index + 1}`),
  ...Array.from({ length: 8 }, (_, index) => `p-context-menu-${index + 1}`),
  "p-toolbar-1",
];

try {
  for (const id of allParticles) await openParticle(id);

  await openParticle("p-autocomplete-1");
  const autocomplete = page.getByRole("combobox", { name: "Search items" });
  await autocomplete.fill("gra");
  await page.getByRole("option", { name: "Grape" }).waitFor();
  await autocomplete.press("ArrowDown");
  await autocomplete.press("Enter");
  assert.equal(await autocomplete.inputValue(), "Grape");
  const autocompleteWidth = await page.locator('[data-slot="preview"]').boundingBox();
  assert.ok(autocompleteWidth);
  assert.ok(
    Math.abs(autocompleteWidth.width - 256) <= 0.5,
    `autocomplete preview should preserve max-w-64, received ${autocompleteWidth.width}px`,
  );

  await openParticle("p-autocomplete-12");
  const asyncAutocomplete = page.getByRole("combobox");
  await asyncAutocomplete.fill("will_error");
  await page.getByText("Failed to fetch movies. Please try again.", { exact: true }).waitFor();

  await openParticle("p-combobox-9");
  const combobox = page.getByRole("combobox", { name: "Select a item" });
  await combobox.click();
  const apple = page.getByRole("option", { name: "Apple", exact: true });
  assert.equal(await apple.getAttribute("aria-selected"), "true");
  await apple.click();
  assert.equal(await apple.getAttribute("aria-selected"), "false");
  assert.equal(await page.locator('[data-slot="combobox-chip"]').count(), 1);
  await apple.click();
  assert.equal(await apple.getAttribute("aria-selected"), "true");
  await combobox.fill("banana");
  await page.getByRole("option", { name: "Banana" }).click();
  const bananaChip = page.locator('[data-slot="combobox-chip"]').filter({ hasText: "Banana" });
  await bananaChip.waitFor();
  await bananaChip.locator('[data-slot="combobox-chip-remove"]').click();
  assert.equal(await page.locator('[data-slot="combobox-chip"]').count(), 2);

  await openParticle("p-select-7");
  const languageSelect = page.getByRole("combobox", { name: "Select languages" });
  await languageSelect.focus();
  await languageSelect.press("Enter");
  await page.getByRole("option", { name: "Python" }).waitFor();
  await page.keyboard.press("End");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Space");
  await page.keyboard.press("Escape");
  assert.equal(
    await languageSelect.evaluate((element) => element === document.activeElement),
    true,
  );

  await openParticle("p-command-1");
  await page.keyboard.press("Control+j");
  const commandDialog = page.getByRole("dialog");
  await commandDialog.waitFor();
  const commandInput = page.getByPlaceholder("Search for apps and commands...");
  await commandInput.fill("Linear");
  await page.getByRole("option", { name: /Linear/ }).click();
  await commandDialog.waitFor({ state: "detached" });

  await openParticle("p-menu-1");
  const menuTrigger = page.getByRole("button", { name: "Open menu" });
  await menuTrigger.click();
  const shuffle = page.getByRole("menuitemcheckbox", { name: "Shuffle" });
  await shuffle.click();
  assert.equal(await shuffle.getAttribute("aria-checked"), "true");
  const playlist = page.getByRole("menuitem", { name: "Add to Playlist" });
  await playlist.focus();
  await playlist.press("ArrowRight");
  await page.getByRole("menuitem", { name: "Jazz" }).waitFor();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  assert.equal(await menuTrigger.evaluate((element) => element === document.activeElement), true);

  await openParticle("p-context-menu-1");
  const contextRegion = page.getByText("Right click here", { exact: true });
  const contextRegionBox = await contextRegion.boundingBox();
  assert.ok(contextRegionBox, "context menu trigger should have measurable geometry");
  const contextPoint = {
    x: contextRegionBox.x + contextRegionBox.width / 2,
    y: contextRegionBox.y + contextRegionBox.height / 2,
  };
  await page.mouse.click(contextPoint.x, contextPoint.y, { button: "right" });
  const backItem = page.getByRole("menuitem", { name: "Back" });
  await backItem.waitFor();
  const contextPopup = await page.locator('[data-slot="context-menu-popup"]').boundingBox();
  assert.ok(contextPopup, "context menu popup should have measurable geometry");
  assert.ok(
    Math.abs(contextPopup.x + contextPopup.width / 2 - contextPoint.x) <= 2 &&
      Math.abs(contextPopup.y - contextPoint.y - 4) <= 2,
    `context popup should originate at the pointer (${contextPopup.x}, ${contextPopup.y})`,
  );
  await page.keyboard.press("Escape");
  await backItem.waitFor({ state: "detached" });

  await openParticle("p-toolbar-1");
  const alignLeft = page.getByRole("button", { name: "Align left" });
  await alignLeft.focus();
  await alignLeft.press("ArrowRight");
  assert.equal(
    await page
      .getByRole("button", { name: "Toggle center" })
      .evaluate((element) => element === document.activeElement),
    true,
  );
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page
      .getByRole("button", { name: "Toggle right" })
      .evaluate((element) => element === document.activeElement),
    true,
  );

  assert.deepEqual(
    consoleErrors,
    [],
    `production previews emitted errors: ${consoleErrors.join("\n")}`,
  );
} finally {
  await context.close();
  await browser.close();
  preview?.kill("SIGTERM");
}

console.log("D8 selection and menu production-preview browser checks passed");
