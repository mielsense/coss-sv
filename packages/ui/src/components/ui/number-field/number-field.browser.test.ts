import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import NumberFieldFixture from "./number-field.browser-fixture.svelte";
import NumberFieldFieldHydrationFixture from "./number-field-field.hydration-fixture.svelte";
import NumberFieldRoot from "./number-field-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("NumberField browser contract", () => {
  test("supports locale text, buttons, keys, bounds, binding, refs, and forms", async () => {
    render(NumberFieldFixture);
    const input = page.getByTestId("number-input");
    await expect.element(input).toHaveValue("1,5");
    await expect.element(input).toHaveAccessibleName("Quantity");
    await expect.element(input).toHaveAttribute("role", "spinbutton");
    await expect.element(input).toHaveAttribute("aria-valuenow", "1.5");
    await expect.element(input).toHaveAttribute("aria-valuemin", "-2");
    await expect.element(input).toHaveAttribute("aria-valuemax", "3");
    await expect.element(input).toHaveAttribute("aria-valuetext", "1,5");
    await expect.element(input).toHaveAttribute("inputmode", "decimal");
    await expect.element(input).toHaveAttribute("required");
    await expect.element(page.getByTestId("number-state")).toHaveTextContent("1.5:0:INPUT");

    await userEvent.click(page.getByTestId("increment"));
    await expect.element(input).toHaveValue("2,0");
    await expect.element(input).toHaveAttribute("aria-valuenow", "2");
    await expect.element(input).toHaveAttribute("aria-valuetext", "2,0");
    await userEvent.click(page.getByTestId("decrement"));
    await expect.element(input).toHaveValue("1,5");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(input).toHaveValue("2,0");
    await userEvent.keyboard("{PageUp}{PageDown}");
    await expect.element(input).toHaveValue("2,0");
    await userEvent.keyboard("{Home}");
    await expect.element(input).toHaveValue("-2,0");
    await userEvent.keyboard("{End}");
    await expect.element(input).toHaveValue("3,0");
    await expect.element(page.getByTestId("increment")).toBeDisabled();

    const element = document.querySelector<HTMLInputElement>('[data-testid="number-input"]');
    if (!element) throw new Error("number input missing");
    element.value = "100";
    element.dispatchEvent(new InputEvent("input", { bubbles: true, data: "0" }));
    await expect.element(input).toHaveValue("100");
    await expect.element(input).toHaveAttribute("aria-valuenow", "100");
    await expect.element(input).toHaveAttribute("aria-valuetext", "100");
    element.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await expect.element(input).toHaveValue("3,0");
    await expect.element(input).toHaveAttribute("aria-valuenow", "3");

    element.focus();
    element.value = "-1,25";
    element.dispatchEvent(new InputEvent("input", { bubbles: true, data: "5" }));
    element.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await expect.element(input).toHaveValue("-1,25");

    const form = document.querySelector<HTMLFormElement>('[data-testid="number-form"]');
    expect(new FormData(form ?? undefined).get("quantity")).toBe("-1,25");
    await expect.element(page.getByTestId("number-state")).toHaveTextContent("-1.25:");
  });

  test("publishes formatted, empty, and consumer-overridden spinbutton values", async () => {
    render(NumberFieldFixture);

    const currency = page.getByTestId("currency-number");
    await expect.element(currency).toHaveAttribute("role", "spinbutton");
    await expect.element(currency).toHaveAccessibleName("Price");
    await expect.element(currency).toHaveAttribute("aria-valuenow", "12.5");
    await expect.element(currency).toHaveAttribute("aria-valuemin", "0");
    await expect.element(currency).toHaveAttribute("aria-valuemax", "100");
    await expect.element(currency).toHaveAttribute("aria-valuetext", "$12.50");

    const empty = page.getByTestId("empty-number");
    await expect.element(empty).toHaveAttribute("role", "spinbutton");
    await expect.element(empty).toHaveAccessibleName("Empty number");
    await expect.element(empty).not.toHaveAttribute("aria-valuenow");
    await expect.element(empty).not.toHaveAttribute("aria-valuetext");
    await expect.element(empty).toHaveAttribute("aria-valuemin", "-10");
    await expect.element(empty).toHaveAttribute("aria-valuemax", "10");

    const overridden = page.getByTestId("overridden-number");
    await expect.element(overridden).toHaveAccessibleName("Input override");
    await expect.element(overridden).toHaveAttribute("aria-valuenow", "6");
    await expect.element(overridden).toHaveAttribute("aria-valuemin", "-8");
    await expect.element(overridden).toHaveAttribute("aria-valuemax", "8");
    await expect.element(overridden).toHaveAttribute("aria-valuetext", "Six widgets");
  });

  test("inherits Field labels, descriptions, and dynamic errors with and without a scrub area", async () => {
    render(NumberFieldFixture);

    const fieldInput = page.getByTestId("field-number-input");
    await expect.element(fieldInput).toHaveAccessibleName("Field quantity");
    await expect.element(fieldInput).toHaveAccessibleDescription("Field quantity description");
    await expect.element(fieldInput).not.toHaveAttribute("aria-invalid");
    await userEvent.click(page.getByTestId("toggle-field-error"));
    await expect
      .element(fieldInput)
      .toHaveAccessibleDescription("Field quantity description Field quantity error");
    await expect.element(fieldInput).toHaveAttribute("aria-invalid", "true");
    await userEvent.click(page.getByTestId("toggle-field-error"));
    await expect.element(fieldInput).toHaveAccessibleDescription("Field quantity description");
    await expect.element(fieldInput).not.toHaveAttribute("aria-invalid");

    const scrubInput = page.getByTestId("field-scrub-number-input");
    await expect.element(scrubInput).toHaveAccessibleName("Scrub quantity");
    await expect.element(scrubInput).toHaveAccessibleDescription("Scrub quantity description");
  });

  test("preserves explicit null as removal instead of falling back to NumberField state", async () => {
    render(NumberFieldFixture);
    const input = page.getByTestId("null-aria-number");

    await expect.element(input).not.toHaveAttribute("aria-labelledby");
    await expect.element(input).not.toHaveAttribute("aria-describedby");
    await expect.element(input).not.toHaveAttribute("aria-valuenow");
    await expect.element(input).not.toHaveAttribute("aria-valuemin");
    await expect.element(input).not.toHaveAttribute("aria-valuemax");
    await expect.element(input).not.toHaveAttribute("aria-valuetext");
  });

  test("rejects invalid fill and delegates its root to one exact group element", async () => {
    render(NumberFieldFixture);
    const invalid = document.querySelector<HTMLInputElement>('[data-testid="invalid-fill-number"]');
    if (!invalid) throw new Error("invalid fill number missing");
    invalid.value = "abc";
    invalid.dispatchEvent(new InputEvent("input", { bubbles: true, data: "c" }));
    expect(invalid.value).toBe("0");
    await expect.element(page.getByTestId("unnamed-number")).toHaveAccessibleName("Number field");
    await expect
      .element(page.getByTestId("unnamed-number"))
      .toHaveAttribute("aria-roledescription", "Number field");
    invalid.focus();
    await userEvent.keyboard("{Home}{End}{PageUp}{PageDown}");
    expect(invalid.value).toBe("0");
    expect(
      document
        .querySelector<HTMLFormElement>('[data-testid="required-number-form"]')
        ?.checkValidity(),
    ).toBe(false);

    const delegated = document.querySelector<HTMLDivElement>('[data-testid="delegated-number"]');
    expect(
      delegated?.parentElement?.querySelectorAll('[data-testid="delegated-number"]'),
    ).toHaveLength(1);
    expect(delegated?.dataset.slot).toBe("number-field");
    expect(delegated?.getAttribute("role")).toBe("group");
    expect(delegated?.className).toContain("rounded-lg");
    expect(delegated?.className).toContain("gap-0");
    expect(delegated?.querySelector('[data-testid="delegated-number-input"]')).not.toBeNull();
    await expect.element(page.getByTestId("delegate-ref")).toHaveTextContent("number-field");

    const scrub = document.querySelector('[data-slot="number-field-scrub-area"]');
    expect(scrub?.tagName).toBe("SPAN");
    expect(scrub?.getAttribute("role")).toBe("presentation");
    expect(scrub?.getAttribute("style")).toContain("touch-action: none");
    expect(scrub?.querySelector('[data-slot="label"]')?.className).toContain("font-medium");

    const cursorIcon = page.getByTestId("cursor-grow-icon");
    await expect.element(cursorIcon).toHaveAttribute("aria-hidden", "true");
    await expect.element(cursorIcon).toHaveAttribute("width", "26");
    await expect.element(cursorIcon).toHaveAttribute("height", "14");
    await expect.element(cursorIcon).toHaveClass("cursor-base");
    await expect.element(cursorIcon).toHaveClass("cursor-active");
    expect((await cursorIcon.element()).querySelectorAll("path").length).toBeGreaterThan(0);
    await expect.element(page.getByTestId("cursor-grow-ref")).toHaveTextContent("svg");
  });

  test("does not step on wheel by default and preserves disabled semantics", async () => {
    render(NumberFieldFixture);
    const input = document.querySelector<HTMLInputElement>('[data-testid="number-input"]');
    if (!input) throw new Error("number input missing");
    input.focus();
    input.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: -100 }));
    await expect.element(page.getByTestId("number-input")).toHaveValue("1,5");

    const disabled = page.getByTestId("disabled-number");
    await expect.element(disabled).toBeDisabled();
    await expect.element(disabled).toHaveAttribute("role", "spinbutton");

    const readonly = page.getByTestId("readonly-number");
    await expect.element(readonly).toHaveAttribute("readonly");
    await expect.element(readonly).toHaveAttribute("aria-invalid", "true");
    document.querySelector<HTMLInputElement>('[data-testid="readonly-number"]')?.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(readonly).toHaveValue("2");

    const wheel = document.querySelector<HTMLInputElement>('[data-testid="wheel-number"]');
    wheel?.focus();
    wheel?.dispatchEvent(
      new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: -100 }),
    );
    await expect.element(page.getByTestId("wheel-number")).toHaveValue("3");

    const cancelled = document.querySelector<HTMLInputElement>(
      '[data-testid="cancelled-wheel-number"]',
    );
    cancelled?.focus();
    const cancelledEvent = new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaY: -100,
    });
    cancelled?.dispatchEvent(cancelledEvent);
    expect(cancelledEvent.defaultPrevented).toBe(true);
    await expect.element(page.getByTestId("cancelled-wheel-number")).toHaveValue("1");

    const removed = document.querySelector<HTMLInputElement>(
      '[data-testid="remount-wheel-number"]',
    );
    await userEvent.click(page.getByTestId("toggle-wheel"));
    removed?.dispatchEvent(
      new WheelEvent("wheel", { bubbles: true, cancelable: true, deltaY: -100 }),
    );
    await userEvent.click(page.getByTestId("toggle-wheel"));
    await expect.element(page.getByTestId("remount-wheel-number")).toHaveValue("1");
  });

  test("hydrates its SSR root without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<!--[--><!--$s1--><!--[-1--><div class="flex w-full flex-col items-start gap-2" data-size="default" data-slot="number-field"><!----></div><!--]--><!--]-->`;
    document.body.append(target);
    const component = hydrate(NumberFieldRoot, { target });
    expect(target.querySelector('[data-slot="number-field"]')).not.toBeNull();
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });

  test("hydrates direct Field relationships without losing the spinbutton name or description", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<!--[--><!--[--><!--[--><!----><div data-slot="field" class="flex flex-col items-start gap-2"><!--[--><!--$s7--><!--[--><!--$s8--><!----><label id="hydrated-number-label" data-slot="field-label" class="inline-flex items-center gap-2 font-medium text-base/4.5 text-foreground data-disabled:opacity-64 sm:text-sm/4"><!---->Hydrated quantity<!----><!----></label><!----><!--]--><!--]--> <!--[--><!--$s9--><!--[-1--><div class="flex w-full flex-col items-start gap-2" data-size="default" data-slot="number-field"><!--[--><!--$s10--><!----><input id="hydrated-number" aria-labelledby="hydrated-number-label" aria-describedby="hydrated-number-description" value="3" aria-roledescription="Number field" autocomplete="off" autocorrect="off" class="h-8.5 in-data-[size=lg]:h-9.5 in-data-[size=sm]:h-7.5 w-full min-w-0 grow bg-transparent in-data-[size=sm]:px-[calc(--spacing(2.5)-1px)] px-[calc(--spacing(3)-1px)] text-center text-foreground tabular-nums in-data-[size=lg]:leading-9.5 in-data-[size=sm]:leading-7.5 leading-8.5 outline-none sm:h-7.5 sm:in-data-[size=lg]:h-8.5 sm:in-data-[size=sm]:h-6.5 sm:in-data-[size=lg]:leading-8.5 sm:in-data-[size=sm]:leading-8.5 sm:leading-7.5" data-slot="number-field-input" inputmode="numeric" role="spinbutton" spellcheck="false" type="text" aria-valuemax="10" aria-valuemin="1" aria-valuenow="3" aria-valuetext="3" data-testid="hydrated-field-number-input"><!----><!----><!--]--><!----></div><!--]--><!--]--> <!--[--><!--$s11--><!--[--><!--$s12--><!----><p id="hydrated-number-description" data-slot="field-description" class="text-muted-foreground text-xs"><!---->Hydrated quantity description<!----><!----></p><!----><!--]--><!--]--><!----><!----><!----><!----><!----></div><!----><!--]--><!--]--><!--]-->`;
    document.body.append(target);

    const component = hydrate(NumberFieldFieldHydrationFixture, { target });
    const input = page.getByTestId("hydrated-field-number-input");
    await expect.element(input).toHaveAccessibleName("Hydrated quantity");
    await expect.element(input).toHaveAccessibleDescription("Hydrated quantity description");
    await unmount(component);
    warning.mockRestore();
  });
});
