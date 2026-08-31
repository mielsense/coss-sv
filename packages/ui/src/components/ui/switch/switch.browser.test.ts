import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import SwitchFixture from "./switch.browser-fixture.svelte";
import Switch from "./switch.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Switch browser contract", () => {
  test("supports labels, binding, callbacks, forms, controlled and disabled states, keyboard, and refs", async () => {
    render(SwitchFixture);

    const control = page.getByTestId("switch");
    await expect.element(control).toHaveAttribute("role", "switch");
    await expect.element(control).toHaveAttribute("aria-checked", "false");
    await expect.element(control).toHaveAccessibleName("Marketing emails");
    document.querySelector<HTMLElement>('[data-testid="switch"]')?.click();
    await expect.element(control).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("switch-state")).toHaveTextContent("true:true:SPAN");

    const form = document.querySelector<HTMLFormElement>('[data-testid="switch-form"]');
    expect(new FormData(form ?? undefined).get("marketing")).toBe("yes");

    document.querySelector<HTMLElement>('[data-testid="switch"]')?.focus();
    await userEvent.keyboard("{Space}");
    await expect.element(control).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard("{Enter}");
    await expect.element(control).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("controlled-on")).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("default-on")).toHaveAttribute("aria-checked", "true");
    document.querySelector<HTMLElement>('[data-testid="canceled"]')?.click();
    await expect.element(page.getByTestId("canceled")).toHaveAttribute("aria-checked", "false");
    await expect
      .element(page.getByTestId("switch-state"))
      .toHaveTextContent("true:none:click:true:SPAN");
    await expect.element(page.getByTestId("disabled")).toHaveAttribute("aria-disabled", "true");
    document.querySelector<HTMLElement>('[data-testid="disabled"]')?.click();
    await expect.element(page.getByTestId("disabled")).toHaveAttribute("aria-checked", "false");
  });

  test("hydrates without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<span data-slot="switch" role="switch" aria-checked="false" data-unchecked=""><span data-slot="switch-thumb" data-unchecked=""></span></span><input type="checkbox" id="hydrated-switch" tabindex="-1" aria-hidden="true">`;
    document.body.append(target);

    const component = hydrate(Switch, {
      props: { id: "hydrated-switch" },
      target,
    });

    expect(target.querySelector('input[type="checkbox"]')?.id).toBe("hydrated-switch");
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
