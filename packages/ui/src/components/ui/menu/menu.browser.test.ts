import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import MenuAdvancedFixture from "./menu.advanced.browser-fixture.svelte";
import MenuFixture from "./menu.browser-fixture.svelte";
import MenuDefaultFixture from "./menu-default.browser-fixture.svelte";
import MenuHydrationFixture from "./menu.hydration-fixture.svelte";

const hydrationHtml =
  '<!--[--><!--[--><!--[--><!--$s1--><!--[--><!--[--><!--$s2--><!--[-1--><!--]--> <!----><button type="button" tabindex="0" id="hydrated-menu-trigger" aria-haspopup="menu" aria-expanded="false" data-slot="menu-trigger"><!---->Open hydrated menu<!----><!----><!----></button><!----> <!--[-1--><!--]--><!--]--><!--]--> <!--[--><!--$s3--><!--[--><!--[-1--><!--]--><!----><!--]--><!--]--><!----><!----><!--]--><!--]--><!--]-->';

afterEach(() => {
  cleanup();
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

  test("supports detached typed handles, multiple triggers, and active-trigger aria-controls", async () => {
    render(MenuAdvancedFixture);

    await page.getByTestId("orphan-trigger").click();
    await expect.element(page.getByTestId("detached-open")).toHaveTextContent("closed");

    const detachedA = page.getByTestId("detached-a");
    const detachedB = page.getByTestId("detached-b");
    await detachedA.click();
    await expect.element(page.getByTestId("detached-payload")).toHaveTextContent("Alpha");
    await expect.element(detachedA).toHaveAttribute("aria-controls", "detached-popup");
    await expect.element(detachedB).not.toHaveAttribute("aria-controls");
    await userEvent.keyboard("{Escape}");

    await detachedB.click();
    await expect.element(page.getByTestId("detached-payload")).toHaveTextContent("Beta");
    await expect.element(detachedB).toHaveAttribute("aria-controls", "detached-popup");
    await expect.element(detachedA).not.toHaveAttribute("aria-controls");
  });

  test("keeps explicit popup ids correct through nested menus and a custom portal", async () => {
    render(MenuAdvancedFixture);
    const target = page.getByTestId("portal-target");
    const attachedA = page.getByTestId("attached-a");
    const attachedB = page.getByTestId("attached-b");

    expect(target.element().querySelector("#explicit-popup")).toBeTruthy();
    await attachedA.click();
    await expect.element(attachedA).toHaveAttribute("aria-controls", "explicit-popup");
    await expect.element(attachedB).not.toHaveAttribute("aria-controls");
    await page.getByTestId("deep-one").click();
    await expect
      .element(page.getByTestId("deep-one"))
      .toHaveAttribute("aria-controls", "explicit-sub-popup");
    await page.getByTestId("deep-two").click();
    await expect
      .element(page.getByTestId("deep-two"))
      .toHaveAttribute("aria-controls", "explicit-deep-popup");
    await expect.element(page.getByTestId("deep-item")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    expect(document.activeElement).toBe(page.getByTestId("deep-two").element());
    await userEvent.keyboard("{Escape}");
    await userEvent.keyboard("{Escape}");
    expect(document.activeElement).toBe(attachedA.element());

    await attachedB.click();
    await expect.element(attachedB).toHaveAttribute("aria-controls", "explicit-popup");
    await expect.element(attachedA).not.toHaveAttribute("aria-controls");
  });

  test("hydrates server-rendered menu markup without warnings and preserves explicit ids", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = hydrationHtml;
    document.body.append(target);

    const component = hydrate(MenuHydrationFixture, { target });
    const trigger = page.getByRole("button", { name: "Open hydrated menu" });
    await trigger.click();
    await expect.element(trigger).toHaveAttribute("aria-controls", "hydrated-menu-popup");
    await expect.element(page.getByText("Hydrated item")).toBeVisible();
    expect(warning).not.toHaveBeenCalled();

    await unmount(component);
    warning.mockRestore();
  });
});
