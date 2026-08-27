import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import MenuFixture from "./menu.browser-fixture.svelte";
import MenuDefaultFixture from "./menu-default.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Menu browser contract", () => {
  test("opens, roves, selects checkboxes and radios, opens submenus, and restores focus", async () => {
    render(MenuFixture);
    const trigger = page.getByTestId("trigger");
    await trigger.click();
    await expect.element(page.getByTestId("open")).toHaveTextContent("open");
    await expect.element(page.getByRole("menu")).toBeVisible();
    const popupId = document.querySelector<HTMLElement>('[data-slot="menu-popup"]')?.id;
    expect(popupId).toBeTruthy();
    await expect.element(trigger).toHaveAttribute("aria-controls", popupId as string);

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toContain("Alpha");
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement?.textContent).toContain("Disabled");
    await userEvent.keyboard("s");
    expect(document.activeElement?.textContent).toContain("Show details");
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByTestId("checked")).toHaveTextContent("checked");

    await page.getByTestId("light").click();
    await expect.element(page.getByTestId("value")).toHaveTextContent("light");
    await page.getByTestId("sub-trigger").click();
    await expect.element(page.getByTestId("nested")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    await expect.element(page.getByTestId("open")).toHaveTextContent("closed");
    expect(document.activeElement).toBe(document.querySelector('[data-testid="trigger"]'));

    await trigger.click();
    expect(document.querySelector<HTMLElement>('[data-slot="menu-popup"]')?.id).toBe(popupId);
  });

  test("preserves function-binding cancellation", async () => {
    render(MenuFixture);
    await page.getByTestId("veto-trigger").click();
    await expect.element(page.getByTestId("veto-open")).toHaveTextContent("closed");
    await expect.element(page.getByTestId("veto-item")).not.toBeInTheDocument();
  });

  test("reads defaultOpen once", async () => {
    const view = render(MenuDefaultFixture, { defaultOpen: true });
    await expect.element(page.getByText("Default item")).toBeVisible();
    await view.rerender({ defaultOpen: false });
    await expect.element(page.getByText("Default item")).toBeVisible();
  });
});
