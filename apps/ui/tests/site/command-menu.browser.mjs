import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.COSS_TEST_BASE_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

async function thumbnailStyles() {
  return page.evaluate(() => {
    const accordion = document.querySelector('[data-category="accordion"]');
    const button = document.querySelector('[data-category="button"]');
    const contextMenu = document.querySelector('[data-category="context-menu"]');
    const bars = [...(accordion?.querySelectorAll(".h-1\\.5") ?? [])];
    const mainBar = bars.find((element) => element.className.includes("/40"));
    const secondaryBar = bars.find((element) => element.className.includes("/20"));
    const primary = [...(button?.querySelectorAll("div") ?? [])].find((element) =>
      element.className.includes("from-(--btn-from)"),
    );

    return {
      main40: mainBar ? getComputedStyle(mainBar).backgroundColor : "",
      secondary20: secondaryBar ? getComputedStyle(secondaryBar).backgroundColor : "",
      primaryGradient: primary ? getComputedStyle(primary).backgroundImage : "",
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
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Search documentation" });
  const input = page.getByRole("combobox", { name: "Search documentation" });
  await dialog.waitFor({ state: "visible" });
  await page.waitForTimeout(250);
  assert.equal(await trigger.getAttribute("aria-expanded"), "true");
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

  await input.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  assert.equal(await trigger.getAttribute("aria-expanded"), "false");
  assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);

  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
  await dialog.waitFor({ state: "visible" });
  assert.equal(await input.evaluate((element) => element === document.activeElement), true);

  await input.fill("Introduction");
  await input.press("Enter");
  await page.waitForURL(/\/docs\/introduction$/);
  assert.equal(new URL(page.url()).pathname, "/docs/introduction");

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(baseUrl);
  const mobileTrigger = page.locator(".search-trigger");
  await mobileTrigger.waitFor({ state: "attached" });
  await page.waitForTimeout(250);
  await page.keyboard.press(process.platform === "darwin" ? "Meta+K" : "Control+K");
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
}
