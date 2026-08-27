import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import CollapsibleFixture from "./collapsible.browser-fixture.svelte";
import CollapsibleHydrationFixture from "./collapsible.hydration-fixture.svelte";
import { collapsibleDelegatedSsrHtml } from "./collapsible.hydration-html.js";
import CollapsibleDefaultFixture from "./collapsible-default.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Collapsible browser contract", () => {
  test("supports pointer, callback, bindable state, disabled behavior, and mounted panels", async () => {
    render(CollapsibleFixture);
    const trigger = page.getByRole("button", { name: "Show recovery keys" });
    const panel = page.getByTestId("panel");

    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    await expect.element(panel).toHaveAttribute("hidden");
    await trigger.click();
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
    await expect.element(panel).not.toHaveAttribute("hidden");
    await expect.element(page.getByTestId("open-state")).toHaveTextContent("open");
    await expect.element(page.getByTestId("changes")).toHaveTextContent("true");

    const disabled = page.getByRole("button", { name: "Disabled recovery keys" });
    document
      .querySelector<HTMLButtonElement>('[data-slot="collapsible-trigger"][data-disabled]')
      ?.click();
    await expect.element(disabled).toHaveAttribute("aria-expanded", "false");

    await page.getByRole("button", { name: "Deferred recovery keys" }).click();
    await expect.element(page.getByTestId("deferred-open")).toHaveTextContent("true");
  });

  test("supports native Enter and Space activation", async () => {
    render(CollapsibleFixture);
    const element = Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => button.textContent === "Show recovery keys",
    );
    element?.focus();
    await userEvent.keyboard("{Enter}");
    expect(element?.getAttribute("aria-expanded")).toBe("true");
    await userEvent.keyboard(" ");
    expect(element?.getAttribute("aria-expanded")).toBe("false");
  });

  test("delegates one trigger element to Button while preserving owned state and callbacks", async () => {
    render(CollapsibleFixture);
    const trigger = page.getByTestId("delegated-trigger");

    expect(document.querySelectorAll('[data-testid="delegated-trigger"]')).toHaveLength(1);
    expect((await trigger.element()).tagName).toBe("BUTTON");
    await expect.element(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
    await expect.element(trigger).toHaveAttribute("data-delegate-state", "closed");
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    expect((await trigger.element()).className).toContain("border-transparent");
    expect((await trigger.element()).className).toContain("data-panel-open:[&_svg]:rotate-180");

    await trigger.click();
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
    await expect.element(trigger).toHaveAttribute("data-delegate-state", "open");
    await expect.element(trigger).toHaveAttribute("aria-controls");
    await expect.element(page.getByTestId("delegated-panel")).toBeInTheDocument();
    await expect.element(page.getByTestId("delegated-state")).toHaveTextContent("1:BUTTON");

    const disabled = page.getByTestId("delegated-disabled");
    await expect.element(disabled).not.toHaveAttribute("disabled");
    await expect.element(disabled).toHaveAttribute("aria-disabled", "true");
    await expect.element(disabled).toHaveAttribute("data-disabled");
    expect(disabled.element().getAttribute("tabindex")).toBe("0");
    disabled.element().focus();
    document.querySelector<HTMLButtonElement>('[data-testid="delegated-disabled"]')?.click();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect.element(disabled).toHaveAttribute("aria-expanded", "false");
    await expect.element(page.getByTestId("delegated-disabled-clicks")).toHaveTextContent("0");
  });

  test("tracks the mounted panel id and clears and restores aria-controls", async () => {
    render(CollapsibleFixture);
    const trigger = page.getByTestId("delegated-custom-id");

    await expect.element(trigger).toHaveAttribute("aria-controls", "custom-delegated-panel");
    await page.getByTestId("toggle-custom-panel").click();
    await expect.element(trigger).not.toHaveAttribute("aria-controls");
    expect(document.getElementById("custom-delegated-panel")).toBeNull();
    await page.getByTestId("toggle-custom-panel").click();
    await expect.element(trigger).toHaveAttribute("aria-controls", "custom-delegated-panel");
  });

  test("lets the consumer cancel delegated pointer and keyboard toggles", async () => {
    render(CollapsibleFixture);
    const trigger = page.getByTestId("delegated-cancelled");

    await trigger.click();
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    await expect
      .element(page.getByTestId("delegated-cancelled-state"))
      .toHaveTextContent("1:false");

    trigger.element().focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    await expect
      .element(page.getByTestId("delegated-cancelled-state"))
      .toHaveTextContent("3:false");
  });

  test("gives delegated Button native keyboard activation and a teardown-safe public ref", async () => {
    render(CollapsibleFixture);
    const trigger = page.getByTestId("delegated-trigger");

    trigger.element().focus();
    await userEvent.keyboard("{Enter}");
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard(" ");
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    await expect.element(page.getByTestId("delegated-state")).toHaveTextContent("2:BUTTON");

    await page.getByTestId("toggle-delegated").click();
    await expect.element(page.getByTestId("delegated-state")).toHaveTextContent("2:missing");
    expect(document.querySelector('[data-testid="delegated-trigger"]')).toBeNull();
  });

  test("preserves Shards starting/ending attributes, measured height, and exact COSS duration", async () => {
    render(CollapsibleFixture);
    await page.getByRole("button", { name: "Show recovery keys" }).click();
    const panel = document.querySelector<HTMLElement>('[data-testid="panel"]');
    expect(panel?.className).toContain("transition-[height]");
    expect(panel?.className).toContain("data-starting-style:h-0");
    expect(panel?.className).toContain("data-ending-style:h-0");
    expect(panel?.style.getPropertyValue("--collapsible-panel-height")).toBeTruthy();
    expect(panel?.className).toContain("duration-200");
    expect(panel?.className).not.toContain("motion-reduce");
  });

  test("hydrates genuine delegated SSR output and its provider boundary without mismatches", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = collapsibleDelegatedSsrHtml;
    document.body.append(target);
    const component = hydrate(CollapsibleHydrationFixture, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    await expect
      .element(page.getByTestId("hydration-delegated-trigger"))
      .toHaveAttribute("aria-controls", "hydration-delegated-panel");
    expect(target.querySelector('[data-hydration="collapsible-delegate"]')).toHaveAttribute(
      "data-open",
    );
    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });

  test("reads defaultOpen once and ignores later default prop changes", async () => {
    const view = render(CollapsibleDefaultFixture, { defaultOpen: false });
    const trigger = page.getByRole("button", { name: "Default collapsible" });

    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");
    await view.rerender({ defaultOpen: true });
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
    await view.rerender({ defaultOpen: false });
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
