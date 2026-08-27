import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import RadioGroupFixture from "./radio-group.browser-fixture.svelte";
import RadioGroupRoot from "./radio-group-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Radio Group browser contract", () => {
  test("supports labels, uncontrolled defaults, callbacks, bindings, forms, required state, and refs", async () => {
    render(RadioGroupFixture);

    const group = page.getByRole("radiogroup", { name: "Framework" });
    const vite = page.getByRole("radio", { name: "Vite" });
    const svelte = page.getByRole("radio", { name: "Svelte" });

    await expect.element(group).toHaveAttribute("data-slot", "radio-group");
    await expect.element(vite).toHaveAttribute("aria-checked", "true");
    document.querySelector<HTMLElement>('[data-testid="framework-svelte"]')?.click();
    await expect.element(vite).toHaveAttribute("aria-checked", "false");
    await expect.element(svelte).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("framework-changes")).toHaveTextContent("svelte");
    await page.getByTestId("change-framework-default").click();
    await expect.element(svelte).toHaveAttribute("aria-checked", "true");

    const email = page.getByRole("radio", { name: "Email", exact: true });
    const sms = page.getByRole("radio", { name: "SMS", exact: true });
    await expect.element(email).toHaveAttribute("aria-checked", "false");
    await expect.element(sms).toHaveAttribute("aria-checked", "false");
    document.querySelector<HTMLElement>('[data-testid="contact-sms"]')?.click();
    await expect.element(page.getByTestId("selected-value")).toHaveTextContent("sms");
    await expect
      .element(page.getByRole("radiogroup", { name: "Contact method", exact: true }))
      .toHaveAttribute("aria-required", "true");
    await page.getByRole("button", { name: "Submit" }).click();
    await expect.element(page.getByTestId("submitted-value")).toHaveTextContent("sms");
    await expect.element(page.getByTestId("refs")).toHaveTextContent("DIV:SPAN");
  });

  test("keeps roving focus, arrow selection, disabled skipping, wrapping, Space, and Enter semantics", async () => {
    render(RadioGroupFixture);

    const next = page.getByRole("radio", { name: "Next.js" });
    const vite = page.getByRole("radio", { name: "Vite" });
    const astro = page.getByRole("radio", { name: "Astro" });
    const svelte = page.getByRole("radio", { name: "Svelte" });

    await expect.element(vite).toHaveAttribute("tabindex", "0");
    await expect.element(next).toHaveAttribute("tabindex", "-1");
    await expect.element(astro).toHaveAttribute("aria-disabled", "true");

    document.querySelector<HTMLElement>('[data-testid="framework-vite"]')?.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(svelte).toHaveFocus();
    await expect.element(svelte).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(next).toHaveFocus();
    await expect.element(next).toHaveAttribute("aria-checked", "true");

    document.querySelector<HTMLElement>('[data-testid="contact-email"]')?.focus();
    await userEvent.keyboard("{Space}");
    await expect
      .element(page.getByRole("radio", { name: "Email", exact: true }))
      .toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Enter}");
    await expect
      .element(page.getByRole("radio", { name: "Email", exact: true }))
      .toHaveAttribute("aria-checked", "true");
  });

  test("honors group disabled, read-only, and cancelled consumer clicks", async () => {
    render(RadioGroupFixture);

    const disabledGroup = page.getByRole("radiogroup", { name: "Disabled group" });
    const disabledTwo = page.getByRole("radio", { name: "Disabled two" });
    await expect.element(disabledGroup).toHaveAttribute("aria-disabled", "true");
    await expect.element(disabledTwo).toHaveAttribute("aria-disabled", "true");
    document.querySelector<HTMLElement>('[aria-label="Disabled two"]')?.click();
    await expect.element(disabledTwo).toHaveAttribute("aria-checked", "false");

    const readOnlyGroup = page.getByRole("radiogroup", { name: "Read only group" });
    const readOnlyTwo = page.getByRole("radio", { name: "Read only two" });
    await expect.element(readOnlyGroup).toHaveAttribute("aria-readonly", "true");
    document.querySelector<HTMLElement>('[aria-label="Read only two"]')?.click();
    await expect.element(readOnlyTwo).toHaveAttribute("aria-checked", "false");

    const prevented = page.getByRole("radio", { name: "Prevented two" });
    document.querySelector<HTMLElement>('[aria-label="Prevented two"]')?.click();
    await expect.element(prevented).toHaveAttribute("aria-checked", "false");
    await expect.element(page.getByTestId("prevented-clicks")).toHaveTextContent("1");
  });

  test("restores visible and native form state when a function binding rejects a value", async () => {
    render(RadioGroupFixture);

    const email = page.getByRole("radio", { name: "Rejected email", exact: true });
    const sms = page.getByRole("radio", { name: "Rejected SMS", exact: true });
    const form = document.querySelector<HTMLFormElement>('[data-testid="rejected-form"]');
    const inputs = Array.from(
      form?.querySelectorAll<HTMLInputElement>('input[name="rejected-contact"]') ?? [],
    );

    await expect.element(email).toHaveAttribute("aria-checked", "true");
    await expect.element(sms).toHaveAttribute("aria-checked", "false");
    expect(inputs.map((input) => input.checked)).toEqual([true, false]);
    expect(new FormData(form ?? undefined).get("rejected-contact")).toBe("email");

    document.querySelector<HTMLElement>('[data-testid="rejected-sms"]')?.click();

    await expect.element(page.getByTestId("rejected-writes")).toHaveTextContent("1");
    await expect.element(page.getByTestId("rejected-value")).toHaveTextContent("email");
    await expect.element(email).toHaveAttribute("aria-checked", "true");
    await expect.element(sms).toHaveAttribute("aria-checked", "false");
    expect(inputs.map((input) => input.checked)).toEqual([true, false]);
    expect(new FormData(form ?? undefined).get("rejected-contact")).toBe("email");
  });

  test("hydrates the exact empty server-equivalent root without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<div role="radiogroup" data-slot="radio-group" class="flex flex-col gap-3"></div>';
    document.body.append(target);

    const component = hydrate(RadioGroupRoot, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector('[role="radiogroup"]')?.getAttribute("data-slot")).toBe(
      "radio-group",
    );
    await unmount(component);
    warning.mockRestore();
  });
});
