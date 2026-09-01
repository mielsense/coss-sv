import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);

async function availablePort() {
  const server = createServer();
  const port = await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") reject(new Error("could not allocate a port"));
      else resolve(address.port);
    });
  });
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

const port = await availablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const preview = spawn(
  process.execPath,
  [viteExecutable, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: appDirectory, env: process.env, stdio: "inherit" },
);

async function waitForPreview() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/preview/_health`)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("D7 preview did not become ready");
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { height: 844, width: 390 } });
await mockOpenAnalytics(page);
const diagnostics = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    diagnostics.push(`${message.type()}: ${message.text()}`);
});
page.on("pageerror", (error) => diagnostics.push(`pageerror: ${error.message}`));

async function openParticle(id) {
  await page.goto(`${baseUrl}/preview/${id}?theme=light&width=mobile&align=center&timers=real`);
  await page.locator('[data-preview-ready="true"]').waitFor();
}

async function expectTooltipFromFocus({ buttonName, particle, side, text }) {
  await page.setViewportSize({ height: 844, width: 390 });
  await openParticle(particle);
  const trigger = page.getByRole("button", { name: buttonName });
  await trigger.focus();
  const tooltip = page.getByRole("tooltip", { name: text });
  await tooltip.waitFor();

  assert.equal(await trigger.getAttribute("data-slot"), "tooltip-trigger");
  assert.equal(await page.locator('span[data-slot="tooltip-trigger"]').count(), 0);

  const positioner = page.locator('[data-slot="tooltip-positioner"]');
  const [triggerBox, tooltipBox, anchorSize] = await Promise.all([
    trigger.boundingBox(),
    tooltip.boundingBox(),
    positioner.evaluate((element) => ({
      height: Number.parseFloat(getComputedStyle(element).getPropertyValue("--anchor-height")),
      width: Number.parseFloat(getComputedStyle(element).getPropertyValue("--anchor-width")),
    })),
  ]);
  assert.ok(
    triggerBox && tooltipBox,
    `${particle} must expose measurable trigger and tooltip boxes`,
  );
  assert.ok(Math.abs(anchorSize.width - triggerBox.width) <= 1, `${particle} anchor width`);
  assert.ok(Math.abs(anchorSize.height - triggerBox.height) <= 1, `${particle} anchor height`);

  if (side === "right") {
    assert.ok(tooltipBox.x >= triggerBox.x + triggerBox.width, `${particle} right-side anchor`);
    assert.ok(
      Math.abs(tooltipBox.y + tooltipBox.height / 2 - (triggerBox.y + triggerBox.height / 2)) <= 2,
      `${particle} vertical anchor alignment`,
    );
  } else {
    assert.ok(
      tooltipBox.y + tooltipBox.height <= triggerBox.y,
      `${particle} top-side anchor: trigger=${JSON.stringify(triggerBox)} tooltip=${JSON.stringify(tooltipBox)}`,
    );
    assert.ok(
      Math.abs(tooltipBox.x + tooltipBox.width / 2 - (triggerBox.x + triggerBox.width / 2)) <= 2,
      `${particle} horizontal anchor alignment`,
    );
  }

  await page.keyboard.press("Escape");
  await tooltip.waitFor({ state: "hidden" });
}

try {
  await waitForPreview();

  await openParticle("p-dialog-1");
  const dialogTrigger = page.getByRole("button", { name: "Open Dialog" });
  await dialogTrigger.click();
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.getByRole("heading", { name: "Edit profile" }).isVisible(), true);
  assert.equal(await page.getByLabel("Name", { exact: true }).inputValue(), "Margaret Welsh");
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(await dialogTrigger.evaluate((element) => element === document.activeElement), true);

  await openParticle("p-alert-dialog-1");
  await page.getByRole("button", { name: "Delete Account" }).first().click();
  await page.getByRole("alertdialog").waitFor();
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.getByRole("alertdialog").waitFor({ state: "hidden" });

  await openParticle("p-popover-4");
  await page.getByRole("button", { name: "Choose occurrences to confirm" }).click();
  assert.equal(await page.getByText("3 pending for this booking").isVisible(), true);
  for (const checkbox of await page.getByRole("checkbox").all()) await checkbox.click();
  assert.equal(await page.getByRole("button", { name: "Reject selected" }).isDisabled(), true);
  assert.equal(await page.getByRole("button", { name: /Confirm selected/ }).isDisabled(), true);

  await openParticle("p-preview-card-1");
  await page.getByRole("button", { name: "coss.com/ui" }).hover();
  await page
    .getByText("Beautifully designed components that you can copy and paste into your apps.")
    .waitFor();

  await openParticle("p-tooltip-1");
  await page.getByRole("button", { name: "Hover me" }).focus();
  await page.getByRole("tooltip").waitFor();
  assert.equal((await page.getByRole("tooltip").textContent())?.trim(), "Helpful hint");

  await expectTooltipFromFocus({
    buttonName: "Toggle bold",
    particle: "p-tooltip-2",
    side: "top",
    text: "Bold",
  });
  await page.getByRole("button", { name: "Toggle bold" }).focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(
    await page
      .getByRole("button", { name: "Toggle italic" })
      .evaluate((element) => element === document.activeElement),
    true,
  );
  assert.equal(
    await page.getByRole("button", { name: "Toggle italic" }).getAttribute("tabindex"),
    "0",
  );
  await expectTooltipFromFocus({
    buttonName: "Toggle underline",
    particle: "p-tooltip-3",
    side: "top",
    text: "Underline text",
  });
  await expectTooltipFromFocus({
    buttonName: "Copy link",
    particle: "p-tooltip-4",
    side: "right",
    text: "Copy shareable link",
  });

  await openParticle("p-popover-3");
  await page.getByRole("button", { name: "Notifications" }).click();
  await page.getByText("You have no new notifications at this time.").waitFor();
  await page.getByRole("button", { name: "Profile" }).click();
  await page.getByText("Mark Andersson").waitFor();

  await openParticle("p-drawer-12");
  assert.equal(await page.getByRole("button", { name: "Open" }).count(), 1);
  await page.getByRole("button", { name: "Open" }).click();
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.getByText("Edit profile").first().isVisible(), true);
  await page.setViewportSize({ height: 900, width: 1280 });
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  assert.equal(await page.locator('[data-slot="drawer-popup"]').count(), 0);
  assert.equal(await page.getByRole("button", { name: "Open" }).count(), 1);
  await page.getByRole("button", { name: "Open" }).click();
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.locator('[data-slot="dialog-popup"]').count(), 1);
  await page.keyboard.press("Escape");

  await page.setViewportSize({ height: 844, width: 390 });
  await openParticle("p-drawer-13");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByText("Actions").waitFor();
  assert.equal(await page.getByText("Add to Playlist").isVisible(), true);
  await page.setViewportSize({ height: 900, width: 1280 });
  await page.locator('[data-slot="drawer-popup"]').waitFor({ state: "hidden" });
  assert.equal(await page.locator('[data-slot="drawer-popup"]').count(), 0);
  assert.equal(await page.getByRole("button", { name: "Open menu" }).count(), 1);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByText("Actions").waitFor();
  assert.equal(
    await page.getByRole("menuitemcheckbox", { name: "Enhanced Audio" }).isDisabled(),
    true,
  );
  await page.setViewportSize({ height: 844, width: 390 });
  await page.locator('[role="menu"]').waitFor({ state: "hidden" });
  assert.equal(await page.locator('[data-slot="menu-popup"]').count(), 0);
  assert.equal(await page.locator('[data-slot="drawer-popup"]').count(), 0);

  assert.deepEqual(diagnostics, []);
} finally {
  await browser.close();
  preview.kill("SIGTERM");
}
