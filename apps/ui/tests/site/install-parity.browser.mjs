import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

const baseUrl = process.env.COSS_TEST_BASE_URL;
assert.ok(baseUrl, "set COSS_TEST_BASE_URL to the app server");
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1600, 390]) {
    for (const dark of [false, true]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        permissions: ["clipboard-read", "clipboard-write"],
      });
      await mockOpenAnalytics(context);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${baseUrl}/docs/components/accordion`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), dark);
      await page.getByRole("tab", { name: "Manual", exact: true }).click();
      const manual = page.getByRole("tabpanel", { name: "Manual", exact: true });
      const commandPanel = manual.locator('[data-install-command="pnpm"]');
      assert.equal(await commandPanel.evaluate((el) => el.getBoundingClientRect().height), 47.5);
      const sourceTabs = manual.getByRole("tablist", { name: "Component source files" });
      await sourceTabs.waitFor();
      const firstTabBounds = await sourceTabs.evaluate((list) => ({
        listLeft: list.getBoundingClientRect().left,
        firstLeft: list.querySelector('[role="tab"]').getBoundingClientRect().left,
      }));
      assert.ok(
        firstTabBounds.firstLeft >= firstTabBounds.listLeft,
        "the first source file must be reachable at scroll start",
      );
      const bounds = await manual.evaluate((el) => ({
        width: el.getBoundingClientRect().width,
        scroll: el.scrollWidth,
      }));
      assert.ok(
        bounds.scroll <= bounds.width + (width >= 768 ? 4 : 1),
        `manual panel must contain long source/file tabs: ${JSON.stringify(bounds)}`,
      );
      assert.ok(
        (await manual.getByRole("button", { name: "Expand", exact: true }).count()) >= 2,
        "source offers top and gradient expand controls",
      );
      const panel = manual.locator("[data-source-collapse-panel]");
      assert.equal(
        await panel.evaluate((el) => Math.round(el.getBoundingClientRect().height)),
        256,
      );
      const sourceText = await panel.locator("code").textContent();
      assert.ok(sourceText.length > 100);
      const topExpand = manual.locator('[data-slot="collapsible-trigger"]').first();
      await topExpand.focus();
      await page.keyboard.press("Enter");
      assert.equal(await topExpand.getAttribute("aria-expanded"), "true");
      assert.ok((await panel.evaluate((el) => el.getBoundingClientRect().height)) > 256);
      assert.equal(await panel.locator("code").textContent(), sourceText);
      await manual.getByRole("button", { name: "Collapse", exact: true }).click();
      assert.equal(
        await panel.evaluate((el) => Math.round(el.getBoundingClientRect().height)),
        256,
      );
      const copy = panel.getByRole("button", { name: "Copy to clipboard", exact: true });
      const sizes = await copy.evaluate((el) => ({
        button: el.getBoundingClientRect().width,
        icon: el.querySelector("svg").getBoundingClientRect().width,
      }));
      assert.deepEqual(sizes, { button: width < 640 ? 36 : 32, icon: width < 640 ? 20 : 16 });
      await copy.focus();
      const tooltip = page.getByRole("tooltip");
      await tooltip.waitFor();
      assert.equal((await tooltip.textContent()).trim(), "Copy to clipboard");
      await copy.click();
      assert.equal(
        await context
          .grantPermissions(["clipboard-read", "clipboard-write"])
          .then(() => page.evaluate(() => navigator.clipboard.readText())),
        sourceText,
      );
      assert.equal(await panel.getByRole("button", { name: "Copied", exact: true }).count(), 1);
      await sourceTabs.getByRole("tab").first().focus();
      await page.keyboard.press("End");
      await page.keyboard.press("Enter");
      assert.equal(await sourceTabs.getByRole("tab").last().getAttribute("aria-selected"), "true");
      const lastTabBounds = await sourceTabs.evaluate((list) => ({
        listRight: list.getBoundingClientRect().right,
        lastRight: [...list.querySelectorAll('[role="tab"]')].at(-1).getBoundingClientRect().right,
      }));
      assert.ok(
        lastTabBounds.lastRight <= lastTabBounds.listRight + 1,
        "keyboard navigation scrolls the final source file into view",
      );
      await page.evaluate(() =>
        Object.defineProperty(navigator.clipboard, "writeText", {
          configurable: true,
          value: () => Promise.reject(new Error("denied")),
        }),
      );
      await manual
        .locator("[data-source-collapse-panel]")
        .getByRole("button", { name: "Copy to clipboard", exact: true })
        .click();
      await manual.getByRole("button", { name: "Copy failed", exact: true }).waitFor();
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  const blockedContext = await browser.newContext();
  await mockOpenAnalytics(blockedContext);
  await blockedContext.addInitScript(() => {
    for (const method of ["getItem", "setItem"]) {
      const original = Storage.prototype[method];
      Storage.prototype[method] = function (key, ...args) {
        if (key === "coss-installation-method" || key === "coss-package-manager") {
          throw new DOMException("Storage blocked", "SecurityError");
        }
        return original.call(this, key, ...args);
      };
    }
  });
  const blockedPage = await blockedContext.newPage();
  const blockedErrors = [];
  blockedPage.on("pageerror", (error) => blockedErrors.push(error.message));
  await blockedPage.goto(`${baseUrl}/docs/components/accordion`, { waitUntil: "networkidle" });
  await blockedPage.getByRole("tab", { name: "Manual", exact: true }).click();
  const blockedManual = blockedPage.getByRole("tabpanel", { name: "Manual", exact: true });
  assert.equal(
    await blockedManual
      .getByRole("tablist", { name: "Component source files" })
      .getByRole("tab")
      .first()
      .getAttribute("aria-selected"),
    "true",
  );
  await blockedManual.getByRole("tab", { name: "npm", exact: true }).click();
  assert.match(
    await blockedManual.locator('[data-install-command="npm"] code').textContent(),
    /^npm install /,
  );
  assert.deepEqual(blockedErrors, []);
  await blockedContext.close();
  console.log(
    "Manual source containment, expansion, file navigation, copy sizing and clipboard feedback passed.",
  );
} finally {
  await browser.close();
}
