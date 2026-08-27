import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./sheet.browser-fixture.svelte";
import HydrationFixture from "./sheet.hydration-fixture.svelte";
import { sheetSsrHtml } from "./sheet.hydration-html.js";
afterEach(() => {
  document.body.innerHTML = "";
});
describe("Sheet browser contract", () => {
  test("supports detached handles and typed payload content", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open detached sheet" }).click();
    await expect.element(page.getByRole("dialog", { name: "Detached sheet" })).toBeVisible();
    await expect.element(page.getByText("Detached sheet payload")).toBeVisible();
    document.querySelector<HTMLButtonElement>('[data-slot="sheet-close"]')?.click();
  });
  test("renders every side, traps focus, dismisses, and restores the matching trigger", async () => {
    render(Fixture);
    for (const side of ["right", "left", "top", "bottom"] as const) {
      const trigger = page.getByRole("button", { name: `Open ${side}` });
      await trigger.click();
      await expect.element(page.getByTestId("sheet-state")).toHaveTextContent(`true:${side}`);
      const popup = page.getByTestId("sheet-popup");
      await expect.element(popup).toBeVisible();
      if (side === "right") {
        const expectedSeeds = [
          "Margaret Welsh",
          "@maggie.welsh",
          "Margaret Welsh",
          "@maggie.welsh",
        ];
        for (const [index, expected] of expectedSeeds.entries()) {
          await expect
            .element(page.getByLabelText(`Sheet seed ${index + 1}`))
            .toHaveValue(expected);
        }
      }
      expect(document.querySelector('[data-testid="sheet-popup"]')?.className).toContain(
        side === "right" || side === "left" ? "max-w-md" : side === "top" ? "border-b" : "border-t",
      );
      await userEvent.keyboard("{Tab}{Tab}{Tab}");
      expect(
        document.querySelector('[data-testid="sheet-popup"]')?.contains(document.activeElement),
      ).toBe(true);
      await userEvent.keyboard("{Escape}");
      await expect.element(popup).not.toBeInTheDocument();
      await expect.element(page.getByTestId("sheet-state")).toHaveTextContent(`false:${side}`);
      expect((document.activeElement as HTMLElement | null)?.textContent).toBe(`Open ${side}`);
    }
  });
  test("dismisses from the backdrop", async () => {
    render(Fixture);
    await page.getByRole("button", { name: "Open right" }).click();
    const backdrop = document.querySelector<HTMLElement>('[data-slot="sheet-backdrop"]');
    backdrop?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1 }));
    backdrop?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
    backdrop?.click();
    await expect.element(page.getByTestId("sheet-popup")).not.toBeInTheDocument();
  });
  test("hydrates genuine SSR output and opens its portal without mismatches", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = sheetSsrHtml;
    document.body.append(target);
    const component = hydrate(HydrationFixture, { target });
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await page.getByRole("button", { name: "Open hydrated sheet" }).click();
    await expect.element(page.getByRole("dialog", { name: "Hydrated sheet" })).toBeVisible();
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
