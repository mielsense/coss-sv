import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import SeparatorFixture from "./separator.browser-fixture.svelte";
import Separator from "./separator.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Separator browser contract", () => {
  test("forwards native attributes, callbacks, refs, snippets, and state attributes", async () => {
    render(SeparatorFixture);

    const separator = page.getByTestId("interactive-separator");
    await expect.element(separator).toHaveAttribute("data-forwarded", "yes");
    await expect.element(separator).toHaveAttribute("data-slot", "separator");
    await expect.element(separator).toHaveAttribute("data-orientation", "vertical");
    await expect.element(separator).toHaveAttribute("aria-orientation", "vertical");
    await expect.element(separator).toHaveAttribute("role", "separator");
    await expect.element(separator).toHaveAttribute("tabindex", "0");
    await expect
      .element(page.getByTestId("separator-snippet"))
      .toHaveTextContent("between sections");
    await expect.element(page.getByTestId("separator-state")).toHaveTextContent("0:SECTION");

    await separator.click();
    await expect.element(page.getByTestId("separator-state")).toHaveTextContent("1:SECTION");
  });

  test("keeps Shards behavior and attributes on the default no-content path", async () => {
    render(SeparatorFixture);

    const separator = page.getByTestId("shards-separator");
    await expect.element(separator).toHaveAttribute("data-forwarded", "shards");
    await expect.element(separator).toHaveAttribute("role", "separator");
    await expect.element(separator).toHaveAttribute("aria-orientation", "horizontal");
    await expect.element(separator).toHaveAttribute("data-orientation", "horizontal");
    await expect.element(separator).toHaveAttribute("data-slot", "separator");
    await expect.element(page.getByTestId("shards-separator-state")).toHaveTextContent("0:SPAN");

    const element = document.querySelector<HTMLElement>('[data-testid="shards-separator"]');
    expect(element?.tagName).toBe("SPAN");
    element?.click();
    await expect.element(page.getByTestId("shards-separator-state")).toHaveTextContent("1:SPAN");
  });

  test("hydrates server-equivalent markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<div data-orientation="horizontal" role="separator" aria-orientation="horizontal" data-slot="separator" class="shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:not-[[class^='h-']]:not-[[class*='_h-']]:self-stretch"></div>`;
    document.body.append(target);

    const component = hydrate(Separator, { target });

    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
