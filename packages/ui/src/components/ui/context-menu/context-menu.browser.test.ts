import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import ContextMenuFixture from "./context-menu.browser-fixture.svelte";

afterEach(() => {
  cleanup();
});

describe("Context Menu browser contract", () => {
  test("opens at a context point, navigates submenus, closes with Escape, and restores focus", async () => {
    render(ContextMenuFixture);
    const surface = document.querySelector<HTMLElement>('[data-testid="surface"]');
    surface?.focus();
    surface?.dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, button: 2, clientX: 80, clientY: 96 }),
    );
    await expect.element(page.getByTestId("open")).toHaveTextContent("open");
    await expect.element(page.getByTestId("action")).toBeVisible();
    await expect
      .element(page.getByTestId("surface"))
      .toHaveAttribute("aria-controls", "context-popup");
    const positioner = document.querySelector<HTMLElement>('[data-slot="context-menu-positioner"]');
    expect(positioner?.style.position).toBe("fixed");
    const getPopupRect = () =>
      page
        .getByTestId("action")
        .element()
        .closest<HTMLElement>("[role=menu]")
        ?.getBoundingClientRect();
    await expect
      .poll(() => {
        const rect = getPopupRect();
        return rect ? rect.left + rect.width / 2 : undefined;
      })
      .toBeCloseTo(80, 0);
    await expect.poll(() => getPopupRect()?.top).toBeCloseTo(100, 0);
    expect(
      page.getByTestId("portal-target").element().querySelector("#context-popup"),
    ).toBeTruthy();

    await page.getByTestId("share").click();
    await expect
      .element(page.getByTestId("share"))
      .toHaveAttribute("aria-controls", "context-sub-popup");
    await expect.element(page.getByTestId("email")).toBeVisible();
    await page.getByTestId("deep-share").click();
    await expect
      .element(page.getByTestId("deep-share"))
      .toHaveAttribute("aria-controls", "context-deep-popup");
    await expect.element(page.getByTestId("deep-action")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByTestId("open")).toHaveTextContent("closed");
    expect(document.activeElement).toBe(surface);
  });

  test("opens from the keyboard context-menu key and a touch long press", async () => {
    render(ContextMenuFixture);
    const surface = page.getByTestId("surface");
    surface.element().focus();
    await userEvent.keyboard("{Shift>}{F10}{/Shift}");
    await expect.element(page.getByTestId("open")).toHaveTextContent("open");
    await userEvent.keyboard("{Escape}");

    const touch = new Touch({
      clientX: 40,
      clientY: 50,
      identifier: 1,
      target: surface.element(),
    });
    surface
      .element()
      .dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [touch] }));
    await new Promise((resolve) => setTimeout(resolve, 550));
    await expect.element(page.getByTestId("open")).toHaveTextContent("open");
  });
});
