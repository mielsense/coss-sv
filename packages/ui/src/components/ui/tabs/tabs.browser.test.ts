import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import TabsFixture from "./tabs.browser-fixture.svelte";
import TabsDefaultFixture from "./tabs-default.browser-fixture.svelte";
import TabsRoot from "./tabs-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

function tabByText(text: string): HTMLButtonElement | undefined {
  return Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(
    (tab) => tab.textContent === text,
  );
}

describe("Tabs browser contract", () => {
  test("supports pointer activation, bindable values, callbacks, disabled tabs, and panel lifecycle", async () => {
    render(TabsFixture);
    const one = page.getByRole("tab", { exact: true, name: "One" });
    const two = page.getByRole("tab", { exact: true, name: "Two" });
    const three = page.getByRole("tab", { exact: true, name: "Three" });

    await expect.element(one).toHaveAttribute("aria-selected", "true");
    await three.click();
    await expect.element(three).toHaveAttribute("aria-selected", "true");
    await expect.element(page.getByTestId("value")).toHaveTextContent("three");
    await expect.element(page.getByTestId("changes")).toHaveTextContent("three");
    await expect.element(page.getByTestId("panel-one")).not.toBeInTheDocument();
    await expect.element(page.getByTestId("panel-three")).toBeInTheDocument();

    tabByText("Two")?.click();
    await expect.element(two).toHaveAttribute("aria-selected", "false");
    await expect.element(page.getByTestId("panel-two")).toHaveAttribute("hidden");

    await page.getByRole("tab", { exact: true, name: "Deferred two" }).click();
    await expect.element(page.getByTestId("deferred-value")).toHaveTextContent("deferred-two");
  });

  test("uses manual horizontal activation with roving focus, Home, End, and loop traversal", async () => {
    render(TabsFixture);
    tabByText("One")?.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tabByText("Two")).toHaveFocus();
    expect(tabByText("Two")?.getAttribute("aria-selected")).toBe("false");
    await userEvent.keyboard("{ArrowRight}");
    expect(tabByText("Three")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(tabByText("Three")?.getAttribute("aria-selected")).toBe("true");
    await userEvent.keyboard("{Home}");
    expect(tabByText("One")).toHaveFocus();
    await userEvent.keyboard("{End}");
    expect(tabByText("Three")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(tabByText("One")).toHaveFocus();
  });

  test("uses vertical traversal and activate-on-focus", async () => {
    render(TabsFixture);
    tabByText("Vertical one")?.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(tabByText("Vertical two")).toHaveFocus();
    expect(tabByText("Vertical two")?.getAttribute("aria-selected")).toBe("true");
    expect(document.querySelector('[aria-label="Vertical tabs"]')).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  test("links tabs and panels and publishes indicator geometry variables", async () => {
    render(TabsFixture);
    const tab = tabByText("One");
    const panel = document.querySelector<HTMLElement>('[data-testid="panel-one"]');
    expect(tab?.getAttribute("aria-controls")).toBe(panel?.id);
    expect(panel?.getAttribute("aria-labelledby")).toBe(tab?.id);

    const indicator = document.querySelector<HTMLElement>(
      '[data-testid="controlled-list"] [data-slot="tab-indicator"]',
    );
    await expect.poll(() => indicator?.style.getPropertyValue("--active-tab-width")).toBeTruthy();
    expect(indicator?.style.getPropertyValue("--active-tab-height")).toBeTruthy();
    expect(indicator?.className).toContain("duration-200");
    expect(indicator?.className).not.toContain("motion-reduce");
  });

  test("hydrates the server-rendered root without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!----><div data-orientation="horizontal" data-activation-direction="none" class="flex flex-col gap-2 data-[orientation=vertical]:flex-row" data-slot="tabs"><!----><!----></div><!----><!--]--><!--]-->';
    document.body.append(target);
    const component = hydrate(TabsRoot, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
    await unmount(component);
    warning.mockRestore();
  });

  test("reads defaultValue once and ignores later default prop changes", async () => {
    const view = render(TabsDefaultFixture, { defaultValue: "one" });
    const one = page.getByRole("tab", { name: "Default tab one" });
    const two = page.getByRole("tab", { name: "Default tab two" });

    await expect.element(one).toHaveAttribute("aria-selected", "true");
    await view.rerender({ defaultValue: "two" });
    await expect.element(one).toHaveAttribute("aria-selected", "true");
    await expect.element(two).toHaveAttribute("aria-selected", "false");

    await two.click();
    await expect.element(two).toHaveAttribute("aria-selected", "true");
    await view.rerender({ defaultValue: "one" });
    await expect.element(two).toHaveAttribute("aria-selected", "true");
    await expect.element(one).toHaveAttribute("aria-selected", "false");
  });
});
