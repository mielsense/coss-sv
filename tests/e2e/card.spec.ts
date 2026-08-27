import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("renders exact p-card-1 and p-card-11 particles at desktop and mobile widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "motion", "Card has no component motion.");
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "card", theme, width);
    const formCard = ready.locator('[data-anchor="p-card-1"]');
    const projectFrame = ready.locator('[data-anchor="p-card-11"]');

    await expect(ready.locator('[data-slot="card"]')).toHaveCount(2);
    await expect(ready.locator('[data-slot="card-frame"]')).toHaveCount(1);
    await expect(formCard.locator('[data-slot="card-title"]')).toHaveText("Create project");
    await expect(formCard.locator('[data-slot="card-description"]')).toHaveText(
      "Deploy your new project in one-click.",
    );
    await expect(formCard.locator('[data-slot="form"]')).toHaveCount(1);
    await expect(formCard.locator(':scope > [data-slot="card-header"]')).toHaveCount(1);
    await expect(formCard.locator(':scope > [data-slot="card-panel"]')).toHaveCount(1);
    await expect(formCard.locator(':scope > [data-slot="card-footer"]')).toHaveCount(1);
    await expect(formCard.getByLabel("Name")).toHaveAttribute(
      "placeholder",
      "Name of your project",
    );
    await expect(formCard.getByLabel("Framework")).toHaveAttribute("role", "combobox");
    await expect(formCard.getByRole("button", { name: "Deploy" })).toHaveAttribute(
      "data-slot",
      "button",
    );
    await expect(formCard.getByRole("button", { name: "Deploy" })).toHaveClass(/bg-primary/);
    await expect(formCard.locator('[data-slot="card-footer"]')).toContainText(
      "This will take a few seconds to complete.",
    );

    await expect(projectFrame.locator('[data-slot="card-frame-title"]')).toHaveText("Project");
    await expect(projectFrame.locator('[data-slot="card-frame-description"]')).toHaveText(
      "Manage your projects",
    );
    await expect(projectFrame.getByRole("button", { name: "Add" })).toHaveAttribute(
      "data-slot",
      "button",
    );
    await expect(projectFrame.getByRole("button", { name: "Add" })).toHaveClass(/bg-popover/);
    await expect(projectFrame.locator(':scope > [data-slot="card-frame-header"]')).toHaveCount(1);
    await expect(projectFrame.locator(':scope > [data-slot="card"]')).toHaveCount(1);
    await expect(projectFrame.locator('[data-slot="empty-title"]')).toHaveText("No projects yet");
    await expect(projectFrame.locator('[data-slot="empty-description"]')).toHaveText(
      "Get started by adding your first project.",
    );

    const geometry = await ready.evaluate((element) => {
      const rect = (selector: string) => {
        const node = element.querySelector<HTMLElement>(selector);
        if (!node) throw new Error(`Missing ${selector}`);
        const box = node.getBoundingClientRect();
        return {
          height: box.height,
          radius: getComputedStyle(node).borderRadius,
          width: box.width,
        };
      };
      return {
        add: rect('[data-anchor="p-card-11"] [data-slot="button"]'),
        deploy: rect('[data-anchor="p-card-1"] [data-slot="button"]'),
        formCard: rect('[data-anchor="p-card-1"]'),
        frame: rect('[data-anchor="p-card-11"]'),
        input: rect('[data-anchor="p-card-1"] [data-slot="input"]'),
        innerCard: rect('[data-anchor="p-card-11"] [data-slot="card"]'),
        select: rect('[data-anchor="p-card-1"] [data-slot="select-trigger"]'),
      };
    });
    expect(geometry.formCard.width).toBe(width === "desktop" ? 320 : 308);
    expect(geometry.frame.width).toBe(width === "desktop" ? 498 : 308);
    expect(geometry.innerCard.width).toBe(width === "desktop" ? 498 : 308);
    expect(geometry.formCard.radius).toBe("16px");
    expect(geometry.frame.radius).toBe("16px");
    expect(geometry.formCard.height).toBe(width === "desktop" ? 318 : 334);
    expect(geometry.frame.height).toBe(width === "desktop" ? 394 : 350);
    expect(geometry.input.height).toBe(width === "desktop" ? 30 : 34);
    expect(geometry.select.height).toBe(width === "desktop" ? 32 : 36);
    expect(geometry.deploy.height).toBe(width === "desktop" ? 32 : 36);
    expect(geometry.add.height).toBe(width === "desktop" ? 32 : 36);
    expect(geometry.deploy.radius).toBe("10px");
    expect(geometry.add.radius).toBe("10px");

    const name = formCard.getByLabel("Name");
    const framework = formCard.getByLabel("Framework");
    const deploy = formCard.getByRole("button", { name: "Deploy" });
    const add = projectFrame.getByRole("button", { name: "Add" });
    await page.keyboard.press("Tab");
    await expect(name).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(framework).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option", { name: "Next.js" })).toBeFocused();
    await expect(page.getByRole("option")).toHaveCount(4);
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option", { name: "Vite" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(framework).toContainText("Vite");
    await page.keyboard.press("Tab");
    await expect(deploy).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(add).toBeFocused();

    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
