import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import ToggleFixture from "./toggle.browser-fixture.svelte";
import Toggle from "./toggle.svelte";
import { toggleVariants } from "./toggle-variants.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Toggle browser contract", () => {
  test("supports bindable pressed state, callbacks, refs, and keyboard activation", async () => {
    render(ToggleFixture);
    const toggle = page.getByTestId("standalone-toggle");

    await expect.element(toggle).toHaveAttribute("aria-pressed", "false");
    await expect.element(page.getByTestId("standalone-state")).toHaveTextContent("false:BUTTON");

    await toggle.click();
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");
    await expect.element(toggle).toHaveAttribute("data-pressed");
    await expect.element(page.getByTestId("standalone-state")).toHaveTextContent("true:BUTTON");
    await expect.element(page.getByTestId("callback-values")).toHaveTextContent("true");

    document.querySelector<HTMLElement>('[data-testid="standalone-toggle"]')?.focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.keyboard("{Space}");
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true");
    await expect.element(page.getByTestId("callback-values")).toHaveTextContent("true,false,true");
  });

  test("keeps disabled, polymorphic, and declined-write behavior from Shards", async () => {
    render(ToggleFixture);

    const disabled = page.getByTestId("disabled-toggle");
    await expect.element(disabled).toBeDisabled();
    await expect.element(disabled).toHaveAttribute("data-disabled");
    await disabled.click({ force: true });
    await expect.element(page.getByTestId("disabled-changes")).toHaveTextContent("0");

    const polymorphic = page.getByTestId("polymorphic-toggle");
    await expect.element(polymorphic).toHaveAttribute("role", "button");
    await expect.element(polymorphic).toHaveAttribute("tabindex", "0");
    document.querySelector<HTMLElement>('[data-testid="polymorphic-toggle"]')?.focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(polymorphic).toHaveAttribute("aria-pressed", "true");

    const declined = page.getByTestId("declined-toggle");
    await declined.click();
    await expect.element(declined).toHaveAttribute("aria-pressed", "false");
    await expect.element(page.getByTestId("controlled-writes")).toHaveTextContent("1");
  });

  test("hydrates exact server-equivalent toggle markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<button type="button" tabindex="0" aria-pressed="false" data-slot="toggle" class="${toggleVariants()}"></button>`;
    document.body.append(target);

    const component = hydrate(Toggle, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector("button")?.getAttribute("aria-pressed")).toBe("false");
    await unmount(component);
    warning.mockRestore();
  });
});
