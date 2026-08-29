import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { cleanup, render } from "vitest-browser-svelte";
import Fixture from "./tooltip.browser-fixture.svelte";
import SsrFixture from "./tooltip.ssr-fixture.svelte";
import AttachmentFixture from "./tooltip-attachment.browser-fixture.svelte";

afterEach(() => {
  cleanup();
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

  test("composes inside a controlled toggle group without ownership diagnostics", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    render(Fixture);

    await page.getByTestId("grouped-tooltip-trigger").click();
    await expect.element(page.getByTestId("grouped-tooltip-value")).toHaveTextContent("");
    expect(warning.mock.calls.flat().join("\n")).not.toContain("ownership_invalid_binding");

    warning.mockRestore();
  });

  test("attaches focus, hover, description, state, and Escape behavior to the target node", async () => {
    render(AttachmentFixture);
    const target = page.getByTestId("attached-focus");
    target.element().focus();
    const popup = page.getByRole("tooltip", { name: "Attached hint" });
    await expect.element(popup).toBeInTheDocument();
    await expect.element(target).toHaveAttribute("data-popup-open");
    await expect.element(target).toHaveAttribute("data-tooltip-trigger");
    expect(target.element().getAttribute("aria-describedby")).toBe((await popup.element()).id);
    await userEvent.keyboard("{Escape}");
    await expect.element(popup).not.toBeInTheDocument();

    await target.hover();
    await expect.element(popup).toBeInTheDocument();
  });

  test("honors disabled and closeOnClick attachment options", async () => {
    render(AttachmentFixture);
    const disabled = page.getByTestId("attached-disabled");
    await expect.element(disabled).toHaveAttribute("data-trigger-disabled");
    disabled.element().focus();
    await expect.element(page.getByText("Disabled hint")).not.toBeInTheDocument();

    const persistent = page.getByTestId("attached-persistent");
    persistent.element().focus();
    await expect.element(page.getByText("Persistent hint")).toBeInTheDocument();
    await persistent.click();
    await expect.element(page.getByText("Persistent hint")).toBeInTheDocument();

    const closing = page.getByTestId("attached-focus");
    closing.element().focus();
    await expect.element(page.getByText("Attached hint")).toBeInTheDocument();
    await closing.click();
    await expect.element(page.getByText("Attached hint")).not.toBeInTheDocument();
  });

  test("unregisters the target and its listeners when the attachment is destroyed", async () => {
    render(AttachmentFixture);
    await page.getByTestId("remove-attached-target").click();
    await expect.element(page.getByTestId("attached-cleanup")).not.toBeInTheDocument();
    await page.getByTestId("open-removed-target").click();
    await expect.element(page.getByTestId("cleanup-result")).toHaveTextContent("missing");
  });

  test("forwards the attachment through the registered Toolbar and Toggle target", async () => {
    render(AttachmentFixture);
    const target = page.getByRole("button", { name: "Composed toggle" });
    await expect.element(target).toHaveAttribute("data-slot", "toggle");
    target.element().focus();
    await expect.element(page.getByRole("tooltip", { name: "Composed hint" })).toBeInTheDocument();
    await expect.element(target).toHaveAttribute("data-popup-open");
  });

  test("shares the provider delay and opens sibling attachments during the instant window", async () => {
    render(AttachmentFixture);
    const first = page.getByTestId("attached-grouped-first");
    await first.hover();
    await new Promise((resolve) => setTimeout(resolve, 80));
    await expect.element(page.getByText("Grouped first hint")).not.toBeInTheDocument();
    await expect.element(page.getByText("Grouped first hint")).toBeInTheDocument();

    const started = performance.now();
    await page.getByTestId("attached-grouped-second").hover();
    await expect.element(page.getByText("Grouped second hint")).toBeInTheDocument();
    expect(performance.now() - started).toBeLessThan(200);
  });

  test("resets removed roots without leaking the instant phase across providers", async () => {
    render(AttachmentFixture);
    await page.getByTestId("attached-grouped-first").hover();
    await expect.element(page.getByText("Grouped first hint")).toBeInTheDocument();
    await page.getByTestId("remove-grouped-first").click();

    await page.getByTestId("attached-grouped-second").hover();
    await new Promise((resolve) => setTimeout(resolve, 80));
    await expect.element(page.getByText("Grouped second hint")).not.toBeInTheDocument();
    await expect.element(page.getByText("Grouped second hint")).toBeInTheDocument();

    await page.getByTestId("attached-isolated").hover();
    await new Promise((resolve) => setTimeout(resolve, 80));
    await expect.element(page.getByText("Isolated hint")).not.toBeInTheDocument();
    await expect.element(page.getByText("Isolated hint")).toBeInTheDocument();
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
