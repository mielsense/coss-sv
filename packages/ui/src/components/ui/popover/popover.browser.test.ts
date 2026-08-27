import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./popover.browser-fixture.svelte";
import SsrFixture from "./popover.ssr-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Popover browser contract", () => {
  test("composes one trigger, portals, anchors, descriptions, closes, and restores focus", async () => {
    render(Fixture);
    const trigger = page.getByTestId("trigger");
    expect(document.querySelectorAll('[data-testid="trigger"]')).toHaveLength(1);
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Account details" });
    await expect.element(dialog).toHaveAccessibleDescription("Update your profile.");
    expect((await dialog.element()).closest('[data-testid="portal-target"]')).not.toBeNull();
    const positioner = document.querySelector<HTMLElement>('[data-slot="popover-positioner"]');
    expect(positioner?.style.getPropertyValue("--anchor-width")).toBeTruthy();
    expect(positioner?.className).toContain("--available-width");
    await userEvent.keyboard("{Escape}");
    await expect.element(dialog).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
    await trigger.click();
    await page.getByRole("button", { name: "Done" }).click();
    await expect.element(dialog).not.toBeInTheDocument();
    await expect.element(page.getByTestId("state")).toHaveTextContent("false:4");
  });

  test("uses the exact tooltip-style classes and keeps hover content interactive", async () => {
    render(Fixture);
    const trigger = page.getByTestId("hover-trigger");
    await trigger.hover();
    const popup = page.getByTestId("hover-popup");
    await expect.element(popup).toBeInTheDocument();
    expect((await popup.element()).className).toContain("w-fit");
    expect((await popup.element()).className).toContain("text-xs");
    await page.getByRole("button", { name: "Interactive action" }).hover();
    await expect.element(popup).toBeInTheDocument();
  });

  test("does not open hover-only behavior from a touch pointer", async () => {
    render(Fixture);
    const trigger = document.querySelector<HTMLElement>('[data-testid="hover-trigger"]');
    if (!trigger) throw new Error("missing trigger");
    trigger.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, pointerType: "touch" }),
    );
    trigger.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "touch" }));
    expect(document.querySelector('[data-testid="hover-popup"]')).toBeNull();
  });

  test("dismisses on an outside press", async () => {
    render(Fixture);
    await page.getByTestId("trigger").click();
    const dialog = page.getByRole("dialog", { name: "Account details" });
    await expect.element(dialog).toBeInTheDocument();
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await expect.element(dialog).not.toBeInTheDocument();
  });

  test("hydrates the exact server-rendered tree without diagnostics", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!--[--><!--[--><!--[--><!--$s1--><!--[-1--><!--]--> <!----><button type="button" tabindex="0" id="s1" aria-haspopup="dialog" aria-expanded="false" data-shards-ui-click-trigger="" data-slot="popover-trigger"><!---->Open Popover<!----><!----><!----></button><!----> <!--[-1--><!--]--><!--]--><!--]--> <!--[--><!--[--><!--[-1--><!--]--><!--]--><!--]--><!----><!----><!--]--><!--]--><!--]-->';
    document.body.append(target);
    const component = hydrate(SsrFixture, { target });
    await page.getByRole("button", { name: "Open Popover" }).click();
    await expect.element(page.getByRole("dialog", { name: "Popover Title" })).toBeInTheDocument();
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
