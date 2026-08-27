import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./tooltip.browser-fixture.svelte";
import SsrFixture from "./tooltip.ssr-fixture.svelte";
afterEach(() => {
  document.body.innerHTML = "";
});
describe("Tooltip browser contract", () => {
  test("opens on focus, supplies an accessible description, portals, and dismisses", async () => {
    render(Fixture);
    const trigger = page.getByTestId("tip-one");
    trigger.element().focus();
    const popup = page.getByRole("tooltip", { name: "First hint" });
    await expect.element(popup).toBeInTheDocument();
    const descriptionId = trigger.element().getAttribute("aria-describedby");
    expect(descriptionId).toBe((await popup.element()).id);
    expect((await popup.element()).closest('[data-testid="tooltip-portal"]')).not.toBeNull();
    await userEvent.keyboard("{Escape}");
    await expect.element(popup).not.toBeInTheDocument();
  });

  test("groups delays and keeps default popup content interactive", async () => {
    render(Fixture);
    await page.getByTestId("tip-one").hover();
    await expect.element(page.getByText("First hint")).toBeInTheDocument();
    await page.getByTestId("tip-two").hover();
    const second = page.getByRole("button", { name: "Second hint" });
    await expect.element(second).toBeInTheDocument();
    expect(second.element().closest('[data-instant="delay"]')).not.toBeNull();
    await second.hover();
    await expect.element(second).toBeInTheDocument();
    expect(second.element().closest('[data-side="right"]')).not.toBeNull();
  });

  test("does not open from touch hover events", async () => {
    render(Fixture);
    const trigger = document.querySelector<HTMLElement>('[data-testid="tip-one"]');
    if (!trigger) throw new Error("missing trigger");
    trigger.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, pointerType: "touch" }),
    );
    trigger.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "touch" }));
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
  });

  test("removes the interactive boundary when requested and ignores disabled triggers", async () => {
    render(Fixture);
    await page.getByTestId("noninteractive").hover();
    const popup = page.getByRole("tooltip", { name: "Noninteractive hint" });
    await expect.element(popup).toBeInTheDocument();
    await page.getByTestId("disabled-tip").hover();
    await expect.element(popup).not.toBeInTheDocument();

    await expect.element(page.getByText("Disabled hint")).not.toBeInTheDocument();
    await expect.element(page.getByTestId("disabled-tip")).toHaveAttribute("data-trigger-disabled");
  });

  test("hydrates the exact server-rendered tree without diagnostics", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!--[--><!--[--><!--[--><!--$s1--><!--[--><!--[--><!--$s2--><!----><button id="s2" data-slot="tooltip-trigger"><!---->Hover me<!----><!----><!----></button><!----><!--]--><!--]--> <!--[--><!--$s3--><!--[--><!--[-1--><!--]--><!--]--><!--]--><!----><!----><!--]--><!--]--><!----><!----><!--]--><!--]--><!--]-->';
    document.body.append(target);
    const component = hydrate(SsrFixture, { target });
    await page.getByRole("button", { name: "Hover me" }).hover();
    await expect.element(page.getByRole("tooltip", { name: "Helpful hint" })).toBeInTheDocument();
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
