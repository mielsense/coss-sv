import { createRawSnippet, hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./scroll-area.browser-fixture.svelte";
import ScrollArea from "./scroll-area.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ScrollArea browser contract", () => {
  test("measures both axes, mounts both scrollbars and sizes the corner", async () => {
    render(Fixture);

    const root = page.getByTestId("both-root");
    await expect.element(root).toHaveAttribute("data-has-overflow-x");
    await expect.element(root).toHaveAttribute("data-has-overflow-y");

    const element = document.querySelector<HTMLElement>('[data-testid="both-root"]');
    const viewport = element?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');
    const scrollbars = element?.querySelectorAll<HTMLElement>(
      '[data-slot="scroll-area-scrollbar"]',
    );
    const corner = element?.querySelector<HTMLElement>('[data-slot="scroll-area-corner"]');

    if (!element) throw new Error("Both-axis scroll root did not render.");
    expect(viewport?.tabIndex).toBe(0);
    expect(scrollbars?.length).toBe(2);
    expect(scrollbars?.[0]?.dataset.orientation).toBe("vertical");
    expect(scrollbars?.[1]?.dataset.orientation).toBe("horizontal");
    expect(corner).not.toBeNull();
    expect(
      Number.parseFloat(getComputedStyle(element).getPropertyValue("--scroll-area-corner-width")),
    ).toBeGreaterThan(0);
    expect(
      Number.parseFloat(getComputedStyle(element).getPropertyValue("--scroll-area-corner-height")),
    ).toBeGreaterThan(0);
  });

  test("keeps the overflow viewport keyboard accessible", async () => {
    render(Fixture);
    const root = document.querySelector<HTMLElement>('[data-testid="both-root"]');
    const viewport = root?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');

    expect(viewport?.tabIndex).toBe(0);
    viewport?.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect.poll(() => viewport?.scrollTop ?? 0).toBeGreaterThan(0);

    const horizontalRoot = document.querySelector<HTMLElement>('[data-testid="horizontal-root"]');
    const horizontalViewport = horizontalRoot?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    expect(horizontalViewport?.tabIndex).toBe(0);
    horizontalViewport?.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.poll(() => horizontalViewport?.scrollLeft ?? 0).toBeGreaterThan(0);
  });

  test("includes the horizontal gutter in a hydrated auto-height particle", async () => {
    render(Fixture);

    await expect
      .element(page.getByTestId("plain-auto-root"))
      .toHaveAttribute("data-has-overflow-x");
    await expect
      .element(page.getByTestId("gutter-auto-root"))
      .toHaveAttribute("data-has-overflow-x");

    const plainRoot = document.querySelector<HTMLElement>('[data-testid="plain-auto-root"]');
    const gutterRoot = document.querySelector<HTMLElement>('[data-testid="gutter-auto-root"]');
    const plainViewport = plainRoot?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    const gutterViewport = gutterRoot?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    const horizontalScrollbar = gutterRoot?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]',
    );
    const gutterContent = gutterRoot?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-content"]',
    );

    if (
      !plainRoot ||
      !gutterRoot ||
      !plainViewport ||
      !gutterViewport ||
      !gutterContent ||
      !horizontalScrollbar
    ) {
      throw new Error("Auto-height ScrollArea fixture did not finish measuring.");
    }

    expect(plainRoot.getBoundingClientRect().height).toBe(114);
    expect(plainViewport.getBoundingClientRect().height).toBe(112);
    expect(gutterRoot.getBoundingClientRect().height).toBe(124);
    expect(gutterViewport.getBoundingClientRect().height).toBe(122);
    expect(gutterContent.getBoundingClientRect().height).toBe(112);
    expect(getComputedStyle(gutterViewport).paddingBottom).toBe("10px");
    expect(gutterViewport.clientHeight).toBe(122);
    expect(gutterViewport.scrollHeight).toBe(122);
    expect(gutterViewport.scrollWidth).toBe(2896);
    expect(gutterViewport.tabIndex).toBe(0);
    expect(gutterRoot).toHaveAttribute("data-overflow-x-end");
    expect(gutterViewport).toHaveAttribute("data-overflow-x-end");

    horizontalScrollbar.dispatchEvent(
      new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaX: 80 }),
    );
    await expect.poll(() => gutterViewport.scrollLeft).toBeGreaterThan(0);
  });

  test("hides scrollbars and removes the empty viewport from tab order", async () => {
    render(Fixture);
    const root = document.querySelector<HTMLElement>('[data-testid="static-root"]');
    const viewport = root?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]');

    await expect
      .element(page.getByTestId("static-root"))
      .not.toHaveAttribute("data-has-overflow-x");
    await expect
      .element(page.getByTestId("static-root"))
      .not.toHaveAttribute("data-has-overflow-y");
    expect(viewport?.tabIndex).toBe(-1);
    expect(root?.querySelector('[data-slot="scroll-area-scrollbar"]')).toBeNull();
    expect(root?.querySelector('[data-slot="scroll-area-corner"]')).toBeNull();
  });

  test("forwards callbacks and refs and hydrates without warnings", async () => {
    render(Fixture);
    await page.getByTestId("both-root").click();
    await expect.element(page.getByTestId("state")).toHaveTextContent("1:DIV");

    document.body.innerHTML = "";
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!----><div role="presentation" style="position: relative; --scroll-area-corner-width: 0px; --scroll-area-corner-height: 0px" class="size-full min-h-0 h-64 rounded-lg border" aria-label="Release tags" data-forwarded="root"><!--[--><!----><div class="h-full rounded-[inherit] outline-none transition-shadows focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background hide-scrollbar svelte-ssguf4" role="presentation" tabindex="-1" style="overflow: scroll;" data-slot="scroll-area-viewport"><!--[--><!----><div role="presentation" style="min-width: fit-content;min-width: 0" data-slot="scroll-area-content"><div data-testid="content">Scrollable content</div><!----><!----><!----></div><!----><!--]--><!----><!----></div><!----><!--]--> <!--[--><!--[-1--><!--]--><!--]--><!----> <!--[--><!--[-1--><!--]--><!--]--><!----> <!--[--><!--[-1--><!--]--><!--]--><!----><!----></div><!----><!--]--><!--]-->';
    document.body.append(target);
    const children = createRawSnippet(() => ({
      render: () => '<div data-testid="content">Scrollable content</div>',
    }));
    const component = hydrate(ScrollArea, {
      props: {
        "aria-label": "Release tags",
        children,
        class: "h-64 rounded-lg border",
        "data-forwarded": "root",
      },
      target,
    });

    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
