import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

function standardToasts(page: import("@playwright/test").Page) {
  return page.locator(
    '[data-slot="toast-viewport"] > [role="dialog"], [data-slot="toast-viewport"] > [role="alertdialog"]',
  );
}

function anchoredToasts(page: import("@playwright/test").Page) {
  return page.locator('[data-slot="toast-viewport-anchored"] [data-slot="toast-popup"]');
}

test("renders all thirteen Toast particles with exact responsive and theme geometry", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "motion",
    "Motion behavior is covered by the interaction test.",
  );
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "toast", theme, width, "real", "start");
    await expect(ready.locator("[data-particle^='p-toast-']")).toHaveCount(13);
    for (const label of [
      "Default Toast",
      "Success Toast",
      "Error Toast",
      "Info Toast",
      "Warning Toast",
      "Loading Toast",
      "Perform Action",
      "Run Promise",
      "With Varying Heights",
      "Copy link",
      "Submit",
      "Download",
      "One Success Toast",
      "One Error Toast",
    ]) {
      await expect(ready.getByRole("button", { name: label, exact: true })).toBeVisible();
    }
    await expect(ready.getByRole("button", { name: "Save", exact: true })).toHaveCount(2);

    await ready.getByRole("button", { name: "Default Toast", exact: true }).click();
    const viewport = page.locator('[data-slot="toast-viewport"]');
    const toast = standardToasts(page).first();
    const geometry = await viewport.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        bottom: window.innerHeight - rect.bottom,
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        right: window.innerWidth - rect.right,
        width: rect.width,
        background: getComputedStyle(element.firstElementChild as Element).backgroundColor,
        borderColor: getComputedStyle(element.firstElementChild as Element).borderColor,
        position: style.position,
      };
    });
    expect(geometry).toEqual({
      background: expect.not.stringMatching(/^rgba\(0, 0, 0, 0\)$/),
      borderColor: expect.not.stringMatching(/^rgba\(0, 0, 0, 0\)$/),
      bottom: width === "desktop" ? 32 : 16,
      colorScheme: theme,
      position: "fixed",
      right: width === "desktop" ? 32 : 16,
      width: width === "desktop" ? 360 : 358,
    });
    await expect(toast).toContainText("Event has been created");
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});

test("matches p1 through p6 status, action, promise, and stack behavior", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "dark", "Dark rendering is covered by the geometry test.");
  const guard = monitorConsole(page);
  const { ready } = await openReadyPreview(
    page,
    "toast",
    "light",
    "desktop",
    "real",
    "start",
  );

  const statusCases = [
    ["Success Toast", "Success!", "success"],
    ["Error Toast", "Uh oh! Something went wrong.", "error"],
    ["Info Toast", "Heads up!", "info"],
    ["Warning Toast", "Warning!", "warning"],
  ] as const;
  for (const [button, title, type] of statusCases) {
    await ready.getByRole("button", { name: button, exact: true }).click();
    await expect(standardToasts(page).first()).toHaveAttribute("data-type", type);
    await expect(standardToasts(page).first()).toContainText(title);
  }

  await ready.getByRole("button", { name: "Loading Toast", exact: true }).click();
  await expect(standardToasts(page).first()).toHaveAttribute("data-type", "loading");
  const loadingIcon = standardToasts(page).first().locator('[data-slot="toast-icon"] svg');
  await expect(loadingIcon).toHaveClass(/in-data-\[type=loading\]:animate-spin/);
  await expect(loadingIcon).toHaveCSS("animation-name", "spin");

  await page.evaluate(() => {
    const target = window as Window & { __toastTimeouts?: number[] };
    const nativeSetTimeout = window.setTimeout.bind(window);
    target.__toastTimeouts = [];
    window.setTimeout = ((handler, timeout, ...arguments_) => {
      target.__toastTimeouts?.push(Number(timeout));
      return nativeSetTimeout(handler, timeout, ...arguments_);
    }) as typeof window.setTimeout;
  });
  await ready.getByRole("button", { name: "Perform Action", exact: true }).click();
  expect(
    await page.evaluate(
      () => (window as Window & { __toastTimeouts?: number[] }).__toastTimeouts ?? [],
    ),
  ).toContain(1_000_000);
  const actionToast = standardToasts(page).first();
  await expect(actionToast.getByRole("button", { name: "Undo" })).toBeVisible();
  await actionToast.getByRole("button", { name: "Undo" }).click();
  await expect(standardToasts(page).first()).toContainText("Action undone");

  await page.evaluate(() => {
    Math.random = () => 1;
  });
  await ready.getByRole("button", { name: "Run Promise", exact: true }).click();
  await expect(standardToasts(page).first()).toContainText("Loading…");
  await expect(standardToasts(page).first()).toContainText("This is a success toast!", {
    timeout: 3_000,
  });

  await ready.getByRole("button", { name: "With Varying Heights", exact: true }).click();
  const swipedToast = standardToasts(page).first();
  await expect(swipedToast).toContainText("Toast 1 created");
  const bounds = await swipedToast.boundingBox();
  if (!bounds) throw new Error("The frontmost toast has no pointer geometry.");
  await page.mouse.move(bounds.x + 20, bounds.y + 20);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 21, bounds.y + 20);
  await page.mouse.move(bounds.x + 81, bounds.y + 20, { steps: 3 });
  await expect(swipedToast).toHaveAttribute("data-swipe-direction", "right");
  await expect(swipedToast).toHaveAttribute("data-swiping");
  await page.mouse.up();
  await expect(swipedToast).toHaveAttribute("data-ending-style");
  guard.assertNoErrors();
});

test("matches p7 through p9 tooltip, spinner, anchored error, and cancellation behavior", async ({
  context,
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "dark", "Dark rendering is covered by the geometry test.");
  const guard = monitorConsole(page);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  let { ready } = await openReadyPreview(
    page,
    "toast",
    "light",
    "desktop",
    "real",
    "start",
  );

  const copy = ready.getByRole("button", { name: "Copy link", exact: true });
  await copy.hover();
  await expect(page.getByRole("tooltip")).toHaveText("Copy to clipboard");
  await copy.click();
  await expect(anchoredToasts(page).first()).toHaveText("Copied!");

  const submit = ready.locator('[data-particle="p-toast-8"] button');
  await submit.click();
  await expect(submit).toBeDisabled({ timeout: 1_000 });
  const spinner = submit.locator('svg[role="status"][aria-label="Loading"]');
  await expect(spinner).toHaveClass(/animate-spin/, { timeout: 1_000 });
  await expect(spinner).toHaveCSS("animation-name", "spin");
  await expect(submit).toContainText("Submitting…");
  await expect(anchoredToasts(page).first()).toContainText("Error submitting form", {
    timeout: 3_000,
  });

  await ready.getByRole("button", { name: "Download", exact: true }).click();
  await expect(standardToasts(page).first()).toContainText("Generating report…");
  await standardToasts(page).first().getByRole("button", { name: "Cancel" }).click();
  const cancelledToast = standardToasts(page).first();
  await expect(cancelledToast).toContainText("Cancelled");
  await expect(cancelledToast).toHaveAttribute("data-type", "info");
  const infoIcon = cancelledToast.locator('[data-slot="toast-icon"] svg');
  await expect(infoIcon).toHaveClass(/lucide-info/);
  await expect(infoIcon).toHaveClass(/text-info/);
  const [iconColor, infoColor] = await infoIcon.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--info)";
    document.body.append(probe);
    const colors = [getComputedStyle(element).color, getComputedStyle(probe).color];
    probe.remove();
    return colors;
  });
  expect(iconColor).toBe(infoColor);
  expect(iconColor).not.toBe("rgba(0, 0, 0, 0)");
  await expect(cancelledToast.getByRole("button", { name: "Cancel" })).toHaveCount(0);

  ({ ready } = await openReadyPreview(page, "toast", "light", "desktop", "real", "start"));
  await page.evaluate(() => {
    Math.random = () => 0;
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = ((handler, timeout, ...arguments_) =>
      nativeSetTimeout(
        handler,
        timeout === 4_000 ? 0 : timeout,
        ...arguments_,
      )) as typeof window.setTimeout;
  });
  await ready.getByRole("button", { name: "Download", exact: true }).click();
  const failedToast = standardToasts(page).first();
  await expect(failedToast).toContainText("Failed to generate report");
  await expect(failedToast).toHaveAttribute("data-type", "error");
  await expect(failedToast.locator('[data-slot="toast-icon"] svg')).toHaveClass(
    /lucide-circle-alert/,
  );
  await expect(failedToast.getByRole("button", { name: "Cancel" })).toHaveCount(0);

  ({ ready } = await openReadyPreview(page, "toast", "light", "desktop", "real", "start"));
  await page.evaluate(() => {
    Math.random = () => 1;
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = ((handler, timeout, ...arguments_) =>
      nativeSetTimeout(
        handler,
        timeout === 4_000 ? 0 : timeout,
        ...arguments_,
      )) as typeof window.setTimeout;
  });
  await ready.getByRole("button", { name: "Download", exact: true }).click();
  const successToast = standardToasts(page).first();
  await expect(successToast).toContainText("Download started");
  await expect(successToast).toHaveAttribute("data-type", "success");
  await expect(successToast.locator('[data-slot="toast-icon"] svg')).toHaveClass(
    /lucide-circle-check/,
  );
  await expect(successToast.getByRole("button", { name: "Cancel" })).toHaveCount(0);
  guard.assertNoErrors();
});

test("matches p10 through p13 replay and tooltip-style anchored feedback", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "dark", "Dark rendering is covered by the geometry test.");
  const guard = monitorConsole(page);
  const { ready } = await openReadyPreview(
    page,
    "toast",
    "light",
    "desktop",
    "real",
    "start",
  );

  const success = ready.getByRole("button", { name: "One Success Toast", exact: true });
  await success.click();
  await success.click();
  await expect(standardToasts(page).filter({ hasText: "Saved" })).toHaveCount(1);
  await expect(standardToasts(page).filter({ hasText: "Saved" })).toHaveClass(
    /animate-toast-success-/,
  );

  const error = ready.getByRole("button", { name: "One Error Toast", exact: true });
  await error.click();
  await error.click();
  await expect(standardToasts(page).filter({ hasText: "Something went wrong" })).toHaveCount(1);
  await expect(standardToasts(page).filter({ hasText: "Something went wrong" })).toHaveClass(
    /animate-toast-error-/,
  );

  const save = ready.getByRole("button", { name: "Save", exact: true });
  await save.nth(0).hover();
  await expect(page.getByRole("tooltip")).toHaveText("Save");
  await save.nth(0).click();
  await expect(anchoredToasts(page).filter({ hasText: "Draft saved" })).toHaveCount(1);

  await save.nth(1).hover();
  await expect(page.getByRole("tooltip")).toHaveText("Save");
  await save.nth(1).click();
  await expect(anchoredToasts(page).filter({ hasText: "Couldn't save draft" })).toHaveCount(1);
  guard.assertNoErrors();
});
