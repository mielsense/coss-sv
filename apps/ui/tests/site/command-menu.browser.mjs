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

async function findAvailablePreviewPort() {
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
  const port = await findAvailablePreviewPort();
  baseUrl = `http://127.0.0.1:${port}`;
  preview = spawn(
    process.execPath,
    [viteExecutable, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: appDirectory,
      env: process.env,
      stdio: "inherit",
    },
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
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
  viewport: { width: 1280, height: 720 },
});
const page = await context.newPage();

async function thumbnailStyles() {
  return page.evaluate(() => {
    const accordion = document.querySelector('[data-category="accordion"]');
    const alertDialog = document.querySelector('[data-category="alert-dialog"]');
    const button = document.querySelector('[data-category="button"]');
    const calendar = document.querySelector('[data-category="calendar"]');
    const contextMenu = document.querySelector('[data-category="context-menu"]');
    const bars = [...(accordion?.querySelectorAll(".h-1\\.5") ?? [])];
    const mainBar = bars.find((element) => element.className.includes("/40"));
    const secondaryBar = bars.find((element) => element.className.includes("/20"));
    const primary = [...(button?.querySelectorAll("div") ?? [])].find((element) =>
      element.className.includes("from-(--btn-from)"),
    );
    const alertPrimary = [...(alertDialog?.querySelectorAll("div") ?? [])].find((element) =>
      element.className.includes("from-(--btn-from)"),
    );
    const selectedDate = calendar?.querySelector(".bg-primary");
    const blankDates = [...(calendar?.querySelectorAll(".bg-transparent") ?? [])];

    return {
      main40: mainBar ? getComputedStyle(mainBar).backgroundColor : "",
      secondary20: secondaryBar ? getComputedStyle(secondaryBar).backgroundColor : "",
      primaryGradient: primary ? getComputedStyle(primary).backgroundImage : "",
      alertPrimaryGradient: alertPrimary ? getComputedStyle(alertPrimary).backgroundImage : "",
      calendarPrimary: selectedDate ? getComputedStyle(selectedDate).backgroundColor : "",
      calendarBlankCount: blankDates.length,
      cardSurface: accordion?.querySelector(".relative.flex.w-full")
        ? getComputedStyle(accordion.querySelector(".relative.flex.w-full")).backgroundImage
        : "",
      inputBorder: contextMenu?.querySelector(".border-input")
        ? getComputedStyle(contextMenu.querySelector(".border-input")).borderColor
        : "",
    };
  });
}

function assertOpaqueThumbnailTokens(styles, mode) {
  assert.match(styles.main40, /\/ 0\.4\)/, `${mode} 40% text token renders at 40% alpha`);
  assert.match(styles.secondary20, /\/ 0\.2\)/, `${mode} 20% text token renders at 20% alpha`);
  assert.match(styles.primaryGradient, /linear-gradient/, `${mode} primary gradient renders`);
  assert.match(
    styles.alertPrimaryGradient,
    /linear-gradient/,
    `${mode} Alert Dialog primary gradient renders`,
  );
  const primaryChannel = mode === "light" ? /(?:38|0\.149)/ : /(?:245|0\.961)/;
  assert.match(styles.primaryGradient, primaryChannel, `${mode} Button keeps the COSS primary`);
  assert.match(
    styles.alertPrimaryGradient,
    primaryChannel,
    `${mode} Alert Dialog keeps the COSS primary`,
  );
  assert.match(styles.calendarPrimary, primaryChannel, `${mode} Calendar keeps the COSS primary`);
  assert.equal(styles.calendarBlankCount, 5, `${mode} Calendar preserves its five blank cells`);
  assert.match(styles.cardSurface, /linear-gradient/, `${mode} card surface renders`);
  assert.ok(
    styles.inputBorder && !styles.inputBorder.includes("0)"),
    `${mode} input border token renders`,
  );
}

async function commandDialogMetrics(dialog) {
  return dialog.evaluate((element) => {
    const results = element.querySelector(".command-results");
    const input = element.querySelector("input");
    const label = element.querySelector('[role="group"] > div:first-child');
    const option = element.querySelector('[role="option"]');
    const popupStyle = getComputedStyle(element);
    const popupRect = element.getBoundingClientRect();
    const resultsRect = results?.getBoundingClientRect();
    const metricsFor = (target) => {
      if (!(target instanceof HTMLElement)) return null;
      const rect = target.getBoundingClientRect();
      const style = getComputedStyle(target);
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
        background: style.backgroundColor,
      };
    };

    return {
      popup: {
        x: popupRect.x,
        y: popupRect.y,
        width: popupRect.width,
        height: popupRect.height,
      },
      results: resultsRect
        ? {
            x: resultsRect.x,
            y: resultsRect.y,
            width: resultsRect.width,
            height: resultsRect.height,
          }
        : null,
      input: metricsFor(input),
      label: metricsFor(label),
      option: metricsFor(option),
      background: popupStyle.backgroundColor,
      borderColor: popupStyle.borderColor,
      borderWidth: popupStyle.borderWidth,
      borderRadius: popupStyle.borderRadius,
      boxShadow: popupStyle.boxShadow,
      overflow: popupStyle.overflow,
    };
  });
}

function assertNear(actual, expected, message, tolerance = 0.75) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message}: expected ${expected}px, received ${actual}px`,
  );
}

try {
  await page.goto(baseUrl);

  const themeToggle = page.getByRole("button", { name: "Toggle theme" });
  const root = page.locator("html");
  if (!(await root.evaluate((element) => element.classList.contains("light")))) {
    await themeToggle.click();
    await page.locator("html.light").waitFor();
  }
  assertOpaqueThumbnailTokens(await thumbnailStyles(), "light");
  await themeToggle.click();
  await page.locator("html.dark").waitFor();
  assertOpaqueThumbnailTokens(await thumbnailStyles(), "dark");

  const trigger = page.locator(".search-trigger");
  const dialog = page.getByRole("dialog", { name: "Search documentation" });
  const input = page.getByRole("combobox", { name: "Search documentation" });
  const shortcut = process.platform === "darwin" ? "Meta+K" : "Control+K";
  const editableTargets = await page.evaluate(() => {
    const kinds = ["input", "textarea", "select", "contenteditable"];
    for (const kind of kinds) {
      const element =
        kind === "contenteditable" ? document.createElement("div") : document.createElement(kind);
      element.dataset.shortcutGuard = kind;
      if (element instanceof HTMLSelectElement) {
        element.append(new Option("Shortcut guard"));
      }
      if (kind === "contenteditable") {
        element.contentEditable = "true";
        element.tabIndex = 0;
      }
      document.body.append(element);
    }
    return kinds;
  });

  for (const kind of editableTargets) {
    const editable = page.locator(`[data-shortcut-guard="${kind}"]`);
    for (const key of ["/", shortcut]) {
      await editable.focus();
      await page.keyboard.press(key);
      assert.equal(await dialog.count(), 0, `${key} is ignored from ${kind}`);
      assert.equal(await trigger.getAttribute("aria-expanded"), "false");
      assert.equal(
        await editable.evaluate((element) => element === document.activeElement),
        true,
        `${key} preserves ${kind} focus`,
      );
    }
  }
  await page.locator("[data-shortcut-guard]").evaluateAll((elements) => {
    for (const element of elements) element.remove();
  });

  await trigger.click();
  await dialog.waitFor({ state: "visible" });
  await page.waitForTimeout(250);
  assert.equal(await trigger.getAttribute("aria-expanded"), "true");
  assert.equal(await input.evaluate((element) => element === document.activeElement), true);

  const focusedInputValue = await input.inputValue();
  await page.keyboard.press(shortcut);
  assert.equal(await dialog.isVisible(), true, "the shortcut does not close an input-owned dialog");
  assert.equal(await trigger.getAttribute("aria-expanded"), "true");
  assert.equal(await input.inputValue(), focusedInputValue);
  assert.equal(await input.evaluate((element) => element === document.activeElement), true);

  const desktopMetrics = await commandDialogMetrics(dialog);
  assertNear(desktopMetrics.popup.x, 352, "desktop popup x");
  assertNear(desktopMetrics.popup.y, 72, "desktop popup y");
  assertNear(desktopMetrics.popup.width, 576, "desktop popup width");
  assertNear(desktopMetrics.popup.height, 420, "desktop popup height");
  assert.ok(
    desktopMetrics.results && desktopMetrics.input && desktopMetrics.label && desktopMetrics.option,
  );
  assertNear(desktopMetrics.results.y, 121, "desktop result panel y");
  assertNear(desktopMetrics.results.height, 325, "desktop result panel height");
  assertNear(desktopMetrics.input.x, 364, "desktop input x");
  assertNear(desktopMetrics.input.y, 80, "desktop input y");
  assertNear(desktopMetrics.input.width, 552, "desktop input width");
  assertNear(desktopMetrics.input.height, 34, "desktop input height");
  assert.equal(desktopMetrics.input.fontSize, "14px");
  assert.equal(desktopMetrics.input.padding, "0px 11px 0px 31px");
  assertNear(desktopMetrics.label.x, 361, "desktop group label x");
  assertNear(desktopMetrics.label.y, 130, "desktop group label y");
  assertNear(desktopMetrics.label.width, 554, "desktop group label width");
  assertNear(desktopMetrics.label.height, 28, "desktop group label height");
  assert.equal(desktopMetrics.label.lineHeight, "16px");
  assert.equal(desktopMetrics.label.padding, "6px 8px 6px 8px");
  assertNear(desktopMetrics.option.x, 361, "desktop option x");
  assertNear(desktopMetrics.option.y, 158, "desktop option y");
  assertNear(desktopMetrics.option.width, 554, "desktop option width");
  assertNear(desktopMetrics.option.height, 32, "desktop option height");
  assert.equal(desktopMetrics.option.fontSize, "14px");
  assert.equal(desktopMetrics.option.lineHeight, "20px");
  assert.equal(desktopMetrics.option.padding, "6px 8px 6px 8px");
  assert.ok(!desktopMetrics.option.background.includes("0)"), "active option has a 4% fill");
  assert.match(desktopMetrics.background, /(?:29|0\.114689)/, "dark popover is opaque");
  assert.equal(desktopMetrics.borderWidth, "1px");
  assert.ok(!desktopMetrics.borderColor.includes("0)"), "dialog border is visible");
  assert.equal(desktopMetrics.borderRadius, "16px");
  assert.match(desktopMetrics.boxShadow, /10px 15px -3px/);
  assert.match(desktopMetrics.boxShadow, /4px 6px -4px/);
  assert.equal(desktopMetrics.overflow, "hidden");

  const firstId = await input.getAttribute("aria-activedescendant");
  assert.ok(firstId, "the command menu auto-highlights its first option");

  await input.press("ArrowDown");
  const secondId = await input.getAttribute("aria-activedescendant");
  assert.notEqual(secondId, firstId, "ArrowDown advances the active option");

  await input.press("End");
  const lastId = await input.getAttribute("aria-activedescendant");
  assert.notEqual(lastId, secondId, "End moves to the final option");

  await input.press("Home");
  assert.equal(
    await input.getAttribute("aria-activedescendant"),
    firstId,
    "Home returns to the first option",
  );

  await input.fill("Separator");
  await dialog.getByRole("option", { name: "Separator", exact: true }).waitFor();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+C" : "Control+C");
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    "pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/separator.json",
    "the copied component command uses the public URL contract",
  );

  await input.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(await trigger.getAttribute("aria-expanded"), "false");
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);

  await page.keyboard.press(shortcut);
  await dialog.waitFor({ state: "visible" });
  assert.equal(await input.evaluate((element) => element === document.activeElement), true);

  await input.fill("Introduction");
  await input.press("Enter");
  await page.waitForURL(/\/docs$/);
  assert.equal(new URL(page.url()).pathname, "/docs");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(baseUrl);

  const menuTrigger = page.locator(".mobile-menu-trigger");
  await menuTrigger.click();
  const menuDialog = page.getByRole("dialog", { name: "Menu" });
  const closeMenu = page.getByRole("button", { name: "Close Menu" });
  await menuDialog.waitFor({ state: "visible" });
  await page.waitForTimeout(500);

  const menuMetrics = await menuDialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const close = element.querySelector('[aria-label="Close Menu"]');
    const closeRect = close?.getBoundingClientRect();
    const panel = element.querySelector(".mobile-menu-panel");
    const panelStyle = panel ? getComputedStyle(panel) : null;
    return {
      popup: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      close: closeRect
        ? { x: closeRect.x, y: closeRect.y, width: closeRect.width, height: closeRect.height }
        : null,
      panel: panel
        ? {
            clientHeight: panel.clientHeight,
            scrollHeight: panel.scrollHeight,
            touchAction: panelStyle?.touchAction,
            outline: getComputedStyle(panel).outlineStyle,
          }
        : null,
      bodyOverflow: getComputedStyle(document.body).overflow,
      rootOverflow: getComputedStyle(document.documentElement).overflow,
    };
  });
  assertNear(menuMetrics.popup.x, 0, "mobile menu x");
  assertNear(menuMetrics.popup.y, 0, "mobile menu y");
  assertNear(menuMetrics.popup.width, 327, "mobile menu width");
  assertNear(menuMetrics.popup.height, 812, "mobile menu height");
  assert.ok(menuMetrics.close && menuMetrics.panel);
  assertNear(menuMetrics.close.x, 282, "mobile menu close x");
  assertNear(menuMetrics.close.y, 8, "mobile menu close y");
  assertNear(menuMetrics.close.width, 36, "mobile menu close width");
  assertNear(menuMetrics.close.height, 36, "mobile menu close height");
  assert.equal(menuMetrics.panel.touchAction, "pan-y");
  assert.equal(menuMetrics.panel.outline, "none");
  assert.ok(
    menuMetrics.panel.scrollHeight > menuMetrics.panel.clientHeight,
    "mobile menu can scroll",
  );
  assert.equal(await menuDialog.getByRole("link", { name: "OTP Field", exact: true }).count(), 1);
  assert.equal(await menuDialog.getByRole("link", { name: "Otp Field", exact: true }).count(), 0);
  assert.ok(
    [menuMetrics.bodyOverflow, menuMetrics.rootOverflow].some((value) =>
      ["hidden", "clip"].includes(value),
    ),
    "opening the Drawer locks page scrolling",
  );
  assert.equal(await menuTrigger.getAttribute("aria-expanded"), "true");
  assert.equal(
    await menuDialog.evaluate((element) => element.contains(document.activeElement)),
    true,
    "focus moves inside the Drawer",
  );
  for (let index = 0; index < 70; index += 1) await page.keyboard.press("Tab");
  assert.equal(
    await menuDialog.evaluate((element) => element.contains(document.activeElement)),
    true,
    "Tab focus stays trapped inside the Drawer",
  );
  await page.keyboard.press("Escape");
  await menuDialog.waitFor({ state: "hidden" });
  assert.equal(await menuTrigger.evaluate((element) => element === document.activeElement), true);
  assert.equal(await menuTrigger.getAttribute("aria-expanded"), "false");

  await menuTrigger.click();
  await menuDialog.waitFor({ state: "visible" });
  await page.waitForTimeout(500);
  await menuDialog.locator(".mobile-menu-panel").evaluate((element) => {
    element.scrollTop = 100;
  });
  assert.ok(
    (await menuDialog.locator(".mobile-menu-panel").evaluate((element) => element.scrollTop)) > 0,
    "the Drawer content remains vertically scrollable",
  );

  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 250, y: 400 }],
  });
  for (const x of [190, 130, 70, 20]) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: 400 }],
    });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await menuDialog.waitFor({ state: "hidden" });
  assert.equal(await menuTrigger.evaluate((element) => element === document.activeElement), true);

  await menuTrigger.click();
  await menuDialog.waitFor({ state: "visible" });
  await closeMenu.click();
  await menuDialog.waitFor({ state: "hidden" });
  assert.equal(await menuTrigger.evaluate((element) => element === document.activeElement), true);

  const mobileFooter = page.locator(".site-footer");
  await mobileFooter.scrollIntoViewIfNeeded();
  const footerBox = await mobileFooter.boundingBox();
  assert.ok(footerBox);
  assertNear(footerBox.height, 96, "mobile footer height");
  const footerContentBox = await page.locator(".footer-inner").boundingBox();
  assert.ok(footerContentBox);
  assertNear(footerContentBox.height, 48, "mobile footer content height");

  const mobileTrigger = page.locator(".search-trigger");
  await mobileTrigger.waitFor({ state: "attached" });
  await page.waitForTimeout(250);
  await page.keyboard.press(shortcut);
  const mobileDialog = page.getByRole("dialog", { name: "Search documentation" });
  await mobileDialog.waitFor({ state: "visible" });
  await page.waitForTimeout(250);
  const mobileMetrics = await commandDialogMetrics(mobileDialog);
  assertNear(mobileMetrics.popup.x, 16, "mobile popup x");
  assertNear(mobileMetrics.popup.y, 32.5, "mobile popup y", 1);
  assertNear(mobileMetrics.popup.width, 343, "mobile popup width");
  assertNear(mobileMetrics.popup.height, 420, "mobile popup height");
  assert.equal(await mobileTrigger.getAttribute("aria-expanded"), "true");
} finally {
  await browser.close();
  preview?.kill("SIGTERM");
}
