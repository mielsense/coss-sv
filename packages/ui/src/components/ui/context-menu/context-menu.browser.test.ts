import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ContextMenuFixture from "./context-menu.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
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
    const popupId = document.querySelector<HTMLElement>('[data-slot="context-menu-popup"]')?.id;
    expect(popupId).toBeTruthy();
    await expect
      .element(page.getByTestId("surface"))
      .toHaveAttribute("aria-controls", popupId as string);
    const positioner = document.querySelector<HTMLElement>('[data-slot="context-menu-positioner"]');
    expect(positioner?.style.position).toBe("fixed");

    await page.getByTestId("share").click();
    await expect.element(page.getByTestId("email")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByTestId("open")).toHaveTextContent("closed");
  });
});
