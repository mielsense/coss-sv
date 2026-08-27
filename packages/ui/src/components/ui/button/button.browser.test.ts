import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ButtonFixture from "./button.browser-fixture.svelte";
import Button from "./button.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Button browser contract", () => {
  test("supports native, disabled, loading, link, and polymorphic behavior with refs", async () => {
    render(ButtonFixture);
    const button = page.getByTestId("button");
    await expect.element(button).toHaveAttribute("type", "button");
    await expect.element(button).toHaveAttribute("data-slot", "button");
    await userEvent.click(button);
    await expect.element(page.getByTestId("button-state")).toHaveTextContent("1:false:BUTTON:A");

    const disabled = page.getByTestId("disabled");
    await expect.element(disabled).toBeDisabled();
    document.querySelector<HTMLButtonElement>('[data-testid="disabled"]')?.click();
    await expect.element(page.getByTestId("button-state")).toHaveTextContent("1:false:BUTTON:A");

    await userEvent.click(page.getByRole("button", { name: "Toggle loading" }));
    const loading = page.getByTestId("loading");
    await expect.element(loading).toHaveAttribute("data-loading", "");
    await expect.element(loading).toHaveAttribute("aria-disabled", "true");
    await expect.element(loading).toBeDisabled();
    await expect.element(loading.getByRole("status", { name: "Loading" })).toBeVisible();

    const link = page.getByTestId("link");
    await expect.element(link).toHaveAttribute("href", "#button-link");
    await expect.element(link).not.toHaveAttribute("role", "button");
    await expect.element(link).toHaveAccessibleName("Link");

    const polymorphic = page.getByTestId("polymorphic");
    await expect.element(polymorphic).toHaveAttribute("role", "button");
    document.querySelector<HTMLElement>('[data-testid="polymorphic"]')?.focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(page.getByTestId("button-state")).toHaveTextContent("2:true:BUTTON:A");

    const disabledPolymorphic = page.getByTestId("disabled-polymorphic");
    await expect.element(disabledPolymorphic).toHaveAttribute("aria-disabled", "true");
    await expect.element(disabledPolymorphic).toHaveAttribute("data-disabled", "");
    await expect.element(disabledPolymorphic).toHaveAttribute("tabindex", "-1");
    await expect.element(disabledPolymorphic).not.toHaveAttribute("type");

    const disabledPolymorphicElement = document.querySelector<HTMLElement>(
      '[data-testid="disabled-polymorphic"]',
    );
    disabledPolymorphicElement?.click();
    disabledPolymorphicElement?.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Space}");
    await expect.element(page.getByTestId("button-state")).toHaveTextContent("2:true:BUTTON:A");
  });

  test("hydrates the native button without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<button type="button" data-slot="button" id="hydrated-button"></button>`;
    document.body.append(target);

    const component = hydrate(Button, { props: { id: "hydrated-button" }, target });
    expect(target.querySelector("button")?.id).toBe("hydrated-button");
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
