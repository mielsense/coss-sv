import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mockOpenAnalytics } from "../browser/instrumentation.mjs";

const baseUrl = process.env.COSS_TEST_BASE_URL;
assert.ok(baseUrl, "COSS_TEST_BASE_URL must point to the documentation server");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await mockOpenAnalytics(context);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(`${baseUrl}/docs/components/checkbox`, { waitUntil: "domcontentloaded" });
  const card = page.locator('[data-particle="p-checkbox-1"]');
  const checkbox = card.getByRole("checkbox");
  await checkbox.check();
  assert.equal(await checkbox.isChecked(), true);
  await card.getByRole("tab", { name: "Code", exact: true }).click();
  assert.equal(await checkbox.count(), 0, "hidden preview controls leave the accessibility tree");
  const retainedCheckbox = card.locator('[data-preview-panel] [role="checkbox"]');
  assert.equal(
    await retainedCheckbox.count(),
    1,
    "switching to code preserves the preview instance",
  );
  assert.equal(await retainedCheckbox.isVisible(), false);
  await retainedCheckbox.evaluate((element) => element.focus());
  assert.equal(
    await retainedCheckbox.evaluate((element) => element === document.activeElement),
    false,
    "hidden preview controls cannot receive focus",
  );
  await card.getByRole("tab", { name: "Preview", exact: true }).click();
  assert.equal(await checkbox.isChecked(), true, "returning to preview preserves the user's value");
  await checkbox.uncheck();
  assert.equal(await checkbox.isChecked(), false, "the retained preview remains interactive");
  assert.deepEqual(errors, []);
  console.log("Preview state survives code tabs without exposing hidden controls.");
} finally {
  await context.close();
  await browser.close();
}
