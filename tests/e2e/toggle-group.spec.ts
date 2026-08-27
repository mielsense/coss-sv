import { expect, test } from "@playwright/test";
import {
  assertNoAxeViolations,
  monitorConsole,
  openReadyPreview,
  prepareDeterministicPage,
} from "./helpers/preview.js";

test("matches COSS Toggle Group sizes, inheritance, separators, and disabled states", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Toggle Group has no motion-specific state.");
  const guard = monitorConsole(page);
  await prepareDeterministicPage(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "toggle-group", theme, width);
    const groups = ready.locator('[data-slot="toggle-group"]');
    await expect(groups).toHaveCount(8);

    const itemSize = width === "desktop" ? 32 : 36;
    const expectedGroups =
      width === "desktop"
        ? [
            { height: 32, width: 100 },
            { height: 28, width: 88 },
            { height: 36, width: 112 },
            { height: 32, width: 98 },
            { height: 98, width: 32 },
          ]
        : [
            { height: 36, width: 112 },
            { height: 32, width: 100 },
            { height: 40, width: 124 },
            { height: 36, width: 110 },
            { height: 110, width: 36 },
          ];

    for (let index = 0; index < expectedGroups.length; index += 1) {
      expect(await groups.nth(index).boundingBox()).toMatchObject(expectedGroups[index]);
    }

    await expect(groups.nth(0)).toHaveAttribute("data-size", "default");
    await expect(groups.nth(1)).toHaveAttribute("data-size", "sm");
    await expect(groups.nth(2)).toHaveAttribute("data-size", "lg");
    await expect(groups.nth(3)).toHaveAttribute("data-variant", "outline");
    await expect(groups.nth(4)).toHaveAttribute("data-orientation", "vertical");
    await expect(groups.nth(7)).toHaveAttribute("data-multiple", "");

    const horizontalSeparators = groups.nth(3).locator('[data-slot="separator"]');
    await expect(horizontalSeparators).toHaveCount(2);
    for (const separator of await horizontalSeparators.all()) {
      expect(await separator.boundingBox()).toMatchObject({ height: itemSize, width: 1 });
    }
    const verticalSeparators = groups.nth(4).locator('[data-slot="separator"]');
    for (const separator of await verticalSeparators.all()) {
      expect(await separator.boundingBox()).toMatchObject({ height: 1, width: itemSize });
    }

    for (const item of await groups.nth(5).locator('[data-slot="toggle"]').all()) {
      await expect(item).toBeDisabled();
      await expect(item).toHaveAttribute("data-disabled", "");
    }
    await expect(groups.nth(6).getByRole("button", { name: "Toggle italic" })).toBeDisabled();

    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});

test("preserves single, multiple, horizontal, vertical, disabled-skip, and roving focus behavior", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "motion",
    "The static projects cover the interaction states.",
  );
  const guard = monitorConsole(page);
  await prepareDeterministicPage(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const { ready } = await openReadyPreview(page, "toggle-group", theme, "desktop");

  const first = ready.locator('[data-particle="p-toggle-group-1"]');
  const bold = first.getByRole("button", { name: "Toggle bold" });
  const italic = first.getByRole("button", { name: "Toggle italic" });
  const underline = first.getByRole("button", { name: "Toggle underline" });
  await expect(bold).toHaveAttribute("tabindex", "0");
  await expect(italic).toHaveAttribute("tabindex", "-1");
  await bold.focus();
  await page.keyboard.press("ArrowRight");
  await expect(italic).toBeFocused();
  await page.keyboard.press("Space");
  await expect(italic).toHaveAttribute("aria-pressed", "true");
  await expect(bold).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("End");
  await expect(underline).toBeFocused();
  await page.keyboard.press("Home");
  await expect(bold).toBeFocused();

  const vertical = ready.locator('[data-particle="p-toggle-group-5"]');
  await vertical.getByRole("button", { name: "Toggle bold" }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(vertical.getByRole("button", { name: "Toggle italic" })).toBeFocused();

  const disabledItem = ready.locator('[data-particle="p-toggle-group-7"]');
  await disabledItem.getByRole("button", { name: "Toggle bold" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(disabledItem.getByRole("button", { name: "Toggle underline" })).toBeFocused();

  const multiple = ready.locator('[data-particle="p-toggle-group-8"]');
  await multiple.getByRole("button", { name: "Toggle italic" }).click();
  await expect(multiple.getByRole("button", { name: "Toggle bold" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(multiple.getByRole("button", { name: "Toggle italic" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  guard.assertNoErrors();
});
