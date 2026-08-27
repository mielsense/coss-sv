import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import CheckboxFixture from "./checkbox.browser-fixture.svelte";
import Checkbox from "./checkbox.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Checkbox browser contract", () => {
  test("supports labels, binding, callbacks, indeterminate state, forms, disabled state, and refs", async () => {
    render(CheckboxFixture);

    const checkbox = page.getByTestId("checkbox");
    await expect.element(checkbox).toHaveAttribute("role", "checkbox");
    await expect.element(checkbox).toHaveAttribute("aria-checked", "false");
    await expect.element(checkbox).toHaveAccessibleName("Accept terms");
    document.querySelector<HTMLElement>('[data-testid="checkbox"]')?.click();
    await expect.element(checkbox).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("checkbox-state")).toHaveTextContent("true:true:SPAN");

    const form = document.querySelector<HTMLFormElement>('[data-testid="checkbox-form"]');
    expect(new FormData(form ?? undefined).get("terms")).toBe("yes");

    document.querySelector<HTMLElement>('[data-testid="checkbox"]')?.focus();
    await userEvent.keyboard("{Space}");
    await expect.element(checkbox).toHaveAttribute("aria-checked", "false");
    expect(new FormData(form ?? undefined).get("terms")).toBeNull();

    await expect
      .element(page.getByTestId("indeterminate"))
      .toHaveAttribute("aria-checked", "mixed");
    await expect.element(page.getByTestId("disabled")).toHaveAttribute("aria-disabled", "true");
    document.querySelector<HTMLElement>('[data-testid="disabled"]')?.click();
    await expect.element(page.getByTestId("disabled")).toHaveAttribute("aria-checked", "false");
  });

  test("hydrates without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<span data-slot="checkbox" role="checkbox" aria-checked="false" data-unchecked=""><span data-slot="checkbox-indicator" data-unchecked=""><svg aria-hidden="true"><path d="M5.252 12.7 10.2 18.63 18.748 5.37"></path></svg></span></span><input type="checkbox" id="hydrated-checkbox" tabindex="-1" aria-hidden="true">`;
    document.body.append(target);

    const component = hydrate(Checkbox, {
      props: { id: "hydrated-checkbox" },
      target,
    });

    expect(target.querySelector('input[type="checkbox"]')?.id).toBe("hydrated-checkbox");
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
