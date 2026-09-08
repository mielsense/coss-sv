import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

const baseUrl = process.env.COSS_TEST_BASE_URL;
assert.ok(baseUrl, "set COSS_TEST_BASE_URL to the app server");
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await mockOpenAnalytics(context);
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.pendingCopies = [];
    window.copyTimerCount = 0;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () =>
          new Promise((resolve, reject) => window.pendingCopies.push({ resolve, reject })),
      },
    });
    const original = window.setTimeout;
    window.setTimeout = (...args) => {
      if (args[1] === 1200) window.copyTimerCount++;
      return original(...args);
    };
  });
  const dialog = page.getByRole("dialog", { name: "Search documentation", exact: true });
  await page.getByRole("button", { name: "Search documentation" }).click();
  const input = dialog.getByRole("combobox");
  await input.fill("Separator");
  await dialog.getByRole("option", { name: "Separator", exact: true }).waitFor();
  await page.keyboard.press("Control+C");
  await page.waitForFunction(() => window.pendingCopies.length === 1);
  await input.fill("Accordion");
  await dialog.getByRole("option", { name: "Accordion", exact: true }).waitFor();
  await page.evaluate(() => window.pendingCopies[0].resolve());
  assert.equal(
    await dialog.getByText("Copied", { exact: true }).count(),
    0,
    "a prior selection cannot report copied for the next selection",
  );
  assert.equal(await page.evaluate(() => window.copyTimerCount), 0);
  await page.keyboard.press("Control+C");
  await page.waitForFunction(() => window.pendingCopies.length === 2);
  await page.keyboard.press("Control+C");
  await page.waitForFunction(() => window.pendingCopies.length === 3);
  await page.evaluate(() => window.pendingCopies[2].reject(new Error("clipboard denied")));
  await page.evaluate(() => window.pendingCopies[1].resolve());
  assert.equal(
    await dialog.getByText("Copied", { exact: true }).count(),
    0,
    "an older success cannot replace a newer failed request",
  );
  assert.equal(await page.evaluate(() => window.copyTimerCount), 0);
  await page.keyboard.press("Control+C");
  await page.waitForFunction(() => window.pendingCopies.length === 4);
  await page.evaluate(() => window.pendingCopies[3].resolve());
  await dialog.getByText("Copied", { exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.copyTimerCount), 1);
  await page.keyboard.press("Control+C");
  await page.waitForFunction(() => window.pendingCopies.length === 5);
  await page.evaluate(() => {
    const a = document.createElement("a");
    a.href = "/preview/accordion";
    document.body.append(a);
    a.click();
  });
  await page.waitForURL(/\/preview\/accordion/);
  await page.locator("[data-search-trigger]").waitFor({ state: "detached" });
  await page.evaluate(() => window.pendingCopies[4].resolve());
  assert.equal(
    await page.evaluate(() => window.copyTimerCount),
    1,
    "destroyed command menus cannot schedule copied feedback",
  );
  await context.close();
  console.log("Command copy ignores stale selection and destroyed component completions.");
} finally {
  await browser.close();
}
