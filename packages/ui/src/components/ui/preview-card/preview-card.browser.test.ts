import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./preview-card.browser-fixture.svelte";
import SsrFixture from "./preview-card.ssr-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});
describe("PreviewCard browser contract", () => {
  test("opens on hover and focus, preserves the interactive boundary, portal, placement, and exact geometry", async () => {
    render(Fixture);
    const trigger = page.getByTestId("preview-trigger");
    await trigger.hover();
    const content = page.getByText("Beautifully designed components.");
    await expect.element(content).toBeInTheDocument();
    const popup = content.element().closest<HTMLElement>('[data-slot="preview-card-content"]');
    expect(popup?.className).toContain("w-64");
    expect(popup?.className).toContain("transition-[scale,opacity]");
    expect(popup?.closest('[data-testid="preview-portal"]')).not.toBeNull();
    expect(popup?.closest('[data-side="right"]')).not.toBeNull();
    await content.hover();
    await expect.element(content).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect.element(content).not.toBeInTheDocument();
  });

  test("opens from keyboard focus", async () => {
    render(Fixture);
    const content = page.getByText("Beautifully designed components.");
    await userEvent.tab();
    await expect.element(content).toBeInTheDocument();
  });

  test("does not open from touch hover events", async () => {
    render(Fixture);
    const trigger = document.querySelector<HTMLElement>('[data-testid="preview-trigger"]');
    if (!trigger) throw new Error("missing trigger");
    trigger.dispatchEvent(
      new PointerEvent("pointerenter", { bubbles: true, pointerType: "touch" }),
    );
    trigger.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "touch" }));
    expect(document.querySelector('[data-slot="preview-card-content"]')).toBeNull();
  });

  test("dismisses on an outside press", async () => {
    render(Fixture);
    const content = page.getByText("Beautifully designed components.");
    await page.getByTestId("preview-trigger").hover();
    await expect.element(content).toBeInTheDocument();
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await expect.element(content).not.toBeInTheDocument();
  });

  test("hydrates the exact server-rendered tree without diagnostics", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!--[--><!--[--><!--[--><!--$s1--><!----><button id="s1" data-slot="preview-card-trigger"><!---->coss.com/ui<!----><!----><!----></button><!----><!--]--><!--]--> <!--[--><!--[--><!--[-1--><!--]--><!--]--><!--]--><!----><!----><!--]--><!--]--><!--]-->';
    document.body.append(target);
    const component = hydrate(SsrFixture, { target });
    await page.getByRole("button", { name: "coss.com/ui" }).hover();
    await expect.element(page.getByText("Beautifully designed components.")).toBeInTheDocument();
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
