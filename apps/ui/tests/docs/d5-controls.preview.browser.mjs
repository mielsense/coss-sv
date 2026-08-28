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
const previewQuery = "theme=light&width=desktop&timers=real";

async function openParticle(id) {
  const response = await page.goto(`${baseUrl}/preview/${id}?${previewQuery}`);
  assert.equal(response?.status(), 200, `${id} preview should load`);
  await page.locator("[data-preview-ready='true']").waitFor();
}

async function assertPreviewWidth(id, expectedWidth) {
  await openParticle(id);
  const box = await page.locator('[data-slot="preview"]').boundingBox();
  assert.ok(box, `${id} preview should have measurable geometry`);
  assert.ok(
    Math.abs(box.width - expectedWidth) <= 0.5,
    `${id} preview width should be ${expectedWidth}px, received ${box.width}px`,
  );
}

async function assertAvailabilityGeometry({ contentHeight, surfaceHeight, triggerHeight }) {
  const trigger = page.getByRole("combobox", { name: "Monday start time" });
  const [triggerBox, surfaceBox, contentBox] = await Promise.all([
    trigger.boundingBox(),
    page.locator(".preview-surface").boundingBox(),
    page.locator('[data-slot="preview"]').boundingBox(),
  ]);
  assert.ok(triggerBox && surfaceBox && contentBox, "p-switch-7 geometry should be measurable");
  assert.ok(
    Math.abs(triggerBox.width - 108) <= 0.5,
    `p-switch-7 trigger width should be 108px, received ${triggerBox.width}px`,
  );
  assert.ok(
    Math.abs(triggerBox.height - triggerHeight) <= 0.5,
    `p-switch-7 trigger height should be ${triggerHeight}px, received ${triggerBox.height}px`,
  );
  assert.ok(
    Math.abs(surfaceBox.height - surfaceHeight) <= 0.5,
    `p-switch-7 preview surface height should be ${surfaceHeight}px, received ${surfaceBox.height}px`,
  );
  assert.ok(
    Math.abs(contentBox.height - contentHeight) <= 0.5,
    `p-switch-7 content height should be ${contentHeight}px, received ${contentBox.height}px`,
  );
}

try {
  await openParticle("p-toggle-8");
  const bookmark = page.getByRole("button", { name: "Bookmark this" });
  await bookmark.hover();
  assert.equal(await page.locator('[role="tooltip"]').count(), 0, "hover should honor the delay");
  await page.waitForTimeout(650);
  await page.getByRole("tooltip", { name: "Bookmark this" }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("tooltip", { name: "Bookmark this" }).waitFor({ state: "detached" });
  await bookmark.focus();
  const bookmarkTooltip = page.getByRole("tooltip", { name: "Bookmark this" });
  await bookmarkTooltip.waitFor();
  const bookmarkTrigger = bookmark.locator("xpath=..");
  assert.equal(await bookmarkTrigger.getAttribute("data-slot"), "tooltip-trigger");
  assert.notEqual(await bookmarkTrigger.getAttribute("data-popup-open"), null);
  const geometry = await Promise.all([
    bookmark.boundingBox(),
    bookmarkTooltip.locator("xpath=..").boundingBox(),
  ]);
  assert.ok(geometry[0] && geometry[1]);
  assert.ok(
    Math.abs(geometry[1].x + geometry[1].width / 2 - (geometry[0].x + geometry[0].width / 2)) <= 1,
    "tooltip should stay centered on the visible toggle",
  );
  await bookmark.press("Space");
  assert.equal(
    await page.getByRole("button", { name: "Remove bookmark" }).getAttribute("aria-pressed"),
    "true",
  );

  await openParticle("p-toggle-group-9");
  const bold = page.getByRole("button", { name: "Toggle bold" });
  await bold.hover();
  assert.equal(
    await page.locator('[role="tooltip"]').count(),
    0,
    "group hover should honor the delay",
  );
  await page.waitForTimeout(650);
  await page.getByRole("tooltip", { name: "Bold" }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("tooltip", { name: "Bold" }).waitFor({ state: "detached" });
  await bold.focus();
  await page.getByRole("tooltip", { name: "Bold" }).waitFor();
  const boldTrigger = bold.locator("xpath=..");
  assert.equal(await boldTrigger.getAttribute("data-slot"), "tooltip-trigger");
  assert.notEqual(await boldTrigger.getAttribute("data-popup-open"), null);
  await bold.press("Space");
  assert.equal(await bold.getAttribute("aria-pressed"), "false");

  for (const id of ["p-switch-7", "p-switch-8", "p-switch-9"]) {
    await openParticle(id);
    const availabilitySwitch = page.getByRole("switch").first();
    await availabilitySwitch.evaluate((element) => {
      element.dataset.d5FocusProbe = "original";
    });
    await availabilitySwitch.focus();
    await availabilitySwitch.press("Space");
    assert.equal(
      await availabilitySwitch.evaluate(
        (element) =>
          element === document.activeElement && element.dataset.d5FocusProbe === "original",
      ),
      true,
      `${id} should not remount the focused switch`,
    );
  }

  await assertPreviewWidth("p-radio-group-6", 320);
  for (const id of [
    "p-slider-13",
    "p-slider-14",
    "p-slider-15",
    "p-slider-16",
    "p-slider-21",
    "p-slider-22",
    "p-slider-23",
  ]) {
    await assertPreviewWidth(id, 256);
  }
  for (const id of ["p-switch-7", "p-switch-8", "p-switch-9"]) {
    await assertPreviewWidth(id, 896);
  }

  await openParticle("p-switch-7");
  await assertAvailabilityGeometry({ contentHeight: 382, surfaceHeight: 540, triggerHeight: 28 });

  await page.setViewportSize({ height: 900, width: 500 });
  await assertPreviewWidth("p-switch-7", 452);
  await assertAvailabilityGeometry({ contentHeight: 750, surfaceHeight: 750, triggerHeight: 32 });
  await page.setViewportSize({ height: 900, width: 1440 });

  await openParticle("p-radio-group-6");
  const system = page.getByRole("radio", { name: "System", exact: true });
  const light = page.getByRole("radio", { name: "Light", exact: true });
  const dark = page.getByRole("radio", { name: "Dark", exact: true });
  assert.equal(await system.isChecked(), true);
  const themeGeometry = await light.evaluate((element) => {
    const card = element.nextElementSibling?.nextElementSibling;
    const panel = card?.firstElementChild;
    if (!(card instanceof HTMLElement) || !(panel instanceof HTMLElement)) return null;
    const cardBox = card.getBoundingClientRect();
    const panelBox = panel.getBoundingClientRect();
    return {
      cardHeight: cardBox.height,
      cardWidth: cardBox.width,
      panelHeight: panelBox.height,
      panelLeft: panelBox.x - cardBox.x,
      panelTop: panelBox.y - cardBox.y,
      panelWidth: panelBox.width,
    };
  });
  assert.deepEqual(themeGeometry, {
    cardHeight: 70,
    cardWidth: 88,
    panelHeight: 62,
    panelLeft: 10,
    panelTop: 8,
    panelWidth: 78,
  });
  await light.locator("xpath=following-sibling::span[1]").click();
  assert.equal(await light.isChecked(), true);
  await page.getByText("Dark", { exact: true }).click();
  assert.equal(await dark.isChecked(), true);
  await system.focus();
  await system.press("ArrowRight");
  assert.equal(await light.isChecked(), true);
  assert.equal(await light.evaluate((element) => element === document.activeElement), true);

  const forms = [
    ["p-checkbox-5", "Terms: yes"],
    ["p-checkbox-group-5", "Selected: next"],
    ["p-radio-group-5", "Selected: next"],
    ["p-slider-23", "Volume: 25, 75"],
    ["p-switch-5", "Marketing emails: on"],
  ];
  for (const [id, expectedMessage] of forms) {
    await openParticle(id);
    const urlBeforeSubmit = page.url();
    const submit = page.getByRole("button", { name: "Submit" });
    const dialogPromise = page.waitForEvent("dialog", { timeout: 2500 });
    await submit.click();
    assert.notEqual(
      await submit.getAttribute("data-loading"),
      null,
      `${id} should enter loading state`,
    );
    const dialog = await dialogPromise;
    assert.equal(dialog.message(), expectedMessage);
    await dialog.accept();
    assert.equal(
      page.url(),
      urlBeforeSubmit,
      `${id} submit should not navigate or change the query`,
    );
  }
} finally {
  await context.close();
  await browser.close();
  preview?.kill("SIGTERM");
}

console.log("D5 controls production-preview browser checks passed");
