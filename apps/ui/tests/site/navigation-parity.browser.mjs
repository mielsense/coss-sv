import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

const baseUrl = process.env.COSS_TEST_BASE_URL;
assert.ok(baseUrl, "set COSS_TEST_BASE_URL to the app server");
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  await mockOpenAnalytics(context);
  const page = await context.newPage();
  await page.goto(`${baseUrl}/docs/components/button`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (const dark of [false, true]) {
    await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
    await page.waitForTimeout(200);
    const colors = await page.evaluate(() => {
      const link = document.querySelector('[data-docs-sidebar] a[href="/docs"]');
      const active = document.querySelector('[data-docs-sidebar] a[aria-current="page"]');
      const toc = document.querySelector("[data-docs-toc] a:not([aria-current])");
      const probe = document.createElement("span");
      link.append(probe);
      probe.style.color = "var(--sidebar-foreground)";
      probe.style.backgroundColor = "var(--sidebar-accent)";
      const result = {
        link: getComputedStyle(link).color,
        toc: getComputedStyle(toc).color,
        expected: getComputedStyle(probe).color,
        activeWeight: getComputedStyle(active).fontWeight,
        activeBackground: getComputedStyle(active).backgroundColor,
        expectedBackground: getComputedStyle(probe).backgroundColor,
      };
      probe.remove();
      return result;
    });
    assert.equal(colors.link, colors.expected);
    assert.equal(colors.toc, colors.expected);
    assert.equal(colors.activeWeight, "500");
    assert.equal(colors.activeBackground, colors.expectedBackground);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("[data-mobile-menu-trigger]").click();
  const menu = page.getByRole("dialog", { name: "Menu", exact: true });
  await menu.waitFor();
  await page.waitForTimeout(500);
  const mobile = await menu.evaluate((el) => {
    const nav = el.querySelector("nav");
    const links = [...nav.querySelectorAll("a")];
    const link = (href) => links.find((a) => a.getAttribute("href") === href);
    return {
      icon: document.querySelector("[data-mobile-menu-trigger] svg").getBoundingClientRect().width,
      headingWeight: getComputedStyle(nav.querySelector("h2")).fontWeight,
      home: link("/").getBoundingClientRect().top,
      docs: link("/docs").getBoundingClientRect().top,
      particles: link("/particles").getBoundingClientRect().top,
      introduction: links
        .filter((a) => a.getAttribute("href") === "/docs")[1]
        .getBoundingClientRect().top,
      wrappedHeight: link("/docs/radix-migration").getBoundingClientRect().height,
    };
  });
  assert.deepEqual(mobile, {
    icon: 20,
    headingWeight: "500",
    home: 64,
    docs: 104,
    particles: 144,
    introduction: 260,
    wrappedHeight: 60,
  });
  await page.keyboard.press("Escape");
  await menu.waitFor({ state: "hidden" });
  assert.equal(
    await page
      .locator("[data-mobile-menu-trigger]")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await context.close();

  const storageContext = await browser.newContext();
  await mockOpenAnalytics(storageContext);
  await storageContext.addInitScript(() => {
    const setItem = Storage.prototype.setItem;
    const getItem = Storage.prototype.getItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "coss-sv-theme" || key === "coss-package-manager")
        throw new DOMException("blocked", "SecurityError");
      return setItem.call(this, key, value);
    };
    Storage.prototype.getItem = function (key) {
      if (key === "coss-package-manager") throw new DOMException("blocked", "SecurityError");
      return getItem.call(this, key);
    };
    window.themeEvents = 0;
    document.addEventListener("coss-sv:themechange", () => window.themeEvents++);
  });
  const stored = await storageContext.newPage();
  const storageErrors = [];
  stored.on("pageerror", (error) => storageErrors.push(error.message));
  await stored.goto(baseUrl, { waitUntil: "networkidle" });
  await stored.getByRole("button", { name: "Toggle theme" }).click();
  assert.equal(await stored.evaluate(() => window.themeEvents), 1);
  await stored.goto(`${baseUrl}/particles?tags=button`, { waitUntil: "networkidle" });
  await stored.getByRole("button", { name: "View code", exact: true }).first().click();
  const managers = stored.getByRole("tablist", { name: "Package manager" }).first();
  await managers.getByRole("tab", { name: "npm", exact: true }).click();
  assert.equal(
    await managers.getByRole("tab", { name: "npm", exact: true }).getAttribute("aria-selected"),
    "true",
  );
  assert.deepEqual(storageErrors, []);
  await storageContext.close();
  console.log("Navigation colors, mobile geometry and blocked preference storage passed.");
} finally {
  await browser.close();
}
