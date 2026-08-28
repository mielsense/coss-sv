import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import AccordionFixture from "./accordion.browser-fixture.svelte";
import AccordionDefaultFixture from "./accordion-default.browser-fixture.svelte";
import AccordionRoot from "./accordion-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Accordion browser contract", () => {
  test("supports single, multiple, disabled, callback, and bindable value contracts", async () => {
    render(AccordionFixture);

    const one = page.getByRole("button", { name: "Single one" });
    const two = page.getByRole("button", { name: "Single two" });
    const three = page.getByRole("button", { name: "Single three" });
    await expect.element(one).toHaveAttribute("aria-expanded", "true");
    await three.click();
    await expect.element(one).toHaveAttribute("aria-expanded", "false");
    await expect.element(three).toHaveAttribute("aria-expanded", "true");
    await expect.element(page.getByTestId("single-value")).toHaveTextContent("three");
    await expect.element(page.getByTestId("changes")).toHaveTextContent("three");

    document
      .querySelector<HTMLButtonElement>('[aria-label="Single accordion"] [data-disabled] button')
      ?.click();
    await expect.element(two).toHaveAttribute("aria-expanded", "false");
    await expect.element(page.getByTestId("single-value")).toHaveTextContent("three");

    await page.getByRole("button", { name: "Multiple alpha" }).click();
    await page.getByRole("button", { name: "Multiple beta" }).click();
    await expect.element(page.getByTestId("multiple-value")).toHaveTextContent("alpha,beta");

    await page.getByRole("button", { name: "Deferred item" }).click();
    await expect.element(page.getByTestId("deferred-value")).toHaveTextContent("deferred");
  });

  test("keeps native trigger keyboard activation and ARIA relationships", async () => {
    render(AccordionFixture);
    const trigger = page.getByRole("button", { name: "Single three" });
    const element = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => button.textContent?.includes("Single three"),
    );
    element?.focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
    const panelId = element?.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId ?? "")?.getAttribute("aria-labelledby")).toBe(
      element?.id,
    );
  });

  test("keeps the built-in chevron decorative and tied to the open-state rotation selector", async () => {
    render(AccordionFixture);
    const trigger = page.getByRole("button", { name: "Single three" });
    const element = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => button.textContent?.includes("Single three"),
    );
    const indicator = element?.querySelector<SVGElement>('[data-slot="accordion-indicator"]');

    expect(indicator).not.toBeNull();
    expect(indicator?.getAttribute("aria-hidden")).toBe("true");
    expect(indicator?.childElementCount).toBeGreaterThan(0);
    expect(
      Array.from(indicator?.children ?? []).every(
        (child) => child.getAttribute("stroke-width") === "2",
      ),
    ).toBe(true);
    expect(indicator?.classList.contains("size-4")).toBe(true);
    expect(indicator?.classList.contains("transition-transform")).toBe(true);
    expect(element?.className).toContain(
      "data-panel-open:*:data-[slot=accordion-indicator]:rotate-180",
    );

    await trigger.click();
    await expect.element(trigger).toHaveAttribute("data-panel-open");
    await trigger.click();
    await expect.element(trigger).not.toHaveAttribute("data-panel-open");
  });

  test("exposes exact height motion hooks and honors reduced-motion without adding overrides", async () => {
    render(AccordionFixture);
    const trigger = page.getByRole("button", { name: "Single one" });
    await trigger.click();
    await trigger.click();
    const panel = document.querySelector<HTMLElement>('[data-testid="single-one"]');
    expect(panel?.className).toContain("transition-[height]");
    expect(panel?.className).toContain("data-starting-style:h-0");
    expect(panel?.className).toContain("data-ending-style:h-0");
    expect(panel?.style.getPropertyValue("--accordion-panel-height")).toBeTruthy();
    expect(panel?.className).toContain("duration-200");
    expect(panel?.className).not.toContain("motion-reduce");
  });

  test("hydrates the server-rendered root without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!----><div data-slot="accordion"><!----><!----></div><!----><!--]--><!--]-->';
    document.body.append(target);
    const component = hydrate(AccordionRoot, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector('[data-slot="accordion"]')).not.toBeNull();
    await unmount(component);
    warning.mockRestore();
  });

  test("reads defaultValue once and ignores later default prop changes", async () => {
    const view = render(AccordionDefaultFixture, { defaultValue: ["one"] });
    const one = page.getByRole("button", { name: "Default one" });
    const two = page.getByRole("button", { name: "Default two" });

    await expect.element(one).toHaveAttribute("aria-expanded", "true");
    await view.rerender({ defaultValue: ["two"] });
    await expect.element(one).toHaveAttribute("aria-expanded", "true");
    await expect.element(two).toHaveAttribute("aria-expanded", "false");

    await two.click();
    await expect.element(two).toHaveAttribute("aria-expanded", "true");
    await view.rerender({ defaultValue: ["one"] });
    await expect.element(two).toHaveAttribute("aria-expanded", "true");
    await expect.element(one).toHaveAttribute("aria-expanded", "false");
  });
});
