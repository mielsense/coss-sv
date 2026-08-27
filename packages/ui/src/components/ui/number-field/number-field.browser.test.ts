import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import NumberFieldFixture from "./number-field.browser-fixture.svelte";
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
    await expect.element(input).toHaveAttribute("inputmode", "decimal");
    await expect.element(input).toHaveAttribute("required");
    await expect.element(page.getByTestId("number-state")).toHaveTextContent("1.5:0:INPUT");

    await userEvent.click(page.getByTestId("increment"));
    await expect.element(input).toHaveValue("2,0");
    await userEvent.click(page.getByTestId("decrement"));
    await expect.element(input).toHaveValue("1,5");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}{PageUp}");
    await expect.element(input).toHaveValue("3,0");
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
    element.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await expect.element(input).toHaveValue("3,0");

    element.focus();
    element.value = "-1,25";
    element.dispatchEvent(new InputEvent("input", { bubbles: true, data: "5" }));
    element.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
    await expect.element(input).toHaveValue("-1,25");

    const form = document.querySelector<HTMLFormElement>('[data-testid="number-form"]');
    expect(new FormData(form ?? undefined).get("quantity")).toBe("-1,25");
    await expect.element(page.getByTestId("number-state")).toHaveTextContent("-1.25:");
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
    await expect.element(disabled).toHaveAttribute("aria-roledescription", "Number field");

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
  });

  test("hydrates its SSR root without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<!--[--><!--$s1--><div class="flex w-full flex-col items-start gap-2" data-size="default" data-slot="number-field"><!----></div><!--]-->`;
    document.body.append(target);
    const component = hydrate(NumberFieldRoot, { target });
    expect(target.querySelector('[data-slot="number-field"]')).not.toBeNull();
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
