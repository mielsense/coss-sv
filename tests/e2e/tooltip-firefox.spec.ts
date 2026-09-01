import { expect, test, type Page } from "@playwright/test";
import { monitorConsole, openReadyPreview } from "./helpers/preview.js";

type TooltipTransition = {
  property: string;
  slot: string;
};

async function recordedTransitions(page: Page) {
  return page.evaluate(
    () =>
      (
        window as Window & {
          __tooltipTransitions: TooltipTransition[];
        }
      ).__tooltipTransitions,
  );
}

test("keeps the first detached tooltip open stationary in Firefox", async ({ page }) => {
  const consoleGuard = monitorConsole(page);
  const { ready } = await openReadyPreview(page, "p-tooltip-3", "light", "desktop", "real");

  await page.evaluate(() => {
    const transitions: TooltipTransition[] = [];
    Object.assign(window, { __tooltipTransitions: transitions });
    document.addEventListener("transitionrun", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.dataset.slot) return;
      transitions.push({ property: event.propertyName, slot: target.dataset.slot });
    });
  });

  await ready.getByRole("button", { name: "Toggle bold" }).hover();
  const popup = page.locator('[data-slot="tooltip-popup"]');
  const positioner = page.locator('[data-slot="tooltip-positioner"]');
  await expect(popup).toBeVisible();
  await page.waitForTimeout(350);

  expect(await recordedTransitions(page)).not.toContainEqual({
    property: "left",
    slot: "tooltip-positioner",
  });

  await popup.evaluate((element) => element.setAttribute("data-starting-style", ""));
  await expect(positioner).toHaveCSS("transition-property", "none");
  await popup.evaluate((element) => element.removeAttribute("data-starting-style"));
  await expect(positioner).toHaveCSS("transition-property", "top, left, right, bottom, transform");

  await page.evaluate(() => {
    (
      window as Window & {
        __tooltipTransitions: TooltipTransition[];
      }
    ).__tooltipTransitions.length = 0;
  });
  await ready.getByRole("button", { name: "Toggle underline" }).hover();

  await expect
    .poll(async () => recordedTransitions(page))
    .toContainEqual({ property: "left", slot: "tooltip-positioner" });
  consoleGuard.assertNoErrors();
});
