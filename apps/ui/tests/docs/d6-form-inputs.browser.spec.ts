import { type Component, mount } from "svelte";
import { afterEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

const particleModules = import.meta.glob(
  [
    "../../registry/default/particles/p-field-*.svelte",
    "../../registry/default/particles/p-fieldset-*.svelte",
    "../../registry/default/particles/p-form-*.svelte",
    "../../registry/default/particles/p-group-*.svelte",
    "../../registry/default/particles/p-input-*.svelte",
    "../../registry/default/particles/p-input-group-*.svelte",
    "../../registry/default/particles/p-number-field-*.svelte",
    "../../registry/default/particles/p-otp-field-*.svelte",
    "../../registry/default/particles/p-textarea-*.svelte",
  ],
  { eager: true },
);

const particles = Object.entries(particleModules).sort(([left], [right]) =>
  left.localeCompare(right),
);

function component(id: string): Component {
  const entry = particles.find(([path]) => path.endsWith(`/${id}.svelte`));
  if (!entry) throw new Error(`Missing D6 browser particle ${id}`);
  return (entry[1] as { default: Component }).default;
}

function render(component: Component, options: { target?: Element } = {}) {
  return mount(component, { target: options.target ?? document.body });
}

afterEach(() => {
  document.documentElement.classList.remove("dark");
  document.body.innerHTML = "";
});

describe("D6 form and input browser parity", () => {
  test("mounts the exact 124-particle inventory in light, dark, and narrow containers", () => {
    expect(particles).toHaveLength(124);

    for (const dark of [false, true]) {
      document.documentElement.classList.toggle("dark", dark);
      for (const [path, module] of particles) {
        const target = document.createElement("div");
        target.style.width = "320px";
        document.body.append(target);
        render((module as { default: Component }).default, { target });
        expect(target.childElementCount, path).toBeGreaterThan(0);
        expect(target.querySelector("[data-slot]"), path).not.toBeNull();
        target.remove();
      }
    }
  });

  test("keeps password visibility and clear-button behavior exact", async () => {
    render(component("p-input-9"));
    const password = page.getByLabelText("Password with toggle visibility");
    await expect.element(password).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect.element(password).toHaveAttribute("type", "text");
    await expect.element(page.getByRole("button", { name: "Hide password" })).toBeInTheDocument();

    document.body.innerHTML = "";
    render(component("p-input-group-22"));
    const clearable = page.getByLabelText("Text input with clear button");
    await expect.element(clearable).toHaveValue("Clear me");
    await page.getByRole("button", { name: "Clear input" }).click();
    await expect.element(clearable).toHaveValue("");
    await expect.element(page.getByRole("button", { name: "Clear input" })).not.toBeInTheDocument();
  });

  test("supports number-field buttons, boundaries, and keyboard stepping", async () => {
    render(component("p-number-field-7"));
    const input = document.querySelector<HTMLInputElement>('[data-slot="number-field-input"]');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute("role", "spinbutton");
    expect(
      input?.getAttribute("aria-label") ?? input?.getAttribute("aria-labelledby"),
    ).toBeTruthy();
    expect(input).toHaveValue("5");
    await page.getByRole("button", { name: "Increase" }).click();
    expect(input).toHaveValue("6");
    input?.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(input).toHaveValue("5");
    await userEvent.keyboard("{Home}");
    expect(input).toHaveValue("0");
    await expect.element(page.getByRole("button", { name: "Decrease" })).toBeDisabled();
  });

  test("supports OTP typing, roving focus, validation, and masking", async () => {
    render(component("p-otp-field-7"));
    const slots = page.getByRole("textbox");
    await slots.nth(0).click();
    for (const digit of "654321") {
      await userEvent.keyboard(digit);
    }
    expect(
      Array.from(document.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]'))
        .map((input) => input.value)
        .join(""),
    ).toBe("654321");
    await expect.element(page.getByText("Code must be 123456.")).toBeInTheDocument();
    await expect.element(slots.nth(5)).toHaveFocus();
    await userEvent.keyboard("{Home}");
    await expect.element(slots.nth(0)).toHaveFocus();

    document.body.innerHTML = "";
    render(component("p-otp-field-10"));
    for (const input of document.querySelectorAll("input")) {
      expect(input).toHaveAttribute("type", "password");
    }
  });

  test("keeps labels, descriptions, native validation, and form names connected", async () => {
    render(component("p-field-1"));
    const name = document.querySelector<HTMLInputElement>('[data-slot="input"]');
    const label = document.querySelector<HTMLLabelElement>('[data-slot="field-label"]');
    const description = document.querySelector<HTMLElement>('[data-slot="field-description"]');
    expect(name).toBeInstanceOf(HTMLInputElement);
    expect(label).toBeInstanceOf(HTMLLabelElement);
    expect(description).toBeInstanceOf(HTMLElement);
    expect(
      label?.htmlFor === name?.id ||
        name
          ?.getAttribute("aria-labelledby")
          ?.split(/\s+/)
          .includes(label?.id ?? ""),
    ).toBe(true);
    await expect
      .element(name as HTMLInputElement)
      .toHaveAttribute("aria-describedby", description?.id ?? "");

    document.body.innerHTML = "";
    render(component("p-form-1"));
    const email = page.getByLabelText("Email");
    await page.getByRole("button", { name: "Submit" }).click();
    expect((email.element() as HTMLInputElement).validity.valueMissing).toBe(true);
    await email.fill("person@example.com");
    expect((email.element() as HTMLInputElement).validity.valid).toBe(true);
  });
});
